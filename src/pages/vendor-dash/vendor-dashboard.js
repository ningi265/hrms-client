import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import ActivityChangelogComponent from './activity'
import TravelExecutionReconciliation from '../../pages/dashboard/requisitions/manage/travel-exec-recon';
import TravelDashboard from '../../pages/dashboard/requisitions/manage/travel-dash';
import TravelReconciliation from '../../pages/dashboard/requisitions/recon';
import NewRequisitionPage from '../../pages/dashboard/requisitions/requisitions';
import VendorRFQsPage from "../dashboard/vendors/qoutes/qoutes";
import VendorPODetailsPage from "../vendor-dash/purchase-orders/accept/accept";
import SubmitQuotePage from "../dashboard/vendors/qoutes/submit/submit";
import VendorInvoiceSubmissionPage from "../vendor-dash/invoices/invoices";


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
export default function VendorDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
 const [stats, setStats] = useState({
  requisitions: { counts: { total: 0, pending: 0 } },
  rfqs: { counts: { total: 0, open: 0 } },
  purchaseOrders: { counts: { total: 0, pending: 0 } },
  invoices: { counts: { total: 0, pending: 0 } }
});
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const open = Boolean(anchorEl);
   const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const handleSectionChange = (section) => setActiveSection(section);

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
             />
      

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, overflow: "auto", backgroundColor: theme.palette.background.default }}>
        {/* Header */}
             <DashboardHeader 
            user={user}
            onMobileMenuToggle={setMobileOpen}
      
          />

        {/* Main Content Area */}
        <Box sx={{ p: 2 }}>
          {activeSection === "dashboard" ? (
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
                  <Typography variant="h5" component="h1" gutterBottom  sx={{ fontWeight: 700, color: 'black' }}>
                    Vendor Dashboard
                  </Typography>
                  <Typography variant="body1"  sx={{ fontSize: '0.875rem', fontWeight: 400, color: 'black' }} >
                    Welcome back, {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}. Here's your current supply status.
                  </Typography>
                </Box>
              </Box>

              {/* Stats Cards */}
             <StatsCardsGrid stats={stats} />
              {/* Main Content Grid */}
<Box sx={{ 
  display: "flex", 
  gap: 2,
  mb: 4,
  width: "100%",
  height: "100%",
}}>
  {/* Tasks - Takes exactly half width */}
  <Box sx={{ 
    flex: 1, 
    minWidth: 0, // Prevent overflow
    height: "100%",
    display: "flex",
    flexDirection: "column"
  }}>
    <BarChartComponent/>
  </Box>

  {/* Quick Actions - Takes exactly half width */}
  <Box sx={{ 
    flex: 1,
    minWidth: 0, // Prevent overflow
    height: "100%",
    display: "flex",
    flexDirection: "column"
  }}>
    <QuickActions handleSectionChange={handleSectionChange} />
  </Box>
</Box>

                {/* Recent Activity - Full width below with no top margin */}
<Box sx={{ width: "100%" }}>
  <ActivityChangelogComponent/>    
</Box>

              
            </Box>
          ) : (
            <Box>
              {activeSection === "rfq" && <VendorRFQsPage />}
              {activeSection === "invoices" && <VendorInvoiceSubmissionPage  />}
              {activeSection === "purchase-order" && <VendorPODetailsPage />}
            </Box>
          )}
        </Box>
      </Box>
       <AIChatButton user={user} />
    </Box>
  );
}