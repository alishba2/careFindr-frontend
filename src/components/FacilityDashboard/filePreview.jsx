// components/FilePreview.jsx - Component for file previews and downloads
import React, { useState } from 'react';
import { 
  Download, 
  Eye, 
  X, 
  File, 
  Image as ImageIcon, 
  FileText, 
  Archive,
  Play,
  Volume2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

const FilePreview = ({ 
  fileName, 
  fileUrl, 
  fileType, 
  fileSize, 
  onDownload, 
  onClose, 
  className = "",
  showActions = true,
  compact = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to get file icon and color
  const getFileInfo = (type) => {
    if (type.startsWith('image/')) {
      return { icon: ImageIcon, color: 'text-green-500', bg: 'bg-green-100' };
    }
    if (type === 'application/pdf') {
      return { icon: FileText, color: 'text-red-500', bg: 'bg-red-100' };
    }
    if (type.includes('word') || type.includes('document')) {
      return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' };
    }
    if (type.includes('excel') || type.includes('spreadsheet')) {
      return { icon: Archive, color: 'text-green-600', bg: 'bg-green-100' };
    }
    if (type.startsWith('text/')) {
      return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100' };
    }
    if (type.startsWith('audio/')) {
      return { icon: Volume2, color: 'text-purple-500', bg: 'bg-purple-100' };
    }
    if (type.startsWith('video/')) {
      return { icon: Play, color: 'text-indigo-500', bg: 'bg-indigo-100' };
    }
    return { icon: File, color: 'text-gray-500', bg: 'bg-gray-100' };
  };

  const fileInfo = getFileInfo(fileType);
  const FileIcon = fileInfo.icon;
  const isImage = fileType?.startsWith('image/');
  const isPdf = fileType === 'application/pdf';
  const isPreviewable = isImage || isPdf;

  const handleDownload = async () => {
    setLoading(true);
    try {
      if (onDownload) {
        await onDownload();
      } else if (fileUrl) {
        // Fallback download method
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-3 p-3 bg-gray-50 rounded-lg ${className}`}>
        <div className={`w-10 h-10 ${fileInfo.bg} rounded-lg flex items-center justify-center`}>
          <FileIcon className={`w-5 h-5 ${fileInfo.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{fileName}</div>
          {fileSize && (
            <div className="text-xs text-gray-500">{formatFileSize(fileSize)}</div>
          )}
        </div>
        {showActions && (
          <div className="flex space-x-1">
            {isPreviewable && fileUrl && (
              <button
                onClick={handleView}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="View file"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleDownload}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              title="Download file"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${fileInfo.bg} rounded-lg flex items-center justify-center`}>
            <FileIcon className={`w-5 h-5 ${fileInfo.color}`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 truncate max-w-xs" title={fileName}>
              {fileName}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{fileType}</span>
              {fileSize && (
                <>
                  <span>•</span>
                  <span>{formatFileSize(fileSize)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preview Content */}
      <div className="p-4">
        {isImage && fileUrl && !imageError ? (
          <div className="text-center">
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleView}
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          </div>
        ) : isPdf && fileUrl ? (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-4">PDF Document</p>
            <button
              onClick={handleView}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in new tab</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileIcon className={`w-16 h-16 ${fileInfo.color} mx-auto mb-4`} />
            <p className="text-sm text-gray-600 mb-2">
              {fileType?.includes('word') ? 'Word Document' :
               fileType?.includes('excel') ? 'Excel Spreadsheet' :
               fileType?.startsWith('text/') ? 'Text File' :
               'File'}
            </p>
            {imageError && (
              <div className="flex items-center justify-center space-x-2 text-orange-600 mb-4">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">Preview not available</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2 p-4 pt-0">
          {isPreviewable && fileUrl && (
            <button
              onClick={handleView}
              className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FilePreview;