"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { jsPDF } from "jspdf";
import {
  ArrowBack,
  Notifications,
  CalendarToday,
  Check,
  AccessTime,
  Description,
  FilterList,
  Language,
  Info,
  MoreHoriz,
  Flight,
  Send,
  Star,
  LocalShipping,
  People,
  Search,  
  Place
} from "@mui/icons-material"
import CircularProgress from "@mui/material/CircularProgress"

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Input,
  InputLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  Alert,
  AlertTitle,
  Chip,
  Avatar,
  Checkbox,
  Switch,
  TextField,
  Divider,
  Box,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge as MuiBadge,
} from "@mui/material"




export default function FleetCoordinator() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [error,setError]= useState()
  const [showDrivers, setShowDrivers] = useState(false)
  const [showTicketBooking, setShowTicketBooking] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isBookingTicket, setIsBookingTicket] = useState(false)
  const [isSendingNotification, setIsSendingNotification] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [isLoading, setIsLoading] = useState(true)
  const [drivers, setDrivers] = useState([]);
  const [travelRequests, setTravelRequests] = useState([])
  const [bookingDetails, setBookingDetails] = useState({
    airline: "",
    flightNumber: "",
    departureTime: "",
    arrivalTime: "",
    ticketClass: "economy",
    price: "",
    notes: "",
  })
  const [notificationDetails, setNotificationDetails] = useState({
    recipients: ["driver", "employee"],
    subject: "",
    message: "",
    includeItinerary: true,
  })
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const transformRequestData = (data) => {
    return data.map(request => {
      const parseDate = (dateString) => {
        if (!dateString) return new Date();
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date() : date;
      };
  
      return {
        id: request._id || request.id || '',
      employeeName: request.employee?.name || 'Unknown',
        fleetNotification: request.fleetNotification || {
          sent: false,
          sentAt: null,
          recipients: [],
          subject: "",
          message: "",
          includeItinerary: false,
          sentBy: null
        },
        employeeId: request.employee?._id || '',
        department: request.fundingCodes || "Not specified",
        email: request.employee?.email || '',
        purpose: request.purpose || '',
        country: request.location || "Not specified",
        city: request.location || "Not specified",
        departureDate: parseDate(request.departureDate),
        returnDate: parseDate(request.returnDate),
        status: request.financeStatus || "pending",
        financialStatus: request.financeStatus || "pending",
        perDiemAmount: request.payment?.perDiemAmount || (request.currency === "MWK" ? 100000 : 1000), 
        currency: request.currency || "USD",
        cardDetails: {
          lastFour: "1234",
          type: "VISA",
          holder: request.employee.name,
        },
        documents: request.documents || [],
        approvedBy: request.finalApprover || "System",
        approvedAt: parseDate(request.finalApprovalDate || request.updatedAt),
        priority: "medium",
        travelType: request.travelType || "local",
        requiresDriver: request.meansOfTravel === "company",
        requiresFlight: request.travelType === "international",
        submittedAt: parseDate(request.createdAt),
        supervisorApproval: request.supervisorApproval,
        finalApproval: request.finalApproval
      }
    })
  }

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backendUrl}/api/auth/drivers`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch drivers");
        }
  
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
        setSnackbarMessage("Failed to fetch drivers");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
  
    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchTravelRequests = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backendUrl}/api/travel-requests/finance/pending`, // Updated endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch pending travel requests");
        }
  
        const data = await response.json();
        const transformedRequests = transformRequestData(data);
        setTravelRequests(transformedRequests);
  
      } catch (error) {
        console.error("Failed to fetch pending travel requests:", error);
        setSnackbarMessage("Failed to fetch pending travel requests");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTravelRequests();
  }, []);

 

  // Filter travel requests based on search query and status filter
  const filteredRequests = travelRequests.filter((request) => {
    // Safely handle potentially undefined/null values
    const employeeName = request.employeeName || '';
    const id = request.id || '';
    const country = request.country || '';
    const city = request.city || '';
  
    const matchesSearch =
      employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
  
    return matchesSearch && matchesStatus;
  });

  // Set default selected request if none is selected
  useEffect(() => {
    if (!selectedRequest && filteredRequests.length > 0) {
      setSelectedRequest(filteredRequests[0])
    }
  }, [filteredRequests, selectedRequest])

  const generateAndDownloadItinerary = () => {
    if (!selectedRequest) return;
  
    try {
      // Create a new PDF document
      const doc = new jsPDF();
  
      // Add title
      doc.setFontSize(18);
      doc.text(`Travel Itinerary - ${selectedRequest.id}`, 105, 20, { align: 'center' });
  
      // Add employee details
      doc.setFontSize(12);
      doc.text('Employee Information:', 14, 40);
      doc.text(`Name: ${selectedRequest.employeeName}`, 20, 50);
      doc.text(`Department: ${selectedRequest.department}`, 20, 60);
      doc.text(`Email: ${selectedRequest.email}`, 20, 70);
  
      // Add travel details
      doc.text('Travel Details:', 14, 90);
      doc.text(`Purpose: ${selectedRequest.purpose}`, 20, 100);
      doc.text(`Destination: ${selectedRequest.city}, ${selectedRequest.country}`, 20, 110);
      doc.text(`Departure: ${format(selectedRequest.departureDate, "MMM d, yyyy")}`, 20, 120);
      doc.text(`Return: ${format(selectedRequest.returnDate, "MMM d, yyyy")}`, 20, 130);
      doc.text(`Duration: ${Math.ceil((selectedRequest.returnDate - selectedRequest.departureDate) / (1000 * 60 * 60 * 24)) + 1} days`, 20, 140);
  
      // Add travel arrangements if available
      if (selectedRequest.fleetNotification) {
        doc.text('Travel Arrangements:', 14, 160);
        
        if (selectedRequest.requiresFlight && bookingDetails.airline) {
          doc.text(`Flight: ${bookingDetails.airline} ${bookingDetails.flightNumber}`, 20, 170);
          doc.text(`Departure: ${bookingDetails.departureTime}`, 20, 180);
          doc.text(`Arrival: ${bookingDetails.arrivalTime}`, 20, 190);
          doc.text(`Class: ${bookingDetails.ticketClass}`, 20, 200);
        }
  
        if (selectedDriver) {
          doc.text(`Assigned Driver: ${selectedDriver.name}`, 20, 210);
          if (selectedDriver.phone) {
            doc.text(`Driver Contact: ${selectedDriver.phone}`, 20, 220);
          }
        }
      }
  
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Generated by HRMS Travel System', 105, 280, { align: 'center' });
      doc.text(format(new Date(), "MMM d, yyyy h:mm a"), 105, 285, { align: 'center' });
  
      // Save the PDF
      doc.save(`itinerary-${selectedRequest.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSnackbarMessage("Failed to generate itinerary PDF");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle selecting a request
  const handleSelectRequest = (request) => {
    setSelectedRequest(request)
    setShowDrivers(false)
    setShowTicketBooking(false)
    setShowNotification(false)
  }

  // Handle selecting a driver
  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver)
  }
  
  const handleAssignDriver = async () => {
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");
  
      const response = await fetch(
        `${backendUrl}/api/travel-requests/${selectedRequest.id}/assign-driver`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            driverId: selectedDriver._id
          })
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to assign driver');
      }
  
      const data = await response.json();
      const updatedRequest = transformRequestData([data.travelRequest])[0];
      
      // Update state and close modal
      setSelectedRequest(updatedRequest);
      setTravelRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedRequest.id ? updatedRequest : req
        )
      );
      setShowDrivers(false); // This closes the modal
      setShowNotification(true);
      
      setSnackbarMessage(data.message || "Driver assigned successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      
    } catch (error) {
      console.error('Error assigning driver:', error);
      setSnackbarMessage(error.message || 'Failed to assign driver');
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleProcessRequest = () => {
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)

      // Update the selected request status
      const updatedRequest = { ...selectedRequest, status: "in-progress" }
      setSelectedRequest(updatedRequest)

      // Show ticket booking form if flight is required
      if (updatedRequest.requiresFlight) {
        setShowTicketBooking(true)
      } else {
        setShowNotification(true)
      }
    }, 1500)
  }
 
  const handleSendNotifications = async () => {
    setIsSendingNotification(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/travel-requests/${selectedRequest.id}/send-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // If using auth
        },
        body: JSON.stringify(notificationDetails)
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send notifications');
      }
  
       // Update the local state with the returned data
    const updatedRequest = {
      ...selectedRequest,
      status: "completed",
      fleetNotification: {
        sent: true,
        sentAt: new Date().toISOString(),
        recipients: notificationDetails.recipients,
        subject: notificationDetails.subject,
        message: notificationDetails.message,
        includeItinerary: notificationDetails.includeItinerary,
        sentBy: "currentUserId" // You should replace this with actual user ID
      }
    };

    setSelectedRequest(updatedRequest);
    setTravelRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === selectedRequest.id ? updatedRequest : req
      )
    );
    setShowNotification(false);

    setSnackbarMessage("Notifications sent successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
      
    } catch (error) {
      // Handle error...
    } finally {
      setIsSendingNotification(false);
    }
  };

  


  // Handle booking a ticket
  const handleBookTicket = () => {
    setIsBookingTicket(true)

    // Simulate API call
    setTimeout(() => {
      setIsBookingTicket(false)
      setShowTicketBooking(false)
      setShowNotification(true)

      // Pre-fill notification message
setNotificationDetails({
  ...notificationDetails,
  subject: `Travel Details for ${selectedRequest.id}`,
  message: `Dear ${selectedRequest.employeeName},\n\nYour travel to ${selectedRequest.city}, ${selectedRequest.country} has been arranged. Flight details: ${bookingDetails.airline} ${bookingDetails.flightNumber}, departing at ${bookingDetails.departureTime}.\n\n${selectedDriver ? `A driver (${selectedDriver.name}) has been assigned to assist you during your trip.` : "No driver has been assigned for this trip."}\n\nPlease contact the travel department if you have any questions.`,
});
    }, 2000)
  }

  // Handle sending notification
  const handleSendNotification = () => {
    setIsSendingNotification(true)

    // Simulate API call
    setTimeout(() => {
      setIsSendingNotification(false)

      // Update the selected request status if all steps are completed
      if (selectedRequest.requiresFlight && showTicketBooking === false) {
        const updatedRequest = { ...selectedRequest, status: "completed" }
        setSelectedRequest(updatedRequest)
      }

      setShowNotification(false)

      // Reset states
      setSelectedDriver(null)
      setBookingDetails({
        airline: "",
        flightNumber: "",
        departureTime: "",
        arrivalTime: "",
        ticketClass: "economy",
        price: "",
        notes: "",
      })
      setNotificationDetails({
        recipients: ["driver", "employee"],
        subject: "",
        message: "",
        includeItinerary: true,
      })
    }, 1500)
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Chip label="Pending" color="warning" variant="outlined" />
      case "approved":
        return <Chip label="Approved" color="success" variant="outlined" />
      case "completed":
        return <Chip label="Completed" color="info" variant="outlined" />
      default:
        return <Chip label={status} variant="outlined" />
    }
  }
  

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Chip label="High" color="error" />
      case "medium":
        return <Chip label="Medium" color="warning" />
      case "low":
        return <Chip label="Low" color="success" />
      default:
        return null
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
  

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1fr 2fr" }, gap: 3 }}>
          {/* Left Column - Travel Requests */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
            <LocalShipping />
          </Avatar>
          <Typography variant="h6" component="h1">
            Fleet Coordinator & Air Ticket Booking
          </Typography>
        </Box>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FilterList fontSize="small" />
                    <span>{selected === "all" ? "All" : selected.charAt(0).toUpperCase() + selected.slice(1)}</span>
                  </Box>
                )}
              >
                <MenuItem value="all">All Requests</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="">Completed</MenuItem>
              </Select>
            </Box>

            <TextField
              placeholder="Search requests..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search fontSize="small" sx={{ mr: 1, color: "text.disabled" }} />,
                sx: { borderRadius: 28 },
              }}
            />

            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 2 }}
              variant="fullWidth"
            >
              <Tab label="Pending" value="pending" />
              <Tab label="Completed" value="completed" />
            </Tabs>

            {activeTab === "pending" && (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {filteredRequests.filter(request => 
      (!request.fleetNotification || !request.fleetNotification.sent) && 
      request.requiresDriver ).length === 0 ? (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
        No pending requests found
      </Typography>
    ) : (
      filteredRequests
        .filter(request => 
          (!request.fleetNotification || !request.fleetNotification.sent) && 
          request.requiresDriver )
        .map((request) => (
          <Card
            key={request.id}
            onClick={() => handleSelectRequest(request)}
            sx={{
              cursor: "pointer",
              transition: "all 0.2s",
              border: selectedRequest?.id === request.id ? "1px solid" : "1px solid transparent",
              borderColor: selectedRequest?.id === request.id ? "primary.main" : "divider",
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: 1,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box>
                  <Typography variant="subtitle1">{request.employeeName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {request.id}
                  </Typography>
                </Box>
                {getPriorityBadge(request.priority)}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Language fontSize="small" sx={{ color: "text.disabled" }} />
                <Typography variant="body2">
                  {request.city}, {request.country}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday fontSize="small" sx={{ color: "text.disabled" }} />
                <Typography variant="body2">
                  {format(request.departureDate, "MMM d")} - {format(request.returnDate, "MMM d, yyyy")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {request.requiresDriver && (
                    <Tooltip title="Requires Driver">
                      <Avatar sx={{ bgcolor: "info.light", width: 24, height: 24 }}>
                        <LocalShipping fontSize="small" color="info" />
                      </Avatar>
                    </Tooltip>
                  )}
                  {request.requiresFlight && (
                    <Tooltip title="Requires Flight">
                      <Avatar sx={{ bgcolor: "secondary.light", width: 24, height: 24 }}>
                        <Flight fontSize="small" color="secondary" />
                      </Avatar>
                    </Tooltip>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {format(request.submittedAt, "MMM d, yyyy")}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))
    )}
  </Box>
)}


{activeTab === "completed" && (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {filteredRequests.filter(request => 
      request.fleetNotification && request.fleetNotification.sent
    ).length === 0 ? (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
        No completed requests found
      </Typography>
    ) : (
      filteredRequests
        .filter(request => request.fleetNotification && request.fleetNotification.sent)
        .map((request) => (
          <Card
            key={request.id}
            onClick={() => handleSelectRequest(request)}
            sx={{
              cursor: "pointer",
              transition: "all 0.2s",
              border: selectedRequest?.id === request.id ? "1px solid" : "1px solid transparent",
              borderColor: selectedRequest?.id === request.id ? "primary.main" : "divider",
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: 1,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box>
                  <Typography variant="subtitle1">{request.employeeName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {request.id}
                  </Typography>
                </Box>
                {getPriorityBadge(request.priority)}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Language fontSize="small" sx={{ color: "text.disabled" }} />
                <Typography variant="body2">
                  {request.city}, {request.country}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday fontSize="small" sx={{ color: "text.disabled" }} />
                <Typography variant="body2">
                  {format(request.departureDate, "MMM d")} - {format(request.returnDate, "MMM d, yyyy")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {request.requiresDriver && (
                    <Tooltip title="Requires Driver">
                      <Avatar sx={{ bgcolor: "info.light", width: 24, height: 24 }}>
                        <LocalShipping fontSize="small" color="info" />
                      </Avatar>
                    </Tooltip>
                  )}
                  {request.requiresFlight && (
                    <Tooltip title="Requires Flight">
                      <Avatar sx={{ bgcolor: "secondary.light", width: 24, height: 24 }}>
                        <Flight fontSize="small" color="secondary" />
                      </Avatar>
                    </Tooltip>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {format(request.submittedAt, "MMM d, yyyy")}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))
    )}
  </Box>
)}
          </Box>

          {/* Right Column - Request Details and Actions */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {selectedRequest ? (
              <>
                {/* Request Details */}
                <Card sx={{ boxShadow: 3 }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
                          <Description />
                        </Avatar>
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="h6">{selectedRequest.employeeName}</Typography>
                            {getStatusBadge(selectedRequest.status)}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {selectedRequest.id} • {selectedRequest.department}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    action={
                      <IconButton>
                        <MoreHoriz />
                      </IconButton>
                    }
                    sx={{ bgcolor: "primary.light", borderBottom: "1px solid", borderColor: "divider" }}
                  />
                  <CardContent>
                    <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Purpose of Travel
                          </Typography>
                          <Typography>{selectedRequest.purpose}</Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Destination
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Place color="primary" fontSize="small" />
                            <Typography>
                              {selectedRequest.city}, {selectedRequest.country}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Travel Period
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarToday color="primary" fontSize="small" />
                            <Typography>
                              {format(selectedRequest.departureDate, "MMM d, yyyy")} -{" "}
                              {format(selectedRequest.returnDate, "MMM d, yyyy")}
                              <Chip
                                label={`${
                                  Math.ceil(
                                    (selectedRequest.returnDate - selectedRequest.departureDate) /
                                      (1000 * 60 * 60 * 24),
                                  ) + 1
                                } days`}
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Requirements
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <FormControlLabel
                              control={<Checkbox checked={selectedRequest.requiresDriver} disabled />}
                              label="Driver Required"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={selectedRequest.requiresFlight} disabled />}
                              label="Flight Booking Required"
                            />
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Documents
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {selectedRequest.documents.map((doc, index) => (
                              <Chip
                                key={index}
                                label={doc}
                                variant="outlined"
                                size="small"
                                icon={<Description fontSize="small" />}
                              />
                            ))}
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Submitted
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccessTime color="primary" fontSize="small" />
                            <Typography>{format(selectedRequest.submittedAt, "MMM d, yyyy")}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {selectedRequest.status === "pending" && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        <AlertTitle>Action Required</AlertTitle>
                        This request requires your attention. Please assign a driver (if needed) and initiate the flight
                        booking process.
                      </Alert>
                    )}

                    {selectedRequest.status === "in-progress" && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <AlertTitle>In Progress</AlertTitle>
                        This request is being processed. Complete the remaining steps to finalize the travel
                        arrangements.
                      </Alert>
                    )}

                    {selectedRequest.status === "completed" && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        <AlertTitle>Completed</AlertTitle>
                        All travel arrangements have been completed for this request.
                      </Alert>
                    )}
                  </CardContent>
                  <Box sx={{ p: 2, bgcolor: "action.hover", display: "flex", justifyContent: "space-between" }}>
                    {selectedRequest.status === "pending" && (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/travel-dashboard")}
                          sx={{ borderRadius: 28 }}
                        >
                          Back to Dashboard
                        </Button>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          {selectedRequest.requiresDriver && (
                            <Button
                              variant="outlined"
                              onClick={() => setShowDrivers(true)}
                              startIcon={<People />}
                              sx={{ borderRadius: 28, borderColor: "info.main", color: "info.dark" }}
                            >
                              Assign Driver
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            onClick={handleProcessRequest}
                            disabled={isProcessing}
                            sx={{ borderRadius: 28 }}
                          >
                            {isProcessing ? (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CircularProgress size={16} sx={{ mr: 1 }} />
                                Processing...
                              </Box>
                            ) : (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Check sx={{ mr: 1 }} />
                                Process Request
                              </Box>
                            )}
                          </Button>
                        </Box>
                      </>
                    )}

                    {selectedRequest.status === "in-progress" && (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/travel-dashboard")}
                          sx={{ borderRadius: 28 }}
                        >
                          Back to Dashboard
                        </Button>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          {selectedRequest.requiresFlight && !showTicketBooking && !showNotification && (
                            <Button
                              variant="contained"
                              onClick={() => setShowTicketBooking(true)}
                              startIcon={<Flight />}
                              sx={{ borderRadius: 28 }}
                            >
                              Book Flight
                            </Button>
                          )}
                          {!showTicketBooking && !showNotification && (
                            <Button
                              variant="contained"
                              onClick={() => setShowNotification(true)}
                              startIcon={<Send />}
                              sx={{ borderRadius: 28 }}
                            >
                              Send Notifications
                            </Button>
                          )}
                        </Box>
                      </>
                    )}

                    {selectedRequest.status === "completed" && (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/travel-dashboard")}
                          sx={{ borderRadius: 28 }}
                        >
                          Back to Dashboard
                        </Button>
                        <Button
  variant="outlined"
  startIcon={<Description />}
  onClick={generateAndDownloadItinerary}
  sx={{ borderRadius: 28, borderColor: "success.main", color: "success.dark" }}
>
  View Itinerary
</Button>
                      </>
                    )}
                  </Box>
                </Card>

                {/* Driver Assignment Dialog */}

<Dialog
  open={showDrivers}
  onClose={() => setShowDrivers(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar sx={{ bgcolor: "info.light", color: "info.main" }}>
        <People />
      </Avatar>
      <Box>
        <Typography variant="h6">Assign Driver</Typography>
        <Typography variant="body2" color="text.secondary">
          Select a driver for {selectedRequest.employeeName}'s trip to {selectedRequest.city}
        </Typography>
      </Box>
    </Box>
  </DialogTitle>
  <DialogContent>
    <Box sx={{ mb: 3 }}>
      <TextField
        placeholder="Search drivers by name, location, or language..."
        fullWidth
        InputProps={{
          startAdornment: <Search fontSize="small" sx={{ mr: 1, color: "text.disabled" }} />,
        }}
      />
    </Box>

    {drivers.length === 0 ? (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
        No drivers available
      </Typography>
    ) : (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {drivers.map((driver) => (
          <Paper
            key={driver._id}
            elevation={0}
            onClick={() => setSelectedDriver(driver)}
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.2s",
              border: "1px solid",
              borderColor: selectedDriver?._id === driver._id ? "info.main" : "divider",
              "&:hover": {
                borderColor: "info.main",
                bgcolor: "info.light",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={driver.photo} alt={driver.name}>
                {driver.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box>
                <Typography fontWeight="medium">{driver.name}</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Place fontSize="small" sx={{ mr: 0.5, color: "text.disabled" }} />
                  <Typography variant="body2" color="text.secondary">
                    {driver.location} ({driver.distance})
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              {driver.rating && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Star fontSize="small" sx={{ color: "warning.main", mr: 0.5 }} />
                  <Typography fontWeight="medium">{driver.rating}</Typography>
                </Box>
              )}
              {driver.experience && (
                <Typography variant="body2" color="text.secondary">
                  {driver.experience}
                </Typography>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
    )}
  </DialogContent>
  <DialogActions sx={{ p: 2, bgcolor: "action.hover" }}>
    <Button
      variant="outlined"
      onClick={() => setShowDrivers(false)}
      sx={{ borderRadius: 28 }}
    >
      Cancel
    </Button>
    <Button
  variant="contained"
  disabled={!selectedDriver}
  onClick={handleAssignDriver}
  sx={{ borderRadius: 28 }}
>
  Confirm Driver
</Button>
  </DialogActions>
</Dialog>

                {/* Air Ticket Booking Dialog */}
                <Dialog
                  open={showTicketBooking}
                  onClose={() => setShowTicketBooking(false)}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "secondary.light", color: "secondary.main" }}>
                        <Flight />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">Air Ticket Booking</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Book flight for {selectedRequest.employeeName}'s trip to {selectedRequest.city},{" "}
                          {selectedRequest.country}
                        </Typography>
                      </Box>
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3, pt: 2 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel id="airline-label">Airline</InputLabel>
                          <Select
                            labelId="airline-label"
                            id="airline"
                            value={bookingDetails.airline}
                            label="Airline"
                            onChange={(e) => setBookingDetails({ ...bookingDetails, airline: e.target.value })}
                          >
                            <MenuItem value="japan-airlines">Japan Airlines</MenuItem>
                            <MenuItem value="ana">All Nippon Airways</MenuItem>
                            <MenuItem value="delta">Delta Airlines</MenuItem>
                            <MenuItem value="united">United Airlines</MenuItem>
                            <MenuItem value="emirates">Emirates</MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                          label="Flight Number"
                          placeholder="e.g., JL123"
                          value={bookingDetails.flightNumber}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, flightNumber: e.target.value })}
                          fullWidth
                        />

                        <FormControl>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Ticket Class
                          </Typography>
                          <RadioGroup
                            row
                            value={bookingDetails.ticketClass}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, ticketClass: e.target.value })}
                            sx={{ gap: 2 }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                flex: 1,
                                border: "1px solid",
                                borderColor:
                                  bookingDetails.ticketClass === "economy" ? "primary.main" : "divider",
                              }}
                            >
                              <FormControlLabel
                                value="economy"
                                control={<Radio />}
                                label="Economy"
                                sx={{ width: "100%" }}
                              />
                            </Paper>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                flex: 1,
                                border: "1px solid",
                                borderColor:
                                  bookingDetails.ticketClass === "business" ? "primary.main" : "divider",
                              }}
                            >
                              <FormControlLabel
                                value="business"
                                control={<Radio />}
                                label="Business"
                                sx={{ width: "100%" }}
                              />
                            </Paper>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                flex: 1,
                                border: "1px solid",
                                borderColor:
                                  bookingDetails.ticketClass === "first" ? "primary.main" : "divider",
                              }}
                            >
                              <FormControlLabel
                                value="first"
                                control={<Radio />}
                                label="First"
                                sx={{ width: "100%" }}
                              />
                            </Paper>
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                          label="Departure Time"
                          type="datetime-local"
                          InputLabelProps={{ shrink: true }}
                          value={bookingDetails.departureTime}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, departureTime: e.target.value })}
                          fullWidth
                        />

                        <TextField
                          label="Arrival Time"
                          type="datetime-local"
                          InputLabelProps={{ shrink: true }}
                          value={bookingDetails.arrivalTime}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, arrivalTime: e.target.value })}
                          fullWidth
                        />

                        <TextField
                          label="Ticket Price"
                          type="number"
                          placeholder="0.00"
                          value={bookingDetails.price}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, price: e.target.value })}
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                          }}
                          fullWidth
                        />
                      </Box>
                    </Box>

                    <TextField
                      label="Additional Notes"
                      placeholder="Any special requirements or notes for the booking"
                      multiline
                      rows={4}
                      value={bookingDetails.notes}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                      fullWidth
                      sx={{ mt: 3 }}
                    />
                  </DialogContent>
                  <DialogActions sx={{ p: 2, bgcolor: "action.hover" }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowTicketBooking(false)}
                      sx={{ borderRadius: 28 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleBookTicket}
                      disabled={
                        isBookingTicket ||
                        !bookingDetails.airline ||
                        !bookingDetails.flightNumber ||
                        !bookingDetails.departureTime
                      }
                      sx={{ borderRadius: 28 }}
                    >
                      {isBookingTicket ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Booking Ticket...
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Check sx={{ mr: 1 }} />
                          Confirm Booking
                        </Box>
                      )}
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Notification Dialog */}
                <Dialog
                  open={showNotification}
                  onClose={() => setShowNotification(false)}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "success.light", color: "success.main" }}>
                        <Send />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">Send Notifications</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Notify relevant parties about the travel arrangements
                        </Typography>
                      </Box>
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Recipients
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={notificationDetails.recipients.includes("employee")}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNotificationDetails({
                                      ...notificationDetails,
                                      recipients: [...notificationDetails.recipients, "employee"],
                                    })
                                  } else {
                                    setNotificationDetails({
                                      ...notificationDetails,
                                      recipients: notificationDetails.recipients.filter((r) => r !== "employee"),
                                    })
                                  }
                                }}
                              />
                            }
                            label={`Employee (${selectedRequest.employeeName})`}
                          />

                          {selectedDriver && (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={notificationDetails.recipients.includes("driver")}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNotificationDetails({
                                        ...notificationDetails,
                                        recipients: [...notificationDetails.recipients, "driver"],
                                      })
                                    } else {
                                      setNotificationDetails({
                                        ...notificationDetails,
                                        recipients: notificationDetails.recipients.filter((r) => r !== "driver"),
                                      })
                                    }
                                  }}
                                />
                              }
                              label={`Driver (${selectedDriver.name})`}
                            />
                          )}

                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={notificationDetails.recipients.includes("manager")}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNotificationDetails({
                                      ...notificationDetails,
                                      recipients: [...notificationDetails.recipients, "manager"],
                                    })
                                  } else {
                                    setNotificationDetails({
                                      ...notificationDetails,
                                      recipients: notificationDetails.recipients.filter((r) => r !== "manager"),
                                    })
                                  }
                                }}
                              />
                            }
                            label="Department Manager"
                          />
                        </Box>
                      </Box>

                      <TextField
                        label="Subject"
                        placeholder="Notification subject"
                        value={notificationDetails.subject}
                        onChange={(e) => setNotificationDetails({ ...notificationDetails, subject: e.target.value })}
                        fullWidth
                      />

                      <TextField
                        label="Message"
                        placeholder="Enter notification message"
                        multiline
                        rows={6}
                        value={notificationDetails.message}
                        onChange={(e) => setNotificationDetails({ ...notificationDetails, message: e.target.value })}
                        fullWidth
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationDetails.includeItinerary}
                            onChange={(e) =>
                              setNotificationDetails({
                                ...notificationDetails,
                                includeItinerary: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Include full travel itinerary"
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions sx={{ p: 2, bgcolor: "action.hover" }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowNotification(false)}
                      sx={{ borderRadius: 28 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleSendNotifications}
                      disabled={
                        isSendingNotification ||
                        notificationDetails.recipients.length === 0 ||
                        !notificationDetails.subject ||
                        !notificationDetails.message
                      }
                      sx={{ borderRadius: 28 }}
                    >
                      {isSendingNotification ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Sending...
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Send sx={{ mr: 1 }} />
                          Send Notifications
                        </Box>
                      )}
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 256,
                  textAlign: "center",
                }}
              >
                <Description sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6">No Request Selected</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Select a travel request from the list to view details
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}