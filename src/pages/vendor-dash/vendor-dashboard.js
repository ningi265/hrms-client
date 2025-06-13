import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Add,
  TrendingUp as TrendingUpMUI,
  CheckCircle as CheckCircleMUI,
} from "@mui/icons-material";
import {
  CheckCircle,
  Clock,
  Activity,
  Eye,
  FileText,
  Package,
  Download,
  MessageSquare,
  DollarSign,
  BarChart3,
  Mail,
  Star,
  TrendingUp,
  Calendar,
  ChevronRight,
  Edit,
  Phone,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Target,
  Users,
  Zap,
  Award,
  Briefcase,
  PieChart
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from "recharts";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  useTheme,
  styled,
  alpha,
  Chip,
  Grid,
  LinearProgress,
  Fade,
  Slide,
  Grow
} from "@mui/material";
import { useAuth } from "../../authcontext/authcontext";
import HRMSSidebar from './sidebar';
import DashboardHeader from './header';
import StatsCardsGrid from './statsCard';
import AIChatButton from '../dashboard/aiChat';
import QuickActions from './quickActions';
import BarChartComponent from './tasks';
import ActivityChangelogComponent from './activity';
import TravelExecutionReconciliation from '../../pages/dashboard/requisitions/manage/travel-exec-recon';
import TravelDashboard from '../../pages/dashboard/requisitions/manage/travel-dash';
import TravelReconciliation from '../../pages/dashboard/requisitions/recon';
import NewRequisitionPage from '../../pages/dashboard/requisitions/requisitions';
import VendorRFQsPage from "../dashboard/vendors/qoutes/qoutes";
import VendorPODetailsPage from "../vendor-dash/purchase-orders/accept/accept";
import SubmitQuotePage from "../dashboard/vendors/qoutes/submit/submit";
import VendorInvoiceSubmissionPage from "../vendor-dash/invoices/invoices";
import VendorRegistration from "./registration/registration";
import VendorManagementDashboard from "./registration/registrationManagement";
import UserProfilePage from "../User/user";
import EmployeeRequisitionManagement from '../../pages/dashboard/requisitions/manage/manage';

// Professional Color Palette
const colors = {
  primary: {
    main: '#6366f1',
    light: '#a5b4fc',
    dark: '#4338ca',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
  },
  success: {
    main: '#10b981',
    light: '#6ee7b7',
    dark: '#047857',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  },
  info: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717'
  }
};

// Enhanced Styled Components with Professional Design
const PremiumCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  background: '#ffffff',
  border: '1px solid #f0f0f0',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: colors.primary.gradient,
    borderRadius: '16px 16px 0 0',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    borderColor: '#e0e0e0',
  },
}));

const MetricCard = styled(Card)(({ theme, color = 'primary' }) => ({
  borderRadius: '12px',
  background: '#ffffff',
  border: `1px solid ${colors[color].main}15`,
  boxShadow: `0 2px 8px ${colors[color].main}08`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '2px',
    background: colors[color].main,
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 16px ${colors[color].main}15`,
    borderColor: `${colors[color].main}25`,
  },
}));

const StyledTooltip = styled('div')(({ theme }) => ({
  background: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '12px 16px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  color: colors.neutral[700],
  fontSize: '14px',
  fontWeight: 500,
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  position: 'relative',
  minHeight: '100vh',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.01) 100%)',
    pointer: 'none',
  }
}));

// Custom Chart Components
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <StyledTooltip>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography 
            key={index} 
            variant="body2" 
            sx={{ color: entry.color, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: entry.color 
              }} 
            />
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </Typography>
        ))}
      </StyledTooltip>
    );
  }
  return null;
};

// Professional RFQ Overview with Enhanced Charts
const VendorRFQOverview = () => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const rfqStatusData = [
    { name: 'Won', value: 15, color: colors.success.main, percentage: 37.5 },
    { name: 'Submitted', value: 12, color: colors.info.main, percentage: 30 },
    { name: 'Pending', value: 8, color: colors.warning.main, percentage: 20 },
    { name: 'Draft', value: 5, color: colors.neutral[400], percentage: 12.5 }
  ];

  const rfqTrendData = [
    { month: 'Jan', submitted: 8, won: 3, revenue: 125000 },
    { month: 'Feb', submitted: 12, won: 5, revenue: 180000 },
    { month: 'Mar', submitted: 15, won: 7, revenue: 245000 },
    { month: 'Apr', submitted: 18, won: 8, revenue: 320000 },
    { month: 'May', submitted: 22, won: 12, revenue: 420000 },
    { month: 'Jun', submitted: 25, won: 15, revenue: 550000 }
  ];

  const recentRFQs = [
    { 
      id: "RFQ-2025-001", 
      title: "Enterprise Cloud Infrastructure", 
      value: 285000, 
      status: "pending", 
      daysLeft: 4,
      priority: "high",
      client: "TechCorp Solutions"
    },
    { 
      id: "RFQ-2025-002", 
      title: "Digital Transformation Suite", 
      value: 420000, 
      status: "submitted", 
      daysLeft: 2,
      priority: "critical",
      client: "Global Industries"
    },
    { 
      id: "RFQ-2025-003", 
      title: "Cybersecurity Framework", 
      value: 175000, 
      status: "draft", 
      daysLeft: 6,
      priority: "medium",
      client: "SecureFlow Inc"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return colors.info.main;
      case 'pending': return colors.warning.main;
      case 'draft': return colors.neutral[400];
      case 'won': return colors.success.main;
      default: return colors.neutral[400];
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return colors.error.main;
      case 'high': return colors.warning.main;
      case 'medium': return colors.info.main;
      case 'low': return colors.neutral[400];
      default: return colors.neutral[400];
    }
  };

  return (
    <Fade in={animate} timeout={800}>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* RFQ Status Distribution */}
        <Grid item xs={12} lg={4}>
          <Grow in={animate} timeout={1000}>
            <PremiumCard>
              <CardHeader 
                avatar={
                  <Avatar sx={{ 
                    background: colors.primary.gradient,
                    width: 48,
                    height: 48
                  }}>
                    <PieChart size={24} />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
                    RFQ Distribution
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                    Current pipeline status
                  </Typography>
                }
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RechartsPieChart>
                    <Pie
                      data={rfqStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      animationBegin={200}
                      animationDuration={1000}
                    >
                      {rfqStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke={entry.color}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {rfqStatusData.map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            color: item.color, 
                            fontWeight: 800,
                            fontSize: '1.5rem'
                          }}
                        >
                          {item.value}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: colors.neutral[600],
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontWeight: 600
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block',
                            color: colors.neutral[500],
                            fontSize: '0.7rem'
                          }}
                        >
                          {item.percentage}%
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </PremiumCard>
          </Grow>
        </Grid>

        {/* RFQ Performance Trend */}
        <Grid item xs={12} lg={8}>
          <Grow in={animate} timeout={1200}>
            <PremiumCard>
              <CardHeader 
                avatar={
                  <Avatar sx={{ 
                    background: colors.success.gradient,
                    width: 48,
                    height: 48
                  }}>
                    <TrendingUp size={24} />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
                    Performance Analytics
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                    RFQ submissions and win rate trends
                  </Typography>
                }
                action={
                  <Chip 
                    label="+23% Win Rate" 
                    color="success" 
                    variant="outlined"
                    icon={<ArrowUp size={16} />}
                    sx={{ fontWeight: 600 }}
                  />
                }
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={rfqTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="submittedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.info.main} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors.info.main} stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="wonGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.success.main} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors.success.main} stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                    <XAxis 
                      dataKey="month" 
                      stroke={colors.neutral[500]}
                      fontSize={12}
                      fontWeight={500}
                    />
                    <YAxis 
                      stroke={colors.neutral[500]}
                      fontSize={12}
                      fontWeight={500}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="submitted"
                      stackId="1"
                      stroke={colors.info.main}
                      fill="url(#submittedGradient)"
                      strokeWidth={3}
                      dot={{ fill: colors.info.main, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: colors.info.main }}
                      name="Submitted"
                    />
                    <Area
                      type="monotone"
                      dataKey="won"
                      stackId="2"
                      stroke={colors.success.main}
                      fill="url(#wonGradient)"
                      strokeWidth={3}
                      dot={{ fill: colors.success.main, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: colors.success.main }}
                      name="Won"
                    />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: '20px',
                        fontSize: '14px',
                        fontWeight: 500
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </PremiumCard>
          </Grow>
        </Grid>

        {/* Recent High-Value RFQs */}
        <Grid item xs={12}>
          <Slide direction="up" in={animate} timeout={1400}>
            <PremiumCard>
              <CardHeader 
                avatar={
                  <Avatar sx={{ 
                    background: colors.warning.gradient,
                    width: 48,
                    height: 48
                  }}>
                    <Briefcase size={24} />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
                    High-Value Opportunities
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                    Priority RFQs requiring immediate attention
                  </Typography>
                }
                action={
                  <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    sx={{
                      background: colors.primary.gradient,
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: `0 4px 16px ${colors.primary.main}40`,
                      '&:hover': {
                        background: colors.primary.gradient,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px ${colors.primary.main}50`,
                      }
                    }}
                  >
                    New Quote
                  </Button>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {recentRFQs.map((rfq, index) => (
                    <Fade key={rfq.id} in={animate} timeout={1600 + (index * 200)}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 3,
                          borderRadius: '12px',
                          background: '#ffffff',
                          border: '1px solid #f0f0f0',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            backgroundColor: '#fafafa',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                            borderColor: '#e0e0e0',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: getStatusColor(rfq.status), 
                              width: 56, 
                              height: 56,
                              background: `linear-gradient(135deg, ${getStatusColor(rfq.status)} 0%, ${getStatusColor(rfq.status)}CC 100%)`
                            }}
                          >
                            <FileText size={24} />
                          </Avatar>
                          <Box>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700, 
                                color: colors.neutral[800],
                                mb: 0.5
                              }}
                            >
                              {rfq.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: colors.neutral[600],
                                fontFamily: 'monospace',
                                fontSize: '0.85rem'
                              }}
                            >
                              {rfq.id} • {rfq.client}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Clock size={14} />
                              <Typography 
                                variant="caption" 
                                sx={{ color: colors.neutral[500] }}
                              >
                                {rfq.daysLeft} days remaining
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, textAlign: 'right' }}>
                          <Box>
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                fontWeight: 800, 
                                color: colors.success.main,
                                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
                              }}
                            >
                              ${(rfq.value / 1000).toFixed(0)}k
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: colors.neutral[500],
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontWeight: 600
                              }}
                            >
                              Potential Value
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Chip 
                              label={rfq.status.toUpperCase()} 
                              sx={{
                                backgroundColor: getStatusColor(rfq.status),
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                height: 24,
                                borderRadius: '8px'
                              }}
                            />
                            <Chip 
                              label={rfq.priority.toUpperCase()} 
                              variant="outlined"
                              sx={{
                                borderColor: getPriorityColor(rfq.priority),
                                color: getPriorityColor(rfq.priority),
                                fontWeight: 600,
                                fontSize: '0.65rem',
                                height: 20,
                                borderRadius: '6px'
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Fade>
                  ))}
                </Box>
              </CardContent>
            </PremiumCard>
          </Slide>
        </Grid>
      </Grid>
    </Fade>
  );
};

// Enhanced Purchase Orders Component
const VendorPurchaseOrders = () => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const orderStatusData = [
    { name: 'Delivered', value: 25, color: colors.success.main },
    { name: 'Confirmed', value: 18, color: colors.info.main },
    { name: 'Processing', value: 12, color: colors.warning.main },
    { name: 'Pending', value: 8, color: colors.neutral[400] }
  ];

  const deliveryMetrics = [
    { metric: 'On-Time Delivery', value: 94, target: 95, color: 'success' },
    { metric: 'Order Accuracy', value: 98, target: 97, color: 'info' },
    { metric: 'Customer Rating', value: 4.8, target: 4.5, color: 'warning', isRating: true },
    { metric: 'Fulfillment Rate', value: 96, target: 95, color: 'primary' }
  ];

  const performanceData = [
    { month: 'Jan', orders: 45, onTime: 42, value: 1250000 },
    { month: 'Feb', orders: 52, onTime: 48, value: 1480000 },
    { month: 'Mar', orders: 48, onTime: 46, value: 1650000 },
    { month: 'Apr', orders: 65, onTime: 61, value: 1890000 },
    { month: 'May', orders: 58, onTime: 55, value: 2100000 },
    { month: 'Jun', orders: 63, onTime: 59, value: 2350000 }
  ];

  return (
    <Grid container spacing={4} sx={{ mb: 6 }}>
      {/* Order Status & Metrics */}
      <Grid item xs={12} md={6}>
        <Grow in={animate} timeout={1000}>
          <PremiumCard>
            <CardHeader 
              avatar={
                <Avatar sx={{ 
                  background: colors.info.gradient,
                  width: 48,
                  height: 48
                }}>
                  <Package size={24} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
                  Order Pipeline
                </Typography>
              }
              subheader={
                <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                  Current order distribution
                </Typography>
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={orderStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                  <XAxis 
                    dataKey="name" 
                    stroke={colors.neutral[500]}
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke={colors.neutral[500]} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill={colors.info.main}
                    radius={[6, 6, 0, 0]}
                    fillOpacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Performance Metrics */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {deliveryMetrics.map((metric, index) => (
                  <Grid item xs={6} key={index}>
                    <MetricCard color={metric.color}>
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 800,
                            color: colors[metric.color].main,
                            mb: 0.5
                          }}
                        >
                          {metric.isRating ? metric.value : `${metric.value}%`}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: colors.neutral[600],
                            fontWeight: 600,
                            display: 'block',
                            mb: 1
                          }}
                        >
                          {metric.metric}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={metric.isRating ? (metric.value / 5) * 100 : metric.value}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: `${colors[metric.color].main}20`,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: colors[metric.color].main,
                              borderRadius: 2,
                            }
                          }}
                        />
                      </CardContent>
                    </MetricCard>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </PremiumCard>
        </Grow>
      </Grid>

      {/* Performance Trends */}
      <Grid item xs={12} md={6}>
        <Grow in={animate} timeout={1200}>
          <PremiumCard>
            <CardHeader 
              avatar={
                <Avatar sx={{ 
                  background: colors.success.gradient,
                  width: 48,
                  height: 48
                }}>
                  <TrendingUp size={24} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
                  Delivery Excellence
                </Typography>
              }
              subheader={
                <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                  Monthly performance tracking
                </Typography>
              }
              action={
                <Chip 
                  label="94% Success Rate" 
                  color="success" 
                  variant="filled"
                  icon={<Award size={16} />}
                  sx={{ 
                    fontWeight: 700,
                    background: colors.success.gradient
                  }}
                />
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                  <XAxis 
                    dataKey="month" 
                    stroke={colors.neutral[500]}
                    fontSize={12}
                  />
                  <YAxis stroke={colors.neutral[500]} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke={colors.info.main} 
                    strokeWidth={3}
                    dot={{ fill: colors.info.main, strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: colors.info.main }}
                    name="Total Orders"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="onTime" 
                    stroke={colors.success.main} 
                    strokeWidth={3}
                    dot={{ fill: colors.success.main, strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: colors.success.main }}
                    name="On-Time Delivery"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </PremiumCard>
        </Grow>
      </Grid>
    </Grid>
  );
};

// Enhanced Payment Status Component
const VendorPaymentStatus = () => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const paymentData = [
    { name: 'Paid', value: 850000, color: colors.success.main, percentage: 68 },
    { name: 'Pending', value: 220000, color: colors.warning.main, percentage: 18 },
    { name: 'Processing', value: 125000, color: colors.info.main, percentage: 10 },
    { name: 'Overdue', value: 55000, color: colors.error.main, percentage: 4 }
  ];

  const cashFlowData = [
    { month: 'Jan', income: 745000, expenses: 385000, profit: 360000 },
    { month: 'Feb', income: 892000, expenses: 445000, profit: 447000 },
    { month: 'Mar', income: 1150000, expenses: 520000, profit: 630000 },
    { month: 'Apr', income: 1340000, expenses: 580000, profit: 760000 },
    { month: 'May', income: 1580000, expenses: 650000, profit: 930000 },
    { month: 'Jun', income: 1750000, expenses: 720000, profit: 1030000 }
  ];

  const financialMetrics = [
    { 
      label: 'Monthly Revenue', 
      value: 1750000, 
      change: +18.5, 
      icon: <DollarSign size={20} />,
      color: 'success'
    },
    { 
      label: 'Profit Margin', 
      value: 58.9, 
      change: +4.2, 
      icon: <TrendingUp size={20} />,
      color: 'info',
      isPercentage: true
    },
    { 
      label: 'Outstanding', 
      value: 275000, 
      change: -12.3, 
      icon: <Clock size={20} />,
      color: 'warning'
    },
    { 
      label: 'Collection Rate', 
      value: 96.2, 
      change: +2.1, 
      icon: <Target size={20} />,
      color: 'primary',
      isPercentage: true
    }
  ];

  return (
    <Grid container spacing={4} sx={{ mb: 6 }}>
      {/* Financial Metrics */}
      <Grid item xs={12}>
        <Slide direction="up" in={animate} timeout={800}>
          <PremiumCard>
            <CardHeader 
              avatar={
                <Avatar sx={{ 
                  background: colors.success.gradient,
                  width: 48,
                  height: 48
                }}>
                  <DollarSign size={24} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
                  Financial Overview
                </Typography>
              }
              subheader={
                <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                  Key financial metrics and performance indicators
                </Typography>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                {financialMetrics.map((metric, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Grow in={animate} timeout={1000 + (index * 200)}>
                      <MetricCard color={metric.color}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mb: 2
                          }}>
                            <Avatar sx={{
                              bgcolor: `${colors[metric.color].main}20`,
                              color: colors[metric.color].main,
                              width: 48,
                              height: 48
                            }}>
                              {metric.icon}
                            </Avatar>
                          </Box>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 800,
                              color: colors[metric.color].main,
                              mb: 1,
                              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
                            }}
                          >
                            {metric.isPercentage ? 
                              `${metric.value}%` : 
                              `$${(metric.value / 1000).toFixed(0)}k`
                            }
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: colors.neutral[700],
                              fontWeight: 600,
                              mb: 1
                            }}
                          >
                            {metric.label}
                          </Typography>
                          <Chip
                            label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                            color={metric.change > 0 ? 'success' : 'error'}
                            size="small"
                            icon={metric.change > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            sx={{ 
                              fontWeight: 700,
                              fontSize: '0.7rem'
                            }}
                          />
                        </CardContent>
                      </MetricCard>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </PremiumCard>
        </Slide>
      </Grid>

      {/* Payment Distribution & Cash Flow */}
      <Grid item xs={12} md={6}>
        <Grow in={animate} timeout={1400}>
          <PremiumCard>
            <CardHeader 
              avatar={
                <Avatar sx={{ 
                  background: colors.warning.gradient,
                  width: 48,
                  height: 48
                }}>
                  <PieChart size={24} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
                  Payment Distribution
                </Typography>
              }
              subheader={
                <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                  Current payment status breakdown
                </Typography>
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={400}
                    animationDuration={1200}
                  >
                    {paymentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(value) => [`$${(value/1000).toFixed(0)}k`, 'Amount']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {paymentData.map((item, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${item.color}10`
                    }}>
                      <Box sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: item.color
                      }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.neutral[800] }}>
                          ${(item.value/1000).toFixed(0)}k
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.neutral[600] }}>
                          {item.name} ({item.percentage}%)
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </PremiumCard>
        </Grow>
      </Grid>

      {/* Cash Flow Analysis */}
      <Grid item xs={12} md={6}>
        <Grow in={animate} timeout={1600}>
          <PremiumCard>
            <CardHeader 
              avatar={
                <Avatar sx={{ 
                  background: colors.info.gradient,
                  width: 48,
                  height: 48
                }}>
                  <BarChart3 size={24} />
                </Avatar>
              }
              title={
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.neutral[800] }}>
                  Cash Flow Analysis
                </Typography>
              }
              subheader={
                <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                  Monthly income vs expenses trend
                </Typography>
              }
              action={
                <Chip 
                  label="$1.03M Profit" 
                  color="success" 
                  variant="filled"
                  icon={<Zap size={16} />}
                  sx={{ 
                    fontWeight: 700,
                    background: colors.success.gradient
                  }}
                />
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.success.main} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={colors.success.main} stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.error.main} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={colors.error.main} stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
                  <XAxis 
                    dataKey="month" 
                    stroke={colors.neutral[500]}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={colors.neutral[500]} 
                    fontSize={12}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(value) => [`$${(value/1000).toFixed(0)}k`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke={colors.success.main}
                    fill="url(#incomeGradient)"
                    strokeWidth={3}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke={colors.error.main}
                    fill="url(#expenseGradient)"
                    strokeWidth={3}
                    name="Expenses"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </PremiumCard>
        </Grow>
      </Grid>
    </Grid>
  );
};

// Main Dashboard Component with Enhanced Styling
export default function VendorDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
  
  const [stats, setStats] = useState({
    requisitions: { counts: { total: 0, pending: 0 } },
    rfqs: { counts: { total: 0, open: 0 } },
    purchaseOrders: { counts: { total: 0, pending: 0 } },
    invoices: { counts: { total: 0, pending: 0 } }
  });
  
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'vendor-dash';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Enhanced loading effect
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockProfile = {
          user: {
            firstName: user?.firstName || "Vendor",
            lastName: user?.lastName || "User",
            email: user?.email || "vendor@example.com",
            avatar: null,
            department: "Vendor Services",
            role: "Vendor"
          },
          preferences: {
            theme: "light",
            notifications: true,
            language: "en"
          }
        };
        
        setUserProfile(mockProfile);
        setTimeout(() => setDashboardLoaded(true), 500);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    const section = searchParams.get('section') || 'vendor-dash';
    setActiveSection(section);
  }, [searchParams]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`?section=${section}`, { replace: true });
  };

  const SIDEBAR_WIDTH = 256;
  const COLLAPSED_SIDEBAR_WIDTH = 70;
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <GradientBackground sx={{
      display: "flex", 
      height: "100vh", 
      overflow: "hidden",
      backgroundColor: '#ffffff',
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
        position: 'relative',
        backgroundColor: '#ffffff',
      }}>
        {/* Header */}
        <DashboardHeader 
          user={user}
          userProfile={userProfile}
          scrollPosition={scrollPosition}
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
          padding: '80px 2rem 2rem',
          backgroundColor: '#ffffff',
        }}>
          {activeSection === "vendor-dash" ? (
            <Fade in={dashboardLoaded} timeout={1000}>
              <Box sx={{ maxWidth: '100%', margin: '0 auto' }}>
                {/* Enhanced Page Title */}
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: 'center',
                  mb: 5,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 },
                  textAlign: { xs: 'center', sm: 'left' }
                }}>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="h1" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 800, 
                        color: colors.neutral[800],
                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      Vendor Dashboard
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 500, 
                        color: colors.neutral[600],
                        maxWidth: 600
                      }}
                    >
                      Welcome back, {user?.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) : 'Vendor'}. 
                      Here's your comprehensive business performance overview with actionable insights.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant="contained"
                      startIcon={<BarChart3 />}
                      sx={{
                        background: colors.primary.gradient,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        boxShadow: `0 8px 24px ${colors.primary.main}40`,
                        '&:hover': {
                          background: colors.primary.gradient,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 12px 32px ${colors.primary.main}50`,
                        }
                      }}
                    >
                      Analytics Report
                    </Button>
                  </Box>
                </Box>

                
                
              

                {/* Enhanced Business Analytics Sections */}
                <VendorRFQOverview />
                <VendorPurchaseOrders />
                <VendorPaymentStatus />

                {/* Recent Activity */}
                <Box sx={{ width: "100%", mt: 6 }}>
                  <Slide direction="up" in={dashboardLoaded} timeout={2000}>
                    <div>
                      <ActivityChangelogComponent />
                    </div>
                  </Slide>
                </Box>
              </Box>
            </Fade>
          ) : (
            <Box>
              {activeSection === "requisitions" && <NewRequisitionPage />}
              {activeSection === "new-recon" && <TravelReconciliation />}
              {activeSection === "travel-requests" && <TravelDashboard />}
              {activeSection === "travel-execution" && <TravelExecutionReconciliation/>}
              {activeSection === "manage-requisitions" && <EmployeeRequisitionManagement/>}
              {activeSection === "rfq" && <VendorRFQsPage />}
              {activeSection === "invoices" && <VendorInvoiceSubmissionPage />}
              {activeSection === "purchase-order" && <VendorPODetailsPage />}
              {activeSection === "registration" && <VendorRegistration />}
              {activeSection === "registration-management" && <VendorManagementDashboard/>}
              {activeSection === "user-profile" && <UserProfilePage />}
            </Box> 
          )}
        </Box>
      </Box>
      <AIChatButton user={user} />
    </GradientBackground>
  );
}