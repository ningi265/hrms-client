import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Badge,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import { Save, ArrowLeft } from "@mui/icons-material";
import { useAuth } from "../../../../authcontext/authcontext";

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function VendorRFQsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState([]); // All RFQs fetched from the backend
  const [filteredRFQs, setFilteredRFQs] = useState([]); // RFQs filtered for the vendor
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const [selectedRFQ, setSelectedRFQ] = useState(null); // Selected RFQ for quote submission
  const [price, setPrice] = useState(""); // Price input
  const [deliveryTime, setDeliveryTime] = useState(""); // Delivery time input
  const [notes, setNotes] = useState(""); // Notes input
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Log the token and user role when the component mounts or when the user object changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Log the token
    if (user) {
      console.log("User Role:", user.role); // Log the user role
      console.log("User Email:", user.email); // Log the user email
    }
  }, [user]);

  // Fetch all RFQs from the backend
  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/rfqs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setRfqs(data);
          // Filter RFQs where the vendor's email matches
          const vendorRFQs = data.filter((rfq) =>
            rfq.vendors.some((vendor) => vendor.email === user?.email) // Match by email
          );
          setFilteredRFQs(vendorRFQs);
        } else {
          setError(data.message || "Failed to fetch RFQs");
        }
      } catch (err) {
        setError("Failed to fetch RFQs. Please check your network connection.");
        console.error("Failed to fetch RFQs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRFQs();
  }, [user]);

  // Handle RFQ selection to open the modal
  const handleSelectRFQ = (rfq) => {
    setSelectedRFQ(rfq);
    setOpenModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRFQ(null);
    setPrice("");
    setDeliveryTime("");
    setNotes("");
  };

  const handleSubmitQuote = async () => {
    if (!selectedRFQ) return;

    try {
        const token = localStorage.getItem("token");
        const userEmail = user?.email; // Log the authenticated user's email
        console.log("Token:", token);
        console.log("Authenticated User Email:", userEmail);
        console.log("Selected RFQ ID:", selectedRFQ._id);
        console.log("Price:", price);
        console.log("Delivery Time:", deliveryTime);
        console.log("Notes:", notes);

        const response = await fetch(
            `${backendUrl}/api/rfqs/${selectedRFQ._id}/quote`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    price: parseFloat(price),
                    deliveryTime,
                    notes,
                }),
            }
        );

        if (response.ok) {
            alert("Quote submitted successfully!");
            handleCloseModal();
        } else {
            const data = await response.json();
            console.log("Error Response from Backend:", data); 
           // Log the error response
            setError(data.message || "Failed to submit quote.");
        }
    } catch (err) {
        console.error("Failed to submit quote:", err); // Log the error
        setError("Failed to submit quote. Please check your network connection.");
    }
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
      <div className="flex justify-center items-center h-full">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <Container>
      <Button
        variant="outlined"
        startIcon={<ArrowLeft />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
        aria-label="Go back"
      >
        Back
      </Button>

      <Typography variant="h4" gutterBottom>
        RFQs for Vendor: {user?.name}
      </Typography>

      {filteredRFQs.length === 0 ? (
        <Alert severity="info">No RFQs found for you.</Alert>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Procurement Officer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRFQs.map((rfq) => (
                <TableRow key={rfq._id}>
                  <TableCell>{rfq._id}</TableCell>
                  <TableCell>{rfq.itemName}</TableCell>
                  <TableCell>{rfq.quantity}</TableCell>
                  <TableCell>{rfq.procurementOfficer?.name}</TableCell>
                  <TableCell>
                    {rfq.status === "open" ? (
                      <Badge color="success">Open</Badge>
                    ) : (
                      <Badge color="primary">Closed</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSelectRFQ(rfq)}
                      aria-label="Submit quote"
                    >
                      Submit Quote
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Modal for submitting a quote */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Submit Quote for {selectedRFQ?.itemName}
          </Typography>
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Delivery Time"
            type="text"
            fullWidth
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitQuote}
            sx={{ mr: 2 }}
          >
            Submit
          </Button>
          <Button variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}