import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  CheckCircle,
  TrendingUp,
  Clock,
  Shield,
  ArrowRight,
  Menu,
  X,
  Star,
  Users,
  Building2,
  Zap,
  BarChart3,
  FileText,
  Settings,
  Award,
  Globe,
  Headphones,
  ArrowUpRight,
  PlayCircle,
  Download,
  ChevronRight,
  Target,
  DollarSign,
  Activity
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [counterStarted, setCounterStarted] = useState(false);
  const [companyCount, setCompanyCount] = useState(0);
  const [showPricing, setShowPricing] = useState(false);
  const trustSectionRef = useRef(null);
  
  // Company logos for the trust banner
  const companyLogos = [
    { name: "Tech Global", industry: "Technology" },
    { name: "Acme Corp", industry: "Manufacturing" },
    { name: "Nexus Health", industry: "Healthcare" },
    { name: "Pinnacle Finance", industry: "Finance" },
    { name: "Vertex Solutions", industry: "Consulting" },
    { name: "EcoTech", industry: "Energy" }
  ];
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Check if trust banner is in viewport
      if (trustSectionRef.current) {
        const rect = trustSectionRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0 && !counterStarted) {
          setCounterStarted(true);
          animateCounter();
        }
      }
    };
    
    const animateCounter = () => {
      let start = 0;
      const end = 500;
      const duration = 2000;
      const increment = 20;
      let timer;
      
      const step = () => {
        const progress = Math.min((start / end) * duration, duration);
        const easeProgress = easeOutQuad(progress / duration);
        const currentCount = Math.floor(easeProgress * end);
        setCompanyCount(currentCount);
        
        if (start < end) {
          start += increment;
          timer = setTimeout(step, increment);
        } else {
          setCompanyCount(end);
        }
      };
      
      step();
      return () => clearTimeout(timer);
    };
    
    const easeOutQuad = (x) => {
      return 1 - (1 - x) * (1 - x);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [counterStarted]);

  // Key features with enhanced descriptions
  const features = [
    { 
      icon: <FileText className="w-8 h-8 text-blue-600" />, 
      title: "Requisition Management", 
      description: "Streamline employee requests with intuitive approval workflows and real-time tracking system.",
      color: "blue"
    },
    { 
      icon: <Users className="w-8 h-8 text-emerald-600" />, 
      title: "Vendor Management", 
      description: "Build stronger relationships with suppliers through comprehensive vendor performance analytics.",
      color: "emerald"
    },
    { 
      icon: <ShoppingCart className="w-8 h-8 text-purple-600" />, 
      title: "Purchase Orders", 
      description: "Generate professional purchase orders with customizable templates and automated approval chains.",
      color: "purple"
    },
    { 
      icon: <Settings className="w-8 h-8 text-orange-600" />, 
      title: "Invoice Processing", 
      description: "Accelerate payment cycles with AI-powered invoice matching and verification system.",
      color: "orange"
    },
  ];

  // Benefits section
  const benefits = [
    { 
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      title: "Increase Efficiency",
      description: "Reduce procurement cycle times by up to 70% through automation.",
      metric: "70%",
      color: "blue"
    },
    { 
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      title: "Improve Compliance",
      description: "Ensure all purchases adhere to organizational policies and regulations.",
      metric: "99.9%",
      color: "emerald"
    },
    { 
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      title: "Save Time",
      description: "Eliminate manual processes and paperwork with end-to-end digital workflows.",
      metric: "8 hrs/day",
      color: "amber"
    },
    { 
      icon: <Shield className="w-6 h-6 text-red-600" />,
      title: "Reduce Risk",
      description: "Minimize procurement risks with built-in compliance and approval controls.",
      metric: "95%",
      color: "red"
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "This system has transformed our procurement processes, saving us countless hours and reducing errors by 95%.",
      author: "Sarah Banda",
      position: "Procurement Director",
      company: "Global Tech Inc.",
      rating: 5,
      avatar: "SB"
    },
    {
      quote: "The vendor management module has helped us identify our best suppliers and negotiate better terms.",
      author: "Michael Kaunda",
      position: "Supply Chain Manager",
      company: "Nexus Manufacturing",
      rating: 5,
      avatar: "MK"
    },
    {
      quote: "Implementation was smooth and the ROI was visible within the first quarter. Highly recommended.",
      author: "Priya Patel",
      position: "CFO",
      company: "Horizon Healthcare",
      rating: 5,
      avatar: "PP"
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Starter",
      price: 99,
      period: "per month",
      description: "Perfect for small businesses getting started with procurement automation",
      features: [
        "Up to 50 purchase orders/month",
        "Basic vendor management",
        "Standard reporting",
        "Email support",
        "Mobile app access"
      ],
      recommended: false,
      buttonText: "Start Free Trial",
      color: "gray"
    },
    {
      name: "Professional",
      price: 299,
      period: "per month",
      description: "Ideal for growing companies with advanced procurement needs",
      features: [
        "Unlimited purchase orders",
        "Advanced vendor analytics",
        "Custom approval workflows",
        "Priority support",
        "API access",
        "Advanced reporting",
        "Multi-location support"
      ],
      recommended: true,
      buttonText: "Start Free Trial",
      color: "blue"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Comprehensive solution for large organizations with complex requirements",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated account manager",
        "On-premise deployment",
        "SLA guarantee",
        "Training & onboarding",
        "24/7 phone support"
      ],
      recommended: false,
      buttonText: "Contact Sales",
      color: "purple"
    }
  ];

  // MetricCard Component
  const MetricCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'emerald' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          'bg-gray-50'
        }`}>
          <Icon className={
            color === 'blue' ? 'text-blue-600' :
            color === 'emerald' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'orange' ? 'text-orange-600' :
            'text-gray-600'
          } />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">+{trend}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
    </div>
  );

  if (showPricing) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <ShoppingCart className="w-8 h-8 text-blue-600 mr-3" />
                <span className="text-xl font-bold text-gray-900">NexusMWI</span>
              </div>
              <button
                onClick={() => setShowPricing(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Choose Your Perfect Plan
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Transform your procurement process with our flexible pricing options. Start with a 14-day free trial on any plan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl border-2 p-8 hover:shadow-xl transition-all duration-300 ${
                    plan.recommended 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-4">
                      {typeof plan.price === 'number' ? (
                        <>
                          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                          <span className="text-gray-600 ml-2">{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      plan.recommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
                  <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Is there a setup fee?</h3>
                  <p className="text-gray-600">No setup fees for Starter and Professional plans. Enterprise plans may include implementation services.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
                  <p className="text-gray-600">We accept all major credit cards, bank transfers, and can arrange invoice billing for Enterprise customers.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Do you offer discounts for annual payments?</h3>
                  <p className="text-gray-600">Yes, save 20% when you pay annually. Contact our sales team for multi-year discount options.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200" : "bg-transparent"
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <ShoppingCart className={`w-8 h-8 mr-3 ${scrolled ? "text-blue-600" : "text-blue-600"}`} />
              <span className={`text-xl font-bold ${scrolled ? "text-gray-900" : "text-gray-900"}`}>NexusMWI</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-medium transition-colors ${
                scrolled ? "text-gray-600 hover:text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`}>Features</a>
              <a href="#benefits" className={`font-medium transition-colors ${
                scrolled ? "text-gray-600 hover:text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`}>Benefits</a>
              <button
                onClick={() => setShowPricing(true)}
                className={`font-medium transition-colors ${
                  scrolled ? "text-gray-600 hover:text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Pricing
              </button>
              <a href="#testimonials" className={`font-medium transition-colors ${
                scrolled ? "text-gray-600 hover:text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`}>Testimonials</a>
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Login</a>
              <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Get Started
              </a>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden focus:outline-none" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? 
                <X className={scrolled ? "text-gray-900" : "text-gray-900"} /> : 
                <Menu className={scrolled ? "text-gray-900" : "text-gray-900"} />
              }
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden bg-white border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2">Features</a>
                <a href="#benefits" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2">Benefits</a>
                <button
                  onClick={() => setShowPricing(true)}
                  className="text-left text-gray-600 hover:text-blue-600 font-medium px-4 py-2"
                >
                  Pricing
                </button>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2">Testimonials</a>
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2">Login</a>
                <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center mx-4 transition-colors">
                  Get Started
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                <span>Trusted by 500+ companies worldwide</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Transform Your 
                <span className="text-blue-600 block">Procurement</span> 
                Process
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                A comprehensive cloud-based solution that streamlines requisitions, vendor management, purchase orders, and invoice processing for modern enterprises.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="/register" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-medium py-4 px-8 rounded-xl transition-all duration-300">
                  <PlayCircle className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Procurement Dashboard</h3>
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold">$2.4M</div>
                        <div className="text-blue-100 text-sm">Total Savings</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">94%</div>
                        <div className="text-blue-100 text-sm">Efficiency</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-gray-900">Purchase Order #1234</span>
                      </div>
                      <span className="text-emerald-600 font-medium">Approved</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">Vendor Review</span>
                      </div>
                      <span className="text-blue-600 font-medium">Pending</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating stats */}
                <div 
                  ref={trustSectionRef}
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4 transition-all duration-700"
                  style={{ 
                    transform: counterStarted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                    opacity: counterStarted ? 1 : 0
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        {companyCount}+
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        Companies Trust Us
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Uptime Reliability" 
              value="99.9%"
              icon={Shield} 
              color="emerald" 
              trend={2}
              subtitle="Always available"
            />
            <MetricCard 
              title="Cost Reduction" 
              value="30%"
              icon={DollarSign} 
              color="blue" 
              trend={12}
              subtitle="Average savings"
            />
            <MetricCard 
              title="Faster Processing" 
              value="65%"
              icon={Zap} 
              color="purple" 
              trend={18}
              subtitle="Improved speed"
            />
            <MetricCard 
              title="Customer Rating" 
              value="4.9/5"
              icon={Star} 
              color="orange" 
              subtitle="User satisfaction"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Settings className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive solution covers the entire procurement lifecycle with advanced automation and intelligent insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{
                  transform: counterStarted ? 'translateY(0)' : 'translateY(20px)',
                  opacity: counterStarted ? 1 : 0,
                  transitionDelay: `${index * 150}ms`
                }}
              >
                <div className={`p-3 rounded-xl mb-6 w-fit ${
                  feature.color === 'blue' ? 'bg-blue-50' :
                  feature.color === 'emerald' ? 'bg-emerald-50' :
                  feature.color === 'purple' ? 'bg-purple-50' :
                  'bg-orange-50'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                <span>Proven Results</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Solution?
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our procurement system delivers tangible business benefits that directly impact your bottom line and operational efficiency.
              </p>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        benefit.color === 'blue' ? 'bg-blue-100' :
                        benefit.color === 'emerald' ? 'bg-emerald-100' :
                        benefit.color === 'amber' ? 'bg-amber-100' :
                        'bg-red-100'
                      }`}>
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                          <span className="text-2xl font-bold text-blue-600">{benefit.metric}</span>
                        </div>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900">Analytics Dashboard</h3>
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Procurement Efficiency</span>
                      <span className="font-medium text-gray-900">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{width: '94%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cost Savings</span>
                      <span className="font-medium text-gray-900">$2.4M</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Vendor Compliance</span>
                      <span className="font-medium text-gray-900">99.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '99%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted By Leading Organizations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join over <span className="text-blue-600 font-bold">{companyCount}+</span> companies that trust our procurement solutions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {companyLogos.map((company, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center hover:shadow-md transition-all duration-300"
                style={{
                  opacity: counterStarted ? 1 : 0,
                  transform: counterStarted ? 'scale(1)' : 'scale(0.9)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-white">{company.name.charAt(0)}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{company.name}</p>
                  <p className="text-xs text-gray-500">{company.industry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>Client Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What Our Clients Say</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join hundreds of satisfied organizations that have transformed their procurement process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  opacity: counterStarted ? 1 : 0,
                  transform: counterStarted ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 text-yellow-400 fill-current" 
                    />
                  ))}
                </div>
                
                <p className="text-gray-700 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-70 transform -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full opacity-70 transform translate-x-24 translate-y-24"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>Limited Time: 20% Off Annual Plans</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Procurement Process?
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start your 14-day free trial today or schedule a personalized demo with our product specialists.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <a 
                href="/register"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </a>
              <button 
                onClick={() => setShowPricing(true)}
                className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-medium py-4 px-8 rounded-xl transition-all duration-300"
              >
                View Pricing
                <DollarSign className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Easy setup in minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <ShoppingCart className="w-8 h-8 text-blue-400 mr-3" />
                <span className="text-2xl font-bold">NexusMWI</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Streamlining procurement processes for modern enterprises with intelligent automation and comprehensive analytics.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.015-.628.961-.689 1.8-1.56 2.46-2.548z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><button onClick={() => setShowPricing(true)} className="text-gray-400 hover:text-white transition-colors">Pricing</button></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} NexusMWI. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">GDPR</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}