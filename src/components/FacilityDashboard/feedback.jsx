// File: src/pages/dashboard/Feedback.jsx
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../hook/chatContext";

import { Send, Paperclip, Smile, MoreVertical } from "lucide-react";

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
    markAsRead
  } = useChat();

  const [messageText, setMessageText] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    console.log(messageText,"message text is here");
    
    try {
      await sendMessage({
        message: messageText,
        messageType: 'text'
      });
      setMessageText('');
      
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // if (error && !activeChat) {
  //   return (
  //     <div className="flex items-center justify-center h-96">
  //       <div className="text-center">
  //         <div className="text-red-500 mb-2">⚠️</div>
  //         <p className="text-red-600">{error}</p>
  //         <button 
  //           onClick={() => window.location.reload()} 
  //           className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Support Chat</h2>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            {activeChat?.status && (
              <>
                <span className="text-gray-400">•</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeChat.status === 'open' ? 'bg-green-100 text-green-800' :
                  activeChat.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {activeChat.status}
                </span>
              </>
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!activeChat ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">💬</div>
              <p>Starting your support conversation...</p>
            </div>
          </div>
        ) : Object.keys(messageGroups).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">👋</div>
              <p className="text-lg mb-2">Welcome to Support!</p>
              <p className="text-sm">Send a message below to get started.</p>
            </div>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {date}
                </div>
              </div>
              
              {/* Messages for this date */}
              {dayMessages.map((message, index) => {
                const isAdmin = message.senderType === 'Admin';
                return (
                  <div key={index} className="flex justify-end mb-3">
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isAdmin 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {isAdmin && (
                        <div className="text-xs font-semibold mb-1 text-blue-600">
                          {message.senderName}
                        </div>
                      )}
                      <div className="break-words">{message.message}</div>
                      <div className={`text-xs mt-1 ${
                        isAdmin ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg max-w-xs">
              <div className="flex items-center space-x-1">
                <span>Admin is typing</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-gray-50 p-4">
        {error && (
          <div className="mb-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <div className="flex items-end space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="1"
              style={{
                minHeight: '44px',
                maxHeight: '120px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              disabled={!isConnected}
            />
          </div>
          
          <button 
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !isConnected}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex space-x-4">
            <span>Press Enter to send</span>
            {unreadCount > 0 && (
              <span className="text-blue-600 font-semibold">
                {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {isUserTyping && (
            <span className="text-blue-600">Typing...</span>
          )}
        </div>
      </div>
    </div>
  );
}