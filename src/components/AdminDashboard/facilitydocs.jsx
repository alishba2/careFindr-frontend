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
  ExternalLink
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

export const FacilityDoc = ({ facilityId }) => {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [verificationSummary, setVerificationSummary] = useState(null);
  const [extractionSummary, setExtractionSummary] = useState(null);
  const [extractionLoading, setExtractionLoading] = useState({});

  // New states for data viewing
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
      console.log(docsRes, "response is here");
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
      case 'facilityPhotos': return <Image className="w-5 h-5" />;
      case 'facilityDetailsDoc': return <FileText className="w-5 h-5" />;
      case 'priceListFile': return <DollarSign className="w-5 h-5" />;
      case 'licenseRegistrationFile': return <FileText className="w-5 h-5" />;
      case 'specialistScheduleFiles': return <Calendar className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getDocumentTitle = (docType) => {
    switch (docType) {
      case 'facilityPhotos': return 'Facility Photos';
      case 'facilityDetailsDoc': return 'Facility Details Document';
      case 'priceListFile': return 'Price List';
      case 'licenseRegistrationFile': return 'License & Registration';
      case 'specialistScheduleFiles': return 'Specialist Schedules';
      default: return docType;
    }
  };

  const getExtractionIcon = (status) => {
    switch (status) {
      case 'extracted': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'processing': return <Loader className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'queued': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleVerifyDocument = async (documentType) => {
    setActionLoading(true);
    try {
      await verifyDocument(facilityId, documentType, '');
      getFacilityDocs();
    } catch (error) {
      console.error('Error verifying document:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDocument = (documentType) => {
    setSelectedDocument(documentType);
    setRejectNotes('');
    setModalVisible(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectNotes.trim()) {
      return;
    }

    setActionLoading(true);
    try {
      await rejectDocument(facilityId, selectedDocument, rejectNotes);
      setModalVisible(false);
      getFacilityDocs();
    } catch (error) {
      console.error('Error rejecting document:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyAll = async () => {
    setActionLoading(true);
    try {
      await verifyAllDocuments(facilityId, '');
      getFacilityDocs();
    } catch (error) {
      console.error('Error verifying all documents:', error);
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

  const handleExtract = async (docType, isReExtraction = false) => {
    if (!isExtractableDocument(docType)) {
      console.warn('Document type not extractable:', docType);
      return;
    }

    setExtractionLoading(prev => ({ ...prev, [docType]: true }));
    try {
      await triggerExtraction(facilityId, docType);
      // Refresh extraction summary after triggering
      const updatedSummary = await getExtractionSummary(facilityId);
      setExtractionSummary(updatedSummary);

      if (isReExtraction) {
        // Also refresh the full docs to get updated extracted data
        setTimeout(() => getFacilityDocs(), 2000); // Give some time for processing
      }
    } catch (error) {
      console.error('Error triggering extraction:', error);
    } finally {
      setExtractionLoading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const handleViewExtractedData = (docType) => {
    const extractedData = docs?.extractedData?.[docType];
    if (extractedData && extractedData.success) {
      setSelectedExtractedData(extractedData);
      setSelectedDataType(docType);
      setViewDataModal(true);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Copied to clipboard');
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

  const renderExtractedDataContent = (data) => {
    if (!data) return <p className="text-gray-500">No data available</p>;

    const { type, content, ...otherData } = data;

    return (
      <div className="space-y-4">


        {/* Main Content */}
        {content && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Extracted Content</h4>
              <button
                onClick={() => toggleSection('content')}
                className="text-gray-600 hover:text-gray-800"
              >
                {expandedSections.content ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {expandedSections.content && (
              <div className="bg-gray-50 p-3 rounded border max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                  {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                </pre>
                <button
                  onClick={() => copyToClipboard(typeof content === 'string' ? content : JSON.stringify(content, null, 2))}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
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

  const renderFileDisplay = (files, isArray = false) => {
    if (isArray) {
      if (!files || files.length === 0) {
        return <span className="text-gray-500 text-sm">No files uploaded</span>;
      }
      return (
        <div className="space-y-2">
          <span className="text-sm text-gray-700">{files.length} file(s) uploaded</span>
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => handleFileView(file)}
                className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
              >
                <Eye className="w-3 h-3 mr-1" />
                File {index + 1}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      if (!files) {
        return <span className="text-gray-500 text-sm">No file uploaded</span>;
      }
      return (
        <div className="space-y-2">
          <span className="text-sm text-gray-700">File uploaded</span>
          <button
            onClick={() => handleFileView(files)}
            className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-3 h-3 mr-1" />
            View File
          </button>
        </div>
      );
    }
  };

  const renderExtractionStatus = (docType) => {
    if (!isExtractableDocument(docType)) {
      return null;
    }

    const extractionData = extractionSummary?.extractionSummary?.[docType];
    const status = extractionData?.status || 'pending';
    const hasData = extractionData?.hasData || false;
    const error = extractionData?.error;
    const actualExtractedData = docs?.extractedData?.[docType];

    return (
      <div className="border-t pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Data Extraction:</span>
          <div className="flex items-center space-x-2">
            {getExtractionIcon(status)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExtractionStatusColor(status)}`}>
              {getExtractionStatusText(status)}
            </span>
          </div>
        </div>

        {hasData && actualExtractedData?.success && (
          <div className="space-y-2">
            <div className="text-sm text-green-600 flex items-center">
              <Database className="w-4 h-4 mr-1" />
              Data extracted successfully
            </div>
            <div className="text-xs text-gray-500">
              Extracted: {formatDate(actualExtractedData.extractedAt)}
            </div>
            <div className="text-xs text-gray-500">
              File type: {actualExtractedData.fileExtension}
            </div>
            {actualExtractedData.data?.type && (
              <div className="text-xs text-gray-500">
                Content type: {actualExtractedData.data.type}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            Error: {error}
          </div>
        )}

        {extractionData?.lastUpdated && (
          <div className="text-xs text-gray-500">
            Last updated: {new Date(extractionData.lastUpdated).toLocaleString()}
          </div>
        )}
      </div>
    );
  };

  const renderDocumentCard = (docType) => {
    const verification = docs?.documentVerification?.[docType];
    const hasFiles = docType === 'facilityPhotos' || docType === 'specialistScheduleFiles'
      ? docs?.[docType]?.length > 0
      : !!docs?.[docType];

    // Don't show specialist schedules for non-hospital facilities
    if (docType === 'specialistScheduleFiles' && docs?.facilityType !== 'Hospital') {
      return null;
    }

    const canExtract = isExtractableDocument(docType);
    const isExtracting = extractionLoading[docType];
    const hasExtractedData = docs?.extractedData?.[docType]?.success;
    const extractionStatus = extractionSummary?.extractionSummary?.[docType]?.status;

    return (
      <div key={docType} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getDocumentIcon(docType)}
            <h3 className="font-medium text-gray-900">{getDocumentTitle(docType)}</h3>
            {canExtract && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                Extractable
              </span>
            )}
            {hasExtractedData && (
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                Data Available
              </span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(verification?.status)}`}>
            {getStatusText(verification?.status)}
          </span>
        </div>

        {/* File Display */}
        <div className="border-t pt-3">
          {renderFileDisplay(
            docs?.[docType],
            docType === 'facilityPhotos' || docType === 'specialistScheduleFiles'
          )}
        </div>

        {/* Extraction Status */}
        {canExtract && hasFiles && verification?.verifiedAt && renderExtractionStatus(docType)}

        {/* Verification Details */}
        {verification?.verifiedAt && (
          <div className="border-t pt-3 space-y-1">
            <div className="text-sm">
              <span className="text-gray-600">Verified by: </span>
              <span className="text-gray-900">{verification.verifiedBy?.name || 'Admin'}</span>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(verification.verifiedAt).toLocaleString()}
            </div>
          </div>
        )}

        {/* Rejection Notes */}
        {verification?.notes && verification?.status === 'rejected' && (
          <div className="border-t pt-3">
            <span className="text-sm text-gray-600">Rejection reason:</span>
            <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {verification.notes}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {hasFiles && (
          <div className="border-t pt-3 flex gap-2 flex-wrap">
            {verification?.status === 'verified' ? (
              <>
                {canExtract && (
                  <div className="flex gap-2 flex-wrap">
                    {!hasExtractedData ? (
                      <button
                        onClick={() => handleExtract(docType)}
                        disabled={isExtracting}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {isExtracting ? (
                          <Loader className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-1" />
                        )}
                        {isExtracting ? 'Extracting...' : 'Extract Data'}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleViewExtractedData(docType)}
                          className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          <Database className="w-4 h-4 mr-1" />
                          View Data
                        </button>
                        <button
                          onClick={() => handleExtract(docType, true)}
                          disabled={isExtracting}
                          className="inline-flex items-center px-3 py-1.5 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 transition-colors"
                        >
                          {isExtracting ? (
                            <Loader className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <RotateCcw className="w-4 h-4 mr-1" />
                          )}
                          {isExtracting ? 'Re-extracting...' : 'Re-extract'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => handleVerifyDocument(docType)}
                  disabled={actionLoading}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Verify
                </button>
                <button
                  onClick={() => handleRejectDocument(docType)}
                  disabled={actionLoading}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </button>
              </>
            )}
          </div>
        )}

        {/* No Files Message */}
        {!hasFiles && (
          <div className="border-t pt-3 text-center py-4">
            <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No documents uploaded yet</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!docs) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No facility documents found</p>
      </div>
    );
  }

  const documentTypes = ['facilityPhotos', 'facilityDetailsDoc', 'priceListFile', 'licenseRegistrationFile'];
  if (docs.facilityType === 'Hospital') {
    documentTypes.push('specialistScheduleFiles');
  }

  const hasAnyDocs = documentTypes.some(docType => {
    const hasFiles = docType === 'facilityPhotos' || docType === 'specialistScheduleFiles'
      ? docs?.[docType]?.length > 0
      : !!docs?.[docType];
    return hasFiles;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
    
        </div>
        <div className="flex gap-2">
          <button
            onClick={getFacilityDocs}
            className="inline-flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
          {hasAnyDocs && docs.verificationStatus !== 'verified' && (
            <button
              onClick={handleVerifyAll}
              disabled={actionLoading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4 mr-2" />
              Verify All Documents
            </button>
          )}
        </div>
      </div>

      {/* Verification Summary */}
      {verificationSummary && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4">Verification Summary</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {verificationSummary.summary?.totalDocuments || 0}
              </div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {verificationSummary.summary?.verified || 0}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {verificationSummary.summary?.pending || 0}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {verificationSummary.summary?.rejected || 0}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
      )}

     
      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map(docType => renderDocumentCard(docType))}
      </div>

      {/* Additional Info */}
      {docs.additionalInfo && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Additional Information</h3>
          <p className="text-gray-700">{docs.additionalInfo}</p>
        </div>
      )}

      {/* Reject Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Reject Document
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You are about to reject "{getDocumentTitle(selectedDocument)}". Please provide a reason.
            </p>
            <textarea
              placeholder="Rejection reason (required)"
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="text-xs text-gray-500 mb-4">
              {rejectNotes.length}/500 characters
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModalVisible(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectNotes.trim() || actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Extracted Data Modal */}
      {viewDataModal && selectedExtractedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Extracted Data - {getDocumentTitle(selectedDataType)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Extracted on {formatDate(selectedExtractedData.extractedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selectedExtractedData.filePath && (
                  <button
                    onClick={() => handleFileView(selectedExtractedData.filePath)}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                    title="View original file"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setViewDataModal(false)}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Extraction Metadata */}



              {/* Extracted Data Content */}
              {selectedExtractedData.success && selectedExtractedData.data && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(selectedExtractedData.data, null, 2))}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy All
                      </button>
                      <button
                        onClick={() => handleExtract(selectedDataType, true)}
                        disabled={extractionLoading[selectedDataType]}
                        className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center"
                      >
                        {extractionLoading[selectedDataType] ? (
                          <Loader className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <RotateCcw className="w-4 h-4 mr-1" />
                        )}
                        Re-extract
                      </button>
                    </div>
                  </div>

                  {renderExtractedDataContent(selectedExtractedData.data)}
                </div>
              )}


            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  Document: {selectedDataType} •
                  Facility: {docs.facilityType} •
                  Size: {selectedExtractedData.data?.content?.length ?
                    `${selectedExtractedData.data.content.length} characters` : 'Unknown'}
                </div>
                <button
                  onClick={() => setViewDataModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
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