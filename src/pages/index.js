import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Apartment,
  Description,
  ShoppingCart,
  People,
  CheckCircle,
  TrendingUp,
  AccessTime,
  Security,
  ArrowForward,
  Menu,
  Close
} from "@mui/icons-material";

export default function Home() {
  // For responsive navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [counterStarted, setCounterStarted] = useState(false);
  const [companyCount, setCompanyCount] = useState(0);
  const [logosVisible, setLogosVisible] = useState(false);
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
          setTimeout(() => setLogosVisible(true), 500);
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
      icon: <Description className="text-blue-500 text-4xl mb-4" />, 
      title: "Requisition Management", 
      description: "Streamline employee requests with our intuitive approval workflows and real-time tracking system."
    },
    { 
      icon: <People className="text-green-500 text-4xl mb-4" />, 
      title: "Vendor Management", 
      description: "Build stronger relationships with suppliers through our comprehensive vendor performance analytics."
    },
    { 
      icon: <ShoppingCart className="text-purple-500 text-4xl mb-4" />, 
      title: "Purchase Orders", 
      description: "Generate professional purchase orders with customizable templates and automated approval chains."
    },
    { 
      icon: <Apartment className="text-orange-500 text-4xl mb-4" />, 
      title: "Invoice Processing", 
      description: "Accelerate payment cycles with our AI-powered invoice matching and verification system."
    },
  ];

  // Benefits section
  const benefits = [
    { 
      icon: <TrendingUp className="text-blue-600 text-2xl" />,
      title: "Increase Efficiency",
      description: "Reduce procurement cycle times by up to 70% through automation."
    },
    { 
      icon: <CheckCircle className="text-green-600 text-2xl" />,
      title: "Improve Compliance",
      description: "Ensure all purchases adhere to organizational policies and regulations."
    },
    { 
      icon: <AccessTime className="text-amber-600 text-2xl" />,
      title: "Save Time",
      description: "Eliminate manual processes and paperwork with end-to-end digital workflows."
    },
    { 
      icon: <Security className="text-red-600 text-2xl" />,
      title: "Reduce Risk",
      description: "Minimize procurement risks with built-in compliance and approval controls."
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "This system has transformed our procurement processes, saving us countless hours and reducing errors by 95%.",
      author: "Sarah Banda",
      position: "Procurement Director, Global Tech Inc."
    },
    {
      quote: "The vendor management module has helped us identify our best suppliers and negotiate better terms.",
      author: "Michael Kaunda",
      position: "Supply Chain Manager, Nexus Manufacturing"
    },
    {
      quote: "Implementation was smooth and the ROI was visible within the first quarter. Highly recommended.",
      author: "Priya Patel",
      position: "CFO, Horizon Healthcare"
    }
  ];

  // CSS for animations
  const animationStyles = `
    @keyframes countUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes floatIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes starPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
    
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes rotatePulse {
      0% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(10deg) scale(1.1); }
      100% { transform: rotate(0deg) scale(1); }
    }
    
    .animate-float {
      animation: floatIn 0.6s ease-out forwards;
    }
    
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }
    
    .hover-scale {
      transition: transform 0.3s ease;
    }
    
    .hover-scale:hover {
      transform: scale(1.05);
    }
  `;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <style>{animationStyles}</style>
      {/* Header/Navigation */}
     <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-gray-900 shadow-md py-2" : "bg-transparent py-4"}`}>
  <div className="container mx-auto px-4 md:px-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/hrms-logo.png"
          className="h-20 w-auto mx-auto"
        />
        <span className={`text-xl font-bold ${scrolled ? "text-white" : "text-gray-800"}`}>NYASA SUPPLY CHAIN</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#features" className={`${scrolled ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-blue-600"} font-medium`}>Features</a>
        <a href="#benefits" className={`${scrolled ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-blue-600"} font-medium`}>Benefits</a>
        <a href="#testimonials" className={`${scrolled ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-blue-600"} font-medium`}>Testimonials</a>
        <Link to="/login" className={`${scrolled ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} font-medium`}>Login</Link>
        <Link to="/register" className={`${scrolled ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-700"} text-white font-medium py-2 px-4 rounded-lg transition-colors`}>
          Register
        </Link>
      </nav>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden focus:outline-none" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <Close className={scrolled ? "text-white" : "text-gray-600"} /> : <Menu className={scrolled ? "text-white" : "text-gray-600"} />}
      </button>
    </div>
    
    {/* Mobile Navigation */}
    {mobileMenuOpen && (
      <nav className={`md:hidden ${scrolled ? "bg-gray-800" : "bg-white"} mt-4 py-4 px-2 rounded-lg shadow-lg`}>
        <div className="flex flex-col space-y-4">
          <a href="#features" className={`${scrolled ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-blue-600"} font-medium px-4 py-2`}>Features</a>
          <a href="#benefits" className={`${scrolled ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-blue-600"} font-medium px-4 py-2`}>Benefits</a>
          <a href="#testimonials" className={`${scrolled ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-blue-600"} font-medium px-4 py-2`}>Testimonials</a>
          <Link to="/login" className={`${scrolled ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} font-medium px-4 py-2`}>Login</Link>
          <Link to="/register" className={`${scrolled ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-700"} text-white font-medium py-2 px-4 rounded-lg text-center transition-colors`}>
            Register
          </Link>
        </div>
      </nav>
    )}
  </div>    
</header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Transform Your <span className="text-blue-600">Procurement</span> Process
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                A comprehensive cloud-based solution that streamlines requisitions, vendor management, purchase orders, and invoice processing for modern enterprises.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center">
                  Get Started <ArrowForward className="ml-2" />
                </Link>
                <a href="#demo" className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg text-center transition-colors">
                  Request Demo
                </a>
              </div>
              <div className="mt-8 flex items-center text-gray-500">
                <CheckCircle className="text-green-500 mr-2" />
                <span className="mr-6">No credit card required</span>
                <CheckCircle className="text-green-500 mr-2" />
                <span>14-day free trial</span>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="bg-white p-4 rounded-xl shadow-xl">
                  <img 
                    src="/api/placeholder/600/400" 
                    alt="HRMS Procurement Dashboard" 
                    className="rounded-lg w-full"
                  />
                </div>
                
                {/* Animated trust banner */}
                <div 
                  ref={trustSectionRef}
                  className="absolute -bottom-4 -left-4 bg-blue-600 rounded-lg shadow-lg overflow-hidden transition-all duration-500"
                  style={{ 
                    width: counterStarted ? '280px' : '200px',
                    padding: '16px',
                    transform: counterStarted ? 'translateY(0)' : 'translateY(10px)',
                    opacity: counterStarted ? 1 : 0
                  }}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <div className="text-white text-xl font-bold transition-all duration-1000">
                        {companyCount}+
                      </div>
                      <div className="text-blue-100 text-sm font-medium">
                        companies worldwide
                      </div>
                    </div>
                    <div className="h-8 w-px bg-blue-400 mx-3"></div>
                    <div className="text-white text-sm font-medium">
                      Trust our platform
                    </div>
                  </div>
                </div>
                
                {/* Animated floating company logos
                       <div className="absolute -right-4 -bottom-10">
  <div className="relative h-32 w-32">
    {companyLogos.slice(0, 4).map((company, index) => {
      const size = 40 + (index * 4);
      const angle = index * Math.PI / 2; // 90° per logo
      const distance = 30; // pixels from center
      
      return (
        <div 
          key={company.id || index}
          className={`
            absolute bg-white rounded-full shadow-md 
            flex items-center justify-center 
            transition-all duration-700 ease-in-out
            border border-gray-100
            ${logosVisible ? 'opacity-90' : 'opacity-0'}
          `}
          style={{
            width: size,
            height: size,
            transform: logosVisible 
              ? `translate(
                  ${-distance * Math.cos(angle)}px, 
                  ${-distance * Math.sin(angle)}px
                )` 
              : 'translate(0, 0)',
            transitionDelay: `${index * 150}ms`,
            zIndex: 4 - index
          }}
        >
          <span className="text-xs font-bold text-gray-800">
            {company.name.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    })}
  </div>
</div>
                */}
         
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center transition-all duration-500 hover:transform hover:scale-110">
              <div className="text-blue-600 font-bold text-4xl mb-1">
                <span className="inline-block" 
                  style={{
                    animation: counterStarted ? 'countUp 2s ease-out forwards' : 'none',
                    counterReset: 'count 0',
                    content: 'counter(count)'
                  }}
                >
                  99.9%
                </span>
              </div>
              <div className="text-gray-600 text-sm">Uptime Reliability</div>
            </div>
            
            <div className="flex flex-col items-center transition-all duration-500 hover:transform hover:scale-110">
              <div className="text-blue-600 font-bold text-4xl mb-1">
                <span className="inline-block" 
                  style={{
                    animation: counterStarted ? 'countUp 2s ease-out forwards' : 'none',
                    counterReset: 'count 0',
                    content: 'counter(count)'
                  }}
                >
                  30%
                </span>
              </div>
              <div className="text-gray-600 text-sm">Cost Reduction</div>
            </div>
            
            <div className="flex flex-col items-center transition-all duration-500 hover:transform hover:scale-110">
              <div className="text-blue-600 font-bold text-4xl mb-1">
                <span className="inline-block" 
                  style={{
                    animation: counterStarted ? 'countUp 2s ease-out forwards' : 'none',
                    counterReset: 'count 0',
                    content: 'counter(count)'
                  }}
                >
                  65%
                </span>
              </div>
              <div className="text-gray-600 text-sm">Faster Processing</div>
            </div>
            
            <div className="flex flex-col items-center transition-all duration-500 hover:transform hover:scale-110">
              <div className="text-blue-600 font-bold text-4xl mb-1">
                <span className="inline-block"
                  style={{
                    animation: counterStarted ? 'countUp 2s ease-out forwards' : 'none',
                    counterReset: 'count 0',
                    content: 'counter(count)'
                  }}
                >
                  24/7
                </span>
              </div>
              <div className="text-gray-600 text-sm">Support Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive solution covers the entire procurement lifecycle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 border border-gray-100 flex flex-col items-center text-center"
                style={{
                  transform: counterStarted ? 'translateY(0)' : 'translateY(20px)',
                  opacity: counterStarted ? 1 : 0,
                  transitionDelay: `${index * 150}ms`
                }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose Our Solution?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Our procurement system delivers tangible business benefits that impact your bottom line.
              </p>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-white p-3 rounded-full shadow-md mr-4">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 pl-0 md:pl-10">
              <div className="bg-white p-6 rounded-xl shadow-xl">
                <img 
                  src="/admin-dashboard.png" 
                  alt="Procurement Analytics Dashboard" 
                  className="rounded-lg w-full"
                />
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
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {companyLogos.map((company, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center transition-all duration-700"
                style={{
                  opacity: logosVisible ? 1 : 0,
                  transform: logosVisible ? 'scale(1)' : 'scale(0.8)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <span className="text-xl font-bold text-blue-600">{company.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{company.name}</p>
                    <p className="text-xs text-gray-500">{company.industry}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join hundreds of satisfied organizations that have transformed their procurement process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-500"
                style={{
                  opacity: counterStarted ? 1 : 0,
                  transform: counterStarted ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className="w-5 h-5 text-yellow-400 fill-current" 
                      viewBox="0 0 20 20"
                      style={{
                        animation: counterStarted ? `starPulse 1.5s ease-in-out ${i * 0.2}s` : 'none'
                      }}
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="demo" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-70 transform -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100 rounded-full opacity-70 transform translate-x-24 translate-y-24"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div 
              className="inline-block mb-8 transition-all duration-700"
              style={{
                opacity: counterStarted ? 1 : 0,
                transform: counterStarted ? 'rotate(0deg)' : 'rotate(-10deg)',
                animation: counterStarted ? 'rotatePulse 3s ease-in-out infinite' : 'none'
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full transform scale-110 blur-md opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-medium px-6 py-2 rounded-full">
                  Limited Time Offer: 20% Off Annual Plans
                </div>
              </div>
            </div>
            
            <h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              style={{
                opacity: counterStarted ? 1 : 0,
                transform: counterStarted ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.6s ease-out',
                transitionDelay: '0.2s'
              }}
            >
              Ready to Transform Your Procurement Process?
            </h2>
            
            <p 
              className="text-xl text-gray-600 mb-8"
              style={{
                opacity: counterStarted ? 1 : 0,
                transform: counterStarted ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.6s ease-out',
                transitionDelay: '0.4s'
              }}
            >
              Start your 14-day free trial today or schedule a personalized demo with our product specialists.
            </p>
            
            <div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              style={{
                opacity: counterStarted ? 1 : 0,
                transform: counterStarted ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.6s ease-out',
                transitionDelay: '0.6s'
              }}
            >
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-center transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <a 
                href="#contact" 
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg text-center transition-all duration-300 hover:shadow-md transform hover:scale-105"
              >
                Schedule Demo
              </a>
            </div>
            
            <div 
              className="mt-8 flex flex-wrap justify-center gap-4"
              style={{
                opacity: counterStarted ? 1 : 0,
                transition: 'opacity 0.6s ease-out',
                transitionDelay: '0.8s'
              }}
            >
              <div className="flex items-center text-gray-500">
                <CheckCircle className="text-green-500 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center text-gray-500">
                <CheckCircle className="text-green-500 mr-2" />
                <span>Easy setup in minutes</span>
              </div>
              <div className="flex items-center text-gray-500">
                <CheckCircle className="text-green-500 mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ShoppingCart className="text-blue-400 mr-2 text-2xl" />
                <span className="text-xl font-bold">Nyasa Supply Chain</span>
              </div>
              <p className="text-gray-400 mb-4">
                Streamlining procurement processes for modern enterprises.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.015-.628.961-.689 1.8-1.56 2.46-2.548z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Nyasa Supply Chain. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}