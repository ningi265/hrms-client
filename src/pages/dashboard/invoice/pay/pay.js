import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  DollarSign,
  User,
  Calendar,
  Hash,
  Info,
  ArrowRight,
  X,
  Package,
  FileText,
  Building,
  Zap,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../authcontext/authcontext";

export default function PaymentPage() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { invoice: initialInvoice } = location.state || {};

  const [invoice, setInvoice] = useState(initialInvoice);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [cardType, setCardType] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const token = localStorage.getItem("token");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Detect card type
  const detectCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6011/.test(cleaned)) return 'discover';
    return '';
  };

  // Format card number with spacing and detection
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const type = detectCardType(cleaned);
    setCardType(type);
    
    let formatted = cleaned;
    if (type === 'amex') {
      formatted = cleaned.replace(/(.{4})(.{6})(.{5})/g, '$1 $2 $3');
    } else {
      formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    }
    return formatted.slice(0, type === 'amex' ? 17 : 19);
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch(name) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        break;
      case 'cvv':
        formattedValue = value.replace(/\D/g, '').slice(0, cardType === 'amex' ? 4 : 3);
        break;
      case 'cardHolder':
        formattedValue = value.toUpperCase();
        break;
    }

    setPaymentDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handlePaymentSubmit = async () => {
    if (!invoice || !token) {
      setError("Invalid invoice or session. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `${backendUrl}/api/invoices/${invoice._id}/status/pay`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paymentDetails),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (data.message === "Invalid or expired token") {
          setSuccessMessage("Your session has expired. Please log in again.");
          logout();
          return;
        }
        throw new Error(data.message || "Failed to process payment");
      }

      setSuccessMessage("Payment processed successfully!");
      setIsPaymentSuccessful(true);
      setInvoice((prev) => ({ ...prev, status: "paid" }));

      setTimeout(() => {
        navigate("/invoices");
      }, 3000);
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const isFormValid = paymentDetails.cardNumber.length >= 15 && 
                     paymentDetails.expiryDate.length === 5 && 
                     paymentDetails.cvv.length >= 3 &&
                     paymentDetails.cardHolder.length >= 2;

  const getCardIcon = () => {
    switch(cardType) {
      case 'visa':
        return <div className="text-blue-600 font-bold text-sm">VISA</div>;
      case 'mastercard':
        return <div className="text-red-600 font-bold text-sm">MC</div>;
      case 'amex':
        return <div className="text-green-600 font-bold text-sm">AMEX</div>;
      case 'discover':
        return <div className="text-orange-600 font-bold text-sm">DISC</div>;
      default:
        return <CreditCard size={20} className="text-gray-400" />;
    }
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">No invoice data found. Please go back and try again.</p>
          <button
            onClick={() => navigate("/invoices")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Invoices
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
             
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
                    <CreditCard size={32} />
                  </div>
                  Secure Payment
                </h1>
                <p className="text-gray-500 text-lg mt-2">
                  Complete your payment securely
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200">
                <Shield size={16} />
                <span className="text-sm font-medium">256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-5 gap-8"
        >
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Package size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Payment Summary</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Recipient</span>
                  <span className="font-semibold text-gray-900">{invoice.vendor?.name}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Invoice Number</span>
                  <span className="font-mono font-semibold text-gray-900">{invoice.invoiceNumber}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    invoice.status === 'paid' 
                      ? 'text-green-700 bg-green-50 border-green-200'
                      : 'text-blue-700 bg-blue-50 border-blue-200'
                  }`}>
                    {invoice.status === 'paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    <span className="ml-2 capitalize">{invoice.status}</span>
                  </span>
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(invoice.amountDue)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-semibold text-gray-900">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(invoice.amountDue)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Info size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Secure Transaction</h4>
                    <p className="text-blue-800 text-sm">
                      Your payment is protected by industry-standard encryption and security measures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {!isPaymentSuccessful ? (
                <motion.div
                  key="payment-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <CreditCard size={20} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
                  </div>

                  {/* Success/Error Messages */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3 mb-6"
                      >
                        <AlertCircle size={20} />
                        <span>{error}</span>
                        <button
                          onClick={() => setError("")}
                          className="ml-auto p-1 hover:bg-red-100 rounded"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-6">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <CreditCard size={16} />
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentDetails.cardNumber}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('cardNumber')}
                          onBlur={() => setFocusedField('')}
                          placeholder="1234 5678 9012 3456"
                          disabled={isProcessing}
                          className={`w-full px-4 py-4 border rounded-xl transition-all duration-200 ${
                            focusedField === 'cardNumber'
                              ? 'border-green-500 ring-2 ring-green-500/20 bg-green-50/30'
                              : 'border-gray-300 hover:border-gray-400'
                          } focus:outline-none bg-white/80`}
                        />
                        <div className="absolute right-4 top-4">
                          {getCardIcon()}
                        </div>
                      </div>
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Calendar size={16} />
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentDetails.expiryDate}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('expiryDate')}
                          onBlur={() => setFocusedField('')}
                          placeholder="MM/YY"
                          disabled={isProcessing}
                          className={`w-full px-4 py-4 border rounded-xl transition-all duration-200 ${
                            focusedField === 'expiryDate'
                              ? 'border-green-500 ring-2 ring-green-500/20 bg-green-50/30'
                              : 'border-gray-300 hover:border-gray-400'
                          } focus:outline-none bg-white/80`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Lock size={16} />
                          CVV
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cvv"
                            value={paymentDetails.cvv}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('cvv')}
                            onBlur={() => setFocusedField('')}
                            placeholder="123"
                            disabled={isProcessing}
                            className={`w-full px-4 py-4 border rounded-xl transition-all duration-200 ${
                              focusedField === 'cvv'
                                ? 'border-green-500 ring-2 ring-green-500/20 bg-green-50/30'
                                : 'border-gray-300 hover:border-gray-400'
                            } focus:outline-none bg-white/80`}
                          />
                          <div className="absolute right-4 top-4">
                            <Info size={16} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <User size={16} />
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardHolder"
                        value={paymentDetails.cardHolder}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('cardHolder')}
                        onBlur={() => setFocusedField('')}
                        placeholder="JOHN DOE"
                        disabled={isProcessing}
                        className={`w-full px-4 py-4 border rounded-xl transition-all duration-200 ${
                          focusedField === 'cardHolder'
                            ? 'border-green-500 ring-2 ring-green-500/20 bg-green-50/30'
                            : 'border-gray-300 hover:border-gray-400'
                        } focus:outline-none bg-white/80`}
                      />
                    </div>

                    {/* Payment Button */}
                    <div className="pt-6">
                      <button
                        onClick={handlePaymentSubmit}
                        disabled={isProcessing || !isFormValid}
                        className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Lock size={20} />
                            Pay {formatCurrency(invoice.amountDue)}
                            <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Security Notice */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Shield size={16} className="text-green-500" />
                        <span>Your payment information is encrypted and secure</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-xl text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle size={40} className="text-green-600" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Payment Successful!
                  </h2>
                  
                  <p className="text-gray-600 mb-2 text-lg">
                    Your payment of <span className="font-bold text-gray-900">{formatCurrency(invoice.amountDue)}</span> has been processed successfully.
                  </p>
                  
                  <p className="text-gray-500 mb-8">
                    Invoice #{invoice.invoiceNumber} is now marked as paid.
                  </p>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Zap size={16} className="text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-green-900 mb-1">Transaction Complete</h4>
                        <p className="text-green-800 text-sm">
                          A payment confirmation has been sent to all relevant parties. 
                          You will be redirected to the invoices page shortly.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full"></div>
                    <span>Redirecting to invoices...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Footer */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                Terms of Service
              </button>
              <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                Privacy Policy
              </button>
              <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                Support
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Powered by</span>
              <span className="text-sm font-semibold text-blue-600">SecurePay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-green-50/90 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <span className="font-medium">{successMessage}</span>
                <button
                  onClick={() => setSuccessMessage("")}
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}