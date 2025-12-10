import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './authcontext';

const AIChatContext = createContext();

// FIX: Make sure this includes /api
const API_BASE = import.meta.env.VITE_API_URL;

// Action types
const ACTION_TYPES = {
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_TYPING: 'SET_TYPING',
  SET_SUGGESTIONS: 'SET_SUGGESTIONS',
  SET_STATUS: 'SET_STATUS',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES'
};

// Reducer
const aiChatReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_MESSAGES:
      return { ...state, messages: action.payload };
    case ACTION_TYPES.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case ACTION_TYPES.SET_TYPING:
      return { ...state, isTyping: action.payload };
    case ACTION_TYPES.SET_SUGGESTIONS:
      return { ...state, suggestions: action.payload };
    case ACTION_TYPES.SET_STATUS:
      return { ...state, aiStatus: action.payload };
    case ACTION_TYPES.CLEAR_MESSAGES:
      return { ...state, messages: action.payload };
    default:
      return state;
  }
};

const initialState = {
  messages: [],
  isTyping: false,
  suggestions: [],
  aiStatus: 'loading'
};

export const AIChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(aiChatReducer, initialState);
  const { token, user } = useAuth();

  // Load initial data
  useEffect(() => {
    if (token) {
      checkAIStatus();
      loadSuggestions();
      loadConversationHistory(); 
    }
  }, [token]);

  const checkAIStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ai/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        dispatch({ type: ACTION_TYPES.SET_STATUS, payload: data.data.status });
      }
    } catch (error) {
      console.error('Failed to check AI status:', error);
      dispatch({ type: ACTION_TYPES.SET_STATUS, payload: 'offline' });
    }
  };

  const loadConversationHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ai/conversation`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        if (data.data.messages.length > 0) {
          dispatch({ type: ACTION_TYPES.SET_MESSAGES, payload: data.data.messages });
        } else {
          // Set initial welcome message
          const welcomeMessage = {
            id: 1,
            text: `Hi ${user?.firstName || 'there'}! I'm your AI Procurement Assistant. How can I help you today?`,
            sender: 'ai',
            timestamp: new Date().toISOString(),
          };
          dispatch({ type: ACTION_TYPES.SET_MESSAGES, payload: [welcomeMessage] });
        }
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ai/suggestions`, { // FIXED: Now includes /api/ai/suggestions
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        dispatch({ type: ACTION_TYPES.SET_SUGGESTIONS, payload: data.data.suggestions });
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const sendMessage = async (messageText) => {
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: userMessage });
    dispatch({ type: ACTION_TYPES.SET_TYPING, payload: true });
    
    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const aiResponse = {
          id: Date.now() + 1,
          text: data.data.response,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          metadata: data.data.metadata
        };
        
        dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: aiResponse });
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const fallbackResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: fallbackResponse });
    } finally {
      dispatch({ type: ACTION_TYPES.SET_TYPING, payload: false });
    }
  };

  const clearConversation = async () => {
    try {
      await fetch(`${API_BASE}/api/ai/conversation`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const welcomeMessage = {
        id: 1,
        text: `Hi ${user?.firstName || 'there'}! I'm your AI Procurement Assistant. How can I help you today?`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      dispatch({ type: ACTION_TYPES.CLEAR_MESSAGES, payload: [welcomeMessage] });
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };

  const value = {
    ...state,
    sendMessage,
    clearConversation,
    loadConversationHistory,
    loadSuggestions,
    checkAIStatus
  };

  return (
    <AIChatContext.Provider value={value}>
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};