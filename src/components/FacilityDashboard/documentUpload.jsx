import React, { useState, useEffect } from "react";
import { Button, Upload, Card, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import StepProgress from "./stepProgress";
import { useAuth } from "../hook/auth";
import { FacilityDocs, GetFacilityDocs } from "../../services/facilityDocs";

const { Dragger } = Upload;

export const DocumentUpload = () => {
  const { facilityType, authData } = useAuth();

  const [fileList, setFileList] = useState({
    facilityPhotos: [],
    specialistSchedules: [],
    priceList: [],
    facilityDetails: [],
    licenseRegistration: [],
  });

  const [additionalInfo, setAdditionalInfo] = useState("");
  const [initialFiles, setInitialFiles] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch existing documents on mount
  useEffect(() => {
    const fetchFacilityDocs = async () => {
      try {
        const response = await GetFacilityDocs();
        if (response) {
          setInitialFiles(response);
          setAdditionalInfo(response.additionalInfo || "");
          setFileList({
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
          });
        }
      } catch (error) {
        console.error("Error fetching facility documents:", error);

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
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("facilityId", authData?._id);
      formData.append("facilityType", facilityType);
      formData.append("additionalInfo", additionalInfo);

      // Append Facility Photos
      fileList.facilityPhotos.forEach((file) => {
        if (!initialFiles?.facilityPhotos?.includes(file.url || file.name)) {
          formData.append("facilityPhotos", file.originFileObj || new File([], file.name));
        }
      });

      // Append Specialist Schedules (if Hospital)
      if (facilityType === "Hospital") {
        fileList.specialistSchedules.forEach((file) => {
          if (!initialFiles?.specialistScheduleFiles?.includes(file.url || file.name)) {
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
        const existingFile = initialFiles?.[key];
        if (
          fileList[field]?.[0]?.originFileObj &&
          (!existingFile || existingFile !== fileList[field][0].url)
        ) {
          formData.append(field, fileList[field][0].originFileObj);
        }
      });

      await FacilityDocs(formData, initialFiles !== null);
      message.success("Facility documents uploaded successfully!");
      setSaving(false);

    } catch (error) {
      setSaving(false);
      console.error("Error uploading:", error);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-full px-4 shadow-md rounded-[15px] bg-white border">
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
        <div className="p-6 space-y-6">
          {/* Facility Photos */}
          <div className="space-y-2">
            <h1 className="text-sm font-bold text-gray-900 mb-2">Upload Facility Photos</h1>
            <Dragger {...uploadProps("facilityPhotos")}>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">Drag and Drop files here or Click to Upload</p>
              <p className="ant-upload-hint text-gray-500">Accepts .jpg, .png, .pdf (max 100MB)</p>
            </Dragger>

            {fileList.facilityPhotos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                {fileList.facilityPhotos.map((file) => (
                  <div
                    key={file.uid}
                    className="flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                  >
                    <span className="text-sm text-gray-800 truncate">{file.name}</span>
                    <DeleteOutlined
                      onClick={() => handleDelete(file, "facilityPhotos")}
                      className="text-red-500 cursor-pointer text-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Files */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { field: "facilityDetails", label: "Upload File with Facility Details Document" },
              { field: "licenseRegistration", label: "Upload File with License and Registration Certificate" },
              ...(facilityType === "Hospital"
                ? [{ field: "specialistSchedules", label: "Upload File With Specialist Schedules" }]
                : []),
              { field: "priceList", label: "Upload File with Price List" },
            ].map(({ field, label }) => (
              <div key={field} className="space-y-2 w-full">
                <h1 className="text-sm font-bold text-gray-900 mb-1">{label}</h1>
                <Upload {...uploadProps(field)}>
                  <Button icon={<UploadOutlined />} className="w-full h-10">
                    {fileList[field]?.[0]?.name || "Select File"}
                  </Button>
                </Upload>
                <p className="text-xs text-gray-500">Accepts .doc, .pdf, .xls</p>
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
        {/* <Button className="h-12 px-6 bg-gray-200 text-gray-700 rounded-md">Back</Button> */}
        <Button className="h-12 px-6 bg-cyan-500 text-white rounded-md" onClick={handleSubmit}>
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