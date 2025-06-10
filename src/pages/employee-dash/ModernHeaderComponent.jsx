import React, { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate ,useSearchParams } from "react-router-dom";
import {
  Bell,
  Calendar,
  HelpCircle,
  Bot,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Flag,
  TrendingUp,
  FileText,
  Building,
  ChevronLeft,
  ChevronRight,
  Star,
  Search,
  Filter,
  MoreHorizontal,
  Zap,
  Shield
} from "lucide-react";
import { format, isAfter, isBefore, addDays, isToday, isSameDay } from 'date-fns';

// Modern Header Component - Fixed positioning and responsive layout
const ModernHeaderComponent = ({ 
  user, 
  notificationCount = 3,
  onNotificationClick,
  onHelpClick,
  onAssistantClick,
  onPreferencesClick,
  onProfileClick,
  onSettingsClick,
  onSignOutClick,
  onMobileMenuToggle,
  scrollPosition = 0,
  importantDates = [],
  sidebarOpen = true, // New prop to track sidebar state
  sidebarWidth = 256, // New prop for sidebar width
  collapsedSidebarWidth = 70 // New prop for collapsed sidebar width
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'dashboard';
  });

  // Calculate header transparency based on scroll
  const headerOpacity = Math.min(scrollPosition / 100, 0.95);
  const blur = Math.min(scrollPosition / 10, 20);

  // Calculate proper positioning based on sidebar state
  const getHeaderLeftPosition = () => {
    // On mobile, header should span full width
    if (window.innerWidth < 768) return 0;
    // On desktop, account for sidebar width
    return sidebarOpen ? sidebarWidth : collapsedSidebarWidth;
  };

  const getHeaderWidth = () => {
    // On mobile, header should span full width
    if (window.innerWidth < 768) return '100%';
    // On desktop, subtract sidebar width from total width
    const sidebarWidthToUse = sidebarOpen ? sidebarWidth : collapsedSidebarWidth;
    return `calc(100% - ${sidebarWidthToUse}px)`;
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`?section=${section}`, { replace: true });
  };

  // Default dates if none provided
  const IMPORTANT_DATES = importantDates.length > 0 ? importantDates : [
    { 
      date: new Date(2025, 4, 15), 
      title: "Vendor Proposal Deadline", 
      type: "deadline", 
      description: "Final date for vendors to submit proposals for Q2 IT equipment", 
      location: "Procurement Portal", 
      priority: "high" 
    },
    { 
      date: new Date(2025, 4, 17), 
      title: "Procurement Meeting", 
      type: "meeting", 
      description: "Team meeting to review vendor proposals", 
      location: "Conference Room A", 
      time: "10:00 AM", 
      priority: "medium" 
    },
    { 
      date: new Date(2025, 4, 20), 
      title: "Contract Renewal", 
      type: "contract", 
      description: "Office supplies contract renewal", 
      location: "Legal Department", 
      priority: "medium" 
    }
  ];

  // Get upcoming events
  const upcomingEvents = IMPORTANT_DATES.filter(event => 
    isAfter(event.date, new Date()) && 
    isBefore(event.date, addDays(new Date(), 7))
  ).sort((a, b) => a.date - b.date);

  // Toggle functions
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    onMobileMenuToggle?.(!mobileMenuOpen);
  };

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleCalendar = () => setCalendarOpen(!calendarOpen);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false);
      setCalendarOpen(false);
      setMobileMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Event type styling
  const getEventTypeStyle = (type) => {
    switch (type) {
      case 'deadline':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'meeting':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contract':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approval':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'deadline':
        return <Flag size={14} />;
      case 'meeting':
        return <Clock size={14} />;
      case 'contract':
        return <FileText size={14} />;
      case 'review':
        return <TrendingUp size={14} />;
      case 'approval':
        return <CheckCircle size={14} />;
      default:
        return <Calendar size={14} />;
    }
  };

  // Listen for window resize to recalculate header positioning
 useEffect(() => {
    const handleResize = () => {
      // Force re-render on resize to recalculate positioning
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
      setCalendarOpen(false);
    };

    const handleSidebarToggle = () => {
      // Force re-render when sidebar toggles
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
      setCalendarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Main Header - Fixed positioning with proper sidebar offset */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 z-50 transition-all duration-300"
        style={{
          left: getHeaderLeftPosition(),
          width: getHeaderWidth(),
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
          backdropFilter: `blur(${blur}px)`,
          borderBottom: headerOpacity > 0.1 ? '1px solid rgba(229, 231, 235, 0.8)' : 'none'
        }}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button - Only show on mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>

               {/* Date & Calendar */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCalendar();
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 border border-blue-200"
                >
                  <Calendar size={16} />
                  <span className="text-sm font-medium hidden sm:inline">
                    {format(new Date(), 'MMM d, yyyy')}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${calendarOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Calendar Dropdown */}
                <AnimatePresence>
                  {calendarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Calendar Header */}
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Calendar size={18} />
                            Calendar
                          </h3>
                          <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                            {format(new Date(), 'MMMM yyyy')}
                          </span>
                        </div>
                      </div>

                      {/* Upcoming Events */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Clock size={16} className="text-blue-600" />
                            Upcoming Events
                          </h4>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {upcomingEvents.length}
                          </span>
                        </div>

                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {upcomingEvents.length > 0 ? (
                            upcomingEvents.map((event, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setEventDetailsOpen(true);
                                  setCalendarOpen(false);
                                }}
                              >
                                <div className={`p-1.5 rounded-lg ${getEventTypeStyle(event.type)}`}>
                                  {getEventIcon(event.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-gray-900 text-sm truncate">
                                    {event.title}
                                  </h5>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-600">
                                      {format(event.date, 'MMM d')}
                                    </span>
                                    {event.time && (
                                      <>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-xs text-gray-600">{event.time}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  event.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {event.priority}
                                </span>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-gray-500">
                              <Calendar size={24} className="mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No upcoming events</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Calendar Footer */}
                      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">Deadline</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">Meeting</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setCalendarOpen(false)}
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNotificationClick}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </motion.button>

             
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Quick Actions - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onHelpClick}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Help Center"
                >
                  <HelpCircle size={18} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAssistantClick}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                  title="AI Assistant"
                >
                  <Bot size={18} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPreferencesClick}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                  title="Settings"
                >
                  <Settings size={18} />
                </motion.button>
              </div>

              {/* User Profile */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleUserMenu();
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-medium text-sm">
  {user?.firstName && user?.lastName
    ? `${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`
    : user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : user?.lastName
    ? user.lastName.charAt(0).toUpperCase()
    : "G"}
</div>


                  <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2">
                        <button
                          onClick={() => {
                            onProfileClick?.();
                            setUserMenuOpen(false);
                            handleSectionChange("user-profile");
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <User size={16} />
                          <span className="text-sm">Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            onSettingsClick?.();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <Settings size={16} />
                          <span className="text-sm">Settings</span>
                        </button>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={() => {
                            onSignOutClick?.();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <LogOut size={16} />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm"
            >
              <div className="px-4 py-3 space-y-2">
                <button
                  onClick={onHelpClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <HelpCircle size={18} />
                  <span>Help Center</span>
                </button>
                <button
                  onClick={onAssistantClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <Bot size={18} />
                  <span>AI Assistant</span>
                </button>
                <button
                  onClick={onPreferencesClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <Settings size={18} />
                  <span>Preferences</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Event Details Modal */}
      <AnimatePresence>
        {eventDetailsOpen && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEventDetailsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Event Header */}
              <div className={`p-6 text-white ${
                selectedEvent.type === 'deadline' ? 'bg-gradient-to-r from-red-600 to-red-700' :
                selectedEvent.type === 'meeting' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                selectedEvent.type === 'contract' ? 'bg-gradient-to-r from-purple-600 to-purple-700' :
                selectedEvent.type === 'review' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700' :
                selectedEvent.type === 'approval' ? 'bg-gradient-to-r from-green-600 to-green-700' :
                'bg-gradient-to-r from-gray-600 to-gray-700'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">
                      {selectedEvent.type?.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-semibold mb-2">{selectedEvent.title}</h3>
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar size={16} />
                      <span className="text-sm">
                        {format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}
                        {selectedEvent.time && ` • ${selectedEvent.time}`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEventDetailsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 space-y-4">
                {selectedEvent.location && (
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600 text-sm">{selectedEvent.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Description</p>
                    <p className="text-gray-600 text-sm">{selectedEvent.description}</p>
                  </div>
                </div>

                {selectedEvent.priority && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    selectedEvent.priority === 'high' ? 'bg-red-50 border border-red-200' :
                    selectedEvent.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <AlertTriangle size={16} className={
                      selectedEvent.priority === 'high' ? 'text-red-600' :
                      selectedEvent.priority === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    } />
                    <span className={`text-sm font-medium ${
                      selectedEvent.priority === 'high' ? 'text-red-700' :
                      selectedEvent.priority === 'medium' ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>
                      {selectedEvent.priority === 'high' ? 'High Priority' :
                       selectedEvent.priority === 'medium' ? 'Medium Priority' :
                       'Low Priority'}
                    </span>
                  </div>
                )}
              </div>

              {/* Event Actions */}
              <div className="p-6 pt-0 flex items-center justify-end gap-3">
                <button
                  onClick={() => setEventDetailsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => setEventDetailsOpen(false)}
                  className={`px-4 py-2 text-white rounded-lg transition-all duration-200 ${
                    selectedEvent.type === 'deadline' ? 'bg-red-600 hover:bg-red-700' :
                    selectedEvent.type === 'meeting' ? 'bg-blue-600 hover:bg-blue-700' :
                    selectedEvent.type === 'contract' ? 'bg-purple-600 hover:bg-purple-700' :
                    selectedEvent.type === 'review' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    selectedEvent.type === 'approval' ? 'bg-green-600 hover:bg-green-700' :
                    'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  View Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Global Styles Component
const GlobalStyles = () => (
  <style jsx global>{`
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.4;
      }
    }
    
    @keyframes ripple {
      0% {
        transform: scale(1);
        opacity: 0.8;
      }
      100% {
        transform: scale(1.3);
        opacity: 0;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-pulse-custom {
      animation: pulse 2s infinite;
    }

    .animate-ripple {
      animation: ripple 3s infinite;
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    /* Custom scrollbar for dropdown menus */
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 2px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 2px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Smooth transitions for all interactive elements */
    .transition-smooth {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Backdrop blur support */
    .backdrop-blur-custom {
      backdrop-filter: blur(12px) saturate(180%);
      -webkit-backdrop-filter: blur(12px) saturate(180%);
    }

    /* Focus styles for accessibility */
    .focus-ring:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    /* Hover effects for buttons */
    .btn-hover:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Loading spinner animation */
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin-slow {
      animation: spin 3s linear infinite;
    }

    /* Gradient animations */
    @keyframes gradient-shift {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }

    .gradient-animate {
      background-size: 200% 200%;
      animation: gradient-shift 6s ease infinite;
    }

    /* Text shimmer effect */
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }

    .text-shimmer {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
      background-size: 400px 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .dark-mode-bg {
        background-color: #1f2937;
        color: #f9fafb;
      }
      
      .dark-mode-border {
        border-color: #374151;
      }
      
      .dark-mode-text {
        color: #d1d5db;
      }
    }

    /* Mobile-specific styles */
    @media (max-width: 768px) {
      .mobile-optimized {
        padding: 0.75rem;
      }
      
      .mobile-text {
        font-size: 0.875rem;
      }
      
      .mobile-button {
        min-height: 44px;
        min-width: 44px;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .high-contrast {
        border: 2px solid currentColor;
      }
      
      .high-contrast-text {
        font-weight: 600;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Print styles */
    @media print {
      .no-print {
        display: none !important;
      }
      
      .print-friendly {
        background: white !important;
        color: black !important;
        box-shadow: none !important;
      }
    }
  `}</style>
);

// Export both components
export { ModernHeaderComponent, GlobalStyles };
export default ModernHeaderComponent;