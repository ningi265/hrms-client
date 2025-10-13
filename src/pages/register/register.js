"use client"

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  ImageIcon,
  FileSignature,
  Youtube,
} from "lucide-react";
import { useAuth } from "../../authcontext/authcontext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar } from "lucide-react";

export default function RegisterPage() {
  const location = useLocation();
  const googleData = location.state;

  // Secure password generation function
  const generateSecurePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < 32; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [email, setEmail] = useState(googleData?.email || "");
  const [firstName, setFirstName] = useState(googleData?.firstName || "");
  const [lastName, setLastName] = useState(googleData?.lastName || "");
  const [companyName, setCompanyName] = useState("")
  const [password, setPassword] = useState(
    googleData?.googleSignup ? generateSecurePassword() : ""
  );
  const [skipVerification, setSkipVerification] = useState(googleData?.googleSignup || false);
  const [showPassword, setShowPassword] = useState(false)
  const [industry, setIndustry] = useState("")
  const [role, setRole] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentProcess, setCurrentProcess] = useState(0)
  const [success, setSuccess] = useState(false)
  const [emailVerificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [isSendingSMS, setIsSendingSMS] = useState(false)
  const [logo, setLogo] = useState(null)
  const [signature, setSignature] = useState(null)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const { register: authRegister, backendUrl } = useAuth();

  const [userData, setUserData] = useState(null)
  const [authToken, setAuthToken] = useState(null)
  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState("");

  useEffect(() => {
    if (!backendUrl || backendUrl === 'undefined') {
      console.error('Backend URL is not configured properly:', backendUrl);
      toast.error('Configuration error: Unable to connect to server');
    }
  }, [backendUrl]);

  const steps = ["Email", "Personal", "Company", "Review"]

  const hrmsProcesses = [
    {
      icon: Mail,
      title: "Quick Onboarding",
      description: "Secure registration process",
    },
    {
      icon: User,
      title: "Team Management",
      description: "Manage team with custom roles",
    },
    {
      icon: Building,
      title: "Company Setup",
      description: "Customize for your organization",
    },
    {
      icon: Briefcase,
      title: "Workflow Design",
      description: "Create approval workflows",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProcess((prev) => (prev + 1) % hrmsProcesses.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Hospitality",
    "Other",
  ]

  const roles = [
    "Enterprise(CEO, CFO, etc.)",
    "Vendor",
    "Other",
  ]

  const getRoleBasedPath = (userRole) => {
    const roleNavigationMap = {
      admin: "/dashboard",
      procurement_officer: "/dashboard",
      "IT/Technical": "/dashboard",
     "Enterprise(CEO, CFO, etc.)": "/dashboard",
      Management: "/dashboard",
      "Human Resources": "/dashboard",
      "Accounting/Finance": "/dashboard",
      Vendor: "/vendor-dash",
      Driver: "/driver-dash",
      "Sales/Marketing": "/employee-dash",
    }

    return roleNavigationMap[userRole] || "/employee-dash"
  }

  const handleNext = () => {
    setError("")

    if (activeStep === 0 && !email) {
      toast.error("Please enter your email address");
      return;
    }
    if (activeStep === 1 && (!firstName || !lastName || (!googleData?.googleSignup && !password))) {
      toast.error("Please fill all required fields");
      return;
    }
    if (activeStep === 2 && (!companyName || !industry || !role)) {
      toast.error("Please complete all company details");
      return;
    }

    setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setError("")
    setActiveStep(activeStep - 1)
  }

  const handleResendCode = async () => {
    setIsSendingSMS(true)
    setError("")

    try {
      if (!backendUrl || backendUrl === 'undefined') {
        throw new Error('Backend URL is not configured properly');
      }

      const response = await fetch(`${backendUrl}/api/auth/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode:"cors",
        body: JSON.stringify({ phoneNumber }),
      })

      if (!response.ok) {
        throw new Error("Failed to resend verification code")
      }
      toast.success("Verification code resent successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSendingSMS(false)
    }
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.match("image.*")) {
      setLogo(file)
      toast.success("Logo uploaded successfully");
    } else {
      toast.error("Please upload a valid image file");
    }
  }

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.match("image.*")) {
      setSignature(file)
      toast.success("Signature uploaded successfully");
    } else {
      toast.error("Please upload a valid image file");
    }
  }

  const handleSubmit = async () => {
    if (!skipVerification && !phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!skipVerification && !googleData?.googleSignup && password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!backendUrl || backendUrl === "undefined") {
      toast.error("Configuration error: Unable to connect to server");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const registrationData = await authRegister(
        firstName,
        lastName,
        email,
        password,
        companyName,
        industry,
        role,
        phoneNumber
      );

      setUserData(registrationData.user);
      setAuthToken(registrationData.token);

      if (skipVerification) {
        // ✅ Google signup: no email verification needed
        toast.success("Account created with Google!");
        navigate("/dashboard");
        return; // stop here
      }

      // ✅ Normal signup flow → send email verification
      setIsSendingSMS(true);

      const smsResponse = await fetch(`${backendUrl}/api/auth/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ email }),
      });

      if (!smsResponse.ok) {
        const errorData = await smsResponse.json();
        throw new Error(errorData.message || "Failed to send verification code");
      }

      toast.success("Verification code sent to your email");
      setShowVerification(true);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
      setIsSendingSMS(false);
    }
  };

  const handleVerify = async () => {
    if (!emailVerificationCode || emailVerificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    if (!backendUrl || backendUrl === 'undefined') {
      toast.error('Configuration error: Unable to connect to server');
      return;
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`${backendUrl}/api/auth/email/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: emailVerificationCode,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Verification failed")
      }

      toast.success("Email verified successfully!");
      setSuccess(true)
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteOnboarding = async () => {
    if (!backendUrl || backendUrl === 'undefined') {
      toast.error('Configuration error: Unable to connect to server');
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (logo) {
        const logoFormData = new FormData();
        logoFormData.append("logo", logo);
        logoFormData.append("email", email.trim().toLowerCase());

        const logoResponse = await fetch(`${backendUrl}/api/auth/onboarding/logo`, {
          method: "PUT",
          body: logoFormData,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!logoResponse.ok) {
          const errorData = await logoResponse.json();
          throw new Error(errorData.message || "Failed to upload logo");
        }
      }

      if (signature) {
        const signatureFormData = new FormData();
        signatureFormData.append("signature", signature);
        signatureFormData.append("email", email.trim().toLowerCase());

        const signatureResponse = await fetch(`${backendUrl}/api/auth/onboarding/signature`, {
          method: "PUT",
          body: signatureFormData,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!signatureResponse.ok) {
          const errorData = await signatureResponse.json();
          throw new Error(errorData.message || "Failed to upload signature");
        }
      }

      if (!userData) {
        throw new Error("User data not available. Please try logging in again.");
      }

      setHasCompletedOnboarding(true);
      setIsLoading(false);

      toast.success('Account setup complete! Redirecting to login page...', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error("Error during onboarding completion:", error);
      toast.error(error.message || "An error occurred while completing onboarding", {
        position: "top-center",
        autoClose: 5000,
      });
      setIsLoading(false);
    }
  };

  if (!backendUrl || backendUrl === 'undefined') {
    return (
      <div className="h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h2>
          <p className="text-sm text-gray-600 mb-4">
            Unable to connect to server. Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (showVerification) {
    if (success) {
      return (
        <div className="h-screen bg-white flex items-center justify-center p-4">
          <ToastContainer />
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

            {userData && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Welcome, {userData.firstName || firstName} {userData.lastName || lastName}!
                </p>
                <p className="text-xs text-blue-600">
                  Role: {userData.role || role} | Company: {userData.companyName || companyName}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {onboardingStep === 0 && (
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  {logo ? (
                    <>
                      <div className="mb-3 p-2 bg-gray-100 rounded-lg">
                        <img
                          src={URL.createObjectURL(logo) || "/placeholder.svg"}
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
                        <ImageIcon size={24} className="text-blue-600" />
                      </div>
                      <label className="cursor-pointer">
                        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Upload Logo
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
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
                          src={URL.createObjectURL(signature) || "/placeholder.svg"}
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
                          <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
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
                      setOnboardingStep(onboardingStep + 1)
                    } else {
                      handleCompleteOnboarding()
                    }
                  }}
                  disabled={(onboardingStep === 0 && !logo) || (onboardingStep === 1 && !signature) || isLoading}
                  className={`ml-auto flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 ${
                    (onboardingStep === 0 && !logo) || (onboardingStep === 1 && !signature) || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                      Saving...
                    </>
                  ) : onboardingStep < 2 ? (
                    "Continue"
                  ) : (
                    "Go to Dashboard"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="h-screen bg-white flex items-center justify-center p-4">
        <ToastContainer />
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
              <Phone size={24} />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Verify Your email</h2>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit code to <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                id="verificationCode"
                type="text"
                value={emailVerificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setVerificationCode(value)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-center text-lg tracking-widest"
                placeholder="123456"
                maxLength={6}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Didn't receive a code?{" "}
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
    )
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
        )
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
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\-' ]/g, "");
                      setFirstName(value);
                    }}
                    className={`w-full pl-9 px-3 py-2 border ${
                      firstName.length === 0 ? "border-gray-200" : "border-green-200"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200`}
                    placeholder="John"
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>
                {firstName.length > 0 && firstName.length < 2 && (
                  <p className="mt-1 text-xs text-red-500">
                    First name must be at least 2 characters
                  </p>
                )}
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
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\-' ]/g, "");
                      setLastName(value);
                    }}
                    className={`w-full pl-9 px-3 py-2 border ${
                      lastName.length === 0 ? "border-gray-200" : "border-green-200"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200`}
                    placeholder="Doe"
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>
                {lastName.length > 0 && lastName.length < 2 && (
                  <p className="mt-1 text-xs text-red-500">
                    Last name must be at least 2 characters
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Calendar size={16} />
                </div>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const today = new Date();
                    const minAgeDate = new Date(
                      today.getFullYear() - 18,
                      today.getMonth(),
                      today.getDate()
                    );
                    
                    if (selectedDate <= minAgeDate) {
                      setDob(e.target.value);
                      setDobError('');
                    } else {
                      setDobError('You must be at least 18 years old');
                    }
                  }}
                  className={`w-full pl-9 px-3 py-2 border ${
                    dob && !dobError ? "border-green-200" : dobError ? "border-red-200" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200`}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              {dobError && (
                <p className="mt-1 text-xs text-red-500">{dobError}</p>
              )}
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
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9+]/g, "");
                    setPhoneNumber(value);
                  }}
                  className={`w-full pl-9 px-3 py-2 border ${
                    phoneNumber.length === 0 ? "border-gray-200" : 
                    phoneNumber.length >= 10 ? "border-green-200" : "border-red-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200`}
                  placeholder="+265 123 456 789"
                  required
                />
              </div>
              {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                <p className="mt-1 text-xs text-red-500">
                  Phone number must be at least 10 digits
                </p>
              )}
            </div>

            {!googleData?.googleSignup && (
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
                    className={`w-full pl-9 px-3 py-2 border ${
                      password.length === 0 ? "border-gray-200" : 
                      password.length >= 8 ? "border-green-200" : "border-red-200"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200`}
                    placeholder="••••••••"
                    required
                    minLength={8}
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
                <div className="mt-1 text-xs text-gray-500">
                  {password.length > 0 && (
                    <div className="space-y-1">
                      <p className={password.length >= 8 ? "text-green-500" : "text-red-500"}>
                        • {password.length >= 8 ? "✓" : "✗"} At least 8 characters
                      </p>
                      <p className={/[A-Z]/.test(password) ? "text-green-500" : "text-red-500"}>
                        • {/[A-Z]/.test(password) ? "✓" : "✗"} At least one uppercase letter
                      </p>
                      <p className={/[0-9]/.test(password) ? "text-green-500" : "text-red-500"}>
                        • {/[0-9]/.test(password) ? "✓" : "✗"} At least one number
                      </p>
                      <p className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-red-500"}>
                        • {/[^A-Za-z0-9]/.test(password) ? "✓" : "✗"} At least one special character
                      </p>
                    </div>
                  )}
                  {password.length === 0 && (
                    <p>Password must be at least 8 characters</p>
                  )}
                </div>
              </div>
            )}

            {googleData?.googleSignup && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="text-blue-600 mr-2" size={16} />
                  <p className="text-sm text-blue-800">
                    Your account is secured with Google authentication. A strong password has been auto-generated for your account.
                  </p>
                </div>
              </div>
            )}
          </div>
        )
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
                  <option value="" disabled>
                    Select your industry
                  </option>
                  {industries.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
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
                  <option value="" disabled>
                    Select your role
                  </option>
                  {roles.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )
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
                  <span className="font-medium">
                    {firstName} {lastName}
                  </span>
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
                Email
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
                  placeholder="+265 (999) 000-000"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">We'll send a verification code to this email</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
      <div className="flex h-screen overflow-hidden bg-white">
        {/* Left panel - form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-md space-y-6">
              {/* Logo */}
              <div className="text-center flex-shrink-0">
                <div className="inline-flex items-center">
                  <img src="/hrms-logo.png" className="h-32 w-auto mx-auto" alt="Company Logo" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-300
                        ${
                          index < activeStep
                            ? "bg-blue-600 text-white"
                            : index === activeStep
                              ? "bg-blue-600 text-white ring-4 ring-blue-100"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {index < activeStep ? <CheckCircle size={14} /> : index + 1}
                      </div>
                      <span
                        className={`text-xs mt-1 ${index === activeStep ? "text-gray-900 font-medium" : "text-gray-500"}`}
                      >
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
                  {activeStep === 0
                    ? "Create your account"
                    : activeStep === 1
                      ? "Tell us about yourself"
                      : activeStep === 2
                        ? "Company information"
                        : "Review your details"}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeStep === 0
                    ? "Start your 14-day free trial"
                    : activeStep === 1
                      ? "We'll personalize your experience"
                      : activeStep === 2
                        ? "Tell us about your organization"
                        : "Make sure everything looks correct"}
                </p>
              </div>

              <div className="space-y-4">
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
            <div
              className="absolute w-96 h-96 bg-white/5 rounded-full bottom-10 -left-20 animate-pulse"
              style={{ animationDelay: "1s", animationDuration: "10s" }}
            ></div>
            <div
              className="absolute w-64 h-64 bg-white/5 rounded-full bottom-1/4 right-1/3 animate-pulse"
              style={{ animationDelay: "0.5s", animationDuration: "7s" }}
            ></div>
          </div>

          <div className="flex flex-col justify-center max-w-md z-10 p-12 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">Streamline Your Procurement</h1>
              <p className="text-lg opacity-90">
                Join thousands of companies managing their procurement process efficiently with our platform.
              </p>
            </div>

            {/* HRMS Process Animation */}
            <div className="space-y-6">
              <div className="relative h-64">
                {hrmsProcesses.map((process, index) => {
                  const ProcessIcon = process.icon
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
                  )
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
                  <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-xs font-medium">
                    JD
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-xs font-medium">
                    AR
                  </div>
                  <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-xs font-medium">
                    TK
                  </div>
                </div>
                <div className="ml-3 text-xs">Join 5,000+ companies using our platform</div>
              </div>
              <p className="italic text-sm">
                "Implementation was seamless and we saw immediate improvements in our procurement process efficiency."
              </p>
              <p className="mt-3 font-semibold text-sm">— Michael Kaunda, Director of Operations</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}