import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronRight,
  Clock,
  Globe,
  BarChart3,
  MapPin,
  Plane,
  Plus,
  Settings,
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Bell,
  Search,
  Filter,
  MoreVertical,
  X,
  CheckCircle,
  AlertCircle,
  DollarSign,
  PieChart,
  Activity,
  Zap,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  Upload,
  CreditCard,
  Building,
  Car,
  Hotel,
  Utensils,
  Target,
  Award,
  Briefcase,
  Send,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
  Star,
  BookOpen,
  MessageSquare,
  Phone,
  Mail
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import axios from "axios";
import { useSnackbar } from "notistack";
import LocalTravelForm from "../../../employee-dash/travel"; 
import InternationalTravelForm from "../../requisitions/manage/international";

export default function TravelDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewTravelMenu, setShowNewTravelMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    stats: null,
    quickLinks: null,
    loading: false
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [totalPending, setTotalPending] = useState(0);
  const [pendingLocal, setPendingLocal] = useState(0);
  const [pendingInternational, setPendingInternational] = useState(0);
  const [localModalOpen, setLocalModalOpen] = useState(false);
  const [internationalModalOpen, setInternationalModalOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Animation effect
  useEffect(() => {
    setAnimate(true);
    return () => setAnimate(false);
  }, []);

  // Enhanced sample data for charts
  const travelData = [
    { name: "Jan", local: 2, international: 1, total: 3 },
    { name: "Feb", local: 1, international: 0, total: 1 },
    { name: "Mar", local: 3, international: 1, total: 4 },
    { name: "Apr", local: 0, international: 2, total: 2 },
    { name: "May", local: 2, international: 0, total: 2 },
    { name: "Jun", local: 1, international: 1, total: 2 },
  ];

  const expenseData = [
    { name: "Flights", value: 2450, percentage: 56.7, color: "#3b82f6" },
    { name: "Hotels", value: 1200, percentage: 27.8, color: "#10b981" },
    { name: "Transport", value: 420, percentage: 9.7, color: "#f59e0b" },
    { name: "Meals", value: 250, percentage: 5.8, color: "#ef4444" },
  ];

  const recentTrips = [
    {
      id: "TR-2024-001",
      destination: "New York, NY",
      type: "Local",
      status: "Completed",
      date: "Mar 15-17, 2024",
      amount: "$1,245",
      purpose: "Client Meeting"
    },
    {
      id: "TR-2024-002", 
      destination: "London, UK",
      type: "International",
      status: "Approved",
      date: "Apr 20-25, 2024",
      amount: "$3,450",
      purpose: "Conference"
    },
    {
      id: "TR-2024-003",
      destination: "Chicago, IL", 
      type: "Local",
      status: "Pending",
      date: "May 10-12, 2024",
      amount: "$890",
      purpose: "Training"
    }
  ];

  useEffect(() => {
    const fetchPendingStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/api/travel-requests/pending/stat`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setTotalPending(response.data.totalPending || 0);
          setPendingLocal(response.data.pendingLocal || 0);
          setPendingInternational(response.data.pendingInternational || 0);
        }
      } catch (error) {
        enqueueSnackbar("Failed to load pending stats", { variant: "error" });
        console.error("Error fetching pending stats:", error);
      }
    };

    fetchPendingStats();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'Approved': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Pending': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Rejected': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle size={14} />;
      case 'Approved': return <CheckCircle size={14} />;
      case 'Pending': return <Clock size={14} />;
      case 'Rejected': return <X size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <Plane size={24} />
                </div>
                Travel Dashboard
              </h1>
              <p className="text-gray-500 text-sm mt-1">Manage your business travel with intelligent insights</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 transition-colors duration-200"
              >
                <Search size={18} />
              </button>
              <button className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 transition-colors duration-200">
                <Filter size={18} />
              </button>
              <button className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 transition-colors duration-200">
                <Bell size={18} />
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNewTravelMenu(!showNewTravelMenu)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={18} />
                New Travel Request
              </button>
              
              {showNewTravelMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setLocalModalOpen(true);
                        setShowNewTravelMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Local Travel</div>
                        <div className="text-sm text-gray-500">Domestic business trips</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setInternationalModalOpen(true);
                        setShowNewTravelMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-purple-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Globe size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">International Travel</div>
                        <div className="text-sm text-gray-500">Global business trips</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Search field */}
        {showSearch && (
          <div className="max-w-7xl mx-auto mt-4 flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 transition-all duration-300">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search travel requests, destinations, or expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-800 w-full pl-2 placeholder-gray-400 text-sm"
            />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 mb-8 shadow-xl">
          <div className="flex border-b border-gray-200 bg-white rounded-t-2xl">
            {["overview", "analytics", "expenses"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab === "overview" && <BarChart3 size={16} className="inline mr-2" />}
                {tab === "analytics" && <TrendingUp size={16} className="inline mr-2" />}
                {tab === "expenses" && <Wallet size={16} className="inline mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl">
                      <Plane size={24} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-900">12</div>
                      <div className="text-sm text-blue-600">Total Trips</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-blue-700">
                    <ArrowUp size={16} className="mr-1" />
                    <span>+2 from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500 rounded-xl">
                      <Clock size={24} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-900">{totalPending}</div>
                      <div className="text-sm text-amber-600">Pending Approvals</div>
                    </div>
                  </div>
                  <div className="text-sm text-amber-700">
                    {pendingLocal} local, {pendingInternational} international
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <Wallet size={24} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-900">$4,320</div>
                      <div className="text-sm text-green-600">Budget Used</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: animate ? '72%' : '0%' }}></div>
                    </div>
                    <div className="text-sm text-green-700">72% of annual budget</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500 rounded-xl">
                      <Calendar size={24} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-900">2</div>
                      <div className="text-sm text-purple-600">Upcoming Trips</div>
                    </div>
                  </div>
                  <div className="text-sm text-purple-700">
                    Next: Chicago (May 15)
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link 
                  to="/travel/requests" 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                      <FileText size={24} className="text-blue-600" />
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Requests</h3>
                  <p className="text-gray-600 text-sm mb-4">View and manage all your travel requests</p>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      12 total requests
                    </span>
                  </div>
                </Link>

                <Link 
                  to="/travel/expenses" 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-200">
                      <CreditCard size={24} className="text-green-600" />
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Expense Reports</h3>
                  <p className="text-gray-600 text-sm mb-4">Submit and track your travel expenses</p>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      3 pending reports
                    </span>
                  </div>
                </Link>

                <Link 
                  to="/travel/documents" 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-200">
                      <Globe size={24} className="text-purple-600" />
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Travel Documents</h3>
                  <p className="text-gray-600 text-sm mb-4">Manage passport, visa and other documents</p>
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      2 expiring soon
                    </span>
                  </div>
                </Link>
              </div>

              {/* Recent Travel Activity */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
                <div className="px-6 py-4 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Activity size={20} className="text-blue-500" />
                      Recent Travel Activity
                    </h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentTrips.map((trip) => (
                    <div key={trip.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-100 rounded-xl">
                            {trip.type === 'International' ? <Globe size={20} className="text-blue-600" /> : <MapPin size={20} className="text-blue-600" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{trip.destination}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-500">{trip.date}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">{trip.purpose}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{trip.amount}</div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                              {getStatusIcon(trip.status)}
                              <span className="ml-1">{trip.status}</span>
                            </span>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="p-8">
              {/* Travel History Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 size={24} className="text-blue-500" />
                      Travel History
                    </h3>
                    <p className="text-gray-600 mt-1">Your travel patterns over the last 6 months</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium">
                      Local
                    </button>
                    <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-sm font-medium">
                      International
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={travelData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar dataKey="local" name="Local Trips" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="international" name="International Trips" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Travel Type Breakdown */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <PieChart size={20} className="text-green-500" />
                    Travel by Type
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-gray-700 font-medium">Local Travel</span>
                        </div>
                        <span className="text-gray-900 font-bold">9 trips (75%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: animate ? '75%' : '0%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-gray-700 font-medium">International Travel</span>
                        </div>
                        <span className="text-gray-900 font-bold">3 trips (25%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000 delay-300" style={{ width: animate ? '25%' : '0%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Top Destinations</h4>
                      <div className="space-y-3">
                        {[
                          { name: "New York", trips: 3 },
                          { name: "London", trips: 2 },
                          { name: "Chicago", trips: 2 }
                        ].map((dest, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{dest.name}</span>
                            <span className="text-gray-900 font-medium">{dest.trips} trips</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expense Breakdown */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <DollarSign size={20} className="text-amber-500" />
                    Expense Breakdown
                  </h3>
                  <div className="space-y-6">
                    {expenseData.map((expense, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: expense.color }}></div>
                            <span className="text-gray-700 font-medium">{expense.name}</span>
                          </div>
                          <span className="text-gray-900 font-bold">${expense.value.toLocaleString()} ({expense.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-1000" 
                            style={{ 
                              backgroundColor: expense.color,
                              width: animate ? `${expense.percentage}%` : '0%',
                              transitionDelay: `${index * 200}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <div>
                          <span className="text-green-900 font-bold">Total Expenses</span>
                          <p className="text-green-700 text-sm">Current year</p>
                        </div>
                        <span className="text-2xl font-bold text-green-900">$4,320</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <div className="p-8">
              {/* Expense Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl">
                      <Plane size={20} className="text-white" />
                    </div>
                    <TrendingUp size={16} className="text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">$2,450</div>
                  <div className="text-sm text-blue-600">Flight Costs</div>
                  <div className="text-xs text-blue-500 mt-2">56.7% of total</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <Hotel size={20} className="text-white" />
                    </div>
                    <TrendingUp size={16} className="text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-1">$1,200</div>
                  <div className="text-sm text-green-600">Accommodation</div>
                  <div className="text-xs text-green-500 mt-2">27.8% of total</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500 rounded-xl">
                      <Car size={20} className="text-white" />
                    </div>
                    <TrendingDown size={16} className="text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-amber-900 mb-1">$420</div>
                  <div className="text-sm text-amber-600">Transport</div>
                  <div className="text-xs text-amber-500 mt-2">9.7% of total</div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-500 rounded-xl">
                      <Utensils size={20} className="text-white" />
                    </div>
                    <TrendingUp size={16} className="text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-900 mb-1">$250</div>
                  <div className="text-sm text-red-600">Meals & Other</div>
                  <div className="text-xs text-red-500 mt-2">5.8% of total</div>
                </div>
              </div>

              {/* Expense Reports Table */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
                <div className="px-6 py-4 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FileText size={20} className="text-purple-500" />
                      Recent Expense Reports
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium flex items-center gap-1">
                        <Upload size={14} />
                        Upload Receipt
                      </button>
                      <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} />
                        New Report
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { id: "EXP-2024-001", trip: "New York Business Trip", amount: "$1,245", status: "Approved", date: "Mar 20, 2024" },
                        { id: "EXP-2024-002", trip: "London Conference", amount: "$3,450", status: "Pending", date: "Mar 18, 2024" },
                        { id: "EXP-2024-003", trip: "Chicago Training", amount: "$890", status: "Review", date: "Mar 15, 2024" }
                      ].map((report, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{report.id}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{report.trip}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{report.amount}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                              {getStatusIcon(report.status)}
                              <span className="ml-1">{report.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">{report.date}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                <Eye size={14} />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                                <Download size={14} />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                <Edit size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Quick Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3"></div>
          <div className="space-y-6">
            {/* Travel Insights */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles size={20} />
                  Travel Insights
                </h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-purple-100 text-sm mb-4">
                AI-powered insights for smarter travel decisions.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm">
                  💡 Book flights 2 weeks earlier to save 15%
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm">
                  📊 Your travel frequency is 20% above average
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm">
                  🏨 Consider booking hotels near conference venues
                </div>
              </div>
            </div>

            {/* Budget Tracker */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target size={20} className="text-green-500" />
                Budget Tracker
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-900">Annual Budget</span>
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">On Track</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-2">$6,000</div>
                  <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: animate ? '72%' : '0%' }}></div>
                  </div>
                  <div className="text-sm text-green-700">$1,680 remaining</div>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Q1 spending: $1,200 (20%)</p>
                  <p>• Q2 projection: $1,800 (30%)</p>
                  <p>• Savings opportunity: $240/month</p>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-500" />
                Travel Support
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Get help with travel policies and expense reporting.
              </p>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <BookOpen size={14} />
                  Travel Policy Guide
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <MessageSquare size={14} />
                  Live Chat Support
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <Phone size={14} />
                  Emergency Travel Line
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <Mail size={14} />
                  Email Travel Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      
      {/* Local Travel Modal */}
      {localModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-xl">
                      <MapPin size={24} className="text-white" />
                    </div>
                    New Local Travel Request
                  </h2>
                  <p className="text-gray-600 mt-1">Submit a request for domestic business travel</p>
                </div>
                <button
                  onClick={() => setLocalModalOpen(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <LocalTravelForm 
                onCancel={() => setLocalModalOpen(false)}
                onSubmitSuccess={() => {
                  setLocalModalOpen(false);
                  enqueueSnackbar("Local travel request submitted successfully!", { variant: "success" });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* International Travel Modal */}
      {internationalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-xl">
                      <Globe size={24} className="text-white" />
                    </div>
                    New International Travel Request
                  </h2>
                  <p className="text-gray-600 mt-1">Submit a request for international business travel</p>
                </div>
                <button
                  onClick={() => setInternationalModalOpen(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <InternationalTravelForm 
                onCancel={() => setInternationalModalOpen(false)}
                onSubmitSuccess={() => {
                  setInternationalModalOpen(false);
                  enqueueSnackbar("International travel request submitted successfully!", { variant: "success" });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showNewTravelMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowNewTravelMenu(false)}
        ></div>
      )}
    </div>
  );
}