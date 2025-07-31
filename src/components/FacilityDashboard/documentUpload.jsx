import React, { useState, useEffect, useMemo } from "react";
import { Button, Upload, Card, message, Tag, Tooltip } from "antd";
import { UploadOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import StepProgress from "./stepProgress";
import { useAuth } from "../hook/auth";
import { FacilityDocs, GetFacilityDocs } from "../../services/facilityDocs";
import { useNavigate } from "react-router-dom";
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

  const [update, setUpdate] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [initialFiles, setInitialFiles] = useState(null);
  const [initialAdditionalInfo, setInitialAdditionalInfo] = useState("");
  const [saving, setSaving] = useState(false);
  const [documentVerification, setDocumentVerification] = useState({});
  // Track deleted files
  const [deletedFiles, setDeletedFiles] = useState({
    facilityPhotos: [],
    specialistSchedules: [],
    priceList: [],
    facilityDetails: [],
    licenseRegistration: [],
  });
  const navigate = useNavigate();

  // Get verification status for a file
  const getFileVerificationStatus = (field, filePath) => {
    const fieldKey = field === 'specialistSchedules' ? 'specialistScheduleFiles' :
      field === 'priceList' ? 'priceListFiles' :
        field === 'facilityDetails' ? 'facilityDetailsFiles' :
          field === 'licenseRegistration' ? 'licenseRegistrationFiles' :
            field;

    const verification = documentVerification[fieldKey];
    if (!verification?.files) return { status: 'pending', notes: '' };

    const fileVerification = verification.files.find(f => f.filePath === filePath);
    return fileVerification || { status: 'pending', notes: '' };
  };

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'verified':
        return { color: 'green', icon: <CheckCircleOutlined />, text: 'Verified' };
      case 'rejected':
        return { color: 'red', icon: <CloseCircleOutlined />, text: 'Rejected' };
      case 'pending':
        return { color: 'orange', icon: <ClockCircleOutlined />, text: 'Pending' };
      default:
        return { color: 'default', icon: <ClockCircleOutlined />, text: 'Pending' };
    }
  };

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

  // Check if there are any deleted files
  const hasDeletedFiles = useMemo(() => {
    return Object.values(deletedFiles).some(arr => arr.length > 0);
  }, [deletedFiles]);

  // Memoized hasChanges - now includes deleted files check
  const hasChanges = useMemo(() => {
    if (initialFiles === null && !additionalInfo && areFileListsEqual(fileList, {})) {
      return false;
    }
    return (
      !areFileListsEqual(fileList, initialFiles) ||
      additionalInfo !== initialAdditionalInfo ||
      hasDeletedFiles
    );
  }, [fileList, additionalInfo, initialFiles, initialAdditionalInfo, hasDeletedFiles]);

  // Fetch existing documents on mount
  useEffect(() => {
    const fetchFacilityDocs = async () => {
      try {
        const response = await GetFacilityDocs();
        console.log(response, "response here");
        if (response) {
          setUpdate(true);
          setDocumentVerification(response.documentVerification || {});
        }
        if (response) {
          const newFileList = {
            facilityPhotos: response.facilityPhotos?.map((path) => ({
              uid: path,
              name: path.split('/').pop(),
              status: 'done',
              url: path,
              isExisting: true,
            })) || [],
            specialistSchedules: response.specialistScheduleFiles?.map((path) => ({
              uid: path,
              name: path.split('/').pop(),
              status: 'done',
              url: path,
              isExisting: true,
            })) || [],
            priceList: response.priceListFiles?.map((path) => ({
              uid: path,
              name: path.split('/').pop(),
              status: 'done',
              url: path,
              isExisting: true,
            })) || (response.priceListFile
              ? [{ uid: response.priceListFile, name: response.priceListFile.split('/').pop(), status: 'done', url: response.priceListFile, isExisting: true }]
              : []),
            facilityDetails: response.facilityDetailsFiles?.map((path) => ({
              uid: path,
              name: path.split('/').pop(),
              status: 'done',
              url: path,
              isExisting: true,
            })) || (response.facilityDetailsDoc
              ? [{ uid: response.facilityDetailsDoc, name: response.facilityDetailsDoc.split('/').pop(), status: 'done', url: response.facilityDetailsDoc, isExisting: true }]
              : []),
            licenseRegistration: response.licenseRegistrationFiles?.map((path) => ({
              uid: path,
              name: path.split('/').pop(),
              status: 'done',
              url: path,
              isExisting: true,
            })) || (response.licenseRegistrationFile
              ? [{ uid: response.licenseRegistrationFile, name: response.licenseRegistrationFile.split('/').pop(), status: 'done', url: response.licenseRegistrationFile, isExisting: true }]
              : []),
          };
          setFileList(newFileList);
          setInitialFiles(JSON.parse(JSON.stringify(newFileList)));
          setAdditionalInfo(response.additionalInfo || "");
          setInitialAdditionalInfo(response.additionalInfo || "");
        } else {
          const emptyFileList = {
            facilityPhotos: [],
            specialistSchedules: [],
            priceList: [],
            facilityDetails: [],
            licenseRegistration: [],
          };
          setInitialFiles(emptyFileList);
          setInitialAdditionalInfo("");
        }
      } catch (error) {
        console.error("Error fetching facility documents:", error);
        const emptyFileList = {
          facilityPhotos: [],
          specialistSchedules: [],
          priceList: [],
          facilityDetails: [],
          licenseRegistration: [],
        };
        setInitialFiles(emptyFileList);
        setInitialAdditionalInfo("");
      }
    };
    fetchFacilityDocs();
  }, [authData?._id]);

  const handleUpload = (info, field) => {
    const newFileList = [...info.fileList].map((file) => {
      if (file.status === "done") {
        return { ...file, url: file.response?.url || file.url, isExisting: false };
      }
      return { ...file, isExisting: false };
    });
    setFileList((prev) => ({ ...prev, [field]: newFileList }));
    return newFileList;
  };

  const uploadProps = (field) => ({
    name: field,
    onChange: (info) => handleUpload(info, field),
    multiple: true,
    beforeUpload: () => false,
    fileList: fileList[field],
    accept: field === "facilityPhotos"
      ? ".jpg,.jpeg,.png,.pdf"
      : ".doc,.docx,.pdf,.xls,.xlsx,.txt",
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

      // Send current file state as JSON arrays with original field names
      const getCurrentFileUrls = (field) => {
        return fileList[field]
          .filter(file => file.isExisting) // Only existing files that weren't deleted
          .map(file => file.uid); // file.uid contains the file path for existing files
      };

      formData.append("facilityPhotos", JSON.stringify(getCurrentFileUrls("facilityPhotos")));
      formData.append("facilityDetails", JSON.stringify(getCurrentFileUrls("facilityDetails")));
      formData.append("priceList", JSON.stringify(getCurrentFileUrls("priceList")));
      formData.append("licenseRegistration", JSON.stringify(getCurrentFileUrls("licenseRegistration")));
      formData.append("specialistSchedules", JSON.stringify(getCurrentFileUrls("specialistSchedules")));

      // Helper function to append files
      const appendFiles = (frontendField, backendFieldName) => {
        console.log(`Processing ${frontendField} -> ${backendFieldName}`);
        
        // Append new files only (files with originFileObj are new uploads)
        const newFiles = fileList[frontendField].filter(file => file.originFileObj);
        newFiles.forEach((file) => {
          formData.append(backendFieldName, file.originFileObj);
          console.log(`Added new file: ${file.name}`);
        });
      };

      // Append new files only - let backend handle existing files by removing deleted ones
      appendFiles("facilityPhotos", "facilityPhotos");
      appendFiles("facilityDetails", "facilityDetails");
      appendFiles("priceList", "priceList");
      appendFiles("licenseRegistration", "licenseRegistration");

      if (facilityType === "Hospital") {
        appendFiles("specialistSchedules", "specialistSchedules");
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await FacilityDocs(formData, update);
      message.success("Facility documents updated successfully!");
      
      // Update verification status if returned
      if (response?.data?.documentVerification) {
        setDocumentVerification(response.data.documentVerification);
      }
      
      // Reset file list to match server response
      const updatedFileList = {
        facilityPhotos: response?.data?.facilityPhotos?.map((path) => ({
          uid: path,
          name: path.split('/').pop(),
          status: 'done',
          url: path,
          isExisting: true,
        })) || [],
        facilityDetails: response?.data?.facilityDetailsFiles?.map((path) => ({
          uid: path,
          name: path.split('/').pop(),
          status: 'done',
          url: path,
          isExisting: true,
        })) || [],
        priceList: response?.data?.priceListFiles?.map((path) => ({
          uid: path,
          name: path.split('/').pop(),
          status: 'done',
          url: path,
          isExisting: true,
        })) || [],
        licenseRegistration: response?.data?.licenseRegistrationFiles?.map((path) => ({
          uid: path,
          name: path.split('/').pop(),
          status: 'done',
          url: path,
          isExisting: true,
        })) || [],
        specialistSchedules: response?.data?.specialistScheduleFiles?.map((path) => ({
          uid: path,
          name: path.split('/').pop(),
          status: 'done',
          url: path,
          isExisting: true,
        })) || []
      };

      setFileList(updatedFileList);
      setInitialFiles(JSON.parse(JSON.stringify(updatedFileList)));
      setInitialAdditionalInfo(additionalInfo);
      
      // Reset deleted files tracking
      setDeletedFiles({
        facilityPhotos: [],
        specialistSchedules: [],
        priceList: [],
        facilityDetails: [],
        licenseRegistration: [],
      });
      
      await fetchAuthData();
      setSaving(false);
    } catch (error) {
      setSaving(false);
      console.error("Error uploading:", error);
      message.error("Failed to upload documents. Please try again.");
    }
  };

  // Keep the existing handleDelete function as is
  const handleDelete = (fileToRemove, field) => {
    console.log(`Deleting file: ${fileToRemove.name} from ${field}, isExisting: ${fileToRemove.isExisting}`);

    // If it's an existing file, add it to deleted files list
    if (fileToRemove.isExisting) {
      setDeletedFiles((prev) => {
        const updated = {
          ...prev,
          [field]: [...prev[field], fileToRemove.uid],
        };
        console.log(`Updated deleted files for ${field}:`, updated[field]);
        return updated;
      });
    }

    // Remove from current file list
    setFileList((prev) => ({
      ...prev,
      [field]: prev[field].filter((file) => file.uid !== fileToRemove.uid),
    }));

    message.success(`${fileToRemove.name} removed`);
  };

  return (
    <div className="flex flex-col w-full max-w-full px-2 sm:px-4 shadow-md rounded-[15px] bg-white border">
      <StepProgress currentStep={authData?.onBoardingStep} />

      {/* Header Section - Responsive */}
      <div className="p-3 sm:p-6 flex flex-col gap-2">
        <h2 className="text-xl sm:text-2xl lg:text-[30px] font-semibold text-gray-900 leading-tight lg:leading-[36px] tracking-[0.5%]">
          Document Upload
        </h2>
        <p className="text-sm sm:text-base font-medium text-gray-600 leading-5 sm:leading-6">
          Upload necessary documents for facility verification.
        </p>
      </div>

      <Card className="border-none shadow-none">
        <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {/* Facility Photos - Full Width Drag & Drop */}
          <div className="space-y-2">
            <h1 className="text-sm font-bold text-gray-900 mb-2">Upload Facility Photos</h1>
            <Dragger 
              {...uploadProps("facilityPhotos")}
              className="!bg-gray-50 hover:!bg-gray-100 transition-colors"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined className="text-2xl sm:text-3xl text-gray-400" />
              </p>
              <p className="ant-upload-text text-sm sm:text-base font-medium">
                Drag and Drop files here or Click to Upload
              </p>
              <p className="ant-upload-hint text-xs sm:text-sm text-gray-500 px-2">
                Accepts .jpg, .png, .pdf (max 100MB)
              </p>
            </Dragger>
          </div>

          {/* Other Document Upload Fields - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { field: "facilityDetails", label: "Upload Documents with Details about your Facility" },
              { field: "licenseRegistration", label: "License and Registration Certificates" },
              ...(facilityType === "Hospital"
                ? [{ field: "specialistSchedules", label: "Upload File With Specialist Schedules" }]
                : []),
              { field: "priceList", label: "Upload Price List (NGN)" },
            ].map(({ field, label }) => (
              <div key={field} className="space-y-2">
                <h1 className="text-sm font-semibold text-gray-900 break-words leading-tight">
                  {label}
                </h1>

                {/* Display current files if any - Responsive */}
                {fileList[field]?.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {fileList[field].map((file, index) => {
                      const verification = getFileVerificationStatus(field, file.uid);
                      const statusDisplay = getStatusDisplay(verification.status);

                      return (
                        <div 
                          key={file.uid} 
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-2 sm:p-3 rounded text-xs border gap-2 sm:gap-0"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <span className="truncate text-gray-700 font-medium text-xs sm:text-sm">
                                {file.name}
                              </span>
                              {file.isExisting && (
                                <span className="text-blue-500 text-xs self-start sm:self-auto">
                                  (existing)
                                </span>
                              )}
                            </div>

                            {verification.status === 'rejected' && verification.notes && (
                              <div className="mt-1 text-red-600 text-xs bg-red-50 p-2 rounded break-words">
                                <strong>Rejection Notes:</strong> {verification.notes}
                              </div>
                            )}
                          </div>

                          <Button
                            size="small"
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(file, field)}
                            className="text-red-500 hover:text-red-700 self-start sm:self-auto sm:ml-2 !min-w-0 !w-auto"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upload Button - Responsive */}
                <Upload {...uploadProps(field)} className="w-full">
                  <Button
                    icon={<UploadOutlined className="text-gray-500 text-lg sm:text-[20px]" />}
                    className="w-full h-10 sm:h-11 py-2 sm:py-7 bg-gray-50 border-dashed border-gray-300 text-gray-700 rounded-md text-xs sm:text-sm flex items-center justify-between px-3 sm:px-4 hover:border-cyan-400 hover:shadow-sm"
                  >
                    <p className="text-xs sm:text-[15px] font-['Inter'] font-medium leading-[100%] tracking-[0.5px] text-[#889096] truncate">
                      {fileList[field]?.length > 0
                        ? `${fileList[field].length} file(s) selected`
                        : "Accepts DOC, DOCX, PDF, XLS, XLSX"
                      }
                    </p>
                  </Button>
                </Upload>
              </div>
            ))}
          </div>

          {/* Additional Info - Responsive */}
          <div className="space-y-2">
            <h1 className="text-sm font-bold text-gray-900 mb-2">Additional Information</h1>
            <textarea
              className="w-full h-24 sm:h-32 border border-gray-300 rounded-md p-2 sm:p-3 text-xs sm:text-sm resize-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Enter any additional information"
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons - Responsive */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 p-3 sm:p-6 mb-4 sm:mb-8">
        <Button
          className="h-10 sm:h-12 px-4 sm:px-6 bg-gray-300 font-bold hover:bg-gray-400 hover:text-white text-black rounded-md flex items-center justify-center order-2 sm:order-1"
          onClick={() => navigate("/facility-dashboard/service-capacity")}
        >
          Back
        </Button>
        <Button
          className="h-10 sm:h-12 px-4 sm:px-6 bg-primarysolid text-white rounded-md bg-primarySold flex items-center justify-center order-1 sm:order-2"
          onClick={handleSubmit}
          disabled={saving || !hasChanges}
        >
          {saving ? (
            <>
              <span className="loader mr-2" /> Saving...
            </>
          ) : (
            "Update & End"
          )}
        </Button>
      </div>
    </div>
  );
};