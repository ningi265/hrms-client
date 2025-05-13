import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Alert,
    Snackbar,
    Fade,
    Container,
    IconButton,
    Grid,
    InputAdornment,
    useTheme,
  } from "@mui/material";
import {
    CheckCircleOutline,
    Lock,
    ArrowBack,
    CreditCard,
    SecurityOutlined,
    InfoOutlined,
    ArrowForward,
  } from "@mui/icons-material";
import { useAuth } from "../../../../authcontext/authcontext";

export default function PaymentPage() {
  const theme = useTheme();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { invoice: initialInvoice } = location.state || {};

  const [invoice, setInvoice] = useState(initialInvoice);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [cardType, setCardType] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const token = localStorage.getItem("token");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Enhanced color palette
  const colors = {
    primary: '#5B47FB',
    primaryHover: '#4936E3',
    gradient: 'linear-gradient(135deg, #5B47FB 0%, #7C75FB 100%)',
    gradientHover: 'linear-gradient(135deg, #4936E3 0%, #6B64EB 100%)',
    success: '#10B981',
    successBg: '#ECFDF5',
    error: '#EF4444',
    errorBg: '#FEF2F2',
    cardBg: '#FFFFFF',
    lightBg: '#F9FAFB',
    border: '#E5E7EB',
    borderFocus: '#9CA3AF',
    text: '#111827',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  };

  // Detect card type
  const detectCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6011/.test(cleaned)) return 'discover';
    return '';
  };

  // Format card number with spacing and detection
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    setCardType(detectCardType(cleaned));
    
    let formatted = cleaned;
    if (cardType === 'amex') {
      formatted = cleaned.replace(/(.{4})(.{6})(.{5})/g, '$1 $2 $3');
    } else {
      formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    }
    return formatted;
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch(name) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        break;
      case 'cvv':
        formattedValue = value.replace(/\D/g, '').slice(0, 4);
        break;
      case 'cardHolder':
        formattedValue = value.toUpperCase();
        break;
    }

    setPaymentDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handlePaymentSubmit = async () => {
    if (!invoice || !token) {
      setError("Invalid invoice or session. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `${backendUrl}/api/invoices/${invoice._id}/status/pay`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paymentDetails),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (data.message === "Invalid or expired token") {
          setSnackbarMessage("Your session has expired. Please log in again.");
          setSnackbarOpen(true);
          logout();
          return;
        }
        throw new Error(data.message || "Failed to process payment");
      }

      setSnackbarMessage("Payment processed successfully!");
      setSnackbarOpen(true);
      setIsPaymentSuccessful(true);
      setInvoice((prev) => ({ ...prev, status: "paid" }));

      setTimeout(() => {
        navigate("/invoices");
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!invoice) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            boxShadow: colors.shadow,
            bgcolor: colors.errorBg,
            border: `1px solid ${colors.error}20`,
          }}
        >
          No invoice data found. Please go back and try again.
        </Alert>
      </Container>
    );
  }

  const isFormValid = paymentDetails.cardNumber.length >= 15 && 
                     paymentDetails.expiryDate.length === 5 && 
                     paymentDetails.cvv.length >= 3 &&
                     paymentDetails.cardHolder.length >= 2;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #FAFAFA 0%, #F3F4F6 100%)',
        overflow: 'hidden',
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          py: { xs: 2, md: 3 },
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 2, md: 3 },
          height: { xs: 'auto', md: 60 },
        }}>
          <IconButton 
            onClick={() => navigate("/invoices")}
            sx={{ 
              mr: 2, 
              color: colors.textSecondary,
              '&:hover': {
                bgcolor: `${colors.primary}10`,
                color: colors.primary,
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowBack />
          </IconButton>
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: colors.text,
                letterSpacing: '-0.5px',
              }}
            >
              Secure Payment
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: colors.textSecondary,
                fontSize: '0.875rem',
              }}
            >
              Complete your payment securely
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lock sx={{ fontSize: 16, color: colors.success }} />
            <Typography 
              variant="caption" 
              sx={{ 
                color: colors.success,
                fontWeight: 600,
              }}
            >
              256-bit SSL
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3} sx={{ flex: 1, overflow: 'hidden' }}>
          {/* Order Summary */}
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.cardBg,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: colors.shadow,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ 
                p: 3,
                background: `linear-gradient(135deg, ${colors.lightBg} 0%, ${colors.cardBg} 100%)`,
                borderBottom: `1px solid ${colors.border}`,
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: colors.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Payment Summary
                  <SecurityOutlined sx={{ fontSize: 16, color: colors.primary }} />
                </Typography>
              </Box>
              
              <Box sx={{ p: 3, flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>Recipient</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text }}>
                    {invoice.vendor?.name}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>Invoice #</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text }}>
                    {invoice.invoiceNumber}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>Status</Typography>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.25,
                      borderRadius: 2,
                      bgcolor: invoice.status === 'paid' ? colors.successBg : `${colors.primary}15`,
                      border: `1px solid ${invoice.status === 'paid' ? colors.success : colors.primary}20`,
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: invoice.status === 'paid' ? colors.success : colors.primary,
                        fontWeight: 600,
                      }}
                    >
                      {invoice.status.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  py: 2,
                  borderTop: `1px solid ${colors.border}`,
                  mt: 'auto',
                }}>
                  <Typography variant="h6" sx={{ color: colors.textSecondary }}>Total Amount</Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: colors.text,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    ${invoice.amountDue}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Payment Form */}
          <Grid item xs={12} md={7}>
            {!isPaymentSuccessful ? (
              <Fade in={true}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    borderRadius: 3,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.cardBg,
                    height: '100%',
                    boxShadow: colors.shadow,
                    overflow: 'auto',
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 2, 
                        color: colors.text,
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Card Information
                    </Typography>

                    <TextField
                      fullWidth
                      label="Card Number"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      disabled={isProcessing}
                      size="small"
                      onFocus={() => setFocusedField('cardNumber')}
                      onBlur={() => setFocusedField('')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CreditCard 
                              sx={{ 
                                color: focusedField === 'cardNumber' ? colors.primary : colors.textLight,
                                transition: 'color 0.2s ease',
                                fontSize: 18
                              }} 
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 0,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px 8px 0 0',
                          backgroundColor: focusedField === 'cardNumber' ? `${colors.primary}05` : 'transparent',
                          transition: 'all 0.2s ease',
                          '& fieldset': {
                            borderColor: colors.border,
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: colors.borderFocus,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.primary,
                            borderWidth: '1px',
                            boxShadow: `0 0 0 3px ${colors.primary}20`,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                          fontSize: '0.875rem',
                        },
                      }}
                    />

                    <Box sx={{ display: 'flex' }}>
                      <TextField
                        fullWidth
                        placeholder="MM / YY"
                        name="expiryDate"
                        value={paymentDetails.expiryDate}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        size="small"
                        onFocus={() => setFocusedField('expiryDate')}
                        onBlur={() => setFocusedField('')}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            backgroundColor: focusedField === 'expiryDate' ? `${colors.primary}05` : 'transparent',
                            transition: 'all 0.2s ease',
                            '& fieldset': {
                              borderColor: colors.border,
                              borderTop: 0,
                              borderRight: 0,
                              borderWidth: '1px',
                            },
                            '&:hover fieldset': {
                              borderColor: colors.borderFocus,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              borderWidth: '1px',
                              boxShadow: `0 0 0 3px ${colors.primary}20`,
                            },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        placeholder="CVC"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        size="small"
                        onFocus={() => setFocusedField('cvv')}
                        onBlur={() => setFocusedField('')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <InfoOutlined 
                                sx={{ 
                                  color: focusedField === 'cvv' ? colors.primary : colors.textLight,
                                  transition: 'color 0.2s ease',
                                  fontSize: 18
                                }} 
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '0 0 8px 0',
                            backgroundColor: focusedField === 'cvv' ? `${colors.primary}05` : 'transparent',
                            transition: 'all 0.2s ease',
                            '& fieldset': {
                              borderColor: colors.border,
                              borderTop: 0,
                              borderWidth: '1px',
                            },
                            '&:hover fieldset': {
                              borderColor: colors.borderFocus,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              borderWidth: '1px',
                              boxShadow: `0 0 0 3px ${colors.primary}20`,
                            },
                          },
                        }}
                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      name="cardHolder"
                      value={paymentDetails.cardHolder}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      disabled={isProcessing}
                      size="small"
                      onFocus={() => setFocusedField('cardHolder')}
                      onBlur={() => setFocusedField('')}
                      sx={{
                        mt: 3,
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: focusedField === 'cardHolder' ? `${colors.primary}05` : 'transparent',
                          transition: 'all 0.2s ease',
                          '& fieldset': {
                            borderColor: colors.border,
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: colors.borderFocus,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.primary,
                            borderWidth: '1px',
                            boxShadow: `0 0 0 3px ${colors.primary}20`,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                          fontSize: '0.875rem',
                        },
                      }}
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handlePaymentSubmit}
                      disabled={isProcessing || !isFormValid}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        background: colors.gradient,
                        fontSize: '15px',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: colors.shadow,
                        border: 'none',
                        '&:hover': {
                          background: colors.gradientHover,
                          boxShadow: colors.shadowHover,
                          transform: 'translateY(-1px)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        '&:disabled': {
                          bgcolor: colors.lightBg,
                          color: colors.textLight,
                          boxShadow: 'none',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isProcessing ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={18} color="inherit" />
                          Processing Payment...
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          Pay ${invoice.amountDue}
                          <ArrowForward sx={{ fontSize: 18 }} />
                        </Box>
                      )}
                    </Button>

                    {error && (
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mt: 2, 
                          borderRadius: 2,
                          border: `1px solid ${colors.error}30`,
                          bgcolor: colors.errorBg,
                          py: 0.5,
                          '& .MuiAlert-icon': {
                            color: colors.error,
                          },
                        }}
                      >
                        {error}
                      </Alert>
                    )}
                  </Box>
                </Paper>
              </Fade>
            ) : (
              <Fade in={true}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    borderRadius: 3,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.cardBg,
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: colors.shadow,
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      bgcolor: colors.successBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      mx: 'auto',
                      animation: 'scaleIn 0.5s ease-out',
                      '@keyframes scaleIn': {
                        '0%': { transform: 'scale(0)', opacity: 0 },
                        '100%': { transform: 'scale(1)', opacity: 1 },
                      }
                    }}
                  >
                    <CheckCircleOutline 
                      sx={{ 
                        fontSize: 36, 
                        color: colors.success,
                      }} 
                    />
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: colors.text, 
                      mb: 1,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Payment Successful!
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 1 }}>
                    Your payment of <strong style={{ color: colors.text }}>${invoice.amountDue}</strong> has been processed successfully.
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: colors.textLight }}>
                    Invoice #{invoice.invoiceNumber} is now marked as paid.
                  </Typography>
                  
                  <Box sx={{ 
                    mt: 4,
                    pt: 3,
                    borderTop: `1px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}>
                    <CircularProgress size={16} thickness={4} sx={{ color: colors.primary }} />
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      Redirecting to invoices...
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ 
          mt: 'auto', 
          pt: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          height: 48,
          borderTop: `1px solid ${colors.border}`,
          bgcolor: `linear-gradient(to top, ${colors.lightBg} 0%, transparent 100%)`,
          mx: -4,
          px: 4,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography variant="caption" sx={{ color: colors.textSecondary, '&:hover': { color: colors.primary } }}>
              Terms
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary, '&:hover': { color: colors.primary } }}>
              Privacy
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary, '&:hover': { color: colors.primary } }}>
              Support
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: colors.textLight }}>
              Powered by
            </Typography>
            <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 600 }}>
              SecurePay
            </Typography>
          </Box>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutline sx={{ fontSize: 20, color: colors.success }} />
              {snackbarMessage}
            </Box>
          }
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              borderRadius: 2,
              bgcolor: '#FFFFFF',
              color: colors.text,
              boxShadow: colors.shadowHover,
              border: `1px solid ${colors.border}`,
            }
          }}
        />
      </Container>
    </Box>
  );
}