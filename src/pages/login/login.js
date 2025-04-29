import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, FileText, Calendar, Users, ClipboardCheck, TrendingUp } from "lucide-react";
import { useAuth } from "../../authcontext/authcontext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [currentProcess, setCurrentProcess] = useState(0);
  
  // HRMS processes to showcase in the animation
  const hrmsProcesses = [
    { 
      icon: FileText, 
      title: "Time & Attendance", 
      description: "Tracking employee attendance and time-off requests in real-time" 
    },
    { 
      icon: Users, 
      title: "Recruitment", 
      description: "Managing job postings, applications, and candidate evaluations" 
    },
    { 
      icon: Calendar, 
      title: "Scheduling", 
      description: "Optimizing employee schedules and shift management" 
    },
    { 
      icon: ClipboardCheck, 
      title: "Procurement", 
      description: "Streamlining purchase requests and vendor management" 
    },
    { 
      icon: TrendingUp, 
      title: "Performance", 
      description: "Tracking KPIs and employee performance metrics" 
    }
  ];
  
  // Auto-rotate through the HRMS processes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProcess(prev => (prev + 1) % hrmsProcesses.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password); // This updates the `user` state in AuthProvider
      const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage

      if (!user) {
        throw new Error("User data not found");
      }

      // Redirect based on role
      switch (user.role) {
        case "admin":
        case "procurement_officer":
          navigate("/dashboard"); // Redirect to the main dashboard
          break;
        case "vendor":
          navigate("/vendor-dash"); // Redirect to the vendor dashboard
          break;
        case "employee":
          navigate("/employee-dash"); // Redirect to the employee dashboard
          break;
        default:
          navigate("/"); // Fallback for unknown roles
      }
    } catch (error) {
      alert("Login failed. Invalid credentials."); // Replace with a toast/snackbar
      console.error("Login error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left panel with branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-10 -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-400 rounded-full opacity-10 bottom-10 -right-20 animate-pulse" style={{animationDelay: '1s', animationDuration: '10s'}}></div>
          <div className="absolute w-64 h-64 bg-blue-300 rounded-full opacity-10 bottom-1/4 left-1/3 animate-pulse" style={{animationDelay: '0.5s', animationDuration: '7s'}}></div>
        </div>
        
        <div className="max-w-md z-10">
          <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
          <p className="text-xl mb-8">Access your account to manage procurement requests, track orders, and more.</p>
          
          {/* HRMS Process Animation */}
          <div className="mt-12 mb-12">
            <div className="relative h-64">
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
                    <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                      <div className="p-4 bg-white/20 rounded-full mb-4">
                        <ProcessIcon size={40} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{process.title}</h3>
                      <p className="text-center text-white/90">{process.description}</p>
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
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentProcess ? "w-8 bg-white" : "w-2 bg-white/40"
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm mt-6">
            <p className="italic text-lg">"This platform has streamlined our entire procurement process, saving us countless hours every month."</p>
            <p className="mt-4 font-semibold">— Sarah Johnson, Procurement Manager</p>
          </div>
        </div>
      </div>
      
      {/* Right panel with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Login to Your Account</h2>
            <p className="mt-2 text-gray-600">Enter your credentials to access the platform</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300"
                placeholder="name@company.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Register now
              </a>
            </p>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}