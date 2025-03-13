import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { Save, ArrowLeft } from "@mui/icons-material";
import { useAuth } from "../../../../../authcontext/authcontext";

export default function SubmitQuotePage() {
  const location = useLocation();
  const { state } = location;
  const rfq = state?.rfq;
  const navigate = useNavigate();
  const [price, setPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://hrms-6s3i.onrender.com/api/rfqs/${rfq.id}/quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price, deliveryTime, notes }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setSubmitError(null);
        setTimeout(() => navigate("/vendors/quotes"), 2000);
      } else {
        setSubmitError(data.message || "Failed to submit quote");
      }
    } catch (err) {
      setSubmitError("Failed to submit quote. Please try again.");
      console.error("Failed to submit quote:", err);
    }
  };

  if (!rfq) {
    return (
      <div className="flex justify-center items-center h-full">
        <Alert severity="warning">RFQ details are missing.</Alert>
      </div>
    );
  }

  if (rfq.status === "closed") {
    return (
      <div className="flex justify-center items-center h-full">
        <Alert severity="error">This RFQ is closed. You cannot submit a quote.</Alert>
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
        Submit Quote for RFQ: {rfq.itemName}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Delivery Time (in days)"
            type="number"
            fullWidth
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Notes"
            multiline
            rows={4}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mb: 2 }}
          />
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Quote submitted successfully! Redirecting...
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<Save />}
          >
            Submit Quote
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
