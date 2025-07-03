import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Download,
  RefreshCw,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function DepartmentPerformancePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState("monthly");
   const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;

  useEffect(() => {
    const fetchPerformanceData = async () => {
      console.log("Fetching performance data for department ID:", id);
      
      if (!id) {
        setError("No department ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        console.log("Making API call to:", `${backendUrl}/api/departments/${id}/performance`);
        
        const response = await fetch(`${backendUrl}/api/departments/${id}/performance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Performance data received:", data);
          setPerformanceData(data);
        } else {
          throw new Error("Failed to fetch performance data");
        }
      } catch (error) {
        setError("Failed to fetch performance data");
        console.error("Failed to fetch performance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, [id, backendUrl]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-green-700 bg-green-50 border-green-200";
    if (performance >= 80) return "text-blue-700 bg-blue-50 border-blue-200";
    if (performance >= 70) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'cancelled':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Performance Data</h2>
          <p className="text-gray-600">
            Please wait while we fetch performance analytics...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate(`/dashboard/departments/${id}`)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Back to Department
          </button>
        </div>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Performance Data</h2>
          <p className="text-gray-600 mb-4">Performance data is not available for this department.</p>
          <button
            onClick={() => navigate(`/dashboard/departments/${id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Department
          </button>
        </div>
      </div>
    );
  }

  const timeframes = [
    { id: "weekly", name: "Weekly" },
    { id: "monthly", name: "Monthly" },
    { id: "quarterly", name: "Quarterly" },
    { id: "yearly", name: "Yearly" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/dashboard/departments/${id}`)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
                    <BarChart3 size={32} />
                  </div>
                  {performanceData.department?.name} Performance
                </h1>
                <p className="text-gray-500 text-lg mt-1">
                  Detailed performance analytics and metrics
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-200 flex items-center gap-2">
                <Download size={18} />
                Export Report
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          {/* Time Frame Selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.id}
                onClick={() => setActiveTimeframe(timeframe.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTimeframe === timeframe.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {timeframe.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Key Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPerformanceColor(performanceData.department?.performance || 0)}`}>
                  {performanceData.department?.performance || 0}%
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Overall Performance</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData.department?.performance || 0}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${performanceData.department?.performance || 0}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <DollarSign size={24} className="text-white" />
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {performanceData.budget?.utilization || 0}%
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Budget Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData.budget?.utilization || 0}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(performanceData.budget?.spent || 0)} of {formatCurrency(performanceData.budget?.allocated || 0)}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Users size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {performanceData.employees?.utilization || 0}%
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Team Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData.employees?.utilization || 0}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {performanceData.employees?.total || 0} team members
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <Target size={24} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {performanceData.projects?.total || 0}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Projects</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData.projects?.total || 0}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {performanceData.projects?.active || 0} active, {performanceData.projects?.completed || 0} completed
                </p>
              </div>
            </motion.div>
          </div>

          {/* Performance Chart and KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance History Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Activity size={24} />
                Performance History
              </h3>
              
              {performanceData.performanceHistory && performanceData.performanceHistory.length > 0 ? (
                <div className="space-y-4">
                  {performanceData.performanceHistory.slice(-6).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{record.period}</p>
                        <p className="text-sm text-gray-500">
                          {record.recordedDate ? new Date(record.recordedDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{record.metrics?.performance || 0}%</p>
                        <div className="flex items-center gap-1 text-sm">
                          {index > 0 && performanceData.performanceHistory[index - 1]?.metrics?.performance ? (
                            record.metrics?.performance > performanceData.performanceHistory[index - 1].metrics.performance ? (
                              <TrendingUp size={14} className="text-green-500" />
                            ) : (
                              <TrendingDown size={14} className="text-red-500" />
                            )
                          ) : null}
                          <span className="text-gray-500">
                            {record.metrics?.employeeCount || 0} employees
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No performance history available</p>
                </div>
              )}
            </div>

            {/* Key Performance Indicators */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 size={24} />
                Key Performance Indicators
              </h3>
              
              {performanceData.kpis && performanceData.kpis.length > 0 ? (
                <div className="space-y-4">
                  {performanceData.kpis.map((kpi, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{kpi.name}</h4>
                        <span className="text-sm text-gray-500">{kpi.period}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Target</p>
                            <p className="font-semibold text-gray-900">{kpi.target} {kpi.unit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Actual</p>
                            <p className="font-semibold text-gray-900">{kpi.actual} {kpi.unit}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            kpi.actual >= kpi.target ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {kpi.target > 0 ? Math.round((kpi.actual / kpi.target) * 100) : 0}%
                          </div>
                        </div>
                      </div>
                      {kpi.lastUpdated && (
                        <p className="text-xs text-gray-400 mt-2">
                          Last updated: {new Date(kpi.lastUpdated).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No KPIs defined yet</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Add KPIs
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Objectives and Goals */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Target size={24} />
              Objectives & Goals
            </h3>
            
            {performanceData.objectives && performanceData.objectives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {performanceData.objectives.map((objective, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{objective.title}</h4>
                        <p className="text-sm text-gray-600">{objective.description}</p>
                      </div>
                      <div className="ml-4">
                        {getStatusIcon(objective.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(objective.priority)}`}>
                          {objective.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          objective.status === 'completed' ? 'bg-green-100 text-green-800' :
                          objective.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          objective.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {objective.status}
                        </span>
                      </div>
                      
                      {objective.targetDate && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Target Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(objective.targetDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target size={48} className="text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Objectives Set</h4>
                <p className="text-gray-600 mb-6">Define objectives to track department progress and goals.</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center gap-2 mx-auto">
                  <Target size={20} />
                  Add Objectives
                </button>
              </div>
            )}
          </div>

          {/* Budget Analysis */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign size={24} />
              Budget Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <DollarSign size={32} className="text-green-600 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Allocated Budget</h4>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(performanceData.budget?.allocated || 0)}
                </p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <TrendingUp size={32} className="text-blue-600 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Spent</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(performanceData.budget?.spent || 0)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {performanceData.budget?.utilization || 0}% utilized
                </p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <Award size={32} className="text-purple-600 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Remaining</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(performanceData.budget?.remaining || 0)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {100 - (performanceData.budget?.utilization || 0)}% available
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}