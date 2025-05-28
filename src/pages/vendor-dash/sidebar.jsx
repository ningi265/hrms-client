import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Badge,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  styled,
  alpha,
  Avatar
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

// Modern color palette with a professional look
const sidebarColors = {
  background: '#141b2d', // Rich dark blue
  headerBg: '#1f2940',
  itemHover: 'rgba(145, 158, 171, 0.08)',
  itemSelected: 'rgba(85, 105, 255, 0.16)',
  itemSelectedText: '#5569ff',
  itemSelectedHover: 'rgba(85, 105, 255, 0.24)',
  text: '#e0e0e0',
  textSecondary: 'rgba(224, 224, 224, 0.6)',
  iconColor: '#90a0b7',
  iconSelectedColor: '#5569ff',
  divider: 'rgba(145, 158, 171, 0.16)',
};

// Modern SVG Icons
const ModernIcons = {
  Dashboard: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),

  RFQs: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  PurchaseOrders: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
   Invoices: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 15h0M2 9.5h20" />
      <path d="M12 15h5" />
    </svg>
  ),
  Reconciliation: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.5 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  Analytics: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  Reports: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="m4.93 10.93 2.83-2.83" />
      <path d="M16.24 16.24 19.07 19.07" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="m10.93 4.93-2.83 2.83" />
      <path d="M16.24 7.76 19.07 4.93" />
    </svg>
  ),
  Settings: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Logout: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

// Styled components with seamless design
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  color: sidebarColors.text,
  margin: '2px 12px',
  padding: '10px 16px',
  borderRadius: '6px',
  transition: 'all 0.15s ease-in-out',
  '&.Mui-selected': { 
    backgroundColor: sidebarColors.itemSelected,
    color: sidebarColors.itemSelectedText,
    '&:hover': { 
      backgroundColor: sidebarColors.itemSelectedHover 
    },
    '& .MuiListItemIcon-root': {
      color: sidebarColors.itemSelectedText,
    },
    '& .MuiTypography-root': {
      fontWeight: 500,
    }
  },
  '&:hover': { 
    backgroundColor: sidebarColors.itemHover,
  },
}));

const SidebarGroupLabel = styled(Typography)(({ theme, open }) => ({
  color: sidebarColors.textSecondary,
  fontSize: '0.6875rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  padding: open ? '16px 28px 6px' : '16px 0',
  letterSpacing: '0.6px',
  textAlign: open ? 'left' : 'center',
  opacity: open ? 1 : 0,
  height: open ? 'auto' : 0,
  marginBottom: open ? '4px' : 0,
  transition: 'opacity 0.2s ease, height 0.2s ease, margin 0.2s ease',
}));

// Improved drawer with smooth transitions
const SeamlessSidebarDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile'
})(({ theme, open, isMobile }) => ({
  width: open ? 256 : 70,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  '& .MuiDrawer-paper': {
    backgroundColor: sidebarColors.background,
    borderRight: 'none',
    width: open ? 256 : (isMobile ? 0 : 70),
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),
  },
}));

const MenuItemIcon = styled(ListItemIcon)(({ theme, selected }) => ({
  minWidth: 0,
  marginRight: 16,
  justifyContent: 'center',
  color: selected ? sidebarColors.iconSelectedColor : sidebarColors.iconColor,
  transition: 'color 0.15s ease, transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

// Drawer Header - seamless with the rest of the sidebar
const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // Center for collapsed mode
  padding: '20px 12px 10px',
  backgroundColor: 'transparent',
}));

const LogoContainer = styled(Box)(({ theme, open }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: open ? 'space-between' : 'center',
  transition: 'all 0.3s ease',
}));

// Logo Box - conditionally used for H or toggle icon
const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '8px',
  backgroundColor: 'rgba(85, 105, 255, 0.8)',
  backgroundImage: 'linear-gradient(135deg, #5569ff 0%, #6b8aff 100%)',
  boxShadow: '0 2px 10px rgba(85, 105, 255, 0.4)',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '1.2rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

// Custom Toggle Button that looks like the logo
const ToggleButton = styled(IconButton)(({ theme }) => ({
  color: sidebarColors.textSecondary,
  '&:hover': {
    backgroundColor: 'transparent',
  },
  transition: 'all 0.15s ease',
  padding: 0,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -4,
    top: 4,
    minWidth: 18,
    height: 18,
    fontSize: '0.625rem',
    fontWeight: 600,
    padding: '0 4px',
    borderRadius: 9,
    backgroundColor: '#ef4444', // Red
    color: 'white',
  }
}));

// Animated badge dot
const PulseBadge = styled('span')(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: '#ef4444',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    backgroundColor: 'rgba(239, 68, 68, 0.7)',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '70%': {
      transform: 'scale(2)',
      opacity: 0,
    },
    '100%': {
      transform: 'scale(2.5)',
      opacity: 0,
    },
  },
}));

// Main component
const HRMSSidebar = ({ stats = defaultStats, activeSection, handleSectionChange }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Remember sidebar state in localStorage
  useEffect(() => {
    const savedOpenState = localStorage.getItem('sidebarOpen');
    if (savedOpenState !== null && !isMobile) {
      setOpen(JSON.parse(savedOpenState));
    }
  }, [isMobile]);

  // Improved toggle behavior with animation lock
  const toggleDrawer = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (isMobile) {
      setMobileOpen(!mobileOpen);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      const newOpenState = !open;
      setOpen(newOpenState);
      localStorage.setItem('sidebarOpen', JSON.stringify(newOpenState));
      
      // Wait for animation to complete before allowing another toggle
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Menu data structure with grouping and modern icons
  const menuSections = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: <ModernIcons.Dashboard />,
          badge: null
        },
          { 
          id: 'registration-management', 
          label: 'Registration', 
          icon: <ModernIcons.RFQs />,
        },
        { 
          id: 'rfq', 
          label: 'RFQs', 
          icon: <ModernIcons.RFQs />,
          badge: stats.rfqs?.counts?.open || null
        }, 
        { 
          id: 'purchase-order', 
          label: 'Purchase Orders', 
          icon: <ModernIcons.PurchaseOrders />,
          badge: stats.purchaseOrders?.counts?.pending || null
        },
           { 
          id: 'invoices', 
          label: 'Invoices', 
          icon: <ModernIcons.Invoices />,
          badge: stats.invoices?.counts?.pending || null
        },
      ]
    },
    {
      id: 'finance',
      label: 'Finance Processing',
      items: [
        { 
          id: 'new-recon', 
          label: 'Reconciliation', 
          icon: <ModernIcons.Reconciliation />,
          badge: null
        },
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      items: [
        { 
          id: 'analytics', 
          label: 'Analytics', 
          icon: <ModernIcons.Analytics />,
          badge: null
        },
        { 
          id: 'reports', 
          label: 'Reports', 
          icon: <ModernIcons.Reports />,
          badge: null
        },
      ]
    },
  ];

  // Bottom menu items
  const bottomMenuItems = [
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <ModernIcons.Settings />,
      onClick: () => navigate('/settings')
    },
    { 
      id: 'logout', 
      label: 'Logout', 
      icon: <ModernIcons.Logout />,
      onClick: () => console.log('Logout')
    },
  ];

  // Render menu item with or without tooltip based on drawer state
  const renderMenuItem = (item) => {
    const isActive = activeSection === item.id;
    const isHovered = hovered === item.id;
    
    const menuItem = (
      <StyledListItemButton
        key={item.id}
        selected={isActive}
        onClick={() => handleSectionChange(item.id)}
        onMouseEnter={() => setHovered(item.id)}
        onMouseLeave={() => setHovered('')}
        sx={{
          justifyContent: open ? 'initial' : 'center',
          px: 2,
          py: 1,
          minHeight: 44,
          position: 'relative',
          overflow: 'hidden',
          '&::after': isActive ? {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            width: '3px',
            height: '50%',
            backgroundColor: sidebarColors.itemSelectedText,
            borderRadius: '0 3px 3px 0',
          } : {}
        }}
      >
        <MenuItemIcon selected={isActive}>
          {React.cloneElement(item.icon, {
            style: { 
              transform: isHovered && !isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }
          })}
        </MenuItemIcon>
        
        {open && (
          <>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ 
                sx: {
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 500 : 400,
                  color: 'inherit',
                  transition: 'font-weight 0.15s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }
              }} 
              sx={{ 
                opacity: open ? 1 : 0,
                ml: 0.5,
              }}
            />
            {item.badge && (
              <StyledBadge badgeContent={item.badge} />
            )}
          </>
        )}
        
        {/* Show badge differently when sidebar is collapsed */}
        {!open && item.badge && (
          <PulseBadge />
        )}
      </StyledListItemButton>
    );

    // Add tooltips when sidebar is collapsed
    return !open ? (
      <Tooltip 
        title={item.label} 
        placement="right" 
        key={item.id}
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: alpha(sidebarColors.background, 0.9),
              color: sidebarColors.text,
              backdropFilter: 'blur(8px)',
              fontSize: '0.75rem',
              padding: '6px 12px',
              borderRadius: '6px',
              marginLeft: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              border: `1px solid ${alpha(sidebarColors.divider, 0.5)}`,
            }
          },
          arrow: {
            sx: {
              color: alpha(sidebarColors.background, 0.9),
            }
          }
        }}
      >
        {menuItem}
      </Tooltip>
    ) : menuItem;
  };

  // Render menu section
  const renderMenuSection = (section, index) => (
    <React.Fragment key={section.id}>
      {index > 0 && open && (
        <Divider 
          sx={{ 
            borderColor: sidebarColors.divider, 
            margin: '12px 24px 8px', 
            opacity: 0.4,
          }} 
        />
      )}
      <SidebarGroupLabel open={open}>{section.label}</SidebarGroupLabel>
      <List disablePadding sx={{ mb: 1 }}>
        {section.items.map((item) => renderMenuItem(item))}
      </List>
    </React.Fragment>
  );

  const drawer = (
    <>
      {/* Seamless Header with either Logo+Toggle (when open) or just Toggle (when closed) */}
      <DrawerHeader>
        <LogoContainer open={open}>
          {open ? (
            <>
              {/* When open, show logo and title on left, toggle button on right */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LogoBox>
                  N
                </LogoBox>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: sidebarColors.text,
                    letterSpacing: '0.5px',
                    fontSize: '1.125rem',
                  }}
                >
                NYASA SC
                </Typography>
              </Box>
              
              <ToggleButton 
                onClick={toggleDrawer}
                disabled={isAnimating}
                aria-label="close drawer"
                 sx={{
    '& img': {
      filter: 'brightness(0) invert(1)', 
    }
  }}
              >
                <img 
                  src="/sidebar1.png" 
                  alt="Toggle sidebar" 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    objectFit: 'contain',
                    transform: 'rotate(0deg)',
                    transition: 'transform 0.3s ease' 
                  }} 
                />
              </ToggleButton>
            </>
          ) : (
            // When collapsed, only show toggle icon in the H logo's place
            <LogoBox 
              onClick={toggleDrawer} 
              sx={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img 
                src="/sidebar.svg" 
                alt="Toggle sidebar" 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  objectFit: 'contain',
                  transform: 'rotate(180deg)',
                  transition: 'transform 0.3s ease'
                }} 
              />
            </LogoBox>
          )}
        </LogoContainer>
      </DrawerHeader>

      {/* Scrollable Content */}
      <Box sx={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: 'calc(100vh - 64px)',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { 
          backgroundColor: alpha(sidebarColors.textSecondary, 0.3),
          borderRadius: 2,
          '&:hover': {
            backgroundColor: alpha(sidebarColors.textSecondary, 0.5),
          }
        },
        padding: '10px 0 0',
        mt: 1,
      }}>
        {/* Menu Sections */}
        {menuSections.map((section, index) => renderMenuSection(section, index))}

        {/* Settings & Logout Section */}
        <Box sx={{ 
          mt: 'auto',
          mb: 2,
          px: 1
        }}>
          {open && (
            <Divider sx={{ 
              borderColor: sidebarColors.divider, 
              margin: '12px 24px 16px', 
              opacity: 0.4,
            }} />
          )}
          <List disablePadding>
            {bottomMenuItems.map((item) => {
              const isHovered = hovered === item.id;
              
              const menuItem = (
                <StyledListItemButton 
                  key={item.id}
                  onClick={item.onClick}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered('')}
                  sx={{
                    justifyContent: open ? 'initial' : 'center',
                    px: 2,
                    py: 1,
                    minHeight: 44,
                  }}
                >
                  <MenuItemIcon selected={false}>
                    {React.cloneElement(item.icon, {
                      style: { 
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.2s ease'
                      }
                    })}
                  </MenuItemIcon>
                  
                  {open && (
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ 
                        sx: {
                          fontSize: '0.875rem',
                          color: 'inherit',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }
                      }} 
                      sx={{ 
                        opacity: open ? 1 : 0,
                        ml: 0.5
                      }}
                    />
                  )}
                </StyledListItemButton>
              );

              return !open ? (
                <Tooltip 
                  title={item.label} 
                  placement="right" 
                  key={item.id}
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: alpha(sidebarColors.background, 0.9),
                        color: sidebarColors.text,
                        backdropFilter: 'blur(8px)',
                        fontSize: '0.75rem',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        marginLeft: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        border: `1px solid ${alpha(sidebarColors.divider, 0.5)}`,
                      }
                    },
                    arrow: {
                      sx: {
                        color: alpha(sidebarColors.background, 0.9),
                      }
                    }
                  }}
                >
                  {menuItem}
                </Tooltip>
              ) : menuItem;
            })}
          </List>
          
          {/* User profile mini badge - only visible when sidebar is open */}
          {open && (
            <Box sx={{ 
              mt: 3, 
              mx: 3,
              p: 1.5,
              borderRadius: '10px',
              backgroundColor: alpha(sidebarColors.itemSelectedText, 0.08),
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}>
              <Avatar 
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: alpha(sidebarColors.itemSelectedText, 0.2),
                  color: sidebarColors.itemSelectedText,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  boxShadow: `0 0 0 2px ${alpha(sidebarColors.itemSelectedText, 0.1)}`,
                }}
              >
                A
              </Avatar>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          disabled={isAnimating}
          sx={{
            position: 'fixed',
            top: 12,
            left: 16,
            zIndex: 1300,
            backgroundColor: alpha(sidebarColors.background, 0.8),
            backdropFilter: 'blur(8px)',
            borderRadius: '6px',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: alpha(sidebarColors.background, 0.95),
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: 256,
              backgroundColor: sidebarColors.background,
              borderRight: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        // Desktop drawer
        <SeamlessSidebarDrawer 
          variant="permanent"
          open={open}
          isMobile={isMobile}
        >
          {drawer}
        </SeamlessSidebarDrawer>
      )}
    </>
  );
};

// Default stats to prevent errors when props are not provided
const defaultStats = {
  employees: { counts: { pending: 0 } },
  vendors: { counts: { open: 0 } },
  requisitions: { counts: { pending: 0 } },
  rfqs: { counts: { open: 0 } },
  purchaseOrders: { counts: { pending: 0 } },
  invoices: { counts: { pending: 0 } },
};

HRMSSidebar.propTypes = {
  stats: PropTypes.shape({
    employees: PropTypes.object,
    vendors: PropTypes.object,
    requisitions: PropTypes.object,
    rfqs: PropTypes.object,
    purchaseOrders: PropTypes.object,
    invoices: PropTypes.object,
  }),
  activeSection: PropTypes.string.isRequired,
  handleSectionChange: PropTypes.func.isRequired
};

export default HRMSSidebar;