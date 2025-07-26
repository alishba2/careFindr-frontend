// File: src/pages/dashboard/Feedback.jsx - Updated with file upload support
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../hook/chatContext";
import { 
  Send, 
  Paperclip, 
  X, 
  Eye, 
  File, 
  Image as ImageIcon,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function Feedback() {
  const {
    activeChat,
    messages,
    loading,
    error,
    unreadCount,
    sendMessage,
    sendTyping,
    isTyping,
    isConnected,
    markAsRead,
    uploadingFiles,

    validateFile,
    getFileIcon,
   
  } = useChat();

  const [messageText, setMessageText] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when chat is active
  useEffect(() => {
    if (activeChat && unreadCount > 0) {
      markAsRead();
    }
  }, [activeChat, unreadCount]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedFile) return;
    
    try {
      const messageData = {
        message: messageText,
        messageType: selectedFile ? (selectedFile.type.startsWith('image/') ? 'image' : 'file') : 'text'
      };

      if (selectedFile) {
        messageData.file = selectedFile;
      }

      await sendMessage(messageData);
      
      // Reset form
      setMessageText('');
      clearSelectedFile();
      
      // Stop typing indicator
      if (isUserTyping) {
        setIsUserTyping(false);
        sendTyping(false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    
    if (!isUserTyping) {
      setIsUserTyping(true);
      sendTyping(true);
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 1 second of no input
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
      sendTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // File handling functions
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    try {
      validateFile(file);
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
      
      setShowFileInput(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  // Render file message - Updated to remove download button and fix file name color
  const renderFileMessage = (message) => {
    const isImage = message.messageType === 'image' || (message.fileType && message.fileType.startsWith('image/'));
    const fileName = message.fileName || 'File';
    const fileSize = message.fileSize ? formatFileSize(message.fileSize) : '';
    const fileIcon = getFileIcon(message.fileType || '');

    if (isImage && message.fileUrl) {
      return (
        <div className="max-w-xs">
          <img 
            src={message.fileUrl} 
            alt={fileName}
            className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(message.fileUrl, '_blank')}
            onError={(e) => {
              // If image fails to load, show file icon instead
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="text-xs mt-1 opacity-75">
            {fileName} {fileSize && `• ${fileSize}`}
          </div>
          {/* Fallback file display if image fails to load */}
          <div className="hidden flex items-center space-x-3 p-3 bg-gray-50 rounded-lg max-w-xs">
            <div className="text-2xl">{fileIcon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-black truncate">{fileName}</div>
              {fileSize && <div className="text-xs text-gray-500">{fileSize}</div>}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg max-w-xs">
          <div className="text-2xl">{fileIcon}</div>
          <div style={{cursor: 'pointer'}} onClick={() => window.open(message.fileUrl, '_blank')} className="flex-1 min-w-0">
            <div className="text-sm font-medium text-black truncate">{fileName}</div>
            {fileSize && <div className="text-xs text-gray-500">{fileSize}</div>}
          </div>
          <div className="flex space-x-1">
            {message.fileUrl && (
              <button 
                onClick={() => window.open(message.fileUrl, '_blank')}
                className="p-1 hover:bg-gray-200 rounded"
                title="View file"
              >
                {/* <Eye className="w-4 h-4 text-black" /> */}
              </button>
            )}
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primarysolid"></div>
          <p className="text-gray-500 font-medium">Connecting to support...</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div 
      className={`flex flex-col h-full max-h-[calc(100vh-120px)] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${
        dragActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Enhanced Header */}
      <div className="bg-primarysolid p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold text-white">CareFindr Support</h2>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-blue-100">
                  {isConnected ? 'Online • Ready to help' : 'Connecting...'}
                </span>
                {activeChat?.status && (
                  <>
                    <span className="text-blue-200">•</span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      activeChat.status === 'open' ? 'bg-green-500 bg-opacity-20 text-green-100' :
                      activeChat.status === 'closed' ? 'bg-gray-500 bg-opacity-20 text-gray-100' :
                      'bg-blue-500 bg-opacity-20 text-blue-100'
                    }`}>
                      {activeChat.status.charAt(0).toUpperCase() + activeChat.status.slice(1)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area with Enhanced Design */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
        {!activeChat ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 max-w-md">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Starting your support conversation</h3>
              <p className="text-sm text-gray-500">We're here to help you with any questions or issues you might have.</p>
            </div>
          </div>
        ) : Object.keys(messageGroups).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome to CareFindr Support!</h3>
              <p className="text-sm text-gray-500 mb-4">We're excited to help you. Send a message or attach a file below to get started.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">💡 Tip: You can attach screenshots, documents, or other files to help explain your issue</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(messageGroups).map(([date, dayMessages]) => (
              <div key={date}>
                {/* Enhanced Date Separator */}
                <div className="flex items-center justify-center my-6">
                  <div className="bg-white border border-gray-200 shadow-sm text-gray-600 text-xs px-4 py-2 rounded-full font-medium">
                    {date}
                  </div>
                </div>
                
                {/* Messages for this date */}
                <div className="space-y-4">
                  {dayMessages.map((message, index) => {
                    const isAdmin = message.senderType === 'Admin';
                    const isFileMessage = message.messageType === 'file' || message.messageType === 'image';
                    const isUploading = message.isUploading;
                    
                    return (
                      <div key={`${message._id || index}-${message.timestamp}`} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`flex max-w-xs lg:max-w-md ${isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                          {/* Enhanced Message bubble */}
                          <div className="flex flex-col">
                            <div className={`px-4 py-3 rounded-2xl shadow-sm relative ${
                              isAdmin 
                                ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-md' 
                                : 'bg-gradient-to-r from-blue-500 to-primarysolid text-white rounded-tr-md'
                            }`}>
                              {/* Upload progress indicator */}
                              {isUploading && (
                                <div className="absolute top-1 right-1">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                              
                              {/* File content */}
                              {isFileMessage ? (
                                <div className="space-y-2">
                                  {renderFileMessage(message)}
                                  {message.message && message.message !== message.fileName && (
                                    <div className="text-sm leading-relaxed">{message.message}</div>
                                  )}
                                </div>
                              ) : (
                                <div className="break-words text-sm leading-relaxed">{message.message}</div>
                              )}
                              
                              <div className={`text-xs mt-2 ${
                                isAdmin ? 'text-gray-400' : 'text-blue-100'
                              }`}>
                                {formatTime(message.timestamp)}
                                {isUploading && (
                                  <span className="ml-2">
                                    <Upload className="w-3 h-3 inline animate-pulse" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4 animate-fadeIn">
            <div className="flex items-end space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-primarysolid text-white rounded-full flex items-center justify-center text-sm font-semibold">
                CF
              </div>
              <div className="bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-2xl rounded-tl-md max-w-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">CareFindr Support is typing</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Drag and drop overlay */}
        {dragActive && (
          <div className="fixed inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Drop your file here</h3>
              <p className="text-gray-500">Release to upload</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t border-gray-100 bg-white p-4">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{error}</span>
          </div>
        )}
        
        {/* File preview */}
        {selectedFile && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-black">{selectedFile.name}</div>
                  <div className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</div>
                </div>
              </div>
              <button
                onClick={clearSelectedFile}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-end space-x-3">
          {/* File Upload Button */}
          <div className="relative">
            <button
              onClick={() => setShowFileInput(!showFileInput)}
              className="p-3 text-gray-500 hover:text-primarysolid hover:bg-gray-100 rounded-full transition-all duration-200 mb-3"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            {/* File input dropdown */}
            {showFileInput && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px]">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Upload Image</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <File className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Upload Document</span>
                </button>
                <div className="px-2 py-1">
                  <div className="text-xs text-gray-500">
                    Max 10MB • Images, PDFs, Documents
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder={selectedFile ? "Add a message (optional)..." : "Type your message..."}
              className="w-full p-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              rows="1"
              style={{
                minHeight: '52px',
                maxHeight: '120px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              disabled={!isConnected}
            />
            {/* Character count for long messages */}
            {messageText.length > 100 && (
              <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                {messageText.length}/1000
              </div>
            )}
          </div>
          
          {/* Enhanced Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={(!messageText.trim() && !selectedFile) || !isConnected}
            className={`p-3 rounded-full transition-all duration-200 mb-3 ${
              (messageText.trim() || selectedFile) && isConnected
                ? 'bg-gradient-to-r from-blue-500 to-primarysolid text-white shadow-lg hover:shadow-xl hover:scale-105 transform'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Enhanced Quick Actions */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center space-x-4 text-gray-500">
            <span className="flex items-center space-x-1">
              <span>Press</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter</kbd>
              <span>to send</span>
            </span>
            {selectedFile && (
              <span className="flex items-center space-x-1 text-blue-600">
                <Paperclip className="w-3 h-3" />
                <span>File attached</span>
              </span>
            )}
            {unreadCount > 0 && (
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-primarysolid font-semibold">
                  {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
                </span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
           
            {isUserTyping && !Array.from(uploadingFiles).length && (
              <span className="text-primarysolid font-medium flex items-center space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Typing...</span>
              </span>
            )}
            <span className="text-gray-400">
              {isConnected ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
        </div>
        
        {/* File Upload Tips */}
        <div className="mt-2 text-xs text-gray-400 text-center">
          <span>Drag & drop files here or click </span>
          <button 
            onClick={() => setShowFileInput(!showFileInput)}
            className="text-blue-500 hover:text-blue-600 underline"
          >
            attach
          </button>
          <span> • Supported: Images, PDFs, Documents (Max 10MB)</span>
        </div>
      </div>
    </div>
  );
}