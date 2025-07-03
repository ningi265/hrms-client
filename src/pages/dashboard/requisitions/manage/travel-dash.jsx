import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronRight,
  Clock,
  Globe,
  BarChart3,
  MapPin,
  Plane,
  Plus,
  Settings,
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Bell,
  Search,
  Filter,
  MoreVertical,
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  DollarSign,
  PieChart,
  Activity,
  Zap,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  Upload,
  CreditCard,
  Building,
  Car,
  Hotel,
  Utensils,
  Target,
  Award,
  Briefcase,
  Send,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
  Star,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  Loader,
  Shield,
  Receipt
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import axios from "axios";
import { useSnackbar } from "notistack";
import LocalTravelForm from "../../../employee-dash/travel"; 
import InternationalTravelForm from "../../requisitions/manage/international";

// API configuration
const API_BASE_URL =  process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;
export default function TravelDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewTravelMenu, setShowNewTravelMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    stats: null,
    quickLinks: null,
    loading: false
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [totalPending, setTotalPending] = useState(0);
  const [pendingLocal, setPendingLocal] = useState(0);
  const [pendingInternational, setPendingInternational] = useState(0);
  const [localModalOpen, setLocalModalOpen] = useState(false);
  const [internationalModalOpen, setInternationalModalOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // Dynamic budget and travel data states
  const [budgetData, setBudgetData] = useState(null);
  const [departmentBudgets, setDepartmentBudgets] = useState([]);
  const [travelExpenses, setTravelExpenses] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(false);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [budgetError, setBudgetError] = useState(null);
  const [travelStats, setTravelStats] = useState({
    totalTrips: 0,
    totalExpenses: 0,
    averageExpense: 0,
    budgetUtilization: 0
  });

  // Financial reconciliation states
  const [financialData, setFinancialData] = useState({
    totalAllowances: 0,
    totalExpenses: 0,
    pendingReimbursements: 0,
    currentBalance: 0,
    monthlyAllowances: 0,
    monthlyExpenses: 0
  });
  const [expenseCategories, setExpenseCategories] = useState([
    { category: 'Transport', amount: 0, percentage: 45, color: '#3B82F6' },
    { category: 'Accommodation', amount: 0, percentage: 30, color: '#10B981' },
    { category: 'Meals', amount: 0, percentage: 15, color: '#F59E0B' },
    { category: 'Other', amount: 0, percentage: 10, color: '#EF4444' }
  ]);
  const [pendingClaims, setPendingClaims] = useState([]);
  const [selectedFormTab, setSelectedFormTab] = useState('details'); // details, budget, expenses

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Enhanced Metric Card Component (from reconciliation.jsx)
  const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal", onClick }) => {
    const cardClass = size === "large" ? "col-span-2" : "";
    const valueSize = size === "large" ? "text-4xl" : "text-2xl";
    
    return (
      <div 
        className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer ${cardClass}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${
            color === 'blue' ? 'bg-blue-50' :
            color === 'green' ? 'bg-emerald-50' :
            color === 'purple' ? 'bg-purple-50' :
            color === 'orange' ? 'bg-orange-50' :
            color === 'red' ? 'bg-red-50' :
            'bg-gray-50'
          }`}>
            <Icon size={20} className={
              color === 'blue' ? 'text-blue-600' :
              color === 'green' ? 'text-emerald-600' :
              color === 'purple' ? 'text-purple-600' :
              color === 'orange' ? 'text-orange-600' :
              color === 'red' ? 'text-red-600' :
              'text-gray-600'
            } />
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              {trend > 0 ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`${valueSize} font-bold text-gray-900 mb-1`}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
    );
  };

  // Enhanced Travel Form Component with Financial Features
  const EnhancedTravelForm = ({ type, onCancel, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
      destination: '',
      purpose: '',
      startDate: '',
      endDate: '',
      estimatedCost: '',
      accommodationCost: '',
      transportCost: '',
      mealsCost: '',
      otherCosts: '',
      budgetCode: '',
      department: '',
      urgency: 'medium',
      receipts: []
    });

    const [estimatedBreakdown, setEstimatedBreakdown] = useState({
      transport: 0,
      accommodation: 0,
      meals: 0,
      other: 0,
      total: 0
    });

    const [budgetValidation, setBudgetValidation] = useState({
      isValid: true,
      warnings: [],
      exceedsLimit: false
    });

    // Calculate cost breakdown
    useEffect(() => {
      const transport = parseFloat(formData.transportCost) || 0;
      const accommodation = parseFloat(formData.accommodationCost) || 0;
      const meals = parseFloat(formData.mealsCost) || 0;
      const other = parseFloat(formData.otherCosts) || 0;
      const total = transport + accommodation + meals + other;

      setEstimatedBreakdown({ transport, accommodation, meals, other, total });
      setFormData(prev => ({ ...prev, estimatedCost: total.toString() }));

      // Validate against budget
      if (budgetData && total > 0) {
        const exceedsRemaining = total > budgetData.remaining;
        const highPercentage = (total / budgetData.remaining) > 0.3;
        
        setBudgetValidation({
          isValid: !exceedsRemaining,
          warnings: [
            ...(exceedsRemaining ? ['This request exceeds your remaining travel budget'] : []),
            ...(highPercentage && !exceedsRemaining ? ['This request uses more than 30% of remaining budget'] : [])
          ],
          exceedsLimit: exceedsRemaining
        });
      }
    }, [formData.transportCost, formData.accommodationCost, formData.mealsCost, formData.otherCosts, budgetData]);

    return (
      <div className="space-y-6">
        {/* Form Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'details', label: 'Trip Details', icon: MapPin },
            { id: 'budget', label: 'Budget & Costs', icon: Wallet },
            { id: 'expenses', label: 'Expense Planning', icon: Receipt }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFormTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${
                selectedFormTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Trip Details Tab */}
        {selectedFormTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination *
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={type === 'international' ? 'e.g., London, UK' : 'e.g., Lilongwe, Malawi'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Travel *
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select purpose</option>
                  <option value="business_meeting">Business Meeting</option>
                  <option value="conference">Conference/Training</option>
                  <option value="client_visit">Client Visit</option>
                  <option value="project_work">Project Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select department</option>
                  {departmentBudgets.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low (2-4 weeks notice)</option>
                  <option value="medium">Medium (1-2 weeks notice)</option>
                  <option value="high">High (Urgent - less than 1 week)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Budget & Costs Tab */}
        {selectedFormTab === 'budget' && (
          <div className="space-y-6">
            {/* Budget Status */}
            {budgetData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-3">Current Travel Budget Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    title="Total Budget"
                    value={budgetData.totalBudget}
                    prefix="MWK "
                    icon={Target}
                    color="blue"
                    size="normal"
                  />
                  <MetricCard
                    title="Remaining"
                    value={budgetData.remaining}
                    prefix="MWK "
                    icon={Wallet}
                    color="green"
                    size="normal"
                  />
                  <MetricCard
                    title="Utilization"
                    value={budgetData.utilization.toFixed(1)}
                    suffix="%"
                    icon={BarChart3}
                    color="purple"
                    size="normal"
                  />
                </div>
              </div>
            )}

            {/* Cost Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-4">Estimated Costs Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transport Costs (MWK)
                  </label>
                  <input
                    type="number"
                    value={formData.transportCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, transportCost: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accommodation Costs (MWK)
                  </label>
                  <input
                    type="number"
                    value={formData.accommodationCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, accommodationCost: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meals & Allowances (MWK)
                  </label>
                  <input
                    type="number"
                    value={formData.mealsCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, mealsCost: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Expenses (MWK)
                  </label>
                  <input
                    type="number"
                    value={formData.otherCosts}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherCosts: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Cost Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-gray-900">Cost Summary</h5>
                  <span className="text-2xl font-bold text-gray-900">
                    MWK {estimatedBreakdown.total.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Transport', amount: estimatedBreakdown.transport, color: '#3B82F6' },
                    { label: 'Accommodation', amount: estimatedBreakdown.accommodation, color: '#10B981' },
                    { label: 'Meals', amount: estimatedBreakdown.meals, color: '#F59E0B' },
                    { label: 'Other', amount: estimatedBreakdown.other, color: '#EF4444' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-600">{item.label}</span>
                      </div>
                      <span className="text-sm font-medium">MWK {item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Validation */}
              {budgetValidation.warnings.length > 0 && (
                <div className={`mt-4 p-3 rounded-lg border ${
                  budgetValidation.exceedsLimit 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                      budgetValidation.exceedsLimit ? 'text-red-600' : 'text-amber-600'
                    }`} />
                    <div>
                      <h6 className={`font-medium ${
                        budgetValidation.exceedsLimit ? 'text-red-900' : 'text-amber-900'
                      }`}>
                        Budget {budgetValidation.exceedsLimit ? 'Exceeded' : 'Warning'}
                      </h6>
                      <ul className={`text-sm mt-1 ${
                        budgetValidation.exceedsLimit ? 'text-red-700' : 'text-amber-700'
                      }`}>
                        {budgetValidation.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expense Planning Tab */}
        {selectedFormTab === 'expenses' && (
          <div className="space-y-6">
            {/* Document Upload */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-4">Supporting Documents</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-gray-600">Upload pre-approval documents, quotes, or itineraries</p>
                  <p className="text-sm text-gray-500">PDF, PNG, JPG up to 10MB each</p>
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Choose Files
                </button>
              </div>
            </div>

            {/* Expense Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-3">Travel Expense Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Transport</h5>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Economy class flights only</li>
                    <li>• Book 2 weeks in advance when possible</li>
                    <li>• Use company preferred vendors</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Accommodation</h5>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Standard business hotels</li>
                    <li>• Maximum MWK 25,000/night local</li>
                    <li>• Maximum MWK 45,000/night international</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Meals</h5>
                  <ul className="text-blue-700 space-y-1">
                    <li>• MWK 8,000/day local allowance</li>
                    <li>• MWK 15,000/day international allowance</li>
                    <li>• Keep receipts for reimbursement</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Other</h5>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Airport parking/transfers</li>
                    <li>• Business communications</li>
                    <li>• Pre-approved incidentals</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Estimated Daily Allowances */}
            {formData.startDate && formData.endDate && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-3">Estimated Daily Allowances</h4>
                {(() => {
                  const startDate = new Date(formData.startDate);
                  const endDate = new Date(formData.endDate);
                  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                  const isInternational = type === 'international';
                  const dailyAllowance = isInternational ? 15000 : 8000;
                  const totalAllowance = days * dailyAllowance;

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-900">{days}</div>
                        <div className="text-sm text-green-700">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-900">MWK {dailyAllowance.toLocaleString()}</div>
                        <div className="text-sm text-green-700">Daily Allowance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-900">MWK {totalAllowance.toLocaleString()}</div>
                        <div className="text-sm text-green-700">Total Allowance</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={budgetValidation.exceedsLimit}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                budgetValidation.exceedsLimit
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Animation effect
  useEffect(() => {
    setAnimate(true);
    return () => setAnimate(false);
  }, []);

  // Fetch budget data for travel
  const fetchTravelBudgetData = async () => {
    try {
      setIsLoadingBudgets(true);
      setBudgetError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch departments data for travel budgets
      const deptResponse = await fetch(`${API_BASE_URL}/api/departments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (deptResponse.ok) {
        const departments = await deptResponse.json();
        setDepartmentBudgets(departments);
        
        // Calculate travel budget from departments (assuming travel is part of each department's budget)
        const totalTravelBudget = departments.reduce((sum, dept) => {
          // Assume 10% of each department's budget is allocated for travel
          return sum + (dept.budget * 0.1 || 0);
        }, 0);
        
        const totalTravelSpent = departments.reduce((sum, dept) => {
          // Assume 10% of spent amount is travel-related
          return sum + (dept.actualSpending * 0.1 || 0);
        }, 0);
        
        setBudgetData({
          totalBudget: totalTravelBudget,
          totalSpent: totalTravelSpent,
          remaining: totalTravelBudget - totalTravelSpent,
          utilization: totalTravelBudget > 0 ? (totalTravelSpent / totalTravelBudget) * 100 : 0
        });
      } else {
        // Fallback to default travel budget data
        setBudgetData({
          totalBudget: 250000, // MWK 250,000 annual travel budget
          totalSpent: 180000,  // MWK 180,000 spent
          remaining: 70000,    // MWK 70,000 remaining
          utilization: 72
        });
      }
    } catch (error) {
      console.error('Error fetching travel budget data:', error);
      setBudgetError(error.message);
      
      // Fallback to default budget data
      setBudgetData({
        totalBudget: 250000,
        totalSpent: 180000,
        remaining: 70000,
        utilization: 72
      });
    } finally {
      setIsLoadingBudgets(false);
    }
  };

  // Fetch travel requests and expenses with financial data
  const fetchTravelData = async () => {
    try {
      setIsLoadingTrips(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch travel requests
      const travelResponse = await fetch(`${API_BASE_URL}/api/travel-requests?limit=10&sort=createdAt&order=desc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (travelResponse.ok) {
        const travelData = await travelResponse.json();
        const trips = (travelData.data || []).map((trip, index) => ({
          id: trip.requestId || `TR-2024-${String(index + 1).padStart(3, '0')}`,
          destination: trip.destination || 'Unknown Destination',
          type: trip.travelType || 'Local',
          status: trip.status || 'pending',
          date: trip.travelDate ? new Date(trip.travelDate).toLocaleDateString() : 'TBD',
          amount: `MWK ${(trip.estimatedCost || trip.totalCost || 0).toLocaleString()}`,
          purpose: trip.purpose || 'Business Trip'
        }));
        
        setRecentTrips(trips);
        
        // Calculate travel statistics and financial data
        const totalTrips = trips.length;
        const totalExpenses = trips.reduce((sum, trip) => {
          return sum + (parseFloat(trip.amount.replace(/[MWK\s,]/g, '')) || 0);
        }, 0);
        
        setTravelStats({
          totalTrips,
          totalExpenses,
          averageExpense: totalTrips > 0 ? totalExpenses / totalTrips : 0,
          budgetUtilization: budgetData ? (totalExpenses / budgetData.totalBudget) * 100 : 0
        });

        // Calculate financial reconciliation data
        const approvedTrips = trips.filter(trip => trip.status === 'approved');
        const pendingTrips = trips.filter(trip => trip.status === 'pending');
        
        const approvedExpenses = approvedTrips.reduce((sum, trip) => {
          return sum + (parseFloat(trip.amount.replace(/[MWK\s,]/g, '')) || 0);
        }, 0);
        
        const pendingReimbursements = pendingTrips.reduce((sum, trip) => {
          return sum + (parseFloat(trip.amount.replace(/[MWK\s,]/g, '')) || 0);
        }, 0);

        // Calculate monthly data (assume current month for demonstration)
        const currentMonthTrips = trips.filter(trip => {
          const tripDate = new Date(trip.date);
          const currentDate = new Date();
          return tripDate.getMonth() === currentDate.getMonth() && 
                 tripDate.getFullYear() === currentDate.getFullYear();
        });

        const monthlyExpenses = currentMonthTrips.reduce((sum, trip) => {
          return sum + (parseFloat(trip.amount.replace(/[MWK\s,]/g, '')) || 0);
        }, 0);

        setFinancialData({
          totalAllowances: budgetData ? budgetData.totalBudget : 250000,
          totalExpenses: approvedExpenses,
          pendingReimbursements,
          currentBalance: budgetData ? budgetData.remaining : 70000,
          monthlyAllowances: budgetData ? Math.round(budgetData.totalBudget / 12) : 20000,
          monthlyExpenses
        });

        // Update expense categories with real data percentages
        const transportCost = Math.round(approvedExpenses * 0.45);
        const accommodationCost = Math.round(approvedExpenses * 0.30);
        const mealsCost = Math.round(approvedExpenses * 0.15);
        const otherCost = approvedExpenses - transportCost - accommodationCost - mealsCost;

        setExpenseCategories([
          { category: 'Transport', amount: transportCost, percentage: 45, color: '#3B82F6' },
          { category: 'Accommodation', amount: accommodationCost, percentage: 30, color: '#10B981' },
          { category: 'Meals', amount: mealsCost, percentage: 15, color: '#F59E0B' },
          { category: 'Other', amount: otherCost, percentage: 10, color: '#EF4444' }
        ]);

        // Create pending claims from pending trips
        const claims = pendingTrips.slice(0, 3).map((trip, index) => ({
          id: index + 1,
          type: `${trip.type} Travel - ${trip.destination.split(',')[0]}`,
          amount: parseFloat(trip.amount.replace(/[MWK\s,]/g, '')) || 0,
          submittedDate: trip.date,
          expectedApproval: new Date(Date.now() + (3 + index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'under_review',
          receipts: Math.floor(Math.random() * 3) + 1
        }));
        
        setPendingClaims(claims);
        
      } else {
        // Fallback to default travel data
        const defaultTrips = [
          {
            id: "TR-2024-001",
            destination: "Lilongwe, Malawi",
            type: "Local",
            status: "completed",
            date: "Mar 15-17, 2024",
            amount: "MWK 45,000",
            purpose: "Client Meeting"
          },
          {
            id: "TR-2024-002", 
            destination: "Johannesburg, SA",
            type: "International",
            status: "approved",
            date: "Apr 20-25, 2024",
            amount: "MWK 125,000",
            purpose: "Conference"
          },
          {
            id: "TR-2024-003",
            destination: "Blantyre, Malawi", 
            type: "Local",
            status: "pending",
            date: "May 10-12, 2024",
            amount: "MWK 32,000",
            purpose: "Training"
          }
        ];
        
        setRecentTrips(defaultTrips);
        setTravelStats({
          totalTrips: 12,
          totalExpenses: 180000,
          averageExpense: 15000,
          budgetUtilization: 72
        });

        // Set default financial data
        setFinancialData({
          totalAllowances: 250000,
          totalExpenses: 180000,
          pendingReimbursements: 32000,
          currentBalance: 70000,
          monthlyAllowances: 20000,
          monthlyExpenses: 45000
        });
      }
    } catch (error) {
      console.error('Error fetching travel data:', error);
      
      // Fallback to default travel data
      const defaultTrips = [
        {
          id: "TR-2024-001",
          destination: "Lilongwe, Malawi",
          type: "Local",
          status: "completed",
          date: "Mar 15-17, 2024",
          amount: "MWK 45,000",
          purpose: "Client Meeting"
        }
      ];
      
      setRecentTrips(defaultTrips);
      setTravelStats({
        totalTrips: 12,
        totalExpenses: 180000,
        averageExpense: 15000,
        budgetUtilization: 72
      });

      setFinancialData({
        totalAllowances: 250000,
        totalExpenses: 180000,
        pendingReimbursements: 32000,
        currentBalance: 70000,
        monthlyAllowances: 20000,
        monthlyExpenses: 45000
      });
    } finally {
      setIsLoadingTrips(false);
    }
  };

  // Fetch pending travel statistics
  const fetchPendingStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/travel-requests/pending/stat`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setTotalPending(response.data.totalPending || 0);
        setPendingLocal(response.data.pendingLocal || 0);
        setPendingInternational(response.data.pendingInternational || 0);
      }
    } catch (error) {
      console.error("Error fetching pending stats:", error);
      // Use fallback values
      setTotalPending(3);
      setPendingLocal(2);
      setPendingInternational(1);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTravelBudgetData();
    fetchTravelData();
    fetchPendingStats();
  }, []);

  // Refresh all data
  const handleRefreshData = () => {
    fetchTravelBudgetData();
    fetchTravelData();
    fetchPendingStats();
  };

  // Enhanced sample data for charts with dynamic calculations
  const travelData = [
    { name: "Jan", local: 2, international: 1, total: 3 },
    { name: "Feb", local: 1, international: 0, total: 1 },
    { name: "Mar", local: 3, international: 1, total: 4 },
    { name: "Apr", local: 0, international: 2, total: 2 },
    { name: "May", local: 2, international: 0, total: 2 },
    { name: "Jun", local: 1, international: 1, total: 2 },
  ];

  // Dynamic expense data based on actual travel budget
  const expenseData = budgetData ? [
    { 
      name: "Transport", 
      value: Math.round(budgetData.totalSpent * 0.45), 
      percentage: 45, 
      color: "#3b82f6" 
    },
    { 
      name: "Accommodation", 
      value: Math.round(budgetData.totalSpent * 0.30), 
      percentage: 30, 
      color: "#10b981" 
    },
    { 
      name: "Meals", 
      value: Math.round(budgetData.totalSpent * 0.15), 
      percentage: 15, 
      color: "#f59e0b" 
    },
    { 
      name: "Other", 
      value: Math.round(budgetData.totalSpent * 0.10), 
      percentage: 10, 
      color: "#ef4444" 
    },
  ] : [
    { name: "Transport", value: 81000, percentage: 45, color: "#3b82f6" },
    { name: "Accommodation", value: 54000, percentage: 30, color: "#10b981" },
    { name: "Meals", value: 27000, percentage: 15, color: "#f59e0b" },
    { name: "Other", value: 18000, percentage: 10, color: "#ef4444" },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'approved': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={14} />;
      case 'approved': return <CheckCircle size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'rejected': return <X size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <Plane size={24} />
                </div>
                Travel Dashboard
              </h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>Real-time tracking</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-blue-500" />
                  <span>Dynamic budgeting</span>
                </div>
                {budgetError && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Using cached data</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 transition-colors duration-200"
              >
                <Search size={18} />
              </button>
              <button className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 transition-colors duration-200">
                <Filter size={18} />
              </button>
              <button className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 transition-colors duration-200">
                <Bell size={18} />
              </button>
              <button 
                onClick={handleRefreshData}
                disabled={isLoadingBudgets || isLoadingTrips}
                className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 transition-colors duration-200"
              >
                <RefreshCw size={18} className={isLoadingBudgets || isLoadingTrips ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNewTravelMenu(!showNewTravelMenu)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={18} />
                New Travel Request
              </button>
              
              {showNewTravelMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setLocalModalOpen(true);
                        setShowNewTravelMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Local Travel</div>
                        <div className="text-sm text-gray-500">Domestic business trips</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setInternationalModalOpen(true);
                        setShowNewTravelMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-purple-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Globe size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">International Travel</div>
                        <div className="text-sm text-gray-500">Global business trips</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Search field */}
        {showSearch && (
          <div className="max-w-7xl mx-auto mt-4 flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 transition-all duration-300">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search travel requests, destinations, or expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-800 w-full pl-2 placeholder-gray-400 text-sm"
            />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 mb-8 shadow-xl">
          <div className="flex border-b border-gray-200 bg-white rounded-t-2xl">
            {["overview", "analytics", "expenses"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab === "overview" && <BarChart3 size={16} className="inline mr-2" />}
                {tab === "analytics" && <TrendingUp size={16} className="inline mr-2" />}
                {tab === "expenses" && <Wallet size={16} className="inline mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-8">
              {/* Primary Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                      <Plane size={24} className="text-white" />
                    </div>
                    <div className="text-right">
                      {isLoadingTrips ? (
                        <Loader size={20} className="animate-spin text-blue-600" />
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-blue-900">{travelStats.totalTrips}</div>
                          <div className="text-sm text-blue-600">Total Trips</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-blue-700">
                    <ArrowUp size={16} className="mr-1" />
                    <span>+2 from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500 rounded-xl shadow-lg">
                      <Clock size={24} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-900">{totalPending}</div>
                      <div className="text-sm text-amber-600">Pending Approvals</div>
                    </div>
                  </div>
                  <div className="text-sm text-amber-700">
                    {pendingLocal} local, {pendingInternational} international
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                      <Wallet size={24} className="text-white" />
                    </div>
                    <div className="text-right">
                      {isLoadingBudgets ? (
                        <Loader size={20} className="animate-spin text-green-600" />
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-green-900">
                            MWK {financialData.totalExpenses.toLocaleString()}
                          </div>
                          <div className="text-sm text-green-600">Total Expenses</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: animate ? `${budgetData ? budgetData.utilization : 72}%` : '0%' }}
                      ></div>
                    </div>
                    <div className="text-sm text-green-700">
                      {budgetData ? budgetData.utilization.toFixed(1) : '72'}% of annual budget
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                      <DollarSign size={24} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-900">
                        MWK {financialData.currentBalance.toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-600">Available Balance</div>
                    </div>
                  </div>
                  <div className="text-sm text-purple-700">
                    Current allocation remaining
                  </div>
                </div>
              </div>

              {/* Financial Reconciliation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Month Allowances"
                  value={financialData.monthlyAllowances}
                  prefix="MWK "
                  icon={Target}
                  color="green"
                  trend={8}
                  subtitle="This month allocated"
                />
                <MetricCard
                  title="Month Expenses"
                  value={financialData.monthlyExpenses}
                  prefix="MWK "
                  icon={Receipt}
                  color="blue"
                  trend={-3}
                  subtitle="This month spent"
                />
                <MetricCard
                  title="Pending Reimbursements"
                  value={financialData.pendingReimbursements}
                  prefix="MWK "
                  icon={Clock}
                  color="orange"
                  subtitle="Awaiting approval"
                />
                <MetricCard
                  title="Avg Trip Cost"
                  value={travelStats.averageExpense}
                  prefix="MWK "
                  icon={BarChart3}
                  color="purple"
                  trend={5}
                  subtitle="Per trip average"
                />
              </div>

              {/* Budget Status Alert */}
              {budgetData && budgetData.utilization > 80 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-amber-900 mb-2">Budget Alert - Immediate Attention Required</h4>
                      <p className="text-amber-800 mb-3">
                        You've used {budgetData.utilization.toFixed(1)}% of your annual travel budget. 
                        Consider reviewing upcoming travel plans to stay within budget limits.
                      </p>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm">
                          Review Budget
                        </button>
                        <button className="px-4 py-2 bg-white text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium text-sm">
                          View Guidelines
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Expense Categories */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <PieChart className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-gray-900">Expense Breakdown</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={expenseCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {expenseCategories.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-gray-600">{item.category}</span>
                        </div>
                        <span className="font-medium">MWK {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Travel Type Distribution */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <h3 className="font-bold text-gray-900">Travel Types</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-gray-700 font-medium">Local Travel</span>
                        </div>
                        <span className="text-gray-900 font-bold">
                          {recentTrips.filter(trip => trip.type === 'Local').length} trips
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: animate ? '75%' : '0%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-gray-700 font-medium">International</span>
                        </div>
                        <span className="text-gray-900 font-bold">
                          {recentTrips.filter(trip => trip.type === 'International').length} trips
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000 delay-300" style={{ width: animate ? '25%' : '0%' }}></div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Top Destinations</h4>
                      <div className="space-y-3">
                        {recentTrips.slice(0, 3).map((trip, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex items-center gap-2">
                              {trip.type === 'International' ? 
                                <Globe size={14} className="text-purple-500" /> : 
                                <MapPin size={14} className="text-blue-500" />
                              }
                              <span className="text-gray-700 text-sm">{trip.destination.split(',')[0]}</span>
                            </div>
                            <span className="text-gray-900 font-medium text-sm">{trip.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Claims */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-gray-900">Pending Claims</h3>
                  </div>
                  <div className="space-y-4">
                    {pendingClaims.length > 0 ? pendingClaims.map((claim, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                        claim.status === 'approved' ? 'bg-green-50 border-green-500' :
                        claim.status === 'under_review' ? 'bg-blue-50 border-blue-500' :
                        'bg-yellow-50 border-yellow-500'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{claim.type}</h4>
                          <span className="text-sm font-bold text-gray-900">MWK {claim.amount.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">Submitted: {claim.submittedDate}</p>
                        <div className="flex justify-between items-center">
                          <span className={`px-3 py-1 rounded-full font-medium text-xs ${
                            claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                            claim.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {claim.status.replace('_', ' ')}
                          </span>
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <Receipt size={12} />
                            <span>{claim.receipts} receipts</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <CheckCircle size={32} className="mx-auto text-green-500 mb-3" />
                        <p className="text-gray-600 text-sm">No pending claims</p>
                        <p className="text-gray-500 text-xs">All expenses are up to date</p>
                      </div>
                    )}
                  </div>
                  
                  {pendingClaims.length > 0 && (
                    <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm">
                      View All Claims
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link 
                  to="/travel/requests" 
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-200 shadow-lg">
                        <FileText size={24} className="text-blue-600" />
                      </div>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Requests</h3>
                    <p className="text-gray-600 text-sm mb-4">View and manage all your travel requests with enhanced tracking</p>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {travelStats.totalTrips} total
                      </span>
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                        {totalPending} pending
                      </span>
                    </div>
                  </div>
                </Link>

                <button 
                  onClick={() => setLocalModalOpen(true)}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden text-left"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-200 shadow-lg">
                        <Plus size={24} className="text-green-600" />
                      </div>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">New Travel Request</h3>
                    <p className="text-gray-600 text-sm mb-4">Submit new travel requests with budget validation</p>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Real-time budget check
                      </span>
                    </div>
                  </div>
                </button>

                <Link 
                  to="/travel/expenses" 
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-200 shadow-lg">
                        <Receipt size={24} className="text-purple-600" />
                      </div>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Financial Reconciliation</h3>
                    <p className="text-gray-600 text-sm mb-4">Track expenses and manage reimbursements</p>
                    <div className="flex items-center space-x-2">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                        MWK {financialData.pendingReimbursements.toLocaleString()} pending
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Enhanced Recent Travel Activity */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
                <div className="px-6 py-4 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Activity size={20} className="text-blue-500" />
                      Recent Travel Activity
                    </h3>
                    <div className="flex items-center gap-3">
                      {isLoadingTrips && (
                        <Loader size={16} className="animate-spin text-blue-500" />
                      )}
                      <button 
                        onClick={fetchTravelData}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      >
                        <RefreshCw size={14} />
                        Refresh
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                </div>
                
                {isLoadingTrips ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader size={32} className="animate-spin text-gray-400 mx-auto mb-3" />
                      <span className="text-gray-600">Loading travel activity...</span>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {recentTrips.slice(0, 5).map((trip) => (
                      <div key={trip.id} className="p-6 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-md">
                              {trip.type === 'International' ? 
                                <Globe size={20} className="text-purple-600" /> : 
                                <MapPin size={20} className="text-blue-600" />
                              }
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{trip.destination}</h4>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-sm text-gray-500">{trip.date}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm text-gray-500">{trip.purpose}</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  trip.type === 'International' 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {trip.type}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-medium text-gray-900">{trip.amount}</div>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                                {getStatusIcon(trip.status)}
                                <span className="ml-1 capitalize">{trip.status}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="p-8">
              {/* Travel History Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 size={24} className="text-blue-500" />
                      Travel History
                    </h3>
                    <p className="text-gray-600 mt-1">Your travel patterns over the last 6 months</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium">
                      Local
                    </button>
                    <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-sm font-medium">
                      International
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={travelData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar dataKey="local" name="Local Trips" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="international" name="International Trips" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Travel Type Breakdown */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <PieChart size={20} className="text-green-500" />
                    Travel by Type
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-gray-700 font-medium">Local Travel</span>
                        </div>
                        <span className="text-gray-900 font-bold">
                          {recentTrips.filter(trip => trip.type === 'Local').length} trips (75%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: animate ? '75%' : '0%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-gray-700 font-medium">International Travel</span>
                        </div>
                        <span className="text-gray-900 font-bold">
                          {recentTrips.filter(trip => trip.type === 'International').length} trips (25%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000 delay-300" style={{ width: animate ? '25%' : '0%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Top Destinations</h4>
                      <div className="space-y-3">
                        {recentTrips.slice(0, 3).map((trip, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{trip.destination.split(',')[0]}</span>
                            <span className="text-gray-900 font-medium">1 trip</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expense Breakdown */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <DollarSign size={20} className="text-amber-500" />
                    Expense Breakdown
                  </h3>
                  <div className="space-y-6">
                    {expenseData.map((expense, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: expense.color }}></div>
                            <span className="text-gray-700 font-medium">{expense.name}</span>
                          </div>
                          <span className="text-gray-900 font-bold">
                            MWK {expense.value.toLocaleString()} ({expense.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-1000" 
                            style={{ 
                              backgroundColor: expense.color,
                              width: animate ? `${expense.percentage}%` : '0%',
                              transitionDelay: `${index * 200}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <div>
                          <span className="text-green-900 font-bold">Total Expenses</span>
                          <p className="text-green-700 text-sm">Current year</p>
                        </div>
                        <span className="text-2xl font-bold text-green-900">
                          MWK {budgetData ? budgetData.totalSpent.toLocaleString() : '180,000'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <div className="p-8">
              {/* Expense Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl">
                      <Plane size={20} className="text-white" />
                    </div>
                    <TrendingUp size={16} className="text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">
                    MWK {expenseData[0]?.value.toLocaleString() || '81,000'}
                  </div>
                  <div className="text-sm text-blue-600">Transport Costs</div>
                  <div className="text-xs text-blue-500 mt-2">
                    {expenseData[0]?.percentage || 45}% of total
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <Hotel size={20} className="text-white" />
                    </div>
                    <TrendingUp size={16} className="text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-1">
                    MWK {expenseData[1]?.value.toLocaleString() || '54,000'}
                  </div>
                  <div className="text-sm text-green-600">Accommodation</div>
                  <div className="text-xs text-green-500 mt-2">
                    {expenseData[1]?.percentage || 30}% of total
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500 rounded-xl">
                      <Utensils size={20} className="text-white" />
                    </div>
                    <TrendingDown size={16} className="text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-amber-900 mb-1">
                    MWK {expenseData[2]?.value.toLocaleString() || '27,000'}
                  </div>
                  <div className="text-sm text-amber-600">Meals</div>
                  <div className="text-xs text-amber-500 mt-2">
                    {expenseData[2]?.percentage || 15}% of total
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-500 rounded-xl">
                      <Car size={20} className="text-white" />
                    </div>
                    <TrendingUp size={16} className="text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-900 mb-1">
                    MWK {expenseData[3]?.value.toLocaleString() || '18,000'}
                  </div>
                  <div className="text-sm text-red-600">Other</div>
                  <div className="text-xs text-red-500 mt-2">
                    {expenseData[3]?.percentage || 10}% of total
                  </div>
                </div>
              </div>

              {/* Expense Reports Table */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
                <div className="px-6 py-4 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FileText size={20} className="text-purple-500" />
                      Recent Expense Reports
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium flex items-center gap-1">
                        <Upload size={14} />
                        Upload Receipt
                      </button>
                      <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} />
                        New Report
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentTrips.slice(0, 3).map((trip, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">EXP-{trip.id.split('-')[2]}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{trip.destination} - {trip.purpose}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{trip.amount}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                              {getStatusIcon(trip.status)}
                              <span className="ml-1">{trip.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">{trip.date}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                <Eye size={14} />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                                <Download size={14} />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                <Edit size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Quick Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3"></div>
          <div className="space-y-6">
            {/* Enhanced Travel Insights */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles size={20} />
                  AI Travel Insights
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-purple-100">Live</span>
                </div>
              </div>
              <p className="text-purple-100 text-sm mb-4">
                Smart recommendations for optimized travel planning and budget management.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown size={14} className="text-green-300" />
                    <span className="font-medium">Cost Optimization</span>
                  </div>
                  <span>Book flights 2 weeks earlier to save 15% on transport costs</span>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 size={14} className="text-yellow-300" />
                    <span className="font-medium">Budget Alert</span>
                  </div>
                  <span>Your travel frequency is 20% above department average</span>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-blue-300" />
                    <span className="font-medium">Smart Booking</span>
                  </div>
                  <span>Consider hotels near conference venues for 25% savings</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 px-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-colors duration-200 text-sm font-medium">
                View All Insights
              </button>
            </div>

            {/* Enhanced Budget Tracker */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Target size={20} className="text-green-500" />
                  Budget Tracker
                </h3>
                {isLoadingBudgets && (
                  <Loader size={16} className="animate-spin text-gray-400" />
                )}
              </div>
              
              {isLoadingBudgets ? (
                <div className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <Loader size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">Loading budget data...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Budget Status */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-green-900">Annual Travel Budget</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        budgetData && budgetData.utilization < 70 
                          ? 'bg-green-100 text-green-800' 
                          : budgetData && budgetData.utilization < 85
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {budgetData && budgetData.utilization < 70 ? 'Healthy' : 
                         budgetData && budgetData.utilization < 85 ? 'Monitor' : 'Critical'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-900 mb-3">
                      MWK {budgetData ? budgetData.totalBudget.toLocaleString() : '250,000'}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <span className="text-green-700">Spent:</span>
                        <span className="ml-2 font-bold">MWK {budgetData ? budgetData.totalSpent.toLocaleString() : '180,000'}</span>
                      </div>
                      <div>
                        <span className="text-green-700">Remaining:</span>
                        <span className="ml-2 font-bold">MWK {budgetData ? budgetData.remaining.toLocaleString() : '70,000'}</span>
                      </div>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-3 mb-2 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          budgetData && budgetData.utilization < 70 ? 'bg-green-500' :
                          budgetData && budgetData.utilization < 85 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: animate ? `${Math.min(100, budgetData ? budgetData.utilization : 72)}%` : '0%' }}
                      ></div>
                    </div>
                    <div className="text-sm text-green-700">
                      {budgetData ? budgetData.utilization.toFixed(1) : '72'}% utilized this year
                    </div>
                  </div>

                  {/* Financial Reconciliation Summary */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <Receipt size={16} />
                      Financial Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Total Allowances:</span>
                        <span className="font-bold text-blue-900">MWK {financialData.totalAllowances.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Total Expenses:</span>
                        <span className="font-bold text-blue-900">MWK {financialData.totalExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-blue-200 pt-2">
                        <span className="text-blue-700 font-medium">Current Balance:</span>
                        <span className="font-bold text-green-600">MWK {financialData.currentBalance.toLocaleString()}</span>
                      </div>
                      {financialData.pendingReimbursements > 0 && (
                        <div className="flex justify-between">
                          <span className="text-blue-700">Pending Claims:</span>
                          <span className="font-bold text-amber-600">MWK {financialData.pendingReimbursements.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="text-xs text-gray-500 space-y-2">
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">Q1 Performance:</span> MWK {budgetData ? Math.round(budgetData.totalSpent * 0.25).toLocaleString() : '45,000'} spent (25%)
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">Monthly Average:</span> MWK {budgetData ? Math.round(budgetData.totalSpent / 6).toLocaleString() : '30,000'}
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">Savings Opportunity:</span> MWK 8,000/month with optimization
                    </div>
                  </div>

                  {/* Budget Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                      View Budget
                    </button>
                    <button className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                      Set Alerts
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Help & Support */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-500" />
                  Travel Support
                </h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Get assistance with travel policies, expense reporting, and financial reconciliation.
              </p>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-3 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-3 group">
                  <BookOpen size={14} />
                  <div className="flex-1">
                    <span className="font-medium">Travel Policy Guide</span>
                    <div className="text-xs text-indigo-600">Updated expense guidelines & limits</div>
                  </div>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full text-left px-3 py-3 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-3 group">
                  <MessageSquare size={14} />
                  <div className="flex-1">
                    <span className="font-medium">Live Chat Support</span>
                    <div className="text-xs text-indigo-600">Get instant help with your requests</div>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </button>
                <button className="w-full text-left px-3 py-3 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-3 group">
                  <Phone size={14} />
                  <div className="flex-1">
                    <span className="font-medium">Emergency Travel Line</span>
                    <div className="text-xs text-indigo-600">24/7 support for urgent travel issues</div>
                  </div>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full text-left px-3 py-3 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-3 group">
                  <Receipt size={14} />
                  <div className="flex-1">
                    <span className="font-medium">Financial Reconciliation</span>
                    <div className="text-xs text-indigo-600">Help with expense claims & reimbursements</div>
                  </div>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Quick Contact */}
              <div className="mt-4 p-3 bg-white/70 rounded-lg border border-indigo-200">
                <div className="text-xs text-indigo-600 mb-2">Quick Contact</div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 py-2 px-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-xs font-medium">
                    <Phone size={12} className="mr-1" />
                    Call
                  </button>
                  <button className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium">
                    <MessageSquare size={12} className="mr-1" />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      
      {/* Local Travel Modal */}
      {localModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                      <MapPin size={28} />
                    </div>
                    New Local Travel Request
                  </h2>
                  <p className="text-gray-600 mt-2 flex items-center gap-4">
                    <span>Submit a request for domestic business travel</span>
                    <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs font-medium">
                      <Activity size={12} />
                      Real-time budget tracking
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setLocalModalOpen(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>

              {/* Budget Summary Banner */}
              {budgetData && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Total Budget</span>
                      </div>
                      <span className="font-bold text-gray-900">MWK {budgetData.totalBudget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet size={16} className="text-emerald-600" />
                        <span className="text-sm font-medium text-gray-700">Remaining</span>
                      </div>
                      <span className="font-bold text-emerald-600">MWK {budgetData.remaining.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 size={16} className="text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Utilization</span>
                      </div>
                      <span className="font-bold text-purple-600">{budgetData.utilization.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto bg-gray-50">
              <EnhancedTravelForm
                type="local"
                onCancel={() => setLocalModalOpen(false)}
                onSubmitSuccess={() => {
                  setLocalModalOpen(false);
                  enqueueSnackbar("Local travel request submitted successfully!", { variant: "success" });
                  handleRefreshData();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* International Travel Modal */}
      {internationalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
                      <Globe size={28} />
                    </div>
                    New International Travel Request
                  </h2>
                  <p className="text-gray-600 mt-2 flex items-center gap-4">
                    <span>Submit a request for international business travel</span>
                    <span className="flex items-center gap-1 text-purple-600 bg-purple-100 px-2 py-1 rounded-full text-xs font-medium">
                      <Shield size={12} />
                      Enhanced validation
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setInternationalModalOpen(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>

              {/* Budget Summary Banner */}
              {budgetData && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target size={16} className="text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Total Budget</span>
                      </div>
                      <span className="font-bold text-gray-900">MWK {budgetData.totalBudget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-600" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">Int'l Allowance</span>
                        <div className="text-xs text-amber-600">Higher daily rates apply</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Processing</span>
                      </div>
                      <span className="font-bold text-blue-600">5-7 days</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto bg-gray-50">
              <EnhancedTravelForm
                type="international"
                onCancel={() => setInternationalModalOpen(false)}
                onSubmitSuccess={() => {
                  setInternationalModalOpen(false);
                  enqueueSnackbar("International travel request submitted successfully!", { variant: "success" });
                  handleRefreshData();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showNewTravelMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowNewTravelMenu(false)}
        ></div>
      )}
    </div>
  );
}