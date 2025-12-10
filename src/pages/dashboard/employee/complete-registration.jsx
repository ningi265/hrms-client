import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from 'axios';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Clock,
  Building,
  Phone,
  Briefcase,
  Save,
  ArrowRight,
  UserCheck,
  KeyRound,
  Sparkles
} from 'lucide-react';

const CompleteRegistration = () => {
  const [searchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  const [tokenValid, setTokenValid] = useState(false);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Verify token when component mounts
  useEffect(() => {
    if (!token) {
      setError('Invalid registration link. Missing token.');
      setLoading(false);
      return;
    }

    verifyToken(token);
  }, [token]);

  // Verify registration token
  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/verify-registration/${token}`);
      
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
        setTokenValid(true);
      } else {
        setError('Invalid or expired registration link.');
      }
    } catch (err) {
      console.error('Token verification error:', err);
      if (err.response?.data?.expired) {
        setError('This registration link has expired. Please contact HR to resend the registration email.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid registration link. Please contact HR for assistance.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    const feedback = [];

    if (!checks.length) feedback.push('At least 8 characters');
    if (!checks.uppercase) feedback.push('One uppercase letter');
    if (!checks.lowercase) feedback.push('One lowercase letter');
    if (!checks.number) feedback.push('One number');
    if (!checks.special) feedback.push('One special character');

    setPasswordStrength({ score, feedback });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (passwordStrength.score < 5) {
      setError('Password is too weak. Please follow all password requirements.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post(`${backendUrl}/api/auth/complete-registration`, {
        token,
        username: formData.username.trim(),
        password: formData.password
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration completed successfully! Please log in with your new credentials.',
              username: formData.username 
            }
          });
        }, 3000);
      }
    } catch (err) {
      console.error('Registration completion error:', err);
      setError(err.response?.data?.message || 'Failed to complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return '#dc3545';
    if (passwordStrength.score === 3) return '#ffc107';
    if (passwordStrength.score === 4) return '#fd7e14';
    if (passwordStrength.score === 5) return '#28a745';
    return '#28a745';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score === 3) return 'Fair';
    if (passwordStrength.score === 4) return 'Good';
    if (passwordStrength.score === 5) return 'Strong';
    return 'Strong';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Registration Link</h2>
          <p className="text-gray-600">
            Please wait while we verify your registration link...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-2xl max-w-md w-full p-8 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <XCircle size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Link Invalid</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50">
            <h3 className="font-semibold text-blue-900 mb-2">Need help?</h3>
            <p className="text-blue-700 text-sm">
              Contact your HR department or system administrator for assistance.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-2xl max-w-md w-full p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto"
          >
            <CheckCircle size={32} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Complete!</h2>
          <p className="text-gray-600 mb-6">
            Welcome to the team{userInfo?.firstName ? `, ${userInfo.firstName}` : ''}! Your account has been successfully set up.
          </p>
          
          <div className="bg-green-50/50 rounded-xl p-4 border border-green-200/50 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span className="font-medium text-gray-900">{formData.username}</span>
              </div>
              {userInfo?.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{userInfo.email}</span>
                </div>
              )}
              {userInfo?.position && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Position:</span>
                  <span className="font-medium text-gray-900">{userInfo.position}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <Clock size={16} />
              <span className="text-sm font-medium">Redirecting to login page in a few seconds...</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UserCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Complete Your Registration</h1>
              <p className="text-blue-100">Set up your account credentials</p>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        {userInfo && (
          <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-b border-gray-100/50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building size={18} className="text-blue-500" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">
                    {userInfo.firstName} {userInfo.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{userInfo.email}</p>
                </div>
              </div>
              {userInfo.position && (
                <div className="flex items-center space-x-3">
                  <Briefcase size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium text-gray-900">{userInfo.position}</p>
                  </div>
                </div>
              )}
              {userInfo.companyName && (
                <div className="flex items-center space-x-3">
                  <Building size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium text-gray-900">{userInfo.companyName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-3"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User size={16} className="text-blue-500" />
                Choose a Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 text-gray-900 placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Username must be 3-30 characters long and contain only letters, numbers, and underscores.
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <KeyRound size={16} className="text-blue-500" />
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300 rounded-full"
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      ></div>
                    </div>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>

                  {passwordStrength.feedback.length > 0 && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <p className="text-sm font-medium text-amber-800 mb-2">Password must include:</p>
                      <ul className="text-sm text-amber-700 space-y-1">
                        {passwordStrength.feedback.map((requirement, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Shield size={16} className="text-blue-500" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || passwordStrength.score < 5}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Completing Registration...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Complete Registration</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 bg-blue-50/50 border border-blue-200/50 rounded-xl p-4">
            <div className="flex items-center space-x-3 text-blue-700">
              <Shield size={18} />
              <div>
                <p className="font-medium text-sm">Secure Registration</p>
                <p className="text-xs text-blue-600">
                  Your information is encrypted and secure. This link expires in 24 hours for security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteRegistration;