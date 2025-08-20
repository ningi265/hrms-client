import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  TrendingDown,
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
  PieChart,
  RefreshCw,
  Filter,
  Plus,
  Bell,
  MoreVertical,
  ExternalLink,
  Sparkles
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
  Area
} from "recharts";
import { useAuth } from "../../authcontext/authcontext";
import HRMSSidebar from './sidebar';
import DashboardHeader from './header';
import AIChatButton from '../dashboard/aiChat';
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

// Compact Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", isLoading = false }) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      shadow: 'hover:shadow-blue-500/10',
      accent: 'from-blue-50',
      border: 'from-blue-500 to-blue-400'
    },
    green: {
      bg: 'from-emerald-500 to-emerald-600',
      shadow: 'hover:shadow-emerald-500/10',
      accent: 'from-emerald-50',
      border: 'from-emerald-500 to-emerald-400'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      shadow: 'hover:shadow-purple-500/10',
      accent: 'from-purple-50',
      border: 'from-purple-500 to-purple-400'
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      shadow: 'hover:shadow-orange-500/10',
      accent: 'from-orange-50',
      border: 'from-orange-500 to-orange-400'
    }
  };
  
  return (
    <div className={`group relative bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg ${colorClasses[color]?.shadow || 'hover:shadow-gray-500/10'} transition-all duration-300 hover:-translate-y-0.5`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]?.accent || 'from-gray-50'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]?.bg || 'from-gray-500 to-gray-600'} shadow-lg`}>
            <Icon size={20} className="text-white" />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold ${
              trend > 0 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900 tracking-tight">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
            ) : (
              `${prefix}${value}${suffix}`
            )}
          </div>
          
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {title}
          </div>
          
          {subtitle && (
            <div className="text-xs text-gray-500">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      
      <div className={`absolute top-0 left-5 right-5 h-0.5 bg-gradient-to-r ${colorClasses[color]?.border || 'from-gray-500 to-gray-400'} rounded-b-full opacity-60`}></div>
    </div>
  );
};

// Compact Chart Card Component
const ChartCard = ({ title, children, action, subtitle, actionIcon, isLoading = false, size = "normal" }) => {
  const cardClass = size === "large" ? "lg:col-span-2" : size === "full" ? "col-span-full" : "";
  
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ${cardClass}`}>
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-600">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {action && (
              <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                {action}
                {actionIcon && <actionIcon size={12} />}
              </button>
            )}
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreVertical size={14} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-100 rounded-lg"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

// Enhanced Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 backdrop-blur-sm">
        <p className="font-semibold text-gray-900 mb-1 text-xs">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold text-gray-900">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Compact RFQ Overview Component
const VendorRFQOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const rfqStatusData = [
    { name: 'Won', value: 15, color: '#10b981', percentage: 37.5 },
    { name: 'Submitted', value: 12, color: '#3b82f6', percentage: 30 },
    { name: 'Pending', value: 8, color: '#f59e0b', percentage: 20 },
    { name: 'Draft', value: 5, color: '#6b7280', percentage: 12.5 }
  ];

  const rfqTrendData = [
    { month: 'Jan', submitted: 8, won: 3 },
    { month: 'Feb', submitted: 12, won: 5 },
    { month: 'Mar', submitted: 15, won: 7 },
    { month: 'Apr', submitted: 18, won: 8 },
    { month: 'May', submitted: 22, won: 12 },
    { month: 'Jun', submitted: 25, won: 15 }
  ];

  const recentRFQs = [
    { id: "RFQ-2025-001", title: "Enterprise Cloud Infrastructure", value: 285000, status: "pending", daysLeft: 4, priority: "high", client: "TechCorp Solutions" },
    { id: "RFQ-2025-002", title: "Digital Transformation Suite", value: 420000, status: "submitted", daysLeft: 2, priority: "critical", client: "Global Industries" },
    { id: "RFQ-2025-003", title: "Cybersecurity Framework", value: 175000, status: "draft", daysLeft: 6, priority: "medium", client: "SecureFlow Inc" }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'won': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mb-7">
      {/* RFQ Status Distribution */}
      <div className="xl:col-span-4">
        <ChartCard 
          title="RFQ Distribution" 
          subtitle="Current pipeline status"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={rfqStatusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {rfqStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RechartsPieChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-3 mt-5">
            {rfqStatusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{item.value}</div>
                  <div className="text-xs font-medium text-gray-600">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* RFQ Performance Trend */}
      <div className="xl:col-span-8">
        <ChartCard 
          title="Performance Analytics" 
          subtitle="RFQ submissions and win rate trends"
          action="View Details"
          actionIcon={ExternalLink}
          isLoading={isLoading}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
              <Sparkles size={12} />
              +23% Win Rate
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={rfqTrendData} margin={{ top: 15, right: 25, left: 15, bottom: 15 }}>
              <defs>
                <linearGradient id="submittedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="wonGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="submitted" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#submittedGradient)"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: 'white' }}
                name="Submitted"
              />
              <Area 
                type="monotone" 
                dataKey="won" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#wonGradient)"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: 'white' }}
                name="Won"
              />
              <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} iconType="circle" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Compact High-Value RFQs */}
      <div className="xl:col-span-12">
        <ChartCard 
          title="High-Value Opportunities" 
          subtitle="Priority RFQs requiring immediate attention"
          action="New Quote"
          actionIcon={Plus}
          isLoading={isLoading}
        >
          <div className="space-y-5">
            {recentRFQs.map((rfq, index) => (
              <div 
                key={rfq.id}
                className="group flex items-center justify-between p-5 border border-gray-100 rounded-lg hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {rfq.title}
                    </h4>
                    <p className="text-xs text-gray-600 font-mono">
                      {rfq.id} • {rfq.client}
                    </p>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-gray-500">{rfq.daysLeft} days remaining</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                      ${(rfq.value / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Potential Value
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className={`px-2.5 py-1.5 text-xs font-semibold rounded-full border ${getStatusStyle(rfq.status)}`}>
                      {rfq.status.toUpperCase()}
                    </span>
                    <span className={`px-2.5 py-1.5 text-xs font-semibold rounded-full border ${getPriorityStyle(rfq.priority)}`}>
                      {rfq.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

// Enhanced Purchase Orders Component with Color-Coded Bars
const VendorPurchaseOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const orderStatusData = [
    { name: 'Delivered', value: 25, color: '#10b981' },
    { name: 'Confirmed', value: 18, color: '#3b82f6' },
    { name: 'Processing', value: 12, color: '#f59e0b' },
    { name: 'Pending', value: 8, color: '#6b7280' }
  ];

  const deliveryMetrics = [
    { metric: 'On-Time Delivery', value: 94, target: 95, color: 'emerald', icon: Target },
    { metric: 'Order Accuracy', value: 98, target: 97, color: 'blue', icon: CheckCircle },
    { metric: 'Customer Rating', value: 4.8, target: 4.5, color: 'amber', icon: Star, isRating: true },
    { metric: 'Fulfillment Rate', value: 96, target: 95, color: 'purple', icon: Award }
  ];

  const performanceData = [
    { month: 'Jan', orders: 45, onTime: 42 },
    { month: 'Feb', orders: 52, onTime: 48 },
    { month: 'Mar', orders: 48, onTime: 46 },
    { month: 'Apr', orders: 65, onTime: 61 },
    { month: 'May', orders: 58, onTime: 55 },
    { month: 'Jun', orders: 63, onTime: 59 }
  ];

  // Custom shape component for colored bars
  const ColoredBar = (props) => {
    const { fill, payload, ...rest } = props;
    const color = payload?.color || fill;
    return <Bar {...rest} fill={color} />;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-7">
      {/* Order Status & Metrics */}
      <div className="space-y-4">
        <ChartCard 
          title="Order Pipeline" 
          subtitle="Current order distribution"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={orderStatusData} margin={{ top: 15, right: 25, left: 15, bottom: 35 }}>
              <defs>
                {orderStatusData.map((entry, index) => (
                  <linearGradient key={index} id={`gradient-${entry.name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 8, 8]}
                stroke="white"
                strokeWidth={1}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        {/* Compact Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {deliveryMetrics.map((metric, index) => {
            const colorClasses = {
              emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-400' },
              blue: { bg: 'bg-blue-50', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-400' },
              amber: { bg: 'bg-amber-50', text: 'text-amber-600', gradient: 'from-amber-500 to-amber-400' },
              purple: { bg: 'bg-purple-50', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-400' }
            };

            return (
              <div key={index} className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${colorClasses[metric.color].bg}`}>
                    <metric.icon className={`w-4 h-4 ${colorClasses[metric.color].text}`} />
                  </div>
                  <div className="flex-1">
                    <div className={`text-lg font-bold ${colorClasses[metric.color].text}`}>
                      {metric.isRating ? metric.value : `${metric.value}%`}
                    </div>
                    <div className="text-xs font-medium text-gray-600">{metric.metric}</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${colorClasses[metric.color].gradient} transition-all duration-500`}
                    style={{ 
                      width: `${metric.isRating ? (metric.value / 5) * 100 : metric.value}%` 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Trends */}
      <ChartCard 
        title="Delivery Excellence" 
        subtitle="Monthly performance tracking"
        action="View Details"
        actionIcon={ExternalLink}
        isLoading={isLoading}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
            <Award size={12} />
            94% Success Rate
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={performanceData} margin={{ top: 15, right: 25, left: 15, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: 'white' }}
              name="Total Orders"
            />
            <Line 
              type="monotone" 
              dataKey="onTime" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: 'white' }}
              name="On-Time Delivery"
            />
            <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} iconType="circle" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

// Compact Payment Status Component
const VendorPaymentStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const paymentData = [
    { name: 'Paid', value: 850000, color: '#10b981', percentage: 68 },
    { name: 'Pending', value: 220000, color: '#f59e0b', percentage: 18 },
    { name: 'Processing', value: 125000, color: '#3b82f6', percentage: 10 },
    { name: 'Overdue', value: 55000, color: '#ef4444', percentage: 4 }
  ];

  const cashFlowData = [
    { month: 'Jan', income: 745000, expenses: 385000 },
    { month: 'Feb', income: 892000, expenses: 445000 },
    { month: 'Mar', income: 1150000, expenses: 520000 },
    { month: 'Apr', income: 1340000, expenses: 580000 },
    { month: 'May', income: 1580000, expenses: 650000 },
    { month: 'Jun', income: 1750000, expenses: 720000 }
  ];

  const financialMetrics = [
    { label: 'Monthly Revenue', value: 1750000, change: +18.5, icon: DollarSign, color: 'emerald' },
    { label: 'Profit Margin', value: 58.9, change: +4.2, icon: TrendingUp, color: 'blue', isPercentage: true },
    { label: 'Outstanding', value: 275000, change: -12.3, icon: Clock, color: 'amber' },
    { label: 'Collection Rate', value: 96.2, change: +2.1, icon: Target, color: 'purple', isPercentage: true }
  ];

  return (
    <div className="space-y-5 mb-7">
      {/* Compact Financial Metrics */}
      <ChartCard 
        title="Financial Overview" 
        subtitle="Key financial metrics and performance indicators"
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {financialMetrics.map((metric, index) => {
            const colorClasses = {
              emerald: { bg: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/25', text: 'text-emerald-600', accent: 'from-emerald-500/10' },
              blue: { bg: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/25', text: 'text-blue-600', accent: 'from-blue-500/10' },
              amber: { bg: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-500/25', text: 'text-amber-600', accent: 'from-amber-500/10' },
              purple: { bg: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/25', text: 'text-purple-600', accent: 'from-purple-500/10' }
            };

            return (
              <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${colorClasses[metric.color].bg} shadow-lg ${colorClasses[metric.color].shadow}`}>
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                    metric.change > 0 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {metric.change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className={`text-xl font-bold ${colorClasses[metric.color].text}`}>
                    {metric.isPercentage ? 
                      `${metric.value}%` : 
                      `$${(metric.value / 1000).toFixed(0)}k`
                    }
                  </div>
                  <div className="text-xs font-semibold text-gray-600">{metric.label}</div>
                </div>
                
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${colorClasses[metric.color].accent} to-transparent rounded-lg pointer-events-none`}></div>
              </div>
            );
          })}
        </div>
      </ChartCard>

      {/* Payment Distribution & Cash Flow */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard 
          title="Payment Distribution" 
          subtitle="Current payment status breakdown"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value) => [`$${(value/1000).toFixed(0)}k`, 'Amount']}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            {paymentData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    ${(item.value/1000).toFixed(0)}k
                  </div>
                  <div className="text-xs font-medium text-gray-600">
                    {item.name} ({item.percentage}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard 
          title="Cash Flow Analysis" 
          subtitle="Monthly income vs expenses trend"
          action="View Details"
          actionIcon={ExternalLink}
          isLoading={isLoading}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
              <Zap size={12} />
              $1.03M Profit
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cashFlowData} margin={{ top: 15, right: 25, left: 15, bottom: 15 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value) => [`$${(value/1000).toFixed(0)}k`, '']}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#incomeGradient)"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: 'white' }}
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#expenseGradient)"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#ef4444', strokeWidth: 2, stroke: 'white' }}
                name="Expenses"
              />
              <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} iconType="circle" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function VendorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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

  // Add custom CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .animate-blob { animation: blob 7s infinite; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex relative overflow-hidden">
      {/* Subtle animated background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <HRMSSidebar 
        stats={stats} 
        activeSection={activeSection} 
        handleSectionChange={handleSectionChange}
        onSidebarToggle={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
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
        <div className="pt-20 p-5 space-y-7 max-w-[1200px] mx-auto">
          {activeSection === "vendor-dash" ? (
            <div>
              {/* Compact Page Header */}
              <div className="flex items-center justify-between mb-7">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Vendor Dashboard
                  </h1>
                  <p className="text-gray-600 text-sm max-w-xl">
                    Welcome back, <span className="font-semibold text-gray-900">{user?.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) : 'Vendor'}</span>. 
                    Monitor your business performance with comprehensive analytics.
                  </p>
                </div>
              </div>

              {/* Compact Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
                <MetricCard 
                  title="Active RFQs" 
                  value="25"
                  icon={FileText} 
                  color="blue" 
                  trend={12}
                  subtitle="Open opportunities"
                  isLoading={loading}
                />
                <MetricCard 
                  title="Win Rate" 
                  value="68"
                  suffix="%"
                  icon={Target} 
                  color="green" 
                  trend={5}
                  subtitle="This quarter"
                  isLoading={loading}
                />
                <MetricCard 
                  title="Active Orders" 
                  value="18"
                  icon={Package} 
                  color="purple" 
                  trend={-3}
                  subtitle="In progress"
                  isLoading={loading}
                />
                <MetricCard 
                  title="Revenue" 
                  value="1.75"
                  prefix="$"
                  suffix="M"
                  icon={DollarSign} 
                  color="orange" 
                  trend={18}
                  subtitle="This month"
                  isLoading={loading}
                />
              </div>

              {/* Dashboard Sections */}
              <VendorRFQOverview />
              <VendorPurchaseOrders />
              <VendorPaymentStatus />
            </div>
          ) : (
            <div>
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
            </div> 
          )}
        </div>
      </main>
      <AIChatButton user={user} />
    </div>
  );
}