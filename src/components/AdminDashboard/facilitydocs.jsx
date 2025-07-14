import React, { useEffect, useState } from "react";
import { 
  Card, 
  Button, 
  Tag, 
  Modal, 
  Input, 
  message, 
  Row, 
  Col, 
  Typography, 
  Divider,
  Space,
  Tooltip,
  Empty,
  Spin
} from "antd";
import { 
  CheckOutlined, 
  CloseOutlined, 
  EyeOutlined,
  FileTextOutlined,
  PictureOutlined,
  DollarOutlined,
//   LicenseOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import { 
  GetFacilityDocsAdmin,
  verifyDocument,
  rejectDocument,
  verifyAllDocuments,
  getVerificationSummary
} from "../../services/facilityDocs";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const FacilityDoc = ({ facilityId }) => {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'verify', 'reject', 'verifyAll'
  const [selectedDocument, setSelectedDocument] = useState('');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [verificationSummary, setVerificationSummary] = useState(null);

  const getFacilityDocs = async () => {
    setLoading(true);
    try {
      const [docsRes, summaryRes] = await Promise.all([
        GetFacilityDocsAdmin(facilityId),
        getVerificationSummary(facilityId).catch(() => null) // Don't fail if summary doesn't exist
      ]);
      console.log(docsRes, "response is here");
      setDocs(docsRes);
      setVerificationSummary(summaryRes);
    } catch (error) {
      console.error("Failed to fetch facility documents", error);
      message.error("Failed to fetch facility documents");
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
      case 'verified': return 'green';
      case 'rejected': return 'red';
      case 'pending': return 'orange';
      default: return 'default';
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
      case 'facilityPhotos': return <PictureOutlined />;
      case 'facilityDetailsDoc': return <FileTextOutlined />;
      case 'priceListFile': return <DollarOutlined />;
      case 'licenseRegistrationFile': return <FileTextOutlined />;
      case 'specialistScheduleFiles': return <CalendarOutlined />;
      default: return <FileTextOutlined />;
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

  const handleVerifyDocument = (documentType) => {
    setSelectedDocument(documentType);
    setModalType('verify');
    setNotes('');
    setModalVisible(true);
  };

  const handleRejectDocument = (documentType) => {
    setSelectedDocument(documentType);
    setModalType('reject');
    setNotes('');
    setModalVisible(true);
  };

  const handleVerifyAll = () => {
    setModalType('verifyAll');
    setNotes('');
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    if (modalType === 'reject' && !notes.trim()) {
      message.error('Notes are required when rejecting a document');
      return;
    }

    setActionLoading(true);
    try {
      let response;
      if (modalType === 'verify') {
        response = await verifyDocument(facilityId, selectedDocument, notes);
        message.success('Document verified successfully');
      } else if (modalType === 'reject') {
        response = await rejectDocument(facilityId, selectedDocument, notes);
        message.success('Document rejected successfully');
      } else if (modalType === 'verifyAll') {
        response = await verifyAllDocuments(facilityId, notes);
        message.success('All documents verified successfully');
      }
      
      setModalVisible(false);
      getFacilityDocs(); // Refresh data
    } catch (error) {
      console.error('Error in document action:', error);
      message.error(error.error || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileView = (filePath) => {
    if (filePath) {
      // Construct full URL - adjust based on your backend setup
      const fileUrl = filePath.startsWith('http') ? filePath : `${import.meta.env.VITE_APP_BASE_URL}/${filePath}`;
      window.open(fileUrl, '_blank');
    } else {
      message.info('No file available');
    }
  };

  const renderFileDisplay = (files, isArray = false) => {
    if (isArray) {
      if (!files || files.length === 0) {
        return <Text type="secondary">No files uploaded</Text>;
      }
      return (
        <div>
          <Text>{files.length} file(s) uploaded</Text>
          <div className="mt-2">
            {files.map((file, index) => (
              <Button
                key={index}
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleFileView(file)}
                className="mr-2 mb-1"
              >
                View File {index + 1}
              </Button>
            ))}
          </div>
        </div>
      );
    } else {
      if (!files) {
        return <Text type="secondary">No file uploaded</Text>;
      }
      return (
        <div>
          <Text>File uploaded</Text>
          <div className="mt-2">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleFileView(files)}
            >
              View File
            </Button>
          </div>
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
      <Card 
        key={docType}
        className="mb-4"
        title={
          <Space>
            {getDocumentIcon(docType)}
            {getDocumentTitle(docType)}
          </Space>
        }
        extra={
          <Tag color={getStatusColor(verification?.status)}>
            {getStatusText(verification?.status)}
          </Tag>
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Status: </Text>
            <Tag color={getStatusColor(verification?.status)}>
              {getStatusText(verification?.status)}
            </Tag>
          </Col>
          <Col span={12}>
            <Text strong>Files: </Text>
            {renderFileDisplay(
              docs?.[docType], 
              docType === 'facilityPhotos' || docType === 'specialistScheduleFiles'
            )}
          </Col>
        </Row>
        
        {verification?.verifiedAt && (
          <Row gutter={16} className="mt-2">
            <Col span={12}>
              <Text strong>Verified At: </Text>
              <Text>{new Date(verification.verifiedAt).toLocaleDateString()}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Verified By: </Text>
              <Text>{verification.verifiedBy?.name || 'Admin'}</Text>
            </Col>
          </Row>
        )}
        
        {verification?.notes && (
          <div className="mt-2">
            <Text strong>Notes: </Text>
            <div className="bg-gray-50 p-2 rounded mt-1">
              <Text>{verification.notes}</Text>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleVerifyDocument(docType)}
            disabled={verification?.status === 'verified'}
            size="small"
          >
            Verify
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleRejectDocument(docType)}
            size="small"
          >
            Reject
          </Button>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!docs) {
    return (
      <Card>
        <Empty description="No facility documents found" />
      </Card>
    );
  }

  const documentTypes = ['facilityPhotos', 'facilityDetailsDoc', 'priceListFile', 'licenseRegistrationFile'];
  if (docs.facilityType === 'Hospital') {
    documentTypes.push('specialistScheduleFiles');
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>Facility Documents</Title>
            <Text className="text-gray-600">
              Facility Type: <Tag color="blue">{docs.facilityType}</Tag>
              Overall Status: <Tag color={getStatusColor(docs.verificationStatus)}>
                {getStatusText(docs.verificationStatus)}
              </Tag>
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                size="large"
                icon={<CheckOutlined />}
                onClick={handleVerifyAll}
                disabled={docs.verificationStatus === 'verified'}
              >
                Verify All Documents
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Document Summary */}
      {verificationSummary && (
        <Card className="mb-6" title="Verification Summary">
          <Row gutter={16}>
            <Col span={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {verificationSummary.summary?.totalDocuments || 0}
                </div>
                <div className="text-gray-600">Total Documents</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {verificationSummary.summary?.verified || 0}
                </div>
                <div className="text-gray-600">Verified</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {verificationSummary.summary?.pending || 0}
                </div>
                <div className="text-gray-600">Pending</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {verificationSummary.summary?.rejected || 0}
                </div>
                <div className="text-gray-600">Rejected</div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Document Cards */}
      <Row gutter={16}>
        {documentTypes.map(docType => (
          <Col key={docType} span={12}>
            {renderDocumentCard(docType)}
          </Col>
        ))}
      </Row>

      {/* Additional Info */}
      {docs.additionalInfo && (
        <Card title="Additional Information" className="mt-4">
          <Text>{docs.additionalInfo}</Text>
        </Card>
      )}

      {/* Modal for Verify/Reject */}
      <Modal
        title={
          modalType === 'verify' ? 'Verify Document' :
          modalType === 'reject' ? 'Reject Document' :
          'Verify All Documents'
        }
        open={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={actionLoading}
        okText={
          modalType === 'verify' ? 'Verify' :
          modalType === 'reject' ? 'Reject' :
          'Verify All'
        }
        cancelText="Cancel"
        width={500}
      >
        <div className="mb-4">
          <Text className="text-gray-600 mb-4 block">
            {modalType === 'verify' && `You are about to verify "${getDocumentTitle(selectedDocument)}".`}
            {modalType === 'reject' && `You are about to reject "${getDocumentTitle(selectedDocument)}". Please provide a reason.`}
            {modalType === 'verifyAll' && 'You are about to verify all documents for this facility.'}
          </Text>
          <TextArea
            placeholder={
              modalType === 'reject' ? 'Rejection reason (required)' : 'Add notes (optional)'
            }
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            maxLength={500}
            showCount
          />
        </div>
      </Modal>
    </div>
  );
};