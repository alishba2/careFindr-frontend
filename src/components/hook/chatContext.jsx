// contexts/ChatContext.js
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
  const { token, authData, role } = useAuth();

  console.log(authData, "aut data is here");

  // Chat state
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chat stats for admin
  const [chatStats, setChatStats] = useState({
    totalChats: 0,
    openChats: 0,
    closedChats: 0,
    resolvedChats: 0,
    unreadMessages: 0,
  });

  // Refs for cleanup
  const typingTimeoutRef = useRef(null);

  // Determine user type
  const isAdmin = role;

  // Initialize socket connection when token is available
  useEffect(() => {
    if (token && authData) {
      console.log("Connecting to chat socket...");
      chatService.connect(token);

      // Setup socket event listeners
      setupSocketListeners();

      // Fetch initial data
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
  }, [token, authData]);

  // Setup socket event listeners
  const setupSocketListeners = () => {
    // Connection status
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

    // Listen for new messages
    chatService.onNewMessage((data) => {
      console.log("New message received:", data);

      // Update active chat messages if it's the current chat
      if (activeChat && data.chatId === activeChat._id) {
        setMessages((prev) => [...prev, data.message]);
      }

      // Update chats list
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === data.chatId
            ? {
                ...chat,
                messages: [...(chat.messages || []), data.message],
                lastMessageAt: new Date(),
                unreadCount: data.unreadCount || chat.unreadCount,
              }
            : chat
        )
      );

      // Update unread count
      if (!isAdmin || (activeChat && data.chatId !== activeChat._id)) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Listen for typing indicators
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
            // Clear typing after 3 seconds
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

    // Listen for read status
    chatService.onMessagesRead((data) => {
      if (activeChat && data.chatId === activeChat._id) {
        // Update read status in UI
        console.log("Messages marked as read by:", data.readBy);
      }
    });

    // Listen for chat status updates
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

    // Listen for confirmations
    chatService.onMessageSent((data) => {
      if (data.success) {
        console.log("Message sent successfully");
      }
    });

    chatService.onMarkedRead((data) => {
      if (data.success) {
        setUnreadCount(0);
      }
    });

    // Listen for errors
    chatService.onError((error) => {
      console.error("Chat error:", error);
      setError(error.message);
    });
  };

  // Cleanup socket listeners
  const cleanupSocketListeners = () => {
    chatService.removeAllListeners();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // API Functions

  // Fetch all chats (admin only)
  const fetchAllChats = async (params = {}) => {
    if (!isAdmin || !token) return;

    try {
      setLoading(true);
      const response = await chatService.getAllChats(token, params);
      setChats(response.data.chats || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setError("Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat stats (admin only)
  const fetchChatStats = async () => {
    if (!isAdmin || !token) return;

    try {
      const response = await chatService.getChatStats(token);
      setChatStats(response.data);
    } catch (error) {
      console.error("Error fetching chat stats:", error);
    }
  };

  // Fetch facility chat
  const fetchFacilityChat = async () => {
    if (isAdmin || !token) return;

    try {
      setLoading(true);
      const response = await chatService.getFacilityChat(token);
      const chat = response.data;
      setActiveChat(chat);
      setMessages(chat.messages || []);
      setUnreadCount(chat.unreadCount?.facility || 0);
      setError(null);
    } catch (error) {
      console.error("Error fetching facility chat:", error);
      setError("Failed to fetch chat");
    } finally {
      setLoading(false);
    }
  };

  // Get specific facility chat (admin only)
  const fetchChatByFacility = async (facilityId) => {
    if (!isAdmin || !token) return;

    try {
      setLoading(true);
      const response = await chatService.getChatByFacility(token, facilityId);
      const chat = response.data;
      setActiveChat(chat);
      setMessages(chat.messages || []);

      // Join the chat room
      chatService.joinChat(chat._id);

      setError(null);
      return chat;
    } catch (error) {
      console.error("Error fetching facility chat:", error);
      setError("Failed to fetch chat");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (messageData) => {
    // if (!token || !activeChat) return;

    // new chat (random id) -- chat id (db)
    // when we want to call same coversation (id)
    // hisoty (id, id, id)

    try {
      const payload = {
        message: messageData.message,
        messageType: messageData.messageType || "text",
        fileUrl: messageData.fileUrl,
        fileName: messageData.fileName,
      };
      if (activeChat?._id) {
        payload.chatId = activeChat._id;
      }

      console.log(payload, "payload is here");

      // Send via socket for real-time
      if (chatService.isSocketConnected()) {
        chatService.sendMessageSocket(payload);
      } else {
        // Fallback to API if socket is not connected
        await chatService.sendMessage(token, payload);

        // Manually add message to state since no socket event
        const newMessage = {
          senderId: authData._id,
          senderType: isAdmin ? "Admin" : "Facility",
          senderName: isAdmin ? authData.fullName : authData.name,
          message: payload.message,
          messageType: payload.messageType,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }

      setError(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
      throw error;
    }
  };

  // Mark messages as read
  const markAsRead = async (chatId = null) => {
    const targetChatId = chatId || activeChat?._id;
    if (!token || !targetChatId) return;

    try {
      if (chatService.isSocketConnected()) {
        chatService.markAsReadSocket(targetChatId);
      } else {
        await chatService.markAsRead(token, targetChatId);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // Update chat status (admin only)
  const updateChatStatus = async (chatId, statusData) => {
    if (!isAdmin || !token) return;

    try {
      if (chatService.isSocketConnected()) {
        chatService.updateChatStatusSocket(chatId, statusData);
      } else {
        await chatService.updateChatStatus(token, chatId, statusData);

        // Update local state
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

  // Send typing indicator
  const sendTyping = (isTypingNow) => {
    if (!activeChat || !chatService.isSocketConnected()) return;

    const facilityId = isAdmin ? activeChat.facilityId : authData._id;
    chatService.sendTyping(activeChat._id, isTypingNow, facilityId);
  };

  // Select active chat
  const selectChat = async (chat) => {
    // Leave previous chat room
    if (activeChat) {
      chatService.leaveChat(activeChat._id);
    }

    setActiveChat(chat);
    setMessages(chat.messages || []);

    // Join new chat room
    chatService.joinChat(chat._id);

    // Mark as read
    markAsRead(chat._id);
  };

  // Refresh data
  const refreshChats = () => {
    if (isAdmin) {
      fetchAllChats();
      fetchChatStats();
    } else {
      fetchFacilityChat();
    }
  };

  // Context value
  const contextValue = {
    // State
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

    // Actions
    sendMessage,
    markAsRead,
    updateChatStatus,
    sendTyping,
    selectChat,
    fetchAllChats,
    fetchChatStats,
    fetchFacilityChat,
    fetchChatByFacility,
    refreshChats,

    // Utilities
    setError,
    setActiveChat,
    setMessages,
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
