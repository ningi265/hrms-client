import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../../../authcontext/authcontext";

export default function PurchaseOrdersPage() {
  const { token, user } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState(null);
  const [proofOfDelivery, setProofOfDelivery] = useState("");
  const [receivedBy, setReceivedBy] = useState(user ? user.name : "");
 const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;
  // Fetch purchase orders from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token)
        const response = await fetch(`${backendUrl}/api/purchase-orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch purchase orders");
        const data = await response.json();
        setPurchaseOrders(data);
      } catch (error) {
        console.error("Failed to fetch purchase orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Open the Confirm Receipt modal
  const openConfirmDialog = (poId) => {
    setSelectedPoId(poId);
    setReceivedBy(user ? user.name : ""); // Ensure receivedBy is set correctly
    setIsConfirmDialogOpen(true);
  };

  // Close the Confirm Receipt modal
  const closeConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setProofOfDelivery("");
    setReceivedBy(user ? user.name : ""); // Ensure receivedBy is reset correctly
  };

  // Handle confirming receipt of a purchase order
  const handleConfirmReceipt = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backendUrl}/api/purchase-orders/${selectedPoId}/delivery-confirmed`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            proofOfDelivery,
            receivedBy,
          }),
        }
      );

      const responseText = await response.text();
      try {
        const data = JSON.parse(responseText);
        if (!response.ok) throw new Error(data.message || "Failed to confirm receipt");
        alert("Delivery confirmed successfully!");
        setPurchaseOrders((prevOrders) =>
          prevOrders.map((po) =>
            po._id === selectedPoId ? { ...po, deliveryStatus: "confirmed" } : po
          )
        );
        closeConfirmDialog();
      } catch (error) {
        throw new Error("Failed to parse response as JSON: " + responseText);
      }
    } catch (error) {
      console.error("Error confirming receipt:", error);
      alert(error.message);
    }
  };

  // Filter purchase orders based on search term, status, and delivery status
  const filteredPurchaseOrders = purchaseOrders
    .filter((po) => (statusFilter === "all" ? true : po.status === statusFilter))
    .filter((po) =>
      deliveryStatusFilter === "all" ? true : po.deliveryStatus === deliveryStatusFilter
    )
    .filter(
      (po) =>
        po._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Purchase Orders</Typography>
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
                <TableCell>{new Date(po.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>${po.totalAmount}</TableCell>
                <TableCell>{po.status}</TableCell>
                <TableCell>{po.deliveryStatus}</TableCell>
                <TableCell>
  {po.deliveryStatus === "confirmed" ? (
    <Button variant="contained" disabled>
      Confirmed
    </Button>
  ) : po.deliveryStatus === "delivered" ? (
    <Button variant="contained" onClick={() => openConfirmDialog(po._id)}>
      Confirm Receipt
    </Button>
  ) : (
    <Button variant="contained" disabled>
      Not Ready
    </Button>
  )}
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirm Receipt Modal */}
      <Dialog open={isConfirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Confirm Receipt of Delivery</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Proof of Delivery"
            value={proofOfDelivery}
            onChange={(e) => setProofOfDelivery(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Received By"
            value={receivedBy}
            onChange={(e) => setReceivedBy(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancel</Button>
          <Button onClick={handleConfirmReceipt} variant="contained" color="primary">
            Confirm Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}