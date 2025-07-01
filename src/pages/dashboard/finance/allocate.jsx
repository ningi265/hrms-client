import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Building2,
  Save,
  ArrowLeft,
  Plus,
  Minus,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Clock,
  Bell,
  X,
  FileText,
  Send,
  Loader
} from 'lucide-react';

// API configuration
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

// Budget categories
const budgetCategories = [
  'Equipment',
  'Software Licenses',
  'Training & Development',
  'Travel & Transportation',
  'Office Supplies',
  'Consulting Services',
  'Utilities',
  'Maintenance',
  'Marketing & Advertising',
  'Research & Development',
  'Personnel',
  'Operations',
  'Other'
];

// Distribution methods
const distributionMethods = [
  { value: 'equal', label: 'Equal Distribution', description: 'Distribute budget equally among all departments' },
  { value: 'proportional', label: 'Employee-Based', description: 'Distribute based on employee count' },
  { value: 'previous', label: 'Historical-Based', description: 'Distribute based on previous allocations' },
  { value: 'priority', label: 'Priority-Based', description: 'Distribute based on department priorities' }
];

// Notification Component
const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${
      notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
      notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
      'bg-blue-100 text-blue-800 border border-blue-200'
    }`}>
      <div className="flex items-center gap-2">
        {notification.type === 'success' && <CheckCircle size={20} />}
        {notification.type === 'error' && <AlertTriangle size={20} />}
        {notification.type === 'warning' && <AlertTriangle size={20} />}
        {notification.type === 'info' && <Bell size={20} />}
        <span className="font-medium">{notification.message}</span>
        <button onClick={onClose} className="ml-auto">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Loading Overlay Component
const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3">
        <Loader className="animate-spin w-6 h-6 text-blue-500" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

// Auto Distribution Modal
const AutoDistributionModal = ({ isOpen, onClose, onDistribute, totalBudget, departmentCount }) => {
  const [selectedMethod, setSelectedMethod] = useState('equal');
  const [isLoading, setIsLoading] = useState(false);

  const handleDistribute = async () => {
    setIsLoading(true);
    try {
      await onDistribute(selectedMethod);
      onClose();
    } catch (error) {
      console.error('Distribution failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Auto-Distribute Budget</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Distribution Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Total Budget: <span className="font-medium">MWK {totalBudget.toLocaleString()}</span></div>
              <div>Departments: <span className="font-medium">{departmentCount}</span></div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Choose Distribution Method</h4>
            {distributionMethods.map(method => (
              <label key={method.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="distributionMethod"
                  value={method.value}
                  checked={selectedMethod === method.value}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">{method.label}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDistribute}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin w-4 h-4" />
                Distributing...
              </>
            ) : (
              <>
                <Calculator size={16} />
                Distribute Budget
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const BudgetAllocationPage = () => {
  const [departments, setDepartments] = useState([]);
  const [allocations, setAllocations] = useState({});
  const [totalBudget, setTotalBudget] = useState(500000);
  const [budgetPeriod, setBudgetPeriod] = useState('2024-Q2');
  const [budgetYear, setBudgetYear] = useState(2024);
  const [quarter, setQuarter] = useState('Q2');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAutoDistribution, setShowAutoDistribution] = useState(false);
  const [showAllocationSummary, setShowAllocationSummary] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [currentAllocation, setCurrentAllocation] = useState(null);

  // Initialize allocations with current budgets
  useEffect(() => {
    fetchDepartments();
    fetchCurrentAllocation();
  }, []);

  useEffect(() => {
    const initialAllocations = {};
    departments.forEach(dept => {
      initialAllocations[dept._id] = {
        amount: dept.budget || 0,
        category: 'Operations',
        notes: '',
        priority: 'medium'
      };
    });
    setAllocations(initialAllocations);
  }, [departments]);

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/departments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDepartments(data.filter(dept => dept.status === 'active'));
      } else {
        throw new Error('Failed to fetch departments');
      }
    } catch (error) {
      showNotification('Failed to fetch departments', 'error');
      console.error('Error fetching departments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch current allocation if exists
  const fetchCurrentAllocation = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/budget-allocations/current`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentAllocation(data.data);
        if (data.data) {
          setBudgetPeriod(data.data.budgetPeriod);
          setBudgetYear(data.data.budgetYear);
          setQuarter(data.data.quarter);
          setTotalBudget(data.data.totalBudget);
          
          // Set allocations from current data
          const currentAllocations = {};
          data.data.departmentAllocations.forEach(alloc => {
            currentAllocations[alloc.department] = {
              amount: alloc.allocatedAmount,
              category: alloc.category,
              notes: alloc.notes || '',
              priority: alloc.priority
            };
          });
          setAllocations(currentAllocations);
        }
      }
    } catch (error) {
      console.error('Error fetching current allocation:', error);
    }
  };

  // Calculate totals
  const totalAllocated = Object.values(allocations).reduce((sum, alloc) => sum + (alloc.amount || 0), 0);
  const remainingBudget = totalBudget - totalAllocated;
  const allocationPercentage = totalBudget > 0 ? (totalAllocated / totalBudget) * 100 : 0;

  // Handle allocation change
  const handleAllocationChange = (deptId, field, value) => {
    setAllocations(prev => ({
      ...prev,
      [deptId]: {
        ...prev[deptId],
        [field]: field === 'amount' ? parseFloat(value) || 0 : value
      }
    }));

    // Clear errors when user starts typing
    if (errors[deptId]) {
      setErrors(prev => ({
        ...prev,
        [deptId]: null
      }));
    }

    // Real-time validation
    validateAllocations();
  };

  // Validate allocations
  const validateAllocations = async () => {
    const newErrors = {};
    let isValid = true;

    Object.entries(allocations).forEach(([deptId, allocation]) => {
      if (allocation.amount < 0) {
        newErrors[deptId] = 'Budget allocation cannot be negative';
        isValid = false;
      }
      if (allocation.amount > totalBudget) {
        newErrors[deptId] = 'Allocation exceeds total budget';
        isValid = false;
      }
    });

    setErrors(newErrors);

    // API validation
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/budget/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          allocation: {
            totalBudget,
            totalAllocated,
            departmentAllocations: Object.entries(allocations).map(([deptId, alloc]) => ({
              department: deptId,
              allocatedAmount: alloc.amount,
              allocationPercentage: totalBudget > 0 ? (alloc.amount / totalBudget) * 100 : 0
            }))
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setValidationResult(data.data);
      }
    } catch (error) {
      console.error('Validation error:', error);
    }

    return isValid;
  };

  // Auto-distribute budget
  const autoDistributeBudget = async (method) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/budget-allocations/auto-distribute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          totalBudget,
          distributionMethod: method,
          departmentIds: departments.map(d => d._id)
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newAllocations = {};
        
        data.data.allocations.forEach(alloc => {
          newAllocations[alloc.department] = {
            amount: alloc.allocatedAmount,
            category: alloc.category,
            priority: alloc.priority,
            notes: ''
          };
        });

        setAllocations(newAllocations);
        showNotification(`Budget distributed using ${method} method`, 'success');
      } else {
        throw new Error('Failed to auto-distribute budget');
      }
    } catch (error) {
      showNotification('Failed to auto-distribute budget', 'error');
      console.error('Auto-distribution error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save allocations
  const handleSaveAllocations = async (submitForApproval = false) => {
    if (!(await validateAllocations())) {
      showNotification('Please fix validation errors before saving', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const allocationData = {
        budgetPeriod,
        budgetYear,
        quarter,
        totalBudget,
        departmentAllocations: Object.entries(allocations).map(([deptId, alloc]) => {
          const dept = departments.find(d => d._id === deptId);
          return {
            department: deptId,
            departmentName: dept?.name,
            departmentCode: dept?.departmentCode,
            allocatedAmount: alloc.amount,
            category: alloc.category,
            priority: alloc.priority,
            notes: alloc.notes,
            previousAllocation: dept?.budget || 0
          };
        })
      };

      const url = currentAllocation 
        ? `${API_BASE_URL}/api/budget-allocations/${currentAllocation._id}`
        : `${API_BASE_URL}/api/budget-allocations`;
      
      const method = currentAllocation ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(allocationData)
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentAllocation(data.data);
        
        if (submitForApproval) {
          await submitForApprovalHandler(data.data._id);
        } else {
          showNotification('Budget allocation saved successfully!', 'success');
        }
      } else {
        throw new Error('Failed to save budget allocation');
      }
    } catch (error) {
      showNotification('Failed to save budget allocation', 'error');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit for approval
  const submitForApprovalHandler = async (allocationId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/budget-allocations/${allocationId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showNotification('Budget allocation submitted for approval!', 'success');
        fetchCurrentAllocation(); // Refresh current allocation
      } else {
        throw new Error('Failed to submit for approval');
      }
    } catch (error) {
      showNotification('Failed to submit for approval', 'error');
      console.error('Submit error:', error);
    }
  };

  // Export allocation data
  const handleExport = async () => {
    if (!currentAllocation) {
      showNotification('No allocation data to export', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/budget-allocations/export?format=csv&allocationId=${currentAllocation._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `budget-allocation-${budgetPeriod}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Budget allocation exported successfully', 'success');
      } else {
        throw new Error('Failed to export data');
      }
    } catch (error) {
      showNotification('Failed to export budget allocation', 'error');
      console.error('Export error:', error);
    }
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  // Filter departments
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.departmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.departmentHead.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.history.back()}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Budget Allocation</h1>
                <p className="text-gray-600 mt-1">Allocate budget to departments for {budgetPeriod}</p>
                {currentAllocation && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      currentAllocation.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      currentAllocation.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                      currentAllocation.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {currentAllocation.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Last updated: {new Date(currentAllocation.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={budgetPeriod}
                onChange={(e) => {
                  setBudgetPeriod(e.target.value);
                  const [year, q] = e.target.value.split('-');
                  setBudgetYear(parseInt(year));
                  setQuarter(q);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
                disabled={currentAllocation && currentAllocation.status !== 'draft'}
              >
                <option value="2024-Q1">Q1 2024</option>
                <option value="2024-Q2">Q2 2024</option>
                <option value="2024-Q3">Q3 2024</option>
                <option value="2024-Q4">Q4 2024</option>
                <option value="2025-Q1">Q1 2025</option>
              </select>
              <button
                onClick={() => setShowAllocationSummary(!showAllocationSummary)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 flex items-center gap-2"
              >
                <BarChart3 size={16} />
                Summary
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Target size={20} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Total Budget</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              MWK {totalBudget.toLocaleString()}
            </div>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
              className="mt-2 w-full px-3 py-1 text-sm border border-gray-200 rounded"
              disabled={currentAllocation && currentAllocation.status !== 'draft'}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Allocated</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              MWK {totalAllocated.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {allocationPercentage.toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${remainingBudget >= 0 ? 'bg-purple-50' : 'bg-red-50'}`}>
                <Calculator size={20} className={remainingBudget >= 0 ? 'text-purple-600' : 'text-red-600'} />
              </div>
              <span className="text-sm font-medium text-gray-500">Remaining</span>
            </div>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              MWK {remainingBudget.toLocaleString()}
            </div>
            {remainingBudget < 0 && (
              <div className="text-sm text-red-500 mt-1">Over budget!</div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Building2 size={20} className="text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Departments</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {departments.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {departments.filter(d => d.status === 'active').length} active
            </div>
          </div>
        </div>

        {/* Validation Results */}
        {validationResult && (
          <div className="mb-6">
            <div className={`border rounded-lg p-4 ${
              validationResult.overallValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {validationResult.overallValid ? 
                  <CheckCircle size={20} className="text-green-600" /> :
                  <AlertTriangle size={20} className="text-red-600" />
                }
                <span className="font-medium">
                  {validationResult.overallValid ? 'Allocation Valid' : 'Validation Issues Found'}
                </span>
              </div>
              
              {validationResult.allocationValidation.errors.length > 0 && (
                <div className="text-sm text-red-600 mb-2">
                  <strong>Errors:</strong>
                  <ul className="list-disc list-inside">
                    {validationResult.allocationValidation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validationResult.allocationValidation.warnings.length > 0 && (
                <div className="text-sm text-yellow-600">
                  <strong>Warnings:</strong>
                  <ul className="list-disc list-inside">
                    {validationResult.allocationValidation.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="text-sm text-gray-600 mt-2">
                Efficiency: {validationResult.allocationValidation.efficiency.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAutoDistribution(true)}
                disabled={isLoading || (currentAllocation && currentAllocation.status !== 'draft')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Calculator size={16} />
                Auto Distribute
              </button>
              <button
                onClick={() => handleSaveAllocations(false)}
                disabled={isLoading || remainingBudget < 0 || (currentAllocation && currentAllocation.status !== 'draft')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={16} />
                Save Draft
              </button>
              <button
                onClick={() => handleSaveAllocations(true)}
                disabled={isLoading || remainingBudget < 0 || !validationResult?.overallValid || (currentAllocation && currentAllocation.status !== 'draft')}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={16} />
                Submit for Approval
              </button>
            </div>
          </div>
        </div>

        {/* Department Allocation Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Department Allocations</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">Current Budget</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">New Allocation</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">Notes</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDepartments.map((dept) => {
                  const allocation = allocations[dept._id] || { amount: 0, category: '', notes: '', priority: 'medium' };
                  const change = allocation.amount - (dept.budget || 0);
                  const changePercentage = dept.budget > 0 ? (change / dept.budget) * 100 : 0;
                  
                  return (
                    <tr key={dept._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Building2 size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{dept.name}</div>
                            <div className="text-sm text-gray-500">{dept.departmentCode} • {dept.departmentHead}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          MWK {(dept.budget || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {dept.budgetUtilization || 0}% utilized
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <input
                          type="number"
                          value={allocation.amount}
                          onChange={(e) => handleAllocationChange(dept._id, 'amount', e.target.value)}
                          className={`w-32 px-3 py-2 border rounded-lg ${
                            errors[dept._id] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                          min="0"
                          disabled={currentAllocation && currentAllocation.status !== 'draft'}
                        />
                        {errors[dept._id] && (
                          <div className="text-xs text-red-500 mt-1">{errors[dept._id]}</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={allocation.category}
                          onChange={(e) => handleAllocationChange(dept._id, 'category', e.target.value)}
                          className="w-36 px-3 py-2 border border-gray-200 rounded-lg"
                          disabled={currentAllocation && currentAllocation.status !== 'draft'}
                        >
                          <option value="">Select Category</option>
                          {budgetCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={allocation.priority}
                          onChange={(e) => handleAllocationChange(dept._id, 'priority', e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
                          disabled={currentAllocation && currentAllocation.status !== 'draft'}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          value={allocation.notes}
                          onChange={(e) => handleAllocationChange(dept._id, 'notes', e.target.value)}
                          placeholder="Optional notes..."
                          className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          disabled={currentAllocation && currentAllocation.status !== 'draft'}
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className={`flex items-center gap-1 ${
                          change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {change > 0 ? <TrendingUp size={16} /> : change < 0 ? <TrendingDown size={16} /> : null}
                          <span className="font-medium">
                            {change > 0 ? '+' : ''}{change.toLocaleString()}
                          </span>
                        </div>
                        {change !== 0 && (
                          <div className="text-xs text-gray-500">
                            {change > 0 ? '+' : ''}{changePercentage.toFixed(1)}%
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation Summary Modal */}
        {showAllocationSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Budget Allocation Summary</h3>
                <button
                  onClick={() => setShowAllocationSummary(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Summary Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-700">Total Allocated</div>
                    <div className="text-2xl font-bold text-blue-900">
                      MWK {totalAllocated.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-green-700">Remaining Budget</div>
                    <div className="text-2xl font-bold text-green-900">
                      MWK {remainingBudget.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-purple-700">Allocation Rate</div>
                    <div className="text-2xl font-bold text-purple-900">
                      {allocationPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Department Breakdown */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h4>
                  <div className="space-y-3">
                    {departments.map(dept => {
                      const allocation = allocations[dept._id] || { amount: 0 };
                      const percentage = totalAllocated > 0 ? (allocation.amount / totalAllocated) * 100 : 0;
                      
                      return (
                        <div key={dept._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">{dept.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">MWK {allocation.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auto Distribution Modal */}
      <AutoDistributionModal
        isOpen={showAutoDistribution}
        onClose={() => setShowAutoDistribution(false)}
        onDistribute={autoDistributeBudget}
        totalBudget={totalBudget}
        departmentCount={departments.length}
      />

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} />

      {/* Notification */}
      <Notification 
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
};

export default BudgetAllocationPage;