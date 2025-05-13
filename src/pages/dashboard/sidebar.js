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
import {
  Home,
  People,
  ShoppingCart,
  Inventory,
  CreditCard,
  CalendarToday,
  LocalShipping,
  Description,
  BarChart,
  PieChart,
  Settings,
  ExitToApp,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

// Clean, modern color palette with no separations
const sidebarColors = {
  background: '#18181b', // Dark background (Zinc 900 from Tailwind)
  itemHover: 'rgba(255, 255, 255, 0.07)',
  itemSelected: 'rgba(94, 104, 255, 0.15)',
  itemSelectedText: '#5e68ff',
  itemSelectedHover: 'rgba(94, 104, 255, 0.2)',
  text: '#f4f4f5', // Zinc 100
  textSecondary: 'rgba(244, 244, 245, 0.6)',
  iconColor: '#a1a1aa', // Zinc 400
  iconSelectedColor: '#5e68ff',
  divider: 'rgba(63, 63, 70, 0.5)', // Zinc 700
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
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

const MenuItemIcon = styled(ListItemIcon)(({ theme, selected }) => ({
  minWidth: 0,
  marginRight: 16,
  justifyContent: 'center',
  color: selected ? sidebarColors.iconSelectedColor : sidebarColors.iconColor,
  transition: 'color 0.15s ease',
  '& svg': {
    fontSize: 20,
  }
}));

// Drawer Header - now seamless with the rest of the sidebar
const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 20px 10px',
  backgroundColor: 'transparent',
}));

const LogoContainer = styled(Box)(({ theme, open }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}));

const MenuToggleButton = styled(IconButton)(({ theme }) => ({
  color: sidebarColors.textSecondary,
  '&:hover': {
    backgroundColor: sidebarColors.itemHover,
    color: sidebarColors.text,
  },
  transition: 'all 0.15s ease',
  padding: '8px',
  borderRadius: '4px',
  marginRight: '4px',
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

// Main component
const HRMSSidebar = ({ stats = defaultStats, activeSection, handleSectionChange }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState('');

  // Remember sidebar state in localStorage
  useEffect(() => {
    const savedOpenState = localStorage.getItem('sidebarOpen');
    if (savedOpenState !== null && !isMobile) {
      setOpen(JSON.parse(savedOpenState));
    }
  }, [isMobile]);

  const toggleDrawer = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      const newOpenState = !open;
      setOpen(newOpenState);
      localStorage.setItem('sidebarOpen', JSON.stringify(newOpenState));
    }
  };

  // Menu data structure with grouping and icons
  const menuSections = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: <Home />,
          badge: null
        },
        { 
          id: 'employees', 
          label: 'Employees', 
          icon: <People />,
          badge: stats.employees?.counts?.pending || null
        },
        { 
          id: 'vendors', 
          label: 'Vendors', 
          icon: <People />,
          badge: stats.vendors?.counts?.open || null
        },
        { 
          id: 'requisitions', 
          label: 'Requisitions', 
          icon: <ShoppingCart />,
          badge: stats.requisitions?.counts?.pending || null
        },
        { 
          id: 'rfqs', 
          label: 'RFQs', 
          icon: <Description />,
          badge: stats.rfqs?.counts?.open || null
        },
        { 
          id: 'purchase-orders', 
          label: 'Purchase Orders', 
          icon: <Inventory />,
          badge: stats.purchaseOrders?.counts?.pending || null
        },
        { 
          id: 'invoices', 
          label: 'Invoices', 
          icon: <CreditCard />,
          badge: stats.invoices?.counts?.pending || null
        },
      ]
    },
    {
      id: 'travel',
      label: 'Travel Management',
      items: [
        { 
          id: 'travel-requests', 
          label: 'Travel Requests', 
          icon: <CalendarToday />,
          badge: null
        },
        { 
          id: 'final-approval', 
          label: 'Final Approval', 
          icon: <Description />,
          badge: null
        },
        { 
          id: 'fleet-management', 
          label: 'Fleet Management', 
          icon: <LocalShipping />,
          badge: null
        },
      ]
    },
    {
      id: 'finance',
      label: 'Finance Processing',
      items: [
        { 
          id: 'finance-processing', 
          label: 'Processing', 
          icon: <CreditCard />,
          badge: null
        },
        { 
          id: 'reconciliation', 
          label: 'Reconciliation', 
          icon: <Description />,
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
          icon: <BarChart />,
          badge: null
        },
        { 
          id: 'reports', 
          label: 'Reports', 
          icon: <PieChart />,
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
      icon: <Settings />,
      onClick: () => navigate('/settings')
    },
    { 
      id: 'logout', 
      label: 'Logout', 
      icon: <ExitToApp />,
      onClick: () => console.log('Logout')
    },
  ];

  // Render menu item with or without tooltip based on drawer state
  const renderMenuItem = (item) => {
    const isActive = activeSection === item.id;
    
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
        }}
      >
        <MenuItemIcon selected={isActive}>
          {item.icon}
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
          <StyledBadge 
            badgeContent={item.badge} 
            sx={{ 
              position: 'absolute',
              top: 8,
              right: 8,
            }} 
          />
        )}
      </StyledListItemButton>
    );

    // Add tooltips when sidebar is collapsed
    return !open ? (
      <Tooltip 
        title={item.label} 
        placement="right" 
        key={item.id}
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: alpha('#18181b', 0.9),
              color: '#f4f4f5',
              backdropFilter: 'blur(8px)',
              fontSize: '0.75rem',
              padding: '5px 10px',
              borderRadius: '4px',
              marginLeft: '8px',
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
      {/* Seamless Header */}
      <DrawerHeader>
        <LogoContainer open={open}>
          {open ? (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: sidebarColors.text,
                letterSpacing: '0.5px',
                fontSize: '1.125rem',
              }}
            >
              HRMS
            </Typography>
          ) : (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: sidebarColors.text,
                fontSize: '1.25rem',
              }}
            >
              H
            </Typography>
          )}
        </LogoContainer>
        
        <MenuToggleButton 
          onClick={toggleDrawer}
          size="small"
          aria-label={open ? 'close drawer' : 'open drawer'}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </MenuToggleButton>
      </DrawerHeader>

      {/* Scrollable Content - continuous with header */}
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
                    {item.icon}
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
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: alpha('#18181b', 0.9),
                        color: '#f4f4f5',
                        backdropFilter: 'blur(8px)',
                        fontSize: '0.75rem',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        marginLeft: '8px',
                      }
                    }
                  }}
                >
                  {menuItem}
                </Tooltip>
              ) : menuItem;
            })}
          </List>
          
          {/* User profile mini badge - simplified */}
          {open && (
            <Box sx={{ 
              mt: 3, 
              mx: 3,
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
                }}
              >
                A
              </Avatar>
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: sidebarColors.text,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    fontSize: '0.8125rem',
                  }}
                >
                  Admin User
                </Typography>
              </Box>
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