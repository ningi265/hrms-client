import { useState, useEffect, useRef } from "react"; // Add useRef
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Save,
  X,
  Star,
  Phone,
  Mail,
  Building,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Award,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Tag,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Copy,
  MessageSquare,
  Settings,
  FileText,
  UserPlus,
  Send,
  Clock,
  Shield,
  CheckCircle,
  DollarSign,
  Package,
  Loader,
  ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import * as XLSX from "xlsx"; // Add this import

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
        <Loader className="animate-spin w-6 h-6 text-blue-500" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

// MetricCard Component (styled like vehicle-management.jsx)
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : "";
  const valueSize = size === "large" ? "text-4xl" : "text-2xl";
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-1.5 hover:shadow-sm transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-1">
        <div className={`p-1.5 rounded-xl ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'amber' ? 'bg-amber-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={16} className={
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
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp size={12} className="text-emerald-500" />
            ) : (
              <TrendingDown size={12} className="text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`${valueSize} font-bold text-gray-900 mb-1`}>
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

// Updated Vendor Card Component to handle both User and Vendor objects
const VendorCard = ({ vendor, onMenuClick, showMenuId, onDelete, actionLoading, renderRating }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle both User objects (from addVendor) and Vendor objects (from existing data)
  const getVendorData = (vendor) => {
    // If it's a User object (newly created vendor)
    if (vendor.firstName && vendor.lastName) {
      return {
        name: `${vendor.firstName} ${vendor.lastName}`.trim(),
        email: vendor.email,
        phone: vendor.phoneNumber || vendor.phone,
        companyName: vendor.companyName,
        industry: vendor.industry,
        status: vendor.status || vendor.registrationStatus || 'pending',
        rating: vendor.rating || 0,
        categories: vendor.categories || [],
        id: vendor._id
      };
    }
    
    // If it's a Vendor object (existing data)
    return {
      name: vendor.name || `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim(),
      email: vendor.email,
      phone: vendor.phoneNumber || vendor.phone,
      companyName: vendor.businessName || vendor.companyName,
      industry: vendor.industry || 'N/A',
      status: vendor.registrationStatus || vendor.status || 'pending',
      rating: vendor.rating || 0,
      categories: vendor.categories || [],
      id: vendor._id
    };
  };

  const vendorData = getVendorData(vendor);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 bg-blue-50 rounded-xl">
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">
              {vendorData.name || "N/A"}
            </h4>
            <p className="text-xs text-gray-500">{vendorData.companyName || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vendorData.status)}`}>
            {vendorData.status}
          </span>
          <button
            data-vendor-id={vendorData.id}
            onClick={() => onMenuClick(vendorData.id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900 flex items-center justify-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            {vendorData.rating ? vendorData.rating.toFixed(1) : '0.0'}
          </div>
          <div className="text-xs text-gray-500">Rating</div>
        </div>
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">
            {vendorData.categories?.length || 0}
          </div>
          <div className="text-xs text-gray-500">Categories</div>
        </div>
      </div>

      <div className="space-y-0.5 mb-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Email</span>
          <span className="text-xs font-medium truncate">{vendorData.email || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Phone</span>
          <span className="text-xs font-medium">{vendorData.phone || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Industry</span>
          <span className="text-xs font-medium">{vendorData.industry || "N/A"}</span>
        </div>
      </div>

      {vendorData.categories && vendorData.categories.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 mb-1">Categories</div>
          <div className="flex flex-wrap gap-1">
            {vendorData.categories
              .filter(category => category && typeof category === 'string')
              .slice(0, 2)
              .map((category, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {category}
                </span>
              ))}
            {vendorData.categories.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                +{vendorData.categories.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
        <div className="flex items-center gap-1">
          {renderRating(vendorData.rating || 0)}
        </div>
        <div className="flex gap-1">
          <button className="p-1 text-gray-400 hover:text-blue-600 rounded-xl">
            <Eye size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-blue-600 rounded-xl">
            <Edit size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VendorsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'dashboard';
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const fileInputRef = useRef(null); // Add file input ref

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/vendors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        
        // Handle different response structures
        if (result.success && result.data) {
          // New API response format with success wrapper
          setVendors(Array.isArray(result.data) ? result.data : []);
        } else if (Array.isArray(result)) {
          // Direct array response (old format)
          setVendors(result);
        } else {
          // Fallback - treat as empty array
          console.warn("Unexpected API response format:", result);
          setVendors([]);
        }
      } catch (error) {
        setError("Failed to fetch vendors");
        console.error("Failed to fetch vendors:", error);
        setVendors([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [backendUrl]);

  // Excel Export Functionality
  const handleExportToExcel = () => {
    if (!vendors || vendors.length === 0) {
      showNotificationMessage("No vendors to export", "error");
      return;
    }

    const formatted = vendors.map((vendor) => {
      // Handle both User and Vendor object structures
      const vendorName = vendor.name || `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim();
      const companyName = vendor.businessName || vendor.companyName || '';
      const email = vendor.email || '';
      const phone = vendor.phoneNumber || vendor.phone || '';
      const industry = vendor.industry || '';
      const status = vendor.status || vendor.registrationStatus || 'pending';
      const rating = vendor.rating || 0;
      const categories = vendor.categories ? vendor.categories.join(", ") : '';
      
      return {
        "Vendor ID": vendor._id || "N/A",
        "Name": vendorName,
        "Email": email,
        "Phone": phone,
        "Company": companyName,
        "Industry": industry,
        "Status": status,
        "Rating": rating,
        "Categories": categories,
        "Address": vendor.address || "",
        "Tax ID": vendor.taxpayerIdentificationNumber || "",
        "Registration Number": vendor.registrationNumber || "",
        "Created Date": vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");

    XLSX.writeFile(workbook, "vendors.xlsx");

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

      for (const row of rows) {
        // Parse categories from Excel
        let categories = [];
        if (row.Categories) {
          categories = row.Categories.split(",").map(cat => cat.trim()).filter(cat => cat !== '');
        }

        // Handle name splitting
        const fullName = row.Name || '';
        let firstName = '', lastName = '';
        if (fullName) {
          const nameParts = fullName.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }

        const payload = {
          firstName: firstName || row["First Name"] || '',
          lastName: lastName || row["Last Name"] || '',
          email: row.Email || '',
          phoneNumber: row.Phone || '',
          address: row.Address || '',
          companyName: row.Company || row["Company Name"] || '',
          businessName: row.Company || row["Company Name"] || '',
          industry: row.Industry || '',
          categories: categories,
          taxpayerIdentificationNumber: row["Tax ID"] || `TIN-${Date.now()}`,
          registrationNumber: row["Registration Number"] || `REG-${Date.now()}`,
          companyType: 'Private Limited Company',
          formOfBusiness: 'Limited Liability Company',
          ownershipType: 'Private Ownership',
          countryOfRegistration: 'Malawi',
          role: "Vendor",
          status: row.Status || 'pending'
        };

        await fetch(`${backendUrl}/api/vendors`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      showNotificationMessage("Excel import completed successfully!", "success");
      handleRefresh();
    } catch (err) {
      console.error(err);
      showNotificationMessage("Excel import failed!", "error");
    }
  };

  // Print Functionality
  const handlePrint = () => {
    const printContents = document.getElementById("vendors-section")?.innerHTML;
    if (!printContents) {
      showNotificationMessage("Nothing to print", "error");
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");

    printWindow.document.write(`
      <html>
        <head>
          <title>Vendors Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            .print-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
              gap: 15px; 
              margin-top: 20px; 
            }
            .print-card { 
              border: 1px solid #ddd; 
              padding: 15px; 
              border-radius: 10px; 
              page-break-inside: avoid;
            }
            .print-header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              margin-bottom: 10px; 
              border-bottom: 1px solid #eee; 
              padding-bottom: 10px; 
            }
            .print-metrics { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 10px; 
              margin-bottom: 20px; 
            }
            .print-metric { 
              text-align: center; 
              padding: 10px; 
              border: 1px solid #ddd; 
              border-radius: 8px; 
            }
            .stars { display: flex; gap: 2px; margin-top: 5px; }
            .star { width: 16px; height: 16px; }
            .star-filled { color: #fbbf24; fill: #fbbf24; }
            .star-empty { color: #d1d5db; }
            @media print {
              body { padding: 0; }
              .print-card { margin-bottom: 15px; }
            }
          </style>
        </head>
        <body>
          <h1>Vendor Network</h1>
          <div class="print-metrics">
            <div class="print-metric">
              <h3>Total Vendors</h3>
              <p>${totalVendors}</p>
            </div>
            <div class="print-metric">
              <h3>Active Vendors</h3>
              <p>${activeVendors}</p>
            </div>
            <div class="print-metric">
              <h3>Categories</h3>
              <p>${totalCategories}</p>
            </div>
            <div class="print-metric">
              <h3>Avg Rating</h3>
              <p>${avgRating}/5</p>
            </div>
          </div>
          <div class="print-grid">
            ${filteredVendors.map(vendor => {
              const vendorData = vendor.name ? vendor : {
                name: `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim(),
                companyName: vendor.businessName || vendor.companyName,
                email: vendor.email,
                phone: vendor.phoneNumber || vendor.phone,
                industry: vendor.industry,
                status: vendor.status || vendor.registrationStatus,
                rating: vendor.rating || 0,
                categories: vendor.categories || []
              };
              
              // Generate star rating HTML
              const renderStars = (rating) => {
                const stars = [];
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 >= 0.5;
                
                for (let i = 0; i < fullStars; i++) {
                  stars.push(`<div class="star star-filled">★</div>`);
                }
                
                if (hasHalfStar) {
                  stars.push(`<div class="star star-filled" style="clip-path: inset(0 50% 0 0);">★</div>`);
                }
                
                const emptyStars = 5 - stars.length;
                for (let i = 0; i < emptyStars; i++) {
                  stars.push(`<div class="star star-empty">★</div>`);
                }
                
                return `<div class="stars">${stars.join('')}</div>`;
              };
              
              return `
                <div class="print-card">
                  <div class="print-header">
                    <div>
                      <h3>${vendorData.name || 'N/A'}</h3>
                      <p>${vendorData.companyName || 'N/A'}</p>
                    </div>
                    <span style="
                      padding: 4px 8px; 
                      border-radius: 12px; 
                      font-size: 12px;
                      ${vendorData.status === 'active' || vendorData.status === 'approved' ? 'background-color: #d1fae5; color: #065f46;' : 
                        vendorData.status === 'pending' ? 'background-color: #fef3c7; color: #92400e;' :
                        'background-color: #f3f4f6; color: #374151;'}
                    ">
                      ${vendorData.status || 'N/A'}
                    </span>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
                    <div style="text-align: center; padding: 8px; background-color: #f9fafb; border-radius: 8px;">
                      <strong>${vendorData.rating ? vendorData.rating.toFixed(1) : '0.0'}</strong>
                      ${renderStars(vendorData.rating || 0)}
                      <p style="font-size: 12px; color: #6b7280;">Rating</p>
                    </div>
                    <div style="text-align: center; padding: 8px; background-color: #f9fafb; border-radius: 8px;">
                      <strong>${vendorData.categories?.length || 0}</strong>
                      <p style="font-size: 12px; color: #6b7280;">Categories</p>
                    </div>
                  </div>
                  <div style="font-size: 13px;">
                    <p><strong>Email:</strong> ${vendorData.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${vendorData.phone || 'N/A'}</p>
                    <p><strong>Industry:</strong> ${vendorData.industry || 'N/A'}</p>
                    ${vendorData.categories && vendorData.categories.length > 0 ? `
                      <p><strong>Categories:</strong> ${vendorData.categories.slice(0, 3).join(', ')}${vendorData.categories.length > 3 ? '...' : ''}</p>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.print();
  };

  const filteredVendors = (vendors || []).filter((vendor) => {
    // Handle both User and Vendor objects for search
    const vendorName = vendor.name || `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim();
    const companyName = vendor.businessName || vendor.companyName || '';
    const email = vendor.email || '';
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = vendorName.toLowerCase().includes(searchLower);
    const companyMatch = companyName.toLowerCase().includes(searchLower);
    const emailMatch = email.toLowerCase().includes(searchLower);
    
    const categoriesMatch = vendor.categories && Array.isArray(vendor.categories) 
      ? vendor.categories.some((cat) => 
          cat && typeof cat === 'string' && cat.toLowerCase().includes(searchLower)
        )
      : false;
    
    return nameMatch || companyMatch || emailMatch || categoriesMatch;
  });

  // Calculate stats - handle both User and Vendor objects
  const totalVendors = (vendors || []).length;
  const activeVendors = (vendors || []).filter(vendor => 
    vendor.status === "active" || 
    vendor.registrationStatus === "approved" || 
    vendor.registrationStatus === "active"
  ).length;
  
  const allCategories = (vendors || []).flatMap(vendor => vendor.categories || []);
  const totalCategories = [...new Set(allCategories)].length;
  const avgRating = vendors && vendors.length > 0 ? (vendors.reduce((sum, vendor) => sum + (vendor.rating || 0), 0) / vendors.length).toFixed(1) : 0;
 
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={12} className="fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative inline-block">
          <Star size={12} className="text-yellow-400" />
          <Star
            size={12}
            className="absolute top-0 left-0 fill-yellow-400 text-yellow-400"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={12} className="text-gray-300" />);
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
      </div>
    );
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`?section=${section}`, { replace: true });
  };

  const handleDeleteVendor = async (vendorId) => {
    setActionLoading(vendorId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/vendors/${vendorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
        showNotificationMessage("Vendor deleted successfully!", "success");
      } else {
        throw new Error("Failed to delete vendor");
      }
    } catch (error) {
      showNotificationMessage("Failed to delete vendor", "error");
      console.error("Failed to delete vendor:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
  };

  const openAddVendorModal = () => {
    setIsAddVendorModalOpen(true);
  };

  const closeAddVendorModal = () => {
    setIsAddVendorModalOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      companyName: "",
      industry: "",
      email: "",
      phoneNumber: "",
      address: "",
      categories: [],
    });
  };

  // Updated form data structure to match backend expectations
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    phoneNumber: '',
    address: '',
    companyName: '', // This will be used for businessName
    industry: '',
    categories: [],
    // Backend fields
    taxpayerIdentificationNumber: '',
    registrationNumber: '',
    companyType: 'Private Limited Company',
    formOfBusiness: 'Limited Liability Company',
    ownershipType: 'Private Ownership',
    countryOfRegistration: 'Malawi'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      // Prepare payload to match backend expectations
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        companyName: formData.companyName, // Frontend field
        businessName: formData.companyName, // Backend expects this for Vendor model
        industry: formData.industry,
        categories: formData.categories.filter(cat => cat.trim() !== ''),
        taxpayerIdentificationNumber: formData.taxpayerIdentificationNumber || `TIN-${Date.now()}`,
        registrationNumber: formData.registrationNumber || `REG-${Date.now()}`,
        companyType: formData.companyType,
        formOfBusiness: formData.formOfBusiness,
        ownershipType: formData.ownershipType,
        countryOfRegistration: formData.countryOfRegistration,
        role: "Vendor"
      };

      console.log("Sending payload:", payload); // Debug log

      const response = await fetch(`${backendUrl}/api/vendors`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (response.ok) {
        // Create a vendor object that matches our display expectations
        const newVendorForDisplay = {
          _id: data.vendor?.id || data.vendor?._id || Date.now().toString(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          companyName: formData.companyName,
          industry: formData.industry,
          categories: formData.categories,
          status: data.vendor?.status || 'pending',
          rating: 0,
          registrationStatus: 'pending'
        };

        setVendors((prev) => [...prev, newVendorForDisplay]);
        showNotificationMessage("Vendor added successfully! Registration email sent.", "success");
        closeAddVendorModal();
      } else {
        throw new Error(data.message || "Failed to add vendor");
      }
    } catch (err) {
      showNotificationMessage(err.message || "Failed to add vendor", "error");
      console.error("Failed to add vendor:", err);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotificationMessage("ID copied to clipboard!", "success");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading vendors..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Hidden file input for Excel import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          className="hidden"
          onChange={handleImportFromExcel}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
        
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => {
                setUserMenuOpen(false);
                handleSectionChange("pending-registration");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-2xl font-medium hover:bg-green-600 transition-colors"
            >
              <CheckCircle size={16} />
              Approve
            </button>
            <button
              onClick={openAddVendorModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Vendors" 
            value={totalVendors}
            icon={Users} 
            color="blue" 
            subtitle="In network"
          />
          <MetricCard 
            title="Active Vendors" 
            value={activeVendors}
            icon={CheckCircle} 
            color="green" 
            trend={8}
            subtitle="Currently partnered"
          />
          <MetricCard 
            title="Categories" 
            value={totalCategories}
            icon={Tag} 
            color="purple" 
            subtitle="Service types"
          />
          <MetricCard 
            title="Avg Rating" 
            value={avgRating}
            suffix="/5"
            icon={Star} 
            color="amber" 
            trend={3}
            subtitle="Partner satisfaction"
          />
        </div>

        {/* Vendor Cards Section */}
        <div id="vendors-section" className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Vendor Network</h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Print Button */}
              <button
                className="px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
                onClick={handlePrint}
              >
                Print
              </button>
              
              {/* Excel Import Button */}
              <button
                className="px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
                onClick={() => fileInputRef.current.click()}
              >
                Excel Import
              </button>
              
              {/* Excel Export Button */}
              <button
                className="px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
                onClick={handleExportToExcel}
              >
                Excel Export
              </button>
              
              {/* Count */}
              <span className="text-sm text-gray-500">
                {filteredVendors.length} of {totalVendors} vendors
              </span>
            </div>
          </div>

          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No vendors match your search" : "No vendors found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Start by adding your first vendor partner."}
              </p>
              <button
                onClick={openAddVendorModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 mx-auto"
              >
                <Plus size={16} />
                Add Vendor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor._id}
                  vendor={vendor}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onDelete={handleDeleteVendor}
                  actionLoading={actionLoading}
                  renderRating={renderRating}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Action Dropdown Menu */}
      {showMenuId && (
        <>
          {/* Subtle backdrop with fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/5"
            onClick={() => setShowMenuId(null)}
            transition={{ duration: 0.1 }}
          />
          
          {/* Menu positioned exactly at button edge */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed z-[101] w-56 bg-white rounded-2xl shadow-xl border border-gray-200"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-vendor-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  return `${rect.bottom + window.scrollY}px`; // Directly at button bottom edge
                }
                return '50px';
              })(),
              left: (() => {
                const button = document.querySelector(`[data-vendor-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuWidth = 224;
                  const rightEdge = rect.right + window.scrollX;
                  
                  // Right edge protection with 8px buffer
                  if (rightEdge + menuWidth > window.innerWidth) {
                    return `${window.innerWidth - menuWidth - 8}px`;
                  }
                  return `${rect.right - menuWidth + window.scrollX}px`;
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
              {[
                { icon: Eye, label: "View Details", action: () => navigate(`/dashboard/vendors/${showMenuId}`) },
                { icon: Edit, label: "Edit Vendor", action: () => navigate(`/dashboard/vendors/${showMenuId}/edit`) },
                { icon: MessageSquare, label: "Send Message", action: () => {} },
                { icon: TrendingUp, label: "View Performance", action: () => navigate(`/dashboard/vendors/${showMenuId}/performance`) },
                { icon: Package, label: "Create Order", action: () => navigate(`/dashboard/orders/create?vendor=${showMenuId}`) },
                { icon: Copy, label: "Copy Vendor ID", action: () => copyToClipboard(showMenuId) },
                { icon: Shield, label: "Manage Access", action: () => navigate(`/dashboard/vendors/${showMenuId}/access`) },
                { icon: FileText, label: "Generate Report", action: () => navigate(`/dashboard/reports/vendor/${showMenuId}`) },
                { type: "divider" },
                { 
                  icon: Trash2, 
                  label: "Delete Vendor", 
                  action: () => handleDeleteVendor(showMenuId),
                  destructive: true 
                }
              ].map((item, index) => (
                item.type === "divider" ? (
                  <div key={`divider-${index}`} className="border-t border-gray-100 my-1" />
                ) : (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setShowMenuId(null);
                    }}
                    disabled={actionLoading === showMenuId && item.destructive}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm rounded-xl ${
                      item.destructive 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <item.icon size={16} className="text-gray-500" />
                    <span>{item.label}</span>
                    {actionLoading === showMenuId && item.destructive && (
                      <div className="ml-auto">
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                )
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Add Vendor Modal */}
      {isAddVendorModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Compact Header */}
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Plus size={18} className="text-blue-500" />
                  Add New Vendor
                </h2>
                <button
                  onClick={closeAddVendorModal}
                  className="p-1.5 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Compact Form Body */}
            <div className="p-5 max-h-[75vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9+]/g, '');
                      handleInputChange({ target: { name: 'phoneNumber', value } });
                    }}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Industry *
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Technology, Manufacturing, Consulting"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Categories *
                  </label>
                  <div className="relative">
                    <select
                      name="categories"
                      value={formData.categories}
                      onChange={(e) => {
                        const options = e.target.options;
                        const selected = [];
                        for (let i = 0; i < options.length; i++) {
                          if (options[i].selected) {
                            selected.push(options[i].value);
                          }
                        }
                        setFormData({ ...formData, categories: selected });
                      }}
                      multiple
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                    >
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Stationery">Stationery</option>
                      <option value="IT Services">IT Services</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Construction">Construction</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Security">Security</option>
                      <option value="Cleaning">Cleaning</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="mt-1">
                    <div className="flex flex-wrap gap-1">
                      {formData.categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                categories: formData.categories.filter((_, i) => i !== index)
                              });
                            }}
                            className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Hold <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl</kbd> (Windows) or <kbd className="px-1 py-0.5 bg-gray-100 rounded">Cmd</kbd> (Mac) to select multiple
                    </p>
                  </div>
                </div>

                {/* Optional advanced fields - collapsed by default */}
                <div className="border-t border-gray-200 pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tax ID (Optional)
                      </label>
                      <input
                        type="text"
                        name="taxpayerIdentificationNumber"
                        value={formData.taxpayerIdentificationNumber}
                        onChange={handleInputChange}
                        placeholder="Will be auto-generated if empty"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Registration Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        placeholder="Will be auto-generated if empty"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Compact Footer */}
                <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeAddVendorModal}
                    className="px-4 py-2 text-xs text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isFormSubmitting}
                    className="px-4 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFormSubmitting ? (
                      <>
                        <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Add Vendor
                      </>
                    )}
                  </button>
                </div>
              </form>
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
  );
}