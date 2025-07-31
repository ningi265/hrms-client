import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
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
  Activity,
  Smartphone,
  Monitor,
  Layers,
  Lock,
  Truck,
  CreditCard,
  Calendar,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Eye,
  ArrowDown,
  Sparkles,
  Gauge,
  FileCheck,
  AlertTriangle
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [counterStarted, setCounterStarted] = useState(false);
  const [companyCount, setCompanyCount] = useState(0);
  const [showPricing, setShowPricing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const trustSectionRef = useRef(null);
  
  // Company logos for the trust banner
  const companyLogos = [
    { name: "Tech Global", industry: "Technology", logo: "TG", color: "from-blue-500 to-blue-600" },
    { name: "Acme Corp", industry: "Manufacturing", logo: "AC", color: "from-green-500 to-green-600" },
    { name: "Nexus Health", industry: "Healthcare", logo: "NH", color: "from-red-500 to-red-600" },
    { name: "Pinnacle Finance", industry: "Finance", logo: "PF", color: "from-yellow-500 to-yellow-600" },
    { name: "Vertex Solutions", industry: "Consulting", logo: "VS", color: "from-purple-500 to-purple-600" },
    { name: "EcoTech", industry: "Energy", logo: "ET", color: "from-emerald-500 to-emerald-600" },
    { name: "Global Industries", industry: "Manufacturing", logo: "GI", color: "from-orange-500 to-orange-600" },
    { name: "Smart Systems", industry: "Technology", logo: "SS", color: "from-indigo-500 to-indigo-600" }
  ];
  
  // Handle scroll effect for navbar and animations
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

      // Check visibility for other sections
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0) {
          setIsVisible(prev => ({ ...prev, [index]: true }));
        }
      });
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

  // Enhanced features with detailed descriptions
  const features = [
    { 
      icon: <FileText className="w-8 h-8 text-blue-600" />, 
      title: "Smart Requisition Management", 
      description: "AI-powered requisition workflows with intelligent approval routing, real-time tracking, and automated notifications to streamline your procurement process.",
      benefits: ["Auto-routing approvals", "Real-time tracking", "Mobile accessibility", "Custom templates"],
      color: "blue"
    },
    { 
      icon: <Users className="w-8 h-8 text-emerald-600" />, 
      title: "Advanced Vendor Management", 
      description: "Comprehensive vendor lifecycle management with performance analytics, risk assessment, and contract management capabilities.",
      benefits: ["Performance tracking", "Risk assessment", "Contract management", "Vendor portal"],
      color: "emerald"
    },
    { 
      icon: <ShoppingCart className="w-8 h-8 text-purple-600" />, 
      title: "Automated Purchase Orders", 
      description: "Generate professional purchase orders with customizable templates, automated approval chains, and integrated supplier communications.",
      benefits: ["Custom templates", "Auto-approvals", "Supplier integration", "Order tracking"],
      color: "purple"
    },
    { 
      icon: <CreditCard className="w-8 h-8 text-orange-600" />, 
      title: "Intelligent Invoice Processing", 
      description: "AI-powered invoice matching and verification with automated payment processing and comprehensive audit trails.",
      benefits: ["AI-powered matching", "Auto-payments", "Audit trails", "Exception handling"],
      color: "orange"
    },
    { 
      icon: <BarChart3 className="w-8 h-8 text-indigo-600" />, 
      title: "Advanced Analytics & Reporting", 
      description: "Comprehensive dashboards with real-time insights, custom reports, and predictive analytics for strategic decision making.",
      benefits: ["Real-time dashboards", "Custom reports", "Predictive analytics", "KPI tracking"],
      color: "indigo"
    },
    { 
      icon: <Layers className="w-8 h-8 text-teal-600" />, 
      title: "Enterprise Integrations", 
      description: "Seamless integration with ERP systems, accounting software, and business applications through robust APIs and pre-built connectors.",
      benefits: ["ERP integration", "API access", "Pre-built connectors", "Data synchronization"],
      color: "teal"
    },
  ];

  // Enhanced benefits with metrics
  const benefits = [
    { 
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      title: "Increase Efficiency",
      description: "Reduce procurement cycle times by up to 70% through intelligent automation and streamlined workflows.",
      metric: "70%",
      subtext: "faster processing",
      color: "blue"
    },
    { 
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      title: "Improve Compliance",
      description: "Ensure all purchases adhere to organizational policies with automated compliance checks and audit trails.",
      metric: "99.9%",
      subtext: "compliance rate",
      color: "emerald"
    },
    { 
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      title: "Save Time",
      description: "Eliminate manual processes and paperwork with end-to-end digital workflows and automated approvals.",
      metric: "8 hrs",
      subtext: "saved daily",
      color: "amber"
    },
    { 
      icon: <Shield className="w-6 h-6 text-red-600" />,
      title: "Reduce Risk",
      description: "Minimize procurement risks with built-in compliance controls, vendor assessments, and fraud detection.",
      metric: "95%",
      subtext: "risk reduction",
      color: "red"
    },
    { 
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      title: "Cost Savings",
      description: "Achieve significant cost reductions through better vendor negotiations and spend optimization.",
      metric: "$2.4M",
      subtext: "average savings",
      color: "green"
    },
    { 
      icon: <Gauge className="w-6 h-6 text-purple-600" />,
      title: "Performance Boost",
      description: "Monitor and improve procurement performance with advanced analytics and benchmarking tools.",
      metric: "45%",
      subtext: "improvement",
      color: "purple"
    },
  ];

  // Enhanced testimonials with more details
  const testimonials = [
    {
      quote: "NexusMWI has revolutionized our procurement processes. We've reduced cycle times by 65% and improved vendor relationships significantly. The ROI was evident within the first quarter.",
      author: "Sarah Banda",
      position: "Chief Procurement Officer",
      company: "Global Tech Inc.",
      rating: 5,
      avatar: "SB",
      industry: "Technology",
      employees: "5,000+",
      savings: "$1.2M annually"
    },
    {
      quote: "The vendor management module has been a game-changer. We can now track performance metrics in real-time and make data-driven decisions about our supplier relationships.",
      author: "Michael Kaunda",
      position: "Supply Chain Director",
      company: "Nexus Manufacturing",
      rating: 5,
      avatar: "MK",
      industry: "Manufacturing",
      employees: "2,500+",
      savings: "$800K annually"
    },
    {
      quote: "Implementation was seamless, and the support team was exceptional. The system pays for itself through the efficiency gains alone. Highly recommended for any serious procurement operation.",
      author: "Priya Patel",
      position: "CFO",
      company: "Horizon Healthcare",
      rating: 5,
      avatar: "PP",
      industry: "Healthcare",
      employees: "3,200+",
      savings: "$950K annually"
    }
  ];

  // Enhanced pricing plans
  const pricingPlans = [
    {
      name: "Starter",
      price: 99,
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
      buttonText: "Start Free Trial",
      color: "gray",
      popular: false
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
        "Priority support (4h response)",
        "API access & integrations",
        "Advanced reporting & dashboards",
        "Multi-location support",
        "Dedicated onboarding"
      ],
      limits: "Up to 25 users",
      recommended: true,
      buttonText: "Start Free Trial",
      color: "blue",
      popular: true
    },
    {
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
      popular: false
    }
  ];

  // Integration partners
  const integrations = [
    { name: "SAP", type: "ERP", logo: "SAP", color: "from-blue-600 to-blue-700" },
    { name: "Oracle", type: "ERP", logo: "ORC", color: "from-red-600 to-red-700" },
    { name: "Microsoft", type: "Office Suite", logo: "MS", color: "from-blue-500 to-blue-600" },
    { name: "Salesforce", type: "CRM", logo: "SF", color: "from-blue-400 to-blue-500" },
    { name: "QuickBooks", type: "Accounting", logo: "QB", color: "from-green-600 to-green-700" },
    { name: "NetSuite", type: "ERP", logo: "NS", color: "from-orange-600 to-orange-700" }
  ];

  // Process steps
  const processSteps = [
    {
      step: "01",
      title: "Create Requisition",
      description: "Employees submit procurement requests through intuitive digital forms with automated routing.",
      icon: <FileCheck className="w-8 h-8 text-blue-600" />
    },
    {
      step: "02", 
      title: "Approval Workflow",
      description: "Smart routing ensures requests go to the right approvers based on amount, category, and policies.",
      icon: <CheckCircle className="w-8 h-8 text-emerald-600" />
    },
    {
      step: "03",
      title: "Vendor Selection",
      description: "Choose from pre-approved vendors or add new ones with comprehensive evaluation criteria.",
      icon: <Users className="w-8 h-8 text-purple-600" />
    },
    {
      step: "04",
      title: "Purchase Order",
      description: "Generate professional POs with automated delivery to suppliers and internal stakeholders.",
      icon: <ShoppingCart className="w-8 h-8 text-orange-600" />
    }
  ];

  // Stats for the hero section
  const heroStats = [
    { label: "Companies Trust Us", value: "500+", icon: <Building2 className="w-5 h-5" /> },
    { label: "Transactions Processed", value: "$2.8B+", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Average Savings", value: "32%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Customer Satisfaction", value: "98%", icon: <Star className="w-5 h-5" /> }
  ];

  // MetricCard Component
  const MetricCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 ${
          color === 'blue' ? 'bg-blue-50 group-hover:bg-blue-100' :
          color === 'emerald' ? 'bg-emerald-50 group-hover:bg-emerald-100' :
          color === 'purple' ? 'bg-purple-50 group-hover:bg-purple-100' :
          color === 'orange' ? 'bg-orange-50 group-hover:bg-orange-100' :
          'bg-gray-50 group-hover:bg-gray-100'
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <img 
                  src="/nexusmwi-logo.png" 
                  alt="NexusMWI Logo" 
                  className="h-10 w-auto mr-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.marginLeft = '0';
                  }}
                />
                <span className="text-xl font-bold text-gray-900">NexusMWI</span>
              </div>
              <button
                onClick={() => setShowPricing(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Choose Your Perfect Plan</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Transparent Pricing for Every Business
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Transform your procurement process with our flexible pricing options. Start with a 14-day free trial on any plan.
              </p>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Save 20% with annual billing</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl border-2 p-8 hover:shadow-2xl transition-all duration-300 ${
                    plan.recommended 
                      ? 'border-blue-500 shadow-xl scale-105 ring-4 ring-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <div className="mb-4">
                      {typeof plan.price === 'number' ? (
                        <div>
                          <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                          <span className="text-gray-600 ml-2">{plan.period}</span>
                          <div className="text-sm text-gray-500 mt-2">{plan.limits}</div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                          <div className="text-sm text-gray-500 mt-2">{plan.limits}</div>
                        </div>
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
                    className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                      plan.recommended
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-105'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    question: "Can I change plans anytime?",
                    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle, and we'll prorate any differences."
                  },
                  {
                    question: "Is there a setup fee?",
                    answer: "No setup fees for Starter and Professional plans. Enterprise plans may include implementation services as part of the custom pricing."
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards, bank transfers, and can arrange invoice billing for Enterprise customers. Annual payments receive a 20% discount."
                  },
                  {
                    question: "Do you offer discounts for annual payments?",
                    answer: "Yes, save 20% when you pay annually. We also offer multi-year discounts for Enterprise customers. Contact our sales team for details."
                  },
                  {
                    question: "What's included in the free trial?",
                    answer: "The 14-day free trial includes full access to all features of your chosen plan, dedicated onboarding support, and no commitment to continue."
                  },
                  {
                    question: "How does billing work?",
                    answer: "Billing is monthly or annual based on your preference. You'll receive invoices via email, and payments are processed securely through our payment partners."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200" : "bg-white/80 backdrop-blur-sm"
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/nexusmwi-logo.png" 
                alt="NexusMWI Logo" 
                className="h-10 w-auto mr-3 transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.marginLeft = '0';
                }}
              />
              <span className="text-xl font-bold text-gray-900">NexusMWI</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#benefits" className="font-medium text-gray-600 hover:text-blue-600 transition-colors">Benefits</a>
              <a href="#process" className="font-medium text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
              <button
                onClick={() => setShowPricing(true)}
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Pricing
              </button>
              <a href="#testimonials" className="font-medium text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Login</a>
              <a href="/beta" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                Get Started
              </a>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? 
                <X className="text-gray-900 w-6 h-6" /> : 
                <Menu className="text-gray-900 w-6 h-6" />
              }
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden bg-white border-t border-gray-200 py-4 shadow-lg">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Features</a>
                <a href="#benefits" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Benefits</a>
                <a href="#process" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">How it Works</a>
                <button
                  onClick={() => setShowPricing(true)}
                  className="text-left text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Pricing
                </button>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Testimonials</a>
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">Login</a>
                <a href="/beta" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg text-center mx-4 transition-all duration-300 hover:shadow-lg">
                  Get Started
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl translate-x-32 translate-y-32"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2"> 
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Transform Your 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">Procurement</span> 
                Process
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                A comprehensive cloud-based solution that streamlines requisitions, vendor management, purchase orders, and invoice processing for modern enterprises.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="/beta" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 group">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

              {/* Hero Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
                {heroStats.map((stat, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-blue-600">{stat.icon}</div>
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    </div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src="/nexusmwi-logo.png" 
                          alt="NexusMWI Logo" 
                          className="h-6 w-auto opacity-80"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <h3 className="font-semibold">Procurement Dashboard</h3>
                      </div>
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
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-gray-900">Purchase Order #1234</span>
                      </div>
                      <span className="text-emerald-600 font-medium text-sm bg-emerald-100 px-2 py-1 rounded">Approved</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">Vendor Review</span>
                      </div>
                      <span className="text-blue-600 font-medium text-sm bg-blue-100 px-2 py-1 rounded">Pending</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-900">Invoice Processing</span>
                      </div>
                      <span className="text-purple-600 font-medium text-sm bg-purple-100 px-2 py-1 rounded">Active</span>
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
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
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

                {/* Additional floating element */}
                <div 
                  className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-4 text-white transition-all duration-700 delay-300"
                  style={{ 
                    transform: counterStarted ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.9)',
                    opacity: counterStarted ? 1 : 0
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-medium">99.9% Uptime</span>
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
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Proven Results Across Industries
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join leading organizations that have transformed their procurement processes with measurable results.
            </p>
          </div>
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

      {/* How It Works Section */}
      <section id="process" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50" data-animate>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Gauge className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How NexusMWI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes procurement management effortless, from requisition to payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div 
                key={index}
                className="relative group"
                style={{
                  transform: isVisible[index] ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isVisible[index] ? 1 : 0,
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group-hover:border-blue-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white" data-animate>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
                style={{
                  transform: counterStarted ? 'translateY(0)' : 'translateY(30px)',
                  opacity: counterStarted ? 1 : 0,
                  transitionDelay: `${index * 150}ms`
                }}
              >
                <div className={`p-3 rounded-xl mb-6 w-fit group-hover:scale-110 transition-transform duration-300 ${
                  feature.color === 'blue' ? 'bg-blue-50 group-hover:bg-blue-100' :
                  feature.color === 'emerald' ? 'bg-emerald-50 group-hover:bg-emerald-100' :
                  feature.color === 'purple' ? 'bg-purple-50 group-hover:bg-purple-100' :
                  feature.color === 'orange' ? 'bg-orange-50 group-hover:bg-orange-100' :
                  feature.color === 'indigo' ? 'bg-indigo-50 group-hover:bg-indigo-100' :
                  'bg-teal-50 group-hover:bg-teal-100'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50" data-animate>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              <span>Proven Results</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Measurable Business Impact
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Our procurement system delivers tangible business benefits that directly impact your bottom line and operational efficiency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
                style={{
                  transform: isVisible[index] ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isVisible[index] ? 1 : 0,
                  transitionDelay: `${index * 150}ms`
                }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 ${
                    benefit.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                    benefit.color === 'emerald' ? 'bg-emerald-100 group-hover:bg-emerald-200' :
                    benefit.color === 'amber' ? 'bg-amber-100 group-hover:bg-amber-200' :
                    benefit.color === 'red' ? 'bg-red-100 group-hover:bg-red-200' :
                    benefit.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                    'bg-purple-100 group-hover:bg-purple-200'
                  }`}>
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-gray-900 mb-1">{benefit.metric}</div>
                  <div className="text-sm text-gray-500 font-medium">{benefit.subtext}</div>
                </div>
                
                <p className="text-gray-600 leading-relaxed text-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-white" data-animate>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Layers className="w-4 h-4" />
              <span>Seamless Integrations</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Connect with Your Existing Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              NexusMWI integrates seamlessly with your existing business systems, ensuring a smooth transition and unified workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-gray-200"
                style={{
                  opacity: counterStarted ? 1 : 0,
                  transform: counterStarted ? 'scale(1)' : 'scale(0.9)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${integration.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-lg font-bold text-white">{integration.logo}</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm text-center">{integration.name}</p>
                <p className="text-xs text-gray-500 text-center">{integration.type}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Need a custom integration? Our API makes it possible.</p>
            <a href="/integrations" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              View All Integrations
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50" data-animate>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted By Leading Organizations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join over <span className="text-blue-600 font-bold">{companyCount}+</span> companies that trust our procurement solutions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {companyLogos.map((company, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  opacity: counterStarted ? 1 : 0,
                  transform: counterStarted ? 'scale(1)' : 'scale(0.9)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${company.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <span className="text-sm font-bold text-white">{company.logo}</span>
                </div>
                <p className="font-semibold text-gray-900 text-xs text-center">{company.name}</p>
                <p className="text-xs text-gray-500 text-center">{company.industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden" data-animate>
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-32 translate-y-32"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>Client Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What Our Clients Say</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join hundreds of satisfied organizations that have transformed their procurement process with measurable results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
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
                
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.position}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Industry</p>
                      <p className="font-medium text-gray-900">{testimonial.industry}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Employees</p>
                      <p className="font-medium text-gray-900">{testimonial.employees}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Annual Savings</p>
                      <p className="font-medium text-emerald-600">{testimonial.savings}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white relative overflow-hidden" data-animate>
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-70 blur-3xl -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full opacity-70 blur-3xl translate-x-24 translate-y-24"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
              <span>Limited Time: 20% Off Annual Plans</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Procurement Process?
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start your 14-day free trial today or schedule a personalized demo with our product specialists to see how NexusMWI can revolutionize your procurement operations.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <a 
                href="/beta"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 group"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button 
                onClick={() => setShowPricing(true)}
                className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50 font-medium py-4 px-8 rounded-xl transition-all duration-300 group"
              >
                View Pricing
                <DollarSign className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
              <a 
                href="/demo"
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 group"
              >
                Schedule Demo
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8">
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
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Dedicated support</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="bg-gray-50 rounded-2xl p-8 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Companies served</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime guarantee</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Expert support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <img 
                  src="/nexusmwi-logo.png" 
                  alt="NexusMWI Logo" 
                  className="h-8 w-auto mr-3 opacity-80"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.marginLeft = '0';
                  }}
                />
                <span className="text-2xl font-bold">NexusMWI</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Streamlining procurement processes for modern enterprises with intelligent automation, comprehensive analytics, and seamless integrations. Transform your procurement operations today.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.015-.628.961-.689 1.8-1.56 2.46-2.548z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><button onClick={() => setShowPricing(true)} className="text-gray-400 hover:text-white transition-colors">Pricing</button></li>
                <li><a href="/integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="/api" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="/security" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="/mobile" className="text-gray-400 hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <ul className="space-y-3">
                <li><a href="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="/case-studies" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="/webinars" className="text-gray-400 hover:text-white transition-colors">Webinars</a></li>
                <li><a href="/downloads" className="text-gray-400 hover:text-white transition-colors">Downloads</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/partners" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
                <li><a href="/press" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="/investors" className="text-gray-400 hover:text-white transition-colors">Investors</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} NexusMWI. All rights reserved.</p>
              <div className="flex flex-wrap gap-6">
                <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="/cookie-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
                <a href="/gdpr" className="text-gray-400 hover:text-white transition-colors text-sm">GDPR</a>
                <a href="/accessibility" className="text-gray-400 hover:text-white transition-colors text-sm">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}