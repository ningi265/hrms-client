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
  Avatar,
  SwipeableDrawer
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';

// Modern color palette with a professional look
const sidebarColors = {
  background: '#141b2d',
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

// Modern SVG Icons (kept the same)
const ModernIcons = {
  Dashboard: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  Employees: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ApprovalWorkflows: (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Workflow nodes */}
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="12" cy="18" r="2" />

    {/* Connections */}
    <path d="M8 6h8" />
    <path d="M18 8c0 4-6 4-6 8" />
    <path d="M6 8c0 4 6 4 6 8" />
  </svg>
),

  Department: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  ),
  Vendors: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6l2 12h10" />
      <path d="M9 8h12l-1 8H10" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="20" cy="19" r="1" />
      <path d="M7 8L5.5 3H2" />
    </svg>
  ),
  Requisitions: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
 RFQs: (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* RFQ document */}
    <rect x="4" y="3" width="12" height="18" rx="2" />
    <path d="M7 7h6" />
    <path d="M7 11h6" />

    {/* Outgoing request */}
    <path d="M10 15h6" />
    <path d="M14 13l2 2-2 2" />

    {/* Multiple suppliers */}
    <circle cx="20" cy="8" r="1.5" />
    <circle cx="20" cy="12" r="1.5" />
    <circle cx="20" cy="16" r="1.5" />
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
  TravelRequests: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 11h.01M11 15h.01M16 16h.01M10 12h.01M3 7l2.5 3 4-5 2.5 3 3-4 2.5 3L20.5 5" />
      <path d="M20 22h-2a2 2 0 0 1-2-2v-8.5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5V20h3a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1ZM15.4 22H8.6c-.5 0-.9-.4-.9-.9V10.1c0-.5.4-.9.9-.9h6.8c.5 0 .9.4.9.9v10.9c0 .6-.4 1-.9 1Z" />
      <path d="M4 22H2a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1h3v-8.5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5V20a2 2 0 0 1-2 2Z" />
    </svg>
  ),
  FinalApproval: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  FleetManagement: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
      <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
      <circle cx="7" cy="18" r="2" />
      <path d="M15 18H9" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
  Processing: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="7" y1="15" x2="7" y2="15" />
      <line x1="12" y1="15" x2="12" y2="15" />
      <line x1="17" y1="15" x2="17" y2="15" />
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
  Tenders: (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Documents */}
    <rect x="4" y="3" width="14" height="18" rx="2" />
    <path d="M8 7h6" />
    <path d="M8 11h6" />
    <path d="M8 15h4" />

    {/* Bid / selection marker */}
    <circle cx="18" cy="16" r="3" />
    <path d="m17 16 1 1 2-2" />
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

// Styled components with mobile optimization
const StyledListItemButton = styled(ListItemButton)(({ theme, ismobile }) => ({
  color: sidebarColors.text,
  margin: '2px 8px',
  padding: '10px 12px',
  minHeight: 44,
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
  [theme.breakpoints.down('md')]: {
    padding: ismobile ? '12px 16px' : '12px',
    minHeight: 48,
    margin: '2px 6px',
    justifyContent: 'flex-start !important',
  },
}));

const SidebarGroupLabel = styled(Typography)(({ theme, open }) => ({
  color: sidebarColors.textSecondary,
  fontSize: '0.6875rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  padding: open ? '16px 20px 6px' : '8px 0',
  letterSpacing: '0.6px',
  textAlign: open ? 'left' : 'center',
  opacity: open ? 1 : 0,
  height: open ? 'auto' : 0,
  marginBottom: open ? '4px' : 0,
  transition: 'opacity 0.2s ease, height 0.2s ease, margin 0.2s ease',
  [theme.breakpoints.down('md')]: {
    fontSize: '0.75rem',
    padding: open ? '12px 16px 4px' : '6px 0',
    textAlign: 'left',
    opacity: 1,
    height: 'auto',
  },
}));

// Updated drawer with proper mobile width
const SeamlessSidebarDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile'
})(({ theme, open, isMobile }) => ({
  width: isMobile ? 'auto' : (open ? 256 : 64),
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  '& .MuiDrawer-paper': {
    backgroundColor: sidebarColors.background,
    borderRight: 'none',
    width: isMobile ? '280px' : (open ? 256 : 64),
    overflowX: 'hidden',
    transition: theme.transitions.create(['width', 'transform'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),
    ...(isMobile && {
      position: 'fixed',
      height: '100%',
      zIndex: 1300,
    }),
  },
}));

const MenuItemIcon = styled(ListItemIcon)(({ theme, selected, ismobile }) => ({
  minWidth: ismobile ? 40 : 0,
  marginRight: ismobile ? 16 : (selected ? 16 : 0),
  justifyContent: ismobile ? 'flex-start' : 'center',
  color: selected ? sidebarColors.iconSelectedColor : sidebarColors.iconColor,
  transition: 'color 0.15s ease, transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  },
  [theme.breakpoints.down('md')]: {
    marginRight: 16,
    justifyContent: 'flex-start',
    minWidth: 40,
    '& svg': {
      width: 20,
      height: 20,
    }
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px 8px 8px',
  backgroundColor: 'transparent',
  minHeight: 56,
  [theme.breakpoints.down('md')]: {
    padding: '16px 20px 12px',
    minHeight: 60,
    justifyContent: 'space-between',
  },
}));

const LogoContainer = styled(Box)(({ theme, open }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: open ? 'space-between' : 'center',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'space-between',
  },
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  color: sidebarColors.textSecondary,
  '&:hover': {
    backgroundColor: 'transparent',
  },
  transition: 'all 0.15s ease',
  padding: 8,
  minWidth: 40,
  minHeight: 40,
  [theme.breakpoints.down('md')]: {
    minWidth: 36,
    minHeight: 36,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -4,
    top: 4,
    minWidth: 16,
    height: 16,
    fontSize: '0.6rem',
    fontWeight: 600,
    padding: '0 4px',
    borderRadius: 8,
    backgroundColor: '#ef4444',
    color: 'white',
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiBadge-badge': {
      minWidth: 14,
      height: 14,
      fontSize: '0.55rem',
    },
  },
}));

const PulseBadge = styled('span')(({ theme }) => ({
  position: 'absolute',
  top: 6,
  right: 6,
  width: 6,
  height: 6,
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

// Mobile toggle button with sidebar1.svg
const MobileToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: 12,
  left: 12,
  zIndex: 1200,
  backdropFilter: 'blur(8px)',
  borderRadius: '8px',
  width: 44,
  height: 44,
  '&:hover': {
    backgroundColor: alpha(sidebarColors.background, 0.95),
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease-in-out',
}));

// Main component
const HRMSSidebar = ({ stats = defaultStats, activeSection, handleSectionChange, onSidebarToggle, user }) => {
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
      const parsedState = JSON.parse(savedOpenState);
      setOpen(parsedState);
      onSidebarToggle?.(parsedState);
    }
  }, [isMobile, onSidebarToggle]);

  // Improved toggle with mobile-specific behavior
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
      onSidebarToggle?.(newOpenState);
      window.dispatchEvent(new CustomEvent('sidebarToggle', { 
        detail: { open: newOpenState } 
      }));
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Close mobile drawer after navigation
  const handleMobileNavigation = (sectionId) => {
    handleSectionChange(sectionId);
    if (isMobile) {
      setTimeout(() => setMobileOpen(false), 150);
    }
  };

  // Menu data structure
  const menuSections = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <ModernIcons.Dashboard />, badge: null },
        { id: 'approval-workflows', label: 'Approval Workflows', icon: <ModernIcons.ApprovalWorkflows />, badge: stats.approvalWorkflows?.counts?.pending || null },
        { id: 'departments', label: 'Departments', icon: <ModernIcons.Department/> },
        { id: 'employees', label: 'Employees', icon: <ModernIcons.Employees />, badge: stats.employees?.counts?.pending || null },
        { id: 'vendors', label: 'Vendors', icon: <ModernIcons.Vendors />, badge: stats.vendors?.counts?.open || null },
        { id: 'requisitions', label: 'Requisitions', icon: <ModernIcons.Requisitions />, badge: stats.requisitions?.counts?.pending || null },
        { id: 'tenders', label: 'Tenders', icon: <ModernIcons.Tenders />, badge: stats.tenders?.counts?.open || null },
        { id: 'rfqs', label: 'RFQs', icon: <ModernIcons.RFQs />, badge: stats.rfqs?.counts?.open || null },
        { id: 'purchase-orders', label: 'Purchase Orders', icon: <ModernIcons.PurchaseOrders />, badge: stats.purchaseOrders?.counts?.pending || null },
        { id: 'invoices', label: 'Invoices', icon: <ModernIcons.Invoices />, badge: stats.invoices?.counts?.pending || null },
      ]
    },
    {
      id: 'travel',
      label: 'Travel Management',
      items: [
        { id: 'travel-requests', label: 'Travel Requests', icon: <ModernIcons.TravelRequests />, badge: null },
        { id: 'final-approval', label: 'Final Approval', icon: <ModernIcons.FinalApproval />, badge: null },
        { id: 'fleet-management', label: 'Fleet Management', icon: <ModernIcons.FleetManagement />, badge: null },
      ]
    },
    {
      id: 'finance',
      label: 'Finance Processing',
      items: [
        { id: 'invoice-payment', label: 'Invoice Payment', icon: <ModernIcons.Processing />, badge: null },
        { id: 'finance-processing', label: 'Processing', icon: <ModernIcons.Processing />, badge: null },
        { id: 'reconciliation', label: 'Reconciliation', icon: <ModernIcons.Reconciliation />, badge: null },
        { id: 'budget', label: 'Budgeting', icon: <ModernIcons.Invoices />, badge: stats.invoices?.counts?.pending || null },
        { id: 'budgeting', label: 'Budget Code', icon: <ModernIcons.Invoices />, badge: stats.invoices?.counts?.pending || null },
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      items: [
        { id: 'analytics', label: 'Analytics', icon: <ModernIcons.Analytics />, badge: null },
        { id: 'reports', label: 'Reports', icon: <ModernIcons.Reports />, badge: null },
      ]
    },
  ];

  // Render menu item with responsive behavior
  const renderMenuItem = (item) => {
    const isActive = activeSection === item.id;
    const isHovered = hovered === item.id;
    
    const menuItem = (
      <StyledListItemButton
        key={item.id}
        selected={isActive}
        onClick={() => handleMobileNavigation(item.id)}
        onMouseEnter={() => setHovered(item.id)}
        onMouseLeave={() => setHovered('')}
        ismobile={isMobile ? 1 : 0}
        sx={{
          justifyContent: (open || isMobile) ? 'flex-start' : 'center',
          px: (open || isMobile) ? 2 : 1,
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
        <MenuItemIcon 
          selected={isActive} 
          ismobile={isMobile ? 1 : 0}
          sx={{ 
            marginRight: (open || isMobile) ? 2 : 0,
            minWidth: (open || isMobile) ? 40 : 'auto',
          }}
        >
          {React.cloneElement(item.icon, {
            style: { 
              transform: isHovered && !isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }
          })}
        </MenuItemIcon>
        
        {(open || isMobile) && (
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
                opacity: (open || isMobile) ? 1 : 0,
                ml: 0.5,
              }}
            />
            {item.badge && (
              <StyledBadge badgeContent={item.badge} />
            )}
          </>
        )}
        
        {!open && !isMobile && item.badge && (
          <PulseBadge />
        )}
      </StyledListItemButton>
    );

    // Add tooltips when sidebar is collapsed (desktop only)
    return !open && !isMobile ? (
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
      {index > 0 && (open || isMobile) && (
        <Divider 
          sx={{ 
            borderColor: sidebarColors.divider, 
            margin: '12px 16px 8px', 
            opacity: 0.4,
          }} 
        />
      )}
      {(open || isMobile) && (
        <SidebarGroupLabel open={open || isMobile}>{section.label}</SidebarGroupLabel>
      )}
      <List disablePadding sx={{ mb: (open || isMobile) ? 1 : 0 }}>
        {section.items.map((item) => renderMenuItem(item))}
      </List>
    </React.Fragment>
  );

  const drawer = (
    <>
      <DrawerHeader>
        <LogoContainer open={open || isMobile}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexGrow: 1,
              paddingLeft: isMobile ? 0 : '12px',
            }}
          >
            <img
              src="/hrms-logo11.png" 
              alt="Company Logo"
              style={{
                height: isMobile ? '24px' : '20px',
                width: isMobile ? '24px' : '20px',
                objectFit: 'contain',
              }}
            />
            {(open || isMobile) && (
              <Typography
                variant="h6"
                sx={{
                  color: sidebarColors.text,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  marginLeft: 2,
                  display: { xs: 'block', md: open ? 'block' : 'none' }
                }}
              >
                NEXUSMWI
              </Typography>
            )}
          </Box>
          
          <ToggleButton 
            onClick={toggleDrawer}
            disabled={isAnimating}
            aria-label={isMobile ? "close menu" : "toggle sidebar"}
            sx={{
              '& img': {
                filter: 'brightness(0) invert(1)', 
              }
            }}
          >
            {isMobile ? (
              <CloseIcon sx={{ fontSize: 20, color: sidebarColors.text }} />
            ) : (
              <img 
                src="/sidebar1.svg" 
                alt="Toggle sidebar" 
                style={{ 
                  width: '16px',
                  height: '16px',
                  objectFit: 'contain',
                }} 
              />
            )}
          </ToggleButton>
        </LogoContainer>
      </DrawerHeader>

      {/* Scrollable Content */}
      <Box sx={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: 'calc(100vh - 80px)',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { 
          backgroundColor: alpha(sidebarColors.textSecondary, 0.3),
          borderRadius: 2,
          '&:hover': {
            backgroundColor: alpha(sidebarColors.textSecondary, 0.5),
          }
        },
        padding: '8px 0',
        WebkitOverflowScrolling: 'touch',
      }}>
        {menuSections.map((section, index) => renderMenuSection(section, index))}
      </Box>
    </>
  );

  return (
    <>
      {/* Mobile toggle button - replaced MenuIcon with sidebar1.svg */}
     {isMobile && !mobileOpen && (
  <MobileToggleButton
    color="inherit"
    aria-label="open drawer"
    onClick={toggleDrawer}
    edge="start"
    disabled={isAnimating}
  >
    <img 
      src="/sidebar1.svg" 
      alt="Open sidebar" 
      style={{ 
        width: '20px',
        height: '20px',
        objectFit: 'contain',
      }} 
    />
  </MobileToggleButton>
)}

      {/* Mobile drawer */}
      {isMobile ? (
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          onOpen={() => setMobileOpen(true)}
          disableBackdropTransition={!isMobile}
          disableDiscovery={isMobile}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: '280px',
              backgroundColor: sidebarColors.background,
              borderRight: 'none',
              boxShadow: '2px 0 20px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          {drawer}
        </SwipeableDrawer>
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

// Default stats to prevent errors
const defaultStats = {
  employees: { counts: { pending: 0 } },
  vendors: { counts: { open: 0 } },
  requisitions: { counts: { pending: 0 } },
  rfqs: { counts: { open: 0 } },
  purchaseOrders: { counts: { pending: 0 } },
  invoices: { counts: { pending: 0 } },
  tenders: { counts: { open: 0 } },
};

HRMSSidebar.propTypes = {
  stats: PropTypes.shape({
    employees: PropTypes.object,
    vendors: PropTypes.object,
    requisitions: PropTypes.object,
    rfqs: PropTypes.object,
    purchaseOrders: PropTypes.object,
    invoices: PropTypes.object,
    tenders: PropTypes.object,
  }),
  activeSection: PropTypes.string.isRequired,
  handleSectionChange: PropTypes.func.isRequired,
  onSidebarToggle: PropTypes.func,
  user: PropTypes.object,
};

export default HRMSSidebar;