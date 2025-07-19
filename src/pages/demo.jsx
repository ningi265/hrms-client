import React, { useState, useRef, useEffect } from 'react';
import {
  PlayCircle,
  Pause,
  Volume2,
  Maximize,
  ArrowLeft,
  CheckCircle,
  FileText,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  Clock,
  Shield,
  Zap,
  Target,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Book,
  Map,
  Star,
  Download,
  MessageCircle,
  HelpCircle,
  Eye,
  MousePointer,
  Layers,
  Building2,
  DollarSign,
  TrendingUp,
  Award,
  Lightbulb,
  Rocket
} from 'lucide-react';

const DemoPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState('overview');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const videoRef = useRef(null);

  // Platform sections for navigation
  const sections = [
    { id: 'overview', title: 'Platform Overview', icon: Eye },
    { id: 'features', title: 'Key Features', icon: Layers },
    { id: 'workflow', title: 'Workflow Guide', icon: Map },
    { id: 'navigation', title: 'Navigation Tips', icon: MousePointer },
    { id: 'getting-started', title: 'Getting Started', icon: Rocket },
    { id: 'faq', title: 'FAQs', icon: HelpCircle }
  ];

  // Key features with detailed explanations
  const platformFeatures = [
    {
      icon: FileText,
      title: "Requisition Management",
      description: "Create, track, and approve purchase requests with automated workflows",
      details: [
        "Employee-friendly request forms with guided templates",
        "Multi-level approval chains with conditional routing",
        "Real-time status tracking and notifications",
        "Budget validation and spending controls",
        "Integration with accounting systems"
      ],
      color: "blue"
    },
    {
      icon: Users,
      title: "Vendor Management",
      description: "Maintain comprehensive vendor relationships and performance tracking",
      details: [
        "Centralized vendor database with complete profiles",
        "Performance scorecards and KPI tracking",
        "Contract management and renewal alerts",
        "Vendor onboarding and qualification processes",
        "Risk assessment and compliance monitoring"
      ],
      color: "emerald"
    },
    {
      icon: ShoppingCart,
      title: "Purchase Order System",
      description: "Generate professional POs with automated approval workflows",
      details: [
        "One-click PO generation from approved requisitions",
        "Customizable templates and branding",
        "Electronic delivery to vendors",
        "Change order management and tracking",
        "Delivery confirmation and receipt matching"
      ],
      color: "purple"
    },
    {
      icon: Settings,
      title: "Invoice Processing",
      description: "Streamline AP processes with AI-powered invoice matching",
      details: [
        "3-way matching (PO, receipt, invoice)",
        "OCR and automated data extraction",
        "Exception handling and dispute resolution",
        "Payment approval workflows",
        "Integration with payment systems"
      ],
      color: "orange"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Comprehensive insights into procurement performance",
      details: [
        "Real-time dashboards and KPI monitoring",
        "Spend analysis and category insights",
        "Vendor performance reports",
        "Compliance and audit trails",
        "Custom report builder with scheduling"
      ],
      color: "red"
    },
    {
      icon: Shield,
      title: "Compliance & Security",
      description: "Built-in controls to ensure policy adherence and data protection",
      details: [
        "Role-based access controls and permissions",
        "Audit trails for all transactions",
        "Policy enforcement and exception alerts",
        "SOC 2 Type II certified security",
        "GDPR and data privacy compliance"
      ],
      color: "indigo"
    }
  ];

  // Step-by-step onboarding guide
  const onboardingSteps = [
    {
      step: 1,
      title: "Set Up Your Organization",
      description: "Configure your company profile, departments, and basic settings",
      tasks: [
        "Complete company profile information",
        "Add departments and cost centers", 
        "Set up approval hierarchies",
        "Configure notification preferences"
      ],
      estimatedTime: "15 minutes"
    },
    {
      step: 2,
      title: "Add Your Team Members",
      description: "Invite users and assign appropriate roles and permissions",
      tasks: [
        "Invite team members via email",
        "Assign roles (Admin, Manager, Employee, etc.)",
        "Set department and manager relationships",
        "Configure individual permissions"
      ],
      estimatedTime: "20 minutes"
    },
    {
      step: 3,
      title: "Configure Approval Workflows",
      description: "Set up automated approval chains based on amount thresholds",
      tasks: [
        "Define approval limits by role and department",
        "Create conditional approval rules",
        "Set up escalation procedures",
        "Test workflow with sample requisitions"
      ],
      estimatedTime: "25 minutes"
    },
    {
      step: 4,
      title: "Import Vendor Data",
      description: "Add your existing suppliers and their information",
      tasks: [
        "Upload vendor list via CSV import",
        "Complete vendor profiles and contracts",
        "Set preferred vendors by category",
        "Configure vendor performance metrics"
      ],
      estimatedTime: "30 minutes"
    },
    {
      step: 5,
      title: "Create Your First Requisition",
      description: "Walk through the complete procurement process",
      tasks: [
        "Submit a test requisition request",
        "Navigate the approval process",
        "Generate purchase order",
        "Process invoice and payment"
      ],
      estimatedTime: "20 minutes"
    }
  ];

  // Navigation tips and tricks
  const navigationTips = [
    {
      icon: Target,
      title: "Dashboard Shortcuts",
      description: "Quick access to frequently used features",
      tips: [
        "Use the search bar to quickly find any record",
        "Bookmark important reports in your favorites",
        "Customize dashboard widgets for your role",
        "Set up automated alerts for urgent items"
      ]
    },
    {
      icon: Zap,
      title: "Keyboard Shortcuts",
      description: "Speed up your workflow with hotkeys",
      tips: [
        "Ctrl+N: Create new requisition",
        "Ctrl+F: Global search",
        "Ctrl+D: Go to dashboard",
        "Ctrl+R: Refresh current view"
      ]
    },
    {
      icon: Clock,
      title: "Time-Saving Features",
      description: "Work smarter, not harder",
      tips: [
        "Use templates for recurring purchases",
        "Set up favorite vendors for quick selection",
        "Enable auto-approval for routine items",
        "Use bulk actions for multiple records"
      ]
    }
  ];

  // Frequently asked questions
  const faqs = [
    {
      question: "How long does implementation typically take?",
      answer: "Most organizations are up and running within 2-4 weeks. Our implementation team provides guidance throughout the process, and we offer training sessions to ensure your team is comfortable with the platform."
    },
    {
      question: "Can I integrate with my existing ERP system?",
      answer: "Yes, we offer pre-built integrations with popular ERP systems like SAP, Oracle, QuickBooks, and NetSuite. We also provide APIs for custom integrations if needed."
    },
    {
      question: "What level of customization is available?",
      answer: "The platform is highly configurable. You can customize approval workflows, form fields, reporting templates, and user interfaces to match your organization's specific processes and branding."
    },
    {
      question: "How secure is my data?",
      answer: "We take security seriously with SOC 2 Type II certification, end-to-end encryption, regular security audits, and compliance with GDPR and other data privacy regulations."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer multiple support channels including email, chat, phone support (for enterprise customers), extensive documentation, video tutorials, and regular webinar training sessions."
    },
    {
      question: "Can I try the platform before purchasing?",
      answer: "Absolutely! We offer a 14-day free trial with full access to all features. You can also request a personalized demo to see how the platform fits your specific needs."
    }
  ];

  const toggleStep = (stepNumber) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Platform Overview</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                NexusMWI is a comprehensive procurement management platform that transforms how organizations handle their purchasing processes. From requisition to payment, our solution provides end-to-end automation, compliance controls, and actionable insights.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">70% Faster</h3>
                  <p className="text-sm text-gray-600">Processing time reduction</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">30% Savings</h3>
                  <p className="text-sm text-gray-600">Average cost reduction</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">99.9% Uptime</h3>
                  <p className="text-sm text-gray-600">Reliability guarantee</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">4.9/5 Rating</h3>
                  <p className="text-sm text-gray-600">Customer satisfaction</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose NexusMWI?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-3">Intelligent Automation</h4>
                  <p className="text-gray-600">AI-powered workflows reduce manual tasks and eliminate bottlenecks in your procurement process.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-3">Enterprise Ready</h4>
                  <p className="text-gray-600">Built for scale with enterprise-grade security, compliance features, and unlimited user capacity.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-3">Proven Results</h4>
                  <p className="text-gray-600">Trusted by 500+ organizations worldwide with measurable ROI and process improvements.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Feature Set</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every tool you need to manage your procurement process efficiently, from request to payment.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {platformFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${
                      feature.color === 'blue' ? 'bg-blue-100' :
                      feature.color === 'emerald' ? 'bg-emerald-100' :
                      feature.color === 'purple' ? 'bg-purple-100' :
                      feature.color === 'orange' ? 'bg-orange-100' :
                      feature.color === 'red' ? 'bg-red-100' :
                      'bg-indigo-100'
                    }`}>
                      <feature.icon className={`w-6 h-6 ${
                        feature.color === 'blue' ? 'text-blue-600' :
                        feature.color === 'emerald' ? 'text-emerald-600' :
                        feature.color === 'purple' ? 'text-purple-600' :
                        feature.color === 'orange' ? 'text-orange-600' :
                        feature.color === 'red' ? 'text-red-600' :
                        'text-indigo-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'workflow':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Procurement Workflow</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Follow these steps to master the complete procurement process from request to payment.
              </p>
            </div>
            
            <div className="space-y-6">
              {onboardingSteps.map((step, index) => (
                <div 
                  key={step.step} 
                  className={`bg-white rounded-2xl border-2 p-8 transition-all cursor-pointer ${
                    completedSteps.has(step.step) 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleStep(step.step)}
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      completedSteps.has(step.step) 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {completedSteps.has(step.step) ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{step.step}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{step.estimatedTime}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      <div className="space-y-2">
                        {step.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm text-gray-700">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Completed All Steps?</h3>
              <p className="text-gray-600 mb-6">You're now ready to use the platform efficiently! Continue exploring advanced features and customization options.</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Start Using Platform
              </button>
            </div>
          </div>
        );

      case 'navigation':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Navigation Tips & Tricks</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Master these navigation techniques to work more efficiently and get the most out of the platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {navigationTips.map((tip, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <tip.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tip.title}</h3>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {tip.tips.map((tipItem, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{tipItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Need More Help?</h3>
                  <p className="text-gray-600 mb-6">Our support team is here to help you navigate any challenges and optimize your workflow.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Live Chat Support
                    </button>
                    <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      <Book className="w-4 h-4" />
                      View Documentation
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Access Menu</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Create Requisition</span>
                      <span className="text-blue-600 font-mono">Ctrl+N</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Global Search</span>
                      <span className="text-blue-600 font-mono">Ctrl+F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dashboard</span>
                      <span className="text-blue-600 font-mono">Ctrl+D</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refresh View</span>
                      <span className="text-blue-600 font-mono">Ctrl+R</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'getting-started':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Choose your preferred way to begin your procurement transformation journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Free Trial</h3>
                <p className="text-gray-600 mb-6">Try all features for 14 days with no commitment. Perfect for exploring the platform.</p>
                <ul className="text-sm text-gray-700 mb-6 space-y-2">
                  <li>✓ Full feature access</li>
                  <li>✓ No credit card required</li>
                  <li>✓ Email support included</li>
                  <li>✓ Sample data provided</li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Start Free Trial
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 text-center border border-emerald-200">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Guided Demo</h3>
                <p className="text-gray-600 mb-6">Schedule a personalized walkthrough with our product experts.</p>
                <ul className="text-sm text-gray-700 mb-6 space-y-2">
                  <li>✓ 30-minute session</li>
                  <li>✓ Customized to your needs</li>
                  <li>✓ Q&A with expert</li>
                  <li>✓ Implementation guidance</li>
                </ul>
                <button className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                  Schedule Demo
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center border border-purple-200">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Resource Kit</h3>
                <p className="text-gray-600 mb-6">Download our comprehensive implementation guide and best practices.</p>
                <ul className="text-sm text-gray-700 mb-6 space-y-2">
                  <li>✓ Implementation checklist</li>
                  <li>✓ Best practices guide</li>
                  <li>✓ Video tutorials</li>
                  <li>✓ ROI calculator</li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Download Kit
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Implementation Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Week 1</h4>
                  <p className="text-sm text-gray-600">Setup & Configuration</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-emerald-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Week 2</h4>
                  <p className="text-sm text-gray-600">User Training & Onboarding</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Week 3</h4>
                  <p className="text-sm text-gray-600">Testing & Optimization</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Week 4</h4>
                  <p className="text-sm text-gray-600">Go Live & Support</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about our platform and implementation process.
              </p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Still Have Questions?</h3>
              <p className="text-gray-600 mb-6">Our support team is here to help you with any additional questions or concerns.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Contact Support
                </button>
                <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  <Book className="w-4 h-4" />
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Platform Demo & Guide</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      currentSection === section.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed Steps</span>
                    <span className="font-medium">{completedSteps.size}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${(completedSteps.size / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video Section */}
            {currentSection === 'overview' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
                <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-purple-700">
                  {/* Placeholder for actual video embed */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors">
                        <PlayCircle className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Platform Demo Video</h3>
                      <p className="text-blue-100">Watch our 5-minute overview of key features</p>
                    </div>
                  </div>
                  
                  {/* Replace this with actual video embed */}
                  {/* 
                  <iframe 
                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
                    title="Platform Demo"
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                  */}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Complete Platform Walkthrough</h3>
                      <p className="text-sm text-gray-600">5:30 minutes • Updated this week</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Overview</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">Features</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Workflow</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Section Content */}
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;