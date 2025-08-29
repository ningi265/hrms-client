import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  Download, 
  CreditCard, 
  Calendar,
  Sparkles,
  Loader2
} from 'lucide-react';

const BillingSuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get session_id from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, []);

  const handleCheckoutSuccess = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/billing/checkout-success?session_id=${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }

      const data = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanDisplayName = (planName) => {
    return planName.charAt(0).toUpperCase() + planName.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Processing your payment...</h2>
          <p className="text-gray-600">Please wait while we set up your subscription.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Processing Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.href = '/billing'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to Billing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Success Header */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            
            {/* Success Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Successful! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Welcome to your new subscription. Your account has been upgraded successfully.
            </p>
            
            {/* Celebration Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Subscription Activated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Subscription Details</h2>
          </div>
          
          <div className="p-8">
            {subscriptionData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Plan Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-semibold text-blue-600">
                          {getPlanDisplayName(subscriptionData.subscription.plan)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Status:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {subscriptionData.subscription.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Billing Cycle:</span>
                        <span className="font-medium">
                          {subscriptionData.subscription.currentPeriodStart && subscriptionData.subscription.currentPeriodEnd ? 
                            `${formatDate(subscriptionData.subscription.currentPeriodStart)} - ${formatDate(subscriptionData.subscription.currentPeriodEnd)}` 
                            : 'Monthly'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Access Premium Features</p>
                          <p className="text-sm text-gray-600">All premium features are now available in your account</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CreditCard className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Manage Billing</p>
                          <p className="text-sm text-gray-600">Update payment methods and view invoices</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Next Billing Date</p>
                          <p className="text-sm text-gray-600">
                            {subscriptionData.subscription.currentPeriodEnd ? 
                              formatDate(subscriptionData.subscription.currentPeriodEnd) : 
                              'View in billing dashboard'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg hover:shadow-xl group"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => window.location.href = '/billing'}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Manage Subscription
            </button>
          </div>
          
          {/* Receipt Download */}
          <div className="pt-8">
            <p className="text-sm text-gray-600 mb-4">
              A receipt has been sent to your email. You can also download it here:
            </p>
            <button
              onClick={() => {
                // This would typically trigger a receipt download
                alert('Receipt download functionality would be implemented here');
              }}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you get the most out of your new subscription.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/support'}
              className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Visit Help Center
            </button>
            <button
              onClick={() => window.location.href = 'mailto:support@company.com'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSuccessPage;