import React, { useState, useEffect, forwardRef } from "react";
import {
  Paper, Toolbar, Box, IconButton, Badge, Typography, 
  Button, Avatar, Menu, MenuItem, Divider, Tooltip,
  Popover, useTheme, alpha, Dialog, Chip, List, ListItem,
  ListItemIcon, ListItemText, Collapse
} from "@mui/material";
import Slide from '@mui/material/Slide';
import {
  NotificationsActive, LiveHelp, SmartToy, Tune,
  Person, SettingsApplications, ExitToApp, MenuOpen,
  Event, ChevronLeft, ChevronRight, Info, EventNote,
  AccessTime, LocationOn, CalendarToday, ArrowForward, 
  Check, Schedule, Flag, PriorityHigh, Today, ExpandMore
} from "@mui/icons-material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, StaticDatePicker, PickersDay } from '@mui/x-date-pickers';
import { isEqual, isSameDay, format, isAfter, isBefore, addDays, isToday, isWithinInterval } from 'date-fns';

// Transition component for Dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  importantDates = []
}) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUpcomingEvents, setShowUpcomingEvents] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState(false);
  
  // Calculate opacity for blur effect based on scroll position
  const opacity = Math.min(scrollPosition / 100, 1);
  const isMenuOpen = Boolean(anchorEl);
  const calendarOpen = Boolean(calendarAnchorEl);
  const calendarId = calendarOpen ? 'calendar-popover' : undefined;
  
  // Use the imported dates or fall back to the default ones
  const IMPORTANT_DATES = importantDates.length > 0 ? importantDates : [
    { date: new Date(2025, 4, 15), title: "Vendor Proposal Deadline", type: "deadline", description: "Final date for vendors to submit proposals for the Q2 IT equipment procurement", location: "Procurement Portal", priority: "high" },
    { date: new Date(2025, 4, 17), title: "Procurement Meeting", type: "meeting", description: "Team meeting to review vendor proposals and make selections", location: "Conference Room A", time: "10:00 AM", priority: "medium" },
    { date: new Date(2025, 4, 20), title: "Contract Renewal", type: "contract", description: "Annual renewal of office supplies contract with OfficeMax", location: "Legal Department", priority: "medium" },
    { date: new Date(2025, 4, 24), title: "Quarterly Review", type: "review", description: "Financial review of procurement spending for Q1", location: "Executive Boardroom", time: "2:00 PM", priority: "high" },
    { date: new Date(2025, 4, 28), title: "Budget Approval", type: "approval", description: "Final approval for Q3 procurement budget", location: "Finance Department", priority: "high" },
    { date: new Date(2025, 4, 14), title: "Vendor Evaluation", type: "meeting", description: "Evaluate new potential suppliers for hardware components", location: "Meeting Room B", time: "11:30 AM", priority: "medium" },
    { date: new Date(2025, 4, 18), title: "Contract Draft Review", type: "contract", description: "Legal team review of new vendor contracts", location: "Legal Office", time: "9:00 AM", priority: "medium" },
    { date: new Date(2025, 4, 22), title: "Procurement Training", type: "meeting", description: "New system training for procurement team", location: "Training Center", time: "1:00 PM", priority: "low" }
  ];

  // Get upcoming events for the next 7 days
  const upcomingEvents = IMPORTANT_DATES.filter(event => 
    isAfter(event.date, new Date()) && 
    isBefore(event.date, addDays(new Date(), 7))
  ).sort((a, b) => a.date - b.date);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCalendarOpen = (event) => {
    setCalendarAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setCalendarAnchorEl(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Check if selected date has any events
    const event = IMPORTANT_DATES.find(e => isSameDay(e.date, date));
    if (event) {
      setSelectedEvent(event);
      setEventDetailsOpen(true);
    }
  };

  const handleEventDetailsClose = () => {
    setEventDetailsOpen(false);
  };

  const toggleExpandEvents = () => {
    setExpandedEvents(!expandedEvents);
  };

  // Helper function to determine if a date has an event
  const hasEvent = (date) => {
    return IMPORTANT_DATES.some(event => isSameDay(event.date, date));
  };

  // Helper function to get event type for styling
  const getEventType = (date) => {
    const event = IMPORTANT_DATES.find(event => isSameDay(event.date, date));
    return event ? event.type : null;
  };

  // Helper function to get all events for a specific date
  const getEventsForDate = (date) => {
    return IMPORTANT_DATES.filter(event => isSameDay(event.date, date));
  };

  // Render custom day component with event indicators
  const renderDay = (day, selectedDates, pickersDayProps) => {
    const isSelectedDay = isEqual(day, selectedDate);
    const eventsOnDay = getEventsForDate(day);
    const hasEvents = eventsOnDay.length > 0;
    const isCurrentDay = isToday(day);
    
    // Style for days with events
    const eventDayStyle = hasEvents ? {
      position: 'relative',
      fontWeight: 'bold',
      background: alpha(
        eventsOnDay[0].type === 'deadline' ? theme.palette.error.main :
        eventsOnDay[0].type === 'meeting' ? theme.palette.primary.main :
        eventsOnDay[0].type === 'contract' ? theme.palette.secondary.main :
        eventsOnDay[0].type === 'review' ? theme.palette.warning.main :
        eventsOnDay[0].type === 'approval' ? theme.palette.success.main :
        theme.palette.grey[500],
        0.1
      ),
      color: isSelectedDay ? '#fff' : (
        eventsOnDay[0].type === 'deadline' ? theme.palette.error.main :
        eventsOnDay[0].type === 'meeting' ? theme.palette.primary.main :
        eventsOnDay[0].type === 'contract' ? theme.palette.secondary.main :
        eventsOnDay[0].type === 'review' ? theme.palette.warning.main :
        eventsOnDay[0].type === 'approval' ? theme.palette.success.main :
        theme.palette.text.primary
      ),
      borderRadius: '50%',
      '&:hover': {
        backgroundColor: alpha(
          eventsOnDay[0].type === 'deadline' ? theme.palette.error.main :
          eventsOnDay[0].type === 'meeting' ? theme.palette.primary.main :
          eventsOnDay[0].type === 'contract' ? theme.palette.secondary.main :
          eventsOnDay[0].type === 'review' ? theme.palette.warning.main :
          eventsOnDay[0].type === 'approval' ? theme.palette.success.main :
          theme.palette.grey[500],
          0.2
        ),
      }
    } : {};
    
    const currentDayStyle = isCurrentDay && !hasEvents ? {
      border: `2px solid ${theme.palette.primary.main}`,
      fontWeight: 'bold',
    } : {};
    
    return (
      <Box sx={{ position: 'relative' }}>
        <PickersDay 
          {...pickersDayProps} 
          disableMargin 
          disableRipple={hasEvents}
          selected={isSelectedDay}
          day={day}
          sx={{
            ...eventDayStyle,
            ...currentDayStyle,
            width: 36,
            height: 36,
            margin: '2px',
            fontSize: hasEvents ? '0.85rem' : '0.8rem',
            transition: 'all 0.2s ease',
            ...(hasEvents && eventsOnDay.length > 1 ? {
              '&::after': {
                content: `"${eventsOnDay.length}"`,
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.grey[300]}`,
                borderRadius: '50%',
                color: theme.palette.text.secondary,
                fontSize: '0.6rem',
                width: 14,
                height: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }
            } : {}),
          }}
        />
        
        {hasEvents && (
          <Box
            sx={{
              width: '100%',
              position: 'absolute',
              bottom: 3,
              left: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: '2px'
            }}
          >
            {eventsOnDay.slice(0, Math.min(3, eventsOnDay.length)).map((event, idx) => (
              <Box
                key={idx}
                sx={{
                  width: eventsOnDay.length > 1 ? 4 : 6,
                  height: eventsOnDay.length > 1 ? 4 : 6,
                  borderRadius: '50%',
                  bgcolor: 
                    event.type === 'deadline' ? theme.palette.error.main :
                    event.type === 'meeting' ? theme.palette.primary.main :
                    event.type === 'contract' ? theme.palette.secondary.main :
                    event.type === 'review' ? theme.palette.warning.main :
                    event.type === 'approval' ? theme.palette.success.main :
                    theme.palette.grey[500],
                  boxShadow: `0 1px 2px ${alpha('#000', 0.2)}`
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Paper elevation={0} sx={{ 
      p: 1,
      border: 'none',
      height: 75,
      backdropFilter: `blur(${opacity * 12}px) saturate(180%)`,
      position: 'sticky',
      top: 0,
      zIndex: theme => theme.zIndex.appBar,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: alpha(theme.palette.background.default, 0.8),
      boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
      '&:hover': {
        backdropFilter: `blur(${opacity * 16}px) saturate(200%)`
      }
    }}>
      <Toolbar sx={{ px: { sm: 1.5 }, gap: 1 }}>
        {/* Left-aligned items */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 2,
          mr: 'auto' 
        }}>
          {/* Notification icon with animated pulse effect */}
          <IconButton 
            color="inherit"
            onClick={onNotificationClick}
            sx={{
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }
            }}
          >
            <Badge badgeContent={notificationCount} color="error" variant="dot" overlap="circular">
              <NotificationsActive sx={{ 
                color: theme.palette.text.primary,
                transform: 'rotate(-20deg)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(0deg)'
                }
              }} />
            </Badge>
          </IconButton>

          {/* Date display with calendar popover */}
          <Button
            aria-describedby={calendarId}
            onClick={handleCalendarOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.text.primary,
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
              },
              '& svg': {
                width: 20,
                height: 20,
                color: theme.palette.primary.main
              }
            }}
          >
            <Event sx={{ fontSize: '1.1rem' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {format(new Date(), 'MMMM d, yyyy')}
            </Typography>
          </Button>

          {/* Enhanced Calendar popover */}
          <Popover
            id={calendarId}
            open={calendarOpen}
            anchorEl={calendarAnchorEl}
            onClose={handleCalendarClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                p: 0,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
                width: 380,
                animation: 'fadeIn 0.3s ease'
              }
            }}
          >
            {/* Calendar header */}
            <Box sx={{
              p: 2,
              bgcolor: theme.palette.primary.main,
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday fontSize="small" />
                Calendar
              </Typography>
              
              <Typography variant="caption" sx={{ 
                bgcolor: alpha('#fff', 0.2), 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Today fontSize="small" sx={{ width: 16, height: 16 }} />
                {format(new Date(), 'MMMM yyyy')}
              </Typography>
            </Box>
            
            {/* Calendar body */}
            <Box sx={{ display: 'flex' }}>
              {/* Calendar */}
              <Box sx={{ flex: 1, p: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={() => null}
                    renderDay={renderDay}
                    components={{
                      ActionBar: () => null // Hide action bar
                    }}
                  />
                </LocalizationProvider>
              </Box>
              
              {/* Upcoming events sidebar */}
              <Box sx={{ 
                width: 240,
                bgcolor: alpha(theme.palette.background.default, 0.05),
                borderLeft: `1px solid ${theme.palette.divider}`,
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column'
              }}>
                <Box sx={{ 
                  p: 2, 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: alpha(theme.palette.primary.main, 0.08)
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between'
                  }}>
                    <span>Upcoming Events</span>
                    <Chip 
                      label={upcomingEvents.length} 
                      size="small"
                      color="primary"
                      sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } }}
                    />
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  overflowY: 'auto',
                  flex: 1,
                  p: 0,
                }}>
                  <List dense disablePadding>
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents
                        .slice(0, expandedEvents ? upcomingEvents.length : 3)
                        .map((event, index) => (
                          <ListItem 
                            key={index}
                            disablePadding
                            sx={{ 
                              px: 2,
                              py: 1,
                              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.action.hover, 0.8),
                              }
                            }}
                            button
                            onClick={() => {
                              setSelectedDate(event.date);
                              setSelectedEvent(event);
                              setEventDetailsOpen(true);
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {event.type === 'deadline' && <Flag fontSize="small" color="error" />}
                              {event.type === 'meeting' && <Schedule fontSize="small" color="primary" />}
                              {event.type === 'contract' && <EventNote fontSize="small" color="secondary" />}
                              {event.type === 'review' && <PriorityHigh fontSize="small" color="warning" />}
                              {event.type === 'approval' && <Check fontSize="small" color="success" />}
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                  {event.title}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <AccessTime sx={{ fontSize: 12 }} />
                                  {format(event.date, 'MMM d')} {event.time ? `• ${event.time}` : ''}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))
                    ) : (
                      <ListItem sx={{ py: 2 }}>
                        <ListItemText 
                          primary={
                            <Typography variant="body2" color="textSecondary" align="center">
                              No upcoming events
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
                
                {upcomingEvents.length > 3 && (
                  <Button
                    size="small"
                    onClick={toggleExpandEvents}
                    sx={{ 
                      textTransform: 'none', 
                      justifyContent: 'space-between',
                      px: 2,
                      py: 1,
                      borderTop: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.secondary
                    }}
                    endIcon={
                      <ExpandMore 
                        sx={{ 
                          transform: expandedEvents ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }} 
                      />
                    }
                  >
                    {expandedEvents ? 'Show less' : `Show ${upcomingEvents.length - 3} more`}
                  </Button>
                )}
              </Box>
            </Box>
            
            {/* Legend and action buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.background.paper, 0.5)
            }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  size="small" 
                  label="Deadline" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    height: 24,
                    '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                  }}
                />
                <Chip 
                  size="small" 
                  label="Meeting" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    height: 24,
                    '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                  }}
                />
                <Chip 
                  size="small" 
                  label="Contract" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    height: 24,
                    '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                  }}
                />
              </Box>
              
              <Button 
                size="small" 
                variant="outlined" 
                onClick={handleCalendarClose}
                sx={{ 
                  textTransform: 'none', 
                  height: 30, 
                  px: 2,
                  borderRadius: 1.5
                }}
              >
                Close
              </Button>
            </Box>
          </Popover>
        </Box>

        {/* Right-aligned items */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          mr: 1 
        }}>
          {/* Modern Icons with tooltips */}
          <Tooltip title="Help Center">
            <IconButton 
              color="inherit" 
              onClick={onHelpClick}
              sx={{ 
                p: 1.2,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <LiveHelp sx={{ 
                fontSize: 22,
                color: theme.palette.text.secondary,
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="AI Assistant">
            <IconButton 
              color="inherit" 
              onClick={onAssistantClick}
              sx={{ 
                p: 1.2,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <SmartToy sx={{
                fontSize: 22,
                color: theme.palette.text.secondary,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  color: theme.palette.secondary.main,
                  transform: 'scale(1.1)'
                }
              }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Preferences">
            <IconButton 
              color="inherit" 
              onClick={onPreferencesClick}
              sx={{ 
                p: 1.2,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <Tune sx={{
                fontSize: 22,
                color: theme.palette.text.secondary,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: theme.palette.success.main,
                  transform: 'rotate(90deg)'
                }
              }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* User profile with modern dropdown */}
        <Box sx={{ position: 'relative' }}>
          <Button
            onClick={handleMenuClick}
            sx={{ 
              p: 0.5,
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                '& .MuiAvatar-root': {
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
                }
              }
            }}
          >
            <Avatar sx={{ 
              width: 38, 
              height: 38,
              bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.9) : theme.palette.primary.main,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                animation: 'ripple 3s infinite'
              }
            }} src={user?.avatar}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                 {user?.firstName ? user.firstName.charAt(0) : 
     user?.name ? user.name.charAt(0) : "G"}
              </Typography>
            </Avatar>
          </Button>

          {/* Modern Menu dropdown */}
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 8,
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: 3,
                overflow: 'visible',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.1)}`,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: -8,
                  right: 16,
                  width: 16,
                  height: 16,
                  bgcolor: 'background.paper',
                  transform: 'rotate(45deg)',
                  borderLeft: `1px solid ${theme.palette.divider}`,
                  borderTop: `1px solid ${theme.palette.divider}`
                }
              }
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); onProfileClick?.(); }} sx={{ py: 1.2, gap: 1.5 }}>
              <Person sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); onSettingsClick?.(); }} sx={{ py: 1.2, gap: 1.5 }}>
              <SettingsApplications sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={() => { handleMenuClose(); onSignOutClick?.(); }} sx={{ 
              py: 1.2,
              gap: 1.5,
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.08)
              }
            }}>
              <ExitToApp sx={{ fontSize: 20 }} />
              <Typography variant="body2">Sign Out</Typography>
            </MenuItem>
          </Menu>
        </Box>

        {/* Modern Mobile menu button */}
        <IconButton
          onClick={() => {
            setMobileOpen(!mobileOpen);
            onMobileMenuToggle?.(!mobileOpen);
          }}
          sx={{ 
            display: { sm: 'none' },
            p: 1.2,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          <MenuOpen sx={{ 
            fontSize: 26,
            color: theme.palette.text.primary,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'rotate(90deg)'
            }
          }} />
        </IconButton>
      </Toolbar>

      {/* Event Details Dialog */}
      <Dialog
        open={eventDetailsOpen}
        onClose={handleEventDetailsClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 0,
            maxWidth: 400,
            overflow: 'hidden'
          }
        }}
        TransitionComponent={Transition}
      >
        {/* Event header with color based on type */}
        <Box sx={{ 
          p: 3, 
          backgroundColor: 
            selectedEvent?.type === 'deadline' ? alpha(theme.palette.error.main, 0.9) :
            selectedEvent?.type === 'meeting' ? alpha(theme.palette.primary.main, 0.9) :
            selectedEvent?.type === 'contract' ? alpha(theme.palette.secondary.main, 0.9) :
            selectedEvent?.type === 'review' ? alpha(theme.palette.warning.main, 0.9) :
            selectedEvent?.type === 'approval' ? alpha(theme.palette.success.main, 0.9) :
            theme.palette.grey[800],
          color: '#fff'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Chip 
                label={selectedEvent?.type ? selectedEvent.type.toUpperCase() : ''} 
                size="small"
                sx={{ 
                  bgcolor: alpha('#fff', 0.2),
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  mb: 1.5
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {selectedEvent?.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 16 }} />
                {selectedEvent?.date && format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}
                {selectedEvent?.time && ` • ${selectedEvent.time}`}
              </Typography>
            </Box>
            
            <IconButton 
              onClick={handleEventDetailsClose}
              sx={{ 
                color: 'white',
                bgcolor: alpha('#fff', 0.1),
                '&:hover': {
                  bgcolor: alpha('#fff', 0.2)
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </IconButton>
          </Box>
        </Box>
        
        {/* Event details */}
        <Box sx={{ p: 3 }}>
          {selectedEvent?.location && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
              <LocationOn sx={{ color: theme.palette.text.secondary, mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  Location
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedEvent.location}
                </Typography>
              </Box>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 3 }}>
            <Info sx={{ color: theme.palette.text.secondary, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedEvent?.description || "No description available."}
              </Typography>
            </Box>
          </Box>
          
          {/* Priority indicator */}
          {selectedEvent?.priority && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              p: 2,
              bgcolor: 
                selectedEvent.priority === 'high' ? alpha(theme.palette.error.main, 0.1) :
                selectedEvent.priority === 'medium' ? alpha(theme.palette.warning.main, 0.1) :
                alpha(theme.palette.info.main, 0.1),
              borderRadius: 2,
              mb: 3
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={
                selectedEvent.priority === 'high' ? theme.palette.error.main :
                selectedEvent.priority === 'medium' ? theme.palette.warning.main :
                theme.palette.info.main
              } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <Typography variant="body2" sx={{ 
                color: 
                  selectedEvent.priority === 'high' ? theme.palette.error.main :
                  selectedEvent.priority === 'medium' ? theme.palette.warning.main :
                  theme.palette.info.main,
                fontWeight: 500
              }}>
                {selectedEvent.priority === 'high' ? 'High Priority' : 
                 selectedEvent.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Action buttons */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.background.default, 0.5)
        }}>
          <Button 
            variant="outlined" 
            onClick={handleEventDetailsClose}
            sx={{ borderRadius: 8, textTransform: 'none', px: 3 }}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            color={
              selectedEvent?.type === 'deadline' ? 'error' :
              selectedEvent?.type === 'meeting' ? 'primary' :
              selectedEvent?.type === 'contract' ? 'secondary' :
              selectedEvent?.type === 'review' ? 'warning' :
              selectedEvent?.type === 'approval' ? 'success' :
              'primary'
            }
            onClick={handleEventDetailsClose}
            sx={{ borderRadius: 8, textTransform: 'none', px: 3 }}
            endIcon={<ArrowForward />}
          >
            View Details
          </Button>
        </Box>
      </Dialog>
    </Paper>
  );
};

// Add keyframes for animations
const GlobalStyles = () => {
  const theme = useTheme();
  
  return (
    <style jsx global>{`
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 0.8;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.3;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
      
      @keyframes ripple {
        0% {
          transform: scale(1);
          opacity: 0.8;
        }
        100% {
          transform: scale(1.2);
          opacity: 0;
        }
      }
    `}</style>
  );
};

// Export both components
export { ModernHeaderComponent, GlobalStyles };
export default ModernHeaderComponent;