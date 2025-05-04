import { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, User, Building, Briefcase, UserCheck, Mail, Phone, Lock } from "lucide-react";

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentProcess, setCurrentProcess] = useState(0);
  const [success, setSuccess] = useState(false);
  
  const steps = ["Email", "Personal Info", "Company", "Review"];

  const hrmsProcesses = [
    { 
      icon: Mail, 
      title: "Easy Onboarding", 
      description: "Quick and secure registration process to get you started" 
    },
    { 
      icon: User, 
      title: "User Management", 
      description: "Add and manage team members with custom access roles" 
    },
    { 
      icon: Building, 
      title: "Company Settings", 
      description: "Customize the platform to match your organization's needs" 
    },
    { 
      icon: Briefcase, 
      title: "Workflow Setup", 
      description: "Create approval workflows tailored to your processes" 
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProcess(prev => (prev + 1) % hrmsProcesses.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Hospitality",
    "Other"
  ];

  const roles = [
    "IT/Technical",
    "Executive (CEO, CFO, etc.)",
    "Management",
    "Sales/Marketing",
    "Operations",
    "Human Resources",
    "Accounting/Finance",
    "Other"
  ];

  const handleNext = () => {
    setError("");
    
    if (activeStep === 0 && !email) {
      setError("Please enter your email address");
      return;
    }
    if (activeStep === 1 && (!firstName || !lastName || !password)) {
      setError("Please fill all required fields");
      return;
    }
    if (activeStep === 2 && (!companyName || !industry || !role)) {
      setError("Please complete all company details");
      return;
    }
    
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = () => {
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }
    
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      try {
        setSuccess(true);
        setTimeout(() => {
          console.log("Registration successful - would redirect to dashboard");
        }, 2000);
      } catch (err) {
        setError(err.message || "Registration failed. Please try again.");
        setIsLoading(false);
      }
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="mx-auto mb-8 flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full">
            <CheckCircle size={48} />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-8">Welcome to our platform. You're being redirected to your dashboard...</p>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-blue-300"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-blue-300"
                    placeholder="John"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-blue-300"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-blue-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">Password must be at least 8 characters</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Building size={18} />
                </div>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-blue-300"
                  placeholder="Acme Inc."
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Briefcase size={18} />
                </div>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-blue-300 appearance-none bg-white"
                  required
                >
                  <option value="" disabled>Select your industry</option>
                  {industries.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Your Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <UserCheck size={18} />
                </div>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-blue-300 appearance-none bg-white"
                  required
                >
                  <option value="" disabled>Select your role</option>
                  {roles.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Review Your Information</h3>
              
              <div className="space-y-5">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{email}</span>
                </div>
                <div className="border-t border-gray-200"></div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{firstName} {lastName}</span>
                </div>
                <div className="border-t border-gray-200"></div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{companyName}</span>
                </div>
                <div className="border-t border-gray-200"></div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry:</span>
                  <span className="font-medium">{industry}</span>
                </div>
                <div className="border-t border-gray-200"></div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium">{role}</span>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-blue-300"
                  placeholder="+265 (999) 000-000"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">We'll send a verification code to this number</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center">
              <img
                src="/hrms-logo.png"
                className="h-48 w-auto mx-auto"
                alt="Company Logo"
              />
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300
                    ${index < activeStep 
                      ? "bg-blue-600 text-white" 
                      : index === activeStep 
                      ? "bg-blue-600 text-white ring-4 ring-blue-100" 
                      : "bg-gray-100 text-gray-500"}`}
                  >
                    {index < activeStep ? (
                      <CheckCircle size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${index === activeStep ? "text-gray-900" : "text-gray-500"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="relative h-2 bg-gray-100 rounded-full">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeStep === 0 ? "Create your account" : 
               activeStep === 1 ? "Tell us about yourself" : 
               activeStep === 2 ? "Company information" : 
               "Review your details"}
            </h2>
            <p className="text-gray-500">
              {activeStep === 0 ? "Start your 14-day free trial" : 
               activeStep === 1 ? "We'll use this to personalize your experience" : 
               activeStep === 2 ? "Let us know about your organization" : 
               "Make sure everything looks correct"}
            </p>
          </div>
          
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start text-red-700">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {renderStepContent(activeStep)}
          </div>
          
          <div className="flex space-x-4">
            {activeStep > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex-1"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back
              </button>
            )}
            
            <button
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isLoading}
              className={`flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                activeStep === 0 ? "w-full" : "flex-1"
              } ${isLoading ? "opacity-80 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing...
                </>
              ) : activeStep === steps.length - 1 ? (
                "Complete Registration"
              ) : (
                "Continue"
              )}
            </button>
          </div>
          
          {activeStep === 0 && (
            <div className="text-center space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 absolute w-full"></div>
                <div className="bg-white px-4 relative text-sm text-gray-500">or</div>
              </div>
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Sign in
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Right panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 flex-col justify-center items-center text-white p-16 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/5 rounded-full -top-20 -right-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full bottom-10 -left-20 animate-pulse" style={{animationDelay: '1s', animationDuration: '10s'}}></div>
          <div className="absolute w-64 h-64 bg-white/5 rounded-full bottom-1/4 right-1/3 animate-pulse" style={{animationDelay: '0.5s', animationDuration: '7s'}}></div>
        </div>
        
        <div className="max-w-md z-10 space-y-10">
          <div>
            <h1 className="text-4xl font-bold mb-6">Streamline Your Procurement</h1>
            <p className="text-xl opacity-90">Join thousands of companies managing their procurement process efficiently with our platform.</p>
          </div>
          
          {/* HRMS Process Animation */}
          <div className="space-y-8">
            <div className="relative h-96">
              {hrmsProcesses.map((process, index) => {
                const ProcessIcon = process.icon;
                return (
                  <div 
                    key={index} 
                    className={`absolute w-full transition-all duration-700 transform ${
                      index === currentProcess 
                        ? "opacity-100 translate-y-0" 
                        : index < currentProcess
                        ? "opacity-0 -translate-y-full" 
                        : "opacity-0 translate-y-full"
                    }`}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                      <div className="flex items-center mb-6">
                        <div className="p-4 bg-white/20 rounded-full mr-4">
                          <ProcessIcon size={32} />
                        </div>
                        <h3 className="text-2xl font-bold">{process.title}</h3>
                      </div>
                      <p className="text-lg text-white/90 mb-6">{process.description}</p>
                      
                      <div className="bg-white/10 rounded-lg p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="h-4 bg-white/30 rounded w-3/4"></div>
                          <div className="h-4 bg-white/30 rounded"></div>
                          <div className="h-4 bg-white/30 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Progress indicators */}
            <div className="flex justify-center space-x-2">
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
          
          <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="flex items-center mb-4">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-xs font-medium">JD</div>
                <div className="w-10 h-10 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-xs font-medium">AR</div>
                <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-xs font-medium">TK</div>
              </div>
              <div className="ml-4 text-sm">Join 5,000+ companies using our platform</div>
            </div>
            <p className="italic text-lg">"Implementation was seamless and we saw immediate improvements in our procurement process efficiency."</p>
            <p className="mt-4 font-semibold">— Michael Chen, Director of Operations</p>
          </div>
        </div>
      </div>
    </div>
  );
}