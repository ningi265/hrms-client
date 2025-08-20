"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ChevronRight,
  Clock,
  Globe,
  BarChart3,
  MapPin,
  Plane,
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
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
  ArrowUp,
  Eye,
  Download,
  Upload,
  Car,
  Hotel,
  Utensils,
  Target,
  Edit,
  RefreshCw,
  Loader,
  Receipt,
  Save,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"
import axios from "axios"
import { useSnackbar } from "notistack"

// API configuration
const API_BASE_URL =
  process.env.REACT_APP_ENV === "production"
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV

export default function TravelDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showNewTravelMenu, setShowNewTravelMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    stats: null,
    quickLinks: null,
    loading: false,
  })
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [totalPending, setTotalPending] = useState(0)
  const [pendingLocal, setPendingLocal] = useState(0)
  const [pendingInternational, setPendingInternational] = useState(0)
  const [localModalOpen, setLocalModalOpen] = useState(false)
  const [internationalModalOpen, setInternationalModalOpen] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [localFormDraft, setLocalFormDraft] = useState(null);
const [internationalFormDraft, setInternationalFormDraft] = useState(null);

  // Dynamic budget and travel data states
  const [budgetData, setBudgetData] = useState(null)
  const [departmentBudgets, setDepartmentBudgets] = useState([])
  const [travelExpenses, setTravelExpenses] = useState([])
  const [recentTrips, setRecentTrips] = useState([])
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(false)
  const [isLoadingTrips, setIsLoadingTrips] = useState(false)
  const [budgetError, setBudgetError] = useState(null)
  const [travelStats, setTravelStats] = useState({
    totalTrips: 0,
    totalExpenses: 0,
    averageExpense: 0,
    budgetUtilization: 0,
  })

  // Financial reconciliation states
  const [financialData, setFinancialData] = useState({
    totalAllowances: 0,
    totalExpenses: 0,
    pendingReimbursements: 0,
    currentBalance: 0,
    monthlyAllowances: 0,
    monthlyExpenses: 0,
  })
  const [expenseCategories, setExpenseCategories] = useState([
    { category: "Transport", amount: 0, percentage: 45, color: "#3B82F6" },
    { category: "Accommodation", amount: 0, percentage: 30, color: "#10B981" },
    { category: "Meals", amount: 0, percentage: 15, color: "#F59E0B" },
    { category: "Other", amount: 0, percentage: 10, color: "#EF4444" },
  ])
  const [pendingClaims, setPendingClaims] = useState([])
  const [selectedFormTab, setSelectedFormTab] = useState("details") 

  const backendUrl = process.env.REACT_APP_BACKEND_URL

const loadDraft = (type) => {
  const draftKey = type === 'local' ? 'localTravelDraft' : 'internationalTravelDraft';
  const draft = localStorage.getItem(draftKey);
  return draft ? JSON.parse(draft) : {
    destination: "",
    purpose: "",
    startDate: "",
    endDate: "",
    estimatedCost: "",
    accommodationCost: "",
    transportCost: "",
    mealsCost: "",
    otherCosts: "",
    budgetCode: "",
    department: "",
    urgency: "medium",
    receipts: [],
    meansOfTravel: "company", 
  };
};

const clearDraft = (type) => {
  const draftKey = type === 'local' ? 'localTravelDraft' : 'internationalTravelDraft';
  localStorage.removeItem(draftKey);
};

  // Compact Metric Card Component (styled like departments.jsx)
  const MetricCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    subtitle,
    prefix = "",
    suffix = "",
    size = "normal",
    onClick,
  }) => {
    const cardClass = size === "large" ? "col-span-2" : ""
    const valueSize = size === "large" ? "text-2xl" : "text-base"

    return (
      <div
        className={`bg-white rounded-2xl border border-gray-200 p-1.5 hover:shadow-sm transition-shadow cursor-pointer ${cardClass}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-1">
          <div
            className={`p-1.5 rounded-xl ${
              color === "blue"
                ? "bg-blue-50"
                : color === "green"
                  ? "bg-emerald-50"
                  : color === "purple"
                    ? "bg-purple-50"
                    : color === "orange"
                      ? "bg-orange-50"
                      : color === "red"
                        ? "bg-red-50"
                        : "bg-gray-50"
            }`}
          >
            <Icon
              size={16}
              className={
                color === "blue"
                  ? "text-blue-600"
                  : color === "green"
                    ? "text-emerald-600"
                    : color === "purple"
                      ? "text-purple-600"
                      : color === "orange"
                        ? "text-orange-600"
                        : color === "red"
                          ? "text-red-600"
                          : "text-gray-600"
              }
            />
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              {trend > 0 ? (
                <TrendingUp size={12} className="text-emerald-500" />
              ) : (
                <TrendingDown size={12} className="text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend > 0 ? "text-emerald-500" : "text-red-500"}`}>
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`${valueSize} font-bold text-gray-900 mb-1`}>
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix}
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
    )
  }

  // Compact Travel Form Component
 const EnhancedTravelForm = ({ type, onCancel, onSubmitSuccess }) => {
  const [formData, setFormData] = useState(() => loadDraft(type));
  const [estimatedBreakdown, setEstimatedBreakdown] = useState({
    transport: 0,
    accommodation: 0,
    meals: 0,
    other: 0,
    total: 0,
  });

  const [budgetValidation, setBudgetValidation] = useState({
    isValid: true,
    warnings: [],
    exceedsLimit: false,
  });

  const saveDraft = (type, formData) => {
  const draftKey = type === 'local' ? 'localTravelDraft' : 'internationalTravelDraft';
  localStorage.setItem(draftKey, JSON.stringify(formData));
  enqueueSnackbar('Draft saved successfully!', { variant: 'success' });
};

 const handleSaveDraft = () => {
    saveDraft(type, formData);
  };

 const handleSubmitSuccess = async () => {
  try {
    // Submit the form data to the backend
    await submitTravelRequest(formData, type);
    
    // Clear the draft
    clearDraft(type);
    
    // Show success notification
    enqueueSnackbar(`${type === 'local' ? 'Local' : 'International'} travel request submitted successfully!`, { 
      variant: 'success' 
    });
    
    // Refresh data and close modal
    handleRefreshData();
    onCancel();
    
    // Call the success callback
    onSubmitSuccess();
  } catch (error) {
    enqueueSnackbar(`Failed to submit travel request: ${error.message}`, { 
      variant: 'error' 
    });
  }
};


    const handleCancel = () => {
    if (window.confirm('Do you want to save this as a draft before closing?')) {
      saveDraft(type, formData);
    } else {
      clearDraft(type);
    }
    onCancel();
  };

   useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(type, formData);
    }, 500); // Debounce to avoid too frequent saves
    
    return () => clearTimeout(timer);
  }, [formData, type]);


    // Calculate cost breakdown
    useEffect(() => {
      const transport = Number.parseFloat(formData.transportCost) || 0
      const accommodation = Number.parseFloat(formData.accommodationCost) || 0
      const meals = Number.parseFloat(formData.mealsCost) || 0
      const other = Number.parseFloat(formData.otherCosts) || 0
      const total = transport + accommodation + meals + other

      setEstimatedBreakdown({ transport, accommodation, meals, other, total })
      setFormData((prev) => ({ ...prev, estimatedCost: total.toString() }))

      // Validate against budget
      if (budgetData && total > 0) {
        const exceedsRemaining = total > budgetData.remaining
        const highPercentage = total / budgetData.remaining > 0.3

        setBudgetValidation({
          isValid: !exceedsRemaining,
          warnings: [
            ...(exceedsRemaining ? ["This request exceeds your remaining travel budget"] : []),
            ...(highPercentage && !exceedsRemaining ? ["This request uses more than 30% of remaining budget"] : []),
          ],
          exceedsLimit: exceedsRemaining,
        })
      }
    }, [formData.transportCost, formData.accommodationCost, formData.mealsCost, formData.otherCosts, budgetData])

    return (
      <div className="space-y-4">
        {/* Compact Form Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: "details", label: "Trip Details", icon: MapPin },
            { id: "budget", label: "Budget & Costs", icon: Wallet },
            { id: "expenses", label: "Expense Planning", icon: Receipt },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFormTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 font-medium text-sm transition-colors ${
                selectedFormTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Trip Details Tab */}
        {selectedFormTab === "details" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Destination *</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={type === "international" ? "e.g., London, UK" : "e.g., Lilongwe, Malawi"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Purpose of Travel *</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  min={formData.startDate || new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Department *</label>
              <select
  value={formData.department}
  onChange={(e) => {
    const selectedDept = departmentBudgets.find(
      (dept) => dept.name === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      department: e.target.value,
      budgetCode: selectedDept?.departmentCode || "" 
    }));
  }}
>
  <option value="">Select department</option>
  {departmentBudgets.map((dept) => (
    <option key={dept._id} value={dept.name}>
      {dept.name}
    </option>
  ))}
</select>

              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority Level</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData((prev) => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low (2-4 weeks notice)</option>
                  <option value="medium">Medium (1-2 weeks notice)</option>
                  <option value="high">High (Urgent - less than 1 week)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Means of Travel *</label>
               <select
  value={formData.meansOfTravel}
  onChange={(e) => setFormData((prev) => ({ ...prev, meansOfTravel: e.target.value }))}
  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
>
  <option value="">Select means</option>
  <option value="company">Company Car</option>
  <option value="own">Own Car</option>
  <option value="rental">Rental</option>
  <option value="public">Public Transport</option>
  <option value="other">Other</option>
</select>
              </div>
            </div>
          </div>
        )}

        {/* Budget & Costs Tab */}
        {selectedFormTab === "budget" && (
          <div className="space-y-4">
            {/* Compact Cost Breakdown */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3">
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Estimated Costs Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Transport Costs (MWK)</label>
                  <input
                    type="number"
                    value={formData.transportCost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, transportCost: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Accommodation Costs (MWK)</label>
                  <input
                    type="number"
                    value={formData.accommodationCost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accommodationCost: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Meals & Allowances (MWK)</label>
                  <input
                    type="number"
                    value={formData.mealsCost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mealsCost: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Other Expenses (MWK)</label>
                  <input
                    type="number"
                    value={formData.otherCosts}
                    onChange={(e) => setFormData((prev) => ({ ...prev, otherCosts: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

              </div>

              {/* Compact Cost Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 text-sm">Cost Summary</h5>
                  <span className="text-lg font-bold text-gray-900">
                    MWK {estimatedBreakdown.total.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: "Transport", amount: estimatedBreakdown.transport, color: "#3B82F6" },
                    { label: "Accommodation", amount: estimatedBreakdown.accommodation, color: "#10B981" },
                    { label: "Meals", amount: estimatedBreakdown.meals, color: "#F59E0B" },
                    { label: "Other", amount: estimatedBreakdown.other, color: "#EF4444" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs text-gray-600">{item.label}</span>
                      </div>
                      <span className="text-xs font-medium">MWK {item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Budget Validation */}
              {budgetValidation.warnings.length > 0 && (
                <div
                  className={`mt-3 p-2 rounded-2xl border ${
                    budgetValidation.exceedsLimit ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 ${budgetValidation.exceedsLimit ? "text-red-600" : "text-amber-600"}`}
                    />
                    <div>
                      <h6
                        className={`font-medium text-xs ${
                          budgetValidation.exceedsLimit ? "text-red-900" : "text-amber-900"
                        }`}
                      >
                        Budget {budgetValidation.exceedsLimit ? "Exceeded" : "Warning"}
                      </h6>
                      <ul
                        className={`text-xs mt-1 ${budgetValidation.exceedsLimit ? "text-red-700" : "text-amber-700"}`}
                      >
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
        {selectedFormTab === "expenses" && (
          <div className="space-y-4">
            {/* Compact Document Upload */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3">
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Supporting Documents</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <div className="space-y-1">
                  <p className="text-gray-600 text-xs">Upload pre-approval documents, quotes, or itineraries</p>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB each</p>
                </div>
                <button className="mt-2 px-3 py-1.5 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors text-xs">
                  Choose Files
                </button>
              </div>
            </div>

            {/* Compact Expense Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
              <h4 className="font-bold text-blue-900 mb-2 text-sm">Travel Expense Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <h5 className="font-medium text-blue-800 mb-1">Transport</h5>
                  <ul className="text-blue-700 space-y-0.5">
                    <li>• Economy class flights only</li>
                    <li>• Book 2 weeks in advance when possible</li>
                    <li>• Use company preferred vendors</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-1">Accommodation</h5>
                  <ul className="text-blue-700 space-y-0.5">
                    <li>• Standard business hotels</li>
                    <li>• Maximum MWK 25,000/night local</li>
                    <li>• Maximum MWK 45,000/night international</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-1">Meals</h5>
                  <ul className="text-blue-700 space-y-0.5">
                    <li>• MWK 8,000/day local allowance</li>
                    <li>• MWK 15,000/day international allowance</li>
                    <li>• Keep receipts for reimbursement</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800 mb-1">Other</h5>
                  <ul className="text-blue-700 space-y-0.5">
                    <li>• Airport parking/transfers</li>
                    <li>• Business communications</li>
                    <li>• Pre-approved incidentals</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Compact Estimated Daily Allowances */}
            {formData.startDate && formData.endDate && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-3">
                <h4 className="font-bold text-green-900 mb-2 text-sm">Estimated Daily Allowances</h4>
                {(() => {
                  const startDate = new Date(formData.startDate)
                  const endDate = new Date(formData.endDate)
                  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
                  const isInternational = type === "international"
                  const dailyAllowance = isInternational ? 15000 : 8000
                  const totalAllowance = days * dailyAllowance

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-900">{days}</div>
                        <div className="text-xs text-green-700">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-900">MWK {dailyAllowance.toLocaleString()}</div>
                        <div className="text-xs text-green-700">Daily Allowance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-900">MWK {totalAllowance.toLocaleString()}</div>
                        <div className="text-xs text-green-700">Total Allowance</div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {/* Compact Form Actions */}
        <div className="flex justify-between pt-3 border-t border-gray-200">
         <button
    onClick={handleCancel}
    className="px-4 py-2 text-xs text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
  >
    Cancel
  </button>
          <div className="flex gap-2">
            <button
    type="button"
    onClick={handleSaveDraft}
    className="px-4 py-2 text-xs bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
  >
    Save Draft
  </button>
          <button
  type="button" 
  disabled={budgetValidation.exceedsLimit}
  onClick={handleSubmitSuccess}
  className={`px-4 py-2 text-xs rounded-2xl font-medium transition-colors flex items-center gap-1 ${
    budgetValidation.exceedsLimit
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-blue-600 text-white hover:bg-blue-700"
  }`}
>
  <Save size={12} />
  Submit Request
</button>
          </div>
        </div>
      </div>
    )
  }

  // Animation effect
  useEffect(() => {
    setAnimate(true)
    return () => setAnimate(false)
  }, [])

  // Fetch budget data for travel
  const fetchTravelBudgetData = async () => {
    try {
      setIsLoadingBudgets(true)
      setBudgetError(null)
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      // Fetch departments data for travel budgets
      const deptResponse = await fetch(`${API_BASE_URL}/api/departments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!deptResponse.ok) {
        throw new Error("Failed to fetch department data")
      }

      const responseData = await deptResponse.json()

      // Extract departments array from response
      const departments = responseData.data || []

      setDepartmentBudgets(departments)

      // Calculate travel budget from departments
      const totalTravelBudget = departments.reduce((sum, dept) => {
        // Use budgetInfo.total if available, otherwise fallback to budget
        const deptBudget = dept.budgetInfo?.total || dept.budget || 0
        // Assume 10% of each department's budget is allocated for travel
        return sum + deptBudget * 0.1
      }, 0)

      const totalTravelSpent = departments.reduce((sum, dept) => {
        // Use budgetInfo.actualSpending if available, otherwise fallback to actualSpending
        const deptSpent = dept.budgetInfo?.actualSpending || dept.actualSpending || 0
        // Assume 10% of spent amount is travel-related
        return sum + deptSpent * 0.1
      }, 0)

      setBudgetData({
        totalBudget: totalTravelBudget,
        totalSpent: totalTravelSpent,
        remaining: totalTravelBudget - totalTravelSpent,
        utilization: totalTravelBudget > 0 ? (totalTravelSpent / totalTravelBudget) * 100 : 0,
      })
    } catch (error) {
      console.error("Error fetching travel budget data:", error)
      setBudgetError(error.message)

      // Fallback to default budget data
      setBudgetData({
        totalBudget: 250000,
        totalSpent: 180000,
        remaining: 70000,
        utilization: 72,
      })
      setDepartmentBudgets([])
    } finally {
      setIsLoadingBudgets(false)
    }
  }

const submitTravelRequest = async (formData, type) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    let fundingCode = "";
    if (user?.department?.departmentCode) {
      fundingCode = user.department.departmentCode; 
    }
    console.log(fundingCode);

    const requestData = {
      employee: user._id,
      purpose: formData.purpose,
      departureDate: formData.startDate,
      returnDate: formData.endDate,
      location: formData.destination,
      destination: type === 'international' ? formData.destination : undefined,
      travelType: type,
      estimatedCost: formData.estimatedCost,
      meansOfTravel: formData.meansOfTravel || "company",
      currency: type === 'international' ? 'USD' : 'MWK',
      documents: formData.receipts,
      additionalNotes: "",
      fundingCodes: formData.budgetCode
    };

    const response = await axios.post(
      `${API_BASE_URL}/api/travel-requests`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting travel request:", error);
    throw error;
  }
};


  // Fetch travel requests and expenses with financial data
  const fetchTravelData = async () => {
    try {
      setIsLoadingTrips(true)
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      // Fetch travel requests
      const travelResponse = await fetch(`${API_BASE_URL}/api/travel-requests?limit=10&sort=createdAt&order=desc`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (travelResponse.ok) {
        const travelData = await travelResponse.json()
        const trips = (travelData.data || []).map((trip, index) => ({
          id: trip.requestId || `TR-2024-${String(index + 1).padStart(3, "0")}`,
          destination: trip.destination || "Unknown Destination",
          type: trip.travelType || "Local",
          status: trip.status || "pending",
          date: trip.travelDate ? new Date(trip.travelDate).toLocaleDateString() : "TBD",
          amount: `MWK ${(trip.estimatedCost || trip.totalCost || 0).toLocaleString()}`,
          purpose: trip.purpose || "Business Trip",
        }))

        setRecentTrips(trips)

        // Calculate travel statistics and financial data
        const totalTrips = trips.length
        const totalExpenses = trips.reduce((sum, trip) => {
          return sum + (Number.parseFloat(trip.amount.replace(/[MWK\s,]/g, "")) || 0)
        }, 0)

        setTravelStats({
          totalTrips,
          totalExpenses,
          averageExpense: totalTrips > 0 ? totalExpenses / totalTrips : 0,
          budgetUtilization: budgetData ? (totalExpenses / budgetData.totalBudget) * 100 : 0,
        })

        // Calculate financial reconciliation data
        const approvedTrips = trips.filter((trip) => trip.status === "approved")
        const pendingTrips = trips.filter((trip) => trip.status === "pending")

        const approvedExpenses = approvedTrips.reduce((sum, trip) => {
          return sum + (Number.parseFloat(trip.amount.replace(/[MWK\s,]/g, "")) || 0)
        }, 0)

        const pendingReimbursements = pendingTrips.reduce((sum, trip) => {
          return sum + (Number.parseFloat(trip.amount.replace(/[MWK\s,]/g, "")) || 0)
        }, 0)

        // Calculate monthly data (assume current month for demonstration)
        const currentMonthTrips = trips.filter((trip) => {
          const tripDate = new Date(trip.date)
          const currentDate = new Date()
          return tripDate.getMonth() === currentDate.getMonth() && tripDate.getFullYear() === currentDate.getFullYear()
        })

        const monthlyExpenses = currentMonthTrips.reduce((sum, trip) => {
          return sum + (Number.parseFloat(trip.amount.replace(/[MWK\s,]/g, "")) || 0)
        }, 0)

        setFinancialData({
          totalAllowances: budgetData ? budgetData.totalBudget : 250000,
          totalExpenses: approvedExpenses,
          pendingReimbursements,
          currentBalance: budgetData ? budgetData.remaining : 70000,
          monthlyAllowances: budgetData ? Math.round(budgetData.totalBudget / 12) : 20000,
          monthlyExpenses,
        })

        // Update expense categories with real data percentages
        const transportCost = Math.round(approvedExpenses * 0.45)
        const accommodationCost = Math.round(approvedExpenses * 0.3)
        const mealsCost = Math.round(approvedExpenses * 0.15)
        const otherCost = approvedExpenses - transportCost - accommodationCost - mealsCost

        setExpenseCategories([
          { category: "Transport", amount: transportCost, percentage: 45, color: "#3B82F6" },
          { category: "Accommodation", amount: accommodationCost, percentage: 30, color: "#10B981" },
          { category: "Meals", amount: mealsCost, percentage: 15, color: "#F59E0B" },
          { category: "Other", amount: otherCost, percentage: 10, color: "#EF4444" },
        ])

        // Create pending claims from pending trips
        const claims = pendingTrips.slice(0, 3).map((trip, index) => ({
          id: index + 1,
          type: `${trip.type} Travel - ${trip.destination.split(",")[0]}`,
          amount: Number.parseFloat(trip.amount.replace(/[MWK\s,]/g, "")) || 0,
          submittedDate: trip.date,
          expectedApproval: new Date(Date.now() + (3 + index) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "under_review",
          receipts: Math.floor(Math.random() * 3) + 1,
        }))

        setPendingClaims(claims)
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
            purpose: "Client Meeting",
          },
          {
            id: "TR-2024-002",
            destination: "Johannesburg, SA",
            type: "International",
            status: "approved",
            date: "Apr 20-25, 2024",
            amount: "MWK 125,000",
            purpose: "Conference",
          },
          {
            id: "TR-2024-003",
            destination: "Blantyre, Malawi",
            type: "Local",
            status: "pending",
            date: "May 10-12, 2024",
            amount: "MWK 32,000",
            purpose: "Training",
          },
        ]

        setRecentTrips(defaultTrips)
        setTravelStats({
          totalTrips: 12,
          totalExpenses: 180000,
          averageExpense: 15000,
          budgetUtilization: 72,
        })

        // Set default financial data
        setFinancialData({
          totalAllowances: 250000,
          totalExpenses: 180000,
          pendingReimbursements: 32000,
          currentBalance: 70000,
          monthlyAllowances: 20000,
          monthlyExpenses: 45000,
        })
      }
    } catch (error) {
      console.error("Error fetching travel data:", error)

      // Fallback to default travel data
      const defaultTrips = [
        {
          id: "TR-2024-001",
          destination: "Lilongwe, Malawi",
          type: "Local",
          status: "completed",
          date: "Mar 15-17, 2024",
          amount: "MWK 45,000",
          purpose: "Client Meeting",
        },
      ]

      setRecentTrips(defaultTrips)
      setTravelStats({
        totalTrips: 12,
        totalExpenses: 180000,
        averageExpense: 15000,
        budgetUtilization: 72,
      })

      setFinancialData({
        totalAllowances: 250000,
        totalExpenses: 180000,
        pendingReimbursements: 32000,
        currentBalance: 70000,
        monthlyAllowances: 20000,
        monthlyExpenses: 45000,
      })
    } finally {
      setIsLoadingTrips(false)
    }
  }

  // Fetch pending travel statistics
  const fetchPendingStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${backendUrl}/api/travel-requests/pending/stat`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data) {
        setTotalPending(response.data.totalPending || 0)
        setPendingLocal(response.data.pendingLocal || 0)
        setPendingInternational(response.data.pendingInternational || 0)
      }
    } catch (error) {
      console.error("Error fetching pending stats:", error)
      // Use fallback values
      setTotalPending(3)
      setPendingLocal(2)
      setPendingInternational(1)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchTravelBudgetData()
    fetchTravelData()
    fetchPendingStats()
  }, [])

  // Refresh all data
  const handleRefreshData = () => {
    fetchTravelBudgetData()
    fetchTravelData()
    fetchPendingStats()
  }

  // Enhanced sample data for charts with dynamic calculations
  const travelData = [
    { name: "Jan", local: 2, international: 1, total: 3 },
    { name: "Feb", local: 1, international: 0, total: 1 },
    { name: "Mar", local: 3, international: 1, total: 4 },
    { name: "Apr", local: 0, international: 2, total: 2 },
    { name: "May", local: 2, international: 0, total: 2 },
    { name: "Jun", local: 1, international: 1, total: 2 },
  ]

  // Dynamic expense data based on actual travel budget
  const expenseData = budgetData
    ? [
        {
          name: "Transport",
          value: Math.round(budgetData.totalSpent * 0.45),
          percentage: 45,
          color: "#3b82f6",
        },
        {
          name: "Accommodation",
          value: Math.round(budgetData.totalSpent * 0.3),
          percentage: 30,
          color: "#10b981",
        },
        {
          name: "Meals",
          value: Math.round(budgetData.totalSpent * 0.15),
          percentage: 15,
          color: "#f59e0b",
        },
        {
          name: "Other",
          value: Math.round(budgetData.totalSpent * 0.1),
          percentage: 10,
          color: "#ef4444",
        },
      ]
    : [
        { name: "Transport", value: 81000, percentage: 45, color: "#3b82f6" },
        { name: "Accommodation", value: 54000, percentage: 30, color: "#10b981" },
        { name: "Meals", value: 27000, percentage: 15, color: "#f59e0b" },
        { name: "Other", value: 18000, percentage: 10, color: "#ef4444" },
      ]

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-700 bg-green-50 border-green-200"
      case "approved":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={12} />
      case "approved":
        return <CheckCircle size={12} />
      case "pending":
        return <Clock size={12} />
      case "rejected":
        return <X size={12} />
      default:
        return <AlertCircle size={12} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <Plane size={20} />
                </div>
                Travel Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <Search size={16} />
              </button>
              <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                <Filter size={16} />
              </button>
              <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                <Bell size={16} />
              </button>
              <button
                onClick={handleRefreshData}
                disabled={isLoadingBudgets || isLoadingTrips}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <RefreshCw size={16} className={isLoadingBudgets || isLoadingTrips ? "animate-spin" : ""} />
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNewTravelMenu(!showNewTravelMenu)}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all text-xs font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-1.5"
              >
                <Plus size={16} />
                New Travel Request
              </button>

              {showNewTravelMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setLocalModalOpen(true)
                        setShowNewTravelMenu(false)
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <div className="p-1.5 bg-blue-100 rounded-xl">
                        <MapPin size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Local Travel</div>
                        <div className="text-xs text-gray-500">Domestic business trips</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setInternationalModalOpen(true)
                        setShowNewTravelMenu(false)
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-purple-50 rounded-xl transition-colors"
                    >
                      <div className="p-1.5 bg-purple-100 rounded-xl">
                        <Globe size={14} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">International Travel</div>
                        <div className="text-xs text-gray-500">Global business trips</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Search field */}
        {showSearch && (
          <div className="max-w-7xl mx-auto mt-3 flex items-center bg-gray-50 rounded-2xl px-3 py-2 border border-gray-200 transition-all">
            <Search size={16} className="text-gray-400" />
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

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Compact Tab Navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <div className="flex border-b border-gray-200 bg-white rounded-t-2xl">
            {["overview", "analytics", "expenses"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                  activeTab === tab ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab === "overview" && <BarChart3 size={14} className="inline mr-1.5" />}
                {tab === "analytics" && <TrendingUp size={14} className="inline mr-1.5" />}
                {tab === "expenses" && <Wallet size={14} className="inline mr-1.5" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-4">
              {/* Compact Primary Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-3 border border-blue-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-500 rounded-xl shadow-sm">
                      <Plane size={18} className="text-white" />
                    </div>
                    <div className="text-right">
                      {isLoadingTrips ? (
                        <Loader size={16} className="animate-spin text-blue-600" />
                      ) : (
                        <>
                          <div className="text-xl font-bold text-blue-900">{travelStats.totalTrips}</div>
                          <div className="text-xs text-blue-600">Total Trips</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-blue-700">
                    <ArrowUp size={12} className="mr-1" />
                    <span>+2 from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-3 border border-amber-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-amber-500 rounded-xl shadow-sm">
                      <Clock size={18} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-amber-900">{totalPending}</div>
                      <div className="text-xs text-amber-600">Pending Approvals</div>
                    </div>
                  </div>
                  <div className="text-xs text-amber-700">
                    {pendingLocal} local, {pendingInternational} international
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-3 border border-green-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-green-500 rounded-xl shadow-sm">
                      <Wallet size={18} className="text-white" />
                    </div>
                    <div className="text-right">
                      {isLoadingBudgets ? (
                        <Loader size={16} className="animate-spin text-green-600" />
                      ) : (
                        <>
                          <div className="text-xl font-bold text-green-900">
                            MWK {financialData.totalExpenses.toLocaleString()}
                          </div>
                          <div className="text-xs text-green-600">Total Expenses</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-green-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: animate ? `${budgetData ? budgetData.utilization : 72}%` : "0%" }}
                      ></div>
                    </div>
                    <div className="text-xs text-green-700">
                      {budgetData ? budgetData.utilization.toFixed(1) : "72"}% of annual budget
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-3 border border-purple-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-purple-500 rounded-xl shadow-sm">
                      <DollarSign size={18} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-900">
                        MWK {financialData.currentBalance.toLocaleString()}
                      </div>
                      <div className="text-xs text-purple-600">Available Balance</div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-700">Current allocation remaining</div>
                </div>
              </div>

              {/* Compact Financial Reconciliation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
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

              {/* Compact Budget Status Alert */}
              {budgetData && budgetData.utilization > 80 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-amber-100 rounded-xl">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-amber-900 mb-1 text-sm">
                        Budget Alert - Immediate Attention Required
                      </h4>
                      <p className="text-amber-800 mb-2 text-xs">
                        You've used {budgetData.utilization.toFixed(1)}% of your annual travel budget. Consider
                        reviewing upcoming travel plans to stay within budget limits.
                      </p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-colors font-medium text-xs">
                          Review Budget
                        </button>
                        <button className="px-3 py-1.5 bg-white text-amber-600 border border-amber-600 rounded-2xl hover:bg-amber-50 transition-colors font-medium text-xs">
                          View Guidelines
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Compact Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Expense Categories */}
                <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <PieChart className="w-4 h-4 text-blue-500" />
                    <h3 className="font-bold text-gray-900 text-sm">Expense Breakdown</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <RechartsPieChart>
                      <Pie
                        data={expenseCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-3">
                    {expenseCategories.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-gray-600">{item.category}</span>
                        </div>
                        <span className="font-medium">MWK {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Travel Type Distribution */}
                <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-purple-500" />
                    <h3 className="font-bold text-gray-900 text-sm">Travel Types</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-gray-700 font-medium text-xs">Local Travel</span>
                        </div>
                        <span className="text-gray-900 font-bold text-xs">
                          {recentTrips.filter((trip) => trip.type === "Local").length} trips
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: animate ? "75%" : "0%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="text-gray-700 font-medium text-xs">International</span>
                        </div>
                        <span className="text-gray-900 font-bold text-xs">
                          {recentTrips.filter((trip) => trip.type === "International").length} trips
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000 delay-300"
                          style={{ width: animate ? "25%" : "0%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <h4 className="font-medium text-gray-900 mb-2 text-xs">Top Destinations</h4>
                      <div className="space-y-2">
                        {recentTrips.slice(0, 3).map((trip, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-1.5">
                              {trip.type === "International" ? (
                                <Globe size={12} className="text-purple-500" />
                              ) : (
                                <MapPin size={12} className="text-blue-500" />
                              )}
                              <span className="text-gray-700 text-xs">{trip.destination.split(",")[0]}</span>
                            </div>
                            <span className="text-gray-900 font-medium text-xs">{trip.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Claims */}
                <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-gray-900 text-sm">Pending Claims</h3>
                  </div>
                  <div className="space-y-2">
                    {pendingClaims.length > 0 ? (
                      pendingClaims.map((claim, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-xl border-l-4 transition-all hover:shadow-sm ${
                            claim.status === "approved"
                              ? "bg-green-50 border-green-500"
                              : claim.status === "under_review"
                                ? "bg-blue-50 border-blue-500"
                                : "bg-yellow-50 border-yellow-500"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-900 text-xs">{claim.type}</h4>
                            <span className="text-xs font-bold text-gray-900">MWK {claim.amount.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">Submitted: {claim.submittedDate}</p>
                          <div className="flex justify-between items-center">
                            <span
                              className={`px-2 py-0.5 rounded-full font-medium text-xs ${
                                claim.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : claim.status === "under_review"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {claim.status.replace("_", " ")}
                            </span>
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <Receipt size={10} />
                              <span>{claim.receipts} receipts</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <CheckCircle size={24} className="mx-auto text-green-500 mb-2" />
                        <p className="text-gray-600 text-xs">No pending claims</p>
                        <p className="text-gray-500 text-xs">All expenses are up to date</p>
                      </div>
                    )}
                  </div>

                  {pendingClaims.length > 0 && (
                    <button className="w-full mt-3 px-3 py-1.5 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-medium text-xs">
                      View All Claims
                    </button>
                  )}
                </div>
              </div>

              {/* Compact Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <Link
                  to="/travel/requests"
                  className="group bg-white rounded-2xl p-3 border border-gray-200 hover:shadow-md transition-all hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors shadow-sm">
                        <FileText size={18} className="text-blue-600" />
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Manage Requests</h3>
                    <p className="text-gray-600 text-xs mb-2">
                      View and manage all your travel requests with enhanced tracking
                    </p>
                    <div className="flex items-center space-x-1.5">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        {travelStats.totalTrips} total
                      </span>
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        {totalPending} pending
                      </span>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => setLocalModalOpen(true)}
                  className="group bg-white rounded-2xl p-3 border border-gray-200 hover:shadow-md transition-all hover:scale-105 relative overflow-hidden text-left"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors shadow-sm">
                        <Plus size={18} className="text-green-600" />
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">New Travel Request</h3>
                    <p className="text-gray-600 text-xs mb-2">Submit new travel requests with budget validation</p>
                    <div className="flex items-center space-x-1.5">
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        Real-time budget check
                      </span>
                    </div>
                  </div>
                </button>

                <Link
                  to="/travel/expenses"
                  className="group bg-white rounded-2xl p-3 border border-gray-200 hover:shadow-md transition-all hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors shadow-sm">
                        <Receipt size={18} className="text-purple-600" />
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Financial Reconciliation</h3>
                    <p className="text-gray-600 text-xs mb-2">Track expenses and manage reimbursements</p>
                    <div className="flex items-center space-x-1.5">
                      <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        MWK {financialData.pendingReimbursements.toLocaleString()} pending
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Compact Recent Travel Activity */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Activity size={16} className="text-blue-500" />
                      Recent Travel Activity
                    </h3>
                    <div className="flex items-center gap-2">
                      {isLoadingTrips && <Loader size={14} className="animate-spin text-blue-500" />}
                      <button
                        onClick={fetchTravelData}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 px-2 py-1 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <RefreshCw size={12} />
                        Refresh
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">View All</button>
                    </div>
                  </div>
                </div>

                {isLoadingTrips ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-600 text-sm">Loading travel activity...</span>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {recentTrips.slice(0, 5).map((trip) => (
                      <div
                        key={trip.id}
                        className="p-3 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-sm">
                              {trip.type === "International" ? (
                                <Globe size={16} className="text-purple-600" />
                              ) : (
                                <MapPin size={16} className="text-blue-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{trip.destination}</h4>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="text-xs text-gray-500">{trip.date}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-500">{trip.purpose}</span>
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                    trip.type === "International"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {trip.type}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="font-medium text-gray-900 text-sm">{trip.amount}</div>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}
                              >
                                {getStatusIcon(trip.status)}
                                <span className="ml-1 capitalize">{trip.status}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                <Eye size={14} />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <MoreVertical size={14} />
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
            <div className="p-4">
              {/* Compact Travel History Chart */}
              <div className="bg-white rounded-2xl border border-gray-200 p-3 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 size={20} className="text-blue-500" />
                      Travel History
                    </h3>
                    <p className="text-gray-600 mt-0.5 text-xs">Your travel patterns over the last 6 months</p>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button className="px-2 py-1 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-xs font-medium">
                      Local
                    </button>
                    <button className="px-2 py-1 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors text-xs font-medium">
                      International
                    </button>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={travelData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Bar dataKey="local" name="Local Trips" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="international" name="International Trips" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Compact Travel Type Breakdown */}
                <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <PieChart size={16} className="text-green-500" />
                    Travel by Type
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-gray-700 font-medium text-xs">Local Travel</span>
                        </div>
                        <span className="text-gray-900 font-bold text-xs">
                          {recentTrips.filter((trip) => trip.type === "Local").length} trips (75%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: animate ? "75%" : "0%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="text-gray-700 font-medium text-xs">International Travel</span>
                        </div>
                        <span className="text-gray-900 font-bold text-xs">
                          {recentTrips.filter((trip) => trip.type === "International").length} trips (25%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000 delay-300"
                          style={{ width: animate ? "25%" : "0%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <h4 className="font-medium text-gray-900 mb-2 text-xs">Top Destinations</h4>
                      <div className="space-y-2">
                        {recentTrips.slice(0, 3).map((trip, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                            <span className="text-gray-700 text-xs">{trip.destination.split(",")[0]}</span>
                            <span className="text-gray-900 font-medium text-xs">1 trip</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Expense Breakdown */}
                <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign size={16} className="text-amber-500" />
                    Expense Breakdown
                  </h3>
                  <div className="space-y-4">
                    {expenseData.map((expense, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: expense.color }}></div>
                            <span className="text-gray-700 font-medium text-xs">{expense.name}</span>
                          </div>
                          <span className="text-gray-900 font-bold text-xs">
                            MWK {expense.value.toLocaleString()} ({expense.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-1000"
                            style={{
                              backgroundColor: expense.color,
                              width: animate ? `${expense.percentage}%` : "0%",
                              transitionDelay: `${index * 200}ms`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                        <div>
                          <span className="text-green-900 font-bold text-sm">Total Expenses</span>
                          <p className="text-green-700 text-xs">Current year</p>
                        </div>
                        <span className="text-lg font-bold text-green-900">
                          MWK {budgetData ? budgetData.totalSpent.toLocaleString() : "180,000"}
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
            <div className="p-4">
              {/* Compact Expense Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-3 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-500 rounded-xl">
                      <Plane size={16} className="text-white" />
                    </div>
                    <TrendingUp size={12} className="text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-blue-900 mb-0.5">
                    MWK {expenseData[0]?.value.toLocaleString() || "81,000"}
                  </div>
                  <div className="text-xs text-blue-600">Transport Costs</div>
                  <div className="text-xs text-blue-500 mt-1">{expenseData[0]?.percentage || 45}% of total</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-3 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-green-500 rounded-xl">
                      <Hotel size={16} className="text-white" />
                    </div>
                    <TrendingUp size={12} className="text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-green-900 mb-0.5">
                    MWK {expenseData[1]?.value.toLocaleString() || "54,000"}
                  </div>
                  <div className="text-xs text-green-600">Accommodation</div>
                  <div className="text-xs text-green-500 mt-1">{expenseData[1]?.percentage || 30}% of total</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-3 border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-amber-500 rounded-xl">
                      <Utensils size={16} className="text-white" />
                    </div>
                    <TrendingDown size={12} className="text-amber-600" />
                  </div>
                  <div className="text-lg font-bold text-amber-900 mb-0.5">
                    MWK {expenseData[2]?.value.toLocaleString() || "27,000"}
                  </div>
                  <div className="text-xs text-amber-600">Meals</div>
                  <div className="text-xs text-amber-500 mt-1">{expenseData[2]?.percentage || 15}% of total</div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-3 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-red-500 rounded-xl">
                      <Car size={16} className="text-white" />
                    </div>
                    <TrendingUp size={12} className="text-red-600" />
                  </div>
                  <div className="text-lg font-bold text-red-900 mb-0.5">
                    MWK {expenseData[3]?.value.toLocaleString() || "18,000"}
                  </div>
                  <div className="text-xs text-red-600">Other</div>
                  <div className="text-xs text-red-500 mt-1">{expenseData[3]?.percentage || 10}% of total</div>
                </div>
              </div>

              {/* Compact Expense Reports Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <FileText size={16} className="text-purple-500" />
                      Recent Expense Reports
                    </h3>
                    <div className="flex items-center space-x-1.5">
                      <button className="px-2 py-1 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-xs font-medium flex items-center gap-1">
                        <Upload size={12} />
                        Upload Receipt
                      </button>
                      <button className="px-2 py-1 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-xs font-medium flex items-center gap-1">
                        <Plus size={12} />
                        New Report
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Report ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trip
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentTrips.slice(0, 3).map((trip, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-xs font-medium text-gray-900">EXP-{trip.id.split("-")[2]}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-xs text-gray-900">
                              {trip.destination} - {trip.purpose}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-xs font-medium text-gray-900">{trip.amount}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}
                            >
                              {getStatusIcon(trip.status)}
                              <span className="ml-1">{trip.status}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-xs text-gray-500">{trip.date}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                <Eye size={12} />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                                <Download size={12} />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                <Edit size={12} />
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
      </div>

      {/* Compact Modals */}

      {/* Local Travel Modal */}
      {localModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                    <MapPin size={18} />
                  </div>
                  New Local Travel Request
                </h2>
                <button
                  onClick={() => setLocalModalOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Compact Budget Summary Banner */}
              {budgetData && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Target size={14} className="text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">Total Budget</span>
                      </div>
                      <span className="font-bold text-gray-900 text-xs">
                        MWK {budgetData.totalBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Wallet size={14} className="text-emerald-600" />
                        <span className="text-xs font-medium text-gray-700">Remaining</span>
                      </div>
                      <span className="font-bold text-emerald-600 text-xs">
                        MWK {budgetData.remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-purple-600" />
                        <span className="text-xs font-medium text-gray-700">Utilization</span>
                      </div>
                      <span className="font-bold text-purple-600 text-xs">{budgetData.utilization.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 max-h-[75vh] overflow-y-auto">
              <EnhancedTravelForm
                type="local"
                onCancel={() => setLocalModalOpen(false)}
                onSubmitSuccess={() => {
                  setLocalModalOpen(false)
                  enqueueSnackbar("Local travel request submitted successfully!", { variant: "success" })
                  handleRefreshData()
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* International Travel Modal */}
      {internationalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white">
                    <Globe size={18} />
                  </div>
                  New International Travel Request
                </h2>
                <button
                  onClick={() => setInternationalModalOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Compact Budget Summary Banner */}
              {budgetData && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Target size={14} className="text-purple-600" />
                        <span className="text-xs font-medium text-gray-700">Total Budget</span>
                      </div>
                      <span className="font-bold text-gray-900 text-xs">
                        MWK {budgetData.totalBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-white/50">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-600" />
                      <div className="flex-1">
                        <span className="text-xs font-medium text-gray-700">Int'l Allowance</span>
                        <div className="text-xs text-amber-600">Higher daily rates apply</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">Processing</span>
                      </div>
                      <span className="font-bold text-blue-600 text-xs">5-7 days</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 max-h-[75vh] overflow-y-auto">
              <EnhancedTravelForm
                type="international"
                onCancel={() => setInternationalModalOpen(false)}
                onSubmitSuccess={() => {
                  setInternationalModalOpen(false)
                  enqueueSnackbar("International travel request submitted successfully!", { variant: "success" })
                  handleRefreshData()
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showNewTravelMenu && <div className="fixed inset-0 z-30" onClick={() => setShowNewTravelMenu(false)}></div>}
    </div>
  )
}
