import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Icons
import { 
  Search, Filter, Globe, Calendar, ArrowLeft, ArrowRight, FileText,
  MapPin, CreditCard, DollarSign, Check, MoreHorizontal, Wallet,
  Calculator, Send, Loader2, HelpCircle
} from 'lucide-react';

const FinancialRequestsDashboard = () => {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPerDiem, setShowPerDiem] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  // Per diem calculations
  const [perDiemDetails, setPerDiemDetails] = useState({
    dailyRate: 175,
    days: 5,
    additionalAllowance: 0,
    notes: '',
    categories: {
      food: { included: true, amount: 70 },
      accommodation: { included: true, amount: 85 },
      transportation: { included: true, amount: 35 },
      incidentals: { included: false, amount: 20 },
      business: { included: false, amount: 30 },
      communications: { included: false, amount: 10 }
    }
  });

  // Transfer details
  const [transferDetails, setTransferDetails] = useState({
    cardNumber: 'VISA **** 4289',
    accountHolder: '',
    amount: 0,
    currency: 'EUR',
    transferDate: format(new Date(), 'yyyy-MM-dd'),
    processingFee: 0,
    totalAmount: 0,
    notes: ''
  });

  // Notification details
  const [notificationDetails, setNotificationDetails] = useState({
    recipient: '',
    subject: 'Per Diem Transfer Notification',
    message: '',
    includeBreakdown: true,
    sendCopy: false
  });

  // Sample exchange rates
  const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 148.5,
    CAD: 1.35,
    AUD: 1.48
  };

  // Sample requests data
  const requests = [
    {
      id: 'TR-2025-0412-003',
      employeeName: 'Sarah Johnson',
      department: 'Marketing',
      city: 'Paris',
      country: 'France',
      departureDate: new Date(2025, 4, 16),
      returnDate: new Date(2025, 4, 20),
      currency: 'EUR',
      approvedAt: new Date(2025, 4, 10),
      approvedBy: 'Michael Wilson',
      purpose: 'Marketing Conference',
      perDiemAmount: null,
      paymentDate: null,
      financialStatus: 'pending',
      priority: 'high',
      cardDetails: {
        type: 'VISA',
        lastFour: '4289',
        holder: 'Sarah Johnson'
      }
    },
    {
      id: 'TR-2025-0408-001',
      employeeName: 'Thomas Chen',
      department: 'Sales',
      city: 'Berlin',
      country: 'Germany',
      departureDate: new Date(2025, 4, 12),
      returnDate: new Date(2025, 4, 15),
      currency: 'EUR',
      approvedAt: new Date(2025, 4, 5),
      approvedBy: 'Michael Wilson',
      purpose: 'Client Meetings',
      perDiemAmount: 750,
      paymentDate: new Date(2025, 4, 8),
      financialStatus: 'completed',
      priority: 'medium',
      cardDetails: {
        type: 'Mastercard',
        lastFour: '3317',
        holder: 'Thomas Chen'
      }
    },
    {
      id: 'TR-2025-0410-002',
      employeeName: 'Amanda Rivera',
      department: 'Engineering',
      city: 'Tokyo',
      country: 'Japan',
      departureDate: new Date(2025, 4, 18),
      returnDate: new Date(2025, 4, 25),
      currency: 'JPY',
      approvedAt: new Date(2025, 4, 7),
      approvedBy: 'Jennifer Taylor',
      purpose: 'Technology Summit',
      perDiemAmount: null,
      paymentDate: null,
      financialStatus: 'pending',
      priority: 'medium',
      cardDetails: {
        type: 'VISA',
        lastFour: '7751',
        holder: 'Amanda Rivera'
      }
    }
  ];

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle request selection
  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    setShowPerDiem(false);
    setShowTransfer(false);
    setShowNotification(false);
    
    // Reset per diem calculations
    setPerDiemDetails({
      dailyRate: 175,
      days: Math.ceil((request.returnDate - request.departureDate) / (1000 * 60 * 60 * 24)) + 1,
      additionalAllowance: 0,
      notes: '',
      categories: {
        food: { included: true, amount: 70 },
        accommodation: { included: true, amount: 85 },
        transportation: { included: true, amount: 35 },
        incidentals: { included: false, amount: 20 },
        business: { included: false, amount: 30 },
        communications: { included: false, amount: 10 }
      }
    });
    
    // Reset transfer details
    setTransferDetails({
      cardNumber: `${request.cardDetails.type} **** ${request.cardDetails.lastFour}`,
      accountHolder: request.cardDetails.holder,
      amount: 0,
      currency: request.currency,
      transferDate: format(new Date(), 'yyyy-MM-dd'),
      processingFee: 0,
      totalAmount: 0,
      notes: `Per diem for ${request.employeeName}'s trip to ${request.city}, ${request.country}`
    });
    
    // Reset notification details
    setNotificationDetails({
      recipient: `${request.employeeName.toLowerCase().replace(/\s/g, '.')}@company.com`,
      subject: `Per Diem Transfer for Your Trip to ${request.city}`,
      message: `Dear ${request.employeeName},\n\nWe are pleased to inform you that your per diem funds for your upcoming trip to ${request.city}, ${request.country} (${format(request.departureDate, 'MMM d')} - ${format(request.returnDate, 'MMM d, yyyy')}) have been approved and processed.\n\nThe funds have been transferred to your ${request.cardDetails.type} card ending in ${request.cardDetails.lastFour} and should be available within 1-2 business days.\n\nIf you have any questions, please contact the Finance Department.\n\nSafe travels,\nFinance Team`,
      includeBreakdown: true,
      sendCopy: false
    });
  };

  // Calculate per diem
  const calculatePerDiem = () => {
    setIsCalculating(true);
    
    // Simulate API call
    setTimeout(() => {
      // Calculate total from categories
      const categoriesTotal = Object.values(perDiemDetails.categories)
        .filter(category => category.included)
        .reduce((sum, category) => sum + (Number(category.amount) || 0), 0) * perDiemDetails.days;
      
      const totalAmount = categoriesTotal + Number(perDiemDetails.additionalAllowance || 0);
      
      // Update transfer details
      setTransferDetails({
        ...transferDetails,
        amount: totalAmount,
        processingFee: totalAmount * 0.005,
        totalAmount: totalAmount * 1.005
      });
      
      setIsCalculating(false);
      setShowPerDiem(false);
      setShowTransfer(true);
    }, 1500);
  };

  // Process transfer
  const processTransfer = () => {
    setIsTransferring(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsTransferring(false);
      setShowTransfer(false);
      setShowNotification(true);
      
      // Update selected request
      setSelectedRequest({
        ...selectedRequest,
        financialStatus: 'in-progress',
        perDiemAmount: transferDetails.amount
      });
    }, 2000);
  };

  // Send notification
  const sendNotification = () => {
    setIsSendingNotification(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSendingNotification(false);
      setShowNotification(false);
      
      // Update selected request
      setSelectedRequest({
        ...selectedRequest,
        financialStatus: 'completed',
        paymentDate: new Date()
      });
    }, 1500);
  };

  // Filter requests based on search and filter
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || request.financialStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Status badges
  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'Pending Action', color: 'bg-amber-100 text-amber-800' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-800' }
    };
    
    const { label, color } = statusMap[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  // Priority badges
  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'high': { label: 'High', color: 'bg-red-100 text-red-800' },
      'medium': { label: 'Medium', color: 'bg-amber-100 text-amber-800' },
      'low': { label: 'Low', color: 'bg-green-100 text-green-800' }
    };
    
    const { label, color } = priorityMap[priority];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  // Load data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Travel Requests */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-10rem)]">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Financial Requests</h2>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-full text-sm border-gray-300 pr-8 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Requests</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex border-b">
                  <button
                    className={`flex-1 py-2 text-sm font-medium ${
                      activeTab === 'pending'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('pending')}
                  >
                    Pending
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm font-medium ${
                      activeTab === 'completed'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('completed')}
                  >
                    Processed
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredRequests
                  .filter((req) => activeTab === 'all' || 
                    (activeTab === 'pending' ? req.financialStatus !== 'completed' : req.financialStatus === 'completed'))
                  .length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No {activeTab} requests found
                  </div>
                ) : (
                  filteredRequests
                    .filter((req) => activeTab === 'all' || 
                      (activeTab === 'pending' ? req.financialStatus !== 'completed' : req.financialStatus === 'completed'))
                    .map((request) => (
                      <div
                        key={request.id}
                        className={`bg-white rounded-lg border transition-all cursor-pointer p-3 hover:shadow-md ${
                          selectedRequest?.id === request.id
                            ? 'border-blue-300 shadow-md bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                        onClick={() => handleSelectRequest(request)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">{request.employeeName}</h3>
                            <p className="text-xs text-gray-500">{request.id.substring(0, 10)}</p>
                          </div>
                          {getPriorityBadge(request.priority)}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-1.5">
                          <Globe size={14} className="mr-1.5 text-gray-400" />
                          {request.city}, {request.country}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-1.5 text-gray-400" />
                          {format(request.departureDate, "MMM d")} - {format(request.returnDate, "MMM d, yyyy")}
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-medium">
                              {request.currency}
                            </span>
                            {request.financialStatus === "completed" && request.perDiemAmount && (
                              <span className="text-xs text-green-700">
                                {formatCurrency(request.perDiemAmount, request.currency)}
                              </span>
                            )}
                          </div>
                          
                          <span className="text-xs text-gray-500">
                            {request.financialStatus === "completed" && request.paymentDate 
                              ? `Paid: ${format(request.paymentDate, "MMM d, yyyy")}`
                              : `Approved: ${format(request.approvedAt, "MMM d, yyyy")}`}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Right Column - Request Details */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden h-[calc(100vh-10rem)] flex flex-col">
              {selectedRequest ? (
                <>
                  {/* Request Details */}
                  <div className="bg-blue-50 px-6 py-4 border-b flex justify-between items-start">
                    <div className="flex">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <FileText size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-lg font-semibold text-gray-900">{selectedRequest.employeeName}</h2>
                          {getStatusBadge(selectedRequest.financialStatus)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {selectedRequest.id.substring(0, 10)} • {selectedRequest.department}
                        </p>
                      </div>
                    </div>
                    <button className="rounded-full p-1 hover:bg-blue-100 transition-colors">
                      <MoreHorizontal size={20} className="text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xs text-gray-500 mb-1">Purpose of Travel</h3>
                            <p className="text-gray-900">{selectedRequest.purpose}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-xs text-gray-500 mb-1">Destination</h3>
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-1.5 text-blue-600" />
                              <p className="text-gray-900">
                                {selectedRequest.city}, {selectedRequest.country}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-xs text-gray-500 mb-1">Travel Period</h3>
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-1.5 text-blue-600" />
                              <div>
                                <p className="text-gray-900">
                                  {format(selectedRequest.departureDate, "MMM d, yyyy")} -{" "}
                                  {format(selectedRequest.returnDate, "MMM d, yyyy")}
                                </p>
                                <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {Math.ceil(
                                    (selectedRequest.returnDate - selectedRequest.departureDate) / (1000 * 60 * 60 * 24)
                                  ) + 1} days
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xs text-gray-500 mb-1">Payment Details</h3>
                            <div className="flex items-center mt-1">
                              <div className="bg-blue-100 rounded-full p-1.5 mr-2">
                                <CreditCard size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {selectedRequest.cardDetails.type} Card **** {selectedRequest.cardDetails.lastFour}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Holder: {selectedRequest.cardDetails.holder}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-xs text-gray-500 mb-1">Currency</h3>
                            <div className="flex items-center">
                              <DollarSign size={16} className="mr-1.5 text-blue-600" />
                              <div>
                                <p className="text-gray-900">{selectedRequest.currency}</p>
                                {selectedRequest.currency !== "USD" && (
                                  <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    1 USD = {exchangeRates[selectedRequest.currency]} {selectedRequest.currency}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {selectedRequest.financialStatus === "completed" && selectedRequest.perDiemAmount && (
                            <div>
                              <h3 className="text-xs text-gray-500 mb-1">Transferred Amount</h3>
                              <div className="flex items-center">
                                <Wallet size={16} className="mr-1.5 text-blue-600" />
                                <div>
                                  <p className="text-gray-900 font-medium">
                                    {formatCurrency(selectedRequest.perDiemAmount, selectedRequest.currency)}
                                  </p>
                                  {selectedRequest.paymentDate && (
                                    <p className="text-xs text-gray-500">
                                      Transferred on {format(selectedRequest.paymentDate, "MMMM d, yyyy")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <h3 className="text-xs text-gray-500 mb-1">Approval</h3>
                            <div className="flex items-center">
                              <Check size={16} className="mr-1.5 text-green-600" />
                              <div>
                                <p className="text-gray-900">Approved by {selectedRequest.approvedBy}</p>
                                <p className="text-xs text-gray-500">
                                  {format(selectedRequest.approvedAt, "MMMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status alerts */}
                      {selectedRequest.financialStatus === "pending" && (
                        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-amber-800">Action Required</h3>
                              <div className="mt-2 text-sm text-amber-700">
                                <p>
                                  This request requires per diem calculation and fund transfer to the employee's {selectedRequest.cardDetails.type} card.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedRequest.financialStatus === "in-progress" && (
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800">In Progress</h3>
                              <div className="mt-2 text-sm text-blue-700">
                                <p>
                                  Funds have been processed. Please notify the employee about the transfer.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedRequest.financialStatus === "completed" && (
                        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-green-800">Completed</h3>
                              <div className="mt-2 text-sm text-green-700">
                                <p>
                                  All financial processing has been completed for this travel request.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Per Diem Calculation Section */}
                      {showPerDiem && (
                        <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex items-center">
                            <div className="bg-amber-100 rounded-full p-1.5 mr-3">
                              <Calculator size={16} className="text-amber-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Per Diem Calculation</h3>
                              <p className="text-sm text-gray-600">
                                Calculate per diem allowance for {selectedRequest.employeeName}'s trip to {selectedRequest.city}
                              </p>
                            </div>
                          </div>
                          
                          <div className="p-5 space-y-6">
                            {/* Expense Categories */}
                            <div>
                              <div className="flex items-center mb-3">
                                <h4 className="text-sm font-medium text-gray-900">Expense Categories</h4>
                                <span className="ml-1 cursor-help" title="Select the expense categories that will be covered by this per diem">
                                  <HelpCircle size={14} className="text-gray-400" />
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {/* Food Category */}
                                <div className="flex items-start">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="category-food"
                                      type="checkbox"
                                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                      checked={perDiemDetails.categories?.food?.included || false}
                                      onChange={(e) => setPerDiemDetails({
                                        ...perDiemDetails,
                                        categories: {
                                          ...perDiemDetails.categories,
                                          food: {
                                            ...perDiemDetails.categories?.food,
                                            included: e.target.checked,
                                            amount: e.target.checked 
                                              ? (perDiemDetails.categories?.food?.amount || Math.round(perDiemDetails.dailyRate * 0.4))
                                              : 0
                                          }
                                        }
                                      })}
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label htmlFor="category-food" className="flex items-center cursor-pointer font-medium text-gray-700">
                                      <span className="inline-flex items-center justify-center w-7 h-7 bg-green-50 text-green-600 rounded-full mr-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M15 11H20L18 7H15M13 3H7V9H13M11 11H4C4 13.6 5 16 7 16V21H11V16C13 16 14 13.6 14 11M19 3H15.5L12.5 11H19C19 11 22 11 22 8C22 5 19 3 19 3Z" fill="currentColor" />
                                        </svg>
                                      </span>
                                      Food & Meals
                                    </label>
                                  </div>
                                </div>
                                
                                {/* Accommodation Category */}
                                <div className="flex items-start">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="category-accommodation"
                                      type="checkbox"
                                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                      checked={perDiemDetails.categories?.accommodation?.included || false}
                                      onChange={(e) => setPerDiemDetails({
                                        ...perDiemDetails,
                                        categories: {
                                          ...perDiemDetails.categories,
                                          accommodation: {
                                            ...perDiemDetails.categories?.accommodation,
                                            included: e.target.checked,
                                            amount: e.target.checked 
                                              ? (perDiemDetails.categories?.accommodation?.amount || Math.round(perDiemDetails.dailyRate * 0.5))
                                              : 0
                                          }
                                        }
                                      })}
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label htmlFor="category-accommodation" className="flex items-center cursor-pointer font-medium text-gray-700">
                                      <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-600 rounded-full mr-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M19 7H11V14H3V5H1V20H3V17H21V20H23V11A4 4 0 0 0 19 7M7 13A3 3 0 0 0 7 7 3 3 0 0 0 7 13" fill="currentColor" />
                                        </svg>
                                      </span>
                                      Accommodation
                                    </label>
                                  </div>
                                </div>
                                
                                {/* Transportation Category */}
                                <div className="flex items-start">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="category-transportation"
                                      type="checkbox"
                                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                      checked={perDiemDetails.categories?.transportation?.included || false}
                                      onChange={(e) => setPerDiemDetails({
                                        ...perDiemDetails,
                                        categories: {
                                          ...perDiemDetails.categories,
                                          transportation: {
                                            ...perDiemDetails.categories?.transportation,
                                            included: e.target.checked,
                                            amount: e.target.checked 
                                              ? (perDiemDetails.categories?.transportation?.amount || Math.round(perDiemDetails.dailyRate * 0.2))
                                              : 0
                                          }
                                        }
                                      })}
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label htmlFor="category-transportation" className="flex items-center cursor-pointer font-medium text-gray-700">
                                      <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-50 text-amber-600 rounded-full mr-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01M6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16M17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16M5 12L6.5 6.5H17.5L19 12H5Z" fill="currentColor" />
                                        </svg>
                                      </span>
                                      Local Transportation
                                    </label>
                                  </div>
                                </div>
                                
                                {/* Only show other categories if they're needed */}
                                {/* Add more categories here */}
                              </div>
                            </div>
                            
                            {/* Selected Categories Details */}
                            {Object.entries(perDiemDetails.categories || {})
                              .filter(([_, category]) => category.included)
                              .length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Expense Breakdown</h4>
                                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                  {Object.entries(perDiemDetails.categories || {})
                                    .filter(([_, category]) => category.included)
                                    .map(([key, category]) => (
                                      <div key={key} className="flex items-center justify-between">
                                        <p className="text-sm text-gray-700 capitalize">{key}:</p>
                                        <div className="flex items-center gap-2 w-1/2">
                                          <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                              <span className="text-gray-500 sm:text-sm">{selectedRequest.currency}</span>
                                            </div>
                                            <input
                                              type="number"
                                              value={category.amount}
                                              onChange={(e) => {
                                                const newAmount = Number(e.target.value) || 0;
                                                setPerDiemDetails({
                                                  ...perDiemDetails,
                                                  categories: {
                                                    ...perDiemDetails.categories,
                                                    [key]: {
                                                      ...category,
                                                      amount: newAmount
                                                    }
                                                  }
                                                });
                                              }}
                                              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                          </div>
                                          <span className="text-xs text-gray-500 w-14 text-right">per day</span>
                                        </div>
                                      </div>
                                    ))}
                                    
                                  <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                      <p className="text-sm font-medium text-gray-900">Daily Total:</p>
                                      <p className="text-sm font-semibold text-gray-900">
                                        {formatCurrency(
                                          Object.values(perDiemDetails.categories || {})
                                            .filter(category => category.included)
                                            .reduce((sum, category) => sum + (Number(category.amount) || 0), 0),
                                          selectedRequest.currency
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Main calculation grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center mb-1">
                                    <label htmlFor="daily-rate" className="block text-sm font-medium text-gray-700">
                                      Daily Rate
                                    </label>
                                    <span className="ml-1 cursor-help" title="Standard daily rate for this destination">
                                      <HelpCircle size={14} className="text-gray-400" />
                                    </span>
                                  </div>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">{selectedRequest.currency}</span>
                                    </div>
                                    <input
                                      type="number"
                                      id="daily-rate"
                                      value={perDiemDetails.dailyRate}
                                      onChange={(e) => {
                                        const newRate = Number.parseFloat(e.target.value) || 0;
                                        setPerDiemDetails({
                                          ...perDiemDetails,
                                          dailyRate: newRate,
                                          // Update category amounts based on new daily rate if no custom values set
                                          categories: {
                                            ...(perDiemDetails.categories || {}),
                                            food: perDiemDetails.categories?.food?.included ? {
                                              included: true,
                                              amount: Math.round(newRate * 0.4)
                                            } : { included: false, amount: 0 },
                                            accommodation: perDiemDetails.categories?.accommodation?.included ? {
                                              included: true,
                                              amount: Math.round(newRate * 0.5)
                                            } : { included: false, amount: 0 },
                                            transportation: perDiemDetails.categories?.transportation?.included ? {
                                              included: true,
                                              amount: Math.round(newRate * 0.2)
                                            } : { included: false, amount: 0 }
                                          }
                                        });
                                      }}
                                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Standard rate for {selectedRequest.country}
                                  </p>
                                </div>
                                
                                <div>
                                  <label htmlFor="num-days" className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Days
                                  </label>
                                  <input
                                    type="number"
                                    id="num-days"
                                    value={perDiemDetails.days}
                                    onChange={(e) =>
                                      setPerDiemDetails({ ...perDiemDetails, days: Number.parseInt(e.target.value) || 0 })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                  <p className="mt-1 text-xs text-gray-500">
                                    Based on travel dates: {format(selectedRequest.departureDate, "MMM d")} -{" "}
                                    {format(selectedRequest.returnDate, "MMM d")}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center mb-1">
                                    <label htmlFor="additional-allowance" className="block text-sm font-medium text-gray-700">
                                      Additional Allowance
                                    </label>
                                    <span className="ml-1 cursor-help" title="Any additional funds required for special circumstances">
                                      <HelpCircle size={14} className="text-gray-400" />
                                    </span>
                                  </div>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">{selectedRequest.currency}</span>
                                    </div>
                                    <input
                                      type="number"
                                      id="additional-allowance"
                                      placeholder="0.00"
                                      value={perDiemDetails.additionalAllowance}
                                      onChange={(e) =>
                                        setPerDiemDetails({
                                          ...perDiemDetails,
                                          additionalAllowance: Number.parseFloat(e.target.value) || 0,
                                        })
                                      }
                                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                  </label>
                                  <textarea
                                    id="notes"
                                    rows={4}
                                    placeholder="Any notes about this per diem calculation"
                                    value={perDiemDetails.notes}
                                    onChange={(e) => setPerDiemDetails({ ...perDiemDetails, notes: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Summary section */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Calculation Summary</h4>
                                  <div className="space-y-1">
                                    {Object.entries(perDiemDetails.categories || {})
                                      .filter(([_, category]) => category.included)
                                      .map(([key, category]) => (
                                        <div key={key} className="flex justify-between text-sm w-48">
                                          <span className="text-gray-500 capitalize">{key}:</span>
                                          <span className="text-gray-900">
                                            {formatCurrency(category.amount * perDiemDetails.days, selectedRequest.currency)}
                                          </span>
                                        </div>
                                      ))}
                                    
                                    {Object.entries(perDiemDetails.categories || {}).some(([_, category]) => category.included) && (
                                      <div className="border-t border-gray-200 my-1 pt-1"></div>
                                    )}
                                    
                                    <div className="flex justify-between text-sm w-48">
                                      <span className="text-gray-500">Additional Allowance:</span>
                                      <span className="text-gray-900">
                                        {formatCurrency(perDiemDetails.additionalAllowance, selectedRequest.currency)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                  <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(
                                      (Object.values(perDiemDetails.categories || {})
                                        .filter(category => category.included)
                                        .reduce((sum, category) => sum + (Number(category.amount) || 0), 0) * perDiemDetails.days) +
                                      Number.parseFloat(perDiemDetails.additionalAllowance || 0),
                                      selectedRequest.currency,
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Approx.{" "}
                                    {formatCurrency(
                                      ((Object.values(perDiemDetails.categories || {})
                                        .filter(category => category.included)
                                        .reduce((sum, category) => sum + (Number(category.amount) || 0), 0) * perDiemDetails.days) +
                                        Number.parseFloat(perDiemDetails.additionalAllowance || 0)) /
                                        exchangeRates[selectedRequest.currency],
                                      "USD",
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 px-5 py-3 flex justify-between border-t">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => setShowPerDiem(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              disabled={
                                isCalculating || 
                                perDiemDetails.dailyRate <= 0 || 
                                perDiemDetails.days <= 0 ||
                                !Object.values(perDiemDetails.categories || {}).some(cat => cat.included)
                              }
                              onClick={calculatePerDiem}
                            >
                              {isCalculating ? (
                                <>
                                  <Loader2 size={16} className="animate-spin mr-2" />
                                  Calculating...
                                </>
                              ) : (
                                <>
                                  <Check size={16} className="mr-2" />
                                  Confirm Calculation
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Fund Transfer Section */}
                      {showTransfer && (
                        <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div className="bg-blue-50 px-4 py-3 border-b border-blue-200 flex items-center">
                            <div className="bg-blue-100 rounded-full p-1.5 mr-3">
                              <CreditCard size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Fund Transfer</h3>
                              <p className="text-sm text-gray-600">
                                Transfer per diem funds to {selectedRequest.employeeName}'s {selectedRequest.cardDetails.type} card
                              </p>
                            </div>
                          </div>
                          
                          <div className="p-5 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Details
                                  </label>
                                  <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-md">
                                    <div className="bg-blue-100 rounded-full p-1.5 mr-3">
                                      <CreditCard size={16} className="text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{transferDetails.cardNumber}</p>
                                      <p className="text-xs text-gray-500">Holder: {transferDetails.accountHolder}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <label htmlFor="transfer-amount" className="block text-sm font-medium text-gray-700 mb-1">
                                    Transfer Amount
                                  </label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">{selectedRequest.currency}</span>
                                    </div>
                                    <input
                                      type="number"
                                      id="transfer-amount"
                                      value={transferDetails.amount}
                                      onChange={(e) =>
                                        setTransferDetails({
                                          ...transferDetails,
                                          amount: Number.parseFloat(e.target.value) || 0,
                                          processingFee: (Number.parseFloat(e.target.value) || 0) * 0.005,
                                          totalAmount: (Number.parseFloat(e.target.value) || 0) * 1.005
                                        })
                                      }
                                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Amount calculated from per diem
                                  </p>
                                </div>
                                
                                <div>
                                  <label htmlFor="transfer-date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Transfer Date
                                  </label>
                                  <input
                                    type="date"
                                    id="transfer-date"
                                    value={transferDetails.transferDate}
                                    onChange={(e) =>
                                      setTransferDetails({ ...transferDetails, transferDate: e.target.value })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <label htmlFor="transfer-currency" className="block text-sm font-medium text-gray-700 mb-1">
                                    Currency
                                  </label>
                                  <select
                                    id="transfer-currency"
                                    value={transferDetails.currency}
                                    onChange={(e) =>
                                      setTransferDetails({ ...transferDetails, currency: e.target.value })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  >
                                    <option value={selectedRequest.currency}>{selectedRequest.currency}</option>
                                  </select>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Exchange rate: 1 USD = {exchangeRates[selectedRequest.currency]} {selectedRequest.currency}
                                  </p>
                                </div>
                                
                                <div>
                                  <div className="flex items-center mb-1">
                                    <label htmlFor="processing-fee" className="block text-sm font-medium text-gray-700">
                                      Processing Fee
                                    </label>
                                    <span className="ml-1 cursor-help" title="Standard processing fee for international transfers (0.5%)">
                                      <HelpCircle size={14} className="text-gray-400" />
                                    </span>
                                  </div>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">{selectedRequest.currency}</span>
                                    </div>
                                    <input
                                      type="text"
                                      id="processing-fee"
                                      value={transferDetails.processingFee.toFixed(2)}
                                      readOnly
                                      className="pl-10 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Automatically calculated (0.5% of transfer amount)
                                  </p>
                                </div>
                                
                                <div>
                                  <label htmlFor="transfer-notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    Transfer Notes
                                  </label>
                                  <textarea
                                    id="transfer-notes"
                                    rows={4}
                                    placeholder="Any notes about this transfer"
                                    value={transferDetails.notes}
                                    onChange={(e) => setTransferDetails({ ...transferDetails, notes: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-sm font-medium text-blue-800 mb-2">Transfer Summary</h4>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm w-48">
                                      <span className="text-blue-700">Transfer Amount:</span>
                                      <span className="text-blue-700">
                                        {formatCurrency(transferDetails.amount, selectedRequest.currency)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm w-48">
                                      <span className="text-blue-700">Processing Fee:</span>
                                      <span className="text-blue-700">
                                        {formatCurrency(transferDetails.processingFee, selectedRequest.currency)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-xs text-blue-700 mb-1">Total to Transfer</p>
                                  <p className="text-xl font-bold text-blue-800">
                                    {formatCurrency(transferDetails.totalAmount, selectedRequest.currency)}
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    Approx.{" "}
                                    {formatCurrency(
                                      transferDetails.totalAmount / exchangeRates[selectedRequest.currency],
                                      "USD",
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-amber-800">Important</h3>
                                  <div className="mt-2 text-sm text-amber-700">
                                    <p>
                                      By proceeding, you confirm that the transfer details are correct and funds will be sent to
                                      the employee's {selectedRequest.cardDetails.type} card. This action cannot be undone.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 px-5 py-3 flex justify-between border-t">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => setShowTransfer(false)}
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              disabled={isTransferring || transferDetails.amount <= 0}
                              onClick={processTransfer}
                            >
                              {isTransferring ? (
                                <>
                                  <Loader2 size={16} className="animate-spin mr-2" />
                                  Processing Transfer...
                                </>
                              ) : (
                                <>
                                  <ArrowRight size={16} className="mr-2" />
                                  Process Transfer
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Notification Section */}
                      {showNotification && (
                        <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div className="bg-green-50 px-4 py-3 border-b border-green-200 flex items-center">
                            <div className="bg-green-100 rounded-full p-1.5 mr-3">
                              <Send size={16} className="text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Notify Employee</h3>
                              <p className="text-sm text-gray-600">
                                Send notification to {selectedRequest.employeeName} about the fund transfer
                              </p>
                            </div>
                          </div>
                          
                          <div className="p-5 space-y-6">
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                                  Recipient
                                </label>
                                <input
                                  type="email"
                                  id="recipient"
                                  value={notificationDetails.recipient}
                                  onChange={(e) =>
                                    setNotificationDetails({ ...notificationDetails, recipient: e.target.value })
                                  }
                                  readOnly
                                  className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                  Employee's email address
                                </p>
                              </div>
                              
                              <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                  Subject
                                </label>
                                <input
                                  type="text"
                                  id="subject"
                                  placeholder="Notification subject"
                                  value={notificationDetails.subject}
                                  onChange={(e) =>
                                    setNotificationDetails({ ...notificationDetails, subject: e.target.value })
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                  Message
                                </label>
                                <textarea
                                  id="message"
                                  rows={6}
                                  placeholder="Enter notification message"
                                  value={notificationDetails.message}
                                  onChange={(e) =>
                                    setNotificationDetails({ ...notificationDetails, message: e.target.value })
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="include-breakdown"
                                      type="checkbox"
                                      checked={notificationDetails.includeBreakdown}
                                      onChange={(e) =>
                                        setNotificationDetails({ ...notificationDetails, includeBreakdown: e.target.checked })
                                      }
                                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label htmlFor="include-breakdown" className="font-medium text-gray-700">
                                      Include per diem breakdown in notification
                                    </label>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="send-copy"
                                      type="checkbox"
                                      checked={notificationDetails.sendCopy}
                                      onChange={(e) =>
                                        setNotificationDetails({ ...notificationDetails, sendCopy: e.target.checked })
                                      }
                                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label htmlFor="send-copy" className="font-medium text-gray-700">
                                      Send copy to finance department
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
                              <div className="border border-gray-200 rounded-lg bg-white p-4">
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                  To: {notificationDetails.recipient}
                                </p>
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                  Subject: {notificationDetails.subject}
                                </p>
                                <div className="border-t border-gray-200 my-2 pt-2"></div>
                                <div className="text-sm text-gray-700 whitespace-pre-line">
                                  {notificationDetails.message}
                                </div>
                                
                                {notificationDetails.includeBreakdown && (
                                  <>
                                    <div className="border-t border-gray-200 my-3 pt-3"></div>
                                    <p className="text-sm font-medium text-gray-900 mb-2">
                                      Per Diem Breakdown:
                                    </p>
                                    <div className="text-sm space-y-1">
                                      <div className="flex justify-between max-w-xs">
                                        <span className="text-gray-600">Daily Rate:</span>
                                        <span className="text-gray-900">
                                          {formatCurrency(perDiemDetails.dailyRate, selectedRequest.currency)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between max-w-xs">
                                        <span className="text-gray-600">Number of Days:</span>
                                        <span className="text-gray-900">{perDiemDetails.days}</span>
                                      </div>
                                      <div className="flex justify-between max-w-xs">
                                        <span className="text-gray-600">Additional Allowance:</span>
                                        <span className="text-gray-900">
                                          {formatCurrency(perDiemDetails.additionalAllowance, selectedRequest.currency)}
                                        </span>
                                      </div>
                                      <div className="border-t border-gray-200 my-1 pt-1"></div>
                                      <div className="flex justify-between max-w-xs">
                                        <span className="font-medium text-gray-900">Total Amount:</span>
                                        <span className="font-medium text-gray-900">
                                          {formatCurrency(transferDetails.totalAmount, selectedRequest.currency)}
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 px-5 py-3 flex justify-between border-t">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => setShowNotification(false)}
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              disabled={
                                isSendingNotification || !notificationDetails.subject || !notificationDetails.message
                              }
                              onClick={sendNotification}
                            >
                              {isSendingNotification ? (
                                <>
                                  <Loader2 size={16} className="animate-spin mr-2" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send size={16} className="mr-2" />
                                  Send Notification
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-3 border-t mt-auto">
                    {selectedRequest.financialStatus === "pending" && (
                      <div className="flex justify-between">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => {}}
                        >
                          Back to Dashboard
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => setShowPerDiem(true)}
                        >
                          <Calculator size={16} className="mr-2" />
                          Calculate Per Diem
                        </button>
                      </div>
                    )}
                    
                    {selectedRequest.financialStatus === "in-progress" && (
                      <div className="flex justify-between">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => {}}
                        >
                          Back to Dashboard
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => setShowNotification(true)}
                        >
                          <Send size={16} className="mr-2" />
                          Notify Employee
                        </button>
                      </div>
                    )}
                    
                    {selectedRequest.financialStatus === "completed" && (
                      <div className="flex justify-between">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => {}}
                        >
                          Back to Dashboard
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onClick={() => {}}
                        >
                          <FileText size={16} className="mr-2" />
                          View Transaction Record
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <FileText size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Request Selected</h3>
                  <p className="text-gray-500 max-w-sm">
                    Select a financial request from the list to view details and process it
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FinancialRequestsDashboard;