// EnhancedTravelForm.jsx
"use client"

import { useState, useEffect } from "react"
import {
  MapPin,
  Wallet,
  Receipt,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  X,
  Clock,
  AlertCircle,
  Plus,
  Save,
  Loader,
  Upload,
  Download,
  Edit,
  Eye,
  ChevronRight,
  Plane,
  Globe,
  Hotel,
  Utensils,
  Car,
} from "lucide-react"
import { useSnackbar } from "notistack"
import axios from "axios"

const EnhancedTravelForm = ({
  type,
  formData,
  formTab,
  onFormDataChange,
  onFormTabChange,
  onCancel,
  onSubmit,
  budgetData,
  departmentBudgets,
  isSubmitting,
  onSubmitSuccess
}) => {
  const [estimatedBreakdown, setEstimatedBreakdown] = useState({
    transport: 0,
    accommodation: 0,
    meals: 0,
    other: 0,
    total: 0,
  })

  const [budgetValidation, setBudgetValidation] = useState({
    isValid: true,
    warnings: [],
    exceedsLimit: false,
  })

  const { enqueueSnackbar } = useSnackbar()

  // Update the parent state when form data changes
  useEffect(() => {
    onFormDataChange(formData)
  }, [formData, onFormDataChange])

  // Update the parent state when tab changes
  useEffect(() => {
    onFormTabChange(formTab)
  }, [formTab, onFormTabChange])

  // Calculate cost breakdown
  useEffect(() => {
    const transport = Number.parseFloat(formData.transportCost) || 0
    const accommodation = Number.parseFloat(formData.accommodationCost) || 0
    const meals = Number.parseFloat(formData.mealsCost) || 0
    const other = Number.parseFloat(formData.otherCosts) || 0
    const total = transport + accommodation + meals + other

    setEstimatedBreakdown({ transport, accommodation, meals, other, total })
    onFormDataChange({ ...formData, estimatedCost: total.toString() })

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
  }, [
    formData.transportCost,
    formData.accommodationCost,
    formData.mealsCost,
    formData.otherCosts,
    budgetData,
    formData,
    onFormDataChange,
  ])

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const payload = {
        ...formData,
        travelType: type,
        status: "pending",
        estimatedCost: estimatedBreakdown.total,
        actualCost: 0,
        receipts: formData.receipts.map((file) => file.name),
      }

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/travel-requests`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 201) {
        enqueueSnackbar(`${type === "local" ? "Local" : "International"} travel request submitted successfully!`, {
          variant: "success",
        })
        onSubmitSuccess?.()
      }
    } catch (error) {
      console.error("Error submitting travel request:", error)
      enqueueSnackbar(`Failed to submit travel request: ${error.message}`, {
        variant: "error",
      })
    }
  }

  const handleInputChange = useCallback((e) => {
  const { name, value } = e.target;
  onFormDataChange(prev => ({
    ...prev,
    [name]: value
  }));
}, [onFormDataChange]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    onFormDataChange({
      ...formData,
      receipts: [...formData.receipts, ...files],
    })
  }

  const removeFile = (index) => {
    onFormDataChange({
      ...formData,
      receipts: formData.receipts.filter((_, i) => i !== index),
    })
  }

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
            onClick={() => onFormTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium text-sm transition-colors ${
              formTab === tab.id
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
      {formTab === "details" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Destination *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder={type === "international" ? "e.g., London, UK" : "e.g., Lilongwe, Malawi"}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Purpose of Travel *</label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
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
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate || new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
      {formTab === "budget" && (
        <div className="space-y-4">
          {/* Compact Budget Status */}
          {budgetData && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
              <h4 className="font-bold text-blue-900 mb-2 text-sm">Current Travel Budget Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-white/50">
                  <div className="flex items-center gap-1.5">
                    <Target size={14} className="text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">Total Budget</span>
                  </div>
                  <span className="font-bold text-gray-900 text-xs">
                    MWK {budgetData.totalBudget.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-white/50">
                  <div className="flex items-center gap-1.5">
                    <Wallet size={14} className="text-emerald-600" />
                    <span className="text-xs font-medium text-gray-700">Remaining</span>
                  </div>
                  <span className="font-bold text-emerald-600 text-xs">
                    MWK {budgetData.remaining.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-white/50">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-purple-600" />
                    <span className="text-xs font-medium text-gray-700">Utilization</span>
                  </div>
                  <span className="font-bold text-purple-600 text-xs">{budgetData.utilization.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Compact Cost Breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-3">
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Estimated Costs Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Transport Costs (MWK)</label>
                <input
                  type="number"
                  name="transportCost"
                  value={formData.transportCost}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Accommodation Costs (MWK)</label>
                <input
                  type="number"
                  name="accommodationCost"
                  value={formData.accommodationCost}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Meals & Allowances (MWK)</label>
                <input
                  type="number"
                  name="mealsCost"
                  value={formData.mealsCost}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Other Expenses (MWK)</label>
                <input
                  type="number"
                  name="otherCosts"
                  value={formData.otherCosts}
                  onChange={handleInputChange}
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
      {formTab === "expenses" && (
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
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label
                htmlFor="file-upload"
                className="mt-2 px-3 py-1.5 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors text-xs cursor-pointer inline-block"
              >
                Choose Files
              </label>
            </div>
            {formData.receipts.length > 0 && (
              <div className="mt-3 space-y-2">
                <h5 className="text-xs font-medium text-gray-700">Selected Files:</h5>
                <ul className="space-y-1">
                  {formData.receipts.map((file, index) => (
                    <li key={index} className="flex items-center justify-between text-xs">
                      <span className="truncate max-w-[180px]">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
          onClick={onCancel}
          className="px-4 py-2 text-xs text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 text-xs bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={budgetValidation.exceedsLimit || isSubmitting}
            className={`px-4 py-2 text-xs rounded-2xl font-medium transition-colors flex items-center gap-1 ${
              budgetValidation.exceedsLimit || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <Loader size={12} className="animate-spin" />
            ) : (
              <>
                <Save size={12} />
                Submit Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EnhancedTravelForm