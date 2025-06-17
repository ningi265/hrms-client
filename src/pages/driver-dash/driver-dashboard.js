import React, { useState,useEffect } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  BarChart,
  PieChart,
  Inventory,
  CreditCard,
  LocalShipping,
  Description,
  Settings,
  ExitToApp,
  Notifications,
  Person,
  ChevronLeft,
  ChevronRight,
  Layers,
  ExpandMore,
  Add,
  CalendarToday,
  Check,
  Error,
  People
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Box,
  Drawer,
  Toolbar,
  useTheme,
  styled,
  alpha,
  LinearProgress
} from "@mui/material";
import { useAuth } from "../../authcontext/authcontext";
import HRMSSidebar from './sidebar';
import DashboardHeader from './header';
import StatsCardsGrid from './statsCard';
import AIChatButton from '../dashboard/aiChat';
import QuickActions from './quickActions';
import BarChartComponent from './tasks';
import MapComponent  from './activity'
import TravelExecutionReconciliation from '../dashboard/requisitions/manage/travel-exec-recon';
import TravelDashboard from '../dashboard/requisitions/manage/travel-dash';
import TravelReconciliation from '../dashboard/requisitions/recon';
import NewRequisitionPage from '../dashboard/requisitions/requisitions';
import VendorRFQsPage from "../dashboard/vendors/qoutes/qoutes";
import VendorPODetailsPage from "../vendor-dash/purchase-orders/accept/accept";
import SubmitQuotePage from "../dashboard/vendors/qoutes/submit/submit";
//import VendorInvoiceSubmissionPage from "../vendor-dash/invoices/invoices";
//import VendorRegistration from "./registration/registration";
//import VendorManagementDashboard from "./registration/registrationManagement";
import UserProfilePage from "../User/user";
import TripManagementDashboard from "./trip-management";

// Styled Components
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

// Component Definitions
const StatsCardComponent = ({ title, value, description, trend, trendDirection, icon, color }) => {
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
          <Typography variant="caption" color={trendDirection === "up" ? "success.main" : "error.main"}>
            {trend}
          </Typography>
        </Box>
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>{value}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize:'0.875rem' }}>{title}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.75rem' }}>
            {description}
          </Typography>
        </Box>
      </CardContent>
    </StatsCard>
  );
};

const StatusItemComponent = ({ title, total, items }) => {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">Total: {total}</Typography>
      </Box>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" } }}>
        {items.map((item, index) => (
          <StatusItemPaper key={index}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">{item.label}</Typography>
              <Typography variant="body1" fontWeight="medium">{item.value}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(item.value / total) * 100}
              color={item.color}
              sx={{ height: 6, mt: 1.5, borderRadius: 3, bgcolor: alpha(theme.palette[item.color].main, 0.1) }}
            />
          </StatusItemPaper>
        ))}
      </Box>
    </Box>
  );
};

const ActivityCardComponent = ({ title, description, time, icon, color }) => {
  const theme = useTheme();
  return (
    <ActivityCard>
      <Box sx={{ height: 4, bgcolor: `${color}.main` }} />
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
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{description}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>{time}</Typography>
          </Box>
        </Box>
      </CardContent>
    </ActivityCard>
  );
};

// Employee Section Components
const VendorRequisitionsSection = () => (
  <Box>
    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>My Requisitions</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      View and manage your purchase requisitions
    </Typography>
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography>Requisition content goes here</Typography>
      </CardContent>
    </Card>
  </Box>
);

const VendorNewRequisitionSection = () => (
  <Box>
    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>New Requisition</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Create a new purchase requisition
    </Typography>
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography>Requisition form goes here</Typography>
      </CardContent>
    </Card>
  </Box>
);

const VendorTravelRequestSection = () => (
  <Box>
    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Travel Requests</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Manage your travel requests and approvals
    </Typography>
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography>Travel request content goes here</Typography>
      </CardContent>
    </Card>
  </Box>
);

const VendorExpenseReportSection = () => (
  <Box>
    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Expense Reports</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Submit and track your expense reports
    </Typography>
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography>Expense report content goes here</Typography>
      </CardContent>
    </Card>
  </Box>
);

// Main Dashboard Component
export default function DriverDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
 const [stats, setStats] = useState({
  requisitions: { counts: { total: 0, pending: 0 } },
  rfqs: { counts: { total: 0, open: 0 } },
  purchaseOrders: { counts: { total: 0, pending: 0 } },
  invoices: { counts: { total: 0, pending: 0 } }
});
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
   const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'vendor-dash';
  });
  const open = Boolean(anchorEl);
  const [selectedDriver, setSelectedDriver] = useState(null);
   const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [driverStats, setDriverStats] = useState({
    available: 12,
    onTrip: 5,
    offline: 2,
    maintenance: 1
  });
   const [mobileOpen, setMobileOpen] = useState(false);
    const { user: authUser, loading: authLoading } = useAuth();
   const user = authUser ? {
  ...authUser,
  name: authUser.firstName ? `${authUser.firstName} ${authUser.lastName || ''}`.trim() : 'Guest User',
  avatar: authUser.avatar || null,
  email: authUser.email || '',
  role: authUser.role || 'guest',
  companyName: authUser.companyName || 'NyasaSC' // Add this line
} : {
  name: 'Guest User',
  avatar: null,
  email: '',
  role: 'guest',
  companyName: 'NyasaSC' // Add this line
};

useEffect(() => {
    const section = searchParams.get('section') || 'vendor-dash';
    setActiveSection(section);
  }, [searchParams]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
      const [scrollPosition, setScrollPosition] = useState(0);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
    const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`?section=${section}`, { replace: true });
  };

  

  const SIDEBAR_WIDTH = 256;
    const COLLAPSED_SIDEBAR_WIDTH = 70;
  
     const opacity = Math.min(scrollPosition / 100, 1);
  
  
        useEffect(() => {
          const handleScroll = () => {
            setScrollPosition(window.pageYOffset);
          };
          
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
        }, []);
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
  return (
    <Box sx={{
      background: "linear-gradient(135deg,rgb(1, 4, 17) 0%,rgb(54, 79, 100) 100%)", 
      display: "flex", 
      height: "100vh", 
      overflow: "hidden",
    }}>
      {/* Sidebar */}
        <HRMSSidebar 
               stats={stats} 
               activeSection={activeSection} 
               handleSectionChange={handleSectionChange}
               onSidebarToggle={setSidebarOpen}
               user={user}
             />
      

      {/* Main Content */}
      <Box component="main" sx={{   flexGrow: 1, 
        overflow: "auto",
        backgroundColor: theme.palette.background.default,
        position: 'relative', }}>
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
        <Box sx={{  paddingTop: '80px', 
  minHeight: 'calc(100vh - 64px)',
   position: 'relative',
     zIndex: 1,
      padding: '80px 1.5rem 1.5rem',}}>
          {activeSection === "vendor-dash" ? (
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
                  <Typography variant="h5" component="h1" gutterBottom  sx={{ fontWeight: 700, color: 'black' }}>
                    Drivers Dashboard
                  </Typography>
                  <Typography variant="body1"  sx={{ fontSize: '0.875rem', fontWeight: 400, color: 'black' }} >
                    Welcome back, {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}. Here's your current driving status.
                  </Typography>
                </Box>
              </Box>       
              {/* Main Content Grid -<Box sx={{ width: "100%" }}>
  <ActivityChangelogComponent/>    
</Box> */}
<MapComponent 
  drivers={searchQuery ? filteredDrivers : drivers}
  selectedDriver={selectedDriver}
  onDriverSelect={setSelectedDriver}
/>
  
            </Box>
          ) : (
            <Box>
              {activeSection === "trip-management" && <TripManagementDashboard />}

               {activeSection === "user-profile" && <UserProfilePage />}
               
            </Box> 
          )}
        </Box>
      </Box>
       <AIChatButton user={user} />
    </Box>
  );
}