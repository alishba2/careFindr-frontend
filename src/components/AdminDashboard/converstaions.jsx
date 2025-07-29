import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  Loader, 
  RefreshCw,
  Paperclip,
  X,
  Eye,
  File,
  Image as ImageIcon,
  FileText,
  Upload,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useChat } from '../hook/chatContext';
import { useAuth } from '../hook/auth';
import { getAllFacilities } from '../../services/facility';

const AdminChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  
  const {
    chats,
    activeChat,
    messages,
    unreadCount,
    isTyping,
    typingUsers,
    isConnected,
    loading,
    error,
    chatStats,
    isAdmin,
    sendMessage,
    markAsRead,
    updateChatStatus,
    sendTyping,
    selectChat,
    fetchAllChats,
    fetchChatByFacility,
    refreshChats,
    setError,
    setActiveChat,
    setMessages,
    uploadingFiles,
    validateFile,
    getFileIcon,
    reconnect 
  } = useChat();

  const { role } = useAuth();

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [connectionRetrying, setConnectionRetrying] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [facilities, setFacilities] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // Connection retry logic
  const handleConnectionRetry = async () => {
    if (connectionRetrying) return;
    
    setConnectionRetrying(true);
    try {
      // Clear any existing timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Try to reconnect
      if (reconnect && typeof reconnect === 'function') {
        await reconnect();
      } else {
        // Fallback: refresh chats which might trigger reconnection
        await refreshChats();
      }
      
      // If still not connected after 3 seconds, stop showing loading
      reconnectTimeoutRef.current = setTimeout(() => {
        setConnectionRetrying(false);
      }, 3000);
      
    } catch (error) {
      console.error('Reconnection failed:', error);
      setConnectionRetrying(false);
    }
  };

  // Auto-retry connection when disconnected
  useEffect(() => {
    if (!isConnected && !connectionRetrying) {
      // Automatically try to reconnect after 2 seconds
      const autoRetryTimeout = setTimeout(() => {
        handleConnectionRetry();
      }, 2000);

      return () => clearTimeout(autoRetryTimeout);
    }
  }, [isConnected, connectionRetrying]);

  // Stop retrying when connected
  useEffect(() => {
    if (isConnected && connectionRetrying) {
      setConnectionRetrying(false);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    }
  }, [isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Helper functions
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCurrentTypingForChat = (chatId) => {
    return typingUsers.find(user => user.chatId === chatId);
  };

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages yet";
    }
    const lastMsg = chat.messages[chat.messages.length - 1];
    if (lastMsg.messageType === 'file' || lastMsg.messageType === 'image') {
      return `📎 ${lastMsg.fileName || 'File'}`;
    }
    return lastMsg.message;
  };

  const getLastMessageTime = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return chat.createdAt || chat.lastMessageAt;
    }
    return chat.messages[chat.messages.length - 1].timestamp;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      case 'resolved': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      return date.toLocaleDateString();
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

  // Render file message
  const renderFileMessage = (msg) => {
    const isImage = msg.messageType === 'image' || (msg.fileType && msg.fileType.startsWith('image/'));
    const fileName = msg.fileName || 'File';
    const fileSize = msg.fileSize ? formatFileSize(msg.fileSize) : '';
    const fileIcon = getFileIcon(msg.fileType || '');

    if (isImage && msg.fileUrl) {
      return (
        <div className="max-w-xs">
          <img 
            src={msg.fileUrl} 
            alt={fileName}
            className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(msg.fileUrl, '_blank')}
            onError={(e) => {
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
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-black truncate">{fileName}</div>
            {fileSize && <div className="text-xs text-gray-500">{fileSize}</div>}
          </div>
          <div className="flex space-x-1">
            {msg.fileUrl && (
              <button 
                onClick={() => window.open(msg.fileUrl, '_blank')}
                className="p-1 hover:bg-gray-200 rounded"
                title="View file"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      );
    }
  };

  // Fetch facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await getAllFacilities({ page: 1, limit: 100 });
        console.log(res, "response here");
        setFacilities(res.data?.facilities || res.facilities || []);
      } catch (err) {
        console.error("Failed to fetch all facilities:", err);
      }
    };

    fetchFacilities();
  }, []);

  // Combine chats and facilities, avoiding duplicates
  useEffect(() => {
    const chatFacilityIds = new Set(chats.map(chat => chat.facilityId?._id || chat.facilityId).filter(Boolean));
    
    const facilitiesWithoutChats = facilities.filter(facility => 
      !chatFacilityIds.has(facility._id)
    ).map(facility => ({
      ...facility,
      type: 'facility',
      facilityName: facility.name,
      facilityId: facility._id,
      messages: [],
      status: 'new',
      priority: 'medium'
    }));

    const existingChats = chats.map(chat => ({
      ...chat,
      type: 'chat'
    }));

    const combined = [...existingChats, ...facilitiesWithoutChats].sort((a, b) => {
      const timeA = a.type === 'chat' ? new Date(getLastMessageTime(a)) : new Date(a.createdAt || 0);
      const timeB = b.type === 'chat' ? new Date(getLastMessageTime(b)) : new Date(b.createdAt || 0);
      return timeB - timeA;
    });

    setAllItems(combined);
  }, [chats, facilities]);

  // Filter items based on search and filters
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.facilityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.messages?.some(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (item.type === 'chat') {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    }
    
    const matchesStatus = statusFilter === 'all' || statusFilter === 'new';
    return matchesSearch && matchesStatus;
  });

  // Auto-select facility/chat based on URL parameter
  useEffect(() => {
    if (chatId && allItems.length > 0 && !hasAutoSelected) {
      const existingChat = allItems.find(item => 
        item.type === 'chat' && (item._id === chatId || item.facilityId?._id === chatId || item.facilityId === chatId)
      );
      
      if (existingChat) {
        console.log('Found existing chat for ID:', chatId);
        handleSelectChatInternal(existingChat);
        setHasAutoSelected(true);
        return;
      }

      const facility = allItems.find(item => 
        item.type === 'facility' && item._id === chatId
      );
      
      if (facility) {
        console.log('Found facility for ID:', chatId);
        handleSelectChatInternal(facility);
        setHasAutoSelected(true);
        return;
      }

      const chatByFacility = allItems.find(item => 
        item.type === 'chat' && 
        (item.facilityId?._id === chatId || item.facilityId === chatId)
      );
      
      if (chatByFacility) {
        console.log('Found chat by facility ID:', chatId);
        handleSelectChatInternal(chatByFacility);
        setHasAutoSelected(true);
        return;
      }

      console.log('No chat or facility found for ID:', chatId);
    }
  }, [chatId, allItems, hasAutoSelected]);

  // Reset auto-selection flag when chatId changes
  useEffect(() => {
    setHasAutoSelected(false);
  }, [chatId]);

  // Handle URL routing - load chat when chatId changes
  useEffect(() => {
    if (chatId && allItems.length > 0 && !hasAutoSelected) {
      if (chatId.startsWith('new_')) {
        const facilityId = chatId.replace('new_', '');
        const facility = allItems.find(item => item.type === 'facility' && item._id === facilityId);
        if (facility) {
          handleSelectChatInternal(facility);
          setHasAutoSelected(true);
        }
      } else {
        const chat = allItems.find(item => item.type === 'chat' && item._id === chatId);
        if (chat) {
          handleSelectChatInternal(chat);
          setHasAutoSelected(true);
        }
      }
    }
  }, [chatId, allItems, hasAutoSelected]);

  // Load chats on component mount and when filters change
  useEffect(() => {
    if (role === "admin") {
      const filterParams = {};
      if (statusFilter !== 'all') filterParams.status = statusFilter;
      if (priorityFilter !== 'all') filterParams.priority = priorityFilter;
      fetchAllChats(filterParams);
    }
  }, [statusFilter, priorityFilter, role]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Internal function to handle chat selection without URL navigation
  const handleSelectChatInternal = async (item) => {
    if (activeChat && String(activeChat._id) === String(item._id)) return;

    try {
      if (activeChat) {
        // Leave previous chat room if exists
      }

      if (item.type === 'facility') {
        const facilityId = item._id;
        
        const tempChat = {
          _id: `temp_${facilityId}`,
          facilityId: facilityId,
          facilityName: item.name,
          email: item.email,
          messages: [],
          status: 'open',
          priority: 'medium',
          type: 'new_chat'
        };
        setActiveChat(tempChat);
        setMessages([]);
        
        try {
          const existingChat = await fetchChatByFacility(facilityId);
          if (existingChat) {
            navigate(`/admin-dashboard/conversations/${existingChat._id}`, { replace: true });
          }
        } catch (error) {
          console.log("No existing chat found, will create new one when message is sent");
        }
      } else {
        setActiveChat(item);
        setMessages(item.messages || []);

        if (item.facilityId?._id) {
          await fetchChatByFacility(item.facilityId._id);
        } else {
          selectChat(item);
        }

        markAsRead(item._id);
      }
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  };

  // Public function to handle chat selection with URL navigation
  const handleSelectChat = async (item) => {
    const chatId = item.type === 'facility' ? `new_${item._id}` : item._id;
    navigate(`/admin-dashboard/conversations/${chatId}`);
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !selectedFile) || sending) return;

    try {
      setSending(true);
      
      const messageData = {
        message: message.trim(),
        messageType: selectedFile ? (selectedFile.type.startsWith('image/') ? 'image' : 'file') : 'text'
      };

      if (selectedFile) {
        messageData.file = selectedFile;
      }

      await sendMessage(messageData);
      setMessage('');
      clearSelectedFile();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (status, priority) => {
    if (!activeChat) return;

    try {
      await updateChatStatus(activeChat._id, { status, priority });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleTyping = () => {
    sendTyping(true);
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className={`h-screen flex bg-gray-50 ${dragActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Chat Support</h1>
            <div className="flex items-center gap-2">
              {/* Connection status - only show when connected or retrying */}
              {isConnected ? (
                <div className="w-2 h-2 rounded-full bg-green-400" title="Connected"></div>
              ) : connectionRetrying ? (
                <div className="flex items-center gap-1">
                  <Loader className="w-3 h-3 text-blue-500 animate-spin" />
                  <span className="text-xs text-blue-600">Connecting...</span>
                </div>
              ) : null}
              
              <button
                onClick={refreshChats}
                disabled={loading}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total</div>
              <div className="text-lg font-semibold text-blue-900">{chatStats.totalChats || 0}</div>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Open</div>
              <div className="text-lg font-semibold text-green-900">{chatStats.openChats || 0}</div>
            </div>
            <div className="bg-yellow-50 p-2 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Unread</div>
              <div className="text-lg font-semibold text-yellow-900">{chatStats.unreadMessages || 0}</div>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Resolved</div>
              <div className="text-lg font-semibold text-purple-900">{chatStats.resolvedChats || 0}</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="resolved">Resolved</option>
              <option value="new">New Facilities</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Connection retry notification - only show when not connected and not retrying */}
          {/* {!isConnected && !connectionRetrying && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-700">Connection lost</span>
                <button 
                  onClick={handleConnectionRetry}
                  className="ml-auto text-orange-600 hover:text-orange-800 text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          )} */}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const typingUser = item.type === 'chat' ? getCurrentTypingForChat(item._id) : null;
              const isActive = activeChat?._id === item._id || 
                              (activeChat?.type === 'new_chat' && activeChat?.facilityId === item._id) ||
                              (activeChat?.facilityId?._id === item._id) ||
                              (activeChat?.facilityId === item._id);
              
              return (
                <div
                  key={item._id}
                  onClick={() => handleSelectChat(item)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isActive ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.type === 'facility' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <User className={`w-5 h-5 ${
                          item.type === 'facility' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.facilityName || item.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'facility' 
                              ? 'text-green-600 bg-green-100' 
                              : getStatusColor(item.status)
                          }`}>
                            {item.type === 'facility' ? 'new' : item.status}
                          </span>
                          {item.type === 'chat' && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {item.type === 'facility' 
                          ? formatDate(item.createdAt) 
                          : formatDate(getLastMessageTime(item))
                        }
                      </div>
                      {item.type === 'chat' && item.unreadCount?.admin > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1 ml-auto">
                          {item.unreadCount.admin}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {typingUser ? (
                    <p className="text-sm text-blue-600 italic">
                      {typingUser.facilityName} is typing...
                    </p>
                  ) : item.type === 'facility' ? (
                    <p className="text-sm text-gray-500 italic">
                      Click to start conversation
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 truncate">
                      {getLastMessage(item)}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{activeChat.facilityName || activeChat.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      {activeChat.facilityId?.email || activeChat.email || 'No email available'}
                    </div>
                  </div>
                </div>
                
                {activeChat.type !== 'new_chat' && (
                  <div className="flex items-center gap-2">
                    <select
                      value={activeChat.status || 'open'}
                      onChange={(e) => handleUpdateStatus(e.target.value, activeChat.priority)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    
                    <select
                      value={activeChat.priority || 'medium'}
                      onChange={(e) => handleUpdateStatus(activeChat.status, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isAdmin = msg.senderType === 'Admin';
                  const isFileMessage = msg.messageType === 'file' || msg.messageType === 'image';
                  const isUploading = msg.isUploading;
                  
                  return (
                    <div
                      key={index}
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isAdmin
                            ? 'bg-primarysolid text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {/* Upload progress indicator */}
                        {isUploading && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs">Uploading...</span>
                          </div>
                        )}
                        
                        {/* File content */}
                        {isFileMessage ? (
                          <div className="space-y-2">
                            {renderFileMessage(msg)}
                            {msg.message && msg.message !== msg.fileName && (
                              <div className="text-sm">{msg.message}</div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm">{msg.message}</p>
                        )}
                        
                        <div className={`text-xs mt-1 ${
                          isAdmin ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(msg.timestamp)}
                          {isUploading && (
                            <span className="ml-2">
                              <Upload className="w-3 h-3 inline animate-pulse" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="text-sm text-gray-600 flex items-center space-x-2">
                      <span>Facility is typing</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* Error Display */}
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

              <div className="flex items-center gap-3">
                {/* File Upload Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowFileInput(!showFileInput)}
                    className="p-2 text-gray-500 hover:text-primarysolid hover:bg-gray-100 rounded-full transition-all duration-200"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  {/* File input dropdown */}
                  {showFileInput && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px] z-50">
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

                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={selectedFile ? "Add a message (optional)..." : "Type your message..."}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={(!message.trim() && !selectedFile) || sending}
                  className="bg-primarysolid text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send
                </button>
              </div>

              {/* Status indicators */}
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
                </div>
                <div className="flex items-center space-x-2">
                  {Array.from(uploadingFiles).length > 0 && (
                    <span className="text-blue-600 font-medium flex items-center space-x-1">
                      <Upload className="w-3 h-3 animate-pulse" />
                      <span>Uploading {Array.from(uploadingFiles).length} file{Array.from(uploadingFiles).length > 1 ? 's' : ''}...</span>
                    </span>
                  )}
                  {isConnected && (
                    <span className="text-green-500 flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Online</span>
                    </span>
                  )}
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a facility from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default AdminChatPage;