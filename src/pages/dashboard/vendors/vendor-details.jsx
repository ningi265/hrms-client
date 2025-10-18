"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Building,
  FileText,
  Paperclip,
  Download,
  X,
  UserCheck,
  UserX,
  Loader
} from "lucide-react"
import { motion } from "framer-motion"

export default function VendorDetailsPage({ vendorId, onBack }) {
   const { id } = useParams();
  const actualVendorId = vendorId || id;


   console.log('🔍 DEBUG VendorDetailsPage:');
  console.log('  - vendorId prop:', vendorId);
  console.log('  - id from useParams:', id);
  console.log('  - actualVendorId:', actualVendorId);
  console.log('  - localStorage selectedVendorId:', localStorage.getItem('selectedVendorId'));

  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV

   useEffect(() => {
    const fetchVendor = async () => {
      console.log('🔄 fetchVendor called with actualVendorId:', actualVendorId);
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${backendUrl}/api/vendors/${actualVendorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        const data = await res.json()
        console.log('✅ Vendor data fetched:', data);
        setVendor(data)
      } catch (err) {
        console.error("❌ Failed to load vendor:", err)
      } finally {
        setIsLoading(false)
      }
    }
    if (actualVendorId) {
      fetchVendor()
    } else {
      console.error('🚨 No vendor ID available for fetching');
      setIsLoading(false)
    }
  }, [actualVendorId, backendUrl])

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const downloadDocument = (filePath, fileName) => {
    const link = document.createElement("a")
    link.href = `${backendUrl}/${filePath}`
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAction = async (action) => {
  setActionLoading(true)
  try {
    const token = localStorage.getItem("token")
    
    // Use actualVendorId which handles both cases (route param and prop)
    const res = await fetch(`${backendUrl}/api/vendors/${action}/${actualVendorId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    
    if (res.ok) {
      alert(`Vendor ${action} successfully`)
      // If we're in dashboard section mode, use onBack, otherwise navigate
      if (onBack) {
        onBack();
      } else {
        navigate("/vendors")
      }
    } else {
      const errorData = await res.json();
      alert(`Action failed: ${errorData.message || 'Unknown error'}`)
    }
  } catch (err) {
    console.error(err)
    alert("Action failed")
  } finally {
    setActionLoading(false)
  }
}

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-600 w-8 h-8" />
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <FileText size={48} className="mb-4" />
        <p>No vendor found.</p>
        <button
          onClick={() => navigate("/vendors")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to List
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">
              {vendor.businessName}
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
          >
            <X size={16} /> Back
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Business Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Building size={16} /> Business Information
            </h3>
            <div className="bg-gray-50 p-3 rounded-xl">
              <label className="text-xs text-gray-500">Business Name</label>
              <p className="text-sm font-medium text-gray-900">{vendor.businessName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <label className="text-xs text-gray-500">Registration Number</label>
              <p className="text-sm text-gray-900">{vendor.registrationNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <label className="text-xs text-gray-500">TIN</label>
              <p className="text-sm text-gray-900">{vendor.taxpayerIdentificationNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <label className="text-xs text-gray-500">Phone</label>
              <p className="text-sm text-gray-900">{vendor.phoneNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <label className="text-xs text-gray-500">Address</label>
              <p className="text-sm text-gray-900">{vendor.address}</p>
            </div>
          </div>

          {/* Registration Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={16} /> Registration Details
            </h3>
            <div className="bg-gray-50 p-3 rounded-xl">
              <label className="text-xs text-gray-500">Country</label>
              <p className="text-sm text-gray-900">{vendor.countryOfRegistration}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <label className="text-xs text-gray-500">Submitted</label>
              <p className="text-sm text-gray-900">{formatDate(vendor.submissionDate)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <label className="text-xs text-gray-500">Status</label>
              <p className="capitalize text-sm font-medium text-gray-900">{vendor.registrationStatus}</p>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Paperclip size={16} />
            Uploaded Documents
          </h3>
          <div className="space-y-2">
            {vendor.documents && Object.keys(vendor.documents).length > 0 ? (
              Object.entries(vendor.documents).map(([key, value], i) => {
                const files = Array.isArray(value) ? value : value ? [value] : []
                return files.map((doc, j) => (
                  <div
                    key={`${key}-${j}`}
                    className="bg-white border border-gray-200 rounded-xl p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, " $1")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(doc.uploadedAt)} • {doc.fileName}
                      </p>
                    </div>
                    <button
                      onClick={() => downloadDocument(doc.filePath, doc.fileName)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                ))
              })
            ) : (
              <p className="text-gray-500 text-sm bg-gray-50 p-3 rounded-xl">
                No documents uploaded
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {vendor.registrationStatus === "pending" && (
          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={() => handleAction("reject")}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center gap-2 text-sm"
            >
              <UserX size={16} />
              Reject Registration
            </button>
            <button
              onClick={() => handleAction("approve")}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center gap-2 text-sm"
            >
              <UserCheck size={16} />
              Approve Registration
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
