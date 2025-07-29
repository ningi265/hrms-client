import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  ClipboardList, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  Star,
  Search,
  Settings,
  Activity,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap
} from 'lucide-react';

// Modern Bar Chart component with enhanced UI/UX matching QuickActions style
const BarChartComponent = ({ title, total, items, subtitle }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Professional color palette matching QuickActions
  const blueColors = [
    "bg-blue-600", 
    "bg-blue-500",
    "bg-blue-400",
    "bg-blue-300"
  ];
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-500" />
            {title}
          </h3>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-50 text-blue-700 font-semibold py-1 px-3 rounded-full text-sm border border-blue-100">
            Total: {total}
          </span>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200">
            <Settings size={16} />
          </button>
        </div>
      </div>
      
      {/* Bar Chart Container with enhanced styling */}
      <div className="relative h-48 flex items-end justify-between px-4 mt-8 pt-6 mb-3">
        {items.map((item, index) => {
          const percentage = Math.round((item.value / total) * 100);
          const barHeight = Math.max(30, percentage * 1.5); 
          
          return (
            <div key={index} className="flex flex-col items-center group">
              {/* Percentage label above bar with tooltip effect */}
              <div className="absolute -top-6 text-gray-800 font-semibold bg-gray-50 px-2 py-0.5 rounded shadow-sm border border-gray-100 transition-all duration-200 group-hover:bg-blue-50 group-hover:border-blue-100">
                {percentage}%
              </div>
              
              {/* Vertical bar with hover effect */}
              <div className="relative" style={{ height: `${barHeight}px` }}>
                <div 
                  className={`w-12 ${blueColors[index % blueColors.length]} rounded-lg transition-all duration-300 group-hover:opacity-90 group-hover:shadow-md group-hover:scale-105`}
                  style={{ 
                    height: animate ? '100%' : '0%',
                    minHeight: '20px',
                    transition: 'height 0.8s ease-out'
                  }}
                ></div>
              </div>
              
              {/* Label below bar */}
              <div className="text-gray-600 font-medium text-sm mt-3 transition-all duration-200 group-hover:text-gray-900 group-hover:translate-y-[-2px]">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Light grid line */}
      <div className="relative h-0.5 bg-gray-100 w-full mt-1 mb-1 rounded-full"></div>
    </div>
  );
};

// Enhanced Status Item Component matching QuickActions button style
const StatusItemComponent = ({ title, total, items, onAction, trend }) => {
  const getStatusIcon = (color) => {
    switch(color) {
      case 'error': return <XCircle size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      case 'success': return <CheckCircle size={16} />;
      case 'info': return <Clock size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getStatusColor = (color) => {
    switch(color) {
      case 'error': return 'red';
      case 'warning': return 'amber';
      case 'success': return 'green';
      case 'info': return 'blue';
      default: return 'gray';
    }
  };

  const renderTrendIndicator = (trend) => {
    if (trend === "up") {
      return <div className="flex items-center text-emerald-600 text-xs"><ArrowRight size={12} className="rotate-[-45deg]" /> <span className="ml-0.5">+12%</span></div>;
    } else if (trend === "down") {
      return <div className="flex items-center text-rose-600 text-xs"><ArrowRight size={12} className="rotate-45deg" /> <span className="ml-0.5">-8%</span></div>;
    }
    return null;
  };
  
  return (
    <button 
      onClick={onAction}
      className="w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-all duration-200 ease-in-out group relative overflow-hidden border-b border-gray-100 last:border-b-0"
    >
      {/* Subtle highlight effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-purple-50/0 opacity-0 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none"></div>
      
      <span className={`flex items-center justify-center w-12 h-12 rounded-lg bg-${getStatusColor(items[0]?.color || 'blue')}-50 text-${getStatusColor(items[0]?.color || 'blue')}-600 group-hover:scale-105 transition-all duration-200 ease-in-out shadow-sm border border-${getStatusColor(items[0]?.color || 'blue')}-100`}>
        {getStatusIcon(items[0]?.color)}
      </span>
      
      <div className="ml-4 text-left flex-grow">
        <span className="text-gray-800 font-medium block group-hover:translate-x-1 transition-transform duration-200">
          {title}
        </span>
        <div className="flex items-center mt-0.5 space-x-2">
          <span className="text-gray-500 text-sm group-hover:translate-x-1 transition-transform duration-200 delay-75">
            {items.length} items • Total: {total}
          </span>
          {trend && renderTrendIndicator(trend)}
        </div>
      </div>
      
      {/* Status badges */}
      <div className="flex items-center space-x-2 mr-2">
        {items.slice(0, 3).map((item, index) => (
          <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(item.color)}-50 text-${getStatusColor(item.color)}-700 border border-${getStatusColor(item.color)}-100`}>
            {item.value}
          </span>
        ))}
      </div>
      
      <div className="ml-2 p-2 rounded-full text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-100 transition-all duration-200 ease-in-out transform group-hover:translate-x-1">
        <ChevronRight size={16} />
      </div>
    </button>
  );
};

// Main dashboard component with QuickActions styling
export default function TaskDashboard() {
  const [activeTab, setActiveTab] = useState('charts');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // Animation effect
  useEffect(() => {
    setAnimate(true);
    return () => setAnimate(false);
  }, []);
  
  // Example data matching the reference image
  const barChartData = [
    { label: "Category 1", value: 38 },
    { label: "Category 2", value: 27 },
    { label: "Category 3", value: 23 },
    { label: "Category 4", value: 12 }
  ];

  // Charts data
  const chartItems = [
    {
      id: "revenue",
      title: "Revenue Distribution",
      subtitle: "Annual breakdown by category",
      total: 100,
      items: barChartData,
      trend: "up"
    },
    {
      id: "resources",
      title: "Resource Allocation",
      subtitle: "Department distribution",
      total: 100,
      items: [
        { label: "Engineering", value: 45 },
        { label: "Marketing", value: 30 },
        { label: "Operations", value: 15 },
        { label: "Support", value: 10 }
      ],
      trend: "up"
    },
    {
      id: "expenses",
      title: "Expense Categories",
      subtitle: "Q2 breakdown",
      total: 100,
      items: [
        { label: "Payroll", value: 55 },
        { label: "Facilities", value: 20 },
        { label: "Software", value: 15 },
        { label: "Travel", value: 10 }
      ],
      trend: "stable"
    }
  ];

  // Status items
  const statusItems = [
    {
      id: "requisitions",
      title: "Requisitions to Approve",
      total: 8,
      items: [
        { label: "High Priority", value: 3, color: "error" },
        { label: "Medium Priority", value: 4, color: "warning" },
        { label: "Low Priority", value: 1, color: "success" },
      ],
      trend: "up"
    },
    {
      id: "pending-requests",
      title: "My Pending Requests",
      total: 5,
      items: [
        { label: "Awaiting Approval", value: 3, color: "warning" },
        { label: "In Progress", value: 2, color: "info" },
      ],
      trend: "stable"
    },
    {
      id: "travel-approvals",
      title: "Travel Approvals",
      total: 4,
      items: [
        { label: "Pending", value: 2, color: "warning" },
        { label: "Approved", value: 1, color: "success" },
        { label: "Rejected", value: 1, color: "error" },
      ],
      trend: "down"
    },
    {
      id: "expense-reports",
      title: "Expense Reports",
      total: 6,
      items: [
        { label: "Draft", value: 2, color: "info" },
        { label: "Submitted", value: 3, color: "warning" },
        { label: "Approved", value: 1, color: "success" },
      ],
      trend: "up"
    }
  ];

  // Filter items based on search
  const filteredTasks = searchQuery 
    ? statusItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : statusItems;

  const filteredCharts = searchQuery 
    ? chartItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chartItems;
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 w-full h-full flex flex-col">
      {/* Header with subtle gradient border - matching QuickActions exactly */}
      <div className="px-4 py-3 border-b border-gray-100 relative bg-white">
        <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`}></div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Zap size={20} className="text-purple-500" /> 
              My Tasks Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">Track your progress and activities with intelligent insights</p>
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
        
        {/* Search field - matching QuickActions */}
        {showSearch && (
          <div className="mt-4 flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 transition-all duration-300">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks and charts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-800 w-full pl-2 placeholder-gray-400 text-sm"
            />
          </div>
        )}
      </div>

      {/* Tab Navigation - matching QuickActions style exactly */}
      <div className="flex border-b border-gray-200 bg-white">
        {["tasks", "charts", "favorites"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-all duration-200 relative ${
              activeTab === tab 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab === "tasks" && <ClipboardList size={16} className="inline mr-2" />}
            {tab === "charts" && <BarChart3 size={16} className="inline mr-2" />}
            {tab === "favorites" && <Star size={16} className="inline mr-2" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Content for Active Tab - matching QuickActions scrollable area */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">

          {activeTab === 'charts' && (
          <div className="p-4 space-y-4">
            {filteredCharts.map((chart, index) => (
              <BarChartComponent 
                key={chart.id}
                title={chart.title}
                subtitle={chart.subtitle}
                total={chart.total}
                items={chart.items}
              />
            ))}
          </div>
        )}
        {activeTab === 'tasks' && (
          <div className="divide-y divide-gray-100">
            {filteredTasks.map((item) => (
              <StatusItemComponent
                key={item.id}
                title={item.title}
                total={item.total}
                items={item.items}
                trend={item.trend}
                onAction={() => console.log(`Action on ${item.title}`)}
              />
            ))}
          </div>
        )}
        
      
        
        {activeTab === 'favorites' && (
          <div className="divide-y divide-gray-100">
            {filteredTasks.slice(0, 2).map((item) => (
              <button 
                key={item.id}
                className="w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-all duration-200 ease-in-out group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-purple-50/0 opacity-0 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none"></div>
                
                <span className={`flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-105 transition-all duration-200 ease-in-out shadow-sm border border-purple-100`}>
                  <Star size={16} />
                </span>
                <span className="ml-4 text-gray-800 font-medium flex-grow text-left group-hover:translate-x-1 transition-transform duration-200">
                  {item.title}
                </span>
                
                {/* Usage meter */}
                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400" 
                    style={{width: `${Math.random() * 40 + 60}%`}}
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
      
      {/* Footer with subtle gradient - matching QuickActions exactly */}
      <div className="relative">
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500 text-sm">
              <Activity size={16} className="mr-1" />
              <span>8 pending approvals</span>
            </div>
            <button className="text-sm font-medium flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow group">
              View All Tasks
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Add custom scrollbar styles - matching QuickActions */}
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
}