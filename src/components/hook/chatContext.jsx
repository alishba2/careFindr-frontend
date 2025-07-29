import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "./auth";
import chatService from "../../services/chatService";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const {token, authData, role } = useAuth();

  

  console.log(authData, "auth data is here");

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]



  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState(new Set());

  const [chatStats, setChatStats] = useState({
    totalChats: 0,
    openChats: 0,
    closedChats: 0,
    resolvedChats: 0,
    unreadMessages: 0,
  });

  const typingTimeoutRef = useRef(null);

  const isAdmin = localStorage.getItem("userType") === "admin";

  useEffect(() => {
    console.log(token, authData, "testing here");
    
    
    if (token && authData) {
      console.log("Connecting to chat socket...");
      chatService.connect(token);

      setupSocketListeners();

      console.log(isAdmin, "isAdmin is here");

      if (isAdmin) {

        fetchAllChats();
        fetchChatStats();
      } else {
        fetchFacilityChat();
      }

      return () => {
        cleanupSocketListeners();
      };
    }
  }, [token, authData, isAdmin]);

  const setupSocketListeners = () => {
    const socket = chatService.getSocket();
    if (socket) {
      socket.on("connect", () => {
        console.log("Chat socket connected");
        setIsConnected(true);
        setError(null);
      });

      socket.on("disconnect", () => {
        console.log("Chat socket disconnected");
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("Chat socket connection error:", error);
        setIsConnected(false);
        setError("Connection failed");
      });
    }

    chatService.onNewMessage((data) => {
      console.log("New message received:", data);

      const isOwnMessage = data.message.senderId === authData._id;

      if (activeChat && data.chatId === activeChat._id) {
        if (!isOwnMessage) {
          setMessages((prev) => [...prev, data.message]);
        }
      }

      setChats((prev) =>
        prev.map((chat) => {
          if (chat._id === data.chatId) {
            if (isOwnMessage) {
              return {
                ...chat,
                lastMessageAt: new Date(),
                unreadCount: data.unreadCount || chat.unreadCount,
              };
            } else {
              return {
                ...chat,
                messages: [...(chat.messages || []), data.message],
                lastMessageAt: new Date(),
                unreadCount: data.unreadCount || chat.unreadCount,
              };
            }
          }
          return chat;
        })
      );

      if (!isOwnMessage) {
        if (isAdmin) {
          if (!activeChat || data.chatId !== activeChat._id) {
            setUnreadCount((prev) => prev + 1);
          }
        } else {
          setUnreadCount((prev) => prev + 1);
        }
      }
    });

    if (isAdmin) {
      chatService.onFacilityTyping((data) => {
        setTypingUsers((prev) => {
          const filtered = prev.filter(
            (user) => user.facilityId !== data.facilityId
          );
          if (data.isTyping) {
            return [
              ...filtered,
              {
                facilityId: data.facilityId,
                facilityName: data.facilityName,
                chatId: data.chatId,
              },
            ];
          }
          return filtered;
        });
      });
    } else {
      chatService.onAdminTyping((data) => {
        if (activeChat && data.chatId === activeChat._id) {
          setIsTyping(data.isTyping);
          if (data.isTyping) {
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
            }, 3000);
          }
        }
      });
    }

    chatService.onMessagesRead((data) => {
      if (activeChat && data.chatId === activeChat._id) {
        console.log("Messages marked as read by:", data.readBy);
      }
    });

    chatService.onChatStatusUpdated((data) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === data.chatId
            ? {
                ...chat,
                status: data.status,
                priority: data.priority,
                assignedTo: data.assignedTo,
              }
            : chat
        )
      );

      if (activeChat && data.chatId === activeChat._id) {
        setActiveChat((prev) => ({
          ...prev,
          status: data.status,
          priority: data.priority,
          assignedTo: data.assignedTo,
        }));
      }
    });

    chatService.onMessageSent((data) => {
      if (data.success) {
        console.log("Message sent successfully");
        
        if (data.message && data.message.fileUrl) {
          setUploadingFiles(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.message.fileName);
            return newSet;
          });
        }
        
        if (activeChat && (activeChat.type === 'new_chat' || activeChat._id?.startsWith('temp_'))) {
          setActiveChat(prev => ({
            ...prev,
            _id: data.chatId,
            type: 'chat'
          }));
          
          setChats(prev => {
            const existingChat = prev.find(c => c._id === data.chatId);
            if (!existingChat) {
              return [{
                _id: data.chatId,
                facilityId: activeChat.facilityId,
                facilityName: activeChat.facilityName,
                messages: [data.message],
                status: 'open',
                priority: 'medium',
                type: 'chat',
                lastMessageAt: new Date(),
                unreadCount: { admin: 0, facility: 0 }
              }, ...prev];
            }
            return prev;
          });
        }
      }
    });

    chatService.onMarkedRead((data) => {
      if (data.success) {
        setUnreadCount(0);
      }
    });

    chatService.onError((error) => {
      console.error("Chat error:", error);
      setError(error.message);
    });
  };

  const cleanupSocketListeners = () => {
    chatService.removeAllListeners();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const fetchAllChats = async (params = {}) => {
    if (!isAdmin || !token) return;

    try {
      setLoading(true);
      const response = await chatService.getAllChats(params);
      const chatsData = response.data.chats || [];
      
      const chatsWithMessages = chatsData.map(chat => ({
        ...chat,
        messages: chat.messages || []
      }));
      
      setChats(chatsWithMessages);
      setError(null);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setError("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const fetchChatStats = async () => {
    if (!isAdmin || !token) return;

    try {
      const response = await chatService.getChatStats();
      setChatStats(response.data);
    } catch (error) {
      console.error("Error fetching chat stats:", error);
    }
  };

  const fetchFacilityChat = async () => {
    if (isAdmin || !token) return;

    try {
      setLoading(true);
      const response = await chatService.getFacilityChat();
      const chat = response.data;
      setActiveChat(chat);
      setMessages(chat.messages || []);
      setUnreadCount(chat.unreadCount?.facility || 0);
      setError(null);
    } catch (error) {
      console.error("Error fetching facility chat:", error);
      setError("Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  const fetchChatByFacility = async (facilityId) => {
    if (!isAdmin || !token) return;

    try {
      setLoading(true);
      const response = await chatService.getChatByFacility(facilityId);
      const chat = response.data;
      
      setActiveChat(chat);
      setMessages(chat.messages || []);

      setChats(prev => prev.map(c => 
        c._id === chat._id ? { ...c, ...chat } : c
      ));

      if (activeChat && activeChat._id !== chat._id && !activeChat._id?.startsWith('temp_')) {
        chatService.leaveChat(activeChat._id);
      }

      chatService.joinChat(chat._id);
      
      markAsRead(chat._id);

      setError(null);
      return chat;
    } catch (error) {
      console.error("Error fetching chat by facility:", error);
      setError("Failed to load chat");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageData) => {
    if (!token || !activeChat) return;

    try {
      console.log("📤 Sending message:", messageData);

      if (messageData.file) {
        try {
          chatService.validateFile(messageData.file);
        } catch (validationError) {
          setError(validationError.message);
          throw validationError;
        }

        const payload = {
          message: messageData.message || messageData.file.name,
          messageType: messageData.messageType || 'file',
          file: messageData.file
        };

        if (activeChat.type === 'new_chat' || activeChat._id?.startsWith('temp_')) {
          payload.facilityId = activeChat.facilityId?._id || activeChat.facilityId;
          console.log("Starting new conversation with facility:", payload.facilityId);
        } else {
          payload.chatId = activeChat._id;
        }

        console.log("📤 Sending file message via FormData:", {
          messageType: payload.messageType,
          fileName: payload.file.name,
          fileSize: payload.file.size,
          chatId: payload.chatId,
          facilityId: payload.facilityId
        });

        setUploadingFiles(prev => new Set([...prev, messageData.file.name]));

        const newMessage = {
          senderId: authData._id,
          senderType: isAdmin ? "Admin" : "Facility",
          senderName: isAdmin ? authData.fullName : authData.name,
          message: payload.message,
          messageType: messageData.file.type.startsWith('image/') ? 'image' : 'file',
          fileName: messageData.file.name,
          fileSize: messageData.file.size,
          fileType: messageData.file.type,
          timestamp: new Date(),
          fileUrl: messageData.file.type.startsWith('image/') ? URL.createObjectURL(messageData.file) : null,
          isUploading: true
        };

        setMessages((prev) => [...prev, newMessage]);

        try {
          const response = await chatService.sendMessageWithFile(payload);
          
          if (response.success) {
            setMessages((prev) => prev.map((msg, index) => {
              if (index === prev.length - 1 && msg.isUploading) {
                if (msg.fileUrl && msg.fileUrl.startsWith('blob:')) {
                  URL.revokeObjectURL(msg.fileUrl);
                }
                return {
                  ...response.data.message,
                  senderId: authData._id,
                  senderType: isAdmin ? "Admin" : "Facility",
                  senderName: isAdmin ? authData.fullName : authData.name,
                  isUploading: false
                };
              }
              return msg;
            }));

            console.log("✅ File uploaded successfully:", response.data.message);
          }
        } catch (uploadError) {
          console.error("❌ File upload failed:", uploadError);
          
          setMessages((prev) => prev.filter((msg, index) => !(index === prev.length - 1 && msg.isUploading)));
          
          setUploadingFiles(prev => {
            const newSet = new Set(prev);
            newSet.delete(messageData.file.name);
            return newSet;
          });
          
          throw uploadError;
        }

      } else {
        const payload = {
          message: messageData.message,
          messageType: messageData.messageType || "text",
        };
        
        if (activeChat.type === 'new_chat' || activeChat._id?.startsWith('temp_')) {
          payload.facilityId = activeChat.facilityId?._id || activeChat.facilityId;
          console.log("Starting new conversation with facility:", payload.facilityId);
        } else {
          payload.chatId = activeChat._id;
        }

        console.log("📤 Sending text message:", payload);

        const newMessage = {
          senderId: authData._id,
          senderType: isAdmin ? "Admin" : "Facility",
          senderName: isAdmin ? authData.fullName : authData.name,
          message: payload.message,
          messageType: payload.messageType,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
        
        if (chatService.isSocketConnected()) {
          chatService.sendMessageSocket(payload);
        } else {
          await chatService.sendMessage(payload);
        }
      }

      if (!activeChat.type || activeChat.type === 'chat') {
        setChats(prev => prev.map(chat => 
          chat._id === activeChat._id 
            ? { 
                ...chat, 
                lastMessageAt: new Date()
              }
            : chat
        ));
      }

      setError(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message || "Failed to send message");
      
      if (!messageData.file) {
        setMessages((prev) => prev.slice(0, -1));
      }
      
      throw error;
    }
  };

  const uploadFile = async (file, message = '') => {
    if (!file) throw new Error('No file selected');
    
    return await sendMessage({
      file: file,
      message: message,
      messageType: 'file'
    });
  };

  const markAsRead = async (chatId = null) => {
    const targetChatId = chatId || activeChat?._id;
    if (!token || !targetChatId) return;

    try {
      if (chatService.isSocketConnected()) {
        chatService.markAsReadSocket(targetChatId);
      } else {
        await chatService.markAsRead(targetChatId);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const updateChatStatus = async (chatId, statusData) => {
    if (!isAdmin || !token) return;

    try {
      if (chatService.isSocketConnected()) {
        chatService.updateChatStatusSocket(chatId, statusData);
      } else {
        await chatService.updateChatStatus(chatId, statusData);

        setChats((prev) =>
          prev.map((chat) =>
            chat._id === chatId ? { ...chat, ...statusData } : chat
          )
        );

        if (activeChat && chatId === activeChat._id) {
          setActiveChat((prev) => ({ ...prev, ...statusData }));
        }
      }
    } catch (error) {
      console.error("Error updating chat status:", error);
      throw error;
    }
  };

  const sendTyping = (isTypingNow) => {
    if (!activeChat || !chatService.isSocketConnected()) return;

    const facilityId = isAdmin ? activeChat.facilityId : authData._id;
    chatService.sendTyping(activeChat._id, isTypingNow, facilityId);
  };

  const selectChat = async (chat) => {
    try {
      if (activeChat && activeChat._id !== chat._id && !activeChat._id?.startsWith('temp_')) {
        chatService.leaveChat(activeChat._id);
      }

      setActiveChat(chat);
      setMessages(chat.messages || []);

      if (chat._id && !chat._id.startsWith('temp_')) {
        chatService.joinChat(chat._id);
        console.log(`Joined chat room: ${chat._id}`);
      }

      markAsRead(chat._id);
      
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  };

  const refreshChats = () => {
    if (isAdmin) {
      fetchAllChats();
      fetchChatStats();
    } else {
      fetchFacilityChat();
    }
  };

  const contextValue = {
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
    uploadProgress,
    uploadingFiles,

    sendMessage,
    uploadFile,
    markAsRead,
    updateChatStatus,
    sendTyping,
    selectChat,
    fetchAllChats,
    fetchChatStats,
    fetchFacilityChat,
    fetchChatByFacility,
    refreshChats,

    setError,
    setActiveChat,
    setMessages,
    validateFile: chatService.validateFile,
    getFileIcon: chatService.getFileIcon,
    formatFileSize: chatService.formatFileSize,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};