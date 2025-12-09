import React, { useState, useEffect, useCallback } from "react";
import { ModernHeaderComponent, GlobalStyles } from "./ModernHeaderComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMediaQuery, useTheme } from '@mui/material';

const DashboardHeader = ({ 
  user, 
  onMobileMenuToggle, 
  scrollPosition,
  sidebarOpen = true,
  sidebarWidth = 256,
  collapsedSidebarWidth = 70
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Define important dates with detailed information
  const PROCUREMENT_DATES = [
    { 
      date: new Date(2025, 4, 15), 
      title: "Vendor Proposal Deadline", 
      type: "deadline", 
      description: "Final date for vendors to submit proposals for the Q2 IT equipment procurement", 
      location: "Procurement Portal", 
      priority: "high" 
    },
    { 
      date: new Date(2025, 4, 17), 
      title: "Procurement Meeting", 
      type: "meeting", 
      description: "Team meeting to review vendor proposals and make selections", 
      location: "Conference Room A", 
      time: "10:00 AM", 
      priority: "medium" 
    },
    { 
      date: new Date(2025, 4, 20), 
      title: "Contract Renewal", 
      type: "contract", 
      description: "Annual renewal of office supplies contract with OfficeMax", 
      location: "Legal Department", 
      priority: "medium" 
    },
    { 
      date: new Date(2025, 4, 24), 
      title: "Quarterly Review", 
      type: "review", 
      description: "Financial review of procurement spending for Q1", 
      location: "Executive Boardroom", 
      time: "2:00 PM", 
      priority: "high" 
    },
    { 
      date: new Date(2025, 4, 28), 
      title: "Budget Approval", 
      type: "approval", 
      description: "Final approval for Q3 procurement budget", 
      location: "Finance Department", 
      priority: "high" 
    },
    { 
      date: new Date(2025, 4, 14), 
      title: "Vendor Evaluation", 
      type: "meeting", 
      description: "Evaluate new potential suppliers for hardware components", 
      location: "Meeting Room B", 
      time: "11:30 AM", 
      priority: "medium" 
    },
    { 
      date: new Date(2025, 4, 18), 
      title: "Contract Draft Review", 
      type: "contract", 
      description: "Legal team review of new vendor contracts", 
      location: "Legal Office", 
      time: "9:00 AM", 
      priority: "medium" 
    },
    { 
      date: new Date(2025, 4, 22), 
      title: "Procurement Training", 
      type: "meeting", 
      description: "New system training for procurement team", 
      location: "Training Center", 
      time: "1:00 PM", 
      priority: "low" 
    }
  ];
  
  // State management for important dates
  const [importantDates, setImportantDates] = useState(PROCUREMENT_DATES);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'dashboard';
  });
  
  // Notification counter for demo - make it responsive
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Memoized event handlers for better performance
  const handleNotificationClick = useCallback(() => {
    console.log("Notification clicked");
    // Mobile-specific notification handling
    if (isMobile) {
      // On mobile, you might want to open a full-screen notification panel
      navigate('/notifications');
    } else {
      // On desktop, open a dropdown or sidebar
      console.log("Open notification panel");
    }
  }, [isMobile, navigate]);
  
  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    navigate(`?section=${section}`, { replace: true });
    
    // Auto-close mobile menu when navigating on mobile
    if (isMobile) {
      onMobileMenuToggle?.(false);
    }
  }, [navigate, isMobile, onMobileMenuToggle]);
  
  const handleHelpClick = useCallback(() => {
    console.log("Help clicked");
    // Mobile-optimized help experience
    if (isMobile) {
      navigate('/help-center');
    } else {
      // Open help modal on desktop
      console.log("Open help modal");
    }
  }, [isMobile, navigate]);
  
  const handleAssistantClick = useCallback(() => {
    console.log("AI Assistant clicked");
    // Mobile-optimized AI assistant
    if (isMobile) {
      // Open full-screen AI chat on mobile
      navigate('/ai-assistant');
    } else {
      // Open sidebar AI chat on desktop
      console.log("Open AI assistant sidebar");
    }
  }, [isMobile, navigate]);
  
  const handlePreferencesClick = useCallback(() => {
    console.log("Preferences clicked");
    // Mobile-responsive preferences
    if (isMobile) {
      navigate('/preferences');
    } else {
      // Open preferences modal on desktop
      console.log("Open preferences modal");
    }
  }, [isMobile, navigate]);
 
  const handleProfileClick = useCallback(() => {
    console.log("Profile clicked");
    handleSectionChange("user-profile");
  }, [handleSectionChange]);
  
  const handleSettingsClick = useCallback(() => {
    console.log("Settings clicked");
    // Mobile-responsive settings navigation
    if (isMobile) {
      navigate('/settings');
    } else {
      handleSectionChange("settings");
    }
  }, [isMobile, navigate, handleSectionChange]);
  
  const handleSignOutClick = useCallback(() => {
    console.log("Sign out clicked");
    // Mobile-optimized sign out confirmation
    if (isMobile) {
      // Show mobile-friendly confirmation dialog
      if (window.confirm("Are you sure you want to sign out?")) {
        // Handle sign out logic
        console.log("User signed out");
      }
    } else {
      // Handle desktop sign out
      console.log("User signed out");
    }
  }, [isMobile]);

  // Mobile-specific notification count adjustment
  useEffect(() => {
    // On mobile, you might want to cap the notification count display
    if (isSmallMobile && notificationCount > 9) {
      // Don't show exact count on very small screens
      setNotificationCount(9);
    }
  }, [isSmallMobile, notificationCount]);

  // Fetch important dates from API with mobile optimization
  useEffect(() => {
    const fetchImportantDates = async () => {
      try {
        // In a real app, you'd make an API call here
        // For mobile, you might want to limit the number of dates fetched
        const limit = isMobile ? 5 : PROCUREMENT_DATES.length;
        const datesToShow = PROCUREMENT_DATES.slice(0, limit);
        
        setImportantDates(datesToShow);
        console.log(`Loaded ${datesToShow.length} important dates for ${isMobile ? 'mobile' : 'desktop'}`);
      } catch (error) {
        console.error("Failed to fetch important dates:", error);
        // Fallback to static data
        setImportantDates(PROCUREMENT_DATES.slice(0, isMobile ? 3 : 5));
      }
    };
    
    fetchImportantDates();
  }, [isMobile]);

  // Handle mobile menu toggle with state synchronization
  const handleMobileMenuToggle = useCallback((open) => {
    onMobileMenuToggle?.(open);
    
    // Additional mobile-specific logic
    if (open && isMobile) {
      // When opening mobile menu, you might want to:
      // - Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // When closing mobile menu, restore scroll
      document.body.style.overflow = '';
    }
  }, [onMobileMenuToggle, isMobile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Ensure body scroll is restored when component unmounts
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <GlobalStyles />
      <ModernHeaderComponent
        user={user}
        notificationCount={notificationCount}
        onNotificationClick={handleNotificationClick}
        onHelpClick={handleHelpClick}
        onAssistantClick={handleAssistantClick}
        onPreferencesClick={handlePreferencesClick}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onSignOutClick={handleSignOutClick}
        onMobileMenuToggle={handleMobileMenuToggle}
        scrollPosition={scrollPosition}
        importantDates={importantDates}
        sidebarOpen={sidebarOpen}
        sidebarWidth={sidebarWidth}
        collapsedSidebarWidth={collapsedSidebarWidth}
      />
    </>
  );
};

export default DashboardHeader;