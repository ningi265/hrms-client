import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Receipt, 
  FileText, 
  UsersRound, 
  Clock, 
  ChevronRight,
  BarChart,
  Star,
  Search,
  Settings,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Activity,
  LayoutGrid
} from 'lucide-react';

const QuickActions = ({ handleSectionChange }) => {
  const [activeTab, setActiveTab] = useState('actions');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // Animation effect
  useEffect(() => {
    setAnimate(true);
    return () => setAnimate(false);
  }, []);
  
  const actionItems = [
    {
      id: "requisitions",
      title: "Create New Requisition",
      description: "Request new items or services for your department",
      icon: <Plus size={20} />,
      color: "blue",
      badge: null,
      trend: "up"
    },
    {
      id: "travel-requests",
      title: "Submit Travel Request",
      description: "Plan your business trip with detailed itinerary",
      icon: <CalendarDays size={20} />,
      color: "purple",
      badge: null,
      trend: "stable"
    },
    {
      id: "expense-reports",
      title: "Submit Expense Report",
      description: "Record and get reimbursed for business expenses",
      icon: <Receipt size={20} />,
      color: "teal",
      badge: "New",
      trend: "up"
    },
    {
      id: "team-meeting",
      title: "Schedule Team Meeting",
      description: "Coordinate with your team members",
      icon: <UsersRound size={20} />,
      color: "amber",
      badge: null,
      trend: "up"
    }
  ];

  const recentItems = [
    {
      id: "report-q1",
      title: "Q1 Financial Report",
      time: "2 hours ago",
      icon: <FileText size={20} />,
      color: "indigo",
      status: "completed"
    },
    {
      id: "travel-nyc",
      title: "NYC Conference Trip",
      time: "Yesterday",
      icon: <CalendarDays size={20} />,
      color: "purple",
      status: "in-progress"
    },
    {
      id: "team-budget",
      title: "Team Budget Review",
      time: "2 days ago",
      icon: <BarChart size={20} />,
      color: "green",
      status: "pending"
    }
  ];

  const favoriteItems = [
    {
      id: "monthly-report",
      title: "Monthly Department Report",
      icon: <FileText size={20} />,
      color: "rose",
      usage: "87%"
    },
    {
      id: "team-dashboard",
      title: "Team Performance Dashboard",
      icon: <BarChart size={20} />,
      color: "sky",
      usage: "92%"
    }
  ];

  const renderTrendIndicator = (trend) => {
    if (trend === "up") {
      return <div className="flex items-center text-emerald-600 text-xs"><ArrowRight size={12} className="rotate-[-45deg]" /> <span className="ml-0.5">+12%</span></div>;
    } else if (trend === "down") {
      return <div className="flex items-center text-rose-600 text-xs"><ArrowRight size={12} className="rotate-45deg" /> <span className="ml-0.5">-8%</span></div>;
    }
    return null;
  };
  
  const renderStatusIndicator = (status) => {
    if (status === "completed") {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Completed</span>;
    } else if (status === "in-progress") {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">In Progress</span>;
    } else if (status === "pending") {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Pending</span>;
    }
    return null;
  };
  
  // Filter items based on search
  const filteredActions = searchQuery 
    ? actionItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : actionItems;
  
  return (
   <div className="bg-white rounded-xl overflow-hidden border border-gray-200 w-full h-full flex flex-col">
      {/* Header with subtle gradient border */}
      <div className="px-4 py-3 border-b border-gray-100 relative bg-white">
        <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`}></div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles size={20} className="text-blue-500" /> 
              Quick Actions
            </h2>
            <p className="text-sm text-gray-500 mt-1">Streamline your workflow with AI-powered assistance</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
            >
              <Search size={18} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200">
              <Settings size={18} />
            </button>
          </div>
        </div>
        
        {/* Search field */}
        {showSearch && (
          <div className="mt-4 flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 transition-all duration-300">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-800 w-full pl-2 placeholder-gray-400 text-sm"
            />
          </div>
        )}
      </div>
      
      {/* Tab Navigation - Clean professional style */}
      <div className="flex border-b border-gray-200 bg-white">
        {["actions", "recent", "favorites"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-all duration-200 relative ${
              activeTab === tab 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab === "actions" && <LayoutGrid size={16} className="inline mr-2" />}
            {tab === "recent" && <Clock size={16} className="inline mr-2" />}
            {tab === "favorites" && <Star size={16} className="inline mr-2" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Content for Active Tab - clean white background */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {activeTab === 'actions' && (
          <div className="divide-y divide-gray-100">
            {filteredActions.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className="w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-all duration-200 ease-in-out group relative overflow-hidden"
              >
                {/* Subtle highlight effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-purple-50/0 opacity-0 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none"></div>
                
                <span className={`flex items-center justify-center w-12 h-12 rounded-lg bg-${item.color}-50 text-${item.color}-600 group-hover:scale-105 transition-all duration-200 ease-in-out shadow-sm border border-${item.color}-100`}>
                  {item.icon}
                </span>
                <div className="ml-4 text-left flex-grow">
                  <span className="text-gray-800 font-medium block group-hover:translate-x-1 transition-transform duration-200">
                    {item.title}
                  </span>
                  <span className="text-gray-500 text-sm block mt-0.5 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                    {item.description}
                  </span>
                  {item.trend && renderTrendIndicator(item.trend)}
                </div>
                {item.badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    {item.badge}
                  </span>
                )}
                <div className="ml-2 p-2 rounded-full text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-100 transition-all duration-200 ease-in-out transform group-hover:translate-x-1">
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'recent' && (
          <div className="divide-y divide-gray-100">
            {recentItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className="w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-all duration-200 ease-in-out group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-purple-50/0 opacity-0 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none"></div>
                
                <span className={`flex items-center justify-center w-10 h-10 rounded-lg bg-${item.color}-50 text-${item.color}-600 group-hover:scale-105 transition-all duration-200 ease-in-out shadow-sm border border-${item.color}-100`}>
                  {item.icon}
                </span>
                <div className="ml-4 text-left flex-grow">
                  <span className="text-gray-800 font-medium block group-hover:translate-x-1 transition-transform duration-200">
                    {item.title}
                  </span>
                  <div className="flex items-center mt-1 text-gray-500 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-gray-500 text-xs ml-1">{item.time}</span>
                  </div>
                </div>
                <div className="mr-2">
                  {renderStatusIndicator(item.status)}
                </div>
                <div className="p-2 rounded-full text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-100 transition-all duration-200 ease-in-out transform group-hover:translate-x-1">
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'favorites' && (
          <div className="divide-y divide-gray-100">
            {favoriteItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className="w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-all duration-200 ease-in-out group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-purple-50/0 opacity-0 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none"></div>
                
                <span className={`flex items-center justify-center w-10 h-10 rounded-lg bg-${item.color}-50 text-${item.color}-600 group-hover:scale-105 transition-all duration-200 ease-in-out shadow-sm border border-${item.color}-100`}>
                  {item.icon}
                </span>
                <span className="ml-4 text-gray-800 font-medium flex-grow text-left group-hover:translate-x-1 transition-transform duration-200">
                  {item.title}
                </span>
                
                {/* Usage meter */}
                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                  <div 
                    className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-400`} 
                    style={{width: item.usage}}
                  ></div>
                </div>
                
                <Star size={16} className="text-amber-400 mr-2" fill="#fbbf24" />
                <div className="p-2 rounded-full text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-100 transition-all duration-200 ease-in-out transform group-hover:translate-x-1">
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
            <div className="px-6 py-3 text-center">
              <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 flex items-center justify-center mx-auto">
                <Settings size={14} className="mr-1" />
                Manage Favorites
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer with subtle gradient */}
      <div className="relative">
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500 text-sm">
              <Activity size={16} className="mr-1" />
              <span>4 pending tasks</span>
            </div>
            <button 
              onClick={() => handleSectionChange("all-actions")}
              className="text-sm font-medium flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow group"
            >
              View All
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Notification Indicator -      <div className="absolute top-3 right-16">
        <button className="relative">
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white border-2 border-white">
            3
          </div>
          <AlertCircle size={20} className="text-gray-500" />
        </button>
      </div> */}

      
      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

export default QuickActions;