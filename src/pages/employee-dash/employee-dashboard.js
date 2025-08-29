import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  LinearProgress,
  CircularProgress
} from "@mui/material";
import { useAuth } from "../../authcontext/authcontext";
import { userAPI } from "../User/api/userService";
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
import ManageRequisitionsPage from "../dashboard/requisitions/manage/manage";
import EmployeeRequisitionManagement from "./requisition/requistionManagement";
import UserProfilePage from "../User/user";


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

// Helper function to safely get user display name
const getUserDisplayName = (user, userProfile) => {
  // Try to get name from userProfile first (API response), then fallback to auth user
  const profileUser = userProfile?.user || userProfile;
  const authUser = user;
  
  const firstName = profileUser?.firstName || authUser?.firstName;
  const lastName = profileUser?.lastName || authUser?.lastName;
  
  if (!firstName || typeof firstName !== 'string') {
    return 'User';
  }
  
  const displayFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const displayLastName = lastName ? ` ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}` : '';
  
  return `${displayFirstName}${displayLastName}`;
};

// Helper function to determine if user is first-time
const isFirstTimeUser = (userProfile) => {
  if (!userProfile) return false;
  
  // Get user data from the nested structure
  const profileUser = userProfile.user || userProfile;
  
  // Check if lastLoginAt is null (first login) or very recent registration
  const hasNeverLoggedIn = !profileUser.lastLoginAt || profileUser.lastLoginAt === null;
  
  // Check registration time
  const createdAt = new Date(profileUser.createdAt);
  const now = new Date();
  const hoursSinceRegistration = (now - createdAt) / (1000 * 60 * 60);
  
  // Consider first-time if:
  // 1. Never logged in before OR
  // 2. Registered less than 24 hours ago
  return hasNeverLoggedIn || hoursSinceRegistration < 24;
};

// Helper function to get appropriate welcome message
const getWelcomeMessage = (user, userProfile, userStats) => {
  const displayName = getUserDisplayName(user, userProfile);
  const isFirstTime = isFirstTimeUser(userProfile);
  
  if (isFirstTime) {
    return {
      title: `Welcome to your dashboard, ${displayName}! 🎉`,
      subtitle: "You're all set up! Here's everything you need to get started with your employee dashboard."
    };
  }
  
  // Existing user welcome message
  const profileUser = userProfile?.user || userProfile;
  const lastLoginTime = profileUser?.lastLoginAt 
    ? new Date(profileUser.lastLoginAt).toLocaleDateString()
    : 'today';
  
  return {
    title: `Welcome back, ${displayName}!`,
    subtitle: `Here's your current work status. Last login: ${lastLoginTime}`
  };
};

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
const EmployeeRequisitionsSection = () => (
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

const EmployeeNewRequisitionSection = () => (
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

const EmployeeTravelRequestSection = () => (
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

const EmployeeExpenseReportSection = () => (
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

// Loading Component
const LoadingScreen = ({ theme }) => (
  <Box sx={{
    display: "flex", 
    height: "100vh", 
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.background.default,
  }}>
    <Box sx={{ textAlign: 'center' }}>
      <CircularProgress size={40} sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
        Loading Dashboard...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we load your information
      </Typography>
    </Box>
  </Box>
);

// Main Dashboard Component
export default function EmployeeDashboard() {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL RETURNS
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, loading, token } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [stats, setStats] = useState({
    requisitions: { counts: { total: 0, pending: 0 } },
    rfqs: { counts: { total: 0, open: 0 } },
    purchaseOrders: { counts: { total: 0, pending: 0 } },
    invoices: { counts: { total: 0, pending: 0 } }
  });
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Constants
  const open = Boolean(anchorEl);
  const SIDEBAR_WIDTH = 256;
  const COLLAPSED_SIDEBAR_WIDTH = 70;
  const opacity = Math.min(scrollPosition / 100, 1);

  // useEffect hooks
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

  useEffect(() => {
    const section = searchParams.get('section') || 'dashboard';
    setActiveSection(section);
  }, [searchParams]);

  // Fetch user profile and stats when user is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !token) return;
      
      try {
        setProfileLoading(true);
        
        // Fetch user profile and stats in parallel
        const [profileResponse, statsResponse] = await Promise.all([
          userAPI.getProfile().catch(err => {
            console.warn('Failed to fetch profile:', err);
            return null;
          }),
          userAPI.getUserStats().catch(err => {
            console.warn('Failed to fetch user stats:', err);
            return null;
          })
        ]);
        
        if (profileResponse) {
          setUserProfile(profileResponse);
          console.log('User profile loaded:', profileResponse);
        }
        
        if (statsResponse) {
          setUserStats(statsResponse);
          console.log('User stats loaded:', statsResponse);
          
          // Update dashboard stats with user-specific data if available
          if (statsResponse.dashboardStats) {
            setStats(prev => ({
              ...prev,
              ...statsResponse.dashboardStats
            }));
          }
        }
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserData();
  }, [user, token]);

  // Check for authentication - if auth context is done loading but no user/token, redirect to login
  useEffect(() => {
    if (!loading && (!user || !token)) {
      console.log('No user or token found, redirecting to login');
      navigate('/login');
    }
  }, [user, token, loading, navigate]);

  // Show loading screen while auth context is initializing
  if (loading || profileLoading) {
    return <LoadingScreen theme={theme} />;
  }

  // Show loading screen if no user data (will redirect to login via useEffect)
  if (!user || !token) {
    return <LoadingScreen theme={theme} />;
  }

  // Event handlers
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const handleSectionChange = (section) => {
    navigate(`?section=${section}`, { replace: true });
  };

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
              {/* Stats Cards */}
              <StatsCardsGrid stats={stats} userStats={userStats} />
              
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
                {/* Activity Header with User Context */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Activity
                  </Typography>
                  {userProfile && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      px: 2,
                      py: 1,
                      bgcolor: 'grey.50',
                      borderRadius: 1
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Member since: {new Date((userProfile.user || userProfile).createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <ActivityChangelogComponent userStats={userStats} />    
              </Box>
            </Box>
          ) : (
            <Box>
              {activeSection === "requisitions" && <NewRequisitionPage />}
              {activeSection === "new-recon" && <TravelReconciliation />}
              {activeSection === "travel-requests" && <TravelDashboard />}
              {activeSection === "travel-execution" && <TravelExecutionReconciliation/>}
              {activeSection === "manage-requisitions" && <EmployeeRequisitionManagement/>}
              {activeSection === "user-profile" && <UserProfilePage />}
            </Box>
          )}
        </Box>
      </Box>
      <AIChatButton user={user} />
    </Box>
  );
}