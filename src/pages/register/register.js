import { useState, useEffect } from "react";
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft, 
  User, 
  Building, 
  Briefcase, 
  UserCheck, 
  Mail, 
  Phone, 
  Lock, 
  Upload, 
  Image, 
  FileSignature, 
  Youtube 
} from "lucide-react";

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
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const steps = ["Email", "Personal", "Company", "Review"];

  const hrmsProcesses = [
    { 
      icon: Mail, 
      title: "Quick Onboarding", 
      description: "Secure registration process" 
    },
    { 
      icon: User, 
      title: "Team Management", 
      description: "Manage team with custom roles" 
    },
    { 
      icon: Building, 
      title: "Company Setup", 
      description: "Customize for your organization" 
    },
    { 
      icon: Briefcase, 
      title: "Workflow Design", 
      description: "Create approval workflows" 
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

  const handleResendCode = async () => {
    setIsSendingSMS(true);
    setError("");
    
    try {
      const response = await fetch(`${backendUrl}/api/auth/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to resend verification code');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSendingSMS(false);
    }
  };
  
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setLogo(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setSignature(file);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      const registrationResponse = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          companyName,
          password,
          industry,
          role,
          phoneNumber
        }),
      });
      
      if (!registrationResponse.ok) {
        const errorData = await registrationResponse.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const registrationData = await registrationResponse.json();
      localStorage.setItem("token", registrationData.token);
  
      setIsSendingSMS(true);
      const smsResponse = await fetch(`${backendUrl}/api/auth/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
  
      if (!smsResponse.ok) {
        throw new Error('Failed to send verification code');
      }
  
      setShowVerification(true);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsSendingSMS(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      const response = await fetch(`${backendUrl}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }
  
      setSuccess(true);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = () => {
    setHasCompletedOnboarding(true);
    window.location.href = '/dashboard';
  };

  if (showVerification) {
    if (success) {
      return (
        <div className="h-screen bg-white flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full">
                <CheckCircle size={24} />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {onboardingStep === 0 && "Brand Your Account"}
                {onboardingStep === 1 && "Add Your Signature"}
                {onboardingStep === 2 && "Quick Platform Tour"}
              </h2>
              <p className="text-sm text-gray-600">
                {onboardingStep === 0 && "Upload your company logo to brand all your forms"}
                {onboardingStep === 1 && "Add your signature for approvals"}
                {onboardingStep === 2 && "Watch a quick overview of our platform"}
              </p>
            </div>
            
            <div className="space-y-6">
              {onboardingStep === 0 && (
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  {logo ? (
                    <>
                      <div className="mb-3 p-2 bg-gray-100 rounded-lg">
                        <img 
                          src={URL.createObjectURL(logo)} 
                          alt="Company Logo Preview" 
                          className="h-24 object-contain"
                        />
                      </div>
                      <button 
                        onClick={() => setLogo(null)}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Change Logo
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-blue-100 p-3 rounded-full mb-3">
                        <Image size={24} className="text-blue-600" />
                      </div>
                      <label className="cursor-pointer">
                        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Upload Logo
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </span>
                      </label>
                      <p className="mt-2 text-xs text-gray-500">PNG, JPG or SVG (Max. 5MB)</p>
                    </>
                  )}
                </div>
              )}
              
              {onboardingStep === 1 && (
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  {signature ? (
                    <>
                      <div className="mb-3 p-2 bg-gray-100 rounded-lg">
                        <img 
                          src={URL.createObjectURL(signature)} 
                          alt="Signature Preview" 
                          className="h-24 object-contain"
                        />
                      </div>
                      <button 
                        onClick={() => setSignature(null)}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Change Signature
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-purple-100 p-3 rounded-full mb-3">
                        <FileSignature size={24} className="text-purple-600" />
                      </div>
                      <label className="cursor-pointer">
                        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Upload Signature
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleSignatureUpload}
                            className="hidden"
                          />
                        </span>
                      </label>
                      <p className="mt-2 text-xs text-gray-500">PNG or JPG (Max. 2MB)</p>
                    </>
                  )}
                </div>
              )}
              
              {onboardingStep === 2 && (
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                  <div className="h-full flex items-center justify-center bg-black">
                    <div className="text-center p-6">
                      <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full">
                        <Youtube size={24} />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1">Platform Walkthrough</h3>
                      <p className="text-sm text-gray-300 mb-4">Watch this 2-minute video to get started</p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center mx-auto">
                        <Youtube size={16} className="mr-2" />
                        Play Video
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                {onboardingStep > 0 && (
                  <button
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (onboardingStep < 2) {
                      setOnboardingStep(onboardingStep + 1);
                    } else {
                      handleCompleteOnboarding();
                    }
                  }}
                  disabled={(onboardingStep === 0 && !logo) || (onboardingStep === 1 && !signature)}
                  className={`ml-auto flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 ${
                    (onboardingStep === 0 && !logo) || (onboardingStep === 1 && !signature) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {onboardingStep < 2 ? "Continue" : "Go to Dashboard"}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
              <Phone size={24} />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1">Verify Your Phone Number</h2>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit code to <span className="font-medium">{phoneNumber}</span>
            </p>
          </div>
          
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start text-red-700">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-xs">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-center text-lg tracking-widest"
                placeholder="123456"
                maxLength={6}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Didn't receive a code? 
                <button 
                  onClick={handleResendCode} 
                  className="text-blue-600 hover:underline ml-1"
                  disabled={isSendingSMS}
                >
                  Resend
                </button>
              </p>
            </div>
            
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                  Verifying...
                </>
              ) : (
                "Verify and Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    placeholder="John"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className={`mt-1 text-xs ${
                password.length > 0 && password.length < 8 
                  ? "text-red-500" 
                  : "text-gray-500"
              }`}>
                {password.length > 0 && password.length < 8
                  ? "Password must be at least 8 characters"
                  : "Password must be at least 8 characters"}
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Building size={16} />
                </div>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="Acme Inc."
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Briefcase size={16} />
                </div>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white"
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
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Your Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <UserCheck size={16} />
                </div>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white"
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
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Review Your Information</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{firstName} {lastName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{companyName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Industry:</span>
                  <span className="font-medium">{industry}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium">{role}</span>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={16} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="+265 (999) 000-000"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">We'll send a verification code to this number</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left panel - form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            {/* Logo */}
            <div className="text-center flex-shrink-0">
              <div className="inline-flex items-center">
                <img
                  src="/hrms-logo.png"
                  className="h-32 w-auto mx-auto"
                  alt="Company Logo"
                />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-300
                      ${index < activeStep 
                        ? "bg-blue-600 text-white" 
                        : index === activeStep 
                        ? "bg-blue-600 text-white ring-4 ring-blue-100" 
                        : "bg-gray-100 text-gray-500"}`}
                    >
                      {index < activeStep ? (
                        <CheckCircle size={14} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-xs mt-1 ${index === activeStep ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="relative h-1 bg-gray-100 rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-gray-900">
                {activeStep === 0 ? "Create your account" : 
                 activeStep === 1 ? "Tell us about yourself" : 
                 activeStep === 2 ? "Company information" : 
                 "Review your details"}
              </h2>
              <p className="text-sm text-gray-500">
                {activeStep === 0 ? "Start your 14-day free trial" : 
                 activeStep === 1 ? "We'll personalize your experience" : 
                 activeStep === 2 ? "Tell us about your organization" : 
                 "Make sure everything looks correct"}
              </p>
            </div>
            
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start text-red-700">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{error}</span>
                </div>
              )}
              
              {renderStepContent(activeStep)}
            </div>
            
            <div className="flex space-x-3">
              {activeStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 flex-1"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back
                </button>
              )}
              
              <button
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={isLoading}
                className={`flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 ${
                  activeStep === 0 ? "w-full" : "flex-1"
                } ${isLoading ? "opacity-80 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
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
              <div className="text-center space-y-3">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-200 absolute w-full"></div>
                  <div className="bg-white px-4 relative text-xs text-gray-500">or</div>
                </div>
                <p className="text-gray-500 text-xs">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                    Sign in
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Right panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/5 rounded-full -top-20 -right-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full bottom-10 -left-20 animate-pulse" style={{animationDelay: '1s', animationDuration: '10s'}}></div>
          <div className="absolute w-64 h-64 bg-white/5 rounded-full bottom-1/4 right-1/3 animate-pulse" style={{animationDelay: '0.5s', animationDuration: '7s'}}></div>
        </div>
        
        <div className="flex flex-col justify-center max-w-md z-10 p-12 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Streamline Your Procurement</h1>
            <p className="text-lg opacity-90">Join thousands of companies managing their procurement process efficiently with our platform.</p>
          </div>
          
          {/* HRMS Process Animation */}
          <div className="space-y-6">
            <div className="relative h-64">
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
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-white/20 rounded-full mr-3">
                          <ProcessIcon size={24} />
                        </div>
                        <h3 className="text-lg font-bold">{process.title}</h3>
                      </div>
                      <p className="text-sm text-white/90 mb-4">{process.description}</p>
                      
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="animate-pulse space-y-2">
                          <div className="h-3 bg-white/30 rounded w-3/4"></div>
                          <div className="h-3 bg-white/30 rounded"></div>
                          <div className="h-3 bg-white/30 rounded w-5/6"></div>
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
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === currentProcess ? "w-6 bg-white" : "w-1 bg-white/40"
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="flex items-center mb-3">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-xs font-medium">JD</div>
                <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-xs font-medium">AR</div>
                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-xs font-medium">TK</div>
              </div>
              <div className="ml-3 text-xs">Join 5,000+ companies using our platform</div>
            </div>
            <p className="italic text-sm">"Implementation was seamless and we saw immediate improvements in our procurement process efficiency."</p>
            <p className="mt-3 font-semibold text-sm">— Michael Chen, Director of Operations</p>
          </div>
        </div>
      </div>
    </div>
  );
}