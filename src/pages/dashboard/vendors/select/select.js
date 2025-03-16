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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
} from "@mui/material";
import { ArrowLeft, ExpandMore } from "@mui/icons-material";
import { useAuth } from "../../../../authcontext/authcontext";

export default function SelectVendorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch all RFQs
  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://hrms-6s3i.onrender.com/api/rfqs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setRfqs(data);
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
  }, []);

  // Handle vendor selection
  const handleSelectVendor = async (rfqId, vendorId) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://hrms-6s3i.onrender.com/api/rfqs/${rfqId}/select`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId }), // Send the selected vendor's ID
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Vendor selected and notified`);
        // Refresh the RFQs list after selection
        const updatedRfqs = rfqs.map((rfq) =>
          rfq._id === rfqId ? { ...rfq, status: "closed", selectedVendor: data.bestQuote.vendor } : rfq
        );
        setRfqs(updatedRfqs);
      } else {
        setError(data.message || "Failed to select vendor");
      }
    } catch (err) {
      setError("Failed to select vendor. Please check your network connection.");
      console.error("Failed to select vendor:", err);
    } finally {
      setIsLoading(false);
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

  if (rfqs.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <Alert severity="info">No RFQs found.</Alert>
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
      >
        Back
      </Button>

      <Typography variant="h4" gutterBottom>
        Select Vendor for RFQs
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

      {rfqs.map((rfq) => {
        // Create a map of vendors for quick lookup
        const vendorMap = {};
        rfq.vendors.forEach((vendor) => {
          vendorMap[vendor._id] = vendor;
        });

        return (
          <Accordion key={rfq._id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">
                RFQ: {rfq.itemName} (Status: {rfq.status})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {rfq.quotes.length === 0 ? (
                <Alert severity="info">No quotes submitted yet.</Alert>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendor Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Delivery Time</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rfq.quotes.map((quote) => {
                      const vendor = vendorMap[quote.vendor];
                      return (
                        <TableRow key={quote._id}>
                          <TableCell>{vendor ? vendor.name : "Unknown Vendor"}</TableCell>
                          <TableCell>{quote.price}</TableCell>
                          <TableCell>{quote.deliveryTime}</TableCell>
                          <TableCell>{quote.notes}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleSelectVendor(rfq._id, quote.vendor)}
                              disabled={rfq.status === "closed" || isLoading}
                            >
                              Select Vendor
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Container>
  );
}