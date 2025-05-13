import React, { useState, useEffect } from "react";
import { useNavigate ,useSearchParams } from "react-router-dom";
import {  AreaChart,Area,
  } from 'recharts';
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
  BarChart as BarChartIcon,
  Bolt,
  Sparkles,
  Dashboard as DashboardIcon
} from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
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
  CircularProgress,
  Grid,
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




// Styled components
const Sidebar = styled(Drawer)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 280,
    boxSizing: "border-box",
    backgroundColor: '#0F172A',
    border: 'none',
    color: '#fff',
    backgroundImage: 'none',
    boxShadow: '2px 0 24px rgba(0, 0, 0, 0.12)',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.05)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '3px',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
      },
    },
  },
}));

const SidebarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 2.5),
  ...theme.mixins.toolbar,
  backgroundColor: '#0B1426',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#fff',
}));

const SidebarGroupLabel = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2, 2.5, 0.5),
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: "0.70rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "1px",
}));

// Professional StatsCard
const StatsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: 16,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.02)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  "& .MuiCardContent-root": {
    padding: theme.spacing(2),
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  borderRadius: 12,
  margin: theme.spacing(0.5, 2),
  padding: theme.spacing(1, 2),
  minHeight: 44,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: 0,
    backgroundColor: '#3B82F6',
    transition: 'width 0.3s ease',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    '&:before': {
      width: '3px',
    },
    '&:hover': {
      backgroundColor: 'rgba(59, 130, 246, 0.16)',
    },
    '& .MuiListItemIcon-root': {
      color: '#3B82F6',
    },
    '& .MuiListItemText-primary': {
      color: '#FFFFFF',
      fontWeight: 600,
    }
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiListItemText-primary': {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.9)',
  },
}));

const StatusItemPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  border: `1px solid ${alpha('#E5E7EB', 0.8)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
    borderColor: alpha('#3B82F6', 0.2),
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'transparent',
    transition: 'background 0.3s ease',
  },
  '&:hover:before': {
    background: professionalColors.gradients.primary,
  },
}));

const ActivityCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.02)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
  },
}));

const backendUrl = process.env.REACT_APP_BACKEND_URL;
console.log(backendUrl);

// Enhanced Procurement Status Card Component
const ProcurementStatusCard = ({ summaryData, colors, allData, activeIndex, onPieEnter, onPieLeave, stats }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState('pie'); // 'pie', 'line', 'bar'
  const [activeCategory, setActiveCategory] = useState('Overall');

  // Prepare data for different chart types
  const categories = ['Overall', 'Requisitions', 'RFQs', 'Purchase Orders', 'Invoices'];
  
  const getChartData = () => {
    if (activeCategory === 'Overall') {
      return summaryData;
    }
    
    // Filter data by category
    return allData
      .filter(item => item.category === activeCategory)
      .map(item => ({
        name: item.name.split(' ')[0], // Get status (Pending, Approved, etc.)
        value: item.value,
        status: item.status,
      }));
  };

  const chartData = getChartData();

  // Animation variants
  const chartVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    },
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            {payload[0].name || label}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Count: <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>{payload[0].value}</span>
          </Typography>
          {chartType === 'pie' && (
            <Typography variant="caption" color="text.secondary">
              {Math.round((payload[0].value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100)}% of total
            </Typography>
          )}
        </motion.div>
      );
    }
    return null;
  };

  // Bar shape component for animations
  const AnimatedBar = (props) => {
    const { fill, ...rest } = props;
    return (
      <motion.g
        initial={{ scaleY: 0, translateY: rest.height }}
        animate={{ scaleY: 1, translateY: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: rest.index * 0.05 }}
        style={{ transformOrigin: `${rest.x + rest.width / 2}px ${rest.y + rest.height}px` }}
      >
        <rect {...rest} fill={fill} />
      </motion.g>
    );
  };

  // Render Chart based on type
  const renderChart = () => {
    const chartComponents = {
      pie: (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={activeIndex !== null ? 120 : 110}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              stroke={theme.palette.background.paper}
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[entry.status?.toLowerCase()] || theme.palette.primary.main}
                  fillOpacity={activeIndex === index ? 1 : 0.85}
                  style={{
                    filter: activeIndex === index ? 'drop-shadow(0 0 12px rgba(0,0,0,0.2))' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              layout="horizontal"
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => (
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}
                >
                  {value}
                </Typography>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
      
      line: (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="name" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}
                >
                  {value}
                </Typography>
              )}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: theme.palette.primary.main, strokeWidth: 2 }}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      ),
      
      bar: (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBar data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="name" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}
                >
                  {value}
                </Typography>
              )}
            />
            <Bar
              dataKey="value"
              fill={theme.palette.primary.main}
              shape={(props) => <AnimatedBar {...props} />}
            />
          </RechartsBar>
        </ResponsiveContainer>
      ),
    };

    return chartComponents[chartType];
  };

  // Quick Stats Section
  const QuickStats = () => {
    const totals = {
      Requisitions: stats.requisitions.counts.total,
      RFQs: stats.rfqs.counts.total,
      'Purchase Orders': stats.purchaseOrders.counts.total,
      Invoices: stats.invoices.counts.total
    };

    return (
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Process Breakdown */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(245, 245, 245, 0.8), rgba(255, 255, 255, 0.8))',
            borderRadius: 3,
            p: 3,
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 3 }}>
            Process Breakdown
          </Typography>
          {Object.entries(totals).map(([category, total]) => (
            <Box key={category} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" fontWeight={500} color="text.secondary">
                  {category}
                </Typography>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {total}
                </Typography>
              </Box>
              <Box sx={{ width: '100%', backgroundColor: theme.palette.grey[100], borderRadius: 2, height: 8 }}>
                <Box
                  sx={{
                    width: `${Math.round((total / 160) * 100)}%`,
                    height: '100%',
                    borderRadius: 2,
                    background:
                      category === 'Requisitions'
                        ? 'linear-gradient(to right, #60a5fa, #4f46e5)'
                        : category === 'RFQs'
                        ? 'linear-gradient(to right, #a78bfa, #4f46e5)'
                        : category === 'Purchase Orders'
                        ? 'linear-gradient(to right, #34d399, #047857)'
                        : 'linear-gradient(to right, #fb7185, #e11d48)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                  component={motion.div}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((total / 160) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Quick Insights */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {summaryData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${colors[item.status.toLowerCase()]}15, ${colors[item.status.toLowerCase()]}05)`,
                  border: `1px solid ${colors[item.status.toLowerCase()]}30`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: colors[item.status.toLowerCase()],
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {item.name}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {item.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.round((item.value / summaryData.reduce((sum, i) => sum + i.value, 0)) * 100)}% of total
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        background: 'white',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 4,
          background: 'linear-gradient(90deg, #3b82f6, #10b981)',
        },
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader
        title="Procurement Status"
        subheader="Current status of procurement activities"
        titleTypographyProps={{
          variant: 'h6',
          fontWeight: 700,
          color: 'text.primary',
          letterSpacing: 0.5,
        }}
        subheaderTypographyProps={{
          variant: 'body2',
          color: 'text.secondary',
        }}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Chart Type Selector */}
            <ButtonGroup variant="outlined" size="small" sx={{ mr: 2 }}>
              <Button
                onClick={() => setChartType('pie')}
                variant={chartType === 'pie' ? 'contained' : 'outlined'}
                sx={{ px: 1.5, minWidth: 'auto' }}
              >
                <PieChartIcon sx={{ fontSize: 18 }} />
              </Button>
              <Button
                onClick={() => setChartType('line')}
                variant={chartType === 'line' ? 'contained' : 'outlined'}
                sx={{ px: 1.5, minWidth: 'auto' }}
              >
                <Timeline sx={{ fontSize: 18 }} />
              </Button>
              <Button
                onClick={() => setChartType('bar')}
                variant={chartType === 'bar' ? 'contained' : 'outlined'}
                sx={{ px: 1.5, minWidth: 'auto' }}
              >
                <BarChartIcon sx={{ fontSize: 18 }} />
              </Button>
            </ButtonGroup>
          </Box>
        }
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          px: 3,
          py: 2,
        }}
      />
      
      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs 
          value={activeCategory} 
          onChange={(e, newValue) => setActiveCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
          }}
        >
          {categories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </Box>
      
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={chartType}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width: '100%', height: '100%', position: 'absolute' }}
            >
              {renderChart()}
            </motion.div>
          </AnimatePresence>
        </Box>
        
        {/* Quick Stats */}
        <QuickStats />
      </CardContent>
    </Card>
  );
};

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
    pending: '#F59E0B',
    approved: '#10B981',
    rejected: '#EF4444',
    open: '#3B82F6',
    closed: '#6366F1',
    paid: '#8B5CF6'
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
        const token = localStorage.getItem("token");

        const requisitionsResponse = await fetch(`${backendUrl}/api/requisitions/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const requisitionsData = await requisitionsResponse.json();

        const rfqsResponse = await fetch(`${backendUrl}/api/rfqs/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const rfqsData = await rfqsResponse.json();

        const purchaseOrdersResponse = await fetch(`${backendUrl}/api/purchase-orders/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const purchaseOrdersData = await purchaseOrdersResponse.json();

        const invoicesResponse = await fetch(`${backendUrl}/api/invoices/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const invoicesData = await invoicesResponse.json();

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
          gap: 3,
          backgroundColor: '#FAFAFA',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <CircularProgress 
            size={50} 
            thickness={4} 
            sx={{ 
              color: '#3B82F6',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }} 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h6" color="#1F2937" fontWeight={600} sx={{ mb: 1, fontSize: '1.125rem' }}>
            Loading Dashboard
          </Typography>
          <Typography variant="body2" color="#9CA3AF" align="center">
            Please wait while we fetch your data...
          </Typography>
        </motion.div>
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
          gap: 3,
          backgroundColor: '#FAFAFA',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Error sx={{ fontSize: 64, color: "#EF4444", mb: 2 }} />
        </motion.div>
        <Typography variant="h5" fontWeight={700} color="#111827" sx={{ mb: 1 }}>
          Failed to load dashboard data
        </Typography>
        <Typography variant="body2" color="#6B7280" align="center" sx={{ mb: 4 }}>
          We encountered an error while fetching your dashboard data. Please try refreshing the page.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{
            borderRadius: 10,
            px: 4,
            py: 1.5,
            background: professionalColors.gradients.primary,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            },
          }}
        >
          Refresh Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: "flex", 
      height: "100vh", 
      overflow: "hidden",
      backgroundColor: '#FAFAFA',
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
      src="/Logo.png"
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
            >
              <ListItemIcon>
                <Inventory sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Purchase Orders" />
              <Badge 
                badgeContent={stats.purchaseOrders.counts.pending} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    minWidth: 20,
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    borderRadius: 10,
                  } 
                }} 
              />
            </StyledListItemButton>

            <StyledListItemButton
              selected={activeSection === "invoices"}
              onClick={() => handleSectionChange("invoices")}
            >
              <ListItemIcon>
                <CreditCard sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Invoices" />
              <Badge 
                badgeContent={stats.invoices.counts.pending} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    minWidth: 20,
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    borderRadius: 10,
                  } 
                }} 
              />
            </StyledListItemButton>

            <StyledListItemButton
              selected={activeSection === "vendors"}
              onClick={() => handleSectionChange("vendors")}
            >
              <ListItemIcon>
                <People sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Vendors" />
            </StyledListItemButton>
          </List>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />

          {/* Travel Management Section */}
          <List>
            <SidebarGroupLabel>TRAVEL MANAGEMENT</SidebarGroupLabel>
            
            <StyledListItemButton
              selected={activeSection === "travel-requests"}
              onClick={() => handleSectionChange("travel-requests")}
            >
              <ListItemIcon>
                <CalendarToday sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Travel Requests" />
            </StyledListItemButton>

            <StyledListItemButton
              selected={activeSection === "final-approval"}
              onClick={() => handleSectionChange("final-approval")}
            >
              <ListItemIcon>
                <Check sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Final Approval" />
            </StyledListItemButton>

            <StyledListItemButton
              selected={activeSection === "fleet-management"}
              onClick={() => handleSectionChange("fleet-management")}
            >
              <ListItemIcon>
                <LocalShipping sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Fleet Management" />
            </StyledListItemButton>
          </List>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />

          {/* Finance Processing Section */}
          <List>
            <SidebarGroupLabel>FINANCE PROCESSING</SidebarGroupLabel>
            
            <StyledListItemButton
              selected={activeSection === "finance-processing"}
              onClick={() => handleSectionChange("finance-processing")}
            >
              <ListItemIcon>
                <CreditCard sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Processing" />
            </StyledListItemButton>

            <StyledListItemButton
              selected={activeSection === "reconciliation"}
              onClick={() => handleSectionChange("reconciliation")}
            >
              <ListItemIcon>
                <Description sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Reconciliation" />
            </StyledListItemButton>
          </List>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />

          {/* Reports Section */}
          <List>
            <SidebarGroupLabel>REPORTS</SidebarGroupLabel>
            
            <StyledListItemButton
              selected={activeSection === "analytics"}
              onClick={() => setActiveSection("analytics")}
            >
              <ListItemIcon>
                <BarChart sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Analytics" />
            </StyledListItemButton>

            <StyledListItemButton
              selected={activeSection === "reports"}
              onClick={() => setActiveSection("reports")}
            >
              <ListItemIcon>
                <PieChartIcon sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </StyledListItemButton>
          </List>

          {/* Settings & Logout Section */}
          <Box sx={{ mt: 'auto', pb: 3 }}>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />
            <List>
              <StyledListItemButton onClick={() => navigate("/settings")}>
                <ListItemIcon>
                  <Settings sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </StyledListItemButton>

              <StyledListItemButton onClick={() => console.log("Logout")}>
                <ListItemIcon>
                  <ExitToApp sx={{ fontSize: 22, color: '#EF4444' }} />
                </ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ color: '#EF4444' }} />
              </StyledListItemButton>
            </List>
          </Box>
        </Box>
      </Sidebar>

      {/* Main Content */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        overflow: "auto",
        backgroundColor: '#FAFAFA',
      }}>
        {/* Professional Header */}
        <Paper elevation={0} sx={{ 
  p: 1.5,
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
  <Toolbar sx={{ px: { sm: 2 }, gap: 1 }}>
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
    </Box>

            {/* Right-aligned items */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mr: 2 
            }}>
              {/* Professional Icons */}
              <Tooltip title="Help Center" placement="bottom">
                <IconButton sx={{ 
                  p: 1,
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: alpha('#3B82F6', 0.08),
                  }
                }}>
                  <LiveHelp sx={{ 
                    fontSize: 24,
                    color: '#6B7280',
                  }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="AI Assistant" placement="bottom">
                <IconButton sx={{ 
                  p: 1,
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: alpha('#059669', 0.08),
                  }
                }}>
                  <SmartToy sx={{
                    fontSize: 24,
                    color: '#6B7280',
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

      {/* Upgrade button with gradient */}
      <Tooltip title="Go Premium">
        <Button
          variant="contained"
          size="small"
          startIcon={<RocketLaunch sx={{ fontSize: 18 }} />}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: theme.palette.common.white,
            borderRadius: 4,
            px: 2.5,
            py: 0.8,
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: 0.5,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`
            }
          }}
        >
          Premium
        </Button>
      </Tooltip>
    </Box>

            {/* User profile with professional dropdown */}
            <Box sx={{ position: 'relative' }}>
              <Button
                onClick={handleMenuClick}
                sx={{ 
                  p: 0.5,
                  borderRadius: 3,
                  minWidth: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha('#3B82F6', 0.04),
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    width: 40, 
                    height: 40,
                    bgcolor: '#1E40AF',
                    fontSize: '1rem',
                    fontWeight: 600,
                    border: '2px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 4px 16px rgba(30, 64, 175, 0.25)',
                  }} src={user.avatar}>
                    {user.firstName ? user.firstName.split(" ").map(n => n[0]).join("") : "GU"}
                  </Avatar>
                  <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1F2937', lineHeight: 1.4 }}>
                      {user.firstName || 'Guest User'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      {user.role || 'Guest'}
                    </Typography>
                  </Box>
                </Box>
              </Button>

              {/* Professional Menu dropdown */}
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    minWidth: 240,
                    borderRadius: 3,
                    overflow: 'visible',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: -8,
                      right: 16,
                      width: 16,
                      height: 16,
                      bgcolor: '#FFFFFF',
                      transform: 'rotate(45deg)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      borderBottom: 'none',
                      borderRight: 'none',
                    },
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                      px: 2,
                      borderRadius: 2,
                      margin: '4px 8px',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha('#3B82F6', 0.04),
                        '& .MuiListItemIcon-root': {
                          color: '#3B82F6',
                        },
                      },
                    },
                  }
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <Person sx={{ fontSize: 20, color: '#6B7280' }} />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <SettingsApplications sx={{ fontSize: 20, color: '#6B7280' }} />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Settings</Typography>
                </MenuItem>
                <Divider sx={{ my: 1, borderColor: 'rgba(0, 0, 0, 0.05)' }} />
                <MenuItem onClick={handleMenuClose} sx={{ 
                  '&:hover': {
                    backgroundColor: alpha('#EF4444', 0.04),
                    '& .MuiListItemIcon-root': {
                      color: '#EF4444',
                    },
                  }
                }}>
                  <ListItemIcon>
                    <ExitToApp sx={{ fontSize: 20, color: '#6B7280' }} />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Sign Out</Typography>
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

                <ProfessionalStatsCardComponent
                  title="RFQs"
                  value={stats.rfqs.counts.total}
                  description={`${stats.rfqs.counts.open} open`}
                  trend="+5.2%"
                  trendDirection="up"
                  icon={<Description />}
                  color="info"
                />

                <ProfessionalStatsCardComponent
                  title="Purchase Orders"
                  value={stats.purchaseOrders.counts.total}
                  description={`${stats.purchaseOrders.counts.pending} pending`}
                  trend="-3.1%"
                  trendDirection="down"
                  icon={<Inventory />}
                  color="secondary"
                />

                <ProfessionalStatsCardComponent
                  title="Invoices"
                  value={stats.invoices.counts.total}
                  description={`${stats.invoices.counts.pending} pending`}
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
                <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        background: 'white',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 4,
          background: 'linear-gradient(90deg, #3b82f6, #10b981)',
        },
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader
        title="Pending Approvals"
        subheader="Items requiring your attention"
        titleTypographyProps={{
          variant: 'h6',
          fontWeight: 700,
          color: theme.palette.text.primary,
        }}
        subheaderTypographyProps={{
          variant: 'body2',
          color: theme.palette.text.secondary,
        }}
        sx={{
          pb: 1,
          px: 3,
          background: 'rgba(255, 255, 255, 0.95)',
        }}
      />
      <Divider />
      <CardContent sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
        <List disablePadding>
          {stats.requisitions.pendingRequisitions.map((req) => (
            <ApprovalItemComponent
              key={req._id}
              title={req.itemName}
              type="requisition"
              requester={req.employee?.name || "New Account"}
              date={new Date(req.createdAt).toLocaleDateString()}
              amount={`Quantity: ${req.quantity}`}
            />
          ))}
          {stats.rfqs.openRFQs.map((rfq) => (
            <ApprovalItemComponent
              key={rfq._id}
              title={rfq.itemName}
              type="rfq"
              requester={rfq.procurementOfficer?.name || "New Account"}
              date={new Date(rfq.createdAt).toLocaleDateString()}
              amount={`Quantity: ${rfq.quantity}`}
            />
          ))}
          {stats.purchaseOrders.pendingPOs.map((po) => (
            <ApprovalItemComponent
              key={po._id}
              title="Purchase Order"
              type="purchase-order"
              requester={po.vendor?.name || "New Account"}
              date={new Date(po.createdAt).toLocaleDateString()}
              amount="Pending Approval"
            />
          ))}
          {stats.invoices.pendingInvoices.map((inv) => (
            <ApprovalItemComponent
              key={inv._id}
              title="Invoice"
              type="invoice"
              requester={inv.vendor.name}
              date={new Date(inv.createdAt).toLocaleDateString()}
              amount={inv.amountDue}
            />
          ))}
          {stats.requisitions.pendingRequisitions.length === 0 &&
            stats.rfqs.openRFQs.length === 0 &&
            stats.purchaseOrders.pendingPOs.length === 0 && (
              <ListItem sx={{ justifyContent: 'center', py: 3 }}>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      textAlign="center"
                    >
                      No pending approvals
                    </Typography>
                  }
                />
              </ListItem>
            )}
        </List>
      </CardContent>
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          background: 'white',
        }}
      >
        <Button
          fullWidth
          variant="contained"
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            background: 'linear-gradient(90deg, #3b82f6, #10b981)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              background: 'linear-gradient(90deg, #2563eb, #059669)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
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
      {activeSection === "vendors" && <VendorsPage/>}

      {/* other sections */}
    </Box>
  )}
</Box>
      </Box>
        <AIChatButton user={user} />
    </Box>
  );
}

// Professional StatsCard Component
function ProfessionalStatsCardComponent({ title, value, description, trend, trendDirection, icon, color }) {
  const colorMapping = {
    primary: professionalColors.primary,
    info: professionalColors.primaryLight,  
    secondary: professionalColors.secondary,
    error: professionalColors.quaternary,
  };
  
  const cardColor = colorMapping[color] || professionalColors.primary;
  
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card
        sx={{
          borderRadius: 20,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.03)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {React.cloneElement(icon, { sx: { fontSize: 24, color: professionalColors.primary } })}
              {title}
            </Box>
          }
          subheader={subtitle}
          titleTypographyProps={{
            variant: 'h6',
            fontWeight: 700,
            color: professionalColors.text.primary,
            letterSpacing: '0.5px',
            fontSize: '1.125rem',
          }}
          subheaderTypographyProps={{
            variant: 'body2',
            color: professionalColors.text.secondary,
            fontSize: '0.875rem',
          }}
          sx={{
            borderBottom: `1px solid ${alpha('#E5E7EB', 0.8)}`,
            background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
            px: 4,
            py: 3,
          }}
        />
        <CardContent sx={{ p: 4, height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <ProfessionalGradientDefs />
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: '"Inter", sans-serif' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: '"Inter", sans-serif' }}
              />
              <RechartsTooltip content={<ProfessionalTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#1E40AF" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#procurementGradient)" 
                dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1E40AF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Professional Approvals Chart Component
function ProfessionalApprovalsChart({ title, subtitle, data, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card
        sx={{
          borderRadius: 20,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.03)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {React.cloneElement(icon, { sx: { fontSize: 24, color: professionalColors.secondary } })}
              {title}
            </Box>
          }
          subheader={subtitle}
          titleTypographyProps={{
            variant: 'h6',
            fontWeight: 700,
            color: professionalColors.text.primary,
            letterSpacing: '0.5px',
            fontSize: '1.125rem',
          }}
          subheaderTypographyProps={{
            variant: 'body2',
            color: professionalColors.text.secondary,
            fontSize: '0.875rem',
          }}
          sx={{
            borderBottom: `1px solid ${alpha('#E5E7EB', 0.8)}`,
            background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
            px: 4,
            py: 3,
          }}
        />
        <CardContent sx={{ p: 4, height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBar
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <ProfessionalGradientDefs />
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB"
                vertical={false}
              />
              
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#9CA3AF', 
                  fontSize: 12,
                  fontFamily: '"Inter", sans-serif'
                }}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#9CA3AF', 
                  fontSize: 12,
                  fontFamily: '"Inter", sans-serif'
                }}
              />
              
              <RechartsTooltip content={<ProfessionalTooltip />} />
              
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontFamily: '"Inter", sans-serif'
                }}
                formatter={(value) => (
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ 
                      color: '#6B7280', 
                      fontWeight: 500,
                      fontSize: '0.8125rem'
                    }}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Typography>
                )}
              />
              
              <Bar
                dataKey="pending"
                name="pending"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              
              <Bar
                dataKey="completed"
                name="completed"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              
              <Bar
                dataKey="urgentApprovals"
                name="urgent"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </RechartsBar>
          </ResponsiveContainer>
        </CardContent>
        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${alpha('#E5E7EB', 0.8)}`,
            background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
          }}
        >
          <Button
            fullWidth
            variant="contained"
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              borderRadius: 12,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              background: professionalColors.gradients.secondary,
              color: 'white',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              border: 'none',
              fontSize: '0.9375rem',
              '&:hover': {
                background: professionalColors.gradients.secondary,
                boxShadow: '0 6px 16px rgba(5, 150, 105, 0.35)',
                opacity: 0.95,
              },
            }}
          >
            View All Pending Items
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}

// Professional Recent Activity Component
function ProfessionalRecentActivity() {
  const activities = [
    {
      title: "New Requisition Submitted",
      description: "Office supplies requisition #REQ-2025-042 submitted by Sarah Johnson",
      time: "2 hours ago",
      icon: <ShoppingCart />,
      color: professionalColors.primary,
      avatar: "SJ",
    },
    {
      title: "Purchase Order Approved",
      description: "IT Equipment PO #PO-2025-028 approved by Michael Chen",
      time: "4 hours ago",
      icon: <Check />,
      color: professionalColors.success,
      avatar: "MC",
    },
    {
      title: "Invoice Paid",
      description: "Marketing Services invoice #INV-2025-103 for $3,750.00 paid",
      time: "Yesterday",
      icon: <CreditCard />,
      color: professionalColors.quaternary,
      avatar: "FD",
    },
    {
      title: "Travel Request Approved",
      description: "Conference attendance request approved for Jane Smith",
      time: "2 days ago",
      icon: <CalendarToday />,
      color: professionalColors.secondary,
      avatar: "JS",
    },
    {
      title: "RFQ Closed",
      description: "Office renovation RFQ closed with 3 vendor responses",
      time: "3 days ago",
      icon: <Description />,
      color: professionalColors.tertiary,
      avatar: "RFQ",
    },
    {
      title: "Vendor Profile Updated",
      description: "ABC Supplies updated their profile and pricing structure",
      time: "1 week ago",
      icon: <People />,
      color: professionalColors.primaryLight,
      avatar: "ABC",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card sx={{ 
        mt: 5,
        borderRadius: 20,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.03)',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
        overflow: 'hidden',
      }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Notifications sx={{ fontSize: 24, color: professionalColors.tertiary }} />
              Recent Activity
            </Box>
          }
          subheader="Latest procurement activities and updates"
          titleTypographyProps={{ 
            variant: 'h6', 
            fontWeight: 700,
            color: professionalColors.text.primary,
            letterSpacing: '0.5px',
            fontSize: '1.125rem',
          }}
          subheaderTypographyProps={{ 
            variant: 'body2',
            color: professionalColors.text.secondary,
            fontSize: '0.875rem',
          }}
          action={
            <Button 
              variant="text" 
              size="small"
              endIcon={<ExpandMore sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 10,
                textTransform: 'none',
                px: 2,
                py: 1,
                color: professionalColors.primary,
                '&:hover': {
                  backgroundColor: alpha(professionalColors.primary, 0.04),
                },
              }}
            >
              View All
            </Button>
          }
          sx={{
            borderBottom: `1px solid ${alpha('#E5E7EB', 0.8)}`,
            background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
            px: 4,
            py: 3,
          }}
        />
        <CardContent sx={{ p: 0 }}>
          <List sx={{ width: '100%' }}>
            {activities.map((activity, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  px: 4, 
                  py: 2,
                  borderBottom: index !== activities.length - 1 ? `1px solid ${alpha('#E5E7EB', 0.5)}` : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha('#F3F4F6', 0.7),
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(activity.color, 0.1), 
                      color: activity.color,
                      width: 44,
                      height: 44,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      border: `1px solid ${alpha(activity.color, 0.1)}`,
                    }}
                  >
                    {activity.avatar || activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: '0.9375rem',
                          color: professionalColors.text.primary,
                          letterSpacing: '0.3px'
                        }}
                      >
                        {activity.title}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#9CA3AF',
                          fontSize: '0.8125rem',
                          whiteSpace: 'nowrap',
                          ml: 2
                        }}
                      >
                        {activity.time}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6B7280',
                        fontSize: '0.875rem',
                        mt: 0.5,
                        lineHeight: 1.5
                      }}
                    >
                      {activity.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${alpha('#E5E7EB', 0.8)}`,
            background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button
            variant="text"
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              color: professionalColors.primary,
              fontSize: '0.9375rem',
              '&:hover': {
                backgroundColor: alpha(professionalColors.primary, 0.04),
              },
            }}
          >
            Load More Activities
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}