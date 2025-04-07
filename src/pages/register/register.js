"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { useAuth } from "../../authcontext/authcontext";
import { Link } from "react-router-dom";
import { 
  ArrowBack, 
  Visibility, 
  VisibilityOff, 
  CheckCircle,
  Email,
  Person,
  Business,
  VpnKey,
  Phone,
  Work,
  Badge,
  Done,
  Info
} from "@mui/icons-material";

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const steps = ["Email", "Personal Info", "Company Details", "Review", "Complete"];

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Hospitality",
    "Other"
  ];

  const roles = [
    "IT/Technical",
    "Executive (CEO, CFO, etc.)",
    "Management",
    "Sales/Marketing",
    "Operations",
    "Human Resources",
    "Accounting/Finance",
    "Other"
  ];

  const handleNext = () => {
    setError("");
    
    // Validation for each step
    if (activeStep === 0 && !email) {
      setError("Please enter your email address");
      return;
    }
    if (activeStep === 1 && (!firstName || !lastName || !companyName || !password)) {
      setError("Please fill all required fields");
      return;
    }
    if (activeStep === 2 && (!industry || !role)) {
      setError("Please complete all company details");
      return;
    }
    
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const name = `${firstName} ${lastName}`;
      await register(name, email, password, role, companyName, industry, phoneNumber);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderReviewItem = (icon, label, value) => (
    <ListItem sx={{ px: 0 }}>
      <ListItemIcon sx={{ minWidth: 40 }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={label} 
        secondary={value || "Not provided"} 
        secondaryTypographyProps={{ 
          sx: { 
            color: value ? "text.primary" : "text.secondary",
            fontWeight: value ? 500 : 400
          } 
        }}
      />
    </ListItem>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
              style: { borderRadius: 12 }
            }}
          />
        );
      case 1:
        return (
          <>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="medium"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                  style: { borderRadius: 12 }
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="medium"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                  style: { borderRadius: 12 }
                }}
              />
            </Box>
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="action" />
                  </InputAdornment>
                ),
                style: { borderRadius: 12 }
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey color="action" />
                  </InputAdornment>
                ),
                style: { borderRadius: 12 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "text.secondary" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </>
        );
      case 2:
        return (
          <>
            <TextField
              select
              fullWidth
              variant="outlined"
              size="medium"
              label="Which industry best describes your company?"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work color="action" />
                  </InputAdornment>
                ),
                style: { borderRadius: 12 }
              }}
            >
              <MenuItem value="" disabled>
                Select your industry
              </MenuItem>
              {industries.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              variant="outlined"
              size="medium"
              label="What is your role in the company?"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge color="action" />
                  </InputAdornment>
                ),
                style: { borderRadius: 12 }
              }}
            >
              <MenuItem value="" disabled>
                Select your role
              </MenuItem>
              {roles.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </>
        );
      case 3:
        return (
          <Box sx={{ 
            p: 3, 
            border: "1px solid", 
            borderColor: "divider", 
            borderRadius: 3,
            backgroundColor: "background.paper",
            mb: 3
          }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Info color="primary" sx={{ mr: 1 }} />
              Review your information
            </Typography>
            <List dense sx={{ width: '100%' }}>
              {renderReviewItem(<Email />, "Email", email)}
              {renderReviewItem(<Person />, "First Name", firstName)}
              {renderReviewItem(<Person />, "Last Name", lastName)}
              {renderReviewItem(<Business />, "Company", companyName)}
              {renderReviewItem(<Work />, "Industry", industry)}
              {renderReviewItem(<Badge />, "Role", role)}
            </List>
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
                style: { borderRadius: 12 }
              }}
              helperText="We'll send a verification code to this number"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)"
      }}>
        <Card sx={{ 
          maxWidth: 500, 
          width: "100%", 
          p: 4, 
          textAlign: "center",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)"
        }}>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3
          }}>
            <Avatar sx={{ 
              bgcolor: "success.main", 
              width: 80, 
              height: 80,
              boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)"
            }}>
              <CheckCircle sx={{ fontSize: 48 }} />
            </Avatar>
          </Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Registration Successful!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Welcome to our platform. You're being redirected to your dashboard...
          </Typography>
          <CircularProgress color="primary" size={24} />
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg,rgb(1, 4, 17) 0%,rgb(54, 79, 100) 100%)",
      p: 2
    }}>
      <Box sx={{
        maxWidth: 520,
        width: "100%",
        m: "auto",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper"
      }}>
        {/* Header with Progress Indicator */}
        <Box sx={{
          background: "linear-gradient(135deg, #3f51b5 0%,rgb(4, 50, 88) 100%)",
          color: "white",
          p: 3,
          position: "relative"
        }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{ 
              mb: 2,
              '& .MuiStepLabel-label': { color: 'white !important' },
              '& .MuiStepIcon-root.Mui-completed': { color: 'white' },
              '& .MuiStepIcon-root.Mui-active': { color: 'white' }
            }}
          >
            {steps.slice(0, 4).map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Typography variant="h5" component="h1" fontWeight="600" sx={{ textAlign: 'center', mb: 1 }}>
            {steps[activeStep]}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.9 }}>
            {activeStep === 0 ? "Start with your email address" : 
             activeStep === 1 ? "Tell us about yourself" : 
             activeStep === 2 ? "Complete your company profile" : 
             activeStep === 3 ? "Verify your information" : "Complete your registration"}
          </Typography>
        </Box>

        <CardContent sx={{ background: "linear-gradient(135deg,rgb(221, 223, 237) 0%,rgb(180, 191, 200) 100%)",p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          {renderStepContent(activeStep)}

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            {activeStep > 0 && (
              <Button
                fullWidth
                size="large"
                variant="outlined"
                onClick={handleBack}
                sx={{
                  
                  height: 48,
                  borderRadius: 12,
                  textTransform: "none",
                  fontSize: 16
                }}
                startIcon={<ArrowBack />}
              >
                Back
              </Button>
            )}
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={activeStep === steps.length - 2 ? handleSubmit : handleNext}
              disabled={isLoading}
              sx={{
                height: 48,
                borderRadius: 12,
                fontWeight: 600,
                textTransform: "none",
                fontSize: 16,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)"
                }
              }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : 
                        activeStep === steps.length - 2 ? <Done /> : null}
            >
              {isLoading ? "Processing..." : 
               activeStep === steps.length - 2 ? "Complete Registration" : 
               "Continue"}
            </Button>
          </Box>

          {activeStep === 0 && (
            <>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">or</Typography>
              </Divider>
              <Typography textAlign="center" sx={{ color: "text.secondary" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ 
                  color: "#2196f3", 
                  fontWeight: 500, 
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}>
                  Sign in
                </Link>
              </Typography>
            </>
          )}
        </CardContent>
      </Box>
    </Box>
  );
}