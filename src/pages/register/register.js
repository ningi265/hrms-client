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
import { styled } from "@mui/material/styles";

// Custom styled components for modern look
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
  width: "100%",
  maxWidth: 540
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #6366F1 0%, #4338CA 100%)`,
  color: "white",
  padding: theme.spacing(4),
  position: "relative"
}));

const StyledContent = styled(CardContent)(({ theme }) => ({
  background: "#FFFFFF",
  padding: theme.spacing(4)
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiStepLabel-label': { 
    color: 'rgba(255, 255, 255, 0.9) !important',
    fontWeight: 500,
    fontSize: '0.875rem'
  },
  '& .MuiStepIcon-root': {
    color: 'rgba(255, 255, 255, 0.4)'
  },
  '& .MuiStepIcon-root.Mui-active': { 
    color: 'white',
    boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.2)',
    borderRadius: '50%'
  },
  '& .MuiStepIcon-root.Mui-completed': { 
    color: 'white'
  },
  '& .MuiStepConnector-line': {
    borderColor: 'rgba(255, 255, 255, 0.3)'
  }
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  height: 52,
  borderRadius: 12,
  fontWeight: 600,
  textTransform: "none",
  fontSize: 16,
  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
  transition: "all 0.2s ease",
  background: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
  "&:hover": {
    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.6)",
    transform: "translateY(-1px)"
  }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  height: 52,
  borderRadius: 12,
  fontWeight: 500,
  textTransform: "none",
  fontSize: 16,
  borderColor: "#D1D5DB",
  color: "#4B5563",
  "&:hover": {
    borderColor: "#9CA3AF",
    background: "rgba(249, 250, 251, 0.8)"
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: "all 0.2s ease",
    '&:hover fieldset': {
      borderColor: '#9CA3AF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366F1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.12)'
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#4338CA'
  }
}));

const ReviewBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3.5),
  border: "1px solid #E5E7EB",
  borderRadius: 16,
  backgroundColor: "#F9FAFB",
  marginBottom: theme.spacing(3),
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)"
}));

const SuccessCard = styled(Card)(({ theme }) => ({
  maxWidth: 500, 
  width: "100%", 
  padding: theme.spacing(5), 
  textAlign: "center",
  borderRadius: 16,
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)"
}));

const SuccessAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: "#10B981", 
  width: 88, 
  height: 88,
  boxShadow: "0 8px 16px rgba(16, 185, 129, 0.2)",
  margin: "0 auto",
  marginBottom: theme.spacing(3)
}));

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
      <ListItemIcon sx={{ minWidth: 40, color: "#6366F1" }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={<Typography variant="body2" color="text.secondary">{label}</Typography>} 
        secondary={
          <Typography 
            variant="body1" 
            sx={{ 
              color: value ? "#111827" : "#9CA3AF",
              fontWeight: value ? 500 : 400,
              mt: 0.5
            }}
          >
            {value || "Not provided"}
          </Typography>
        }
      />
    </ListItem>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <StyledTextField
            fullWidth
            variant="outlined"
            size="medium"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#6B7280" }} />
                </InputAdornment>
              )
            }}
          />
        );
      case 1:
        return (
          <>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <StyledTextField
                fullWidth
                variant="outlined"
                size="medium"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#6B7280" }} />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 0 }}
              />
              <StyledTextField
                fullWidth
                variant="outlined"
                size="medium"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#6B7280" }} />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 0 }}
              />
            </Box>
            <StyledTextField
              fullWidth
              variant="outlined"
              size="medium"
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: "#6B7280" }} />
                  </InputAdornment>
                )
              }}
            />
            <StyledTextField
              fullWidth
              variant="outlined"
              size="medium"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey sx={{ color: "#6B7280" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#6B7280" }}
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
            <StyledTextField
              select
              fullWidth
              variant="outlined"
              size="medium"
              label="Which industry best describes your company?"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work sx={{ color: "#6B7280" }} />
                  </InputAdornment>
                )
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
            </StyledTextField>
            <StyledTextField
              select
              fullWidth
              variant="outlined"
              size="medium"
              label="What is your role in the company?"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge sx={{ color: "#6B7280" }} />
                  </InputAdornment>
                )
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
            </StyledTextField>
          </>
        );
      case 3:
        return (
          <ReviewBox>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center', 
                fontWeight: 600,
                color: "#111827"
              }}
            >
              <Info sx={{ mr: 1, color: "#6366F1" }} />
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
            <StyledTextField
              fullWidth
              variant="outlined"
              size="medium"
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{ mt: 2, mb: 0 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: "#6B7280" }} />
                  </InputAdornment>
                )
              }}
              helperText="We'll send a verification code to this number"
            />
          </ReviewBox>
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
        background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)"
      }}>
        <SuccessCard>
          <SuccessAvatar>
            <CheckCircle sx={{ fontSize: 48, color: "white" }} />
          </SuccessAvatar>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: "#111827" }}>
            Registration Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Welcome to our platform. You're being redirected to your dashboard...
          </Typography>
          <CircularProgress size={28} sx={{ color: "#6366F1" }} />
        </SuccessCard>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
      padding: 3
    }}>
      <StyledCard>
        {/* Header with Progress Indicator */}
        <StyledHeader>
          <StyledStepper activeStep={activeStep} alternativeLabel>
            {steps.slice(0, 4).map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </StyledStepper>
          
          <Typography variant="h5" component="h1" fontWeight="700" textAlign="center" sx={{ mb: 1 }}>
            {steps[activeStep]}
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ opacity: 0.9, fontWeight: 400 }}>
            {activeStep === 0 ? "Start with your email address" : 
             activeStep === 1 ? "Tell us about yourself" : 
             activeStep === 2 ? "Complete your company profile" : 
             activeStep === 3 ? "Verify your information" : "Complete your registration"}
          </Typography>
        </StyledHeader>

        <StyledContent>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#EF4444'
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          {renderStepContent(activeStep)}

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            {activeStep > 0 && (
              <SecondaryButton
                fullWidth
                size="large"
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBack />}
              >
                Back
              </SecondaryButton>
            )}
            <PrimaryButton
              fullWidth
              size="large"
              variant="contained"
              onClick={activeStep === steps.length - 2 ? handleSubmit : handleNext}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : 
                        activeStep === steps.length - 2 ? <Done /> : null}
            >
              {isLoading ? "Processing..." : 
               activeStep === steps.length - 2 ? "Complete Registration" : 
               "Continue"}
            </PrimaryButton>
          </Box>

          {activeStep === 0 && (
            <>
              <Divider sx={{ my: 4, '&::before, &::after': { borderColor: '#E5E7EB' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>or</Typography>
              </Divider>
              <Typography textAlign="center" sx={{ color: "#6B7280" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ 
                  color: "#6366F1", 
                  fontWeight: 600, 
                  textDecoration: "none"
                }}>
                  Sign in
                </Link>
              </Typography>
            </>
          )}
        </StyledContent>
      </StyledCard>
    </Box>
  );
}