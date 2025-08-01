import React, { useEffect, useState } from "react";
import {
  Check,
  X,
  Eye,
  FileText,
  Image,
  DollarSign,
  Calendar,
  Download,
  AlertTriangle,
  Loader,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Files
} from "lucide-react";
import {
  GetFacilityDocsAdmin,
  verifyDocument,
  rejectDocument,
  verifyAllDocuments,
  getVerificationSummary,
  getExtractionSummary,
  triggerExtraction,
  getExtractionStatus,
  isExtractableDocument,
  getExtractionStatusText,
  getExtractionStatusColor
} from "../../services/facilityDocs";
import { toast } from "react-toastify";

export const FacilityDoc = ({ facilityId }) => {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [selectedFilePath, setSelectedFilePath] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [verificationSummary, setVerificationSummary] = useState(null);
  const [extractionSummary, setExtractionSummary] = useState(null);
  const [extractionLoading, setExtractionLoading] = useState({});
  const [viewDataModal, setViewDataModal] = useState(false);
  const [selectedExtractedData, setSelectedExtractedData] = useState(null);
  const [selectedDataType, setSelectedDataType] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const getFacilityDocs = async () => {
    setLoading(true);
    try {
      const [docsRes, summaryRes, extractionRes] = await Promise.all([
        GetFacilityDocsAdmin(facilityId),
        getVerificationSummary(facilityId).catch(() => null),
        getExtractionSummary(facilityId).catch(() => null)
      ]);
      setDocs(docsRes);
      setVerificationSummary(summaryRes);
      setExtractionSummary(extractionRes);
    } catch (error) {
      console.error("Failed to fetch facility documents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facilityId) {
      getFacilityDocs();
    }
  }, [facilityId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'needs_revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      case 'needs_revision': return 'Needs Revision';
      default: return status;
    }
  };

  const getDocumentIcon = (docType) => {
    switch (docType) {
      case 'facilityPhotos': return <Image className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'facilityDetailsFiles': return <FileText className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'priceListFiles': return <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'licenseRegistrationFiles': return <FileText className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'specialistScheduleFiles': return <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />;
      default: return <FileText className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getDocumentTitle = (docType) => {
    switch (docType) {
      case 'facilityPhotos': return 'Facility Photos';
      case 'facilityDetailsFiles': return 'Facility Details Documents';
      case 'priceListFiles': return 'Price Lists';
      case 'licenseRegistrationFiles': return 'License & Registration Documents';
      case 'specialistScheduleFiles': return 'Specialist Schedules';
      default: return docType;
    }
  };

  const getExtractionIcon = (status) => {
    switch (status) {
      case 'extracted': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />;
      case 'processing': return <Loader className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 animate-spin" />;
      case 'queued': return <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />;
      default: return <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />;
    }
  };

  const handleVerifyFile = async (documentType, filePath) => {
    setActionLoading(true);
    console.log(filePath,"filepath is here");
    try {
      await verifyDocument(facilityId, documentType, filePath);
      await getFacilityDocs();
      toast.success(`File ${getFileName(filePath)} verified successfully.`);
    } catch (error) {
      console.error('Error verifying file:', error);
      toast.error('Failed to verify file. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDocument = (documentType, filePath) => {
    setSelectedDocument(documentType);
    setSelectedFilePath(filePath);
    setRejectNotes('');
    setModalVisible(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectNotes.trim()) {
      toast.error('Please provide a rejection reason.');
      return;
    }

    setActionLoading(true);
    try {
      await rejectDocument(facilityId, selectedDocument, rejectNotes, selectedFilePath);
      setModalVisible(false);
      await getFacilityDocs();
      toast.success(`File ${getFileName(selectedFilePath)} rejected successfully.`);
    } catch (error) {
      console.error('Error rejecting file:', error);
      toast.error('Failed to reject file. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyAll = async () => {
    setActionLoading(true);
    try {
      await verifyAllDocuments(facilityId, '');
      await getFacilityDocs();
      toast.success('All documents verified successfully.');
    } catch (error) {
      console.error('Error verifying all documents:', error);
      toast.error('Failed to verify all documents. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileView = (filePath) => {
    if (filePath) {
      const fileUrl = filePath.startsWith('http') ? filePath : `${import.meta.env.VITE_APP_BASE_URL}/${filePath}`;
      window.open(fileUrl, '_blank');
    }
  };

  const pollExtractionStatus = async (docType, filePath) => {
    const key = filePath ? `${docType}-${filePath}` : docType;
    const interval = setInterval(async () => {
      try {
        const status = await getExtractionStatus(facilityId, docType, filePath);
        if (status !== 'processing' && status !== 'queued') {
          clearInterval(interval);
          setExtractionLoading(prev => ({ ...prev, [key]: false }));
          await getFacilityDocs();
          toast.success(`Extraction completed for ${getDocumentTitle(docType)}.`);
        }
      } catch (error) {
        console.error('Error polling extraction status:', error);
        clearInterval(interval);
        setExtractionLoading(prev => ({ ...prev, [key]: false }));
        toast.error('Failed to check extraction status.');
      }
    }, 2000);
  };

  const handleExtract = async (docType, filePath, isReExtraction = false) => {
    if (!isExtractableDocument(docType)) {
      toast.warn(`${getDocumentTitle(docType)} is not eligible for data extraction.`);
      return;
    }

    const key = filePath ? `${docType}-${filePath}` : docType;
    setExtractionLoading(prev => ({ ...prev, [key]: true }));
    
    try {
      await triggerExtraction(facilityId, docType, filePath);
      await pollExtractionStatus(docType, filePath);
    } catch (error) {
      console.error('Error triggering extraction:', error);
      toast.error('Failed to trigger extraction. Please try again.');
      setExtractionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleViewExtractedData = (docType, filePath = null) => {
    let extractedData = null;
    
    if (docs?.extractedData?.[docType]) {
      extractedData = docs.extractedData[docType].find(item => item.filePath === filePath);
    }

    if (extractedData && extractedData.success) {
      setSelectedExtractedData(extractedData);
      setSelectedDataType(docType);
      setSelectedFilePath(filePath);
      setViewDataModal(true);
    } else {
      toast.error('No extracted data available for this file.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard.');
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getFileName = (filePath) => {
    if (!filePath) return 'Unknown file';
    return filePath.split('/').pop() || filePath;
  };

  const renderExtractedDataContent = (data) => {
    if (!data) return <p className="text-gray-500">No data available</p>;

    const content = data.data || data;
    const { type, content: extractedContent, ...otherData } = content;

    let displayContent;
    try {
      displayContent = typeof extractedContent === 'string' 
        ? extractedContent 
        : JSON.stringify(extractedContent, null, 2);
    } catch (error) {
      console.error('Invalid extracted content format:', extractedContent);
      displayContent = 'Error parsing extracted content';
      toast.error('Failed to parse extracted data.');
    }

    return (
      <div className="space-y-4">
        {extractedContent && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Extracted Content</h4>
              <button
                onClick={() => toggleSection('content')}
                className="text-gray-600 hover:text-gray-800 p-1"
                aria-label={expandedSections.content ? 'Collapse content' : 'Expand content'}
              >
                {expandedSections.content ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {expandedSections.content && (
              <div className="bg-gray-50 p-2 sm:p-3 rounded border max-h-48 sm:max-h-64 overflow-y-auto">
                <pre className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap break-words">
                  {displayContent}
                </pre>
                <button
                  onClick={() => copyToClipboard(displayContent)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  aria-label="Copy extracted content"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy content
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFileDisplay = (files, docType) => {
    if (!files || (Array.isArray(files) && files.length === 0)) {
      return <span className="text-gray-500 text-xs sm:text-sm">No files uploaded</span>;
    }

    const fileArray = Array.isArray(files) ? files : [files];
    const verification = docs?.documentVerification?.[docType];
    
    return (
      <div className="space-y-3">
        <span className="text-xs sm:text-sm text-gray-700">{fileArray.length} file(s) uploaded</span>
        <div className="space-y-2">
          {fileArray.map((file, index) => {
            const fileName = getFileName(file);
            const fileVerification = verification?.files?.find(f => f.filePath === file) || { status: 'pending', notes: '' };
            const fileStatus = fileVerification.status;
            const extractedDataEntry = docs?.extractedData?.[docType]?.find(item => item.filePath === file);
            const hasExtractedData = !!extractedDataEntry && extractedDataEntry.success;
            const fileExtraction = extractionSummary?.extractionStatus?.[docType]?.find(f => f.filePath === file);
            const extractionStatus = hasExtractedData ? 'extracted' : (fileExtraction?.status || 'pending');
            
            return (
              <div key={index} className="border rounded-lg p-2 sm:p-3 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <Files className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                      {fileName}
                    </span>
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(fileStatus)} flex-shrink-0`}>
                      {getStatusText(fileStatus)}
                    </span>
                  </div>
                  
                  {/* Action buttons - responsive layout */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => handleFileView(file)}
                      className="inline-flex items-center px-1.5 sm:px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                      aria-label={`View file ${fileName}`}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    {fileStatus !== 'verified' && (
                      <button
                        onClick={() => handleVerifyFile(docType, file)}
                        disabled={actionLoading}
                        className="inline-flex items-center px-1.5 sm:px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                        aria-label={`Verify file ${fileName}`}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Verify</span>
                      </button>
                    )}
                    {fileStatus !== 'rejected' && (
                      <button
                        onClick={() => handleRejectDocument(docType, file)}
                        disabled={actionLoading}
                        className="inline-flex items-center px-1.5 sm:px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                        aria-label={`Reject file ${fileName}`}
                      >
                        <X className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    )}
                  </div>
                </div>
                
                {isExtractableDocument(docType) && fileStatus === 'verified' && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {getExtractionIcon(extractionStatus)}
                        <span className={`text-xs ${getExtractionStatusColor(extractionStatus)}`}>
                          {getExtractionStatusText(extractionStatus)}
                        </span>
                      </div>
                      
                      {/* Extraction action buttons - responsive */}
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <button
                          onClick={() => handleExtract(docType, file)}
                          disabled={hasExtractedData || extractionLoading[`${docType}-${file}`]}
                          className="inline-flex items-center px-1.5 sm:px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          aria-label={`Extract data from ${fileName}`}
                        >
                          {extractionLoading[`${docType}-${file}`] ? (
                            <Loader className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3 mr-1" />
                          )}
                          <span className="hidden sm:inline">Extract</span>
                        </button>
                        {hasExtractedData && (
                          <>
                            <button
                              onClick={() => handleViewExtractedData(docType, file)}
                              className="inline-flex items-center px-1.5 sm:px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                              aria-label={`View extracted data for ${fileName}`}
                            >
                              <Database className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">View Data</span>
                            </button>
                            <button
                              onClick={() => handleExtract(docType, file, true)}
                              disabled={extractionLoading[`${docType}-${file}`]}
                              className="inline-flex items-center px-1.5 sm:px-2 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                              aria-label={`Re-extract data for ${fileName}`}
                            >
                              {extractionLoading[`${docType}-${file}`] ? (
                                <Loader className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <RotateCcw className="w-3 h-3 mr-1" />
                              )}
                              <span className="hidden sm:inline">Re-extract</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {fileExtraction?.error && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded break-words">
                        Error: {fileExtraction.error}
                      </div>
                    )}
                    {(fileExtraction?.updatedAt || extractedDataEntry?.extractedAt) && (
                      <div className="mt-1 text-xs text-gray-500">
                        Last updated: {formatDate(fileExtraction?.updatedAt || extractedDataEntry?.extractedAt)}
                      </div>
                    )}
                    {!hasExtractedData && extractionStatus === 'pending' && (
                      <div className="mt-1 text-xs text-gray-500">
                        No extracted data available for this file.
                      </div>
                    )}
                  </div>
                )}
                
                {fileVerification?.notes && fileStatus === 'rejected' && (
                  <div className="mt-2 pt-2 border-t">
                    <span className="text-xs text-gray-600">Rejection reason:</span>
                    <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 break-words">
                      {fileVerification.notes}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderExtractionStatus = (docType) => {
    if (!isExtractableDocument(docType)) {
      return (
        <div className="border-t pt-3 text-xs sm:text-sm text-gray-500 italic">
          This document type is not eligible for data extraction.
        </div>
      );
    }

    const verification = docs?.documentVerification?.[docType];
    const hasVerifiedFiles = verification?.files?.some(f => f.status === 'verified');
    
    if (!hasVerifiedFiles) {
      return (
        <div className="border-t pt-3 space-y-2">
          <div className="text-xs sm:text-sm text-gray-500 italic">
            Data extraction available after verification
          </div>
        </div>
      );
    }

    return null;
  };

  const renderDocumentCard = (docType) => {
    const verification = docs?.documentVerification?.[docType];
    const files = docs?.[docType];
    const hasFiles = Array.isArray(files) ? files.length > 0 : !!files;

    if (docType === 'specialistScheduleFiles' && docs?.facilityType !== 'Hospital') {
      return null;
    }

    const canExtract = isExtractableDocument(docType);

    return (
      <div key={docType} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            {getDocumentIcon(docType)}
            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
              {getDocumentTitle(docType)}
            </h3>
            {canExtract && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex-shrink-0">
                Extractable
              </span>
            )}
          </div>
          <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(verification?.status)} flex-shrink-0`}>
            {getStatusText(verification?.status)}
          </span>
        </div>
        
        <div className="border-t pt-3">
          {renderFileDisplay(files, docType)}
        </div>
        
        {canExtract && hasFiles && renderExtractionStatus(docType)}
        
        {verification?.verifiedAt && (
          <div className="border-t pt-3 space-y-1">
            <div className="text-xs sm:text-sm">
              <span className="text-gray-600">Last verified by: </span>
              <span className="text-gray-900">{verification.verifiedBy?.name || 'Admin'}</span>
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(verification.verifiedAt)}
            </div>
          </div>
        )}
        
        {verification?.notes && verification?.status === 'rejected' && (
          <div className="border-t pt-3">
            <span className="text-xs sm:text-sm text-gray-600">Rejection reason:</span>
            <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-xs sm:text-sm text-red-700 break-words">
              {verification.notes}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 sm:h-64">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!docs) {
    return (
      <div className="text-center py-6 sm:py-8">
        <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-sm sm:text-base">No facility documents found</p>
      </div>
    );
  }

  const documentTypes = ['facilityPhotos', 'facilityDetailsFiles', 'priceListFiles', 'licenseRegistrationFiles'];
  if (docs.facilityType === 'Hospital') {
    documentTypes.push('specialistScheduleFiles');
  }

  const hasAnyDocs = documentTypes.some(docType => {
    const files = docs?.[docType];
    return Array.isArray(files) ? files.length > 0 : !!files;
  });

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Document Management</h2>
          <p className="text-xs sm:text-sm text-gray-600">Facility Type: {docs.facilityType}</p>
        </div>
        
        {/* Action buttons - responsive layout */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={getFacilityDocs}
            className="inline-flex items-center justify-center px-3 py-2 text-xs sm:text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="Refresh documents"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Refresh
          </button>
          {hasAnyDocs && docs.verificationStatus !== 'verified' && (
            <button
              onClick={handleVerifyAll}
              disabled={actionLoading}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-xs sm:text-sm"
              aria-label="Verify all documents"
            >
              <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Verify All Documents
            </button>
          )}
        </div>
      </div>
   
      {/* Document Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {documentTypes.map(docType => renderDocumentCard(docType))}
      </div>
      
      {/* Additional Info - Responsive */}
      {docs.additionalInfo && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Additional Information</h3>
          <p className="text-gray-700 text-xs sm:text-sm break-words">{docs.additionalInfo}</p>
        </div>
      )}
      
      {/* Rejection Modal - Responsive */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
              Reject Document
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 break-words">
              You are about to reject "{getDocumentTitle(selectedDocument)}" file: {getFileName(selectedFilePath)}. Please provide a reason.
            </p>
            <textarea
              placeholder="Rejection reason (required)"
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-xs sm:text-sm"
              aria-label="Rejection reason"
            />
            <div className="text-xs text-gray-500 mb-3 sm:mb-4">
              {rejectNotes.length}/500 characters
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setModalVisible(false)}
                className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Cancel rejection"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectNotes.trim() || actionLoading}
                className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                aria-label="Confirm rejection"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* View Data Modal - Responsive */}
      {viewDataModal && selectedExtractedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-2 sm:mx-4">
            {/* Modal Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-6 border-b gap-3 sm:gap-0">
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                    Extracted Data - {getDocumentTitle(selectedDataType)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    File: {getFileName(selectedFilePath || selectedExtractedData.filePath)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Extracted on {formatDate(selectedExtractedData.extractedAt)}
                  </p>
                </div>
              </div>
              
              {/* Modal Action Buttons - Responsive */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {(selectedFilePath || selectedExtractedData.filePath) && (
                  <button
                    onClick={() => handleFileView(selectedFilePath || selectedExtractedData.filePath)}
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                    aria-label="View original file"
                    title="View original file"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <button
                  onClick={() => setViewDataModal(false)}
                  className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Content - Responsive */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {/* Action Buttons - Responsive */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(selectedExtractedData.data || selectedExtractedData, null, 2))}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                    aria-label="Copy all extracted data"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Copy All
                  </button>
                  <button
                    onClick={() => handleExtract(selectedDataType, selectedFilePath, true)}
                    disabled={extractionLoading[selectedFilePath ? `${selectedDataType}-${selectedFilePath}` : selectedDataType]}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center"
                    aria-label="Re-extract data"
                  >
                    {extractionLoading[selectedFilePath ? `${selectedDataType}-${selectedFilePath}` : selectedDataType] ? (
                      <Loader className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    )}
                    Re-extract
                  </button>
                </div>
                {renderExtractedDataContent(selectedExtractedData)}
              </div>
            </div>
            
            {/* Modal Footer - Responsive */}
            <div className="border-t p-3 sm:p-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-xs sm:text-sm text-gray-600">
                <div className="break-words">
                  Document: {selectedDataType} •
                  Facility: {docs.facilityType} •
                  Size: {selectedExtractedData.data?.content?.length ?
                    `${selectedExtractedData.data.content.length} characters` : 'Unknown'}
                </div>
                <button
                  onClick={() => setViewDataModal(false)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs sm:text-sm flex-shrink-0"
                  aria-label="Close extracted data modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};