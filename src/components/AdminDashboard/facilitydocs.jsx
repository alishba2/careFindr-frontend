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
  AlertTriangle
} from "lucide-react";
import { 
  GetFacilityDocsAdmin,
  verifyDocument,
  rejectDocument,
  verifyAllDocuments,
  getVerificationSummary
} from "../../services/facilityDocs";

export const FacilityDoc = ({ facilityId }) => {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [verificationSummary, setVerificationSummary] = useState(null);

  const getFacilityDocs = async () => {
    setLoading(true);
    try {
      const [docsRes, summaryRes] = await Promise.all([
        GetFacilityDocsAdmin(facilityId),
        getVerificationSummary(facilityId).catch(() => null)
      ]);
      console.log(docsRes, "response is here");
      setDocs(docsRes);
      setVerificationSummary(summaryRes);
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

  const handleExtract = (docType) => {
    // Add extraction logic here
    console.log('Extracting document:', docType);
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

  const renderDocumentCard = (docType) => {
    const verification = docs?.documentVerification?.[docType];
    const hasFiles = docType === 'facilityPhotos' || docType === 'specialistScheduleFiles'
      ? docs?.[docType]?.length > 0
      : !!docs?.[docType];

    // Don't show specialist schedules for non-hospital facilities
    if (docType === 'specialistScheduleFiles' && docs?.facilityType !== 'Hospital') {
      return null;
    }

    return (
      <div key={docType} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getDocumentIcon(docType)}
            <h3 className="font-medium text-gray-900">{getDocumentTitle(docType)}</h3>
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
        
        {/* Verification Details */}
        {verification?.verifiedAt && (
          <div className="border-t pt-3 space-y-1">
           
            <div className="text-sm">
              <span className="text-gray-600">Verified by: </span>
              <span className="text-gray-900">{verification.verifiedBy?.name || 'Admin'}</span>
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
          <div className="border-t pt-3 flex gap-2">
            {verification?.status === 'verified' ? (
              <>
                {(docType === 'licenseRegistrationFile' || docType === 'facilityDetailsDoc' || docType === 'priceListFile') && (
                  <button
                    onClick={() => handleExtract(docType)}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Extract
                  </button>
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
        
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-sm text-gray-600">
              Facility Type: <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">{docs.facilityType}</span>
            </span>
            <span className="text-sm text-gray-600">
              Overall Status: <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(docs.verificationStatus)}`}>
                {getStatusText(docs.verificationStatus)}
              </span>
            </span>
          </div>
        </div>
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
    </div>
  );
};