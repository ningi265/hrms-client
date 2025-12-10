import { useState } from "react";
import { FileText, Building, AlertCircle, Save } from "lucide-react";

// Move Input component outside to prevent re-renders
const Input = ({ label, field, type = "text", formData, onChange, ...rest }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={field}
      value={formData[field]}
      onChange={onChange}
      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      {...rest}
    />
  </div>
);

// Move FileInput component outside as well
const FileInput = ({ label, field, multiple, files, onFileChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="file"
      multiple={multiple}
      onChange={(e) => onFileChange(field, e.target.files, multiple)}
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
    import.meta.env.VITE_ENV === "production"
      ? import.meta.env.VITE_BACKEND_URL_PROD
      : import.meta.env.VITE_BACKEND_URL_DEV;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
      formDataToSend.append("data", JSON.stringify(formData));

      Object.entries(files).forEach(([field, fileData]) => {
        if (fileData) {
          if (Array.isArray(fileData)) {
            fileData.forEach((file) => {
              if (file instanceof File) {
                formDataToSend.append(field, file);
              }
            });
          } else if (fileData instanceof File) {
            formDataToSend.append(field, fileData);
          }
        }
      });

      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/vendors/register`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
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
              <Input label="Business Name *" field="businessName" formData={formData} onChange={handleInputChange} required />
              <Input label="TIN *" field="taxpayerIdentificationNumber" formData={formData} onChange={handleInputChange} required />
              <Input label="Registration Number *" field="registrationNumber" formData={formData} onChange={handleInputChange} required />
              <Input
                label="Reg. Issued Date"
                type="date"
                field="registrationIssuedDate"
                formData={formData}
                onChange={handleInputChange}
              />
              <Input label="Phone Number" field="phoneNumber" formData={formData} onChange={handleInputChange} />
              <Input label="Address" field="address" formData={formData} onChange={handleInputChange} />
              <Input label="Contact Email" type="email" field="contactEmail" formData={formData} onChange={handleInputChange} />
              <Input
                label="Years in Operation"
                type="number"
                field="yearsInOperation"
                formData={formData}
                onChange={handleInputChange}
              />
              <FileInput
                label="Registration Certificate"
                field="registrationCertificate"
                files={files}
                onFileChange={handleFileUpload}
              />
              <FileInput 
                label="Business License" 
                field="businessLicense" 
                files={files}
                onFileChange={handleFileUpload}
              />
            </div>
          </section>

          {/* Legal Compliance */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-blue-500" />
              Legal Compliance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FileInput label="Tax Clearance" field="taxClearance" files={files} onFileChange={handleFileUpload} />
              <FileInput label="VAT Registration" field="vatRegistration" files={files} onFileChange={handleFileUpload} />
              <FileInput
                label="Industry Licenses"
                field="industryLicenses"
                multiple
                files={files}
                onFileChange={handleFileUpload}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="laborLawCompliance"
                  checked={formData.laborLawCompliance}
                  onChange={handleInputChange}
                />{" "}
                Labor Law Compliance
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="litigationHistory"
                  checked={formData.litigationHistory}
                  onChange={handleInputChange}
                />{" "}
                No Litigation History
              </label>
            </div>
          </section>

          {/* Continue with other sections... */}
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
                files={files}
                onFileChange={handleFileUpload}
              />
              <Input label="Bank Reference" field="bankReference" formData={formData} onChange={handleInputChange} />
              <Input label="Insurance Coverage" field="insuranceCoverage" formData={formData} onChange={handleInputChange} />
              <Input
                label="Annual Turnover"
                type="number"
                field="annualTurnover"
                formData={formData}
                onChange={handleInputChange}
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
                files={files}
                onFileChange={handleFileUpload}
              />
              <FileInput
                label="Key Personnel"
                field="keyPersonnel"
                multiple
                files={files}
                onFileChange={handleFileUpload}
              />
              <FileInput
                label="Equipment/Facilities"
                field="equipmentFacilities"
                multiple
                files={files}
                onFileChange={handleFileUpload}
              />
              <FileInput
                label="Quality Certifications"
                field="qualityCertifications"
                multiple
                files={files}
                onFileChange={handleFileUpload}
              />
              <Input label="Delivery Capacity" field="deliveryCapacity" formData={formData} onChange={handleInputChange} />
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
                files={files}
                onFileChange={handleFileUpload}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="timelyDeliveryRecord"
                  checked={formData.timelyDeliveryRecord}
                  onChange={handleInputChange}
                />{" "}
                Timely Delivery Record
              </label>
              <FileInput
                label="Completed Projects"
                field="completedProjects"
                multiple
                files={files}
                onFileChange={handleFileUpload}
              />
              <Input label="Performance Ratings" field="performanceRatings" formData={formData} onChange={handleInputChange} />
            </div>
          </section>

          {/* HSE */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Health, Safety & Environment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <div>
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Safety Policy
  </label>
  <select
    name="safetyPolicy"
    value={formData.safetyPolicy}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        safetyPolicy: e.target.value === "true",
      }))
    }
    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="">Select</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
</div>

              <FileInput
                label="Environment Certificate"
                field="environmentCertificate"
                files={files}
                onFileChange={handleFileUpload}
              />
              <FileInput
                label="Safety Records"
                field="safetyRecords"
                multiple
                files={files}
                onFileChange={handleFileUpload}
              />
              <FileInput
                label="Sustainability Practices"
                field="sustainabilityPractices"
                multiple
                files={files}
                onFileChange={handleFileUpload}
              />
            </div>
          </section>

          {/* Ethics */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Ethics & Governance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Anti-Corruption Policy
  </label>
  <select
    name="antiCorruptionPolicy"
    value={formData.antiCorruptionPolicy}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        antiCorruptionPolicy: e.target.value === "true",
      }))
    }
    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="">Select</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
</div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="conflictOfInterest"
                  checked={formData.conflictOfInterest}
                  onChange={handleInputChange}
                />{" "}
                No Conflict of Interest
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="codeOfConductSigned"
                  checked={formData.codeOfConductSigned}
                  onChange={handleInputChange}
                />{" "}
                Code of Conduct Signed
              </label>
              <FileInput 
                label="CSR Initiatives" 
                field="csrInitiatives" 
                multiple 
                files={files}
                onFileChange={handleFileUpload}
              />
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