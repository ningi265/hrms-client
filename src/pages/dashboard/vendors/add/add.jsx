import { useState } from "react";
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

export default function AddVendorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "", // Corrected: Added password field
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
   const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;

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
      const response = await fetch(`${backendUrl}/api/vendors`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Vendor added successfully!");
        setTimeout(() => navigate("/vendors"), 2000); // Redirect after 2 seconds
      } else {
        setError(data.message || "Failed to add vendor");
      }
    } catch (err) {
      setError("Failed to add vendor");
      console.error("Failed to add vendor:", err);
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
        Add New Vendor
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
        {/* Name */}
        <TextField
            label="firstName"
            name="name"
            type="name"
            value={formData.firstName}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {/*Last Name */}
          <TextField
            label="Name"
            name="name"
            type="name"
            value={formData.lastName}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {/* Email */}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {/* Password */}
          <TextField
            label="Password"
            name="password" // Corrected: Fixed typo in the name attribute
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {/* Phone */}
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {/* Address */}
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {/* Categories */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Categories</InputLabel>
            <Select
              name="categories"
              value={formData.categories}
              onChange={handleInputChange}
              multiple
              required
            >
              <MenuItem value="Office Supplies">Office Supplies</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Stationery">Stationery</MenuItem>
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
            {isLoading ? <CircularProgress size={24} /> : "Add Vendor"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}