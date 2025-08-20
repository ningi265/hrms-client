"use client"

import { useState, useEffect, useRef } from "react"
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
  PlayCircle,
  Target,
  DollarSign,
  Activity,
  Layers,
  CreditCard,
  Calendar,
  Sparkles,
  Gauge,
  FileCheck,
} from "lucide-react"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [counterStarted, setCounterStarted] = useState(false)
  const [companyCount, setCompanyCount] = useState(0)
  const [showPricing, setShowPricing] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [isVisible, setIsVisible] = useState({})
  const trustSectionRef = useRef(null)

  // Company logos for the trust banner
  const companyLogos = [
    { name: "Tech Global", industry: "Technology", logo: "TG", color: "from-blue-500 to-blue-600" },
    { name: "Acme Corp", industry: "Manufacturing", logo: "AC", color: "from-green-500 to-green-600" },
    { name: "Nexus Health", industry: "Healthcare", logo: "NH", color: "from-red-500 to-red-600" },
    { name: "Pinnacle Finance", industry: "Finance", logo: "PF", color: "from-yellow-500 to-yellow-600" },
    { name: "Vertex Solutions", industry: "Consulting", logo: "VS", color: "from-purple-500 to-purple-600" },
    { name: "EcoTech", industry: "Energy", logo: "ET", color: "from-emerald-500 to-emerald-600" },
    { name: "Global Industries", industry: "Manufacturing", logo: "GI", color: "from-orange-500 to-orange-600" },
    { name: "Smart Systems", industry: "Technology", logo: "SS", color: "from-indigo-500 to-indigo-600" },
  ]

  // Handle scroll effect for navbar and animations
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Check if trust banner is in viewport
      if (trustSectionRef.current) {
        const rect = trustSectionRef.current.getBoundingClientRect()
        if (rect.top <= window.innerHeight && rect.bottom >= 0 && !counterStarted) {
          setCounterStarted(true)
          animateCounter()
        }
      }

      // Check visibility for other sections
      const sections = document.querySelectorAll("[data-animate]")
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0) {
          setIsVisible((prev) => ({ ...prev, [index]: true }))
        }
      })
    }

    const animateCounter = () => {
      let start = 0
      const end = 500
      const duration = 2000
      const increment = 20
      let timer

      const step = () => {
        const progress = Math.min((start / end) * duration, duration)
        const easeProgress = easeOutQuad(progress / duration)
        const currentCount = Math.floor(easeProgress * end)
        setCompanyCount(currentCount)

        if (start < end) {
          start += increment
          timer = setTimeout(step, increment)
        } else {
          setCompanyCount(end)
        }
      }

      step()
      return () => clearTimeout(timer)
    }

    const easeOutQuad = (x) => {
      return 1 - (1 - x) * (1 - x)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [counterStarted])

  // Enhanced features with detailed descriptions
  const features = [
    {
      icon: <FileText className="w-5 h-5 text-white" />,
      title: "Smart Requisition Management",
      description: "AI-powered requisition workflows with intelligent approval routing and real-time tracking.",
      benefits: ["Auto-routing approvals", "Real-time tracking", "Mobile accessibility", "Custom templates"],
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      icon: <Users className="w-5 h-5 text-white" />,
      title: "Advanced Vendor Management",
      description: "Comprehensive vendor lifecycle management with performance analytics and risk assessment.",
      benefits: ["Performance tracking", "Risk assessment", "Contract management", "Vendor portal"],
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      icon: <ShoppingCart className="w-5 h-5 text-white" />,
      title: "Automated Purchase Orders",
      description: "Generate professional purchase orders with customizable templates and automated approvals.",
      benefits: ["Custom templates", "Auto-approvals", "Supplier integration", "Order tracking"],
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-white" />,
      title: "Intelligent Invoice Processing",
      description: "AI-powered invoice matching and verification with automated payment processing.",
      benefits: ["AI-powered matching", "Auto-payments", "Audit trails", "Exception handling"],
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-white" />,
      title: "Advanced Analytics & Reporting",
      description: "Comprehensive dashboards with real-time insights and predictive analytics.",
      benefits: ["Real-time dashboards", "Custom reports", "Predictive analytics", "KPI tracking"],
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100",
    },
    {
      icon: <Layers className="w-5 h-5 text-white" />,
      title: "Enterprise Integrations",
      description: "Seamless integration with ERP systems and business applications through robust APIs.",
      benefits: ["ERP integration", "API access", "Pre-built connectors", "Data synchronization"],
      color: "teal",
      gradient: "from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-teal-100",
    },
  ]

  // Enhanced benefits with metrics
  const benefits = [
    {
      icon: <TrendingUp className="w-5 h-5 text-white" />,
      title: "Increase Efficiency",
      description: "Reduce procurement cycle times by up to 70% through intelligent automation.",
      metric: "70%",
      subtext: "faster processing",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 via-cyan-50 to-blue-100",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      title: "Improve Compliance",
      description: "Ensure all purchases adhere to organizational policies with automated compliance checks.",
      metric: "99.9%",
      subtext: "compliance rate",
      color: "emerald",
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 via-green-50 to-emerald-100",
    },
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      title: "Save Time",
      description: "Eliminate manual processes with end-to-end digital workflows and automated approvals.",
      metric: "8 hrs",
      subtext: "saved daily",
      color: "amber",
      gradient: "from-amber-500 to-yellow-500",
      bgGradient: "from-amber-50 via-yellow-50 to-amber-100",
    },
    {
      icon: <Shield className="w-5 h-5 text-white" />,
      title: "Reduce Risk",
      description: "Minimize procurement risks with built-in compliance controls and fraud detection.",
      metric: "95%",
      subtext: "risk reduction",
      color: "red",
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 via-pink-50 to-red-100",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-white" />,
      title: "Cost Savings",
      description: "Achieve significant cost reductions through better vendor negotiations.",
      metric: "$2.4M",
      subtext: "average savings",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 via-emerald-50 to-green-100",
    },
    {
      icon: <Gauge className="w-5 h-5 text-white" />,
      title: "Performance Boost",
      description: "Monitor and improve procurement performance with advanced analytics.",
      metric: "45%",
      subtext: "improvement",
      color: "purple",
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 via-violet-50 to-purple-100",
    },
  ]

  // Enhanced testimonials with more details
  const testimonials = [
    {
      quote:
        "NexusMWI has revolutionized our procurement processes. We've reduced cycle times by 65% and improved vendor relationships significantly.",
      author: "Sarah Banda",
      position: "Chief Procurement Officer",
      company: "Global Tech Inc.",
      rating: 5,
      avatar: "SB",
      industry: "Technology",
      employees: "5,000+",
      savings: "$1.2M annually",
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-50 to-purple-50",
    },
    {
      quote: "The vendor management module has been a game-changer. We can now track performance metrics in real-time.",
      author: "Michael Kaunda",
      position: "Supply Chain Director",
      company: "Nexus Manufacturing",
      rating: 5,
      avatar: "MK",
      industry: "Manufacturing",
      employees: "2,500+",
      savings: "$800K annually",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      quote:
        "Implementation was seamless, and the support team was exceptional. The system pays for itself through efficiency gains alone.",
      author: "Priya Patel",
      position: "CFO",
      company: "Horizon Healthcare",
      rating: 5,
      avatar: "PP",
      industry: "Healthcare",
      employees: "3,200+",
      savings: "$950K annually",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
    },
  ]

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
        "User training resources",
      ],
      limits: "Up to 5 users",
      recommended: false,
      buttonText: "Start Free Trial",
      color: "gray",
      popular: false,
      gradient: "from-gray-500 to-gray-600",
      bgGradient: "from-gray-50 to-gray-100",
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
        "Dedicated onboarding",
      ],
      limits: "Up to 25 users",
      recommended: true,
      buttonText: "Start Free Trial",
      color: "blue",
      popular: true,
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-50 to-purple-50",
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
        "Custom reporting & analytics",
      ],
      limits: "Unlimited users",
      recommended: false,
      buttonText: "Contact Sales",
      color: "purple",
      popular: false,
      gradient: "from-purple-500 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-50",
    },
  ]

  // Integration partners
  const integrations = [
    { name: "SAP", type: "ERP", logo: "SAP", color: "from-blue-600 to-blue-700" },
    { name: "Oracle", type: "ERP", logo: "ORC", color: "from-red-600 to-red-700" },
    { name: "Microsoft", type: "Office Suite", logo: "MS", color: "from-blue-500 to-blue-600" },
    { name: "Salesforce", type: "CRM", logo: "SF", color: "from-blue-400 to-blue-500" },
    { name: "QuickBooks", type: "Accounting", logo: "QB", color: "from-green-600 to-green-700" },
    { name: "NetSuite", type: "ERP", logo: "NS", color: "from-orange-600 to-orange-700" },
  ]

  // Process steps
  const processSteps = [
    {
      step: "01",
      title: "Create Requisition",
      description: "Employees submit procurement requests through intuitive digital forms with automated routing.",
      icon: <FileCheck className="w-5 h-5 text-white" />,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      step: "02",
      title: "Approval Workflow",
      description: "Smart routing ensures requests go to the right approvers based on amount, category, and policies.",
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
    },
    {
      step: "03",
      title: "Vendor Selection",
      description: "Choose from pre-approved vendors or add new ones with comprehensive evaluation criteria.",
      icon: <Users className="w-5 h-5 text-white" />,
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
    },
    {
      step: "04",
      title: "Purchase Order",
      description: "Generate professional POs with automated delivery to suppliers and internal stakeholders.",
      icon: <ShoppingCart className="w-5 h-5 text-white" />,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
  ]

  // Stats for the hero section
  const heroStats = [
    {
      label: "Companies Trust Us",
      value: "500+",
      icon: <Building2 className="w-4 h-4" />,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Transactions Processed",
      value: "$2.8B+",
      icon: <DollarSign className="w-4 h-4" />,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Average Savings",
      value: "32%",
      icon: <TrendingUp className="w-4 h-4" />,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      label: "Customer Satisfaction",
      value: "98%",
      icon: <Star className="w-4 h-4" />,
      gradient: "from-orange-500 to-orange-600",
    },
  ]

  // MetricCard Component
  const MetricCard = ({ title, value, icon: Icon, color, subtitle, trend, gradient, bgGradient }) => (
    <div
      className={`bg-gradient-to-br ${bgGradient || "from-white to-gray-50"} rounded-2xl border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group hover:border-transparent`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-2 rounded-2xl group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r ${gradient || "from-gray-500 to-gray-600"} shadow-lg`}
        >
          <Icon size={16} className="text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-500">+{trend}%</span>
          </div>
        )}
      </div>
      <div className="text-xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  )

  if (showPricing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center">
                <img
                  src="/nexusmwi-logo.png"
                  alt="NexusMWI Logo"
                  className="h-8 w-auto mr-2"
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.nextElementSibling.style.marginLeft = "0"
                  }}
                />
                <span className="text-lg font-bold text-gray-900">NexusMWI</span>
              </div>
              <button
                onClick={() => setShowPricing(false)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-colors text-sm"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Pricing Section */}
        <section className="py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-2xl text-sm font-medium mb-4 shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>Choose Your Perfect Plan</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Transparent Pricing for Every Business
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Transform your procurement process with our flexible pricing options. Start with a 14-day free trial on
                any plan.
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-2xl text-sm font-medium shadow-lg">
                <CheckCircle className="w-4 h-4" />
                <span>Save 20% with annual billing</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-gradient-to-br ${plan.bgGradient} rounded-2xl border-2 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                    plan.recommended
                      ? "border-transparent shadow-xl scale-105 ring-4 ring-blue-100"
                      : "border-gray-200 hover:border-transparent"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span
                        className={`bg-gradient-to-r ${plan.gradient} text-white px-4 py-1.5 rounded-2xl text-sm font-medium shadow-lg`}
                      >
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <span className="text-white font-bold text-xl">{plan.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{plan.description}</p>
                    <div className="mb-4">
                      {typeof plan.price === "number" ? (
                        <div>
                          <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                          <span className="text-gray-600 ml-2 text-sm">{plan.period}</span>
                          <div className="text-sm text-gray-500 mt-1">{plan.limits}</div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                          <div className="text-sm text-gray-500 mt-1">{plan.limits}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-4 rounded-2xl font-medium transition-all duration-300 text-sm shadow-lg hover:shadow-xl ${
                      plan.recommended
                        ? `bg-gradient-to-r ${plan.gradient} text-white hover:scale-105`
                        : "bg-gray-900 text-white hover:bg-gray-800 hover:scale-105"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: "Can I change plans anytime?",
                    answer:
                      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.",
                  },
                  {
                    question: "Is there a setup fee?",
                    answer:
                      "No setup fees for Starter and Professional plans. Enterprise plans may include implementation services.",
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer:
                      "We accept all major credit cards, bank transfers, and can arrange invoice billing for Enterprise customers.",
                  },
                  {
                    question: "Do you offer discounts for annual payments?",
                    answer:
                      "Yes, save 20% when you pay annually. We also offer multi-year discounts for Enterprise customers.",
                  },
                  {
                    question: "What's included in the free trial?",
                    answer:
                      "The 14-day free trial includes full access to all features of your chosen plan with dedicated onboarding support.",
                  },
                  {
                    question: "How does billing work?",
                    answer:
                      "Billing is monthly or annual based on your preference. You'll receive invoices via email with secure payment processing.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header/Navigation */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200" : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <img
                src="/nexusmwi-logo.png"
                alt="NexusMWI Logo"
                className="h-8 w-auto mr-2 transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.style.display = "none"
                  e.target.nextElementSibling.style.marginLeft = "0"
                }}
              />
              <span className="text-lg font-bold text-gray-900">NexusMWI</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="font-medium text-gray-600 hover:text-blue-600 transition-colors text-sm">
                Features
              </a>
              <a href="#benefits" className="font-medium text-gray-600 hover:text-blue-600 transition-colors text-sm">
                Benefits
              </a>
              <a href="#process" className="font-medium text-gray-600 hover:text-blue-600 transition-colors text-sm">
                How it Works
              </a>
              <button
                onClick={() => setShowPricing(true)}
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Pricing
              </button>
              <a
                href="#testimonials"
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Testimonials
              </a>
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm">
                Login
              </a>
              <a
                href="/beta"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm"
              >
                Get Started
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden focus:outline-none p-2 rounded-2xl hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="text-gray-900 w-5 h-5" /> : <Menu className="text-gray-900 w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden bg-white border-t border-gray-200 py-3 shadow-lg">
              <div className="flex flex-col space-y-2">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Features
                </a>
                <a
                  href="#benefits"
                  className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Benefits
                </a>
                <a
                  href="#process"
                  className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                >
                  How it Works
                </a>
                <button
                  onClick={() => setShowPricing(true)}
                  className="text-left text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Pricing
                </button>
                <a
                  href="#testimonials"
                  className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Testimonials
                </a>
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded-2xl hover:bg-blue-50 transition-colors text-sm"
                >
                  Login
                </a>
                <a
                  href="/beta"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2.5 px-3 rounded-2xl text-center mx-3 transition-all duration-300 hover:shadow-lg text-sm"
                >
                  Get Started
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-10 md:pt-24 md:pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-200 rounded-full opacity-20 blur-3xl -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-200 rounded-full opacity-20 blur-3xl translate-x-20 translate-y-20"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2 max-w-xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Transform Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">
                  Procurement
                </span>
                Process
              </h1>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A comprehensive cloud-based solution that streamlines requisitions, vendor management, purchase orders,
                and invoice processing for modern enterprises.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <a
                  href="/beta"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 group text-sm"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <button className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-medium py-3 px-6 rounded-2xl transition-all duration-300 text-sm">
                  <PlayCircle className="w-4 h-4" />
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs">14-day free trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs">No credit card required</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs">Cancel anytime</span>
                </div>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-2 gap-3">
                {heroStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-md`}>
                        <div className="text-white">{stat.icon}</div>
                      </div>
                      <div className="text-base font-bold text-gray-900">{stat.value}</div>
                    </div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 max-w-lg">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <img
                          src="/nexusmwi-logo.png"
                          alt="NexusMWI Logo"
                          className="h-5 w-auto opacity-80"
                          onError={(e) => {
                            e.target.style.display = "none"
                          }}
                        />
                        <h3 className="font-semibold text-sm">Procurement Dashboard</h3>
                      </div>
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xl font-bold">$2.4M</div>
                        <div className="text-blue-100 text-xs">Total Savings</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">94%</div>
                        <div className="text-blue-100 text-xs">Efficiency</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">Purchase Order #1234</span>
                      </div>
                      <span className="text-emerald-600 font-medium text-xs bg-emerald-100 px-2 py-1 rounded-2xl">
                        Approved
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">Vendor Review</span>
                      </div>
                      <span className="text-blue-600 font-medium text-xs bg-blue-100 px-2 py-1 rounded-2xl">
                        Pending
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-200">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-md">
                          <FileText className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">Invoice Processing</span>
                      </div>
                      <span className="text-purple-600 font-medium text-xs bg-purple-100 px-2 py-1 rounded-2xl">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating stats */}
                <div
                  ref={trustSectionRef}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-3 transition-all duration-700"
                  style={{
                    transform: counterStarted ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
                    opacity: counterStarted ? 1 : 0,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{companyCount}+</div>
                      <div className="text-xs text-gray-500 font-medium">Companies Trust Us</div>
                    </div>
                  </div>
                </div>

                {/* Additional floating element */}
                <div
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-3 text-white transition-all duration-700 delay-300"
                  style={{
                    transform: counterStarted ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.9)",
                    opacity: counterStarted ? 1 : 0,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">99.9% Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Proven Results Across Industries</h2>
            <p className="text-gray-600 text-sm">
              Join leading organizations that have transformed their procurement processes with measurable results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <MetricCard
              title="Uptime Reliability"
              value="99.9%"
              icon={Shield}
              color="emerald"
              trend={2}
              subtitle="Always available"
              gradient="from-emerald-500 to-green-500"
              bgGradient="from-emerald-50 to-green-50"
            />
            <MetricCard
              title="Cost Reduction"
              value="30%"
              icon={DollarSign}
              color="blue"
              trend={12}
              subtitle="Average savings"
              gradient="from-blue-500 to-cyan-500"
              bgGradient="from-blue-50 to-cyan-50"
            />
            <MetricCard
              title="Faster Processing"
              value="65%"
              icon={Zap}
              color="purple"
              trend={18}
              subtitle="Improved speed"
              gradient="from-purple-500 to-violet-500"
              bgGradient="from-purple-50 to-violet-50"
            />
            <MetricCard
              title="Customer Rating"
              value="4.9/5"
              icon={Star}
              color="orange"
              subtitle="User satisfaction"
              gradient="from-orange-500 to-red-500"
              bgGradient="from-orange-50 to-red-50"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="process" className="py-10 bg-gradient-to-br from-gray-50 to-blue-50" data-animate>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-2xl text-sm font-medium mb-4 shadow-lg">
              <Gauge className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">How NexusMWI Works</h2>
            <p className="text-lg text-gray-600">
              Our streamlined process makes procurement management effortless, from requisition to payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  transform: isVisible[index] ? "translateY(0)" : "translateY(30px)",
                  opacity: isVisible[index] ? 1 : 0,
                  transitionDelay: `${index * 200}ms`,
                }}
              >
                <div
                  className={`bg-gradient-to-br ${step.bgGradient} rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group-hover:border-transparent`}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <span className="text-white font-bold text-sm">{step.step}</span>
                  </div>
                  <div
                    className={`mb-3 flex justify-center p-2 rounded-2xl bg-gradient-to-r ${step.gradient} w-fit mx-auto group-hover:scale-110 transition-transform shadow-md`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 bg-white" data-animate>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-2xl text-sm font-medium mb-4 shadow-lg">
              <Settings className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Everything You Need in One Platform</h2>
            <p className="text-lg text-gray-600">
              Our comprehensive solution covers the entire procurement lifecycle with advanced automation and
              intelligent insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.bgGradient} rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group hover:border-transparent`}
                style={{
                  transform: counterStarted ? "translateY(0)" : "translateY(30px)",
                  opacity: counterStarted ? 1 : 0,
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div
                  className={`p-3 rounded-2xl mb-4 w-fit group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r ${feature.gradient} shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">{feature.description}</p>

                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
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
      <section id="benefits" className="py-10 bg-gradient-to-br from-blue-50 to-purple-50" data-animate>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-2 rounded-2xl text-sm font-medium mb-4 shadow-lg">
              <Target className="w-4 h-4" />
              <span>Proven Results</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Measurable Business Impact</h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Our procurement system delivers tangible business benefits that directly impact your bottom line and
              operational efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${benefit.bgGradient} rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group hover:border-transparent`}
                style={{
                  transform: isVisible[index] ? "translateY(0)" : "translateY(30px)",
                  opacity: isVisible[index] ? 1 : 0,
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r ${benefit.gradient} shadow-lg`}
                  >
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">{benefit.title}</h3>
                  </div>
                </div>

                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{benefit.metric}</div>
                  <div className="text-sm text-gray-500 font-medium">{benefit.subtext}</div>
                </div>

                <p className="text-gray-600 leading-relaxed text-center text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-10 bg-white" data-animate>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-2xl text-sm font-medium mb-4 shadow-lg">
              <Layers className="w-4 h-4" />
              <span>Seamless Integrations</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Connect with Your Existing Tools</h2>
            <p className="text-lg text-gray-600">
              NexusMWI integrates seamlessly with your existing business systems, ensuring a smooth transition and
              unified workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-gray-200 hover:border-transparent"
                style={{
                  opacity: counterStarted ? 1 : 0,
                  transform: counterStarted ? "scale(1)" : "scale(0.9)",
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${integration.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <span className="text-sm font-bold text-white">{integration.logo}</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm text-center">{integration.name}</p>
                <p className="text-xs text-gray-500 text-center">{integration.type}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4 text-sm">Need a custom integration? Our API makes it possible.</p>
            <a
              href="/integrations"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-2xl hover:from-gray-900 hover:to-black transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm"
            >
              View All Integrations
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 bg-gradient-to-br from-gray-50 to-blue-50" data-animate>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Trusted By Leading Organizations</h2>
            <p className="text-lg text-gray-600">
              Join over <span className="text-blue-600 font-bold">{companyCount}+</span> companies that trust our
              procurement solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-5xl mx-auto">
            {companyLogos.map((company, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-3 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group hover:border-transparent"
                style={{
                  opacity: counterStarted ? 1 : 0,
                  transform: counterStarted ? "scale(1)" : "scale(0.9)",
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${company.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-md`}
                >
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
      <section
        id="testimonials"
        className="py-10 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden"
        data-animate
      >
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-16 translate-y-16"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-medium mb-4 shadow-lg">
              <Award className="w-4 h-4" />
              <span>Client Success Stories</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-lg text-blue-100">
              Join hundreds of satisfied organizations that have transformed their procurement process with measurable
              results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${testimonial.bgGradient} rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border border-white/20`}
                style={{
                  opacity: counterStarted ? 1 : 0,
                  transform: counterStarted ? "translateY(0)" : "translateY(30px)",
                  transitionDelay: `${index * 200}ms`,
                }}
              >
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 italic mb-4 leading-relaxed text-sm">"{testimonial.quote}"</p>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.position}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Industry</p>
                      <p className="font-medium text-gray-900 text-sm">{testimonial.industry}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Employees</p>
                      <p className="font-medium text-gray-900 text-sm">{testimonial.employees}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 text-xs">Annual Savings</p>
                      <p className="font-medium text-emerald-600 text-sm">{testimonial.savings}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-white relative overflow-hidden" data-animate>
        <div className="absolute top-0 left-0 w-24 h-24 bg-blue-100 rounded-full opacity-70 blur-3xl -translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 rounded-full opacity-70 blur-3xl translate-x-16 translate-y-16"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-2xl text-sm font-medium mb-6 hover:scale-105 transition-transform shadow-lg">
              <Zap className="w-4 h-4" />
              <span>Limited Time: 20% Off Annual Plans</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Procurement Process?
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
              Start your 14-day free trial today or schedule a personalized demo with our product specialists to see how
              NexusMWI can revolutionize your procurement operations.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
              <a
                href="/beta"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 group text-sm"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={() => setShowPricing(true)}
                className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50 font-medium py-3 px-6 rounded-2xl transition-all duration-300 group text-sm"
              >
                View Pricing
                <DollarSign className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
              <a
                href="/demo"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 group text-sm"
              >
                Schedule Demo
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-xs">No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-xs">Easy setup in minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-xs">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-xs">Dedicated support</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 max-w-2xl mx-auto border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900 mb-1">500+</div>
                  <div className="text-sm text-gray-600">Companies served</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 mb-1">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime guarantee</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Expert support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img
                  src="/nexusmwi-logo.png"
                  alt="NexusMWI Logo"
                  className="h-6 w-auto mr-2 opacity-80"
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.nextElementSibling.style.marginLeft = "0"
                  }}
                />
                <span className="text-xl font-bold">NexusMWI</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed max-w-md text-sm">
                Streamlining procurement processes for modern enterprises with intelligent automation, comprehensive
                analytics, and seamless integrations. Transform your procurement operations today.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.015-.628.961-.689 1.8-1.56 2.46-2.548z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setShowPricing(true)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <a href="/integrations" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="/api" className="text-gray-400 hover:text-white transition-colors text-sm">
                    API
                  </a>
                </li>
                <li>
                  <a href="/security" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Security
                  </a>
                </li>
                <li>
                  <a href="/mobile" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/case-studies" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="/webinars" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="/downloads" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Downloads
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/partners" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="/press" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Press
                  </a>
                </li>
                <li>
                  <a href="/investors" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Investors
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-3 md:mb-0 text-sm">
                © {new Date().getFullYear()} NexusMWI. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="/cookie-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cookie Policy
                </a>
                <a href="/gdpr" className="text-gray-400 hover:text-white transition-colors text-sm">
                  GDPR
                </a>
                <a href="/accessibility" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
