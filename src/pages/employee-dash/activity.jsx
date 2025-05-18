import React, { useState, useEffect } from 'react';
import { CheckCircle, AlarmClock, AlertCircle, ChevronRight, Clock, Activity, Sparkles } from 'lucide-react';

const ActivityChangelogComponent = () => {
  const [animate, setAnimate] = useState(false);
  
  // Animation effect
  useEffect(() => {
    setAnimate(true);
    return () => setAnimate(false);
  }, []);

  const activities = [
    {
      id: 1,
      title: "Requisition Approved",
      description: "Office supplies #REQ-2023-042 approved",
      time: "2 hours ago",
      icon: <CheckCircle size={18} />,
      color: "emerald",
      status: "completed"
    },
    {
      id: 2,
      title: "Travel Request Submitted",
      description: "Conference trip to New York submitted",
      time: "Yesterday",
      icon: <AlarmClock size={18} />,
      color: "blue",
      status: "in-progress"
    },
    {
      id: 3,
      title: "Expense Report Rejected",
      description: "Hotel expenses #EXP-2023-15 needs revision",
      time: "3 days ago",
      icon: <AlertCircle size={18} />,
      color: "rose",
      status: "pending"
    }
  ];

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

  return (
    <div className={`bg-white rounded-xl overflow-hidden border border-gray-200 max-w-md shadow-lg ${animate ? 'shadow-lg shadow-gray-200/50' : ''} transition-all duration-300`}>
      {/* Header with subtle gradient border */}
      <div className="px-6 py-5 border-b border-gray-100 relative">
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" /> 
              Activity Timeline
            </h2>
            <p className="text-sm text-gray-500 mt-1">Track your workflow progress</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100 flex items-center">
            <Sparkles size={14} className="mr-1" />
            New Activity
          </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Timeline line - more distinctive */}
        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100"></div>
        
        <ul className="relative z-10">
          {activities.map((activity) => (
            <li 
              key={activity.id} 
              className="px-6 py-4 hover:bg-gray-50 transition-all duration-200 ease-in-out group relative overflow-hidden cursor-pointer"
            >
              {/* Subtle highlight effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-purple-50/0 opacity-0 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none"></div>
              
              <div className="flex items-start">
                <span className={`flex items-center justify-center w-10 h-10 rounded-lg bg-${activity.color}-50 text-${activity.color}-600 group-hover:scale-105 transition-all duration-200 ease-in-out shadow-sm border border-${activity.color}-100`}>
                  {activity.icon}
                </span>
                <div className="ml-4 flex-1 group-hover:translate-x-1 transition-transform duration-200">
                  <div className="flex items-center text-gray-500 text-xs mb-1">
                    <Clock size={14} className="mr-1" />
                    <span>{activity.time}</span>
                  </div>
                  <div className="text-gray-800 text-base font-medium mb-1">
                    {activity.title}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {activity.description}
                  </div>
                </div>
                <div className="ml-2">
                  {renderStatusIndicator(activity.status)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="relative">
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500 text-sm">
              <Activity size={16} className="mr-1" />
              <span>3 recent activities</span>
            </div>
            <button className="text-sm font-medium flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow group">
              View All
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
      
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

export default ActivityChangelogComponent;