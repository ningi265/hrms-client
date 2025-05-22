import { Search, Globe, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const FinancialRequests = ({
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  filteredRequests,
  selectedRequest,
  handleSelectRequest
}) => {
  // Function to format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to determine priority badge
  const getPriorityBadge = (priority) => {
    const badgeClasses = {
      high: "bg-red-50 text-red-700 border border-red-200",
      medium: "bg-amber-50 text-amber-700 border border-amber-200",
      low: "bg-green-50 text-green-700 border border-green-200"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClasses[priority.toLowerCase()]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-10rem)] border border-gray-100">
      {/* Header Section */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Financial Requests</h2>
          
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none rounded-full text-sm bg-gray-50 border-gray-200 pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="relative mb-5 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
            <Search size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors duration-200 relative ${
              activeTab === 'pending'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
            {activeTab === 'pending' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
            )}
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors duration-200 relative ${
              activeTab === 'completed'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Processed
            {activeTab === 'completed' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
            )}
          </button>
        </div>
      </div>
      
      {/* Request Cards Section - with custom scrollbar styling */}
      <div 
        className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent'
        }}
      >
        <style jsx global>{`
          /* Modern scrollbar styles */
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 9999px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background-color: #94a3b8;
          }
          
          .scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
        `}</style>
        
        {filteredRequests
          .filter((req) => activeTab === 'all' || 
            (activeTab === 'pending' ? req.financialStatus !== 'completed' : req.financialStatus === 'completed'))
          .length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No {activeTab} requests found</p>
          </div>
        ) : (
          filteredRequests
            .filter((req) => activeTab === 'all' || 
              (activeTab === 'pending' ? req.financialStatus !== 'completed' : req.financialStatus === 'completed'))
            .map((request) => (
              <div
                key={request.id}
                className={`bg-white rounded-lg border transition-all cursor-pointer p-4 hover:shadow-md ${
                  selectedRequest?.id === request.id
                    ? 'border-blue-300 shadow-md bg-blue-50 ring-2 ring-blue-100'
                    : 'border-gray-100 hover:border-blue-200'
                }`}
                onClick={() => handleSelectRequest(request)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{request.employeeName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{request.id.substring(0, 10)}</p>
                  </div>
                  {getPriorityBadge(request.priority)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe size={15} className="mr-2 text-gray-400" />
                    <span>{request.city}, {request.country}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={15} className="mr-2 text-gray-400" />
                    <span>
                      {format(request.departureDate, "MMM d")} - {format(request.returnDate, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium">
                      {request.currency}
                    </span>
                    {request.financialStatus === "completed" && request.perDiemAmount && (
                      <span className="text-xs font-medium text-green-600">
                        {formatCurrency(request.perDiemAmount, request.currency)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      request.financialStatus === "completed" 
                        ? "text-green-700 bg-green-50" 
                        : "text-amber-700 bg-amber-50"
                    }`}>
                      {request.financialStatus === "completed" ? "Paid" : "Pending"}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {request.financialStatus === "completed" && request.paymentDate 
                        ? format(request.paymentDate, "MMM d, yyyy")
                        : format(request.approvedAt, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default FinancialRequests;