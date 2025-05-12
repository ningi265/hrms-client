import React, { useState, useRef, useEffect } from "react";
import {
  Fab,
  Popover,
  IconButton,
  TextField,
  Box,
  Typography,
  Avatar,
  Paper,
  InputAdornment,
  Divider,
  Zoom,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  alpha,
  styled
} from "@mui/material";
import {
  SmartToy,
  Close,
  Send,
  ExpandMore,
  ExpandLess,
  MoreVert,
  Star,
  StarBorder,
  Refresh,
  Help,
  Settings,
  DeleteOutline,
  ChatBubbleOutline
} from "@mui/icons-material";
import { useAuth } from "../../authcontext/authcontext"; 

// Styled components
const ChatFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  zIndex: 1200,
  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
    background: theme.palette.primary.dark,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    opacity: 0,
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      opacity: 0.7,
    },
    '70%': {
      transform: 'scale(1.1)',
      opacity: 0.3,
    },
    '100%': {
      transform: 'scale(0.95)',
      opacity: 0,
    },
  },
}));

const MessageContainer = styled(Box)(({ theme, owner }) => ({
  display: 'flex',
  justifyContent: owner === 'user' ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1.5),
  width: '100%',
}));

const MessageBubble = styled(Paper)(({ theme, owner }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: '80%',
  borderRadius: owner === 'user' 
    ? theme.spacing(2, 0, 2, 2) 
    : theme.spacing(0, 2, 2, 2),
  backgroundColor: owner === 'user' 
    ? theme.palette.primary.main 
    : theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : alpha(theme.palette.grey[100], 1),
  color: owner === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: owner === 'user'
    ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`
    : theme.shadows[1],
  position: 'relative',
  '&:after': owner === 'user' ? {
    content: '""',
    position: 'absolute',
    right: -10,
    top: 0,
    width: 0,
    height: 0,
    borderTop: `10px solid ${theme.palette.primary.main}`,
    borderRight: '10px solid transparent',
  } : owner === 'ai' ? {
    content: '""',
    position: 'absolute',
    left: -10,
    top: 0,
    width: 0,
    height: 0,
    borderTop: `10px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : alpha(theme.palette.grey[100], 1)}`,
    borderLeft: '10px solid transparent',
  } : {},
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(3),
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.background.paper, 0.6) 
      : alpha(theme.palette.background.paper, 1),
    boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.08)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.12)}`,
    },
    '&.Mui-focused': {
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.divider, 0.3),
    },
  },
}));

// Initial welcome message from AI
const createInitialMessage = (firstName) => {
  return [
    {
      id: 1,
      text: `Hi ${firstName || 'there'}! 👋 I'm your AI assistant. How can I help you with your procurement tasks today?`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
    }
  ];
};

// Suggestions for quick replies
const suggestions = [
  "How do I create a new requisition?",
  "Show me pending approvals",
  "Explain procurement workflow",
  "Help with vendor selection"
];

// Main Component
const AIChatButton = ({ user }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
   const [messages, setMessages] = useState(() => createInitialMessage(user?.firstName));
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const messagesEndRef = useRef(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const inputRef = useRef(null);
  const fabRef = useRef(null);
  const open = Boolean(anchorEl);
  const { user: authUser, loading: authLoading } = useAuth();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    setTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: getAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple mock AI response function
  const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi ') || input.includes('hey')) {
      return "Hello! How can I assist you with your procurement needs today?";
    } else if (input.includes('requisition') || input.includes('create') || input.includes('new req')) {
      return "To create a new requisition, go to the Requisitions section and click the '+ New Requisition' button. You'll need to fill out the item details, justification, and select a department budget code.";
    } else if (input.includes('approval') || input.includes('pending')) {
      return "You currently have 8 items pending approval. Would you like me to show you the list or help prioritize them?";
    } else if (input.includes('vendor') || input.includes('supplier')) {
      return "For vendor selection, you can review the vendor ratings in the Vendors section. Our system recommends suppliers based on past performance metrics like delivery time, quality, and cost.";
    } else if (input.includes('workflow') || input.includes('process')) {
      return "The procurement workflow follows these steps: 1) Requisition creation, 2) Manager approval, 3) RFQ generation, 4) Vendor bidding, 5) Purchase order creation, 6) Delivery confirmation, and 7) Invoice payment.";
    } else if (input.includes('help') || input.includes('support')) {
      return "I'm here to help! You can ask me about requisitions, purchase orders, invoices, vendor management, or any other procurement task you need assistance with.";
    } else {
      return "Thanks for your question. I'll look into that for you. Is there anything specific about the procurement process you'd like to know?";
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    // Focus the input after selecting a suggestion
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating AI Chat Button */}
      <ChatFab 
        color="primary" 
        aria-label="ai chat" 
        onClick={handleClickOpen}
        ref={fabRef}
      >
        <SmartToy />
      </ChatFab>
      
      {/* Chat Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: fullScreen ? '100%' : 400,
            maxHeight: fullScreen ? '100%' : '80vh',
            height: fullScreen ? '100vh' : 600,
            mb: 1, // Small margin from the button
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: theme.shadows[10],
          },
        }}
        TransitionComponent={Zoom}
      >
        {/* Dialog Header */}
        <AppBar position="static" color="transparent" elevation={0} sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          <Toolbar sx={{ minHeight: 64, px: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  width: 40, 
                  height: 40,
                }}
              >
                <SmartToy />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  AI Assistant
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {typing ? 'Typing...' : 'Online'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
              <IconButton size="small" onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Chat Messages Area */}
        <Box sx={{ 
          p: 2, 
          flexGrow: 1, 
          overflowY: 'auto',
          display: expanded ? 'block' : 'none',
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.6) : alpha(theme.palette.grey[50], 0.8),
        }}>
          {messages.map((message) => (
            <MessageContainer key={message.id} owner={message.sender}>
              {message.sender === 'ai' && (
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    mr: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <SmartToy fontSize="small" />
                </Avatar>
              )}
              
              <MessageBubble owner={message.sender} elevation={0}>
                <Typography variant="body2">
                  {message.text}
                </Typography>
                <Typography 
                  variant="caption" 
                  color={message.sender === 'user' ? alpha(theme.palette.primary.contrastText, 0.7) : "text.secondary"}
                  sx={{ display: 'block', textAlign: 'right', mt: 0.5, fontSize: '0.7rem' }}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </MessageBubble>
              
              {message.sender === 'user' && (
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    ml: 1,
                    bgcolor: theme.palette.primary.dark,
                  }}
                >
                  {/* First letter of the user's name, can be replaced with actual data */}
                   {user.firstName ? user.firstName.split(" ").map(n => n[0]).join("") : "GU"}
                </Avatar>
              )}
            </MessageContainer>
          ))}
          
          {/* Typing indicator */}
          {typing && (
            <MessageContainer owner="ai">
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  mr: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <SmartToy fontSize="small" />
              </Avatar>
              <MessageBubble owner="ai" elevation={0}>
                <Box sx={{ display: 'flex', gap: 0.5, p: 0.5 }}>
                  <span className="typing-dot" style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: theme.palette.text.secondary,
                    opacity: 0.7,
                    animation: 'typingAnimation 1.4s infinite ease-in-out',
                    animationDelay: '0s',
                  }} />
                  <span className="typing-dot" style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: theme.palette.text.secondary,
                    opacity: 0.7,
                    animation: 'typingAnimation 1.4s infinite ease-in-out',
                    animationDelay: '0.2s',
                  }} />
                  <span className="typing-dot" style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: theme.palette.text.secondary,
                    opacity: 0.7,
                    animation: 'typingAnimation 1.4s infinite ease-in-out',
                    animationDelay: '0.4s',
                  }} />
                </Box>
                <style jsx>{`
                  @keyframes typingAnimation {
                    0%, 100% {
                      transform: translateY(0);
                    }
                    50% {
                      transform: translateY(-5px);
                    }
                  }
                `}</style>
              </MessageBubble>
            </MessageContainer>
          )}
          
          <div ref={messagesEndRef} />
        </Box>
        
        {/* Quick suggestions */}
        {expanded && (
          <Box sx={{ 
            p: 1.5, 
            overflowX: 'auto',
            display: 'flex',
            gap: 1,
            borderTop: `1px solid ${theme.palette.divider}`, 
          }}>
            {suggestions.map((suggestion, index) => (
              <Box
                key={index}
                component="button"
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  cursor: 'pointer',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: theme.spacing(2),
                  py: 0.75,
                  px: 1.5,
                  backgroundColor: 'transparent',
                  color: theme.palette.primary.main,
                  fontSize: '0.75rem',
                  fontFamily: theme.typography.fontFamily,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                {suggestion}
              </Box>
            ))}
          </Box>
        )}
        
        {/* Input Area */}
        {expanded && (
          <Box sx={{ 
            p: 2, 
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}>
            <StyledTextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              inputRef={inputRef}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      color="primary" 
                      onClick={handleSend}
                      disabled={inputText.trim() === ''}
                      sx={{
                        transition: 'all 0.2s ease',
                        transform: inputText.trim() === '' ? 'scale(0.9)' : 'scale(1)',
                        opacity: inputText.trim() === '' ? 0.7 : 1,
                      }}
                    >
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ m: 0 }}
            />
          </Box>
        )}
      </Popover>
    </>
  );
};

export default AIChatButton;