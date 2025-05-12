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
  Settings,
  ShoppingCart,
  LocalShipping,
  Person,
  People,
  NotificationsActive, 
  LiveHelp, 
  SmartToy, 
  Tune, 
  RocketLaunch, 
  SettingsApplications, 
  MenuOpen,
  PieChart as PieChartIcon,
  Timeline,
  BarChart as BarChartIcon
} from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import AIChatButton from './aiChat';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, 
  LineChart, Line, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
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
  ButtonGroup,
  Tabs,
  Tab,
} from "@mui/material";
import './dashboard.css';
import RevenueChart from './revenueChart';
import DateComponent from './date';
import ProcurementStatusCard from './procurementStatus';
import ProductReviewsAnalysis from './productProcurement';
import { motion, AnimatePresence } from 'framer-motion';
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
import VendorsPage from '../../pages/dashboard/vendors/vendors';
import { useAuth } from "../../authcontext/authcontext"; 
import axios from 'axios';
import AddVendorPage from "../../pages/dashboard/vendors/add/add";


// Sample data for RevenueChart
const salesData = [
  { month: 'Jan', revenue: 65000, target: 60000, growth: 8 },
  { month: 'Feb', revenue: 59000, target: 65000, growth: -5 },
  { month: 'Mar', revenue: 80000, target: 70000, growth: 12 },
  { month: 'Apr', revenue: 81000, target: 75000, growth: 10 },
  { month: 'May', revenue: 56000, target: 80000, growth: -15 },
  { month: 'Jun', revenue: 95000, target: 85000, growth: 20 },
  { month: 'Jul', revenue: 100000, target: 90000, growth: 18 }
];

const revenueBreakdown = [
  { name: 'Product A', value: 35, color: '#3f51b5' },
  { name: 'Product B', value: 25, color: '#00acc1' },
  { name: 'Product C', value: 20, color: '#4caf50' },
  { name: 'Product D', value: 15, color: '#ff9800' },
  { name: 'Other', value: 5, color: '#9e9e9e' }
];

const regionalMapData = [
  { region: 'North', value: 45000 },
  { region: 'South', value: 35000 },
  { region: 'East', value: 30000 },
  { region: 'West', value: 40000 },
  { region: 'Central', value: 25000 }
];

// Styled components
const Sidebar = styled(Drawer)(({ theme }) => ({
  width: 290,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 290,
    boxSizing: "border-box",
    backgroundColor: '#292929 ', // Dark background
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundImage: 'none',
    boxShadow: 'none',
    color: '#ffffff', // White text
  },
}));

const SidebarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 1.5),
  ...theme.mixins.toolbar,
  backgroundColor: '#292929 ', // Dark background
  color: '#ffffff', // White text
}));

const SidebarGroupLabel = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1),
  color: 'rgba(255, 255, 255, 0.7)', // Lighter white for secondary text
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
    padding: theme.spacing(1.5),
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
  const [activeIndex, setActiveIndex] = useState(null);
  const [stats, setStats] = useState({
    requisitions: { counts: { pending: 0, approved: 0, rejected: 0, total: 0 }, pendingRequisitions: [] },
    rfqs: { counts: { open: 0, closed: 0, total: 0 }, openRFQs: [] },
    purchaseOrders: { counts: { pending: 0, approved: 0, rejected: 0, total: 0 }, pendingPOs: [] },
    invoices: { counts: { pending: 0, approved: 0, paid: 0, total: 0 }, pendingInvoices: [] }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const open = Boolean(anchorEl);
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'dashboard';
  });
  const { user: authUser, loading: authLoading } = useAuth();
  const [recentReports, setRecentReports] = useState([
  {
    name: "Procurement Summary",
    type: "Analytics",
    created_at: "2 days ago",
    thumbnail: "graph-bar"
  },
 {
    name: "Vendor Performance",
    type: "Report", 
    created_at: "1 week ago",
    thumbnail: "trending-up"
  },
  {
    name: "Inventory Levels",
    type: "Report",
    created_at: "3 days ago", 
    thumbnail: "box"
  },
{
    name: "User Activity",
    type: "Analytics",
    created_at: "5 days ago",
    thumbnail: "users"
  }
]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const colors = {
    pending: '#FF9F1C',    // warm orange
    approved: '#2EC4B6',   // teal
    rejected: '#E71D36',   // bright red
    open: '#4361EE',       // bright blue
    closed: '#3A0CA3',     // deep purple
    paid: '#7209B7'        // vibrant purple
  };
  const user = authUser || {
    name: 'Guest User',
    avatar: null,
    email: '',
    role: 'guest'
  };
  
  const allData = [
    { name: 'Pending Requisitions', value: stats.requisitions.counts.pending, category: 'Requisitions', status: 'pending' },
    { name: 'Approved Requisitions', value: stats.requisitions.counts.approved, category: 'Requisitions', status: 'approved' },
    { name: 'Rejected Requisitions', value: stats.requisitions.counts.rejected, category: 'Requisitions', status: 'rejected' },
    { name: 'Open RFQs', value: stats.rfqs.counts.open, category: 'RFQs', status: 'open' },
    { name: 'Closed RFQs', value: stats.rfqs.counts.closed, category: 'RFQs', status: 'closed' },
    { name: 'Pending POs', value: stats.purchaseOrders.counts.pending, category: 'Purchase Orders', status: 'pending' },
    { name: 'Approved POs', value: stats.purchaseOrders.counts.approved, category: 'Purchase Orders', status: 'approved' },
    { name: 'Rejected POs', value:stats.purchaseOrders.counts.rejected , category: 'Purchase Orders', status: 'rejected' },
    { name: 'Pending Invoices', value: stats.invoices.counts.pending, category: 'Invoices', status: 'pending' },
    { name: 'Approved Invoices', value: stats.invoices.counts.approved, category: 'Invoices', status: 'approved' },
    { name: 'Paid Invoices', value: stats.invoices.counts.paid, category: 'Invoices', status: 'paid' }
  ];

  const totals = {
    Requisitions: stats.requisitions.counts.total,
    RFQs: stats.rfqs.counts.total,
    'Purchase Orders': stats.purchaseOrders.counts.total,
    Invoices: stats.invoices.counts.total
  };

  const statusSummary = allData.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = 0;
    }
    acc[item.status] += item.value;
    return acc;
  }, {});
  
  const summaryData = Object.entries(statusSummary).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
    status
  }));

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };

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

  useEffect(() => {
  const rows = document.querySelectorAll('.report-row');
  rows.forEach((row, index) => {
    setTimeout(() => {
      row.classList.add('row-visible');
    }, 100 * index);
  });
}, [recentReports]);

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
        <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
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
  backgroundColor: '#121212',
  borderRight:'1px solid rgba(255, 255, 255, 0.12)',
  width: 290,
  color: '#ffffff'

}}>
  {/* Fixed Header */}
  <Box sx={{
    position: 'sticky',
    top: 0,
    zIndex: 1200,
    backgroundColor: '#292929 ',
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
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
        <div className="inline-flex items-center">
    <img
      src="hrms-logo.png"
      className="h-16 w-auto mx-auto"  // Increased the height to 64
    />
  </div>
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600, 
          color: "#ffffff"
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
      <SidebarGroupLabel sx={{  color: 'inherit', }}>Main</SidebarGroupLabel>      
      <StyledListItemButton
        selected={activeSection === "dashboard"}
        onClick={() => handleSectionChange("dashboard")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <Home sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Dashboard" 
          primaryTypographyProps={{ 
            color: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "rfqs"}
        onClick={() => handleSectionChange("rfqs")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <People sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Employees" 
          primaryTypographyProps={{ 
            color: 'inherit',
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
        selected={activeSection === "vendors"}
        onClick={() => handleSectionChange("vendors")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <People sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Vendors" 
          primaryTypographyProps={{ 
            color: 'inherit',
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
        selected={activeSection === "requisitions"}
        onClick={() => handleSectionChange("requisitions")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <ShoppingCart sx={{ fontSize: 20,  color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Requisitions" 
          primaryTypographyProps={{ 
            color: 'inherit',
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
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <People sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="RFQs" 
          primaryTypographyProps={{ 
            color: 'inherit',
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
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <Inventory sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Purchase Orders" 
          primaryTypographyProps={{ 
            color: 'inherit',
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
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <CreditCard sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Invoices" 
          primaryTypographyProps={{ 
            color: 'inherit',
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

    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

    {/* Travel Management Section */}
    <List>
      <SidebarGroupLabel sx={{  color: 'inherit', }}>Travel Management</SidebarGroupLabel>
      
      <StyledListItemButton
        selected={activeSection === "travel-requests"}
        onClick={() => handleSectionChange("travel-requests")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <CalendarToday sx={{ fontSize: 20,  color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Travel Requests" 
          primaryTypographyProps={{ 
            color: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "final-approval"}
        onClick={() => handleSectionChange("final-approval")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <CalendarToday sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Final Approval" 
          primaryTypographyProps={{ 
            color: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "fleet-management"}
        onClick={() => handleSectionChange("fleet-management")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <LocalShipping sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Fleet Management" 
          primaryTypographyProps={{ 
            color: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>
    </List>

    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

    {/* Finance Processing Section */}
    <List>
      <SidebarGroupLabel sx={{  color: 'inherit', }}>FINANCE PROCESSING</SidebarGroupLabel>
      
      <StyledListItemButton
        selected={activeSection === "finance-processing"}
        onClick={() => handleSectionChange("finance-processing")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <CreditCard sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Processing" 
          primaryTypographyProps={{ 
            color: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "reconciliation"}
        onClick={() => handleSectionChange("reconciliation")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <Description sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Reconciliation" 
          primaryTypographyProps={{ 
            color: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>
    </List>

    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

    {/* Reports Section */}
    <List>
      <SidebarGroupLabel sx={{  color: 'inherit', }}>Reports</SidebarGroupLabel>
      
      <StyledListItemButton
        selected={activeSection === "analytics"}
        onClick={() => setActiveSection("analytics")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <BarChart sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Analytics" 
          primaryTypographyProps={{ 
            color: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>

      <StyledListItemButton
        selected={activeSection === "reports"}
        onClick={() => setActiveSection("reports")}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(25, 118, 210, 0.16)',
            color: '#ffffff',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.24)' }
          },
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
        }}
      >
        <ListItemIcon>
          <PieChart sx={{ fontSize: 20,   color: '#f9f9f9', }} />
        </ListItemIcon>
        <ListItemText 
          primary="Reports" 
          primaryTypographyProps={{ 
            color: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 500
          }} 
        />
      </StyledListItemButton>
    </List>

    {/* Settings & Logout Section */}
    <Box sx={{ mt: 'auto' }}>
    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        <StyledListItemButton 
          onClick={() => navigate("/settings")}
          sx={{ 
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          <ListItemIcon>
            <Settings sx={{ fontSize: 20,   color: '#f9f9f9', }} />
          </ListItemIcon>
          <ListItemText 
            primary="Settings" 
            primaryTypographyProps={{ 
              color: 'inherit',
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
            <ExitToApp sx={{ fontSize: 20,   color: '#f9f9f9', }} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ 
              color: 'inherit',
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
  p: 1,
  border: 'none',
  height: 75,
  backdropFilter: `blur(${opacity * 12}px) saturate(180%)`,
  position: 'sticky',
  top: 0,
  zIndex: theme => theme.zIndex.appBar,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: alpha(theme.palette.background.default, 0.8),
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
  '&:hover': {
    backdropFilter: `blur(${opacity * 16}px) saturate(200%)`
  }
}}>
  <Toolbar sx={{ px: { sm: 1.5 }, gap: 1 }}>
    {/* Left-aligned items */}
    <Box sx={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 2,
      mr: 'auto' 
    }}>
      {/* Modern Notification icon with pulse animation */}
      <IconButton 
        color="inherit"
        sx={{
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }
        }}
      >
        <Badge badgeContent={3} color="error" variant="dot" overlap="circular">
          <NotificationsActive sx={{ 
            color: theme.palette.text.primary,
            transform: 'rotate(-20deg)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'rotate(0deg)'
            }
          }} />
        </Badge>
      </IconButton>

      {/* Date display */}
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      px: 2,
      py: 1,
      borderRadius: 1,
      bgcolor: alpha(theme.palette.primary.main, 0.08),
      color: theme.palette.text.primary,
      '& svg': {
        width: 20,
        height: 20,
        color: theme.palette.primary.main
      }
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </Typography>
    </Box>
    </Box>

    

    {/* Right-aligned items */}
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1.5,
      mr: 1 
    }}>
      {/* Modern Icons */}
      <Tooltip title="Help Center">
        <IconButton color="inherit" sx={{ p: 1.2 }}>
          <LiveHelp sx={{ 
            fontSize: 22,
            color: theme.palette.text.secondary,
            transition: 'color 0.2s ease',
            '&:hover': {
              color: theme.palette.primary.main
            }
          }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="AI Assistant">
        <IconButton color="inherit" sx={{ p: 1.2 }}>
          <SmartToy sx={{
            fontSize: 22,
            color: theme.palette.text.secondary,
            transition: 'transform 0.3s ease',
            '&:hover': {
              color: theme.palette.secondary.main,
              transform: 'scale(1.1)'
            }
          }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Preferences">
        <IconButton color="inherit" sx={{ p: 1.2 }}>
          <Tune sx={{
            fontSize: 22,
            color: theme.palette.text.secondary,
            transition: 'all 0.3s ease',
            '&:hover': {
              color: theme.palette.success.main,
              transform: 'rotate(90deg)'
            }
          }} />
        </IconButton>
      </Tooltip>
    </Box>

    {/* User profile with modern dropdown */}
    <Box sx={{ position: 'relative' }}>
      <Button
        onClick={handleMenuClick}
        sx={{ 
          p: 0.5,
          borderRadius: '50%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            '& .MuiAvatar-root': {
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
            }
          }
        }}
      >
        <Avatar sx={{ 
          width: 38, 
          height: 38,
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.9) : theme.palette.primary.main,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            animation: 'ripple 3s infinite'
          }
        }} src={user.avatar}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {user.firstName ? user.firstName.split(" ").map(n => n[0]).join("") : "GU"}
          </Typography>
        </Avatar>
      </Button>

      {/* Modern Menu dropdown */}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 3,
            overflow: 'visible',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.1)}`,
            '&:before': {
              content: '""',
              position: 'absolute',
              top: -8,
              right: 16,
              width: 16,
              height: 16,
              bgcolor: 'background.paper',
              transform: 'rotate(45deg)',
              borderLeft: `1px solid ${theme.palette.divider}`,
              borderTop: `1px solid ${theme.palette.divider}`
            }
          }
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.2, gap: 1.5 }}>
          <Person sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
          <Typography variant="body2">Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.2, gap: 1.5 }}>
          <SettingsApplications sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleMenuClose} sx={{ 
          py: 1.2,
          gap: 1.5,
          color: theme.palette.error.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, 0.08)
          }
        }}>
          <ExitToApp sx={{ fontSize: 20 }} />
          <Typography variant="body2">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </Box>

    {/* Modern Mobile menu button */}
    <IconButton
      onClick={() => setMobileOpen(!mobileOpen)}
      sx={{ 
        display: { sm: 'none' },
        p: 1.2,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.1)
        }
      }}
    >
      <MenuOpen sx={{ 
        fontSize: 26,
        color: theme.palette.text.primary,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'rotate(90deg)'
        }
      }} />
    </IconButton>
  </Toolbar>
</Paper>
        {/* Main Content Area */}
<Box sx={{ p: 1.5 }}>
  {activeSection === "dashboard" ? (
    <Box sx={{ maxWidth: '100%', margin: '0 auto' }}>
      {/* All the current dashboard content */}
      <Box sx={{ maxWidth: '100%', margin: '0 auto' }}>
            {/* Page Title */}
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: 'center',
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Box>
                <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Dashboard Overview
                </Typography>
                <Typography variant="body" color="text.secondary" sx={{ fontSize: '0.875rem'}} >
                  Welcome back {user.firstName}, here's what's happening with your procurement activities.
                </Typography>
              </Box>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ 
              display: "grid", 
              gap: 1.5, 
              gridTemplateColumns: { 
                xs: "1fr", 
                sm: "repeat(2, 1fr)", 
                lg: "repeat(4, 1fr)" 
              }, 
              mb: 2.5 
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
                xs:  "1fr 1fr",
              },
              mb: 4,
              minWidth: "600px"
            }}>
              {/* Enhanced Procurement Status */}
              <ProcurementStatusCard
                summaryData={summaryData}
                colors={colors}
                allData={allData}
                activeIndex={activeIndex}
                onPieEnter={onPieEnter}
                onPieLeave={onPieLeave}
                stats={stats}
              />

                {/* Pending Approvals */}
                  <RevenueChart 
  salesData={salesData} 
  revenueBreakdown={revenueBreakdown} 
  regionalMapData={regionalMapData} 
/> 
            </Box>

            {/* Recent Activity */}
             {/*    <Card sx={{ 
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
            </Card>*/}
         
             {/*Recent Reports */}
               <div className="recent-reports">
      <div className="section-header">
        <h2 className="section-title">Recent Reports</h2>
        <div className="section-actions">
          <button className="btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Export All
          </button>
          
          <button className="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Report
          </button>
        </div>
      </div>
      
      <div className="reports-table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Type</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.map((report, index) => (
              <tr className="report-row" key={index}>
                <td>
                  <div className="report-info">
                    <div className={`report-thumbnail ${report.thumbnail}`}>
                      {report.thumbnail === 'graph-bar' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="20" x2="18" y2="10"></line>
                          <line x1="12" y1="20" x2="12" y2="4"></line>
                          <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                      )}
                      {report.thumbnail === 'box' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                      )}
                      {report.thumbnail === 'users' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      )}
                      {report.thumbnail === 'trending-up' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                          <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <div className="report-name">{report.name}</div>
                  </div>
                </td>
                <td>{report.type}</td>
                <td>{report.created_at}</td>
                <td>
                  <div className="report-actions">
                    <button className="action-btn view">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    
                    <button className="action-btn download">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                    
                    <button className="action-btn favorite">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                    
                    <button className="action-btn favorite">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                    
                    <button className="action-btn more">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <button className="pagination-btn prev disabled">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Previous
        </button>
        
        <div className="pagination-info">
          Showing <span>1-4</span> of <span>4</span>
        </div>
        
        <button className="pagination-btn next disabled">
          Next
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
               </div>

                   <Box sx={{ mb: 4 }}>
      <ProductReviewsAnalysis />
    </Box>


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
      {activeSection === "vendors" && <VendorsPage/>}

      {/* other sections */}
    </Box>
  )}
</Box>
      </Box>
        <AIChatButton />
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
            width: 30,
            height: 30
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 12 } })}
          </Avatar>
          <Badge
            color={trendDirection === "up" ? "success" : "error"}
            badgeContent={trend}
            sx={{ 
              '& .MuiBadge-badge': { 
                fontSize: "0.6rem", 
                height: 12,
                borderRadius: 6,
                padding: '0 3px',
              } 
            }}
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25,fontSize:'0.8rem' }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ 
            display: 'block',
            mt: 0.25,
            color: theme.palette.text.secondary,
            fontSize: '0.7rem',
            lineHeight: 1.4
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
              {title || "New Item"}
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
            {requester ? `By ${requester} • ${date}` : date}
            </Typography>
            {amount && (
              <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                {amount}
              </Typography>
            )}
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
      </CardContent>  
    </ActivityCard> 
  );
}