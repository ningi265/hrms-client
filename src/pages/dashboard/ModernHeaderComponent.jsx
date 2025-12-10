import React, { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
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
  Shield,
  Crown
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
  sidebarOpen = true,
  sidebarWidth = 256,
  collapsedSidebarWidth = 70
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'dashboard';
  });
  
  const backendUrl = import.meta.env.VITE_ENV === 'production'
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

  // Fetch subscription data on component mount
  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubscriptionLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/billing/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Helper function to determine subscription status
  const getSubscriptionStatus = () => {
    if (!user || !subscriptionData) return null;

    const subscription = subscriptionData.subscription;
    const trial = subscriptionData.trial;

    if (subscription && ['active', 'trialing'].includes(subscription.status) && subscription.plan !== 'trial') {
      return {
        type: 'paid',
        plan: subscription.plan,
        status: subscription.status
      };
    }

    if (trial && trial.isActive && trial.remainingDays > 0) {
      return {
        type: 'trial',
        remainingDays: trial.remainingDays,
        endDate: trial.endDate
      };
    }

    if (subscription && subscription.plan === 'trial' && (!trial || !trial.isActive)) {
      return {
        type: 'expired',
        message: 'Trial expired'
      };
    }

    return {
      type: 'free',
      message: 'Free plan'
    };
  };

  const subscriptionStatus = getSubscriptionStatus();

  useEffect(() => {
    if (!subscriptionLoading && subscriptionStatus?.type === 'expired') {
      if (!window.location.pathname.startsWith('/billing')) {
        navigate('/billing', { 
          state: { 
            subscriptionExpired: true,
            from: window.location.pathname 
          } 
        });
      }
    }
  }, [subscriptionStatus, subscriptionLoading, navigate]);

  // Calculate header transparency based on scroll
  const headerOpacity = Math.min(scrollPosition / 100, 0.95);
  const blur = Math.min(scrollPosition / 10, 20);

  // Mobile-responsive positioning
  const getHeaderLeftPosition = () => {
    if (isMobile) return 0;
    return sidebarOpen ? sidebarWidth : collapsedSidebarWidth;
  };

  const getHeaderWidth = () => {
    if (isMobile) return '100%';
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
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
      setCalendarOpen(false);
    };

    const handleSidebarToggle = () => {
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

  const renderSubscriptionBadge = () => {
    if (subscriptionLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1 px-2 py-1 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-600/50 shadow-lg animate-pulse"
        >
          <div className={`${isSmallMobile ? 'w-8' : 'w-16'} h-4 bg-gray-600 rounded`}></div>
        </motion.div>
      );
    }

    if (!subscriptionStatus) return null;

    // Mobile-optimized badge
    const getBadgeContent = () => {
      if (isSmallMobile) {
        switch (subscriptionStatus.type) {
          case 'paid':
            return (
              <>
                <Crown size={12} className="text-yellow-400" />
                <span className="text-xs text-green-400 font-semibold">Active</span>
              </>
            );
          case 'trial':
            return (
              <>
                <span className="text-xs text-blue-400 font-semibold">Trial</span>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                  {subscriptionStatus.remainingDays}
                </div>
              </>
            );
          case 'expired':
            return (
              <>
                <AlertTriangle size={12} className="text-white" />
                <span className="text-xs text-white font-semibold">Expired</span>
              </>
            );
          default:
            return (
              <span className="text-xs text-blue-400 font-semibold">Free</span>
            );
        }
      }

      // Desktop badge
      switch (subscriptionStatus.type) {
        case 'paid':
          return (
            <>
              <Crown size={14} className="text-yellow-400" />
              <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-200">
                {subscriptionStatus.plan.charAt(0).toUpperCase() + subscriptionStatus.plan.slice(1)} plan
              </span>
              <span className="text-gray-500 mx-1">•</span>
              <span className="text-sm font-semibold text-green-400 group-hover:text-green-300 transition-all duration-200">
                Active
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1"></div>
            </>
          );
        case 'trial':
          return (
            <>
              <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-200">
                Free trial
              </span>
              <span className="text-gray-500 mx-1">•</span>
              <span className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-all duration-200">
                Upgrade
              </span>
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                {subscriptionStatus.remainingDays}d
              </div>
            </>
          );
        case 'expired':
          return (
            <>
              <AlertTriangle size={14} className="text-white" />
              <span className="text-sm font-medium text-white group-hover:text-white transition-colors duration-200">
                Trial expired
              </span>
              <span className="text-white/50 mx-1">•</span>
              <span className="text-sm font-semibold text-white group-hover:text-white transition-all duration-200">
                Renew now
              </span>
            </>
          );
        default:
          return (
            <>
              <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-200">
                Free plan
              </span>
              <span className="text-gray-500 mx-1">•</span>
              <span className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-all duration-200">
                Upgrade
              </span>
            </>
          );
      }
    };

    const getBadgeStyles = () => {
      const baseStyles = "flex items-center gap-1 backdrop-blur-sm rounded-lg border shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer relative";
      
      switch (subscriptionStatus.type) {
        case 'paid':
          return `${baseStyles} px-2 py-1 bg-gray-800/90 border-gray-600/50 hover:shadow-green-500/20`;
        case 'trial':
          return `${baseStyles} px-2 py-1 bg-gray-800/90 border-gray-600/50 hover:shadow-blue-500/20`;
        case 'expired':
          return `${baseStyles} px-2 py-1 bg-red-600/90 border-red-700 hover:shadow-red-500/20`;
        default:
          return `${baseStyles} px-2 py-1 bg-gray-800/90 border-gray-600/50 hover:shadow-blue-500/20`;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={getBadgeStyles()}
        whileHover={{ 
          scale: 1.02,
          backgroundColor: subscriptionStatus.type === 'expired' ? "rgba(220, 38, 38, 0.95)" : "rgba(31, 41, 55, 0.95)"
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/billing")}
      >
        {getBadgeContent()}
      </motion.div>
    );
  };

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
        <div className={`mx-auto ${isMobile ? 'px-2' : 'px-4 sm:px-6 lg:px-8'}`}>
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 mobile-button"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            
              {/* Date & Calendar - Hidden on very small screens */}
              {!isSmallMobile && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCalendar();
                    }}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 border border-blue-200 mobile-button"
                  >
                    <Calendar size={isSmallMobile ? 14 : 16} />
                    <span className="text-xs sm:text-sm font-medium hidden xs:inline">
                      {format(new Date(), 'MMM d')}
                    </span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${calendarOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Calendar Dropdown - Mobile Optimized */}
                  <AnimatePresence>
                    {calendarOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full left-0 mt-2 ${
                          isMobile ? 'w-[90vw] max-w-[320px]' : 'w-80'
                        } bg-white rounded-xl shadow-xl border border-gray-200 z-50`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Calendar Header */}
                        <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                              <Calendar size={isMobile ? 16 : 18} />
                              Calendar
                            </h3>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                              {format(new Date(), 'MMM yyyy')}
                            </span>
                          </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2 text-sm">
                              <Clock size={14} className="text-blue-600" />
                              Upcoming Events
                            </h4>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {upcomingEvents.length}
                            </span>
                          </div>

                          <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
                            {upcomingEvents.length > 0 ? (
                              upcomingEvents.map((event, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setEventDetailsOpen(true);
                                    setCalendarOpen(false);
                                  }}
                                >
                                  <div className={`p-1 rounded-lg ${getEventTypeStyle(event.type)} flex-shrink-0`}>
                                    {getEventIcon(event.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                                      {event.title}
                                    </h5>
                                    <div className="flex items-center gap-1 mt-0.5">
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
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                    event.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {event.priority.charAt(0)}
                                  </span>
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                <Calendar size={20} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs sm:text-sm">No upcoming events</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Calendar Footer */}
                        <div className="p-2 sm:p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                <span className="text-xs text-gray-600 hidden xs:inline">Deadline</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="text-xs text-gray-600 hidden xs:inline">Meeting</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setCalendarOpen(false)}
                              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNotificationClick}
                className="relative p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 mobile-button"
              >
                <Bell size={18} />
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Center Section - Subscription Badge */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              {renderSubscriptionBadge()}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Quick Actions - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onHelpClick}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 mobile-button"
                  title="Help Center"
                >
                  <HelpCircle size={18} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAssistantClick}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 mobile-button"
                  title="AI Assistant"
                >
                  <Bot size={18} />
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
                  className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded-lg transition-all duration-200 mobile-button"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-medium text-xs sm:text-sm">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`
                      : user?.firstName
                      ? user.firstName.charAt(0).toUpperCase()
                      : user?.lastName
                      ? user.lastName.charAt(0).toUpperCase()
                      : "G"}
                  </div>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''} hidden sm:block`} />
                </motion.button>

                {/* User Menu Dropdown - Mobile Optimized */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full right-0 mt-2 ${
                        isMobile ? 'w-48' : 'w-56'
                      } bg-white rounded-lg shadow-xl border border-gray-200 z-50`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {user?.firstName && user?.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user?.firstName
                              ? user.firstName
                              : user?.lastName
                              ? user.lastName
                              : "Guest User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        
                        <button
                          onClick={() => {
                            onProfileClick?.();
                            setUserMenuOpen(false);
                            handleSectionChange("user-profile");
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm"
                        >
                          <User size={16} />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            onSettingsClick?.();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm"
                        >
                          <Settings size={16} />
                          <span>Settings</span>
                        </button>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={() => {
                            onSignOutClick?.();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
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
              <div className="px-3 py-2 space-y-1">
                <button
                  onClick={onHelpClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm mobile-button"
                >
                  <HelpCircle size={18} />
                  <span>Help Center</span>
                </button>
                <button
                  onClick={onAssistantClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm mobile-button"
                >
                  <Bot size={18} />
                  <span>AI Assistant</span>
                </button>
                <button
                  onClick={onPreferencesClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm mobile-button"
                >
                  <Settings size={18} />
                  <span>Preferences</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Event Details Modal - Mobile Optimized */}
      <AnimatePresence>
        {eventDetailsOpen && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setEventDetailsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Event Header */}
              <div className={`p-4 sm:p-6 text-white ${
                selectedEvent.type === 'deadline' ? 'bg-gradient-to-r from-red-600 to-red-700' :
                selectedEvent.type === 'meeting' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                selectedEvent.type === 'contract' ? 'bg-gradient-to-r from-purple-600 to-purple-700' :
                selectedEvent.type === 'review' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700' :
                selectedEvent.type === 'approval' ? 'bg-gradient-to-r from-green-600 to-green-700' :
                'bg-gradient-to-r from-gray-600 to-gray-700'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">
                      {selectedEvent.type?.toUpperCase()}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 truncate">{selectedEvent.title}</h3>
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar size={14} />
                      <span className="text-xs sm:text-sm">
                        {format(selectedEvent.date, 'EEE, MMM d, yyyy')}
                        {selectedEvent.time && ` • ${selectedEvent.time}`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEventDetailsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors duration-200 flex-shrink-0 ml-2"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {selectedEvent.location && (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">Location</p>
                      <p className="text-gray-600 text-xs sm:text-sm">{selectedEvent.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <FileText size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">Description</p>
                    <p className="text-gray-600 text-xs sm:text-sm">{selectedEvent.description}</p>
                  </div>
                </div>

                {selectedEvent.priority && (
                  <div className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg ${
                    selectedEvent.priority === 'high' ? 'bg-red-50 border border-red-200' :
                    selectedEvent.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <AlertTriangle size={14} className={
                      selectedEvent.priority === 'high' ? 'text-red-600' :
                      selectedEvent.priority === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    } />
                    <span className={`text-xs sm:text-sm font-medium ${
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
              <div className="p-4 sm:p-6 pt-0 flex items-center justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setEventDetailsOpen(false)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm mobile-button"
                >
                  Close
                </button>
                <button
                  onClick={() => setEventDetailsOpen(false)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-white rounded-lg transition-all duration-200 text-sm mobile-button ${
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

      {/* Add spacing for fixed header */}
      <div className="h-14 sm:h-16"></div>
    </>
  );
};

// Global Styles Component
const GlobalStyles = () => (
  <style jsx global>{`
    /* Mobile-first responsive design */
    @media (max-width: 640px) {
      .mobile-button {
        min-height: 44px;
        min-width: 44px;
      }
      
      .mobile-text {
        font-size: 0.875rem;
      }
    }

    @media (max-width: 480px) {
      .mobile-optimized {
        padding: 0.5rem;
      }
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

    /* Responsive breakpoint for extra small screens */
    @media (min-width: 475px) {
      .xs\\:inline {
        display: inline !important;
      }
    }

    /* Touch-friendly interactions */
    @media (hover: none) and (pointer: coarse) {
      .hover-effect:hover {
        transform: none;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .transition-all,
      .transition-colors,
      .transition-transform {
        transition-duration: 0.01ms !important;
      }
      
      .animate-pulse {
        animation: none !important;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .border-gray-200 {
        border-color: #000 !important;
      }
      
      .text-gray-600 {
        color: #000 !important;
      }
    }
  `}</style>
);

export { ModernHeaderComponent, GlobalStyles };
export default ModernHeaderComponent;