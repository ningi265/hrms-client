import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, FileText, Calendar, Users, ClipboardCheck, TrendingUp } from "lucide-react";
import { useAuth } from "../../authcontext/authcontext";
import { PRIVILEGE_ROLES, SPECIAL_ROLES } from '../login/roles';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [currentProcess, setCurrentProcess] = useState(0);
  
  const hrmsProcesses = [
    { 
      icon: FileText, 
      title: "Time & Attendance", 
      description: "Track attendance and time-off in real-time" 
    },
    { 
      icon: Users, 
      title: "Recruitment", 
      description: "Manage job postings and applications" 
    },
    { 
      icon: Calendar, 
      title: "Scheduling", 
      description: "Optimize schedules and shift management" 
    },
    { 
      icon: ClipboardCheck, 
      title: "Procurement", 
      description: "Streamline purchase requests and vendors" 
    },
    { 
      icon: TrendingUp, 
      title: "Performance", 
      description: "Track KPIs and employee metrics" 
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProcess(prev => (prev + 1) % hrmsProcesses.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(""); // Clear previous errors

  try {
    // Validate inputs before making API call
    if (!email || !password) {
      throw new Error("Please enter both email and password");
    }

    await login(email, password);
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      throw new Error("User data not found. Please try logging in again.");
    }

    // Define role-based navigation paths
    const roleNavigationMap = {
      // Elevated privileges roles
      "admin": "/dashboard",
      "procurement_officer": "/dashboard",
      "IT/Technical": "/dashboard",
      "Executive (CEO, CFO, etc.)": "/dashboard",
      "Management": "/dashboard",
      "Human Resources": "/dashboard",
      "Accounting/Finance": "/dashboard",
      
      // Special case roles
      "Vendor": "/vendor-dash",
      "Driver": "/driver-dash",
      
      // Default role
      "Sales/Marketing": "/employee-dash"
    };

    // Get the path based on role or use default
    const path = roleNavigationMap[user.role] || roleNavigationMap.default;
    
    // Navigate to the determined path
    navigate(path);

    // Optional: Show success message
    // toast.success("Login successful!");

  } catch (error) {
    // Handle different error types with appropriate messages
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Login failed. Please check your credentials and try again.";
    
    setError(errorMessage);
    console.error("Login error:", error);

    // Optional: Show error toast
    // toast.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left panel with branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 flex-col justify-center items-center text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-10 -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-400 rounded-full opacity-10 bottom-10 -right-20 animate-pulse" style={{animationDelay: '1s', animationDuration: '10s'}}></div>
          <div className="absolute w-64 h-64 bg-blue-300 rounded-full opacity-10 bottom-1/4 left-1/3 animate-pulse" style={{animationDelay: '0.5s', animationDuration: '7s'}}></div>
        </div>
        
        <div className="max-w-md z-10 space-y-6 p-12">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-lg text-white/90">Access your account to manage procurement requests, track orders, and more.</p>
          
          {/* HRMS Process Animation */}
          <div className="py-6">
            <div className="relative h-48">
              {hrmsProcesses.map((process, index) => {
                const ProcessIcon = process.icon;
                return (
                  <div 
                    key={index} 
                    className={`absolute w-full transition-all duration-700 transform ${
                      index === currentProcess 
                        ? "opacity-100 translate-x-0" 
                        : index < currentProcess
                        ? "opacity-0 -translate-x-full" 
                        : "opacity-0 translate-x-full"
                    }`}
                  >
                    <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-xl space-y-3">
                      <div className="p-3 bg-white/20 rounded-full">
                        <ProcessIcon size={28} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold">{process.title}</h3>
                      <p className="text-center text-sm text-white/90">{process.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Progress indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {hrmsProcesses.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === currentProcess ? "w-6 bg-white" : "w-1 bg-white/40"
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm">
            <p className="italic text-sm">"This platform has streamlined our entire procurement process, saving us countless hours every month."</p>
            <p className="mt-3 font-semibold text-sm">— Sarah Banda, Procurement Manager</p>
          </div>
        </div>
      </div>
      
      {/* Right panel with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-block">
              <div className="inline-flex items-center">
                <img
                  src="/hrms-logo.png"
                  className="h-32 w-auto mx-auto"
                />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">Login to Your Account</h2>
              <p className="text-sm text-gray-600">Enter your credentials to access the platform</p>
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700 space-x-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300"
                  placeholder="name@company.com"
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                isLoading ? "opacity-80 cursor-not-allowed" : "hover:scale-[1.02]"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Register now
              </a>
            </p>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <a href="/terms-of-service" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}