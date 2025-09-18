import { useState } from "react";
import { FileText, Building, AlertCircle, Save } from "lucide-react";

export default function VendorRegistration() {
  const [formData, setFormData] = useState({
    businessName: "",
    taxpayerIdentificationNumber: "",
    registrationNumber: "",
    registrationIssuedDate: "",
    phoneNumber: "",
    address: "",
    contactEmail: "",
    yearsInOperation: "",

    // Legal Compliance
    laborLawCompliance: false,
    litigationHistory: false,

    // Financial
    bankReference: "",
    insuranceCoverage: "",
    annualTurnover: "",

    // Technical
    deliveryCapacity: "",

    // Performance
    timelyDeliveryRecord: false,
    performanceRatings: "",

    // HSE
    safetyPolicy: "",

    // Ethics
    antiCorruptionPolicy: "",
    conflictOfInterest: false,
    codeOfConductSigned: false,
  });

  // Separate state for files
  const [files, setFiles] = useState({
    registrationCertificate: null,
    businessLicense: null,
    taxClearance: null,
    vatRegistration: null,
    industryLicenses: [],
    auditedStatements: [],
    relevantExperience: [],
    keyPersonnel: [],
    equipmentFacilities: [],
    qualityCertifications: [],
    clientReferences: [],
    completedProjects: [],
    safetyRecords: [],
    sustainabilityPractices: [],
    environmentCertificate: null,
    csrInitiatives: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
    const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV


  const handleInputChange = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleFileUpload = (field, selectedFiles, multiple) => {
    setFiles((prev) => ({
      ...prev,
      [field]: multiple ? Array.from(selectedFiles) : selectedFiles[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Starting form submission...");

    try {
      const formDataToSend = new FormData();

      // 1. Add all non-file form data as JSON
      formDataToSend.append("data", JSON.stringify(formData));

      // 2. Add all files
      Object.entries(files).forEach(([field, fileData]) => {
        if (fileData) {
          if (Array.isArray(fileData)) {
            fileData.forEach((file, index) => {
              if (file instanceof File) {
                formDataToSend.append(field, file);
              }
            });
          } else if (fileData instanceof File) {
            formDataToSend.append(field, fileData);
          }
        }
      });

      // Debug: Log what's being sent
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // 3. Make the API call
      const token = localStorage.getItem("token")

      const res = await fetch(`${backendUrl}/api/vendors/register`, {
        method: "POST",
        body: formDataToSend,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        // Don't set Content-Type header - browser will set it automatically with boundary
      });

      console.log("Response status:", res.status);
      
      const result = await res.json();
      console.log("Registration response:", result);

      if (res.ok) {
        alert(
          `Registration submitted successfully! Score: ${
            result.preQualification?.score || 0
          }%`
        );
        // Reset form
        setFormData({
          businessName: "",
          taxpayerIdentificationNumber: "",
          registrationNumber: "",
          registrationIssuedDate: "",
          phoneNumber: "",
          address: "",
          contactEmail: "",
          yearsInOperation: "",
          laborLawCompliance: false,
          litigationHistory: false,
          bankReference: "",
          insuranceCoverage: "",
          annualTurnover: "",
          deliveryCapacity: "",
          timelyDeliveryRecord: false,
          performanceRatings: "",
          safetyPolicy: "",
          antiCorruptionPolicy: "",
          conflictOfInterest: false,
          codeOfConductSigned: false,
        });
        setFiles({
          registrationCertificate: null,
          businessLicense: null,
          taxClearance: null,
          vatRegistration: null,
          industryLicenses: [],
          auditedStatements: [],
          relevantExperience: [],
          keyPersonnel: [],
          equipmentFacilities: [],
          qualityCertifications: [],
          clientReferences: [],
          completedProjects: [],
          safetyRecords: [],
          sustainabilityPractices: [],
          environmentCertificate: null,
          csrInitiatives: []
        });
      } else {
        alert(result.message || "Failed to submit registration");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit registration. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Input = ({ label, field, type = "text", ...rest }) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500"
        {...rest}
      />
      {errors[field] && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
          <AlertCircle size={12} /> {errors[field]}
        </p>
      )}
    </div>
  );

  const FileInput = ({ label, field, multiple }) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="file"
        multiple={multiple}
        onChange={(e) => handleFileUpload(field, e.target.files, multiple)}
        className="w-full text-xs text-gray-600"
      />
      {/* Show selected file names */}
      {files[field] && 
        (Array.isArray(files[field]) 
          ? files[field].map((file, idx) => (
              <p key={idx} className="text-[10px] text-gray-500 mt-1">
                {file.name}
              </p>
            ))
          : files[field] instanceof File && (
              <p className="text-[10px] text-gray-500 mt-1">
                {files[field].name}
              </p>
            )
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileText size={18} className="text-blue-500" />
          Vendor Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Company Info */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Building size={14} className="text-purple-500" />
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Business Name *" field="businessName" required />
              <Input label="TIN *" field="taxpayerIdentificationNumber" required />
              <Input label="Registration Number *" field="registrationNumber" required />
              <Input
                label="Reg. Issued Date"
                type="date"
                field="registrationIssuedDate"
              />
              <Input label="Phone Number" field="phoneNumber" />
              <Input label="Address" field="address" />
              <Input label="Contact Email" type="email" field="contactEmail" />
              <Input
                label="Years in Operation"
                type="number"
                field="yearsInOperation"
              />
              <FileInput
                label="Registration Certificate"
                field="registrationCertificate"
              />
              <FileInput label="Business License" field="businessLicense" />
            </div>
          </section>

          {/* Other sections remain the same */}
          {/* Legal Compliance */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-blue-500" />
              Legal Compliance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FileInput label="Tax Clearance" field="taxClearance" />
              <FileInput label="VAT Registration" field="vatRegistration" />
              <FileInput
                label="Industry Licenses"
                field="industryLicenses"
                multiple
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.laborLawCompliance}
                  onChange={(e) =>
                    handleInputChange("laborLawCompliance", e.target.checked)
                  }
                />{" "}
                Labor Law Compliance
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!formData.litigationHistory}
                  onChange={(e) =>
                    handleInputChange("litigationHistory", !e.target.checked)
                  }
                />{" "}
                No Litigation History
              </label>
            </div>
          </section>

          {/* Financial */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Financial Capability
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FileInput
                label="Audited Statements"
                field="auditedStatements"
                multiple
              />
              <Input label="Bank Reference" field="bankReference" />
              <Input label="Insurance Coverage" field="insuranceCoverage" />
              <Input
                label="Annual Turnover"
                type="number"
                field="annualTurnover"
              />
            </div>
          </section>

          {/* Technical */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Technical Capacity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FileInput
                label="Relevant Experience"
                field="relevantExperience"
                multiple
              />
              <FileInput
                label="Key Personnel"
                field="keyPersonnel"
                multiple
              />
              <FileInput
                label="Equipment/Facilities"
                field="equipmentFacilities"
                multiple
              />
              <FileInput
                label="Quality Certifications"
                field="qualityCertifications"
                multiple
              />
              <Input label="Delivery Capacity" field="deliveryCapacity" />
            </div>
          </section>

          {/* Past Performance */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Past Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FileInput
                label="Client References"
                field="clientReferences"
                multiple
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.timelyDeliveryRecord}
                  onChange={(e) =>
                    handleInputChange("timelyDeliveryRecord", e.target.checked)
                  }
                />{" "}
                Timely Delivery Record
              </label>
              <FileInput
                label="Completed Projects"
                field="completedProjects"
                multiple
              />
              <Input label="Performance Ratings" field="performanceRatings" />
            </div>
          </section>

          {/* HSE */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Health, Safety & Environment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Safety Policy" field="safetyPolicy" />
              <FileInput
                label="Environment Certificate"
                field="environmentCertificate"
              />
              <FileInput
                label="Safety Records"
                field="safetyRecords"
                multiple
              />
              <FileInput
                label="Sustainability Practices"
                field="sustainabilityPractices"
                multiple
              />
            </div>
          </section>

          {/* Ethics */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Ethics & Governance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Anti-Corruption Policy"
                field="antiCorruptionPolicy"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!formData.conflictOfInterest}
                  onChange={(e) =>
                    handleInputChange(
                      "conflictOfInterest",
                      !e.target.checked
                    )
                  }
                />{" "}
                No Conflict of Interest
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.codeOfConductSigned}
                  onChange={(e) =>
                    handleInputChange("codeOfConductSigned", e.target.checked)
                  }
                />{" "}
                Code of Conduct Signed
              </label>
              <FileInput label="CSR Initiatives" field="csrInitiatives" multiple />
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end border-t border-gray-200 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs bg-blue-500 text-white rounded-2xl hover:bg-blue-600 flex items-center gap-1 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Submit Registration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}