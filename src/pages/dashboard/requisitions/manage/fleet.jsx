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
  Globe,
  MoreHorizontal,
  Plane,
  Send,
  Star,
  Truck,
  Users,
  Search,
  MapPin,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  Bell,
  RefreshCw,
  Activity,
  Car,
  Phone,
  Building,
  TrendingUp,
  TrendingDown,
  Loader,
} from "lucide-react"
import { motion } from "framer-motion"

// LoadingOverlay Component (matching vendors.js style)
const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
        <Loader className="animate-spin w-6 h-6 text-blue-500" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}

// MetricCard Component (matching vendors.js style)
const MetricCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
  prefix = "",
  suffix = "",
  size = "normal",
}) => {
  const cardClass = size === "large" ? "col-span-2" : ""
  const valueSize = size === "large" ? "text-4xl" : "text-2xl"

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-1.5 hover:shadow-sm transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-1">
        <div
          className={`p-1.5 rounded-xl ${
            color === "blue"
              ? "bg-blue-50"
              : color === "green"
                ? "bg-emerald-50"
                : color === "purple"
                  ? "bg-purple-50"
                  : color === "orange"
                    ? "bg-orange-50"
                    : color === "amber"
                      ? "bg-amber-50"
                      : color === "red"
                        ? "bg-red-50"
                        : "bg-gray-50"
          }`}
        >
          <Icon
            size={16}
            className={
              color === "blue"
                ? "text-blue-600"
                : color === "green"
                  ? "text-emerald-600"
                  : color === "purple"
                    ? "text-purple-600"
                    : color === "orange"
                      ? "text-orange-600"
                      : color === "amber"
                        ? "text-amber-600"
                        : color === "red"
                          ? "text-red-600"
                          : "text-gray-600"
            }
          />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp size={12} className="text-emerald-500" />
            ) : (
              <TrendingDown size={12} className="text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend > 0 ? "text-emerald-500" : "text-red-500"}`}>
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`${valueSize} font-bold text-gray-900 mb-1`}>
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  )
}

// StatusBadge Component (compact design)
const StatusBadge = ({ status }) => {
  const getColors = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getIcon = (status) => {
    switch (status) {
      case "pending":
        return Clock
      case "in-progress":
        return Activity
      case "completed":
        return CheckCircle
      default:
        return Clock
    }
  }

  const Icon = getIcon(status)

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getColors(status)}`}>
      <Icon size={12} className="mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  )
}

// PriorityBadge Component (compact design)
const PriorityBadge = ({ priority }) => {
  const colors = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-green-50 text-green-700 border-green-200",
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[priority] || "bg-gray-50 text-gray-700 border-gray-200"}`}
    >
      {priority}
    </span>
  )
}

// RequestCard Component (compact design)
const RequestCard = ({ request, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-2 cursor-pointer transition-all hover:shadow-sm ${
        isSelected ? "border-blue-500 shadow-sm" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-1.5">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{request.employeeName}</h3>
          <p className="text-xs text-gray-500">{request.employee.email}</p>
        </div>
        <PriorityBadge priority={request.priority} />
      </div>

      <div className="space-y-1 mb-1.5">
        <div className="flex items-center gap-1.5 text-gray-700">
          <Globe size={12} className="text-gray-400" />
          <span className="text-xs">
            {request.city}, {request.country}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-700">
          <CalendarDays size={12} className="text-gray-400" />
          <span className="text-xs">
            {format(request.departureDate, "MMM d")} - {format(request.returnDate, "MMM d, yyyy")}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {request.requiresDriver && (
            <div className="p-1 bg-blue-50 rounded-lg">
              <Truck size={12} className="text-blue-600" />
            </div>
          )}
          {request.requiresFlight && (
            <div className="p-1 bg-purple-50 rounded-lg">
              <Plane size={12} className="text-purple-600" />
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500">{format(request.submittedAt, "MMM d, yyyy")}</span>
      </div>
    </div>
  )
}

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
    recipients: ["employee"],
    subject: "",
    message: "",
    includeItinerary: true,
  })

  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV

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
        name: "Unknown Employee",
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

  // Auto-generate notification messages based on recipient and travel context
  const generateNotificationContent = (recipientType) => {
    if (!selectedRequest) return { subject: "", message: "" }

    const travelDuration =
      Math.ceil((selectedRequest.returnDate - selectedRequest.departureDate) / (1000 * 60 * 60 * 24)) + 1
    const departureDate = format(selectedRequest.departureDate, "EEEE, MMMM d, yyyy")
    const returnDate = format(selectedRequest.returnDate, "EEEE, MMMM d, yyyy")

    switch (recipientType) {
      case "employee":
        return {
          subject: `Travel Arrangements Confirmed - ${selectedRequest.city}, ${selectedRequest.country}`,
          message: `Dear ${selectedRequest.employeeName},

Your travel arrangements for your trip to ${selectedRequest.city}, ${selectedRequest.country} have been finalized. Here are the details:

🗓️ TRAVEL PERIOD:
• Departure: ${departureDate}
• Return: ${returnDate}
• Duration: ${travelDuration} days

📍 DESTINATION:
• Location: ${selectedRequest.city}, ${selectedRequest.country}
• Purpose: ${selectedRequest.purpose}

${
  selectedRequest.requiresFlight && bookingDetails.airline
    ? `✈️ FLIGHT DETAILS:
• Airline: ${bookingDetails.airline}
• Flight Number: ${bookingDetails.flightNumber}
• Departure Time: ${bookingDetails.departureTime ? format(new Date(bookingDetails.departureTime), "MMM d, yyyy 'at' h:mm a") : "TBD"}
• Arrival Time: ${bookingDetails.arrivalTime ? format(new Date(bookingDetails.arrivalTime), "MMM d, yyyy 'at' h:mm a") : "TBD"}
• Class: ${bookingDetails.ticketClass.charAt(0).toUpperCase() + bookingDetails.ticketClass.slice(1)}
${bookingDetails.notes ? `• Special Notes: ${bookingDetails.notes}` : ""}

`
    : ""
}${
  selectedRequest.assignedDriver
    ? `🚗 GROUND TRANSPORTATION:
• Driver Assigned: ${selectedRequest.assignedDriver.firstName || selectedDriver?.firstName || selectedDriver?.name}
• Contact: ${selectedRequest.assignedDriver.phone || selectedDriver?.phone || "Contact details will be provided"}
• Your driver will coordinate pickup times and locations with you directly.

`
    : ""
}📄 IMPORTANT REMINDERS:
• Please carry all required travel documents
• Confirm your accommodation arrangements
• Review company travel policies
• Keep all receipts for expense reporting

If you have any questions or need assistance, please contact the travel department immediately.

Safe travels!

Best regards,
HRMS Travel Department`,
        }

      case "driver":
        return {
          subject: `New Assignment - Transport Service for ${selectedRequest.employeeName}`,
          message: `Dear ${selectedDriver?.firstName || selectedDriver?.name || "Driver"},

You have been assigned to provide transportation services for the following travel request:

👤 PASSENGER DETAILS:
• Name: ${selectedRequest.employeeName}
• Department: ${selectedRequest.department}
• Contact: ${selectedRequest.email}

🗓️ TRAVEL SCHEDULE:
• Trip Start: ${departureDate}
• Trip End: ${returnDate}
• Duration: ${travelDuration} days
• Destination: ${selectedRequest.city}, ${selectedRequest.country}

📍 SERVICE REQUIREMENTS:
• Purpose: ${selectedRequest.purpose}
• Type: ${selectedRequest.travelType === "international" ? "International Travel" : "Local Travel"}

${
  selectedRequest.requiresFlight && bookingDetails.airline
    ? `✈️ FLIGHT COORDINATION:
• Airline: ${bookingDetails.airline} ${bookingDetails.flightNumber}
• Departure: ${bookingDetails.departureTime ? format(new Date(bookingDetails.departureTime), "MMM d, yyyy 'at' h:mm a") : "TBD"}
• Return Flight: ${bookingDetails.arrivalTime ? format(new Date(bookingDetails.arrivalTime), "MMM d, yyyy 'at' h:mm a") : "TBD"}
• Please coordinate airport transfers with the passenger

`
    : ""
}📋 NEXT STEPS:
• Contact the passenger to arrange pickup details
• Confirm vehicle readiness and fuel
• Plan optimal routes to destinations
• Maintain professional service standards

⚠️ IMPORTANT:
• Arrive 15 minutes early for all pickups
• Keep vehicle clean and presentable
• Follow all company safety protocols
• Report any issues immediately to fleet management

Please confirm receipt of this assignment and contact the passenger within 24 hours to coordinate arrangements.

Best regards,
Fleet Management Team`,
        }

      case "manager":
        return {
          subject: `Travel Arrangements Summary - ${selectedRequest.employeeName}`,
          message: `Dear Manager,

This is to inform you that travel arrangements have been completed for ${selectedRequest.employeeName}'s business trip.

📊 TRAVEL SUMMARY:
• Employee: ${selectedRequest.employeeName} (${selectedRequest.department})
• Destination: ${selectedRequest.city}, ${selectedRequest.country}
• Purpose: ${selectedRequest.purpose}
• Travel Period: ${departureDate} to ${returnDate} (${travelDuration} days)

💼 ARRANGEMENTS MADE:
${selectedRequest.requiresFlight ? "• Flight booking completed" : "• No flight required"}
${selectedRequest.assignedDriver ? `• Driver assigned: ${selectedRequest.assignedDriver.firstName || selectedDriver?.firstName || selectedDriver?.name}` : "• No driver assigned"}
• All notifications sent to relevant parties
• Travel request ID: ${selectedRequest.id}

💰 BUDGET INFORMATION:
• Per Diem: ${selectedRequest.currency === "MWK" ? "MWK" : "$"}${selectedRequest.perDiemAmount?.toLocaleString()}
${bookingDetails.price ? `• Flight Cost: $${bookingDetails.price}` : ""}

The employee has been notified of all arrangements and is ready for travel.

Best regards,
HRMS Travel Department`,
        }

      default:
        return { subject: "", message: "" }
    }
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
      if (!showNotification || !selectedRequest?.id) return

      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/travel-requests/${selectedRequest.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error("Failed to fetch updated travel request")

        const data = await response.json()
        const updated = transformRequestData([data])[0]
        setSelectedRequest(updated)
      } catch (error) {
        console.error("Error fetching latest request data:", error)
        setSnackbarMessage("Failed to refresh request data")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    }

    fetchLatestRequest()
  }, [showNotification, selectedRequest?.id, backendUrl])

  // Auto-populate notification details when modal opens or recipients change
  useEffect(() => {
    if (showNotification && selectedRequest) {
      // Generate content based on primary recipient (employee is default)
      const primaryRecipient = notificationDetails.recipients.includes("employee")
        ? "employee"
        : notificationDetails.recipients.includes("driver")
          ? "driver"
          : "manager"

      const content = generateNotificationContent(primaryRecipient)
      setNotificationDetails((prev) => ({
        ...prev,
        subject: content.subject,
        message: content.message,
      }))
    }
  }, [showNotification, selectedRequest, notificationDetails.recipients])

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
        140,
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
        prevRequests.map((req) => (req.id === selectedRequest.id ? updatedRequest : req)),
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
        prevRequests.map((req) => (req.id === selectedRequest.id ? updatedRequest : req)),
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
      setIsSendingNotification(true)
      const token = localStorage.getItem("token")

      // Send individual notifications with personalized messages
      const notificationPromises = notificationDetails.recipients.map(async (recipientType) => {
        let recipientId

        if (recipientType === "employee") {
          recipientId = selectedRequest.employee._id
        } else if (recipientType === "driver" && selectedRequest.assignedDriver) {
          recipientId = selectedRequest.assignedDriver._id
        } else if (recipientType === "manager") {
          recipientId = selectedRequest.supervisor
        }

        if (!recipientId) return null

        const content = generateNotificationContent(recipientType)

        return fetch(`${backendUrl}/api/travel-requests/${selectedRequest.id}/send-notifications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subject: content.subject,
            message: content.message,
            includeItinerary: notificationDetails.includeItinerary,
            recipients: [recipientId],
            recipientType: recipientType,
          }),
        })
      })

      const responses = await Promise.all(notificationPromises.filter(Boolean))

      // Check if all requests were successful
      const failedResponses = responses.filter((response) => !response.ok)

      if (failedResponses.length > 0) {
        throw new Error(`Failed to send ${failedResponses.length} notification(s)`)
      }

      const updatedRequest = {
        ...selectedRequest,
        status: "completed",
        fleetNotification: {
          sent: true,
          sentAt: new Date().toISOString(),
          recipients: notificationDetails.recipients,
          subject: "Multiple personalized notifications sent",
          message: "Automated context-aware messages sent to all recipients",
          includeItinerary: notificationDetails.includeItinerary,
          sentBy: "currentUserId",
        },
      }

      setSelectedRequest(updatedRequest)
      setTravelRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === selectedRequest.id ? updatedRequest : req)),
      )

      setShowNotification(false)
      setSnackbarMessage(
        `Personalized notifications sent successfully to ${notificationDetails.recipients.length} recipient(s)`,
      )
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Error sending notifications:", error)
      setSnackbarMessage(error.message || "Failed to send notifications")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setIsSendingNotification(false)
    }
  }

  const getTotalRequests = () => filteredRequests.length
  const getPendingRequests = () =>
    filteredRequests.filter((req) => (!req.fleetNotification || !req.fleetNotification.sent) && req.requiresDriver)
      .length
  const getCompletedRequests = () =>
    filteredRequests.filter((req) => req.fleetNotification && req.fleetNotification.sent).length
  const getActiveDrivers = () => drivers.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading fleet management data..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Travel Requests */}
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
                />
              </div>

              {/* Tabs */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors text-sm ${
                    activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors text-sm ${
                    activeTab === "completed" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
              {activeTab === "pending" && (
                <>
                  {filteredRequests.filter(
                    (request) =>
                      (!request.fleetNotification || !request.fleetNotification.sent) && request.requiresDriver,
                  ).length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                      <FileText size={32} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests found</h3>
                      <p className="text-gray-600">All travel requests have been processed</p>
                    </div>
                  ) : (
                    filteredRequests
                      .filter(
                        (request) =>
                          (!request.fleetNotification || !request.fleetNotification.sent) && request.requiresDriver,
                      )
                      .map((request) => (
                        <RequestCard
                          key={request.id}
                          request={request}
                          isSelected={selectedRequest?.id === request.id}
                          onClick={() => handleSelectRequest(request)}
                        />
                      ))
                  )}
                </>
              )}

              {activeTab === "completed" && (
                <>
                  {filteredRequests.filter((request) => request.fleetNotification && request.fleetNotification.sent)
                    .length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                      <CheckCircle size={32} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed requests found</h3>
                      <p className="text-gray-600">Completed requests will appear here</p>
                    </div>
                  ) : (
                    filteredRequests
                      .filter((request) => request.fleetNotification && request.fleetNotification.sent)
                      .map((request) => (
                        <RequestCard
                          key={request.id}
                          request={request}
                          isSelected={selectedRequest?.id === request.id}
                          onClick={() => handleSelectRequest(request)}
                        />
                      ))
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column - Request Details and Actions */}
          <div className="space-y-4">
            {selectedRequest ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-xl">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-gray-900">{selectedRequest.employeeName}</h2>
                          <StatusBadge status={selectedRequest.status} />
                        </div>
                        <p className="text-gray-600 text-sm">
                          {selectedRequest.employee.email} • {selectedRequest.department}
                        </p>
                      </div>
                    </div>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Purpose of Travel</p>
                        <p className="text-gray-900 text-sm">{selectedRequest.purpose || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Destination</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="text-blue-500" size={16} />
                          <span className="text-gray-900 text-sm">
                            {selectedRequest.city}, {selectedRequest.country}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Travel Period</p>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="text-blue-500" size={16} />
                          <span className="text-gray-900 text-sm">
                            {format(selectedRequest.departureDate, "MMM d, yyyy")} -{" "}
                            {format(selectedRequest.returnDate, "MMM d, yyyy")}
                          </span>
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium ml-2">
                            {Math.ceil(
                              (selectedRequest.returnDate - selectedRequest.departureDate) / (1000 * 60 * 60 * 24),
                            ) + 1}{" "}
                            days
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-2">Requirements</p>
                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedRequest.requiresDriver}
                              disabled
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="text-xs text-gray-700">Driver Required</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedRequest.requiresFlight}
                              disabled
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="text-xs text-gray-700">Flight Booking Required</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Documents</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedRequest.documents.length > 0 ? (
                            selectedRequest.documents.map((doc, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs"
                              >
                                <FileText size={10} />
                                {doc}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">No documents</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Submitted</p>
                        <div className="flex items-center gap-2">
                          <Clock className="text-blue-500" size={16} />
                          <span className="text-gray-900 text-sm">
                            {format(selectedRequest.submittedAt, "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Alerts */}
                  {selectedRequest.status === "pending" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800 text-sm">Action Required</h4>
                          <p className="text-amber-700 text-xs">
                            This request requires your attention. Please assign a driver (if needed) and initiate the
                            flight booking process.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRequest.status === "in-progress" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800 text-sm">In Progress</h4>
                          <p className="text-blue-700 text-xs">
                            This request is being processed. Complete the remaining steps to finalize the travel
                            arrangements.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRequest.status === "completed" && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800 text-sm">Completed</h4>
                          <p className="text-green-700 text-xs">
                            All travel arrangements have been completed for this request.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between items-center">
                  {selectedRequest.status === "pending" && (
                    <>
                      <button
                        onClick={() => navigate("/travel-dashboard")}
                        className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm"
                      >
                        Back to Dashboard
                      </button>
                      <div className="flex gap-2">
                        {selectedRequest.requiresDriver && (
                          <button
                            onClick={() => setShowDrivers(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 text-sm"
                          >
                            <Users size={14} />
                            Assign Driver
                          </button>
                        )}
                        <button
                          onClick={handleProcessRequest}
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 text-sm"
                        >
                          {isProcessing ? (
                            <>
                              <Loader className="animate-spin w-4 h-4" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check size={14} />
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
                        className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm"
                      >
                        Back to Dashboard
                      </button>
                      <div className="flex gap-2">
                        {selectedRequest.requiresFlight && !showTicketBooking && !showNotification && (
                          <button
                            onClick={() => setShowTicketBooking(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-100 text-sm"
                          >
                            <Plane size={14} />
                            Book Flight
                          </button>
                        )}
                        {!showTicketBooking && !showNotification && (
                          <button
                            onClick={() => setShowNotification(true)}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm"
                          >
                            <Send size={14} />
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
                        className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm"
                      >
                        Back to Dashboard
                      </button>
                      <button
                        onClick={generateAndDownloadItinerary}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-100 text-sm"
                      >
                        <Download size={14} />
                        Download Itinerary
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <FileText size={40} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Request Selected</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Select a travel request from the list to view details and manage fleet coordination
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Driver Assignment Modal */}
      {showDrivers && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Assign Driver</h2>
                <button onClick={() => setShowDrivers(false)} className="p-1.5 hover:bg-gray-100 rounded-2xl">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-gray-600 mb-4 text-sm">
                Select a driver for {selectedRequest?.employeeName}'s trip to {selectedRequest?.city}
              </p>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search drivers by name, location, or language..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-sm"
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {drivers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No drivers available</p>
                  </div>
                ) : (
                  drivers.map((driver) => (
                    <div
                      key={driver._id}
                      onClick={() => handleSelectDriver(driver)}
                      className={`p-3 border rounded-2xl cursor-pointer transition-colors ${
                        selectedDriver?._id === driver._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                            {driver.firstName?.charAt(0) || "D"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{driver.firstName}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <MapPin size={12} />
                              <span>{driver.location?.coordinates?.city || "Location not specified"}</span>
                            </div>
                            {driver.phone && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Phone size={12} />
                                <span>{driver.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {driver.rating && (
                            <div className="flex items-center gap-1 mb-1">
                              <Star size={14} className="text-yellow-500 fill-current" />
                              <span className="font-semibold text-sm">{driver.rating}</span>
                            </div>
                          )}
                          {driver.experience && <p className="text-xs text-gray-600">{driver.experience}</p>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowDrivers(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignDriver}
                  disabled={!selectedDriver || isProcessing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 text-sm"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin w-4 h-4" />
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
            </div>
          </div>
        </div>
      )}

      {/* Flight Booking Modal */}
      {showTicketBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Air Ticket Booking</h2>
                <button onClick={() => setShowTicketBooking(false)} className="p-1.5 hover:bg-gray-100 rounded-2xl">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-gray-600 mb-4 text-sm">
                Book flight for {selectedRequest?.employeeName}'s trip to {selectedRequest?.city},{" "}
                {selectedRequest?.country}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Airline</label>
                    <select
                      value={bookingDetails.airline}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, airline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-2xl text-sm"
                    >
                      <option value="" disabled>
                        Select Airline
                      </option>
                      <option value="japan-airlines">Japan Airlines</option>
                      <option value="ana">All Nippon Airways</option>
                      <option value="delta">Delta Airlines</option>
                      <option value="united">United Airlines</option>
                      <option value="emirates">Emirates</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Flight Number</label>
                    <input
                      type="text"
                      placeholder="e.g., JL123"
                      value={bookingDetails.flightNumber}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, flightNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-2xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Ticket Class</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["economy", "business", "first"].map((classType) => (
                        <label
                          key={classType}
                          className={`relative flex items-center justify-center p-2 border rounded-xl cursor-pointer transition-colors ${
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
                          <span className="font-medium capitalize text-xs">{classType}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Departure Time</label>
                    <input
                      type="datetime-local"
                      value={bookingDetails.departureTime}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, departureTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-2xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Arrival Time</label>
                    <input
                      type="datetime-local"
                      value={bookingDetails.arrivalTime}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, arrivalTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-2xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ticket Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={bookingDetails.price}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, price: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-2xl text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  placeholder="Any special requirements or notes for the booking"
                  rows={3}
                  value={bookingDetails.notes}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-2xl text-sm resize-none"
                />
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowTicketBooking(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm"
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
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 text-sm"
                >
                  {isBookingTicket ? (
                    <>
                      <Loader className="animate-spin w-4 h-4" />
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
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Send Travel Notifications</h2>
                <button onClick={() => setShowNotification(false)} className="p-1.5 hover:bg-gray-100 rounded-2xl">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 text-sm">Automated Notifications</h4>
                    <p className="text-blue-700 text-xs">
                      Personalized messages will be automatically generated for each recipient based on their role and
                      the travel details.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Select Recipients</label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                      notificationDetails.recipients.includes("employee")
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-green-300"
                    }`}
                  >
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm">Employee</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {selectedRequest?.employeeName} ({selectedRequest?.employee.email})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Will receive: Travel itinerary, flight details, driver contact, and travel reminders
                      </p>
                    </div>
                  </label>

                  {selectedRequest?.assignedDriver && (
                    <label
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                        notificationDetails.recipients.includes("driver")
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-green-300"
                      }`}
                    >
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
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-900 text-sm">Assigned Driver</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {selectedRequest.assignedDriver.firstName ||
                            selectedDriver?.firstName ||
                            selectedDriver?.name}{" "}
                          ({selectedRequest.assignedDriver.email || selectedDriver?.email || "Email TBD"})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Will receive: Passenger details, pickup schedule, flight coordination, and service
                          requirements
                        </p>
                      </div>
                    </label>
                  )}

                  <label
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                      notificationDetails.recipients.includes("manager")
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-green-300"
                    }`}
                  >
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm">Department Manager</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{selectedRequest?.department} Department Head</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Will receive: Travel summary, arrangements overview, and budget information
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Message Preview */}
              {notificationDetails.recipients.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm">Message Preview</h4>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notificationDetails.recipients.map((recipient) => {
                      const content = generateNotificationContent(recipient)
                      return (
                        <div key={recipient} className="border border-gray-200 rounded-xl overflow-hidden">
                          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              {recipient === "employee" && <Users className="w-4 h-4 text-blue-600" />}
                              {recipient === "driver" && <Car className="w-4 h-4 text-purple-600" />}
                              {recipient === "manager" && <Building className="w-4 h-4 text-orange-600" />}
                              <span className="font-medium text-gray-900 capitalize text-sm">
                                {recipient} Notification
                              </span>
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="mb-2">
                              <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                              <p className="text-xs font-medium text-gray-900 bg-gray-50 p-2 rounded border">
                                {content.subject}
                              </p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Message</label>
                              <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border max-h-48 overflow-y-auto whitespace-pre-line">
                                {content.message}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 text-sm">Before Sending</h4>
                    <ul className="text-yellow-700 text-xs space-y-1 mt-1">
                      <li>• Verify all travel details are accurate</li>
                      <li>• Ensure flight bookings are confirmed (if applicable)</li>
                      <li>• Confirm driver assignment details</li>
                      <li>• Check recipient email addresses</li>
                    </ul>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2">
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
                <span className="text-gray-700 text-sm">Include downloadable travel itinerary (PDF attachment)</span>
              </label>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowNotification(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotifications}
                  disabled={isSendingNotification || notificationDetails.recipients.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 text-sm"
                >
                  {isSendingNotification ? (
                    <>
                      <Loader className="animate-spin w-4 h-4" />
                      Sending Notifications...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send to {notificationDetails.recipients.length} Recipient
                      {notificationDetails.recipients.length !== 1 ? "s" : ""}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar Notification */}
      {snackbarOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl border ${
              snackbarSeverity === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : snackbarSeverity === "error"
                  ? "bg-red-50 text-red-800 border-red-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {snackbarSeverity === "success" && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={16} className="text-white" />
                </div>
              )}
              {snackbarSeverity === "error" && (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle size={16} className="text-white" />
                </div>
              )}
              {snackbarSeverity === "info" && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Info size={16} className="text-white" />
                </div>
              )}
              <span className="font-medium">{snackbarMessage}</span>
              <button onClick={() => setSnackbarOpen(false)} className="ml-4 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
