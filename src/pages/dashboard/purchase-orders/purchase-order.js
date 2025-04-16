import { useState, useEffect } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Add, Search, MoreHoriz } from "@mui/icons-material";
import { useAuth } from "../../../authcontext/authcontext";

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
  // Fetch purchase orders and RFQs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch purchase orders
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

        // Fetch RFQs
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

  // Open the Create PO modal
  const openCreatePOModal = () => {
    setIsCreatePOModalOpen(true);
  };

  // Close the Create PO modal
  const closeCreatePOModal = () => {
    setIsCreatePOModalOpen(false);
    setSelectedRfqId("");
    setSelectedQuote(null);
  };

  // Handle RFQ selection
  const handleRfqSelection = (rfqId) => {
    setSelectedRfqId(rfqId);
    const rfq = rfqs.find((rfq) => rfq._id === rfqId);
    if (rfq && rfq.selectedVendor) {
      const selectedQuote = rfq.quotes.find(
        (quote) => quote.vendor === rfq.selectedVendor
      );
      setSelectedQuote(selectedQuote);
    }
  };

  // Handle PO creation
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

    // Include itemName in the items array
    const items = [
      {
        itemName: rfq.itemName, // Add itemName here
        product: rfq.itemName,  // Optional: Include product if needed
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

  // Filter and search logic
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

  // Status badge styling
  const getStatusBadge = (status) => {
    const color =
      status === "approved"
        ? "success"
        : status === "rejected"
        ? "error"
        : "warning";
    return (
      <Badge color={color} variant="dot">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Delivery status badge styling
  const getDeliveryStatusBadge = (deliveryStatus) => {
    const color =
      deliveryStatus === "shipped"
        ? "info"
        : deliveryStatus === "delivered"
        ? "success"
        : deliveryStatus === "confirmed"
        ? "primary"
        : "warning";
    return (
      <Badge color={color} variant="dot">
        {deliveryStatus.charAt(0).toUpperCase() + deliveryStatus.slice(1)}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle menu open and close
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header and New PO Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Purchase Orders</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreatePOModal}>
          New PO
        </Button>
      </Box>

      {/* Search and Filter Controls */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search purchase orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <Search /> }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Purchase Orders Table */}
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPurchaseOrders.map((po) => (
              <TableRow key={po._id}>
                <TableCell>{po._id}</TableCell>
                <TableCell>{po.vendor?.name}</TableCell>
                <TableCell>{formatDate(po.createdAt)}</TableCell>
                <TableCell>${po.totalAmount}</TableCell>
                <TableCell>{getStatusBadge(po.status)}</TableCell>
                <TableCell>{getDeliveryStatusBadge(po.deliveryStatus)}</TableCell>
                <TableCell>
                  <Button aria-label="More actions" onClick={(e) => handleMenuOpen(e, po._id)}>
                    <MoreHoriz />
                  </Button>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create PO Modal */}
      <Dialog open={isCreatePOModalOpen} onClose={closeCreatePOModal}>
        <DialogTitle>Create New Purchase Order</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 400 }}>
            {/* Select RFQ Dropdown */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Select RFQ</InputLabel>
              <Select
                value={selectedRfqId}
                onChange={(e) => handleRfqSelection(e.target.value)}
              >
                {rfqs.map((rfq) => (
                  <MenuItem key={rfq._id} value={rfq._id}>
                    {rfq.itemName} (Qty: {rfq.quantity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Display Selected Quote and Vendor */}
            {selectedQuote && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Selected Quote</Typography>
                <Typography><strong>Vendor:</strong> {rfqs.find((rfq) => rfq._id === selectedRfqId)?.selectedVendor}</Typography>
                <Typography><strong>Price:</strong> ${selectedQuote.price}</Typography>
                <Typography><strong>Delivery Time:</strong> {selectedQuote.deliveryTime}</Typography>
                <Typography><strong>Notes:</strong> {selectedQuote.notes}</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreatePOModal}>Cancel</Button>
          <Button onClick={handleCreatePO} variant="contained" color="primary">
            Create PO
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}