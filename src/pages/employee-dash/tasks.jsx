import { useState, useRef, useEffect } from 'react';

// Modern Bar Chart component with enhanced UI/UX
const BarChartComponent = ({ title, total, items, subtitle }) => {
  // Professional color palette
  const blueColors = [
    "bg-blue-600", // Darkest blue
    "bg-blue-500",
    "bg-blue-400",
    "bg-blue-300"  // Lightest blue
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-100 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-gray-900 font-semibold text-lg">{title}</h3>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-50 text-blue-700 font-semibold py-1 px-3 rounded-full text-sm">
            Total: {total}
          </span>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 12a1 1 0 100-2 1 1 0 000 2zM10 12a1 1 0 100-2 1 1 0 000 2zM15 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Bar Chart Container with enhanced styling */}
      <div className="relative h-60 flex items-end justify-between px-6 mt-10 pt-6 mb-3">
        {items.map((item, index) => {
          // Calculate percentage of total
          const percentage = Math.round((item.value / total) * 100);
          
          // Map height based on percentage value (scaled for visual appeal)
          const barHeight = Math.max(40, percentage * 2); 
          
          return (
            <div key={index} className="flex flex-col items-center group">
              {/* Percentage label above bar with tooltip effect */}
              <div className="absolute top-0 text-gray-800 font-semibold bg-gray-50 px-2 py-0.5 rounded shadow-sm border border-gray-100 transition-all duration-200 group-hover:bg-blue-50 group-hover:border-blue-100">
                {percentage}%
              </div>
              
              {/* Vertical bar with hover effect */}
              <div className="relative" style={{ height: `${barHeight}px` }}>
                <div 
                  className={`w-14 ${blueColors[index % blueColors.length]} rounded-full transition-all duration-300 group-hover:opacity-90 group-hover:shadow-md`}
                  style={{ 
                    height: '100%',
                    minHeight: '30px'
                  }}
                ></div>
              </div>
              
              {/* Label below bar */}
              <div className="text-gray-600 font-medium text-sm mt-3 transition-colors duration-200 group-hover:text-gray-900">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Light grid lines */}
      <div className="relative h-0.5 bg-gray-100 w-full mt-1 mb-1 rounded-full"></div>
    </div>
  );
};

// Enhanced Status Item Component with Carousel Navigation
const StatusItemComponent = ({ title, total, items, onAction }) => {
  // Professional color mapping with gradient effects
  const colorMap = {
    error: "from-red-500 to-red-400",
    warning: "from-amber-500 to-amber-400",
    success: "from-green-500 to-green-400",
    info: "from-blue-500 to-blue-400"
  };
  
  const bgColorMap = {
    error: "bg-red-50",
    warning: "bg-amber-50",
    success: "bg-green-50",
    info: "bg-blue-50"
  };
  
  const textColorMap = {
    error: "text-red-700",
    warning: "text-amber-700",
    success: "text-green-700",
    info: "text-blue-700"
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-3">
          <h3 className="text-gray-800 font-medium">{title}</h3>
          <span className={`${bgColorMap[items[0]?.color || 'info']} ${textColorMap[items[0]?.color || 'info']} text-xs px-2 py-0.5 rounded-md font-medium`}>
            {items.length} items
          </span>
        </div>
        <div className="flex items-center">
          <span className="bg-gray-100 text-gray-800 font-semibold py-1 px-3 rounded-full text-sm">
            {total}
          </span>
          {onAction && (
            <button onClick={onAction} className="ml-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        {/* Bar Chart */}
        <div className="h-48 flex items-end justify-around">
          {items.map((item, index) => {
            // Calculate percentage
            const percentage = Math.round((item.value / total) * 100);
            
            // Set bar height (minimum 30px for visibility)
            const barHeight = Math.max(30, percentage * 2);
            
            return (
              <div key={index} className="flex flex-col items-center group">
                {/* Percentage above bar */}
                <div className="mb-2 text-gray-700 font-semibold bg-gray-50 px-2 py-0.5 rounded shadow-sm transition-all duration-200 group-hover:bg-blue-50">
                  {percentage}%
                </div>
                
                {/* Bar with gradient and hover effect */}
                <div className="w-16 flex justify-center" style={{ height: `${barHeight}px` }}>
                  <div 
                    className={`w-12 bg-gradient-to-b ${colorMap[item.color]} rounded-full shadow-sm transition-all duration-300 group-hover:shadow group-hover:opacity-90`}
                    style={{ height: '100%' }}
                  ></div>
                </div>
                
                {/* Label below bar with tooltip effect */}
                <div className="mt-3 text-gray-600 text-sm text-center w-20 font-medium truncate group-hover:text-gray-900 transition-colors duration-200 relative">
                  {item.label}
                  <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-all duration-200">
                    {item.value} items
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Carousel component for charts
const ChartCarousel = ({ charts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? charts.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === charts.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = currentIndex * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);
  
  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
        <button 
          onClick={goToPrevious}
          className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-blue-600 transition-colors duration-200 border border-gray-200 hover:border-blue-200 focus:outline-none"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
        <button 
          onClick={goToNext}
          className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-blue-600 transition-colors duration-200 border border-gray-200 hover:border-blue-200 focus:outline-none"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Carousel Track */}
      <div 
        ref={carouselRef}
        className="overflow-hidden"
      >
        <div className="flex transition-transform duration-500">
          {charts.map((chart, index) => (
            <div key={index} className="min-w-full flex-shrink-0 px-4">
              {chart}
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicator Dots */}
      <div className="flex justify-center mt-4">
        {charts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`mx-1 h-2 w-2 rounded-full transition-colors duration-200 focus:outline-none ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Carousel component for status items
const StatusCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = currentIndex * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);
  
  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
        <button 
          onClick={goToPrevious}
          className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-blue-600 transition-colors duration-200 border border-gray-200 hover:border-blue-200 focus:outline-none"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
        <button 
          onClick={goToNext}
          className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-blue-600 transition-colors duration-200 border border-gray-200 hover:border-blue-200 focus:outline-none"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Carousel Track */}
      <div 
        ref={carouselRef}
        className="overflow-hidden"
      >
        <div className="flex transition-transform duration-500">
          {items.map((item, index) => (
            <div key={index} className="min-w-full flex-shrink-0 px-4">
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicator Dots */}
      <div className="flex justify-center mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`mx-1 h-2 w-2 rounded-full transition-colors duration-200 focus:outline-none ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Main dashboard component with enhanced UI
export default function TaskDashboard() {
  const [activeTab, setActiveTab] = useState('tasks');
  
  // Example data matching the reference image
  const barChartData = [
    { label: "Category 1", value: 38 },
    { label: "Category 2", value: 27 },
    { label: "Category 3", value: 23 },
    { label: "Category 4", value: 12 }
  ];

  // Charts for the carousel
  const chartComponents = [
    <BarChartComponent 
      key="revenue"
      title="Revenue Distribution" 
      subtitle="Annual breakdown by category"
      total={100} 
      items={barChartData} 
    />,
    <BarChartComponent 
      key="resources"
      title="Resource Allocation" 
      subtitle="Department distribution"
      total={100} 
      items={[
        { label: "Engineering", value: 45 },
        { label: "Marketing", value: 30 },
        { label: "Operations", value: 15 },
        { label: "Support", value: 10 }
      ]} 
    />,
    <BarChartComponent 
      key="expenses"
      title="Expense Categories" 
      subtitle="Q2 breakdown"
      total={100} 
      items={[
        { label: "Payroll", value: 55 },
        { label: "Facilities", value: 20 },
        { label: "Software", value: 15 },
        { label: "Travel", value: 10 }
      ]} 
    />
  ];

  // Status items for the carousel
  const statusItems = [
    <StatusItemComponent
      key="requisitions"
      title="Requisitions to Approve"
      total={8}
      items={[
        { label: "High Priority", value: 3, color: "error" },
        { label: "Medium Priority", value: 4, color: "warning" },
        { label: "Low Priority", value: 1, color: "success" },
      ]}
      onAction={() => console.log('Action on Requisitions')}
      isNew={true}
    />,
    <StatusItemComponent
      key="pendingRequests"
      title="My Pending Requests"
      total={5}
      items={[
        { label: "Awaiting Approval", value: 3, color: "warning" },
        { label: "In Progress", value: 2, color: "info" },
      ]}
      onAction={() => console.log('Action on Pending Requests')}
    />,
    <StatusItemComponent
      key="travelApprovals"
      title="Travel Approvals"
      total={4}
      items={[
        { label: "Pending", value: 2, color: "warning" },
        { label: "Approved", value: 1, color: "success" },
        { label: "Rejected", value: 1, color: "error" },
      ]}
      onAction={() => console.log('Action on Travel Approvals')}
    />
  ];
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 w-full h-full">
      {/* Header with subtle gradient border */}
      <div className="px-6 py-5 border-b border-gray-100 relative bg-white">
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Tasks Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Track your progress and activities</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Clean professional style */}
      <div className="flex border-b border-gray-200 bg-white">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 text-sm font-medium transition-all duration-200 relative ${
            activeTab === 'tasks' 
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          My Tasks
          {activeTab === 'tasks' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('charts')}
          className={`flex-1 py-3 text-sm font-medium transition-all duration-200 relative ${
            activeTab === 'charts' 
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Data Charts
          {activeTab === 'charts' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          )}
        </button>
      </div>
      
      {/* Content area with equal height to match QuickActions */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {activeTab === 'charts' && (
          <div className="p-4 relative">
            <ChartCarousel charts={chartComponents} />
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div className="p-4">
            <StatusCarousel items={statusItems} />
          </div>
        )}
      </div>
      
      {/* Footer with subtle gradient */}
      <div className="relative">
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              Last updated 5 minutes ago
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200">
              View All Tasks 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
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