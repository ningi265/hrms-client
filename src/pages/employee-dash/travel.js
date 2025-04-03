import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  InputAdornment,
  MenuItem,
  Typography,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { Article } from '@mui/icons-material';
import { useAuth } from "../../authcontext/authcontext";
import MuiAlert from '@mui/material/Alert';

// Snackbar Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TravelRequestForm = () => {
  const [formData, setFormData] = useState({
    purpose: '',
    departureDate: null,
    returnDate: null,
    location: '',
    fundingCodes: '',
    meansOfTravel: '',
    currency: 'MWK',
    travelType: 'local',
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity (success, error, etc.)

  const navigate = useNavigate();
  const { token } = useAuth();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user._id) {
        throw new Error("User not logged in or user ID not found");
      }

      // Validate dates
      if (formData.departureDate && formData.returnDate && formData.departureDate > formData.returnDate) {
        throw new Error("Return date must be after the departure date");
      }

      const payload = {
        employee: user._id,
        purpose: formData.purpose,
        departureDate: formData.departureDate ? formData.departureDate.toISOString() : null,
        returnDate: formData.returnDate ? formData.returnDate.toISOString() : null,
        location: formData.location,
        fundingCodes: formData.fundingCodes,
        meansOfTravel: formData.meansOfTravel,
        travelType: 'local',
        currency: 'MWK',
      };

      const response = await fetch('http://localhost:4000/api/travel-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Travel request created:", data);

        // Show success message
        setSnackbarMessage("Travel request submitted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Reset form after successful submission
        setFormData({
          purpose: '',
          departureDate: null,
          returnDate: null,
          location: '',
          fundingCodes: '',
          meansOfTravel: 'own',
        });

        // Redirect to travel management page after a short delay
        setTimeout(() => {
          navigate('/travel/manage/dash');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);

        // Show error message
        setSnackbarMessage(errorData.message || "Failed to submit travel request");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error submitting travel request:', error);

      // Show error message
      setSnackbarMessage(error.message || "An error occurred while submitting the travel request");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 3, p: 3 }}>
      <CardHeader title="Travel Request Form" titleTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }} />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purpose of Travel"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Article color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Departure Date"
                  value={formData.departureDate}
                  onChange={(date) => setFormData((prev) => ({ ...prev, departureDate: date }))}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Return Date"
                  value={formData.returnDate}
                  onChange={(date) => setFormData((prev) => ({ ...prev, returnDate: date }))}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Truck color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Funding Codes"
                name="fundingCodes"
                value={formData.fundingCodes}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Article color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Means of Travel"
                name="meansOfTravel"
                value={formData.meansOfTravel}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Truck color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="own">Own Vehicle</MenuItem>
                <MenuItem value="company">Company Vehicle</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting} // Disable button while submitting
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Submit Travel Request"}
            </Button>
          </CardActions>
        </form>
      </CardContent>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default TravelRequestForm;