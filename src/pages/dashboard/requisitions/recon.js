import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Paperclip,
  CheckCircle,
  Receipt,
  Calendar,
  MapPin,
  DollarSign,
  User,
  FileText,
  Upload,
  AlertCircle,
  Info,
  Clock,
  TrendingUp,
  Activity,
  Plane,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../../authcontext/authcontext';

// Custom Components
const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
  );
};

const Alert = ({ type = "info", title, children, onClose }) => {
  const typeClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const iconClasses = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500"
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className={`p-4 rounded-lg border ${typeClasses[type]} mb-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${iconClasses[type]}`} />
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, type = "default" }) => {
  const getColors = (status) => {
    switch (status) {
      case "changes_requested": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getColors(status)}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, subtitle, prefix = "", suffix = "" }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
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
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

export default function EmployeeReconciliationPage() {
  const { user } = useAuth(); // Changed from currentUser to user to match the other component
  const [travelRequests, setTravelRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [expenses, setExpenses] = useState([
    { id: Date.now(), category: '', amount: '', description: '', receipt: null }
  ]);
  const [tripReport, setTripReport] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  
  const expenseCategories = [
    'Transportation',
    'Meals',
    'Lodging',
    'Conference Fees',
    'Supplies',
    'Other'
  ];

  useEffect(() => {
    const fetchTravelRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!user || !user._id) {
          setError('User not authenticated');
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setIsLoading(false);
          return;
        }

        console.log('Fetching travel requests for user:', user._id);
        
        const response = await fetch(`${backendUrl}/api/travel-requests/employee/processed`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);
        
        // Filter requests for current user that need reconciliation
        const requestsNeedingReconciliation = data.filter(request => {
          console.log('Checking request:', request._id, 'Employee ID:', request.employee?._id, 'Current User ID:', user.id);
          
          // Must be processed by finance
          if (request.financeStatus !== 'processed') {
            console.log('Request not processed by finance:', request._id);
            return false;
          }
          
          // Must be this user's request
          if (request.employee?._id !== user.id) {
            console.log('Request not for current user:', request._id);
            return false;
          }
          
          // Check reconciliation status
          if (!request.reconciliation) {
            console.log('No reconciliation exists for request:', request._id);
            return true; // No reconciliation exists
          }
          
          if (request.reconciliation.status === 'changes_requested') {
            console.log('Changes requested for request:', request._id);
            return true; // Changes needed
          }
          
          console.log('Request does not need reconciliation:', request._id);
          return false;
        });
        
        console.log('Requests needing reconciliation:', requestsNeedingReconciliation);
        
        setTravelRequests(requestsNeedingReconciliation);
        if (requestsNeedingReconciliation.length > 0) {
          setSelectedRequest(requestsNeedingReconciliation[0]);
        }
      } catch (err) {
        console.error('Error fetching travel requests:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelRequests();
  }, [user, backendUrl]);

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { id: Date.now(), category: '', amount: '', description: '', receipt: null }]);
  };

  const handleRemoveExpense = (id) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const handleExpenseChange = (id, field, value) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const handleReceiptChange = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      handleExpenseChange(id, 'receipt', file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRequest) {
      setError('No travel request selected');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('tripReport', tripReport);
      
      expenses.forEach((expense, index) => {
        formData.append(`expenses[${index}][category]`, expense.category);
        formData.append(`expenses[${index}][amount]`, expense.amount);
        formData.append(`expenses[${index}][description]`, expense.description);
        if (expense.receipt) {
          formData.append(`expenses[${index}][receipt]`, expense.receipt);
        }
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/travel-requests/${selectedRequest._id}/reconcile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setSuccess(true);
      // Reset form
      setExpenses([{ id: Date.now(), category: '', amount: '', description: '', receipt: null }]);
      setTripReport('');
      
      // Refresh the list
      const updatedRequests = travelRequests.filter(req => req._id !== selectedRequest._id);
      setTravelRequests(updatedRequests);
      setSelectedRequest(updatedRequests[0] || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => {
      return total + (parseFloat(expense.amount) || 0);
    }, 0).toFixed(2);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading travel requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Travel Expense Reconciliation</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Active reconciliation</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{travelRequests.length} pending reconciliation{travelRequests.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-100">
            <nav className="flex">
              <button
                onClick={() => handleTabChange(0)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                  tabValue === 0
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Receipt size={16} />
                New Reconciliation
              </button>
              <button
                onClick={() => handleTabChange(1)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                  tabValue === 1
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CheckCircle size={16} />
                Reconciliation History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {tabValue === 0 ? (
              <>
                {error && (
                  <Alert type="error" title="Error">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert type="success" title="Success">
                    Reconciliation submitted successfully!
                  </Alert>
                )}

                {travelRequests.length === 0 ? (
                  <Alert type="info" title="No Reconciliations Needed">
                    No travel requests requiring reconciliation found. All your trips are up to date!
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    {/* Travel Request Selection */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Travel Request</h3>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Travel Request</label>
                        <select
                          value={selectedRequest?._id || ''}
                          onChange={(e) => {
                            const selected = travelRequests.find(req => req._id === e.target.value);
                            setSelectedRequest(selected);
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select a travel request...</option>
                          {travelRequests.map(request => (
                            <option key={request._id} value={request._id}>
                              {request.purpose} - {new Date(request.departureDate).toLocaleDateString()} to {new Date(request.returnDate).toLocaleDateString()}
                              {request.reconciliation?.status === 'changes_requested' ? ' (Changes Requested)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedRequest && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                              title="Trip Purpose"
                              value={selectedRequest.purpose}
                              icon={Plane}
                              color="blue"
                            />
                            <MetricCard
                              title="Destination"
                              value={selectedRequest.location}
                              icon={MapPin}
                              color="green"
                            />
                            <MetricCard
                              title="Duration"
                              value={`${Math.ceil((new Date(selectedRequest.returnDate) - new Date(selectedRequest.departureDate)) / (1000 * 60 * 60 * 24))} days`}
                              icon={Calendar}
                              color="purple"
                            />
                            <MetricCard
                              title="Per Diem"
                              value={formatCurrency(selectedRequest.perDiemAmount)}
                              icon={DollarSign}
                              color="orange"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">{new Date(selectedRequest.departureDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">{selectedRequest.paymentMethod || 'None specified'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">{new Date(selectedRequest.returnDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              {selectedRequest.reconciliation?.status === 'changes_requested' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                  <div className="p-3 bg-yellow-50 rounded-lg">
                                    <StatusBadge status="changes_requested" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedRequest && (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Trip Report */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Trip Report</h3>
                          </div>
                          <textarea
                            placeholder="Provide a detailed summary of your trip, including meetings attended, objectives achieved, and any follow-up actions required..."
                            rows={6}
                            value={tripReport}
                            onChange={(e) => setTripReport(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Expenses */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Receipt className="w-5 h-5 text-blue-600" />
                              <h3 className="text-lg font-semibold text-gray-900">Expenses</h3>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddExpense}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                              <Plus size={16} />
                              Add Expense
                            </button>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount ($)</th>
                                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {expenses.map((expense) => (
                                  <tr key={expense.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                      <select
                                        value={expense.category}
                                        onChange={(e) => handleExpenseChange(expense.id, 'category', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      >
                                        <option value="">Select category...</option>
                                        {expenseCategories.map((category) => (
                                          <option key={category} value={category}>
                                            {category}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="py-3 px-4">
                                      <input
                                        type="text"
                                        placeholder="Expense description"
                                        value={expense.description}
                                        onChange={(e) => handleExpenseChange(expense.id, 'description', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      />
                                    </td>
                                    <td className="py-3 px-4">
                                      <input
                                        type="number"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        value={expense.amount}
                                        onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      />
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="space-y-1">
                                        <input
                                          accept="image/*,.pdf"
                                          style={{ display: 'none' }}
                                          id={`receipt-upload-${expense.id}`}
                                          type="file"
                                          onChange={(e) => handleReceiptChange(expense.id, e)}
                                          required={expense.amount >= 25}
                                        />
                                        <label htmlFor={`receipt-upload-${expense.id}`}>
                                          <button
                                            type="button"
                                            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full"
                                            onClick={() => document.getElementById(`receipt-upload-${expense.id}`).click()}
                                          >
                                            <Upload size={14} />
                                            <span className="text-sm">
                                              {expense.receipt ? expense.receipt.name : 'Upload Receipt'}
                                            </span>
                                          </button>
                                        </label>
                                        {expense.amount >= 25 && !expense.receipt && (
                                          <p className="text-xs text-red-600">
                                            Receipt required for amounts $25+
                                          </p>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveExpense(expense.id)}
                                        disabled={expenses.length <= 1}
                                        className={`p-2 rounded-lg transition-colors ${
                                          expenses.length <= 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-red-600 hover:bg-red-50'
                                        }`}
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Total Expenses</p>
                              <p className="text-xl font-bold text-gray-900">{formatCurrency(calculateTotal())}</p>
                            </div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isSubmitting ? (
                              <>
                                <LoadingSpinner size="sm" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} />
                                Submit Reconciliation
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reconciliation History</h3>
                <p className="text-gray-500 mb-4">View your past reconciliation submissions here</p>
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                  <Clock size={16} className="mr-2" />
                  Coming Soon
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}