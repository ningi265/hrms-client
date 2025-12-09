import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

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
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Please read these terms carefully before using our service. By accessing or using our platform, 
              you agree to be bound by these terms.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <a href="#acceptance" className="text-blue-600 hover:text-blue-800 transition duration-150">1. Acceptance of Terms</a>
              <a href="#description" className="text-blue-600 hover:text-blue-800 transition duration-150">2. Description of Service</a>
              <a href="#eligibility" className="text-blue-600 hover:text-blue-800 transition duration-150">3. Eligibility</a>
              <a href="#accounts" className="text-blue-600 hover:text-blue-800 transition duration-150">4. User Accounts</a>
              <a href="#conduct" className="text-blue-600 hover:text-blue-800 transition duration-150">5. User Conduct</a>
              <a href="#content" className="text-blue-600 hover:text-blue-800 transition duration-150">6. Content and Intellectual Property</a>
              <a href="#privacy" className="text-blue-600 hover:text-blue-800 transition duration-150">7. Privacy</a>
              <a href="#payments" className="text-blue-600 hover:text-blue-800 transition duration-150">8. Payments and Billing</a>
              <a href="#termination" className="text-blue-600 hover:text-blue-800 transition duration-150">9. Termination</a>
              <a href="#disclaimers" className="text-blue-600 hover:text-blue-800 transition duration-150">10. Disclaimers</a>
              <a href="#limitation" className="text-blue-600 hover:text-blue-800 transition duration-150">11. Limitation of Liability</a>
              <a href="#changes" className="text-blue-600 hover:text-blue-800 transition duration-150">12. Changes to Terms</a>
            </div>
          </div>

          {/* Terms Content */}
          <div className="px-8 py-8 space-y-8">
            {/* Section 1 */}
            <section id="acceptance">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                1. Acceptance of Terms
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing and using this website and service (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you and our company regarding your use of the Service. 
                  Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="description">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                2. Description of Service
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our Service provides [describe your service here]. We reserve the right to modify, suspend, or discontinue the Service 
                  (or any part or content thereof) at any time with or without notice to you.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access to our platform and its features</li>
                  <li>User account creation and management</li>
                  <li>Data storage and processing capabilities</li>
                  <li>Customer support services</li>
                  <li>Regular updates and improvements</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="eligibility">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                3. Eligibility
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>You are at least 18 years of age</li>
                  <li>You have the legal capacity to enter into this agreement</li>
                  <li>Your use of the Service will not violate any applicable law or regulation</li>
                  <li>All information you provide is accurate and truthful</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="accounts">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                4. User Accounts
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                  You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Account Security</h4>
                  <p className="text-blue-800 text-sm">
                    You agree to immediately notify us of any unauthorized use of your account or any other breach of security. 
                    We will not be liable for any loss or damage arising from your failure to comply with this security obligation.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="conduct">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                5. User Conduct
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Violate any local, state, national, or international law or regulation</li>
                  <li>Transmit or procure the sending of any advertising or promotional material without our consent</li>
                  <li>Impersonate or attempt to impersonate another person or entity</li>
                  <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                  <li>Use any robot, spider, or other automatic device to access the Service</li>
                  <li>Introduce any viruses, trojan horses, worms, logic bombs, or other malicious material</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section id="content">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                6. Content and Intellectual Property
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors. 
                  The Service is protected by copyright, trademark, and other laws.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Your Content</h4>
                    <p className="text-gray-700 text-sm">
                      You retain rights to any content you submit, post, or display on or through the Service. 
                      By posting content, you grant us a worldwide license to use, modify, and distribute your content.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Our Content</h4>
                    <p className="text-gray-700 text-sm">
                      All content provided by us is protected by intellectual property laws. 
                      You may not reproduce, distribute, or create derivative works without our permission.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="privacy">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                7. Privacy
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                  to understand our practices.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>Privacy Policy:</strong> Our Privacy Policy explains how we collect, use, and protect your information. 
                    By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="payments">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                8. Payments and Billing
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you purchase any paid services, you agree to pay all fees and charges associated with your account. 
                  All fees are non-refundable unless otherwise specified.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Payment is due upon subscription or purchase</li>
                  <li>Automatic renewals may apply to subscription services</li>
                  <li>You can cancel subscriptions through your account settings</li>
                  <li>Refund policies are outlined in our separate refund policy</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section id="termination">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                9. Termination
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, 
                  under our sole discretion, for any reason whatsoever including breach of the Terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, 
                  you may simply discontinue using the Service or contact us for account deletion.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="disclaimers">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                10. Disclaimers
              </h2>
              <div className="prose prose-gray max-w-none">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND.
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We disclaim all warranties, whether express or implied, including but not limited to warranties of merchantability, 
                  fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, 
                  timely, secure, or error-free.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="limitation">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                11. Limitation of Liability
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  In no event shall our company, its directors, employees, partners, agents, suppliers, or affiliates be liable for any 
                  indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our total liability to you for all damages shall not exceed the amount paid by you, if any, for accessing the Service.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section id="changes">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                12. Changes to Terms
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                  we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service 
                  after any revisions become effective, you agree to be bound by the revised terms.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: nyasatech@nyasatech.mw</p>
                <p>Phone: +265 (993) 773-578</p>
                <p>Address: 123 Glyn Jones Street, Suite 100, Lilongwe, Area 3</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;