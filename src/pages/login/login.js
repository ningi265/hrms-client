// src/components/LoginPage.js
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Eye, EyeOff, AlertCircle, FileText, Calendar, Users, ClipboardCheck, TrendingUp } from "lucide-react"
import { useAuth } from "../../authcontext/authcontext"
import { auth } from "../../firebase"; 

// Add these constants at the top of your file, after the imports
const employeeRoles = [
  "Software Engineer",
  "Senior Software Engineer", 
  "Lead Engineer",
  "Product Manager",
  "Senior Product Manager",
  "Data Scientist",
  "Data Analyst",
  "UI/UX Designer",
  "Senior Designer",
  "DevOps Engineer",
  "Quality Assurance Engineer",
  "Business Analyst",
  "Project Manager",
  "Scrum Master",
  "Sales Representative",
  "Sales Manager",
  "Marketing Specialist",
  "Marketing Manager",
  "HR Specialist",
  "HR Manager",
  "Finance Analyst",
  "Accountant",
  "Administrative Assistant",
  "Office Manager",
  "Customer Support Representative",
  "Customer Success Manager"
];

const enterpriseRoles = [
  "Enterprise(CEO, CFO, etc.)",
  "CEO",
  "CFO",
  "CTO",
  "COO",
  "Executive"
];

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [currentProcess, setCurrentProcess] = useState(0)

  const hrmsProcesses = [
    {
      icon: FileText,
      title: "Time & Attendance",
      description: "Track attendance and time-off in real-time",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      icon: Users,
      title: "Recruitment",
      description: "Manage job postings and applications",
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
    },
    {
      icon: Calendar,
      title: "Scheduling",
      description: "Optimize schedules and shift management",
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
    },
    {
      icon: ClipboardCheck,
      title: "Procurement",
      description: "Streamline purchase requests and vendors",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      icon: TrendingUp,
      title: "Performance",
      description: "Track KPIs and employee metrics",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
    },
  ]

  const backendUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProcess((prev) => (prev + 1) % hrmsProcesses.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [hrmsProcesses.length])

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      // Call backend to check if this email exists
      const response = await fetch(`${backendUrl}/api/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          googleId: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Google login failed");

      if (data.exists) {
         localStorage.setItem("user", JSON.stringify(data.user));
 localStorage.setItem("token", data.token);
 navigate("/dashboard");
      } else {
        // User does not exist → redirect to register, prefill email
        navigate("/register", {
          state: {
            email: user.email,
            firstName: user.displayName.split(" ")[0],
            lastName: user.displayName.split(" ")[1] || "",
            googleSignup: true, 
          },
        });
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message || "Google login failed. Try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password")
      }

      await login(email, password)
      const user = JSON.parse(localStorage.getItem("user"))

      if (!user) {
        throw new Error("User data not found. Please try logging in again.")
      }

      const hasActiveSubscription = checkSubscriptionStatus(user)

      const roleNavigationMap = {
        admin: "/dashboard",
        procurement_officer: "/dashboard",
        "IT/Technical": "/dashboard",
        "Executive (CEO, CFO, etc.)": "/dashboard",
        Management: "/dashboard",
        "Human Resources": "/dashboard",
        "Accounting/Finance": "/dashboard",
        "Enterprise(CEO, CFO, etc.)": "/dashboard",
        Vendor: "/vendor-dash",
        Driver: "/driver-dash",
        "Sales/Marketing": "/employee-dash",
        "Software Engineer": "/employee-dash",
        "Senior Software Engineer": "/employee-dash",
        "Lead Engineer": "/employee-dash",
        "Product Manager": "/employee-dash",
        "Senior Product Manager": "/employee-dash",
        "Data Scientist": "/employee-dash",
        "Data Analyst": "/employee-dash",
        "UI/UX Designer": "/employee-dash",
        "Senior Designer": "/employee-dash",
        "DevOps Engineer": "/employee-dash",
        "Quality Assurance Engineer": "/employee-dash",
        "Business Analyst": "/employee-dash",
        "Project Manager": "/employee-dash",
        "Scrum Master": "/employee-dash",
        "Sales Representative": "/employee-dash",
        "Sales Manager": "/employee-dash",
        "Marketing Specialist": "/employee-dash",
        "Marketing Manager": "/employee-dash",
        "HR Specialist": "/employee-dash",
        "HR Manager": "/employee-dash",
        "Finance Analyst": "/employee-dash",
        Accountant: "/employee-dash",
        "Administrative Assistant": "/employee-dash",
        "Office Manager": "/employee-dash",
        "Customer Support Representative": "/employee-dash",
        "Customer Success Manager": "/employee-dash",
      }

      let path = roleNavigationMap[user.role] || "/employee-dash"

      if (!hasActiveSubscription && !['Vendor', 'Driver', ...enterpriseRoles, ...employeeRoles].includes(user.role)) {
        path = "/billing"
      }

      navigate(path)
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed. Please check your credentials and try again."

      setError(errorMessage)
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to check subscription status
  const checkSubscriptionStatus = (user) => {
    if (!user.billing) return false

    const { subscription, trialEndDate } = user.billing
    const now = new Date()
    const trialEnd = trialEndDate ? new Date(trialEndDate) : null

    // Active paid subscription
    if (subscription?.status === 'active' && subscription?.plan !== 'trial') {
      return true
    }
    // Active trial period
    if (subscription?.plan === 'trial') {
      if (!trialEnd || isNaN(trialEnd.getTime())) {
        return false
      }
      return trialEnd > now
    }

    return false
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Left panel with branding - More compact */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 flex-col justify-center items-center text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-64 h-64 bg-blue-400 rounded-full opacity-20 -top-16 -left-16 animate-pulse"></div>
          <div
            className="absolute w-64 h-64 bg-purple-400 rounded-full opacity-20 bottom-8 -right-16 animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "8s" }}
          ></div>
          <div
            className="absolute w-48 h-48 bg-cyan-300 rounded-full opacity-15 bottom-1/4 left-1/4 animate-pulse"
            style={{ animationDelay: "0.5s", animationDuration: "6s" }}
          ></div>
        </div>

        <div className="max-w-sm z-10 space-y-4 p-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-white/90 leading-relaxed">
              Access your account to manage procurement requests, track orders, and streamline operations.
            </p>
          </div>

          {/* HRMS Process Animation - More compact */}
          <div className="py-4">
            <div className="relative h-36">
              {hrmsProcesses.map((process, index) => {
                const ProcessIcon = process.icon
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
                    <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl space-y-2 border border-white/20">
                      <div className={`p-2.5 bg-gradient-to-r ${process.gradient} rounded-2xl shadow-lg`}>
                        <ProcessIcon size={20} className="text-white" />
                      </div>
                      <h3 className="text-base font-bold">{process.title}</h3>
                      <p className="text-center text-xs text-white/90 leading-relaxed">{process.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-1.5 mt-3">
              {hrmsProcesses.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === currentProcess ? "w-4 bg-white shadow-sm" : "w-1 bg-white/40"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-white/10 to-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
            <p className="italic text-xs leading-relaxed">
              "This platform has streamlined our entire procurement process, saving us countless hours every month."
            </p>
            <p className="mt-2 font-semibold text-xs">— Sarah Banda, Procurement Manager</p>
          </div>
        </div>
      </div>

      {/* Right panel with login form - More compact */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center space-y-2">
            <div className="inline-block">
              <div className="inline-flex items-center">
                <img src="/hrms-logo.png" className="h-20 w-auto mx-auto" alt="HRMS Logo" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900">Login to Your Account</h2>
              <p className="text-xs text-gray-600">Enter your credentials to access the platform</p>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl flex items-start text-red-700 space-x-2">
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span className="text-xs leading-relaxed">{error}</span>
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-2.5">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300 text-sm bg-white/80 backdrop-blur-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-xs font-medium text-gray-700">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300 text-sm bg-white/80 backdrop-blur-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-xl hover:bg-gray-100 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-2xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 text-sm font-medium ${
                isLoading ? "opacity-80 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className={`w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-2xl shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 text-sm font-medium text-gray-700 ${
              isGoogleLoading ? "opacity-80 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-md"
            }`}
          >
            {isGoogleLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="text-center space-y-3">
            <p className="text-xs text-gray-600">
              Don't have an account?{" "}
              <a href="/beta" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Register now
              </a>
            </p>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 leading-relaxed">
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
  )
}