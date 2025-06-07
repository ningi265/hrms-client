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
  ThemeProvider,
  CircularProgress
} from "@mui/material";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './dashboard.css';
import RevenueChart from './revenueChart';
import DateComponent from './date';
import ProcurementStatusCard from './procurementStatus';
import ProductReviewsAnalysis from './productProcurement';
import StatsCardsGrid from './statsCard';
import FinancialDashboard from './financial';
import HRMSSidebar from './sidebar';
import DashboardHeader from './header';
import UserProfilePage from "../../pages/User/user";
import { motion, AnimatePresence } from 'framer-motion';
import RequisitionsSection from "../dashboard/requisitions/manage/manage";
import ReconciliationSection from "../dashboard/requisitions/manage/finance-recon-review";
import PurchaseOrdersSection  from '../../pages/dashboard/purchase-orders/purchase-order';
import NewRequisitionSection  from '../../pages/dashboard/requisitions/requisitions';
import RFQsSection  from '../../pages/dashboard/rfqs/view/view_rfqs';
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
import EmployeesPage from "./employee/employee";
import DepartmentsPage from "./departments/departments";
import VendorApprovalPage from "./vendors/registration";


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
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    backgroundColor: '#292929 ', // Dark background
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundImage: 'none',
    boxShadow: 'none',
    color: '#ffffff', // White text
  },
}));

const PageContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  overflow: "hidden",
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
   const [sidebarOpen, setSidebarOpen] = useState(true);
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
const user = authUser ? {
  ...authUser,
  name: authUser.firstName ? `${authUser.firstName} ${authUser.lastName || ''}`.trim() : 'Guest User',
  avatar: authUser.avatar || null,
  email: authUser.email || '',
  role: authUser.role || 'guest'
} : {
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

  useEffect(() => {
    const handleStorageChange = () => {
      const savedOpenState = localStorage.getItem('sidebarOpen');
      if (savedOpenState !== null) {
        setSidebarOpen(JSON.parse(savedOpenState));
      }
    };

    // Listen for custom sidebar toggle events
    const handleSidebarToggle = (event) => {
      setSidebarOpen(event.detail.open);
    };

    // Listen for storage changes and custom events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    // Check initial state
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  const SIDEBAR_WIDTH = 256;
  const COLLAPSED_SIDEBAR_WIDTH = 70;



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
       <ThemeProvider theme={theme}>
         <PageContainer>
           <Box
             display="flex"
             justifyContent="center"
             alignItems="center"
             height="100%"
           >
             <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.5 }}
             >
               <Box textAlign="center" sx={{ color: "text.secondary" }}>
                 <DotLottieReact
      src="spinner.lottie"
      loop
      autoplay
    />
                 <Typography variant="h6" gutterBottom>
                   Loading Dashboard...
                 </Typography>
                 <Typography variant="body2">
                   Please wait while we fetch the latest data...
                 </Typography>
               </Box>
             </motion.div>
           </Box>
         </PageContainer>
       </ThemeProvider>
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
      <HRMSSidebar 
        stats={stats} 
        activeSection={activeSection} 
        handleSectionChange={handleSectionChange}
         onSidebarToggle={setSidebarOpen}
      />

      {/* Main Content */}
    <Box component="main" sx={{ 
        flexGrow: 1, 
        overflow: "auto",
        backgroundColor: theme.palette.background.default,
        position: 'relative',
      }}>
        {/* Header */}
        <DashboardHeader 
          user={user}
          onMobileMenuToggle={setMobileOpen}
          scrollPosition={scrollPosition}
          handleSectionChange={handleSectionChange} 
          sidebarOpen={sidebarOpen}
          sidebarWidth={SIDEBAR_WIDTH}
          collapsedSidebarWidth={COLLAPSED_SIDEBAR_WIDTH}
        />
        {/* Main Content Area */}
<Box sx={{ 
  paddingTop: '80px', 
  minHeight: 'calc(100vh - 64px)',
   position: 'relative',
     zIndex: 1,
      padding: '80px 1.5rem 1.5rem',

  
  
  }}>
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
    <Typography 
      variant="h5" 
      component="h1" 
      gutterBottom 
      sx={{ fontWeight: 700, color: 'black' }}
    >
      Dashboard Overview
    </Typography>
     <Typography 
  variant="body1" 
  sx={{ fontSize: '0.875rem', fontWeight: 400, color: 'black' }}
>
  Welcome back {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}, here's what's happening with your procurement activities.
</Typography>


  </Box>
</Box>
            {/* Stats Cards */}
            <StatsCardsGrid stats={stats} />

              
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

               <RevenueChart 
  salesData={salesData} 
  revenueBreakdown={revenueBreakdown} 
  regionalMapData={regionalMapData} 
/> 
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
            </Box>

            <Box sx={{ mb: 4 }}>
               
         <FinancialDashboard/>
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
      {activeSection === "employees" && <EmployeesPage/>}
      {activeSection === "departments" && <DepartmentsPage/>}
      {activeSection === "user-profile" && <UserProfilePage />}
      {activeSection === "pending-registration" && <VendorApprovalPage />}
      {/* other sections */}
    </Box>
  )}
</Box>
      </Box>
        <AIChatButton user={user} />
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