"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { jsPDF } from "jspdf"
import {
  CalendarDays,
  Check,
  Clock,
  FileText,
  Filter,
  Globe,
  MoreHorizontal,
  Plane,
  Send,
  Star,
  Truck,
  Users,
  Search,
  MapPin,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  Bell,
  RefreshCw,
  Activity,
  Eye,
  Car,
  Phone,
  Mail,
  Building,
  Calendar,
  Target,
  Sparkles,
  TrendingUp,
  Package,
  MessageSquare,
} from "lucide-react"
import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function FleetCoordinator() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
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
  const [drivers, setDrivers] = useState([])
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
  const backendUrl = process.env.REACT_APP_BACKEND_URL

  const transformRequestData = (data) => {
    return data.map((request) => {
      const parseDate = (dateString) => {
        if (!dateString) return new Date()
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? new Date() : date
      }
      
      const employee = request.employee || { 
        _id: "", 
        firstName: "Unknown", 
        lastName: "", 
        email: "",
        name: "Unknown Employee"
      }

      return {
        id: request._id || request.id || "",
        employeeName: employee.firstName ? `${employee.firstName} ${employee.lastName}` : employee.name || "Unknown",
        fleetNotification: request.fleetNotification || {
          sent: false,
          sentAt: null,
          recipients: [],
          subject: "",
          message: "",
          includeItinerary: false,
          sentBy: null,
        },
        employee: employee,
        employeeId: employee._id,
        department: request.fundingCodes || "Not specified",
        email: employee.email || "",
        purpose: request.purpose || "",
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
          holder: employee.name || "Unknown",
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
        finalApproval: request.finalApproval,
        assignedDriver: request.assignedDriver || null,
      }
    })
  }

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/auth/drivers`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error("Failed to fetch drivers")
        const data = await response.json()
        setDrivers(data)
      } catch (error) {
        console.error("Failed to fetch drivers:", error)
        setSnackbarMessage("Failed to fetch drivers")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    }
    fetchDrivers()
  }, [backendUrl])

  useEffect(() => {
    const fetchTravelRequests = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/travel-requests/finance/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error("Failed to fetch pending travel requests")
        const data = await response.json()
        const transformedRequests = transformRequestData(data)
        setTravelRequests(transformedRequests)
      } catch (error) {
        console.error("Failed to fetch pending travel requests:", error)
        setSnackbarMessage("Failed to fetch pending travel requests")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTravelRequests()
  }, [backendUrl])

  useEffect(() => {
    const fetchLatestRequest = async () => {
      if (!showNotification || !selectedRequest?.id) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/travel-requests/${selectedRequest.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch updated travel request");

        const data = await response.json();
        const updated = transformRequestData([data])[0];
        setSelectedRequest(updated);

      } catch (error) {
        console.error("Error fetching latest request data:", error);
        setSnackbarMessage("Failed to refresh request data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchLatestRequest();
  }, [showNotification, selectedRequest?.id, backendUrl]);

  const filteredRequests = travelRequests.filter((request) => {
    const employeeName = request.employeeName || ""
    const id = request.id || ""
    const country = request.country || ""
    const city = request.city || ""
    const matchesSearch =
      employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    if (!selectedRequest && filteredRequests.length > 0) {
      setSelectedRequest(filteredRequests[0])
    }
  }, [filteredRequests, selectedRequest])

  const generateAndDownloadItinerary = () => {
    if (!selectedRequest) return
    try {
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.setTextColor(79, 70, 229)
      doc.text(`Travel Itinerary - ${selectedRequest.id}`, 105, 20, { align: "center" })
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text("Employee Information", 20, 40)
      doc.setFontSize(12)
      doc.text(`Name: ${selectedRequest.employeeName}`, 20, 50)
      doc.text(`Department: ${selectedRequest.department}`, 20, 60)
      doc.text(`Email: ${selectedRequest.email}`, 20, 70)
      doc.setFontSize(14)
      doc.text("Travel Details", 20, 90)
      doc.setFontSize(12)
      doc.text(`Purpose: ${selectedRequest.purpose}`, 20, 100)
      doc.text(`Destination: ${selectedRequest.city}, ${selectedRequest.country}`, 20, 110)
      doc.text(`Departure: ${format(selectedRequest.departureDate, "MMM d, yyyy")}`, 20, 120)
      doc.text(`Return: ${format(selectedRequest.returnDate, "MMM d, yyyy")}`, 20, 130)
      doc.text(
        `Duration: ${Math.ceil((selectedRequest.returnDate - selectedRequest.departureDate) / (1000 * 60 * 60 * 24)) + 1} days`,
        20,
        140
      )
      if (selectedRequest.fleetNotification) {
        doc.setFontSize(14)
        doc.text("Travel Arrangements", 20, 160)
        doc.setFontSize(12)
        if (selectedRequest.requiresFlight && bookingDetails.airline) {
          doc.text(`Flight: ${bookingDetails.airline} ${bookingDetails.flightNumber}`, 20, 170)
          doc.text(`Departure: ${bookingDetails.departureTime}`, 20, 180)
          doc.text(`Arrival: ${bookingDetails.arrivalTime}`, 20, 190)
          doc.text(`Class: ${bookingDetails.ticketClass}`, 20, 200)
        }
        if (selectedDriver) {
          doc.text(`Assigned Driver: ${selectedDriver.name}`, 20, selectedRequest.requiresFlight ? 210 : 170)
          if (selectedDriver.phone) {
            doc.text(`Driver Contact: ${selectedDriver.phone}`, 20, selectedRequest.requiresFlight ? 220 : 180)
          }
        }
      }
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text("Generated by HRMS Travel System", 105, 280, { align: "center" })
      doc.text(format(new Date(), "MMM d, yyyy h:mm a"), 105, 285, { align: "center" })
      doc.save(`itinerary-${selectedRequest.id}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setSnackbarMessage("Failed to generate itinerary PDF")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  const handleSelectRequest = (request) => {
    setSelectedRequest(request)
    setShowDrivers(false)
    setShowTicketBooking(false)
    setShowNotification(false)
  }

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver)
  }

  const handleAssignDriver = async () => {
    try {
      setIsProcessing(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/travel-requests/${selectedRequest.id}/assign-driver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ driverId: selectedDriver._id }),
      })
      if (!response.ok) throw new Error("Failed to assign driver")
      const data = await response.json()
      const updatedRequest = transformRequestData([data.travelRequest])[0]
      setSelectedRequest(updatedRequest)
      setTravelRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === selectedRequest.id ? updatedRequest : req))
      )
      setShowDrivers(false)
      setShowNotification(true)
      setSnackbarMessage(data.message || "Driver assigned successfully")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Error assigning driver:", error)
      setSnackbarMessage(error.message || "Failed to assign driver")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleProcessRequest = async () => {
    try {
      setIsProcessing(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/travel-requests/${selectedRequest.id}/process`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "in-progress" }),
      })
      if (!response.ok) throw new Error("Failed to process request")
      const updatedRequest = { ...selectedRequest, status: "in-progress" }
      setSelectedRequest(updatedRequest)
      setTravelRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === selectedRequest.id ? updatedRequest : req))
      )
      if (updatedRequest.requiresFlight) {
        setShowTicketBooking(true)
      } else {
        setShowNotification(true)
      }
      setSnackbarMessage("Request processing started")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Error processing request:", error)
      setSnackbarMessage("Failed to process request")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBookTicket = async () => {
    try {
      setIsBookingTicket(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/travel-requests/${selectedRequest.id}/book-flight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingDetails),
      })
      if (!response.ok) throw new Error("Failed to book flight")
      setShowTicketBooking(false)
      setShowNotification(true)
      setNotificationDetails({
        ...notificationDetails,
        subject: `Travel Details for ${selectedRequest.id}`,
        message: `Dear ${selectedRequest.employeeName},\n\nYour travel to ${selectedRequest.city}, ${selectedRequest.country} has been arranged. Flight details: ${bookingDetails.airline} ${bookingDetails.flightNumber}, departing at ${bookingDetails.departureTime}.\n\n${selectedDriver ? `A driver (${selectedDriver.name}) has been assigned to assist you during your trip.` : "No driver has been assigned for this trip."}\n\nPlease contact the travel department if you have any questions.`,
      })
      setSnackbarMessage("Flight booked successfully")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Error booking flight:", error)
      setSnackbarMessage("Failed to book flight")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setIsBookingTicket(false)
    }
  }

  const handleSendNotifications = async () => {
    try {
      setIsSendingNotification(true);
      const token = localStorage.getItem("token");

      const recipients = notificationDetails.recipients.map(recipientType => {
        if (recipientType === "employee") {
          return selectedRequest.employee._id;
        } else if (recipientType === "driver" && selectedRequest.assignedDriver) {
          return selectedRequest.assignedDriver._id;
        } else if (recipientType === "manager") {
          return selectedRequest.supervisor;
        }
        return null;
      }).filter(id => id);

      const requestBody = {
        subject: notificationDetails.subject,
        message: notificationDetails.message,
        includeItinerary: notificationDetails.includeItinerary,
        recipients: recipients
      };

      const response = await fetch(`${backendUrl}/api/travel-requests/${selectedRequest.id}/send-notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
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
          sentBy: "currentUserId",
        },
      };
      
      setSelectedRequest(updatedRequest);
      setTravelRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === selectedRequest.id ? updatedRequest : req))
      );
      
      setShowNotification(false);
      setSnackbarMessage("Notifications sent successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error sending notifications:", error);
      setSnackbarMessage(error.message || "Failed to send notifications");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSendingNotification(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
        )
      case "in-progress":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Activity size={14} className="mr-1" />
            In Progress
          </span>
        )
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle size={14} className="mr-1" />
            Completed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        )
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">High</span>
      case "medium":
        return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">Medium</span>
      case "low":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Low</span>
      default:
        return null
    }
  }

  const getTotalRequests = () => filteredRequests.length
  const getPendingRequests = () => filteredRequests.filter(req => (!req.fleetNotification || !req.fleetNotification.sent) && req.requiresDriver).length
  const getCompletedRequests = () => filteredRequests.filter(req => req.fleetNotification && req.fleetNotification.sent).length
  const getActiveDrivers = () => drivers.length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <DotLottieReact
      src="loading.lottie"
      loop
      autoplay
    />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Fleet Management</h2>
          <p className="text-gray-600">
            Please wait while we fetch the latest travel requests...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <Truck size={32} />
                </div>
                Fleet Coordinator & Air Ticket Booking
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Manage driver assignments and flight bookings for travel requests
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Bell size={20} />
              </button>
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <FileText size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getTotalRequests()}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalRequests()}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <Clock size={24} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getPendingRequests()}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{getPendingRequests()}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getCompletedRequests()}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{getCompletedRequests()}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Car size={24} className="text-white" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getActiveDrivers()}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{getActiveDrivers()}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Travel Requests */}
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "pending"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "completed"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Scrollable Requests List */}
            <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {activeTab === "pending" && (
                <>
                  {filteredRequests.filter(
                    (request) => (!request.fleetNotification || !request.fleetNotification.sent) && request.requiresDriver
                  ).length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-xl text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <FileText size={32} className="text-gray-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests found</h3>
                          <p className="text-gray-600">All travel requests have been processed</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    filteredRequests
                      .filter(
                        (request) => (!request.fleetNotification || !request.fleetNotification.sent) && request.requiresDriver
                      )
                      .map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          onClick={() => handleSelectRequest(request)}
                          className={`bg-white/80 backdrop-blur-sm rounded-2xl border p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                            selectedRequest?.id === request.id
                              ? "border-blue-500 bg-blue-50/50"
                              : "border-gray-200/50 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{request.employeeName}</h3>
                              <p className="text-gray-600 text-sm">{request.id}</p>
                            </div>
                            {getPriorityBadge(request.priority)}
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Globe size={16} className="text-gray-400" />
                              <span className="text-sm">{request.city}, {request.country}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <CalendarDays size={16} className="text-gray-400" />
                              <span className="text-sm">
                                {format(request.departureDate, "MMM d")} - {format(request.returnDate, "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              {request.requiresDriver && (
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Truck size={16} className="text-blue-600" />
                                </div>
                              )}
                              {request.requiresFlight && (
                                <div className="p-2 bg-purple-100 rounded-lg">
                                  <Plane size={16} className="text-purple-600" />
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(request.submittedAt, "MMM d, yyyy")}
                            </span>
                          </div>
                        </motion.div>
                      ))
                  )}
                </>
              )}

              {activeTab === "completed" && (
                <>
                  {filteredRequests.filter((request) => request.fleetNotification && request.fleetNotification.sent).length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-xl text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <CheckCircle size={32} className="text-gray-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed requests found</h3>
                          <p className="text-gray-600">Completed requests will appear here</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    filteredRequests
                      .filter((request) => request.fleetNotification && request.fleetNotification.sent)
                      .map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          onClick={() => handleSelectRequest(request)}
                          className={`bg-white/80 backdrop-blur-sm rounded-2xl border p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                            selectedRequest?.id === request.id
                              ? "border-green-500 bg-green-50/50"
                              : "border-gray-200/50 hover:border-green-300"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{request.employeeName}</h3>
                              <p className="text-gray-600 text-sm">{request.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={20} className="text-green-500" />
                              {getPriorityBadge(request.priority)}
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Globe size={16} className="text-gray-400" />
                              <span className="text-sm">{request.city}, {request.country}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <CalendarDays size={16} className="text-gray-400" />
                              <span className="text-sm">
                                {format(request.departureDate, "MMM d")} - {format(request.returnDate, "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              {request.requiresDriver && (
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Truck size={16} className="text-blue-600" />
                                </div>
                              )}
                              {request.requiresFlight && (
                                <div className="p-2 bg-purple-100 rounded-lg">
                                  <Plane size={16} className="text-purple-600" />
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              Completed {format(new Date(request.fleetNotification.sentAt), "MMM d")}
                            </span>
                          </div>
                        </motion.div>
                      ))
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column - Request Details and Actions */}
          <div className="space-y-6">
            {selectedRequest ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-b border-gray-100/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                        <FileText size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-gray-900">{selectedRequest.employeeName}</h2>
                          {getStatusBadge(selectedRequest.status)}
                        </div>
                        <p className="text-gray-600 mt-1">{selectedRequest.id} • {selectedRequest.department}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-2">Purpose of Travel</p>
                        <p className="text-gray-900">{selectedRequest.purpose || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-2">Destination</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="text-blue-500" size={18} />
                          <span className="text-gray-900">{selectedRequest.city}, {selectedRequest.country}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-2">Travel Period</p>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="text-blue-500" size={18} />
                          <span className="text-gray-900">
                            {format(selectedRequest.departureDate, "MMM d, yyyy")} - {format(selectedRequest.returnDate, "MMM d, yyyy")}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                            {Math.ceil((selectedRequest.returnDate - selectedRequest.departureDate) / (1000 * 60 * 60 * 24)) + 1} days
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-3">Requirements</p>
                        <div className="space-y-2">
                          <label className="flex items-center gap-3">
                            <input type="checkbox" checked={selectedRequest.requiresDriver} disabled className="rounded border-gray-300" />
                            <span className="text-sm text-gray-700">Driver Required</span>
                          </label>
                          <label className="flex items-center gap-3">
                            <input type="checkbox" checked={selectedRequest.requiresFlight} disabled className="rounded border-gray-300" />
                            <span className="text-sm text-gray-700">Flight Booking Required</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-2">Documents</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRequest.documents.length > 0 ? (
                            selectedRequest.documents.map((doc, index) => (
                              <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                <FileText size={12} />
                                {doc}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No documents</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-2">Submitted</p>
                        <div className="flex items-center gap-2">
                          <Clock className="text-blue-500" size={18} />
                          <span className="text-gray-900">{format(selectedRequest.submittedAt, "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Alerts */}
                  {selectedRequest.status === "pending" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="text-amber-600" size={20} />
                        <div>
                          <h4 className="font-semibold text-amber-800">Action Required</h4>
                          <p className="text-amber-700 text-sm mt-1">
                            This request requires your attention. Please assign a driver (if needed) and initiate the flight booking process.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRequest.status === "in-progress" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Info className="text-blue-600" size={20} />
                        <div>
                          <h4 className="font-semibold text-blue-800">In Progress</h4>
                          <p className="text-blue-700 text-sm mt-1">
                            This request is being processed. Complete the remaining steps to finalize the travel arrangements.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRequest.status === "completed" && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={20} />
                        <div>
                          <h4 className="font-semibold text-green-800">Completed</h4>
                          <p className="text-green-700 text-sm mt-1">
                            All travel arrangements have been completed for this request.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="bg-gray-50/50 border-t border-gray-100 p-6 flex justify-between items-center">
                  {selectedRequest.status === "pending" && (
                    <>
                      <button
                        onClick={() => navigate("/travel-dashboard")}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      >
                        Back to Dashboard
                      </button>
                      <div className="flex gap-3">
                        {selectedRequest.requiresDriver && (
                          <button
                            onClick={() => setShowDrivers(true)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-200 transition-colors duration-200 flex items-center gap-2"
                          >
                            <Users size={16} />
                            Assign Driver
                          </button>
                        )}
                        <button
                          onClick={handleProcessRequest}
                          disabled={isProcessing}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check size={16} />
                              Process Request
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}

                  {selectedRequest.status === "in-progress" && (
                    <>
                      <button
                        onClick={() => navigate("/travel-dashboard")}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      >
                        Back to Dashboard
                      </button>
                      <div className="flex gap-3">
                        {selectedRequest.requiresFlight && !showTicketBooking && !showNotification && (
                          <button
                            onClick={() => setShowTicketBooking(true)}
                            className="px-4 py-2 bg-purple-100 text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-200 transition-colors duration-200 flex items-center gap-2"
                          >
                            <Plane size={16} />
                            Book Flight
                          </button>
                        )}
                        {!showTicketBooking && !showNotification && (
                          <button
                            onClick={() => setShowNotification(true)}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2"
                          >
                            <Send size={16} />
                            Send Notifications
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {selectedRequest.status === "completed" && (
                    <>
                      <button
                        onClick={() => navigate("/travel-dashboard")}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      >
                        Back to Dashboard
                      </button>
                      <button
                        onClick={generateAndDownloadItinerary}
                        className="px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded-xl hover:bg-green-200 transition-colors duration-200 flex items-center gap-2"
                      >
                        <Download size={16} />
                        Download Itinerary
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-12 text-center">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <FileText size={40} className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Request Selected</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Select a travel request from the list to view details and manage fleet coordination
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Driver Assignment Modal */}
      {showDrivers && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Users size={24} className="text-blue-500" />
                    Assign Driver
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Select a driver for {selectedRequest?.employeeName}'s trip to {selectedRequest?.city}
                  </p>
                </div>
                <button
                  onClick={() => setShowDrivers(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search drivers by name, location, or language..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-4">
                {drivers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No drivers available</p>
                  </div>
                ) : (
                  drivers.map((driver) => (
                    <motion.div
                      key={driver._id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectDriver(driver)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedDriver?._id === driver._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {driver.firstName?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{driver.firstName}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin size={14} />
                              <span>{driver.location || "Location not specified"}</span>
                            </div>
                            {driver.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone size={14} />
                                <span>{driver.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {driver.rating && (
                            <div className="flex items-center gap-1 mb-1">
                              <Star size={16} className="text-yellow-500 fill-current" />
                              <span className="font-semibold">{driver.rating}</span>
                            </div>
                          )}
                          {driver.experience && (
                            <p className="text-sm text-gray-600">{driver.experience}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowDrivers(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDriver}
                disabled={!selectedDriver || isProcessing}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Assigning...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Confirm Driver
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Flight Booking Modal */}
      {showTicketBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Plane size={24} className="text-purple-500" />
                    Air Ticket Booking
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Book flight for {selectedRequest?.employeeName}'s trip to {selectedRequest?.city}, {selectedRequest?.country}
                  </p>
                </div>
                <button
                  onClick={() => setShowTicketBooking(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
                    <select
                      value={bookingDetails.airline}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, airline: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="" disabled>Select Airline</option>
                      <option value="japan-airlines">Japan Airlines</option>
                      <option value="ana">All Nippon Airways</option>
                      <option value="delta">Delta Airlines</option>
                      <option value="united">United Airlines</option>
                      <option value="emirates">Emirates</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number</label>
                    <input
                      type="text"
                      placeholder="e.g., JL123"
                      value={bookingDetails.flightNumber}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, flightNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Ticket Class</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["economy", "business", "first"].map((classType) => (
                        <label
                          key={classType}
                          className={`relative flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-200 ${
                            bookingDetails.ticketClass === classType
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-300 hover:border-purple-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="ticketClass"
                            value={classType}
                            checked={bookingDetails.ticketClass === classType}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, ticketClass: e.target.value })}
                            className="sr-only"
                          />
                          <span className="font-medium capitalize">{classType}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
                    <input
                      type="datetime-local"
                      value={bookingDetails.departureTime}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, departureTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Time</label>
                    <input
                      type="datetime-local"
                      value={bookingDetails.arrivalTime}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, arrivalTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={bookingDetails.price}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, price: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  placeholder="Any special requirements or notes for the booking"
                  rows={4}
                  value={bookingDetails.notes}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowTicketBooking(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBookTicket}
                disabled={
                  isBookingTicket ||
                  !bookingDetails.airline ||
                  !bookingDetails.flightNumber ||
                  !bookingDetails.departureTime
                }
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {isBookingTicket ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Booking Ticket...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Send size={24} className="text-green-500" />
                    Send Notifications
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Notify relevant parties about the travel arrangements
                  </p>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Recipients</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
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
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">Employee ({selectedRequest?.employee.email})</span>
                  </label>
                  
                  {selectedRequest?.assignedDriver && (
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
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
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700">Driver ({selectedRequest.assignedDriver.email})</span>
                    </label>
                  )}
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
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
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">Department Manager</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Notification subject"
                  value={notificationDetails.subject}
                  onChange={(e) => setNotificationDetails({ ...notificationDetails, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  placeholder="Enter notification message"
                  rows={6}
                  value={notificationDetails.message}
                  onChange={(e) => setNotificationDetails({ ...notificationDetails, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notificationDetails.includeItinerary}
                  onChange={(e) =>
                    setNotificationDetails({
                      ...notificationDetails,
                      includeItinerary: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Include full travel itinerary</span>
              </label>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowNotification(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotifications}
                disabled={
                  isSendingNotification ||
                  notificationDetails.recipients.length === 0 ||
                  !notificationDetails.subject ||
                  !notificationDetails.message
                }
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {isSendingNotification ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Notifications
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Snackbar Notification */}
      {snackbarOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className={`px-6 py-4 rounded-xl shadow-2xl border max-w-md ${
            snackbarSeverity === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : snackbarSeverity === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}>
            <div className="flex items-center gap-3">
              {snackbarSeverity === "success" && <CheckCircle size={20} className="text-green-600" />}
              {snackbarSeverity === "error" && <AlertCircle size={20} className="text-red-600" />}
              {snackbarSeverity === "info" && <Info size={20} className="text-blue-600" />}
              <span className="font-medium">{snackbarMessage}</span>
              <button
                onClick={() => setSnackbarOpen(false)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}