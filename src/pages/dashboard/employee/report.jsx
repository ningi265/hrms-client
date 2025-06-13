import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Filter,
  Settings,
  User,
  Briefcase,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Share,
  Printer,
  Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function GenerateReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    reportType: "comprehensive",
    dateRange: "6months",
    includePersonalInfo: true,
    includeEmploymentInfo: true,
    includePerformance: true,
    includeGoals: true,
    includeAchievements: true,
    includeSkills: true,
    includeReviews: true,
    format: "pdf"
  });
  const [savedReports, setSavedReports] = useState([
    {
      id: 1,
      name: "Q2 2024 Performance Report",
      type: "Performance Review",
      createdDate: "2024-06-15",
      format: "PDF",
      status: "completed"
    },
    {
      id: 2,
      name: "Annual Review Summary",
      type: "Annual Report",
      createdDate: "2024-01-15",
      format: "Excel",
      status: "completed"
    },
    {
      id: 3,
      name: "Skills Assessment Report",
      type: "Skills Report",
      createdDate: "2024-05-20",
      format: "PDF",
      status: "completed"
    }
  ]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

  const handleConfigChange = (key, value) => {
    setReportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In real app, this would make an API call to generate the report
      const newReport = {
        id: savedReports.length + 1,
        name: `${reportConfig.reportType} Report - ${new Date().toLocaleDateString()}`,
        type: reportConfig.reportType.charAt(0).toUpperCase() + reportConfig.reportType.slice(1),
        createdDate: new Date().toISOString().split('T')[0],
        format: reportConfig.format.toUpperCase(),
        status: "completed"
      };
      
      setSavedReports(prev => [newReport, ...prev]);
      
      // Show success message or download
      alert(`Report generated successfully! ${newReport.name}`);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (reportId) => {
    // In real app, this would download the actual report
    alert(`Downloading report ${reportId}...`);
  };

  const deleteReport = (reportId) => {
    setSavedReports(prev => prev.filter(report => report.id !== reportId));
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Employee Data</h2>
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

  const reportTemplates = [
    {
      id: "comprehensive",
      name: "Comprehensive Report",
      description: "Complete employee overview including all available data",
      icon: FileText,
      color: "blue"
    },
    {
      id: "performance",
      name: "Performance Report",
      description: "Focus on performance metrics, goals, and achievements",
      icon: TrendingUp,
      color: "green"
    },
    {
      id: "skills",
      name: "Skills Assessment",
      description: "Detailed analysis of skills and competencies",
      icon: Award,
      color: "purple"
    },
    {
      id: "review",
      name: "Review Summary",
      description: "Summary of performance reviews and feedback",
      icon: Star,
      color: "yellow"
    }
  ];

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
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
                    <FileText size={32} />
                  </div>
                  Generate Report
                </h1>
                <p className="text-gray-500 text-lg mt-2">
                  Create detailed reports for {`${employee.firstName || ''} ${employee.lastName || ''}`.trim()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center gap-2">
                <Eye size={16} />
                Preview
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors duration-200 font-medium flex items-center gap-2">
                <Share size={16} />
                Share
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Report Configuration */}
            <div className="lg:col-span-2 space-y-8">
              {/* Report Templates */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
                <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-purple-50/50 to-pink-50/30">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Settings size={20} />
                    Report Templates
                  </h2>
                  <p className="text-gray-600 mt-1">Choose a report template to get started</p>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTemplates.map((template) => {
                      const Icon = template.icon;
                      const isSelected = reportConfig.reportType === template.id;
                      return (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleConfigChange('reportType', template.id)}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? `border-${template.color}-500 bg-${template.color}-50`
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 bg-${template.color}-100 rounded-lg`}>
                              <Icon size={20} className={`text-${template.color}-600`} />
                            </div>
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Report Configuration */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
                <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50/50 to-purple-50/30">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Filter size={20} />
                    Configuration Options
                  </h2>
                  <p className="text-gray-600 mt-1">Customize what to include in your report</p>
                </div>
                
                <div className="p-8 space-y-6">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Calendar size={16} className="inline mr-2" />
                      Date Range
                    </label>
                    <select
                      value={reportConfig.dateRange}
                      onChange={(e) => handleConfigChange('dateRange', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                    >
                      <option value="1month">Last Month</option>
                      <option value="3months">Last 3 Months</option>
                      <option value="6months">Last 6 Months</option>
                      <option value="1year">Last Year</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>

                  {/* Content Sections */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Include Sections
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'includePersonalInfo', label: 'Personal Information', icon: User },
                        { key: 'includeEmploymentInfo', label: 'Employment Details', icon: Briefcase },
                        { key: 'includePerformance', label: 'Performance Metrics', icon: BarChart3 },
                        { key: 'includeGoals', label: 'Goals & Objectives', icon: Target },
                        { key: 'includeAchievements', label: 'Achievements', icon: Award },
                        { key: 'includeSkills', label: 'Skills & Competencies', icon: Activity },
                        { key: 'includeReviews', label: 'Performance Reviews', icon: Star }
                      ].map((section) => {
                        const Icon = section.icon;
                        return (
                          <label key={section.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                            <input
                              type="checkbox"
                              checked={reportConfig[section.key]}
                              onChange={(e) => handleConfigChange(section.key, e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <Icon size={16} className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">{section.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Output Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Output Format
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: 'pdf', label: 'PDF', icon: FileText },
                        { value: 'excel', label: 'Excel', icon: BarChart3 },
                        { value: 'word', label: 'Word', icon: FileText }
                      ].map((format) => {
                        const Icon = format.icon;
                        return (
                          <label key={format.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="format"
                              value={format.value}
                              checked={reportConfig.format === format.value}
                              onChange={(e) => handleConfigChange('format', e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <Icon size={16} className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">{format.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Report & History */}
            <div className="space-y-8">
              {/* Generate Report Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
                <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50/50 to-blue-50/30">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Download size={18} />
                    Generate Report
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Report Preview</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Employee:</strong> {`${employee.firstName || ''} ${employee.lastName || ''}`.trim()}</p>
                      <p><strong>Type:</strong> {reportConfig.reportType.charAt(0).toUpperCase() + reportConfig.reportType.slice(1)} Report</p>
                      <p><strong>Period:</strong> {reportConfig.dateRange}</p>
                      <p><strong>Format:</strong> {reportConfig.format.toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={generateReport}
                    disabled={isGenerating}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        Generate & Download
                      </>
                    )}
                  </button>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center justify-center gap-2">
                      <Mail size={16} />
                      Email
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center justify-center gap-2">
                      <Printer size={16} />
                      Print
                    </button>
                  </div>
                </div>
              </div>

              {/* Report History */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Clock size={18} />
                      Recent Reports
                    </h2>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {savedReports.map((report) => (
                    <div key={report.id} className="p-4 hover:bg-gray-50/50 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{report.name}</h3>
                        <span className="text-xs text-gray-500">{report.format}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          <p>{report.type}</p>
                          <p>{new Date(report.createdDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => downloadReport(report.id)}
                            className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="p-1 hover:bg-red-100 text-red-600 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}