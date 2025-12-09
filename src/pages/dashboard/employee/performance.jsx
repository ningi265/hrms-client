import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  Clock,
  Star,
  BarChart3,
  LineChart,
  User,
  CheckCircle,
  AlertCircle,
  Activity,
  Zap,
  Trophy,
  Loader2,
  FileText,
  Download,
  Plus,
  Edit,
  Eye,
  MessageSquare,
  Filter,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function EmployeePerformancePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("6months");
   const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;

  // Mock performance data - in real app, this would come from API
  const [performanceData] = useState({
    overallRating: 4.2,
    goals: [
      { id: 1, title: "Complete React Training", progress: 85, dueDate: "2024-07-15", status: "on-track" },
      { id: 2, title: "Lead Team Project", progress: 60, dueDate: "2024-08-30", status: "on-track" },
      { id: 3, title: "Improve Code Quality", progress: 40, dueDate: "2024-09-15", status: "behind" },
      { id: 4, title: "Mentor Junior Developer", progress: 95, dueDate: "2024-06-30", status: "completed" }
    ],
    reviews: [
      { id: 1, date: "2024-06-01", rating: 4.5, reviewer: "Sarah Johnson", type: "Mid-Year Review" },
      { id: 2, date: "2024-03-15", rating: 4.0, reviewer: "Mike Chen", type: "Quarterly Review" },
      { id: 3, date: "2024-01-01", rating: 4.3, reviewer: "Sarah Johnson", type: "Annual Review" }
    ],
    achievements: [
      { id: 1, title: "Employee of the Month", date: "2024-05-01", description: "Outstanding performance in Q1" },
      { id: 2, title: "Team Leadership Award", date: "2024-02-15", description: "Led successful project delivery" },
      { id: 3, title: "Innovation Award", date: "2024-01-10", description: "Implemented new process improvements" }
    ],
    metrics: {
      productivity: 87,
      collaboration: 92,
      innovation: 78,
      reliability: 95,
      communication: 88
    }
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/auth/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setEmployee(data);
        } else {
          throw new Error("Employee not found");
        }
      } catch (error) {
        setError("Failed to fetch employee details");
        console.error("Failed to fetch employee:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id, backendUrl]);

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
          <p className="text-gray-600">Please wait while we fetch the information...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} />
            <div>
              <h3 className="font-semibold">Error</h3>
              <p>{error || "Employee not found"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Performance Overview", icon: BarChart3 },
    { id: "goals", label: "Goals & Objectives", icon: Target },
    { id: "reviews", label: "Performance Reviews", icon: FileText },
    { id: "achievements", label: "Achievements", icon: Trophy }
  ];

  const getGoalStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on-track':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'behind':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMetricColor = (value) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 75) return 'text-blue-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/dashboard/employees/${id}`)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl text-white">
                    <TrendingUp size={32} />
                  </div>
                  Performance Dashboard
                </h1>
                <p className="text-gray-500 text-lg mt-2">
                  {`${employee.firstName || ''} ${employee.lastName || ''}`.trim()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors duration-200 font-medium flex items-center gap-2">
                <Download size={16} />
                Export Report
              </button>
              <button className="p-2 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-200">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Star size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-blue-600">{performanceData.overallRating}</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Overall Rating</p>
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${star <= performanceData.overallRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Target size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {performanceData.goals.filter(g => g.status === 'completed').length}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Goals Completed</p>
                <p className="text-sm text-gray-500 mt-1">
                  out of {performanceData.goals.length} total
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Trophy size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {performanceData.achievements.length}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Achievements</p>
                <p className="text-sm text-gray-500 mt-1">This year</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <Activity size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-amber-600">
                  {performanceData.metrics.productivity}%
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Productivity Score</p>
                <p className="text-sm text-gray-500 mt-1">Above average</p>
              </div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
            <div className="flex border-b border-gray-200/50 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Performance Metrics */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h3>
                      <div className="space-y-4">
                        {Object.entries(performanceData.metrics).map(([metric, value]) => (
                          <div key={metric} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <BarChart3 size={16} className="text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900 capitalize">
                                {metric.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressColor(value)}`}
                                  style={{ width: `${value}%` }}
                                ></div>
                              </div>
                              <span className={`font-bold ${getMetricColor(value)}`}>
                                {value}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <CheckCircle size={16} className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-green-900">Goal Completed</p>
                            <p className="text-sm text-green-600">Mentor Junior Developer</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Star size={16} className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-blue-900">Performance Review</p>
                            <p className="text-sm text-blue-600">Rated 4.5/5 in Mid-Year Review</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <Trophy size={16} className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-purple-900">Achievement Unlocked</p>
                            <p className="text-sm text-purple-600">Employee of the Month</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Goals Tab */}
              {activeTab === "goals" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Goals & Objectives</h3>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center gap-2">
                      <Plus size={16} />
                      Add New Goal
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {performanceData.goals.map((goal) => (
                      <div key={goal.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getGoalStatusColor(goal.status)}`}>
                            {goal.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye size={14} />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Performance Reviews</h3>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 font-medium flex items-center gap-2">
                      <Plus size={16} />
                      New Review
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {performanceData.reviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.type}</h4>
                            <p className="text-sm text-gray-600">Reviewed by {review.reviewer}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={16}
                                  className={`${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="font-bold text-gray-900">{review.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={14} />
                            <span>{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium flex items-center gap-1">
                              <Eye size={14} />
                              View Details
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium flex items-center gap-1">
                              <MessageSquare size={14} />
                              Feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === "achievements" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Achievements & Recognition</h3>
                    <button className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors duration-200 font-medium flex items-center gap-2">
                      <Award size={16} />
                      Add Achievement
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {performanceData.achievements.map((achievement) => (
                      <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-yellow-500 rounded-xl">
                            <Trophy size={24} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-yellow-900">{achievement.title}</h4>
                            <p className="text-sm text-yellow-600">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-yellow-800 text-sm">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}