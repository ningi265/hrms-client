import React, { useState, useEffect } from "react";
import { ModernHeaderComponent, GlobalStyles } from "./ModernHeaderComponent";
import { useNavigate, useSearchParams } from "react-router-dom";

const DashboardHeader = ({ 
  user, 
  onMobileMenuToggle, 
  scrollPosition,
  sidebarOpen = true, // New prop to track sidebar state
  sidebarWidth = 256, // New prop for sidebar width
  collapsedSidebarWidth = 70 // New prop for collapsed sidebar width
}) => {
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
  
  // Notification counter for demo
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Event handlers
  const handleNotificationClick = () => {
    console.log("Notification clicked");
    // Here you could open a notification panel or navigate to notifications page
  };
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`?section=${section}`, { replace: true });
  };
  
  const handleHelpClick = () => {
    console.log("Help clicked");
    // Open help center or documentation
  };
  
  const handleAssistantClick = () => {
    console.log("AI Assistant clicked");
    // Open AI assistant chat or modal
  };
  
  const handlePreferencesClick = () => {
    console.log("Preferences clicked");
    // Open user preferences or settings modal
  };
 
  const handleProfileClick = () => {
    console.log("Profile clicked");
    handleSectionChange("user-profile"); // This will update the active section
  };
  
  const handleSettingsClick = () => {
    console.log("Settings clicked");
    // Navigate to settings page
  };
  
  const handleSignOutClick = () => {
    console.log("Sign out clicked");
    // Handle sign out logic
  };
  
  // Fetch important dates from API
  useEffect(() => {
    const fetchImportantDates = async () => {
      try {
        // In a real app, you'd make an API call here
        // const response = await fetch(`${backendUrl}/api/procurement-events`);
        // const data = await response.json();
        // setImportantDates(data.map(d => ({ ...d, date: new Date(d.date) })));
        
        // For demo, we'll use the static data
        console.log("Important dates would be fetched from API here");
      } catch (error) {
        console.error("Failed to fetch important dates:", error);
      }
    };
    
    fetchImportantDates();
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
        onProfileClick={() => handleSectionChange("user-profile")}
        onSettingsClick={handleSettingsClick}
        onSignOutClick={handleSignOutClick}
        onMobileMenuToggle={onMobileMenuToggle}
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