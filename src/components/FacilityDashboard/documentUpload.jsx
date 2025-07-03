import React, { useState, useEffect, useMemo } from "react";
import { Button, Upload, Card, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import StepProgress from "./stepProgress";
import { useAuth } from "../hook/auth";
import { FacilityDocs, GetFacilityDocs } from "../../services/facilityDocs";

const { Dragger } = Upload;

export const DocumentUpload = () => {
  const { facilityType, authData, fetchAuthData } = useAuth();

  const [fileList, setFileList] = useState({
    facilityPhotos: [],
    specialistSchedules: [],
    priceList: [],
    facilityDetails: [],
    licenseRegistration: [],
  });

  const [additionalInfo, setAdditionalInfo] = useState("");
  const [initialFiles, setInitialFiles] = useState(null);
  const [initialAdditionalInfo, setInitialAdditionalInfo] = useState("");
  const [saving, setSaving] = useState(false);

  // Deep comparison function for file lists
  const areFileListsEqual = (current, initial) => {
    if (!initial) {
      return (
        current.facilityPhotos.length === 0 &&
        current.specialistSchedules.length === 0 &&
        current.priceList.length === 0 &&
        current.facilityDetails.length === 0 &&
        current.licenseRegistration.length === 0
      );
    }
    const compareField = (currentField, initialField) => {
      if (currentField.length !== initialField.length) return false;
      const currentUids = currentField.map((file) => file.uid).sort();
      const initialUids = initialField.map((file) => file.uid).sort();
      return currentUids.every((uid, index) => uid === initialUids[index]);
    };
    return (
      compareField(current.facilityPhotos, initial.facilityPhotos || []) &&
      compareField(current.specialistSchedules, initial.specialistSchedules || []) &&
      compareField(current.priceList, initial.priceList || []) &&
      compareField(current.facilityDetails, initial.facilityDetails || []) &&
      compareField(current.licenseRegistration, initial.licenseRegistration || [])
    );
  };

  // Memoized hasChanges
  const hasChanges = useMemo(() => {
    if (initialFiles === null && !additionalInfo && areFileListsEqual(fileList, {})) {
      return false; // No changes if no initial data, no files, and no additional info
    }
    return (
      !areFileListsEqual(fileList, initialFiles) ||
      additionalInfo !== initialAdditionalInfo
    );
  }, [fileList, additionalInfo, initialFiles, initialAdditionalInfo]);

  // Fetch existing documents on mount
  useEffect(() => {
    const fetchFacilityDocs = async () => {
      try {
        const response = await GetFacilityDocs();
        if (response) {
          const newFileList = {
            facilityPhotos: response.facilityPhotos?.map((path) => ({
              uid: path,
              name: path.split('/').pop(),
              status: 'done',
              url: path,
            })) || [],
            specialistSchedules: response.specialistScheduleFiles?.map((path) => ({
              uid: path,
              name: path.split('/').pop(),
              status: 'done',
              url: path,
            })) || [],
            priceList: response.priceListFile
              ? [{ uid: response.priceListFile, name: response.priceListFile.split('/').pop(), status: 'done', url: response.priceListFile }]
              : [],
            facilityDetails: response.facilityDetailsDoc
              ? [{ uid: response.facilityDetailsDoc, name: response.facilityDetailsDoc.split('/').pop(), status: 'done', url: response.facilityDetailsDoc }]
              : [],
            licenseRegistration: response.licenseRegistrationFile
              ? [{ uid: response.licenseRegistrationFile, name: response.licenseRegistrationFile.split('/').pop(), status: 'done', url: response.licenseRegistrationFile }]
              : [],
          };
          setFileList(newFileList);
          setInitialFiles(newFileList);
          setAdditionalInfo(response.additionalInfo || "");
          setInitialAdditionalInfo(response.additionalInfo || "");
        } else {
          setInitialFiles({
            facilityPhotos: [],
            specialistSchedules: [],
            priceList: [],
            facilityDetails: [],
            licenseRegistration: [],
          });
          setInitialAdditionalInfo("");
        }
      } catch (error) {
        console.error("Error fetching facility documents:", error);
        setInitialFiles({
          facilityPhotos: [],
          specialistSchedules: [],
          priceList: [],
          facilityDetails: [],
          licenseRegistration: [],
        });
        setInitialAdditionalInfo("");
      }
    };
    fetchFacilityDocs();
  }, [authData?._id]);

  const handleUpload = (info, field) => {
    const newFileList = [...info.fileList].map((file) => {
      if (file.status === "done") {
        return { ...file, url: file.response?.url || file.url };
      }
      return file;
    });
    setFileList((prev) => ({ ...prev, [field]: newFileList }));
    return newFileList;
  };

  const handleDelete = (fileToRemove, field) => {
    setFileList((prev) => ({
      ...prev,
      [field]: prev[field].filter((file) => file.uid !== fileToRemove.uid),
    }));
    message.success(`${fileToRemove.name} removed`);
  };

  const uploadProps = (field) => ({
    name: field,
    onChange: (info) => handleUpload(info, field),
    multiple: field === "facilityPhotos" || field === "specialistSchedules",
    beforeUpload: () => false,
    fileList: fileList[field],
    accept: field === "facilityPhotos" ? ".jpg,.png,.pdf" : ".doc,.pdf,.xls",
    onRemove: (file) => handleDelete(file, field),
  });

  const handleSubmit = async () => {
    if (!hasChanges) {
      message.info("No changes to save.");
      return;
    }
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("facilityId", authData?._id);
      formData.append("facilityType", facilityType);
      formData.append("additionalInfo", additionalInfo);

      // Append Facility Photos
      fileList.facilityPhotos.forEach((file) => {
        if (!initialFiles?.facilityPhotos?.find((f) => f.url === (file.url || file.name))) {
          formData.append("facilityPhotos", file.originFileObj || new File([], file.name));
        }
      });

      // Append Specialist Schedules (if Hospital)
      if (facilityType === "Hospital") {
        fileList.specialistSchedules.forEach((file) => {
          if (!initialFiles?.specialistSchedules?.find((f) => f.url === (file.url || file.name))) {
            formData.append("specialistSchedules", file.originFileObj || new File([], file.name));
          }
        });
      }

      // Append single documents with correct standardized names
      [
        { field: "priceList", key: "priceListFile" },
        { field: "facilityDetails", key: "facilityDetailsDoc" },
        { field: "licenseRegistration", key: "licenseRegistrationFile" },
      ].forEach(({ field, key }) => {
        const existingFile = initialFiles?.[key]?.[0]?.url;
        if (
          fileList[field]?.[0]?.originFileObj &&
          (!existingFile || existingFile !== fileList[field][0].url)
        ) {
          formData.append(field, fileList[field][0].originFileObj);
        }
      });

      await FacilityDocs(formData, initialFiles !== null);
      message.success("Facility documents uploaded successfully!");
      setInitialFiles(JSON.parse(JSON.stringify(fileList)));
      setInitialAdditionalInfo(additionalInfo);
      await fetchAuthData();
      setSaving(false);
    } catch (error) {
      setSaving(false);
      console.error("Error uploading:", error);
      message.error("Failed to upload documents. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-full px-4 shadow-md rounded-[15px] bg-white border ">
      <StepProgress currentStep={authData?.onBoardingStep} />

      <div className="p-6 h-24 flex flex-col gap-2">
        <h2 className="text-[30px] font-semibold text-gray-900 leading-[36px] tracking-[0.5%]">
          Document Upload
        </h2>
        <p className="text-base font-medium text-gray-600 leading-6">
          Upload necessary documents for facility verification.
        </p>
      </div>
      <Card className="border-none shadow-none">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Facility Photos */}
          <div className="space-y-2">
            <h1 className="text-sm font-bold text-gray-900 mb-2">Upload Facility Photos</h1>
            <Dragger {...uploadProps("facilityPhotos")}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Drag and Drop files here or Click to Upload</p>
              <p className="ant-upload-hint text-gray-500">Accepts .jpg, .png, .pdf (max 100MB)</p>
            </Dragger>
          </div>

          {/* Other Files */}
          <div className="flex flex-wrap gap-6">
            {[
              { field: "facilityDetails", label: "Upload Documents with Details about your Facility" },
              { field: "licenseRegistration", label: "License and Registration Certificates" },
              ...(facilityType === "Hospital"
                ? [{ field: "specialistSchedules", label: "Upload File With Specialist Schedules" }]
                : []),
              { field: "priceList", label: "Upload Price List (NGN)" },
            ].map(({ field, label }) => (
              <div
                key={field}
                className="w-full md:basis-[48%] lg:basis-[47%] flex-grow space-y-2"
              >
                <h1 className="text-sm font-semibold text-gray-900">{label}</h1>
                <Upload {...uploadProps(field)} className="w-full">
                  <Button
                    icon={<UploadOutlined className="ml-auto text-gray-500 text-[20px]" />}
                    className="w-full h-11 py-7 bg-gray-50 border-dashed border-gray-300 text-gray-700 rounded-md text-sm flex items-center justify-between px-4 hover:border-cyan-400 hover:shadow-sm"
                  >
                    <p className="text-[15px] font-['Inter'] font-medium leading-[100%] tracking-[0.5px] text-[#889096] truncate">
                      {fileList[field]?.[0]?.name || "Accepts DOC, PDF, XLS"}
                    </p>
                  </Button>
                </Upload>
              </div>
            ))}
          </div>


          {/* Additional Info */}
          <div className="space-y-2">
            <h1 className="text-sm font-bold text-gray-900 mb-2">Additional Information</h1>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-md p-2 text-sm"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Enter any additional information"
            />
          </div>
        </div>
      </Card>




      <div className="flex justify-end p-4">
        <Button
          className="h-12 px-6 bg-cyan-500 text-white rounded-md bg-primarySold"
          onClick={handleSubmit}
          disabled={saving || !hasChanges}
        >
          {saving ? (
            <>
              <span className="loader mr-2" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
};