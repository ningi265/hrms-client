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
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    vendors: [],
  });
  const [vendors, setVendors] = useState([]); // State to store vendors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch vendors from the backend
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://hrms-6s3i.onrender.com/api/vendors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setVendors(data);
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
      }
    };

    fetchVendors();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
          {/* Item Name */}
          <TextField
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
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
          />

          {/* Vendors */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Vendors</InputLabel>
            <Select
              name="vendors"
              value={formData.vendors}
              onChange={handleInputChange}
              multiple
              required
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<Save />}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Submit RFQ"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}