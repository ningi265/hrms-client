"use client"

import { useState, useEffect, useRef } from "react"
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Check,
  X,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Settings,
  Package,
  FileText,
  DollarSign,
  Truck,
  Calendar,
  Building,
  ShoppingCart,
  Users,
  Target,
  Edit,
  Send,
  Copy,
  History,
  Ban,
  MessageSquare,
  Activity,
  Shield,
  TrendingUp,
  TrendingDown,
  Save,
  CheckCircle,
  MapPin,
  Clock,
  AlertCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Camera,
  Upload,
  Loader,
  Printer,
  FileSpreadsheet
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import * as XLSX from "xlsx";

// LoadingOverlay Component (compact like view_rfqs.js)
const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
        <Loader className="animate-spin w-5 h-5 text-blue-500" />
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
};

// MetricCard Component (compact and rounded like view_rfqs.js)
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : "";
  const valueSize = size === "large" ? "text-2xl" : "text-lg";
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-1">
        <div className={`p-1 rounded-lg ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'amber' ? 'bg-amber-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={14} className={
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'orange' ? 'text-orange-600' :
            color === 'amber' ? 'text-amber-600' :
            color === 'red' ? 'text-red-600' :
            'text-gray-600'
          } />
        </div>
        {trend && (
          <div className="flex items-center gap-0.5">
            {trend > 0 ? (
              <TrendingUp size={10} className="text-emerald-500" />
            ) : (
              <TrendingDown size={10} className="text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`${valueSize} font-bold text-gray-900 mb-0.5`}>
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

// Delivery Status Timeline Component
const DeliveryTimeline = ({ currentStatus, orderDate, estimatedDelivery, isConfirmed }) => {
  const statuses = [
    { key: 'order_confirmed', label: 'Order Confirmed', icon: FileText, date: orderDate },
    { key: 'processing', label: 'Processing', icon: Settings, date: null },
    { key: 'shipped', label: 'Shipped', icon: Truck, date: null },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin, date: null },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle, date: estimatedDelivery },
    { key: 'confirmed', label: 'Receipt Confirmed', icon: Star, date: null }
  ];

  const getCurrentStatusIndex = () => {
    // If delivery is confirmed by customer, show all steps complete
    if (currentStatus?.toLowerCase() === 'confirmed' || isConfirmed) {
      return 5;
    }
    
    switch(currentStatus?.toLowerCase()) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentIndex = getCurrentStatusIndex();

  return (
    <div className="relative">
      {statuses.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = status.icon;

        return (
          <div key={status.key} className="flex items-center mb-6 last:mb-0">
            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              isCompleted 
                ? 'bg-green-500 border-green-500 text-white' 
                : isCurrent
                  ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                  : 'bg-white border-gray-300 text-gray-400'
            }`}>
              <Icon size={20} />
            </div>
            
            {index < statuses.length - 1 && (
              <div className={`absolute left-5 w-0.5 h-16 ${
                index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
              }`} style={{ top: '40px' }} />
            )}
            
            <div className="ml-4 flex-1">
              <h3 className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                {status.label}
              </h3>
              {status.date && (
                <p className="text-sm text-gray-500">
                  {new Date(status.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric", 
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              )}
              {isCurrent && !isCompleted && (
                <p className="text-sm text-blue-600 font-medium">In Progress</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Delivery Tracking Modal Component
const DeliveryTrackingModal = ({ po, isOpen, onClose, onConfirmReceipt }) => {
  if (!isOpen || !po) return null;

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-amber-600 bg-amber-100';
      case 'confirmed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const poNumber = po._id?.slice(-8) || "N/A";
  const vendorName = po.vendor ? `${po.vendor.lastName || ""} ${po.vendor.firstName || ""}`.trim() : "N/A";
  const isDelivered = po.deliveryStatus?.toLowerCase() === 'delivered';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Truck size={24} className="text-blue-500" />
                Track Delivery - PO-{poNumber}
              </h2>
              <p className="text-gray-600 mt-1">Monitor your purchase order delivery status</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 max-h-[75vh] overflow-y-auto">
          {/* Order Summary */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-500" />
              Order Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Purchase Order</p>
                <p className="text-gray-900 font-semibold">PO-{poNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Vendor</p>
                <p className="text-gray-900 font-semibold">{vendorName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-gray-900 font-semibold">MWK {po.totalAmount?.toFixed(0) || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity size={20} className="text-green-500" />
                Current Status
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(po.deliveryStatus)}`}>
                {po.deliveryStatus || 'Processing'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Delivery Progress</h4>
                <DeliveryTimeline 
                  currentStatus={po.deliveryStatus} 
                  orderDate={po.createdAt}
                  estimatedDelivery={po.estimatedDelivery}
                  isConfirmed={po.receivedByCustomer || po.deliveryStatus === "confirmed"}
                />
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{formatDate(po.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">
                        {po.estimatedDelivery ? formatDate(po.estimatedDelivery) : "TBD"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Address:</span>
                      <span className="font-medium">{po.deliveryAddress || "Default Address"}</span>
                    </div>
                    {po.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking Number:</span>
                        <span className="font-medium font-mono text-blue-600">
                          {po.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Confirmation for Delivered Orders */}
                {isDelivered && !po.receivedByCustomer && po.deliveryStatus !== "confirmed" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium text-green-900">Package Delivered!</h4>
                    </div>
                    <p className="text-sm text-green-700 mb-4">
                      Your order has been delivered by the courier. Please confirm receipt of your goods.
                    </p>
                    <button
                      onClick={() => onConfirmReceipt(po._id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      <ThumbsUp size={16} />
                      Confirm Receipt of Goods
                    </button>
                  </div>
                )}

                {/* Already Confirmed */}
                {(po.receivedByCustomer || po.deliveryStatus === "confirmed") && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium text-blue-900">Order Completed!</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      You have confirmed receipt of this order. Thank you for your business!
                    </p>
                    {(po.receivedDate || po.proofOfDelivery?.confirmedAt) && (
                      <p className="text-xs text-blue-600 mt-1">
                        Confirmed on {formatDate(po.receivedDate || po.proofOfDelivery?.confirmedAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-purple-500" />
              Order Items
            </h3>
            <div className="space-y-3">
              {po.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.itemName || item.product}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">MWK {(item.price || 0).toFixed(0)}</p>
                    <p className="text-sm text-gray-600">per unit</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  No items found
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Receipt Confirmation Modal Component
const ReceiptConfirmationModal = ({ po, isOpen, onClose, onConfirm, showNotification }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [hasIssues, setHasIssues] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setFeedback("");
      setHasIssues(false);
      setIssueDescription("");
      setReceivedBy("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !po) return null;

  const handleConfirmReceipt = async () => {
    if (!receivedBy.trim()) {
      showNotification("Please enter who received the delivery", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm({
        poId: po._id,
        rating,
        feedback,
        hasIssues,
        issueDescription,
        receivedBy: receivedBy.trim(),
        receivedDate: new Date()
      });
      onClose();
    } catch (error) {
      console.error("Error confirming receipt:", error);
      showNotification("Failed to confirm receipt. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const poNumber = po._id?.slice(-8) || "N/A";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-8 py-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <CheckCircle size={24} className="text-green-500" />
                Confirm Receipt - PO-{poNumber}
              </h2>
              <p className="text-gray-600 mt-1">Please confirm that you have received your order</p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {/* Completion Status Indicator */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Complete Your Order Confirmation</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Please fill in the required information below and click "Confirm Receipt of Goods" to complete your order.
                </p>
              </div>
            </div>
          </div>
          {/* Order Summary */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-green-500" />
              Order Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Purchase Order</p>
                <p className="text-gray-900 font-semibold">PO-{poNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-gray-900 font-semibold">MWK {po.totalAmount?.toFixed(0) || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rate your experience (1-5 stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 rounded ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                >
                  <Star size={24} className={star <= rating ? 'fill-current' : ''} />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
              </span>
            </div>
          </div>

          {/* Received By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                Received By <span className="text-red-500">*</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Required</span>
              </span>
            </label>
            <input
              type="text"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              placeholder="Enter the name of the person who received the delivery"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                !receivedBy.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {!receivedBy.trim() && (
              <p className="text-red-500 text-xs mt-1">This field is required to confirm receipt</p>
            )}
          </div>

          {/* Feedback */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Feedback (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with this order..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Issues Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="hasIssues"
                checked={hasIssues}
                onChange={(e) => setHasIssues(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="hasIssues" className="text-sm font-medium text-gray-700">
                Report any issues with this delivery
              </label>
            </div>
            
            {hasIssues && (
              <div className="mt-3">
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Please describe any issues you encountered..."
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Confirmation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Confirmation Notice</h4>
                <p className="text-sm text-blue-700">
                  By confirming receipt, you acknowledge that you have received the goods as ordered. 
                  This action will mark the purchase order as completed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReceipt}
              disabled={isSubmitting || !receivedBy.trim()}
              className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Confirming Receipt...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Confirm Receipt of Goods
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Purchase Order Card Component (styled like vendor cards)
const PurchaseOrderCard = ({ po, onMenuClick, showMenuId, onApprove, onReject, actionLoading }) => {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Check size={14} />;
      case "pending":
        return <Package size={14} />;
      case "rejected":
        return <X size={14} />;
      default:
        return <Package size={14} />;
    }
  };

  const getDeliveryStatusColor = (deliveryStatus) => {
    switch (deliveryStatus?.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDeliveryStatusIcon = (deliveryStatus) => {
    switch (deliveryStatus?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle size={14} />;
      case "delivered":
        return <Check size={14} />;
      case "shipped":
        return <Truck size={14} />;
      case "processing":
        return <FileText size={14} />;
      default:
        return <Package size={14} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const vendorName = po.vendor ? `${po.vendor.lastName || ""} ${po.vendor.firstName || ""}`.trim() : "N/A";
  const poNumber = po._id?.slice(-8) || "N/A";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              PO-{poNumber}
            </h4>
            <p className="text-sm text-gray-500">{vendorName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(po.status)}`}>
            {getStatusIcon(po.status)}
            {po.status}
          </span>
          <button
            data-po-id={po._id}
            onClick={() => onMenuClick(po._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            {po.totalAmount?.toFixed(0) || 0}
          </div>
          <div className="text-xs text-gray-500">Amount (MWK)</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <Truck className="w-4 h-4 text-blue-500" />
            {po.deliveryStatus || "Pending"}
          </div>
          <div className="text-xs text-gray-500">Delivery</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Created</span>
          <span className="text-xs font-medium">
            {formatDate(po.createdAt)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Vendor Email</span>
          <span className="text-xs font-medium truncate">{po.vendor?.email || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Items</span>
          <span className="text-xs font-medium">{po.items?.length || 0}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-1">Delivery Status</div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${getDeliveryStatusColor(po.deliveryStatus)}`}>
          {getDeliveryStatusIcon(po.deliveryStatus)}
          {po.deliveryStatus || "Pending"}
        </span>
      </div>

      {(po.receivedByCustomer) && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Customer Receipt</div>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
            <Star size={12} />
            Received by {po.receivedByCustomer || "Customer"}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            Status: {po.status || "Unknown"}
          </span>
        </div>
        <div className="flex gap-1">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Eye size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Edit size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// RFQ Card Component for Modal
const RfqCard = ({ rfq, isSelected, onSelect }) => {
  const getRfqStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'awarded': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const rfqId = rfq._id;
  const hasSelectedVendor = rfq.selectedVendor && rfq.quotes?.length > 0;
  const quote = hasSelectedVendor ? rfq.quotes.find(q => q.vendor === rfq.selectedVendor) : null;
  const rfqNumber = rfq._id?.slice(-8) || "N/A";

  return (
    <div 
      onClick={() => hasSelectedVendor && onSelect(rfqId)}
      className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : hasSelectedVendor 
            ? 'border-gray-200 hover:border-blue-300 hover:shadow-md' 
            : 'border-gray-200 opacity-50 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-50'}`}>
            <FileText className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 line-clamp-1">
              {rfq.itemName || "Untitled RFQ"}
            </h4>
            <p className="text-sm text-gray-500">RFQ-{rfqNumber}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRfqStatusColor(rfq.status || 'open')}`}>
            {rfq.status || 'Open'}
          </span>
          {isSelected && (
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900">
            {rfq.quantity || 0}
          </div>
          <div className="text-xs text-gray-500">Quantity</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900">
            {rfq.quotes?.length || 0}
          </div>
          <div className="text-xs text-gray-500">Quotes</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Created</span>
          <span className="text-xs font-medium">
            {formatDate(rfq.createdAt)}
          </span>
        </div>
        {rfq.deadline && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Deadline</span>
            <span className="text-xs font-medium">
              {formatDate(rfq.deadline)}
            </span>
          </div>
        )}
        {hasSelectedVendor && quote && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Best Quote</span>
            <span className="text-xs font-medium text-green-600">
              MWK {quote.price?.toFixed(0) || "N/A"}
            </span>
          </div>
        )}
      </div>

      {rfq.description && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Description</div>
          <p className="text-xs text-gray-800 line-clamp-2">{rfq.description}</p>
        </div>
      )}

      {!hasSelectedVendor && (
        <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-xs text-yellow-700 font-medium">No vendor selected</p>
        </div>
      )}

      {hasSelectedVendor && quote && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Selected Vendor</span>
            <span className="text-xs font-medium">{rfq.selectedVendor}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showMenuId, setShowMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false);
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfqId, setSelectedRfqId] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  
  // Delivery tracking modal state
  const [showDeliveryTrackingModal, setShowDeliveryTrackingModal] = useState(false);
  const [selectedPOForTracking, setSelectedPOForTracking] = useState(null);
  
  // Receipt confirmation modal state
  const [showReceiptConfirmationModal, setShowReceiptConfirmationModal] = useState(false);
  const [selectedPOForReceipt, setSelectedPOForReceipt] = useState(null);
  
  // New state for RFQ modal
  const [rfqSearchTerm, setRfqSearchTerm] = useState("");
  const [rfqStatusFilter, setRfqStatusFilter] = useState("all");
  
  // Excel import/export and print functionality
  const fileInputRef = useRef(null);
  
  const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;


  useEffect(() => {
   

    const fetchData = async () => {
  try {

    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
    console.log("Fetching from:", `${backendUrl}/api/purchase-orders`);
    
    const poResponse = await fetch(`${backendUrl}/api/purchase-orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("PO Response status:", poResponse.status);
    
    if (!poResponse.ok) {
      const errorData = await poResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${poResponse.status}`);
    }

    const poData = await poResponse.json();
    console.log("Fetched POs:", poData);
    setPurchaseOrders(Array.isArray(poData.data) ? poData.data : []);

    // Repeat similar pattern for RFQs fetch
    const rfqResponse = await fetch(`${backendUrl}/api/rfqs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!rfqResponse.ok) {
      const errorData = await rfqResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${rfqResponse.status}`);
    }

    const rfqData = await rfqResponse.json();
    setRfqs(Array.isArray(rfqData.data) ? rfqData.data : []);

  } catch (error) {
    console.error("Failed to fetch data:", error);
    showNotificationMessage(error.message || "Failed to fetch data", "error");
  } finally {
    setIsLoading(false);
  }
};

    fetchData()
  }, [backendUrl])

  // Filter RFQs for modal
  const filteredRfqs = rfqs
     .filter(() => true)
    .filter((rfq) => {
      // Filter by search term
      return (
        rfq.itemName?.toLowerCase().includes(rfqSearchTerm.toLowerCase()) ||
        rfq.description?.toLowerCase().includes(rfqSearchTerm.toLowerCase()) ||
        rfq._id?.toLowerCase().includes(rfqSearchTerm.toLowerCase()) ||
        false
      );
    })
    .filter((rfq) => {
      // Only show RFQs with selected vendors for PO creation
      return !!rfq.selectedVendor;
    });

  // Filter purchase orders
  const filteredPurchaseOrders = purchaseOrders
    .filter((po) => {
      if (statusFilter === "all") return true
      return po.status === statusFilter
    })
    .filter((po) => {
      return (
        po._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false
      )
    })

  // Calculate stats
  const totalPOs = purchaseOrders?.length || 0
  const approvedPOs = purchaseOrders?.filter((po) => po.status === "approved")?.length || 0
  const pendingPOs = purchaseOrders?.filter((po) => po.status === "pending")?.length || 0
  const totalAmount = purchaseOrders?.reduce((sum, po) => sum + (po.totalAmount || 0), 0) || 0

  const openCreatePOModal = () => {
    setIsCreatePOModalOpen(true)
    // Reset modal state
    setSelectedRfqId("")
    setSelectedQuote(null)
    setRfqSearchTerm("")
    setRfqStatusFilter("open")
  }

  const closeCreatePOModal = () => {
    setIsCreatePOModalOpen(false)
    setSelectedRfqId("")
    setSelectedQuote(null)
    setRfqSearchTerm("")
    setRfqStatusFilter("open")
  }

  const handleRfqSelection = (rfqId) => {
    setSelectedRfqId(rfqId)
    const rfq = rfqs.find((rfq) => rfq._id === rfqId)
    if (rfq && rfq.selectedVendor) {
      const selectedQuote = rfq.quotes.find((quote) => quote.vendor === rfq.selectedVendor)
      setSelectedQuote(selectedQuote)
    }
  }

  const handleCreatePO = async () => {
  if (!selectedRfqId) {
    showNotificationMessage("Please select an RFQ with a selected vendor.", "error");
    return;
  }

  const rfq = rfqs.find((rfq) => rfq._id === selectedRfqId);
  if (!rfq) {
    showNotificationMessage("RFQ not found.", "error");
    return;
  }

  if (!rfq.selectedVendor) {
    showNotificationMessage("This RFQ does not have a selected vendor.", "error");
    return;
  }

  // If you want to auto-pick the quote from the selectedVendor:
  const vendorQuote = rfq.quotes?.find(
    (q) => q.vendor === rfq.selectedVendor._id && q.isValid
  );

  const items = [
    {
      itemName: rfq.itemName,
      product: rfq.itemName,
      quantity: rfq.quantity,
      price: vendorQuote ? vendorQuote.price : 0, // fallback if no quote
    },
  ];

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${backendUrl}/api/purchase-orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rfqId: rfq._id,
        vendorId: rfq.selectedVendor._id, // include vendorId
        items,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      showNotificationMessage("Purchase Order created successfully!", "success");
      setPurchaseOrders([...purchaseOrders, data.po]);
      closeCreatePOModal();
    } else {
      throw new Error(data.message || "Failed to create PO");
    }
  } catch (error) {
    console.error("Error creating PO:", error);
    showNotificationMessage(error.message, "error");
  }
};

  const handleTrackDelivery = (po) => {
    setSelectedPOForTracking(po);
    setShowDeliveryTrackingModal(true);
    setShowMenuId(null);
  }

  const handleConfirmReceipt = (poId) => {
    const po = purchaseOrders.find(p => p._id === poId);
    if (po) {
      setSelectedPOForReceipt(po);
      setShowReceiptConfirmationModal(true);
      setShowDeliveryTrackingModal(false);
    }
  }

  const handleReceiptConfirmation = async (receiptData) => {
    try {
      const token = localStorage.getItem("token");
      
      // Prepare proof of delivery data
      const proofOfDelivery = {
        rating: receiptData.rating,
        feedback: receiptData.feedback,
        hasIssues: receiptData.hasIssues,
        issueDescription: receiptData.issueDescription,
        confirmedAt: receiptData.receivedDate
      };

      // Call the backend API
      const response = await fetch(`${backendUrl}/api/purchase-orders/${receiptData.poId}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          proofOfDelivery: JSON.stringify(proofOfDelivery),
          receivedBy: receiptData.receivedBy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to confirm receipt');
      }

      // Update local state with the returned PO data
      setPurchaseOrders(prev => prev.map(po => 
        po._id === receiptData.poId 
          ? { 
              ...po, 
              deliveryStatus: "confirmed",
              receivedByCustomer: true, 
              receivedDate: receiptData.receivedDate,
              customerRating: receiptData.rating,
              customerFeedback: receiptData.feedback,
              hasIssues: receiptData.hasIssues,
              issueDescription: receiptData.issueDescription,
              receivedBy: receiptData.receivedBy,
              proofOfDelivery: proofOfDelivery
            }
          : po
      ));

      showNotificationMessage("Receipt confirmed successfully! Thank you for your feedback.", "success");
      setShowReceiptConfirmationModal(false);
      setSelectedPOForReceipt(null);
    } catch (error) {
      showNotificationMessage(error.message || "Failed to confirm receipt. Please try again.", "error");
      console.error("Error confirming receipt:", error);
    }
  }

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotificationMessage("PO Number copied to clipboard!", "success");
    setShowMenuId(null);
  };

  const handleApprovePO = async (poId) => {
    setActionLoading(poId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setPurchaseOrders(prev => prev.map(po => 
        po._id === poId ? { ...po, status: "approved" } : po
      ));
      showNotificationMessage("Purchase Order approved successfully!", "success");
    } catch (error) {
      showNotificationMessage("Failed to approve purchase order", "error");
      console.error("Failed to approve PO:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
  };

  const handleRejectPO = async (poId) => {
    setActionLoading(poId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setPurchaseOrders(prev => prev.map(po => 
        po._id === poId ? { ...po, status: "rejected" } : po
      ));
      showNotificationMessage("Purchase Order rejected successfully!", "success");
    } catch (error) {
      showNotificationMessage("Failed to reject purchase order", "error");
      console.error("Failed to reject PO:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    window.location.reload();
  };

  // Excel Export Functionality
  const handleExportToExcel = () => {
    if (!purchaseOrders || purchaseOrders.length === 0) {
      showNotificationMessage("No purchase orders to export", "error");
      return;
    }

    const formatted = purchaseOrders.map((po) => ({
      "PO Number": po._id?.slice(-8) || "N/A",
      "Vendor Name": po.vendor ? `${po.vendor.lastName || ""} ${po.vendor.firstName || ""}`.trim() : "N/A",
      "Vendor Email": po.vendor?.email || "N/A",
      "Total Amount": `MWK ${po.totalAmount?.toFixed(0) || 0}`,
      "Status": po.status || "N/A",
      "Delivery Status": po.deliveryStatus || "Pending",
      "Created Date": po.createdAt ? new Date(po.createdAt).toLocaleDateString() : "N/A",
      "Estimated Delivery": po.estimatedDelivery ? new Date(po.estimatedDelivery).toLocaleDateString() : "N/A",
      "Items Count": po.items?.length || 0,
      "Received By Customer": po.receivedByCustomer ? "Yes" : "No",
      "Customer Rating": po.customerRating || "N/A",
      "Delivery Address": po.deliveryAddress || "N/A",
      "Tracking Number": po.trackingNumber || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Orders");

    XLSX.writeFile(workbook, "purchase_orders.xlsx");

    showNotificationMessage("Export successful!", "success");
  };

  // Excel Import Functionality
  const handleImportFromExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const token = localStorage.getItem("token");
      let importCount = 0;

      for (const row of rows) {
        // Parse the row data to match your PO structure
        const poData = {
          // Map Excel columns to your PO fields
          // You'll need to adjust this based on your Excel structure
          vendorId: row["Vendor ID"] || "", // This might need to be looked up
          items: row["Items"] ? JSON.parse(row["Items"]) : [],
          totalAmount: Number(row["Total Amount"]) || 0,
          deliveryAddress: row["Delivery Address"] || "",
          status: row["Status"] || "pending",
          deliveryStatus: row["Delivery Status"] || "processing",
        };

        const response = await fetch(`${backendUrl}/api/purchase-orders`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(poData),
        });

        if (response.ok) {
          importCount++;
        } else {
          console.warn(`Failed to import row: ${JSON.stringify(row)}`);
        }
      }

      showNotificationMessage(`Successfully imported ${importCount} purchase orders!`, "success");
      handleRefresh();
    } catch (err) {
      console.error(err);
      showNotificationMessage("Excel import failed!", "error");
    }
  };

  // Print Functionality
  const handlePrint = () => {
    const printContents = document.getElementById("purchase-orders-section")?.innerHTML;
    if (!printContents) {
      showNotificationMessage("Nothing to print", "error");
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");

    printWindow.document.write(`
      <html>
        <head>
          <title>Purchase Orders Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            .print-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .print-date { text-align: right; color: #666; }
            .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
            .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9; }
            .metric-value { font-size: 24px; font-weight: bold; color: #333; }
            .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; }
            th { background-color: #f4f4f4; text-align: left; }
            .status-approved { background-color: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 12px; }
            .status-pending { background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; }
            .status-rejected { background-color: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; }
            .print-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Purchase Orders Report</h1>
          <div class="print-header">
            <div>Generated by Procurement System</div>
            <div class="print-date">${new Date().toLocaleDateString()}</div>
          </div>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${totalPOs}</div>
              <div class="metric-label">Total POs</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${approvedPOs}</div>
              <div class="metric-label">Approved</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${pendingPOs}</div>
              <div class="metric-label">Pending</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">MWK ${totalAmount.toFixed(0)}</div>
              <div class="metric-label">Total Amount</div>
            </div>
          </div>
          ${printContents}
          <div class="print-footer">
            <p>Confidential - For internal use only</p>
            <p>Page 1 of 1</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden file input for Excel import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleImportFromExcel}
      />

      {/* LoadingOverlay with Loader icon */}
      <LoadingOverlay 
        isVisible={isLoading} 
        message="Loading Purchase Orders..." 
      />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search purchase orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={openCreatePOModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              New PO
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total POs" 
            value={totalPOs}
            icon={ShoppingCart} 
            color="blue" 
            subtitle="All orders"
          />
          <MetricCard 
            title="Approved" 
            value={approvedPOs}
            icon={Check} 
            color="green" 
            trend={15}
            subtitle="Ready to ship"
          />
          <MetricCard 
            title="Pending" 
            value={pendingPOs}
            icon={Package} 
            color="amber" 
            subtitle="Awaiting approval"
          />
          <MetricCard 
            title="Total Amount" 
            value={totalAmount.toFixed(0)}
            prefix="MWK "
            icon={DollarSign} 
            color="purple" 
            trend={8}
            subtitle="Order value"
          />
        </div>

        {/* Purchase Order Cards */}
        <div id="purchase-orders-section" className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Purchase Orders</h3>
            </div>

            {/* Export/Import/Print Buttons */}
            <div className="flex items-center gap-3">
              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
              >
                <Printer size={16} />
                Print
              </button>
              
              {/* Excel Import */}
              <button
                onClick={() => fileInputRef.current.click()}
               className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
              >
                <FileSpreadsheet size={16} />
                Excel Import
              </button>

              {/* Excel Export */}
              <button
                onClick={handleExportToExcel}
               className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
              >
                <Upload size={16} />
                Excel Export
              </button>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{filteredPurchaseOrders.length} of {totalPOs} orders</span>
              </div>
            </div>
          </div>

          {filteredPurchaseOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No purchase orders match your filters" : "No Purchase Orders"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Start by creating your first purchase order from an approved RFQ."}
              </p>
              <button
                onClick={openCreatePOModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 mx-auto"
              >
                <Plus size={16} />
                Create PO
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPurchaseOrders.map((po) => (
                <PurchaseOrderCard
                  key={po._id}
                  po={po}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onApprove={handleApprovePO}
                  onReject={handleRejectPO}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Action Dropdown Menu */}
     {showMenuId && (
  <>
    {/* Backdrop */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-transparent"
      onClick={() => setShowMenuId(null)}
    />
    
    {/* Menu positioned exactly at button edge */}
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed z-[101] w-56 bg-white rounded-lg shadow-xl border border-gray-200"
      style={{
        top: (() => {
          const button = document.querySelector(`[data-po-id="${showMenuId}"]`);
          if (button) {
            const rect = button.getBoundingClientRect();
            return `${rect.bottom + window.scrollY}px`; // Directly at button bottom edge
          }
          return '50px';
        })(),
        left: (() => {
          const button = document.querySelector(`[data-po-id="${showMenuId}"]`);
          if (button) {
            const rect = button.getBoundingClientRect();
            const menuWidth = 224; // 56rem = 224px
            const rightEdge = rect.right + window.scrollX;
            
            // If menu would go offscreen right, align to viewport edge
            if (rightEdge + menuWidth > window.innerWidth) {
              return `${window.innerWidth - menuWidth - 8}px`; // 8px padding from edge
            }
            return `${rect.right - menuWidth + window.scrollX}px`; // Align to button right
          }
          return '50px';
        })()
      }}
      transition={{
        duration: 0.1,
        ease: "easeOut"
      }}
    >
      <div className="py-1">
        <button
          onClick={() => {
            setShowMenuId(null);
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
        >
          <Eye size={16} className="text-gray-500" />
          View Details
        </button>
        
        <button
          onClick={() => {
            setShowMenuId(null);
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
        >
          <Edit size={16} className="text-gray-500" />
          Edit PO
        </button>
        
        <button
          onClick={() => {
            const po = purchaseOrders.find(p => p._id === showMenuId);
            if (po) {
              handleTrackDelivery(po);
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
        >
          <Truck size={16} className="text-gray-500" />
          Track Delivery
        </button>
        
        <button
          onClick={() => {
            setShowMenuId(null);
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
        >
          <Download size={16} className="text-gray-500" />
          Download PDF
        </button>
        
        <button
          onClick={() => copyToClipboard(showMenuId)}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
        >
          <Copy size={16} className="text-gray-500" />
          Copy PO Number
        </button>

        <div className="border-t border-gray-100 my-1"></div>
        
        <button
          onClick={() => {
            setShowMenuId(null);
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 text-left text-sm"
        >
          <Ban size={16} />
          Cancel PO
        </button>
      </div>
    </motion.div>
  </>
)}

      {/* Delivery Tracking Modal */}
      <DeliveryTrackingModal
        po={selectedPOForTracking}
        isOpen={showDeliveryTrackingModal}
        onClose={() => {
          setShowDeliveryTrackingModal(false);
          setSelectedPOForTracking(null);
        }}
        onConfirmReceipt={handleConfirmReceipt}
      />

      {/* Receipt Confirmation Modal */}
      <ReceiptConfirmationModal
        po={selectedPOForReceipt}
        isOpen={showReceiptConfirmationModal}
        onClose={() => {
          setShowReceiptConfirmationModal(false);
          setSelectedPOForReceipt(null);
        }}
        onConfirm={handleReceiptConfirmation}
        showNotification={showNotificationMessage}
      />

      {/* Updated Create PO Modal with Grid View */}
      {isCreatePOModalOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-end p-4 z-[1000]">
    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl mr-12 transform translate-x-[-20%]">
      {/* Header with increased padding */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            Create Purchase Order
          </h2>
          <button
            onClick={closeCreatePOModal}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Select an RFQ with a selected vendor to create a purchase order
        </p>
      </div>
      
      {/* Form Body with increased padding */}
      <div className="p-6 max-h-[75vh] overflow-y-auto">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search RFQs by item name, description, or ID..."
              value={rfqSearchTerm}
              onChange={(e) => setRfqSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* RFQ Selection Grid */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={16} className="text-blue-500" />
              Available RFQs
            </h3>
           <div className="text-sm text-gray-500">
  {filteredRfqs.length} of {rfqs.filter(rfq => rfq.selectedVendor).length} RFQs ready for PO
</div>

          </div>

          {filteredRfqs.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText size={28} className="text-gray-400" />
              </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">
  {rfqSearchTerm 
    ? "No RFQs match your criteria" 
    : "No RFQs with selected vendors"}
</h3>
              <p className="text-sm text-gray-500">
  {rfqSearchTerm
    ? "Try adjusting your search or filter criteria."
    : "RFQs need a selected vendor before they can be converted to purchase orders."}
</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
              {filteredRfqs.map((rfq) => (
                <RfqCard
                  key={rfq._id}
                  rfq={rfq}
                  isSelected={selectedRfqId === rfq._id}
                  onSelect={handleRfqSelection}
                />
              ))}
            </div>
          )}
        </div>

        {/* Selected Quote Details */}
        {selectedQuote && selectedRfqId && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 mb-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              Selected Quote Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm font-medium text-gray-600 mb-1">Vendor</p>
                <p className="text-base font-semibold truncate">
                  {rfqs.find((rfq) => rfq._id === selectedRfqId)?.selectedVendor || "N/A"}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Price</p>
                <p className="text-base font-semibold">
                  MWK {selectedQuote.price?.toFixed(0) || "N/A"}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm font-medium text-gray-600 mb-1">Delivery Time</p>
                <p className="text-base font-semibold">
                  {selectedQuote.deliveryTime || "N/A"}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm font-medium text-gray-600 mb-1">Quote Status</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check size={12} className="mr-1" />
                  Selected
                </span>
              </div>
            </div>
            {selectedQuote.notes && (
              <div className="mt-3 bg-white rounded-lg p-3">
                <p className="text-sm font-medium text-gray-600 mb-1">Vendor Notes</p>
                <p className="text-sm text-gray-900">{selectedQuote.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={closeCreatePOModal}
            className="px-5 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
         <button
  onClick={handleCreatePO}
  disabled={!selectedRfqId}
  className="px-5 py-2.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
>
  <Save size={16} />
  Create Purchase Order
</button>

        </div>
      </div>
    </div>
  </div>
)}

      {/* Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`px-6 py-4 rounded-xl shadow-2xl border ${
            notificationType === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {notificationType === 'success' ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <span className="font-medium">{notificationMessage}</span>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}