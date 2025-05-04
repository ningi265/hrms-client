import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  styled,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Add, Search, MoreHoriz } from "@mui/icons-material";
import { motion } from "framer-motion";
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
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
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

export default function PurchaseOrdersPage() {
  const { token } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedPoId, setSelectedPoId] = useState(null);
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false);
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfqId, setSelectedRfqId] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const poResponse = await fetch(`${backendUrl}/api/purchase-orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!poResponse.ok) throw new Error("Failed to fetch purchase orders");
        const poData = await poResponse.json();
        setPurchaseOrders(poData);

        const rfqResponse = await fetch(`${backendUrl}/api/rfqs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!rfqResponse.ok) throw new Error("Failed to fetch RFQs");
        const rfqData = await rfqResponse.json();
        setRfqs(rfqData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const openCreatePOModal = () => {
    setIsCreatePOModalOpen(true);
  };

  const closeCreatePOModal = () => {
    setIsCreatePOModalOpen(false);
    setSelectedRfqId("");
    setSelectedQuote(null);
  };

  const handleRfqSelection = (rfqId) => {
    setSelectedRfqId(rfqId);
    const rfq = rfqs.find((rfq) => rfq._id === rfqId);
    if (rfq && rfq.selectedVendor) {
      const selectedQuote = rfq.quotes.find((quote) => quote.vendor === rfq.selectedVendor);
      setSelectedQuote(selectedQuote);
    }
  };

  const handleCreatePO = async () => {
    if (!selectedRfqId || !selectedQuote) {
      alert("Please select an RFQ and ensure a quote is selected.");
      return;
    }

    const rfq = rfqs.find((rfq) => rfq._id === selectedRfqId);
    if (!rfq) {
      alert("RFQ not found.");
      return;
    }

    const items = [
      {
        itemName: rfq.itemName,
        product: rfq.itemName,
        quantity: rfq.quantity,
        price: selectedQuote.price,
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
          rfqId: selectedRfqId,
          items,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Purchase Order created successfully!");
        setPurchaseOrders([...purchaseOrders, data.po]);
        closeCreatePOModal();
      } else {
        throw new Error(data.message || "Failed to create PO");
      }
    } catch (error) {
      console.error("Error creating PO:", error);
      alert(error.message);
    }
  };

  const filteredPurchaseOrders = purchaseOrders
    .filter((po) => {
      if (statusFilter === "all") return true;
      return po.status === statusFilter;
    })
    .filter((po) => {
      return (
        po._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const getStatusChip = (status) => {
    const color =
      status === "approved" ? "success" : status === "rejected" ? "error" : "warning";
    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getDeliveryStatusChip = (deliveryStatus) => {
    const color =
      deliveryStatus === "shipped"
        ? "info"
        : deliveryStatus === "delivered"
        ? "success"
        : deliveryStatus === "confirmed"
        ? "primary"
        : "warning";
    return (
      <Chip
        label={deliveryStatus.charAt(0).toUpperCase() + deliveryStatus.slice(1)}
        color={color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleMenuOpen = (event, poId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedPoId(poId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedPoId(null);
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

  return (
    <ThemeProvider theme={theme}>
      <GradientContainer maxWidth="lg">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Purchase Orders
            </Typography>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={openCreatePOModal}>
              New PO
            </Button>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box mb={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search purchase orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: "#6b7280" }} />,
                    sx: { borderRadius: "8px" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>PO Number</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Delivery Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPurchaseOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPurchaseOrders.map((po) => (
                    <motion.tr
                      key={po._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                    >
                      <TableCell>{po._id}</TableCell>
                      <TableCell>{po.vendor?.name || "N/A"}</TableCell>
                      <TableCell>{formatDate(po.createdAt)}</TableCell>
                      <TableCell>${po.totalAmount?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>{getStatusChip(po.status)}</TableCell>
                      <TableCell>{getDeliveryStatusChip(po.deliveryStatus)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="More Actions">
                          <IconButton onClick={(e) => handleMenuOpen(e, po._id)}>
                            <MoreHoriz />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          anchorEl={menuAnchor}
                          open={Boolean(menuAnchor) && selectedPoId === po._id}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                          <MenuItem onClick={handleMenuClose}>Approve</MenuItem>
                          <MenuItem onClick={handleMenuClose}>Reject</MenuItem>
                        </Menu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>

        <Dialog
          open={isCreatePOModalOpen}
          onClose={closeCreatePOModal}
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
                Create New Purchase Order
              </Typography>
              <DialogContent sx={{ p: 0 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="rfq-select-label">Select RFQ</InputLabel>
                  <Select
                    labelId="rfq-select-label"
                    value={selectedRfqId}
                    onChange={(e) => handleRfqSelection(e.target.value)}
                    label="Select RFQ"
                    sx={{ borderRadius: "8px" }}
                  >
                    {rfqs.map((rfq) => (
                      <MenuItem key={rfq._id} value={rfq._id}>
                        {rfq.itemName} (Qty: {rfq.quantity})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedQuote && (
                  <Box sx={{ mt: 2, p: 2, borderRadius: "8px", background: "#ffffff", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Selected Quote
                    </Typography>
                    <Typography variant="body2">
                      <strong>Vendor:</strong> {rfqs.find((rfq) => rfq._id === selectedRfqId)?.selectedVendor || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Price:</strong> ${selectedQuote.price?.toFixed(2) || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Delivery Time:</strong> {selectedQuote.deliveryTime || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Notes:</strong> {selectedQuote.notes || "None"}
                    </Typography>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={closeCreatePOModal} sx={{ borderRadius: "8px", textTransform: "none" }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePO}
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: "8px", textTransform: "none" }}
                >
                  Create PO
                </Button>
              </DialogActions>
            </Box>
          </motion.div>
        </Dialog>
      </GradientContainer>
    </ThemeProvider>
  );
}