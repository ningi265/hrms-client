import React, { useState, useEffect } from "react";
import { useNavigate ,useSearchParams } from "react-router-dom";
import {
  Error,
 
  Notifications,
  CalendarToday,
  Check,
  ExpandMore,
  CreditCard,
  Description,
  Home,
  Layers,
  Loop,
  ExitToApp,
  Inventory,
  BarChart,
  PieChart,
  Add,
  Search,
  Settings,
  ShoppingCart,
  LocalShipping,
  Person,
  People,
  ChevronLeft,
  ChevronRight,
  HelpOutline,
  ChatBubbleOutline,
  Upgrade
} from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
  LinearProgress,
  Box,
  Drawer,
  Toolbar,
  useTheme,
  styled,
  alpha,
} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import RequisitionsSection from "../dashboard/requisitions/manage/manage";
import ReconciliationSection from "../dashboard/requisitions/manage/finance-recon-review";
import PurchaseOrdersSection  from '../../pages/dashboard/purchase-orders/purchase-order';
import NewRequisitionSection  from '../../pages/dashboard/requisitions/requisitions';
import RFQsSection  from '../../pages/dashboard/rfqs/view/view_rfqs';
import VendorsSection  from '../../pages/dashboard/vendors/vendors';
import ManageRequisitionsSection  from '../../pages/dashboard/requisitions/manage/manage';
import RFQDetailsSection  from '../../pages/dashboard/rfqs/view/view_rfqs';
import CreateRFQSection  from '../../pages/dashboard/rfqs/create/create';
import AddVendorSection  from '../../pages/dashboard/vendors/add/add';
import VendorRFQsSection  from '../../pages/dashboard/vendors/qoutes/qoutes';
import SubmitQuoteSection  from '../../pages/dashboard/vendors/qoutes/submit/submit';
import SelectVendorSection  from '../../pages/dashboard/vendors/select/select';
import VendorPODetailsSection from '../../pages/vendor-dash/purchase-orders/accept/accept';
import TrackDeliveriesSection from '../../pages/dashboard/purchase-orders/confirm/confirm';
import InvoicesSection from '../../pages/dashboard/invoice/invoice';
import InvoiceManagementSection from '../../pages/dashboard/invoice/manage/manage';
import PaymentSection from '../../pages/dashboard/invoice/pay/pay';
import SupervisorApprovalSection from '../../pages/dashboard/requisitions/travel';
import FinalApproverSection from '../../pages/dashboard/requisitions/final';
import FinanceProcessingSection from '../../pages/dashboard/requisitions/manage/finance-travel';
import TravelSection from '../../pages/dashboard/requisitions/manage/travel-dash';
import InternationalTravelRequestSection from '../../pages/dashboard/requisitions/manage/international';
import FinanceReconciliationReviewSection from '../../pages/dashboard/requisitions/manage/finance-recon-review';
import FleetCoordinatorSection from '../../pages/dashboard/requisitions/manage/fleet';
import { useAuth } from "../../authcontext/authcontext"; 
import axios from 'axios';




// Styled components
const Sidebar = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundImage: 'none',
    boxShadow: 'none',
  },
}));

const SidebarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 1.5),
  ...theme.mixins.toolbar,
}));

const SidebarGroupLabel = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1),
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[1],
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
  "& .MuiCardContent-root": {
    padding: theme.spacing(2),
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.25, 1.5),
  padding: theme.spacing(0.75, 1.5),
  minHeight: 40,
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      fontSize: '0.875rem',
    }
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }, '& .MuiListItemIcon-root': {
    minWidth: 36, // Reduced from default
  },
  '& .MuiListItemText-root': {
    marginTop: 2, // Adjust text alignment
    marginBottom: 2,
  }
}));

const StatusItemPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[1],
  },
}));

const ActivityCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
}));

const backendUrl = process.env.REACT_APP_BACKEND_URL;
console.log(backendUrl);


export default function ProcurementDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const open = Boolean(anchorEl);
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'dashboard';
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;



  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`?section=${section}`, { replace: true });
  };
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity (0 when at top, 1 when scrolled down a bit)
  const opacity = Math.min(scrollPosition / 100, 1); 

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

 

  useEffect(() => {
    const getStats = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage or your auth context

        // Fetch requisitions stats
        const requisitionsResponse = await fetch(`${backendUrl}/api/requisitions/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const requisitionsData = await requisitionsResponse.json();

        // Fetch RFQs stats
        const rfqsResponse = await fetch(`${backendUrl}/api/rfqs/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const rfqsData = await rfqsResponse.json();

        // Fetch purchase orders stats
        const purchaseOrdersResponse = await fetch(`${backendUrl}/api/purchase-orders/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const purchaseOrdersData = await purchaseOrdersResponse.json();

        // Fetch invoices stats
        const invoicesResponse = await fetch(`${backendUrl}/api/invoices/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const invoicesData = await invoicesResponse.json();

        // Combine all stats into a single object
        const statsData = {
          requisitions: requisitionsData,
          rfqs: rfqsData,
          purchaseOrders: purchaseOrdersData,
          invoices: invoicesData,
        };

        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getStats();
  }, []);
 
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Loop sx={{ 
          fontSize: 32, 
          color: "primary.main", 
          animation: "spin 1s linear infinite" 
        }} />
        <Typography variant="body2" color="text.secondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Error sx={{ fontSize: 48, color: "error.main" }} />
        <Typography variant="h6">Failed to load dashboard data</Typography>
        <Typography variant="body2" color="text.secondary">
          Please try refreshing the page
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: "flex", 
      height: "100vh", 
      overflow: "hidden",
      backgroundColor: theme.palette.background.default,
    }}>
      {/* Sidebar */}
    <Sidebar variant="permanent" open sx={{
  backgroundColor: '#0f172a',
  borderRight: '1px solid #e0e0e0',
  width: 240
}}>
  {/* Fixed Header */}
  <Box sx={{
    position: 'sticky',
    top: 0,
    zIndex: 1200,
    backgroundColor: '#ffffff',
    height: 64,
    display: 'flex',
    alignItems: 'center'
  }}>
     <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 2, 
        px: 2,
        width: '100%'
      }}>
        <Box
          sx={{
            display: "flex",
            height: 36,
            width: 36,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
            backgroundColor: '#1976d2',
            color: "#ffffff"
          }}
        >
          <Layers sx={{ fontSize: 20 }} />
        </Box>
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600, 
          color: "text.primary"
        }}>
          HRMS
        </Typography>
      </Box>
  </Box>

  {/* Scrollable Content */}
  <Box sx={{
    overflowY: 'auto',
    height: 'calc(100vh - 64px)',
    '&::-webkit-scrollbar': { width: 6 },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': { 
      backgroundColor: '#bdbdbd',
      borderRadius: 3
    }
  }}>


    {/* Main Section */}
    <List>
      <SidebarGroupLabel sx={{ color: 'text.secondary' }}>Main</SidebarGroupLabel>
      
      <StyledListItemButton
        selected={activeSection === "dashboard"}
        onClick={() => handleSectionChange("dashboard")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <Home sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Dashboard" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "requisitions"}
        onClick={() => handleSectionChange("requisitions")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <ShoppingCart sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Requisitions" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
        <Box sx={{ mr: 2 }}>
          <Badge 
            badgeContent={stats.requisitions.counts.pending} 
            color="error"
            sx={{ 
              '& .MuiBadge-badge': { 
                right: -4,
                top: 4,
                minWidth: 20,
                height: 20,
                fontSize: '0.7rem'
              } 
            }} 
          />
        </Box>
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "rfqs"}
        onClick={() => handleSectionChange("rfqs")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <People sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="RFQs" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
        <Box sx={{ mr: 2 }}>
          <Badge 
            badgeContent={stats.rfqs.counts.open} 
            color="error"
            sx={{ 
              '& .MuiBadge-badge': { 
                right: -4,
                top: 4,
                minWidth: 20,
                height: 20,
                fontSize: '0.7rem'
              } 
            }} 
          />
        </Box>
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "purchase-orders"}
        onClick={() => handleSectionChange("purchase-orders")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <Inventory sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Purchase Orders" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
        <Box sx={{ mr: 2 }}>
          <Badge 
            badgeContent={stats.purchaseOrders.counts.pending} 
            color="error"
            sx={{ 
              '& .MuiBadge-badge': { 
                right: -4,
                top: 4,
                minWidth: 20,
                height: 20,
                fontSize: '0.7rem'
              } 
            }} 
          />
        </Box>
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "invoices"}
        onClick={() => handleSectionChange("invoices")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <CreditCard sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Invoices" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
        <Box sx={{ mr: 2 }}>
          <Badge 
            badgeContent={stats.invoices.counts.pending} 
            color="error"
            sx={{ 
              '& .MuiBadge-badge': { 
                right: -4,
                top: 4,
                minWidth: 20,
                height: 20,
                fontSize: '0.7rem'
              } 
            }} 
          />
        </Box>
      </StyledListItemButton>
    </List>

    <Divider sx={{ borderColor: '#e0e0e0' }} />

    {/* Travel Management Section */}
    <List>
      <SidebarGroupLabel sx={{ color: 'text.secondary' }}>Travel Management</SidebarGroupLabel>
      
      <StyledListItemButton
        selected={activeSection === "travel-requests"}
        onClick={() => handleSectionChange("travel-requests")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <CalendarToday sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Travel Requests" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "final-approval"}
        onClick={() => handleSectionChange("final-approval")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <CalendarToday sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Final Approval" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "fleet-management"}
        onClick={() => handleSectionChange("fleet-management")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <LocalShipping sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Fleet Management" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>
    </List>

    <Divider sx={{ borderColor: '#e0e0e0' }} />

    {/* Finance Processing Section */}
    <List>
      <SidebarGroupLabel sx={{ color: 'text.secondary' }}>FINANCE PROCESSING</SidebarGroupLabel>
      
      <StyledListItemButton
        selected={activeSection === "finance-processing"}
        onClick={() => handleSectionChange("finance-processing")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <CreditCard sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Processing" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "reconciliation"}
        onClick={() => handleSectionChange("reconciliation")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <Description sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Reconciliation" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>
    </List>

    <Divider sx={{ borderColor: '#e0e0e0' }} />

    {/* Reports Section */}
    <List>
      <SidebarGroupLabel sx={{ color: 'text.secondary' }}>Reports</SidebarGroupLabel>
      
      <StyledListItemButton
        selected={activeSection === "analytics"}
        onClick={() => setActiveSection("analytics")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <BarChart sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Analytics" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "reports"}
        onClick={() => setActiveSection("reports")}
        sx={{
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' }
          },
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <ListItemIcon>
          <PieChart sx={{ fontSize: 20, color: 'text.secondary' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Reports" 
          primaryTypographyProps={{ 
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>
    </List>

    {/* Settings & Logout Section */}
    <Box sx={{ mt: 'auto' }}>
      <Divider sx={{ borderColor: '#e0e0e0' }} />
      <List>
        <StyledListItemButton 
          onClick={() => navigate("/settings")}
          sx={{ 
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          <ListItemIcon>
            <Settings sx={{ fontSize: 20, color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Settings" 
            primaryTypographyProps={{ 
              color: 'text.primary',
              fontSize: '0.875rem',
              fontWeight: 500
            }} 
          />
        </StyledListItemButton>

        <StyledListItemButton 
          onClick={() => console.log("Logout")}
          sx={{ 
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          <ListItemIcon>
            <ExitToApp sx={{ fontSize: 20, color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ 
              color: 'text.primary',
              fontSize: '0.875rem',
              fontWeight: 500
            }} 
          />
        </StyledListItemButton>
      </List>
    </Box>
  </Box>
</Sidebar>

      {/* Main Content */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        overflow: "auto",
        backgroundColor: theme.palette.background.default,
      }}>
        {/* Header */}
        <Paper elevation={0} sx={{ 
  p: 1.5, 
  borderBottom: 1, 
  height: 70,
  borderColor: "divider",
  backdropFilter: `blur(${opacity * 10}px)`, 
  position: 'sticky',
  top: 0,
  zIndex: theme => theme.zIndex.appBar,
  transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease' 
}}>
  <Toolbar sx={{ px: { sm: 2 } }}>
    {/* Left-aligned items */}
    <Box sx={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 2,
      mr: 'auto' 
    }}>
      {/* Notification icon */}
      <IconButton 
        color="inherit"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          }
        }}
      >
        <Badge badgeContent={3} color="error">
          <Notifications sx={{ color: theme.palette.text.primary }} />
        </Badge>
      </IconButton>
    </Box>

    {/* Right-aligned items - new icons added here */}
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      mr: 1 
    }}>
      {/* Help icon */}
      <Tooltip title="Help">
        <IconButton color="inherit">
          <HelpOutline sx={{ color: theme.palette.text.secondary }} />
        </IconButton>
      </Tooltip>

      {/* Chat icon */}
      <Tooltip title="Chat with us now">
        <IconButton color="inherit">
          <ChatBubbleOutline sx={{ color: theme.palette.text.secondary }} />
        </IconButton>
      </Tooltip>

      {/* Settings icon */}
      <Tooltip title="Settings">
        <IconButton color="inherit">
          <Settings sx={{ color: theme.palette.text.secondary }} />
        </IconButton>
      </Tooltip>

      {/* Upgrade button */}
      <Tooltip title="Upgrade">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Upgrade />}
          sx={{
            borderRadius: 20,
            textTransform: 'none',
            px: 2,
            py: 0.5,
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          Upgrade
        </Button>
      </Tooltip>
    </Box>

    {/* User profile with dropdown */}
    <Box>
      <Button
        variant="text"
        color="inherit"
        onClick={handleMenuClick}
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1,
          borderRadius: 20,
          px: 1.5,
          py: 0.5,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          }
        }}
        id="user-menu-button"  
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ 
          width: 36, 
          height: 36, 
          bgcolor: theme.palette.primary.main 
        }} src={user.avatar}>
          {user.name.split(" ").map((n) => n[0]).join("")}
        </Avatar>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Typography variant="body3" sx={{ fontWeight: 100, fontVariant: "small-caps" }}>
            {user?.name}
          </Typography>
        </Box>
      </Button>

      {/* Menu dropdown */}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            }
          }
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ py: 1 }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1 }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ py: 1 }}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </Box>

    {/* Mobile menu button on the right */}
    <IconButton
      color="inherit"
      edge="start"
      onClick={() => setMobileOpen(!mobileOpen)}
      sx={{ mr: 2, display: { sm: "none" } }}
    >
      <MenuIcon />
    </IconButton>
  </Toolbar>
</Paper>

        {/* Main Content Area */}

<Box sx={{ p: 2 }}>
  {activeSection === "dashboard" ? (
    <Box sx={{ maxWidth: '100%', margin: '0 auto' }}>
      {/* All the current dashboard content */}
      <Box sx={{ maxWidth: '100%', margin: '0 auto' }}>
            {/* Page Title */}
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: 'center',
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Box>
                <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Dashboard Overview
                </Typography>
                <Typography variant="body" color="text.secondary" sx={{ fontSize: '0.875rem'}} >
                  Welcome back, here's what's happening with your procurement activities.
                </Typography>
              </Box>
             
            </Box>

            {/* Stats Cards */}
            <Box sx={{ 
              display: "grid", 
              gap: 2, 
              gridTemplateColumns: { 
                xs: "1fr", 
                sm: "repeat(2, 1fr)", 
                lg: "repeat(4, 1fr)" 
              }, 
              mb: 3 
            }}>
              <StatsCardComponent
                title="Requisitions"
                value={stats.requisitions.counts.total}
                description={`${stats.requisitions.counts.pending} pending approval`}
                trend="+12.5%"
                trendDirection="up"
                icon={<ShoppingCart />}
                color="primary"
              />

              <StatsCardComponent
                title="RFQs"
                value={stats.rfqs.counts.total}
                description={`${stats.rfqs.counts.open} open requests`}
                trend="+5.2%"
                trendDirection="up"
                icon={<People />}
                color="info"
              />

              <StatsCardComponent
                title="Purchase Orders"
                value={stats.purchaseOrders.counts.total}
                description={`${stats.purchaseOrders.counts.pending} pending approval`}
                trend="-3.1%"
                trendDirection="down"
                icon={<Inventory />}
                color="secondary"
              />

              <StatsCardComponent
                title="Invoices"
                value={stats.invoices.counts.total}
                description={`${stats.invoices.counts.pending} pending payment`}
                trend="+8.7%"
                trendDirection="up"
                icon={<CreditCard />}
                color="error"
              />
            </Box>

            {/* Main Content Grid */}
            <Box sx={{ 
              display: "grid", 
              gap: 3, 
              gridTemplateColumns: { 
                xs: "1fr", 
                lg: "2fr 1fr" 
              },
              mb: 4
            }}>
              {/* Procurement Status */}
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: theme.shadows[1],
              }}>
                <CardHeader
                  title="Procurement Status"
                  subheader="Current status of procurement activities"
                  titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <CardContent>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <StatusItemComponent
                      title="Requisitions"
                      total={stats.requisitions.counts.total}
                      items={[
                        { label: "Pending", value: stats.requisitions.counts.pending, color: "warning" },
                        { label: "Approved", value: stats.requisitions.counts.approved, color: "success" },
                        { label: "Rejected", value: stats.requisitions.counts.rejected, color: "error" },
                      ]}
                    />

                    <StatusItemComponent
                      title="RFQs"
                      total={stats.rfqs.counts.total}
                      items={[
                        { label: "Open", value: stats.rfqs.counts.open, color: "info" },
                        { label: "Closed", value: stats.rfqs.counts.closed, color: "primary" },
                      ]}
                    />

                    <StatusItemComponent
                      title="Purchase Orders"
                      total={stats.purchaseOrders.counts.total}
                      items={[
                        { label: "Pending", value: stats.purchaseOrders.counts.pending, color: "warning" },
                        { label: "Approved", value: stats.purchaseOrders.counts.approved, color: "success" },
                        { label: "Rejected", value: stats.purchaseOrders.counts.rejected, color: "error" },
                      ]}
                    />

                    <StatusItemComponent
                      title="Invoices"
                      total={stats.invoices.counts.total}
                      items={[
                        { label: "Pending", value: stats.invoices.counts.pending, color: "warning" },
                        { label: "Approved", value: stats.invoices.counts.approved, color: "success" },
                        { label: "Paid", value: stats.invoices.counts.paid, color: "info" },
                      ]}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Pending Approvals */}
              <Card sx={{ 
  borderRadius: 3,
  boxShadow: theme.shadows[1],
}}>
  <CardHeader
    title="Pending Approvals"
    subheader="Items requiring your attention"
    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
    subheaderTypographyProps={{ variant: 'body2' }}
  />
  <CardContent sx={{ p: 0 }}>
    <List>
      {/* Pending Requisitions */}
      {stats.requisitions.pendingRequisitions.map((req) => (
        <ApprovalItemComponent
          key={req._id}
          title={req.itemName}
          type="requisition"
          requester={req.employee.name}
          date={new Date(req.createdAt).toLocaleDateString()}
          amount={`Quantity: ${req.quantity}`}
        />
      ))}

      {/* Open RFQs */}
      {stats.rfqs.openRFQs.map((rfq) => (
        <ApprovalItemComponent
          key={rfq._id}
          title={rfq.itemName}
          type="rfq" // or create a new type "rfq" if you prefer
          requester={rfq.procurementOfficer.name}
          date={new Date(rfq.createdAt).toLocaleDateString()}
          amount={`Quantity: ${rfq.quantity}`}
        />
      ))}

      {/* Pending Purchase Orders */}
      {stats.purchaseOrders.pendingPOs.map((po) => (
        <ApprovalItemComponent
          key={po._id}
          title="Purchase Order"
          type="purchase-order"
          requester={po.vendor.name}
          date={new Date(po.createdAt).toLocaleDateString()}
          amount="Pending Approval"
        />
      ))}


      {/* Pending Invoices */}
      {stats.invoices.pendingInvoices.map((inv) => (
        <ApprovalItemComponent
          key={inv._id}
          title="Invoice"
          type="invoice"
          requester={inv.vendor.name}
          date={new Date(inv.createdAt).toLocaleDateString()}
          amount= {inv.amountDue}
        />
      ))}

      {/* Fallback if no pending items */}
      {stats.requisitions.pendingRequisitions.length === 0 && 
       stats.rfqs.openRFQs.length === 0 && 
       stats.purchaseOrders.pendingPOs.length === 0 && (
        <ListItem>
          <ListItemText 
            primary="No pending approvals" 
            sx={{ textAlign: 'center', py: 2 }} 
          />
        </ListItem>
      )}
    </List>
  </CardContent>
  <Box sx={{ 
    p: 2, 
    borderTop: '1px solid', 
    borderColor: 'divider',
    display: 'flex',
    justifyContent: 'center'
  }}>
    <Button 
      fullWidth 
      variant="text"
      sx={{
        borderRadius: 20,
        textTransform: 'none',
        color: theme.palette.text.secondary,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        }
      }}
    >
      View All Pending Items
    </Button>
  </Box>
</Card>
            </Box>

            {/* Recent Activity */}
            <Card sx={{ 
              mt: 3,
              borderRadius: 3,
              boxShadow: theme.shadows[1],
            }}>
              <CardHeader
                title="Recent Activity"
                subheader="Latest procurement activities"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                subheaderTypographyProps={{ variant: 'body2' }}
                action={
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{
                      borderRadius: 20,
                      textTransform: 'none',
                      px: 2,
                    }}
                  >
                    View All
                  </Button>
                }
              />
              <CardContent>
                <Box sx={{ 
                  display: "grid", 
                  gap: 3, 
                  gridTemplateColumns: { 
                    xs: "1fr", 
                    sm: "repeat(2, 1fr)", 
                    lg: "repeat(3, 1fr)" 
                  } 
                }}>
                  <ActivityCardComponent
                    title="New Requisition Submitted"
                    description="Office supplies requisition #REQ-2023-042 submitted by Sarah Johnson"
                    time="2 hours ago"
                    icon={<ShoppingCart />}
                    color="primary"
                  />

                  <ActivityCardComponent
                    title="Purchase Order Approved"
                    description="IT Equipment PO #PO-2023-028 approved by Michael Chen"
                    time="4 hours ago"
                    icon={<Check />}
                    color="success"
                  />

                  <ActivityCardComponent
                    title="Invoice Paid"
                    description="Marketing Services invoice #INV-2023-103 for $3,750.00 paid"
                    time="Yesterday"
                    icon={<CreditCard />}
                    color="error"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
    </Box>
  ) : (
    <Box>
      {activeSection === "requisitions" && <RequisitionsSection />}
      {activeSection === "reconciliation" && <ReconciliationSection />}
      {activeSection === "rfqs" && <RFQsSection/>}
      {activeSection === "purchase-orders" && <PurchaseOrdersSection/>}
      {activeSection === "invoices" && <InvoicesSection/>}
      {activeSection === "fleet-management" && <FleetCoordinatorSection/>}
      {activeSection === "travel-requests" && <SupervisorApprovalSection/>}
      {activeSection === "new-requisition" && <NewRequisitionSection />}
      {activeSection === "vendors" && <VendorsSection/>}
      {activeSection === "manage-rfq" && <ManageRequisitionsSection/>}
      {activeSection === "rfq-details" && <RFQDetailsSection/>}
      {activeSection === "create-rfq" && <CreateRFQSection/>}
      {activeSection === "add-vendor" && <AddVendorSection/>}
      {activeSection === "vendor-rfq" && <VendorRFQsSection/>}
      {activeSection === "select-vendor" && <SelectVendorSection/>}
      {activeSection === "vendor-purchase-orders" && <VendorPODetailsSection/>}
      {activeSection === "track-deliveries" && <TrackDeliveriesSection/>}
      {activeSection === "invoice" && <InvoicesSection/>}
      {activeSection === "invoice-manage" && <InvoiceManagementSection/>}
      {activeSection === "payment" && <PaymentSection/>}
      {activeSection === "supervisor-approval" && <SupervisorApprovalSection/>}
      {activeSection === "final-approval" && <FinalApproverSection/>}
      {activeSection === "finance-processing" && <FinanceProcessingSection/>}
      {activeSection === "travel" && <TravelSection/>}
      {activeSection === "international-travel" && <InternationalTravelRequestSection/>}
      {activeSection === "recon-review" && <FinanceReconciliationReviewSection/>}
      {activeSection === "fleet-cordination" && <FleetCoordinatorSection/>}

      {/* other sections */}
    </Box>
  )}
</Box>
      </Box>
    </Box>
  );
}

function StatsCardComponent({ title, value, description, trend, trendDirection, icon, color }) {
  const theme = useTheme();
  
  return (
    <StatsCard>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Avatar sx={{ 
            bgcolor: alpha(theme.palette[color].main, 0.1), 
            color: theme.palette[color].main,
            width: 40,
            height: 40
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 18 } })}
          </Avatar>
          <Badge
            color={trendDirection === "up" ? "success" : "error"}
            badgeContent={trend}
            sx={{ 
              '& .MuiBadge-badge': { 
                fontSize: "0.65rem", 
                height: 18,
                borderRadius: 9,
                padding: '0 6px',
              } 
            }}
          />
        </Box>
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25,fontSize:'0.875rem' }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ 
            display: 'block',
            mt: 0.5,
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
          }}>
            {description}
          </Typography>
        </Box>
      </CardContent>
    </StatsCard>
  );
}

function ApprovalItemComponent({ title, id, type, requester, date, amount }) {
  const theme = useTheme();
  const getTypeColor = (type) => {
    switch (type) {
      case "requisition":
        return "primary";
      case "purchase-order":
        return "secondary";
      case "invoice":
        return "error";
      case "travel":
        return "warning";
      default:
        return "primary";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "requisition":
        return <ShoppingCart />;
      case "purchase-order":
        return <Inventory />;
      case "invoice":
        return <CreditCard />;
      case "travel":
        return <LocalShipping />;
      default:
        return <Description />;
    }
  };

  return (
    <ListItemButton sx={{
      px: 2,
      py: 1,
      minHeight: 56,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      }
    }}>
      <ListItemAvatar>
        <Avatar sx={{ 
          bgcolor: alpha(theme.palette[getTypeColor(type)].main, 0.1), 
          color: theme.palette[getTypeColor(type)].main,
          width: 36,
          height: 36
        }}>
          {getTypeIcon(type)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '0.875rem'  }}>
              {title}
            </Typography>
            <Badge 
              badgeContent={id} 
              color="default" 
              sx={{
                '& .MuiBadge-badge': {
                  right: -8,
                  top: 6,
                  borderRadius: 1,
                  fontSize: '0.6rem',
                  fontWeight: 500,
                }
              }}
            />
          </Box>
        }
        secondary={
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.25 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              By {requester} • {date}
            </Typography>
            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
              {amount}
            </Typography>
          </Box>
        }
        sx={{ my: 0 }}
      />
    </ListItemButton>
  );
}

function StatusItemComponent({ title, total, items }) {
  const theme = useTheme();
  
  // Helper function to get valid color from theme
  const getColor = (color) => {
    const validColors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
    return validColors.includes(color) ? color : 'primary';
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {total}
        </Typography>
      </Box>
      <Box sx={{ 
        display: "grid", 
        gap: 2, 
        gridTemplateColumns: { 
          xs: "1fr", 
          sm: "repeat(2, 1fr)", 
          md: "repeat(4, 1fr)" 
        } 
      }}>
        {items.map((item, index) => {
          const validColor = getColor(item.color);
          return (
            <StatusItemPaper key={index}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {item.value}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(item.value / total) * 100}
                color={validColor}
                sx={{ 
                  height: 6, 
                  mt: 1.5, 
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette[validColor].main, 0.1),
                }}
              />
            </StatusItemPaper>
          );
        })}
      </Box>
    </Box>
  );
}

function ActivityCardComponent({ title, description, time, icon, color }) {
  const theme = useTheme();
  
  return (
    <ActivityCard>
      <Box sx={{ 
        height: 4, 
        bgcolor: `${color}.main`,
        background: `linear-gradient(90deg, ${theme.palette[color].main} 0%, ${alpha(theme.palette[color].main, 0.7)} 100%)`
      }} />
      <CardContent>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: alpha(theme.palette[color].main, 0.1), 
            color: theme.palette[color].main,
            width: 40,
            height: 40
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 20 } })}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {time}
            </Typography>
          </Box>
        </Box>
      </CardContent>  q
    </ActivityCard> 
  );
}