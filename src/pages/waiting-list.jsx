import React, { useState, useEffect } from 'react';
import {
  Mail,
  User,
  Building2,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Users,
  Sparkles,
  Star,
  TrendingUp,
  Lock,
  Bell,
  AlertTriangle
} from 'lucide-react';

const BetaInvitationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    useCase: '',
    industry: '',
    companySize: '11-50'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submissionData, setSubmissionData] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null);
    const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;
  // Fetch current queue status on component mount
  useEffect(() => {
    const fetchQueueStatus = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/invitations/queue/status`);
        if (response.ok) {
          const result = await response.json();
          setQueueStatus(result.data);
        }
      } catch (error) {
        console.error('Error fetching queue status:', error);
      }
    };

    fetchQueueStatus();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.role) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setSubmitError('');
    
    try {
      // Make API call to submit beta invitation
      const response = await fetch(`${backendUrl}/api/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         credentials: "include",
        mode:"cors",
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.toLowerCase().trim(),
          company: formData.company.trim(),
          role: formData.role,
          useCase: formData.useCase.trim(),
          industry: formData.industry.trim(),
          companySize: formData.companySize,
          source: 'website',
          // Add UTM parameters if available in URL
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
          referralCode: new URLSearchParams(window.location.search).get('ref')
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit invitation');
      }

      // Success - store response data and show success screen
      setSubmissionData(result.data);
      setIsSubmitted(true);

    } catch (error) {
      console.error('Error submitting invitation:', error);
      setSubmitError(error.message || 'Failed to submit invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Experience procurement workflows that are 10x faster than traditional systems"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption and compliance built-in"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Real-time insights and predictive analytics to optimize your spending"
    },
    {
      icon: Users,
      title: "Seamless Collaboration",
      description: "Streamlined approval workflows with real-time collaboration tools"
    }
  ];

  const benefits = [
    "Early access to cutting-edge features",
    "Direct line to our product team",
    "Influence the product roadmap",
    "Premium support during beta",
    "Lifetime discount when we launch"
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Procurement Director",
      company: "TechCorp",
      quote: "This platform has revolutionized how we handle procurement. The beta access gave us a competitive edge."
    },
    {
      name: "Michael Rodriguez",
      role: "Finance Manager", 
      company: "Global Solutions",
      quote: "The analytics capabilities are incredible. We've reduced processing time by 70% already."
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">You're on the list!</h2>
            <p className="text-gray-600 mb-6">
              Welcome to our exclusive beta program. We'll notify you as soon as your early access is ready.
            </p>
            
            {submissionData && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
                <div className="text-2xl font-bold text-blue-800 mb-2">
                  #{submissionData.queuePosition}
                </div>
                <div className="text-sm text-blue-700 mb-3">Your position in the queue</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Priority</div>
                    <div className="text-blue-600 capitalize">{submissionData.priority}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Est. Wait Time</div>
                    <div className="text-blue-600">{submissionData.estimatedWaitTime}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                <Bell size={16} />
                What happens next?
              </div>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• You'll receive a welcome email within a few minutes</li>
                <li>• Our team will review your application</li>
                <li>• Beta access will be granted based on priority</li>
                <li>• You'll get an email with your beta access credentials</li>
              </ul>
            </div>
            <button 
              onClick={() => {
                setIsSubmitted(false);
                setSubmissionData(null);
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  company: '',
                  role: '',
                  useCase: '',
                  industry: '',
                  companySize: '11-50'
                });
              }}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Submit another application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles size={16} />
            Now in Private Beta
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The Future of
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Procurement</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join forward-thinking companies using our AI-powered procurement platform. 
            Get exclusive early access and help shape the future of business operations.
          </p>

          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-2 border-white"></div>
                ))}
              </div>
              <span className="text-sm font-medium">
                {queueStatus ? `${queueStatus.queueLength}+ people waiting` : '500+ companies waiting'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <span className="text-sm font-medium">
                {queueStatus ? `~${queueStatus.estimatedWaitTime} average wait` : 'Early access program'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Early Access</h2>
              <p className="text-gray-600">Join our exclusive beta program and be among the first to experience the future of procurement.</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Acme Corp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select your role</option>
                  <option value="procurement">Procurement Manager</option>
                  <option value="finance">Finance Manager</option>
                  <option value="operations">Operations Manager</option>
                  <option value="cfo">CFO</option>
                  <option value="ceo">CEO</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Technology, Manufacturing, Healthcare"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your primary use case?
                </label>
                <textarea
                  name="useCase"
                  value={formData.useCase}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us how you plan to use our platform..."
                />
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
                  <div className="text-red-800 text-sm">{submitError}</div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Request Beta Access
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to our privacy policy. No spam, ever.
              </p>
            </div>
          </div>

          {/* Features & Benefits */}
          <div className="space-y-8">
            {/* Current Queue Status */}
            {queueStatus && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-blue-600" />
                  Current Queue Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{queueStatus.queueLength}</div>
                    <div className="text-sm text-blue-700">People in queue</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{queueStatus.estimatedWaitTime}</div>
                    <div className="text-sm text-purple-700">Average wait time</div>
                  </div>
                </div>
                {queueStatus.priorityBreakdown && (
                  <div className="mt-4 text-xs text-gray-600">
                    Queue breakdown: {queueStatus.priorityBreakdown.high} high priority, {queueStatus.priorityBreakdown.medium} medium priority, {queueStatus.priorityBreakdown.low} low priority
                  </div>
                )}
              </div>
            )}

            {/* Beta Benefits */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock size={20} className="text-blue-600" />
                Exclusive Beta Benefits
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Why Beta Users Love Us</h3>
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <feature.icon size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">What Beta Users Say</h3>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-gray-700 mb-3 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{testimonial.name}</div>
                      <div className="text-xs text-gray-600">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            Have questions about our beta program? 
            <a href="mailto:beta@company.com" className="text-blue-600 hover:text-blue-700 ml-1">
              Contact our team
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BetaInvitationPage;