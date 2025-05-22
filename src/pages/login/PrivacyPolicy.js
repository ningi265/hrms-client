import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition duration-150"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </button>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12 text-white">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-green-100 max-w-2xl">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
          </div>

          {/* Quick Summary */}
          <div className="bg-blue-50 border-b border-blue-200 px-8 py-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Privacy at a Glance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Data Protection</h3>
                  <p className="text-blue-700">We use encryption and security measures to protect your data</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Transparency</h3>
                  <p className="text-blue-700">Clear information about what data we collect and why</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Your Control</h3>
                  <p className="text-blue-700">Tools to manage, export, or delete your personal data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <a href="#information-collection" className="text-blue-600 hover:text-blue-800 transition duration-150">1. Information We Collect</a>
              <a href="#information-use" className="text-blue-600 hover:text-blue-800 transition duration-150">2. How We Use Information</a>
              <a href="#information-sharing" className="text-blue-600 hover:text-blue-800 transition duration-150">3. Information Sharing</a>
              <a href="#data-security" className="text-blue-600 hover:text-blue-800 transition duration-150">4. Data Security</a>
              <a href="#cookies" className="text-blue-600 hover:text-blue-800 transition duration-150">5. Cookies and Tracking</a>
              <a href="#third-party" className="text-blue-600 hover:text-blue-800 transition duration-150">6. Third-Party Services</a>
              <a href="#data-retention" className="text-blue-600 hover:text-blue-800 transition duration-150">7. Data Retention</a>
              <a href="#your-rights" className="text-blue-600 hover:text-blue-800 transition duration-150">8. Your Rights</a>
              <a href="#international" className="text-blue-600 hover:text-blue-800 transition duration-150">9. International Transfers</a>
              <a href="#children" className="text-blue-600 hover:text-blue-800 transition duration-150">10. Children's Privacy</a>
              <a href="#changes" className="text-blue-600 hover:text-blue-800 transition duration-150">11. Policy Changes</a>
              <a href="#contact" className="text-blue-600 hover:text-blue-800 transition duration-150">12. Contact Us</a>
            </div>
          </div>

          {/* Privacy Content */}
          <div className="px-8 py-8 space-y-8">
            {/* Section 1 */}
            <section id="information-collection">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                1. Information We Collect
              </h2>
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information You Provide</h3>
                  <p className="text-gray-700 mb-4">
                    We collect information you provide directly to us, such as when you create an account, 
                    make a purchase, or contact us for support.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Account Information</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Name and email address</li>
                        <li>• Username and password</li>
                        <li>• Profile information</li>
                        <li>• Account preferences</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Billing address</li>
                        <li>• Payment method details</li>
                        <li>• Transaction history</li>
                        <li>• Tax information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Automatically Collected Information */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Information Collected Automatically</h3>
                  <p className="text-gray-700 mb-4">
                    We automatically collect certain information when you use our service to improve your experience and our platform.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Usage Data</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Pages visited</li>
                        <li>• Features used</li>
                        <li>• Time spent</li>
                        <li>• Click patterns</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Device Information</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Device type</li>
                        <li>• Operating system</li>
                        <li>• Browser type</li>
                        <li>• Screen resolution</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Network Data</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• IP address</li>
                        <li>• Location data</li>
                        <li>• Connection type</li>
                        <li>• ISP information</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="information-use">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                2. How We Use Information
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We use the information we collect for various purposes, including providing, maintaining, and improving our services.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <h4 className="font-semibold text-green-900 mb-2">Service Provision</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Account creation and management</li>
                        <li>• Processing transactions</li>
                        <li>• Providing customer support</li>
                        <li>• Delivering requested services</li>
                      </ul>
                    </div>
                    
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <h4 className="font-semibold text-blue-900 mb-2">Communication</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Sending service notifications</li>
                        <li>• Responding to inquiries</li>
                        <li>• Marketing communications (with consent)</li>
                        <li>• Important updates and announcements</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                      <h4 className="font-semibold text-purple-900 mb-2">Service Improvement</h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Analytics and usage patterns</li>
                        <li>• Feature development</li>
                        <li>• Performance optimization</li>
                        <li>• Bug fixes and troubleshooting</li>
                      </ul>
                    </div>
                    
                    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <h4 className="font-semibold text-orange-900 mb-2">Legal & Security</h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• Fraud prevention</li>
                        <li>• Legal compliance</li>
                        <li>• Terms enforcement</li>
                        <li>• Security monitoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="information-sharing">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                3. Information Sharing
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                  except in the limited circumstances described below.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-red-900 mb-3">We Never Sell Your Data</h4>
                  <p className="text-red-800 text-sm">
                    We do not and will never sell your personal information to third parties for marketing purposes. 
                    Your data is not a product to us.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                    <p className="text-gray-700 text-sm">
                      We may share information with trusted service providers who assist us in operating our platform, 
                      conducting business, or serving users. These parties are bound by confidentiality agreements.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                    <p className="text-gray-700 text-sm">
                      We may disclose information when required by law, court order, or to protect our rights, 
                      property, or safety, or that of our users or others.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Business Transfers</h4>
                    <p className="text-gray-700 text-sm">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                      as part of the business transaction, subject to appropriate protections.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="data-security">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                4. Data Security
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We implement industry-standard security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Encryption</h4>
                    <p className="text-sm text-gray-600">Data encrypted in transit and at rest using industry standards</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Access Control</h4>
                    <p className="text-sm text-gray-600">Strict access controls and authentication for all systems</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Regular Audits</h4>
                    <p className="text-sm text-gray-600">Continuous monitoring and security assessments</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Important Security Note</h4>
                  <p className="text-yellow-800 text-sm">
                    While we implement strong security measures, no method of transmission over the internet or electronic storage 
                    is 100% secure. We cannot guarantee absolute security, but we continuously work to improve our protections.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="cookies">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                5. Cookies and Tracking Technologies
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We use cookies and similar tracking technologies to enhance your experience and gather information about how you use our service.
                </p>

                <div className="space-y-6">
                  {/* Cookie Types */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Types of Cookies We Use</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <h4 className="font-semibold text-green-900 mb-2">Essential Cookies</h4>
                        <p className="text-sm text-green-800 mb-2">Required for basic website functionality</p>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li>• Authentication</li>
                          <li>• Security</li>
                          <li>• User preferences</li>
                        </ul>
                      </div>
                      
                      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                        <h4 className="font-semibold text-blue-900 mb-2">Analytics Cookies</h4>
                        <p className="text-sm text-blue-800 mb-2">Help us understand how you use our site</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Usage statistics</li>
                          <li>• Performance metrics</li>
                          <li>• Error tracking</li>
                        </ul>
                      </div>
                      
                      <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                        <h4 className="font-semibold text-purple-900 mb-2">Functional Cookies</h4>
                        <p className="text-sm text-purple-800 mb-2">Remember your preferences and settings</p>
                        <ul className="text-xs text-purple-700 space-y-1">
                          <li>• Language settings</li>
                          <li>• Theme preferences</li>
                          <li>• Saved selections</li>
                        </ul>
                      </div>
                      
                      <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                        <h4 className="font-semibold text-orange-900 mb-2">Marketing Cookies</h4>
                        <p className="text-sm text-orange-800 mb-2">Used for targeted advertising (with consent)</p>
                        <ul className="text-xs text-orange-700 space-y-1">
                          <li>• Ad personalization</li>
                          <li>• Campaign tracking</li>
                          <li>• Conversion metrics</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Cookie Management */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Managing Your Cookie Preferences</h3>
                    <p className="text-gray-700 mb-4">
                      You can control cookies through your browser settings or our preference center. 
                      Note that disabling certain cookies may affect website functionality.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition duration-150">
                        Cookie Preferences
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition duration-150">
                        Browser Settings Guide
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="third-party">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                6. Third-Party Services
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We integrate with trusted third-party services to provide you with a better experience. 
                  Each service has its own privacy policy governing their use of your information.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Processing</h4>
                    <p className="text-sm text-gray-600 mb-3">Secure payment handling through certified providers</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Airtel Money</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Tnm Mpamba</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">PayChangu</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
                    <p className="text-sm text-gray-600 mb-3">Understanding user behavior and site performance</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Google Analytics</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Hotjar</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                    <p className="text-sm text-gray-600 mb-3">Email delivery and customer support tools</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">SendGrid</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Intercom</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="data-retention">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                7. Data Retention
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We retain your personal information only as long as necessary to provide our services and fulfill the purposes outlined in this policy.
                </p>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Active Accounts</h4>
                    <p className="text-sm text-gray-700">
                      We retain account information and usage data while your account is active and for a reasonable period thereafter 
                      to provide continued service and support.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Inactive Accounts</h4>
                    <p className="text-sm text-gray-700">
                      Accounts inactive for 2+ years may be scheduled for deletion after appropriate notice. 
                      You can reactivate your account by logging in.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                    <p className="text-sm text-gray-700">
                      Some information may be retained longer to comply with legal obligations, resolve disputes, 
                      or enforce our agreements.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="your-rights">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                8. Your Privacy Rights
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  You have important rights regarding your personal information. We provide tools and processes 
                  to help you exercise these rights easily.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <h4 className="font-semibold text-green-900 mb-2">✓ Access Your Data</h4>
                      <p className="text-sm text-green-800">Request a copy of the personal information we hold about you</p>
                    </div>
                    
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <h4 className="font-semibold text-blue-900 mb-2">✓ Correct Information</h4>
                      <p className="text-sm text-blue-800">Update or correct any inaccurate or incomplete data</p>
                    </div>
                    
                    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                      <h4 className="font-semibold text-purple-900 mb-2">✓ Delete Your Data</h4>
                      <p className="text-sm text-purple-800">Request deletion of your personal information (right to be forgotten)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <h4 className="font-semibold text-orange-900 mb-2">✓ Data Portability</h4>
                      <p className="text-sm text-orange-800">Export your data in a machine-readable format</p>
                    </div>
                    
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h4 className="font-semibold text-red-900 mb-2">✓ Limit Processing</h4>
                      <p className="text-sm text-red-800">Restrict how we process your personal information</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-2">✓ Withdraw Consent</h4>
                      <p className="text-sm text-gray-800">Opt out of marketing communications and optional data processing</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">How to Exercise Your Rights</h4>
                  <p className="text-blue-800 text-sm mb-4">
                    You can exercise most of these rights through your account settings, or by contacting us directly. 
                    We'll respond to your request within 30 days.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition duration-150">
                      Account Settings
                    </button>
                    <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md text-sm hover:bg-blue-50 transition duration-150">
                      Contact Privacy Team
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="international">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                9. International Data Transfers
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We operate globally and may transfer your information to countries other than where you reside. 
                  We ensure appropriate safeguards are in place for international transfers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Transfer Safeguards</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• Standard Contractual Clauses (SCCs)</li>
                      <li>• Adequacy decisions by relevant authorities</li>
                      <li>• Binding Corporate Rules where applicable</li>
                      <li>• Your explicit consent when required</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Data Locations</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Your data may be processed in the following regions:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• United States (primary servers)</li>
                      <li>• European Union (GDPR compliance)</li>
                      <li>• Canada (backup systems)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section id="children">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                10. Children's Privacy
              </h2>
              <div className="prose prose-gray max-w-none">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-red-900 mb-3">Age Restriction</h4>
                  <p className="text-red-800 text-sm">
                    Our service is not intended for children under 18 years of age. We do not knowingly collect 
                    personal information from children under 18.
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  If you are a parent or guardian and believe your child has provided us with personal information, 
                  please contact us immediately. We will take steps to remove such information from our systems.
                </p>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">If We Discover Child Data</h4>
                  <p className="text-blue-800 text-sm">
                    If we become aware that we have collected personal information from a child under 18 without parental consent, 
                    we will take immediate steps to delete that information.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 11 */}
            <section id="changes">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                11. Changes to This Policy
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, 
                  operational, or regulatory reasons.
                </p>

                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">How We Notify You</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Email notification for significant changes</li>
                      <li>• Prominent notice on our website</li>
                      <li>• In-app notifications when you log in</li>
                      <li>• Updated "Last Modified" date at the top</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Your Options</h4>
                    <p className="text-sm text-green-800">
                      If you disagree with changes to this policy, you can close your account. 
                      Continued use of our service after changes indicates acceptance of the updated policy.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 12 - Contact */}
            <section id="contact" className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Contact Us</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Questions?</h3>
                  <p className="text-gray-700 mb-6">
                    If you have any questions about this Privacy Policy or our data practices, 
                    we're here to help. Choose the best way to reach us:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Email Us</h4>
                        <p className="text-sm text-gray-600">nyasatech@nyasatech.mw</p>
                        <p className="text-xs text-gray-500">We respond within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Mail Us</h4>
                        <p className="text-sm text-gray-600">
                          Privacy Team<br />
                          123 Glyn Jones, Suite 100<br />
                          Lilongwe, Area 3
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Phone</h4>
                        <p className="text-sm text-gray-600">+265 (993) 773-578</p>
                        <p className="text-xs text-gray-500">Mon-Fri, 9 AM - 5 PM CAT</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Protection Officer</h3>
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Ishmael Ntenje</h4>
                        <p className="text-sm text-gray-600">Chief Privacy Officer</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      For complex privacy matters or GDPR-related inquiries, you can contact our Data Protection Officer directly.
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> dpo@nyasatech.mw
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Direct Line:</span> +265 (999) 555-640
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left px-4 py-2 bg-white border border-blue-200 rounded-md text-sm text-blue-800 hover:bg-blue-50 transition duration-150">
                        Download My Data
                      </button>
                      <button className="w-full text-left px-4 py-2 bg-white border border-blue-200 rounded-md text-sm text-blue-800 hover:bg-blue-50 transition duration-150">
                        Delete My Account
                      </button>
                      <button className="w-full text-left px-4 py-2 bg-white border border-blue-200 rounded-md text-sm text-blue-800 hover:bg-blue-50 transition duration-150">
                        Update Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Also available in:</span>
                    <div className="flex space-x-3">
                      <button className="text-sm text-blue-600 hover:text-blue-800 transition duration-150">Español</button>
                      <button className="text-sm text-blue-600 hover:text-blue-800 transition duration-150">Français</button>
                      <button className="text-sm text-blue-600 hover:text-blue-800 transition duration-150">Deutsch</button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <a href="/terms-of-service" className="hover:text-gray-700 transition duration-150">Terms of Service</a>
                    <a href="/cookies" className="hover:text-gray-700 transition duration-150">Cookie Policy</a>
                    <a href="/security" className="hover:text-gray-700 transition duration-150">Security</a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        {/* Sticky Footer */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Your Privacy Matters</h3>
                <p className="text-sm text-gray-600">We're committed to protecting your personal information</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition duration-150">
                Privacy Settings
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition duration-150">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;