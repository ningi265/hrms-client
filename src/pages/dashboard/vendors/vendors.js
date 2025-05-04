import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  styled,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Search, Add, MoreHoriz, Save } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useAuth } from "../../../authcontext/authcontext";

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#ec4899",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 700,
      background: "linear-gradient(90deg, #4f46e5, #ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle1: {
      fontWeight: 400,
      color: "#6b7280",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e5e7eb",
        },
        head: {
          fontWeight: 600,
          color: "#6b7280",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "#d1d5db",
            },
            "&:hover fieldset": {
              borderColor: "#4f46e5",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          background: "#ffffff",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiSnackbarContent-root": {
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
  },
});

// Custom styled components
const GradientContainer = styled(Container)(({ theme }) => ({
  background: "linear-gradient(135deg, #f9fafb, #e5e7eb)",
  borderRadius: "16px",
  padding: theme.spacing(4),
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #4f46e5, #ec4899)",
  },
}));

export default function VendorsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    categories: [],
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/vendors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        setError("Failed to fetch vendors");
        console.error("Failed to fetch vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} className="fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Box key="half" sx={{ position: "relative", display: "inline-block" }}>
          <Star size={16} className="text-yellow-400" />
          <Star
            size={16}
            className="absolute top-0 left-0 fill-yellow-400 text-yellow-400"
            sx={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </Box>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    }

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {stars}
        <Typography variant="body2" sx={{ ml: 1, color: "#6b7280" }}>
          ({rating.toFixed(1)})
        </Typography>
      </Box>
    );
  };

  const handleMenuClick = (event, vendor) => {
    setAnchorEl(event.currentTarget);
    setSelectedVendor(vendor);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedVendor(null);
  };

  const handleDeleteVendor = async (vendorId) => {
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
        setSnackbarMessage("Vendor deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        throw new Error("Failed to delete vendor");
      }
    } catch (error) {
      setSnackbarMessage("Failed to delete vendor");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Failed to delete vendor:", error);
    }
    handleCloseMenu();
  };

  const openAddVendorModal = () => {
    setIsAddVendorModalOpen(true);
  };

  const closeAddVendorModal = () => {
    setIsAddVendorModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      categories: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitting(true);
    setError(null);

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
        setVendors((prev) => [...prev, data]);
        setSnackbarMessage("Vendor added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        closeAddVendorModal();
      } else {
        throw new Error(data.message || "Failed to add vendor");
      }
    } catch (err) {
      setSnackbarMessage(err.message || "Failed to add vendor");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Failed to add vendor:", err);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
           <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <GradientContainer maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert severity="error" sx={{ borderRadius: "8px" }}>
            {error}
          </Alert>
        </motion.div>
      </GradientContainer>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GradientContainer maxWidth="lg">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Vendors
            </Typography>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={openAddVendorModal}>
              Add Vendor
            </Button>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardContent>
              <Box mb={4}>
                <TextField
                  placeholder="Search vendors by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: "#6b7280" }} />,
                    sx: { borderRadius: "8px" },
                  }}
                  fullWidth
                  sx={{ maxWidth: { sm: 350 } }}
                />
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Categories</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#6b7280" }}>
                        No vendors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <motion.tr
                        key={vendor._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{vendor.name || "N/A"}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{vendor.email || "N/A"}</Typography>
                          <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            {vendor.phone || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {vendor.categories.map((category, index) => (
                              <Chip
                                key={index}
                                label={category}
                                size="small"
                                sx={{ borderRadius: "6px", bgcolor: "#e5e7eb", color: "#111827" }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>{renderRating(vendor.rating || 0)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="More Actions">
                            <IconButton onClick={(event) => handleMenuClick(event, vendor)}>
                              <MoreHoriz />
                            </IconButton>
                          </Tooltip>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl && selectedVendor?._id === vendor._id)}
                            onClose={handleCloseMenu}
                          >
                            <MenuItem onClick={() => navigate(`/dashboard/vendors/${selectedVendor?._id}`)}>
                              View Details
                            </MenuItem>
                            <MenuItem onClick={() => navigate(`/dashboard/vendors/${selectedVendor?._id}/edit`)}>
                              Edit
                            </MenuItem>
                            <MenuItem onClick={() => handleDeleteVendor(selectedVendor?._id)}>
                              Delete
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Vendor Modal */}
        <Dialog
          open={isAddVendorModalOpen}
          onClose={closeAddVendorModal}
          maxWidth="sm"
          fullWidth
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ p: 3, background: "linear-gradient(135deg, #f9fafb, #e5e7eb)" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #4f46e5, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                Add New Vendor
              </Typography>
              <DialogContent sx={{ p: 0 }}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    sx={{ mb: 2, borderRadius: "8px" }}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    sx={{ mb: 2, borderRadius: "8px" }}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    sx={{ mb: 2, borderRadius: "8px" }}
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    sx={{ mb: 2, borderRadius: "8px" }}
                  />
                  <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    sx={{ mb: 2, borderRadius: "8px" }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="categories-label">Categories</InputLabel>
                    <Select
                      labelId="categories-label"
                      name="categories"
                      value={formData.categories}
                      onChange={handleInputChange}
                      multiple
                      required
                      label="Categories"
                      sx={{ borderRadius: "8px" }}
                    >
                      <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                      <MenuItem value="Furniture">Furniture</MenuItem>
                      <MenuItem value="Electronics">Electronics</MenuItem>
                      <MenuItem value="Stationery">Stationery</MenuItem>
                    </Select>
                  </FormControl>
                  <DialogActions>
                    <Button
                      onClick={closeAddVendorModal}
                      sx={{ borderRadius: "8px", textTransform: "none" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      disabled={isFormSubmitting}
                      sx={{ borderRadius: "8px", textTransform: "none" }}
                    >
                      {isFormSubmitting ? <CircularProgress size={24} /> : "Add Vendor"}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Box>
          </motion.div>
        </Dialog>

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%", borderRadius: "8px" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </GradientContainer>
    </ThemeProvider>
  );
}