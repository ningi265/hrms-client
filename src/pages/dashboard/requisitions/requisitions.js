"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";

export default function NewRequisitionPage() {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    budgetCode: "",
    urgency: "medium",
    preferredSupplier: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Make a POST request to the backend endpoint
      const response = await fetch("https://hrms-6s3i.onrender.com/api/requisitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token for authentication
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit requisition");
      }

      const data = await response.json();
      toast.success(data.message || "Requisition submitted successfully.");
      navigate("/dashboard"); // Navigate to the dashboard after successful submission
    } catch (error) {
      toast.error(error.message || "Error submitting requisition. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        New Requisition
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Submit a new requisition request for approval
      </Typography>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader title="Requisition Details" subheader="Provide details about the items you need" />
          <CardContent>
            <TextField
              fullWidth
              label="Item Name"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Budget Code"
              name="budgetCode"
              value={formData.budgetCode}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Preferred Supplier (Optional)"
              name="preferredSupplier"
              value={formData.preferredSupplier}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason for Request"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              margin="normal"
            />
          </CardContent>
          <CardActions style={{ justifyContent: "space-between", padding: 16 }}>
            <Button variant="outlined" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Requisition"}
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
}