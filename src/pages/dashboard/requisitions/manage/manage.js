import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  CircularProgress,
  Alert,
  Chip,
  Box,
  Snackbar,
} from "@mui/material";
import { Check, X, AlertCircle } from "lucide-react";

export default function ManageRequisitionsPage() {
  const [requisitions, setRequisitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch pending requisitions
  useEffect(() => {
    const fetchPendingRequisitions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/requisitions/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setRequisitions(data);
      } catch (err) {
        setError("Failed to fetch requisitions");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequisitions();
  }, []);

  // Handle accept/reject action
  const handleAction = async (requisitionId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/requisitions/${requisitionId}/${action}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        // Update the requisition status in the UI
        setRequisitions((prev) =>
          prev.map((req) =>
            req._id === requisitionId ? { ...req, status: action === "approve" ? "approved" : "rejected" } : req
          )
        );

        // Show success notification
        setSnackbarMessage(`Requisition ${action === "approve" ? "approved" : "rejected"} successfully!`);
        setSnackbarOpen(true);
      } else {
        setError(data.message || "Failed to update requisition");
      }
    } catch (err) {
      setError("Failed to update requisition");
      console.error(err);
    }
  };

  // Close the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh" // Full viewport height
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-destructive gap-2">
        <AlertCircle className="h-8 w-8" />
        <Typography variant="h6">{error}</Typography>
      </div>
    );
  }

  return (
    <Container  maxWidth="lg"
    sx={{
      py: 4,
      backgroundColor: "white", // Set background to black
      minHeight: "100vh", // Ensure it covers the full height
      color: "white", // Set text color to white
    }}>
      <Typography variant="h4" gutterBottom>
        Manage Requisitions
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Review and approve or reject pending requisitions.
      </Typography>

      {requisitions.length === 0 ? (
        <Alert severity="info">No pending requisitions found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Budget Code</TableCell>
                <TableCell>Urgency</TableCell>
                <TableCell>Preferred Supplier</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requisitions.map((requisition) => (
                <TableRow key={requisition._id}>
                  <TableCell>{requisition.employee?.name}</TableCell>
                  <TableCell>{requisition.itemName}</TableCell>
                  <TableCell>{requisition.quantity}</TableCell>
                  <TableCell>{requisition.budgetCode}</TableCell>
                  <TableCell>
                    <Chip
                      label={requisition.urgency}
                      color={requisition.urgency === "high" ? "error" : "warning"}
                    />
                  </TableCell>
                  <TableCell>{requisition.preferredSupplier}</TableCell>
                  <TableCell>{requisition.reason}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Check />}
                      onClick={() => handleAction(requisition._id, "approve")}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<X />}
                      onClick={() => handleAction(requisition._id, "reject")}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar for success notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Auto-close after 6 seconds
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position at bottom-right
      />
    </Container>
  );
}