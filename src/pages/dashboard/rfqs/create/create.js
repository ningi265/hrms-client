"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Save, ArrowLeft } from "@mui/icons-material";
import { useAuth } from "../../../../authcontext/authcontext";

export default function CreateRFQPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requisitions, setRequisitions] = useState([]); // State to store all requisitions
  const [selectedRequisition, setSelectedRequisition] = useState(null); // Selected requisition
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    vendors: [],
  });
  const [vendors, setVendors] = useState([]); // State to store vendors
  const [isLoading, setIsLoading] = useState(false);
  const [isVendorsLoading, setIsVendorsLoading] = useState(false); // Separate loading state for vendors
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch all requisitions and vendors on component mount
  useEffect(() => {
    const fetchRequisitionsAndVendors = async () => {
      setIsLoading(true);
      try {
        // Fetch all requisitions
        const token = localStorage.getItem("token");
        const requisitionsResponse = await fetch("https://hrms-6s3i.onrender.com/api/requisitions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const requisitionsData = await requisitionsResponse.json();

        if (!requisitionsResponse.ok) {
          throw new Error(requisitionsData.message || "Failed to fetch requisitions");
        }

        // Filter approved requisitions
        const approvedRequisitions = requisitionsData.filter(
          (req) => req.status === "approved" // Change to "pending" for testing
        );
        setRequisitions(approvedRequisitions);

        // Fetch vendors
        setIsVendorsLoading(true);
        const vendorsResponse = await fetch("https://hrms-6s3i.onrender.com/api/vendors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const vendorsData = await vendorsResponse.json();

        if (!vendorsResponse.ok) {
          throw new Error(vendorsData.message || "Failed to fetch vendors");
        }

        setVendors(vendorsData);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
        setIsVendorsLoading(false);
      }
    };

    fetchRequisitionsAndVendors();
  }, []);

  // Handle requisition selection
  const handleRequisitionChange = (e) => {
    const requisitionId = e.target.value;
    const selected = requisitions.find((req) => req._id === requisitionId);
    setSelectedRequisition(selected);

    // Auto-fill form with selected requisition data
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        itemName: selected.itemName,
        quantity: selected.quantity,
      }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle vendor selection changes
  const handleVendorChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      vendors: value, // Update vendors array with selected values
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://hrms-6s3i.onrender.com/api/rfqs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: formData.itemName,
          quantity: formData.quantity,
          vendors: formData.vendors,
          requisitionId: selectedRequisition?._id, // Include selected requisition ID
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("RFQ created successfully and vendors notified!");
        setTimeout(() => navigate("/rfqs/view"), 2000); // Redirect after 2 seconds
      } else {
        setError(data.message || "Failed to create RFQ");
      }
    } catch (err) {
      setError("Failed to create RFQ");
      console.error("Failed to create RFQ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Button
        variant="outlined"
        startIcon={<ArrowLeft />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Typography variant="h4" gutterBottom>
        Create Request for Quotation (RFQ)
      </Typography>

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* Requisition Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Requisition</InputLabel>
            <Select
              name="requisition"
              value={selectedRequisition?._id || ""}
              onChange={handleRequisitionChange}
              required
              disabled={isLoading}
            >
              {requisitions.map((req) => (
                <MenuItem key={req._id} value={req._id}>
                  {req.itemName} (Qty: {req.quantity})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Item Name */}
          <TextField
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
            disabled // Disable editing if auto-filled
          />

          {/* Quantity */}
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
            disabled // Disable editing if auto-filled
          />

          {/* Vendors */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Vendors</InputLabel>
            <Select
              name="vendors"
              value={formData.vendors}
              onChange={handleVendorChange}
              multiple
              required
              disabled={isVendorsLoading} // Disable if vendors are still loading
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </MenuItem>
              ))}
            </Select>
            {isVendorsLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<Save />}
            disabled={isLoading || isVendorsLoading || !selectedRequisition}
          >
            {isLoading ? <CircularProgress size={24} /> : "Submit RFQ"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}