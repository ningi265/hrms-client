import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Minus,
  Square,
  MoreHorizontal,
  Copy,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../authcontext/authcontext";

// Initial welcome message from AI
const createInitialMessage = (firstName) => {
  return [
    {
      id: 1,
      text: `Hi ${firstName || 'there'}! I'm your AI Assistant. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
    }
  ];
};

// Clean suggestions
const suggestions = [
  "Create new requisition",
  "Pending approvals",
  "Procurement workflow",
  "Vendor selection",
  "Generate report",
  "Policy updates"
];

// Main Component
const AIChatButton = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => createInitialMessage(user?.firstName));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatModalRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, isMinimized]);

  // Handle clicks outside the chat modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatModalRef.current && !chatModalRef.current.contains(event.target)) {
        // Check if the click was not on the chat button itself
        const chatButton = document.querySelector('.ai-chat-button');
        if (!chatButton?.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => setIsOpen(false);
  const handleMinimize = () => setIsMinimized(!isMinimized);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    const newUserMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: getAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! I can help with requisitions, approvals, vendors, and reports. What do you need?";
    } else if (input.includes('requisition') || input.includes('create')) {
      return "To create a requisition:\n• Go to Requisitions → New\n• Add item details and budget\n• Submit for approval\n\nNeed specific help?";
    } else if (input.includes('approval') || input.includes('pending')) {
      return "You have 8 pending items:\n• 5 requisitions\n• 2 purchase orders\n• 1 invoice\n\nShall I prioritize them?";
    } else if (input.includes('vendor') || input.includes('supplier')) {
      return "Vendor selection factors:\n• Performance history\n• Cost competitiveness\n• Reliability score\n• Compliance status\n\nNeed vendor analysis?";
    } else if (input.includes('workflow') || input.includes('process')) {
      return "Procurement steps:\n• Create requisition\n• Manager approval\n• Vendor selection\n• Purchase order\n• Delivery & payment\n\nWhich step needs help?";
    } else if (input.includes('report')) {
      return "Available reports:\n• Spend analysis\n• Vendor performance\n• Budget status\n• Compliance metrics\n\nWhich report do you need?";
    } else if (input.includes('policy')) {
      return "Recent updates:\n• Travel limit: $750\n• Auto-approval: $1,000\n• Sustainability guidelines\n\nMore details needed?";
    } else {
      return `I can help you with "${userInput}". Would you like:\n• Step-by-step guidance\n• Related documentation\n• Process automation\n• Expert consultation`;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Ultra-clean floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpen}
            className="ai-chat-button fixed bottom-5 right-5 w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-150"
          >
            <MessageCircle size={18} strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Ultra-clean chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatModalRef}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`fixed bottom-5 right-5 z-50 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden ${
              isMinimized ? 'w-72 h-12' : 'w-80 h-96'
            } transition-all duration-200`}
          >
            {/* Minimal header */}
            <div className="bg-white border-b border-gray-100 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                  <Bot size={12} strokeWidth={2} className="text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-800">AI Assistant</span>
                {isTyping && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>}
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={handleMinimize}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-150"
                >
                  {isMinimized ? <Square size={12} /> : <Minus size={12} />}
                </button>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-150 ml-1"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Clean messages area */}
                <div className="h-64 overflow-y-auto bg-gray-50">
                  <div className="p-3 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-slate-800 text-white' 
                            : 'bg-white border border-gray-200 text-slate-600'
                        }`}>
                          {message.sender === 'user' ? 
                            <User size={10} strokeWidth={2} /> : 
                            <Bot size={10} strokeWidth={2} />
                          }
                        </div>

                        <div className="flex-1 max-w-60">
                          <div className={`inline-block px-3 py-2 rounded-lg text-sm leading-relaxed ${
                            message.sender === 'user'
                              ? 'bg-slate-800 text-white'
                              : 'bg-white border border-gray-200 text-slate-700'
                          }`}>
                            {message.text}
                          </div>
                          
                          {message.sender === 'ai' && (
                            <div className="flex items-center gap-1 mt-1 opacity-0 hover:opacity-100 transition-opacity duration-200">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <ThumbsUp size={10} strokeWidth={1.5} className="text-gray-400" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <ThumbsDown size={10} strokeWidth={1.5} className="text-gray-400" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Copy size={10} strokeWidth={1.5} className="text-gray-400" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-2">
                        <div className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                          <Bot size={10} strokeWidth={2} className="text-slate-600" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </div>

                {/* Minimal suggestions */}
                <div className="border-t border-gray-100 p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {suggestions.slice(0, 4).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-2 py-1.5 text-xs text-slate-600 bg-gray-50 hover:bg-gray-100 rounded border-0 transition-colors duration-150 text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ultra-clean input */}
                <div className="border-t border-gray-100 p-3">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 text-sm placeholder-gray-400 transition-all duration-150"
                    />
                    <button
                      onClick={handleSend}
                      disabled={inputText.trim() === ''}
                      className="p-2 bg-slate-800 hover:bg-slate-700 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-lg transition-colors duration-150"
                    >
                      <Send size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatButton;