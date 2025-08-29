import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  ShoppingCart, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Layers, 
  Users, 
  Shield, 
  TrendingUp, 
  Zap, 
  Gauge, 
  DollarSign, 
  Settings, 
  Calendar, 
  Headphones, 
  HelpCircle, 
  Mail, 
  Phone,
  Sparkles,
  Star,
  ArrowRight,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { useAuth } from '../authcontext/authcontext';

const BillingPage = ({ onUpgrade }) => {
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [error, setError] = useState(null);
  
  const backendUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV;

  // Fetch user subscription info on component mount
  useEffect(() => {
    fetchUserSubscription();
  }, []);

  const fetchUserSubscription = async () => {
    try {
      setError(null);
      const response = await fetch(`${backendUrl}/api/billing/subscription`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }
      
      const data = await response.json();
      setUserSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError(error.message);
    }
  };

  const hasUsedTrial = () => {
    return userSubscription?.trial && !userSubscription.trial.isActive;
  };

  // Map plans to Stripe price IDs
  const stripePriceIds = {
    starter: {
      monthly: 'price_1RmlIeP4bSIJGI9K6tRIpKf6',
      annual: 'price_1RmlJZP4bSIJGI9K7RGjuHhX'
    },
    professional: {
      monthly: 'price_1RmlKLP4bSIJGI9KmMX31rJ0',
      annual: 'price_1RmlL2P4bSIJGI9Kqehrb2ws'
    },
    enterprise: {
      monthly: 'price_enterprise_monthly',
      annual: 'price_enterprise_annual'
    }
  };

  const pricingPlans = [
    {
      id: 'starter',
      name: "Starter",
      price: isAnnual ? 79 : 99,
      originalPrice: isAnnual ? 99 : null,
      period: "per month",
      description: "Perfect for small businesses getting started with procurement automation",
      features: [
        "Up to 50 purchase orders/month",
        "Basic vendor management",
        "Standard reporting dashboard",
        "Email support (24h response)",
        "Mobile app access",
        "Basic integrations",
        "User training resources"
      ],
      limits: "Up to 5 users",
      recommended: false,
      buttonText: hasUsedTrial() ? "Subscribe Now" : "Start Free Trial",
      color: "gray",
      popular: false,
      savings: isAnnual ? "20%" : null,
      stripePriceId: stripePriceIds.starter[isAnnual ? 'annual' : 'monthly'],
      allowTrial: !hasUsedTrial()
    },
    {
      id: 'professional',
      name: "Professional",
      price: isAnnual ? 239 : 299,
      originalPrice: isAnnual ? 299 : null,
      period: "per month",
      description: "Ideal for growing companies with advanced procurement needs",
      features: [
        "Unlimited purchase orders",
        "Advanced vendor analytics",
        "Custom approval workflows",
        "Priority support (4h response)",
        "API access & integrations",
        "Advanced reporting & dashboards",
        "Multi-location support",
        "Dedicated onboarding"
      ],
      limits: "Up to 25 users",
      recommended: true,
      buttonText: hasUsedTrial() ? "Subscribe Now" : "Start Free Trial",
      color: "blue",
      popular: true,
      savings: isAnnual ? "20%" : null,
      stripePriceId: stripePriceIds.professional[isAnnual ? 'annual' : 'monthly'],
      allowTrial: !hasUsedTrial()
    },
    {
      id: 'enterprise',
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Comprehensive solution for large organizations with complex requirements",
      features: [
        "Everything in Professional",
        "Custom integrations & workflows",
        "Dedicated account manager",
        "On-premise deployment option",
        "99.9% SLA guarantee",
        "Advanced training & onboarding",
        "24/7 phone support",
        "Custom reporting & analytics"
      ],
      limits: "Unlimited users",
      recommended: false,
      buttonText: "Contact Sales",
      color: "purple",
      popular: false,
      stripePriceId: null
    }
  ];

  const benefits = [
    { 
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      title: "Increase Efficiency",
      description: "Reduce procurement cycle times by up to 70% through intelligent automation and streamlined workflows.",
      metric: "70%",
      subtext: "faster processing"
    },
    { 
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: "Improve Compliance",
      description: "Ensure all purchases adhere to organizational policies with automated compliance checks and audit trails.",
      metric: "99.9%",
      subtext: "compliance rate"
    },
    { 
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Reduce Risk",
      description: "Minimize procurement risks with built-in compliance controls, vendor assessments, and fraud detection.",
      metric: "95%",
      subtext: "risk reduction"
    }
  ];

  const faqs = [
    {
      question: "How does PO automation work?",
      answer: "Our system automates purchase order creation, approval workflows, and distribution to vendors, reducing manual work by up to 80%."
    },
    {
      question: "Can I track invoice status?",
      answer: "Yes, our platform provides real-time tracking of invoice status from receipt through approval and payment."
    },
    {
      question: "What ERP systems do you integrate with?",
      answer: "We integrate with SAP, Oracle, Microsoft Dynamics, NetSuite, and other major ERP systems through our API."
    },
    {
      question: "How secure is vendor data?",
      answer: "We use bank-grade encryption and SOC 2 Type II certified data centers to protect all vendor and transaction data."
    },
    {
      question: "Can I customize approval workflows?",
      answer: "Yes, Professional and Enterprise plans allow full customization of approval chains based on amount, department, and category."
    },
    {
      question: "Do you support international vendors?",
      answer: "Yes, we support multi-currency transactions and international tax compliance for global procurement operations."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

 const handlePlanSelect = async (plan) => {
  if (plan.name === 'Enterprise') {
    window.location.href = 'mailto:sales@nexusmwi.com?subject=Enterprise Plan Inquiry';
    return;
  }

  if (!plan.allowTrial && plan.buttonText.includes("Trial")) {
    alert("You have already used your free trial. Please choose a paid subscription.");
    return;
  }

  setLoading(true);
  setSelectedPlan(plan.id);
  setError(null);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Safely check for company account status
    const isCompanyAccount = Boolean(
      user?.isEnterpriseAdmin || 
      user?.company || 
      user?.role?.includes('Enterprise')
    );

    const requestBody = {
    planName: plan.name.toLowerCase(),
    priceId: plan.stripePriceId,
    isAnnual: isAnnual,
    isTrial: plan.allowTrial && plan.buttonText.includes("Trial"),
    isCompany: Boolean(
      user?.isEnterpriseAdmin || 
      user?.company || 
      user?.role?.includes('Enterprise')
    )
  };

    // Log for debugging
    console.log('Checkout request body:', {
      ...requestBody,
      userRoles: user?.role,
      isEnterpriseAdmin: user?.isEnterpriseAdmin,
      hasCompany: !!user?.company
    });

    const response = await fetch(`${backendUrl}/api/billing/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    setError(error.message);
  } finally {
    setLoading(false);
    setSelectedPlan(null);
  }
};
  const isCurrentPlan = (planName) => {
    return userSubscription?.subscription?.plan === planName.toLowerCase();
  };

  const isOnTrial = () => {
    return userSubscription?.trial?.isActive || false;
  };

  const getTrialDaysRemaining = () => {
    return userSubscription?.trial?.remainingDays || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trial Banner */}
      {isOnTrial() && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm">
              <strong>Trial Active:</strong> {getTrialDaysRemaining()} days remaining. 
              <span className="ml-2">Upgrade now to continue enjoying our services!</span>
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {hasUsedTrial() && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>Your trial has ended.</strong> To continue using our services, please upgrade to a paid plan.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Procurement Solutions Pricing</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Streamline Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Purchase Orders</span>
              <br />& Invoices
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Transform your procurement operations with our comprehensive cloud-based solution for requisitions, vendor management, purchase orders, and invoice processing.
            </p>
            
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Check className="w-4 h-4" />
              <span>Save 20% with annual billing</span>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    !isAnnual 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                    isAnnual 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Annual
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.recommended 
                  ? 'border-blue-500 scale-105 z-10' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${isCurrentPlan(plan.name) ? 'ring-2 ring-green-500' : ''}`}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {isCurrentPlan(plan.name) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Current Plan
                  </div>
                </div>
              )}

              {plan.popular && !isCurrentPlan(plan.name) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    <Star className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              {plan.savings && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Save {plan.savings}
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    {typeof plan.price === 'number' ? (
                      <div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {plan.originalPrice && (
                            <span className="text-2xl text-gray-400 line-through">
                              ${plan.originalPrice}
                            </span>
                          )}
                          <span className="text-5xl font-bold text-gray-900">
                            ${plan.price}
                          </span>
                        </div>
                        <p className="text-gray-600">{plan.period}</p>
                        <p className="text-sm text-gray-500 mt-2">{plan.limits}</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                        <p className="text-sm text-gray-500 mt-2">{plan.limits}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={
                    (loading && selectedPlan === plan.id) || 
                    isCurrentPlan(plan.name) ||
                    (!plan.allowTrial && plan.buttonText.includes("Trial"))
                  }
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCurrentPlan(plan.name)
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : plan.recommended
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {loading && selectedPlan === plan.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : isCurrentPlan(plan.name) ? (
                    'Current Plan'
                  ) : (
                    <>
                      {plan.buttonText}
                      <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Procurement Performance Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See measurable improvements in your procurement operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white rounded-full p-4 mb-6 shadow-lg">
                    {benefit.icon}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {benefit.metric}
                  </div>
                  <div className="text-sm text-gray-600 mb-4 font-medium">
                    {benefit.subtext}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our procurement platform
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Procurement Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Start your 14-day free trial today and experience the power of automated purchase orders and invoice processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {hasUsedTrial() ? (
              <button
                onClick={() => handlePlanSelect(pricingPlans[1])}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              >
                Upgrade Now
                <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => handlePlanSelect(pricingPlans[1])}
                className="flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
          <p className="text-blue-100 mt-6 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;