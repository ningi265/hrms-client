import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../../../../authcontext/authcontext";

export default function VendorPODetailsPage() {
  const { token } = useAuth();
  const [vendorId, setVendorId] = useState(null);
  const [pos, setPos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // For the delivery status update dialog
  const [selectedPO, setSelectedPO] = useState(null); // Selected PO for updating delivery status
  const [trackingNumber, setTrackingNumber] = useState(""); // Tracking number input
  const [carrier, setCarrier] = useState(""); // Carrier input

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://hrms-6s3i.onrender.com/api/vendors/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch vendor details");
        const data = await response.json();
        setVendorId(data._id);
      } catch (err) {
        console.error("❌ Error fetching vendor details:", err);
        setError("Could not fetch vendor details.");
      }
    };

    fetchVendorDetails();
  }, [token]);

  useEffect(() => {
    const fetchPOs = async () => {
      if (!vendorId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://hrms-6s3i.onrender.com/api/purchase-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch purchase orders");
        const data = await response.json();

        const vendorPOs = data.filter((po) => po.vendor?._id === vendorId);
        setPos(vendorPOs);
      } catch (err) {
        console.error("❌ Error fetching POs:", err);
        setError("Could not fetch purchase orders.");
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId) fetchPOs();
  }, [vendorId, token]);

  const handleConfirmPO = async (poId) => {
    try {
      console.log("Confirming PO with ID:", poId);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://hrms-6s3i.onrender.com/api/purchase-orders/${poId}/vendor/confirm`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vendorId }),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to confirm purchase order. Status: ${response.status}`);

      const updatedPO = await response.json();

      // Update the state with the confirmed PO
      setPos((prevPos) =>
        prevPos.map((po) =>
          po._id === poId
            ? { ...po, vendorConfirmation: { confirmed: true } }
            : po
        )
      );
    } catch (err) {
      console.error("❌ Error confirming PO:", err);
      setError("Could not confirm purchase order.");
    }
  };

  const handleOpenDialog = (po) => {
    setSelectedPO(po); // Set the selected PO
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    setTrackingNumber(""); // Reset tracking number
    setCarrier(""); // Reset carrier
  };

  const handleUpdateDeliveryStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://hrms-6s3i.onrender.com/api/purchase-orders/${selectedPO._id}/delivery-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deliveryStatus: "shipped",
            trackingNumber,
            carrier,
            token
          }),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to update delivery status. Status: ${response.status}`);

      const updatedPO = await response.json();

      // Update the state with the updated PO
      setPos((prevPos) =>
        prevPos.map((po) =>
          po._id === selectedPO._id
            ? { ...po, deliveryStatus: "shipped", trackingNumber, carrier }
            : po
        )
      );

      handleCloseDialog(); // Close the dialog
    } catch (err) {
      console.error("❌ Error updating delivery status:", err);
      setError("Could not update delivery status.");
    }
  };

  const handleUpdateDelivery = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://hrms-6s3i.onrender.com/api/purchase-orders/${selectedPO._id}/delivery-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deliveryStatus: "delivered",
            trackingNumber,
            carrier,
            token
          }),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to update delivery status. Status: ${response.status}`);

      const updatedPO = await response.json();

      // Update the state with the updated PO
      setPos((prevPos) =>
        prevPos.map((po) =>
          po._id === selectedPO._id
            ? { ...po, deliveryStatus: "delivered", trackingNumber, carrier }
            : po
        )
      );

      handleCloseDialog(); // Close the dialog
    } catch (err) {
      console.error("❌ Error updating delivery status:", err);
      setError("Could not update delivery status.");
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (pos.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No Purchase Orders available for you.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Purchase Orders Assigned to You
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PO Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pos.map((po) => (
              <TableRow key={po._id}>
                <TableCell>{po._id}</TableCell>
                <TableCell>
                  {po.vendorConfirmation?.confirmed ? "Confirmed" : "Pending"}
                </TableCell>
                <TableCell>{po.deliveryStatus}</TableCell>
                <TableCell>${po.totalAmount}</TableCell>
                <TableCell>
  <Button
    variant="contained"
    color="primary"
    onClick={() => handleConfirmPO(po._id)}
    disabled={po.vendorConfirmation?.confirmed} // Disable button if already confirmed
    sx={{ mr: 2 }}
  >
    {po.vendorConfirmation?.confirmed ? "Confirmed" : "Confirm"}
  </Button>
  {!po.vendorConfirmation?.confirmed && po.deliveryStatus !== "shipped" && po.deliveryStatus !== "delivered" && (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => handleOpenDialog(po)}
      sx={{ mr: 2 }}
    >
      Mark as Shipped
    </Button>
  )}
  {po.vendorConfirmation?.confirmed && po.deliveryStatus === "shipped" && (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => handleOpenDialog(po)}
    >
      Mark as Delivered
    </Button>
  )}
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for updating delivery status */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Delivery Status</DialogTitle>
        <DialogContent>
          <TextField
            label="Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Carrier"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
  <Button onClick={handleCloseDialog}>Cancel</Button>
  {!selectedPO?.vendorConfirmation?.confirmed && selectedPO?.deliveryStatus !== "shipped" && selectedPO?.deliveryStatus !== "delivered" && (
    <Button onClick={handleUpdateDeliveryStatus} color="primary">
      Mark as Shipped
    </Button>
  )}
  {selectedPO?.vendorConfirmation?.confirmed && selectedPO?.deliveryStatus === "shipped" && (
    <Button onClick={handleUpdateDelivery} color="primary">
      Mark as Delivered
    </Button>
  )}
</DialogActions> 
      </Dialog>
    </Box>
  );
}