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
import TravelExecutionReconciliation from '../../pages/dashboard/requisitions/manage/travel-exec-recon';
import TravelDashboard from '../../pages/dashboard/requisitions/manage/travel-dash';
import TravelReconciliation from '../../pages/dashboard/requisitions/recon';
import NewRequisitionPage from '../../pages/dashboard/requisitions/requisitions';


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

// Main Dashboard Component
export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    requisitions: { counts: { pending: 0 } },
    rfqs: { counts: { open: 0 } },
    purchaseOrders: { counts: { pending: 0 } },
    invoices: { counts: { pending: 0 } }
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const open = Boolean(anchorEl);

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
       <Sidebar variant="permanent" open>
              <SidebarHeader>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 2, 
                  px: 1,
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        height: 34,
                        width: 36,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1.5,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                      }}
                    >
                      <Layers sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      HRMS Dashboard
                    </Typography>
                  </Box>
                  <IconButton onClick={toggleSidebar} size="small">
                    {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                  </IconButton>
                </Box>
              </SidebarHeader>
      
              <Divider />
      
              <List>
                <SidebarGroupLabel>Main</SidebarGroupLabel>
                <StyledListItemButton
                  selected={activeSection === "dashboard"}
                  onClick={() =>handleSectionChange("dashboard")}
                >
                  <ListItemIcon>
                    <Home sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </StyledListItemButton>
      
                <StyledListItemButton
                  selected={activeSection === "requisitions"}
                  onClick={() => handleSectionChange("requisitions")}
                >
                  <ListItemIcon>
                    <ShoppingCart sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Requisitions" />
                  <Badge badgeContent={stats.requisitions.counts.pending} color="primary" />
                </StyledListItemButton>

      
                <StyledListItemButton
                  selected={activeSection === "invoices"}
                  onClick={() => handleSectionChange("invoices")}
                >
                  <ListItemIcon>
                    <CreditCard sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Requisition review" />
                  <Badge badgeContent={stats.invoices.counts.pending} color="primary" />
                </StyledListItemButton>
              </List>
      
              <Divider />
      
              <List>
                <SidebarGroupLabel>Travel Management</SidebarGroupLabel>
                <StyledListItemButton
                  selected={activeSection === "travel-requests"}
                  onClick={() => handleSectionChange("travel-requests")}
                >
                  <ListItemIcon>
                    <CalendarToday sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Travel Requests" />
                </StyledListItemButton>

                <StyledListItemButton
                  selected={activeSection === "travel-execution"}
                  onClick={() => handleSectionChange("travel-execution")}
                >
                  <ListItemIcon>
                    <CalendarToday sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Travel Execution" />
                </StyledListItemButton>

                <StyledListItemButton
                  selected={activeSection === "travel-requests1"}
                  onClick={() => handleSectionChange("travel-requests1")}
                >
                  <ListItemIcon>
                    <CalendarToday sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Travel Reconciliation" />
                </StyledListItemButton>
              
      
            
              </List>
              <Divider />
      
              <List>
                <SidebarGroupLabel>Reports</SidebarGroupLabel>
                <StyledListItemButton
                  selected={activeSection === "analytics"}
                  onClick={() => setActiveSection("analytics")}
                >
                  <ListItemIcon>
                    <BarChart sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Analytics" />
                </StyledListItemButton>
      
                <StyledListItemButton
                  selected={activeSection === "reports"}
                  onClick={() => setActiveSection("reports")}
                >
                  <ListItemIcon>
                    <PieChart sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                </StyledListItemButton>
              </List>
      
              <Box sx={{ mt: "auto" }}>
                <Divider />
                <List>
                  <StyledListItemButton onClick={() => navigate("/settings")}>
                    <ListItemIcon>
                      <Settings sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </StyledListItemButton>
      
                  <StyledListItemButton onClick={() => console.log("Logout")}>
                    <ListItemIcon>
                      <ExitToApp sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </StyledListItemButton>
                </List>
              </Box>
            </Sidebar>
      

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, overflow: "auto", backgroundColor: theme.palette.background.default }}>
        {/* Header */}
        <Paper elevation={0} sx={{ 
          p: 1.5, 
          borderBottom: 1, 
          borderColor: "divider",
          backgroundColor: theme.palette.background.paper,
          position: 'sticky',
          top: 0,
          zIndex: theme.zIndex.appBar,
        }}>
          <Toolbar sx={{ px: { sm: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mr: 'auto' }}>
              <IconButton 
                color="inherit"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications sx={{ color: theme.palette.text.primary }} />
                </Badge>
              </IconButton>

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
                  '&:hover': { backgroundColor: theme.palette.action.hover }
                }}
                id="user-menu-button"  
                aria-controls={open ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main }} src={user?.avatar}>
                  {user?.name?.split(" ").map(n => n[0]).join("")}
                </Avatar>
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
                </Box>
                <ExpandMore sx={{ fontSize: 16 }} />
              </Button>

              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
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
                  <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ py: 1 }}>
                  <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose} sx={{ py: 1 }}>
                  <ListItemIcon><ExitToApp fontSize="small" /></ListItemIcon>
                  Log out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Paper>

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
                  <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Employee Dashboard
                  </Typography>
                  <Typography variant="body" color="text.secondary" sx={{ fontSize: '0.875rem'}} >
                    Welcome back, {user?.name}. Here's your current work status.
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
                  title="My Requisitions"
                  value={5}
                  description="3 pending approval"
                  trend="+2 this week"
                  trendDirection="up"
                  icon={<ShoppingCart />}
                  color="primary"
                />

                <StatsCardComponent
                  title="My Approvals"
                  value={8}
                  description="5 awaiting your review"
                  trend="+3 today"
                  trendDirection="up"
                  icon={<Check />}
                  color="success"
                />

                <StatsCardComponent
                  title="Travel Requests"
                  value={3}
                  description="1 pending submission"
                  trend="No change"
                  trendDirection="neutral"
                  icon={<LocalShipping />}
                  color="info"
                />

                <StatsCardComponent
                  title="Expense Reports"
                  value={7}
                  description="2 need reconciliation"
                  trend="-1 yesterday"
                  trendDirection="down"
                  icon={<CreditCard />}
                  color="warning"
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
                {/* My Tasks */}
                <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[1] }}>
                  <CardHeader
                    title="My Current Tasks"
                    subheader="Items requiring your action"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                    subheaderTypographyProps={{ variant: 'body2' }}
                  />
                  <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <StatusItemComponent
                        title="Requisitions to Approve"
                        total={8}
                        items={[
                          { label: "High Priority", value: 3, color: "error" },
                          { label: "Medium Priority", value: 4, color: "warning" },
                          { label: "Low Priority", value: 1, color: "success" },
                        ]}
                      />

                      <StatusItemComponent
                        title="My Pending Requests"
                        total={5}
                        items={[
                          { label: "Awaiting Approval", value: 3, color: "warning" },
                          { label: "In Progress", value: 2, color: "info" },
                        ]}
                      />

                      <StatusItemComponent
                        title="Travel Approvals"
                        total={4}
                        items={[
                          { label: "Pending", value: 2, color: "warning" },
                          { label: "Approved", value: 1, color: "success" },
                          { label: "Rejected", value: 1, color: "error" },
                        ]}
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[1] }}>
                  <CardHeader
                    title="Quick Actions"
                    subheader="Common tasks you can perform"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                    subheaderTypographyProps={{ variant: 'body2' }}
                  />
                  <CardContent sx={{ p: 0 }}>
                    <List>
                      <ListItemButton 
                        sx={{ px: 2, py: 1.5 }} 
                        onClick={() => handleSectionChange("requisitions")}
                      >
                        <ListItemIcon><Add color="primary" /></ListItemIcon>
                        <ListItemText primary="Create New Requisition" />
                      </ListItemButton>
                      <ListItemButton 
                        sx={{ px: 2, py: 1.5 }} 
                        onClick={() => handleSectionChange("travel-requests")}
                      >
                        <ListItemIcon><CalendarToday color="secondary" /></ListItemIcon>
                        <ListItemText primary="Submit Travel Request" />
                      </ListItemButton>
                      <ListItemButton 
                        sx={{ px: 2, py: 1.5 }} 
                        onClick={() => handleSectionChange("expense-reports")}
                      >
                        <ListItemIcon><Description color="info" /></ListItemIcon>
                        <ListItemText primary="Submit Expense Report" />
                      </ListItemButton>
                    </List>
                  </CardContent>
                </Card>
              </Box>

              {/* Recent Activity */}
              <Card sx={{ mt: 3, borderRadius: 3, boxShadow: theme.shadows[1] }}>
                <CardHeader
                  title="My Recent Activity"
                  subheader="Your latest actions in the system"
                  titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  subheaderTypographyProps={{ variant: 'body2' }}
                />
                <CardContent>
                  <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
                    <ActivityCardComponent
                      title="Requisition Approved"
                      description="Office supplies #REQ-2023-042 approved"
                      time="2 hours ago"
                      icon={<Check />}
                      color="success"
                    />
                    <ActivityCardComponent
                      title="Travel Request Submitted"
                      description="Conference trip to New York submitted"
                      time="Yesterday"
                      icon={<CalendarToday />}
                      color="info"
                    />
                    <ActivityCardComponent
                      title="Expense Report Rejected"
                      description="Hotel expenses #EXP-2023-15 needs revision"
                      time="3 days ago"
                      icon={<Error />}
                      color="error"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Box>
              {activeSection === "requisitions" && <NewRequisitionPage />}
              {activeSection === "new-recon" && <TravelReconciliation  />}
              {activeSection === "travel-requests" && <TravelDashboard />}
              {activeSection === "travel-execution" && < TravelExecutionReconciliation/>}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}