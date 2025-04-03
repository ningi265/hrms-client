"use client"

import { useState, useEffect } from "react"
import React from "react";
import { useNavigate } from "react-router-dom"
import { format, differenceInDays } from "date-fns"
import {
  ArrowBack,
  CalendarToday,
  CreditCard,
  Language,
  HelpOutline,
  Info,
  Flight,
  CloudUpload,
  Close,
  CheckCircle,
  AccessTime,
  Place,
  Description,
} from "@mui/icons-material"
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  TextareaAutosize,
  Popover,
  Divider,
  Tabs,
  Tab,
  Tooltip,
  Alert,
  AlertTitle,
  Chip,
  LinearProgress,
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Paper,
  CircularProgress
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { de } from "date-fns/locale"

export default function InternationalTravelRequest() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details")
  const [formData, setFormData] = useState({
    purpose: "",
    departureDate: null,
    returnDate: null,
    travelDays: 0,
    country: "",
    fundingCodes: "",
    meansOfTravel: "company",
    currency: "",
    documents: [],
    location: "",
    travelType: "international",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const countries = [
    { name: "United Kingdom", code: "GB", currencies: ["GBP", "EUR"] },
    { name: "France", code: "FR", currencies: ["EUR"] },
    { name: "Germany", code: "DE", currencies: ["EUR"] },
    { name: "Japan", code: "JP", currencies: ["JPY"] },
    { name: "Australia", code: "AU", currencies: ["AUD"] },
    { name: "Canada", code: "CA", currencies: ["CAD"] },
    { name: "Brazil", code: "BR", currencies: ["BRL"] },
    { name: "India", code: "IN", currencies: ["INR"] },
    { name: "South Africa", code: "ZA", currencies: ["ZAR"] },
    { name: "China", code: "CN", currencies: ["CNY"] },
  ]

  useEffect(() => {
    if (formData.departureDate && formData.returnDate) {
      const days = differenceInDays(formData.returnDate, formData.departureDate) + 1
      setFormData((prev) => ({ ...prev, travelDays: days > 0 ? days : 0 }))
    }
  }, [formData.departureDate, formData.returnDate])

  useEffect(() => {
    let completedFields = 0
    const totalFields = 7

    if (formData.purpose) completedFields++
    if (formData.departureDate) completedFields++
    if (formData.returnDate) completedFields++
    if (formData.country) completedFields++
    if (formData.fundingCodes) completedFields++
    if (formData.currency) completedFields++
    if (Array.isArray(formData.documents) && formData.documents.length > 0) completedFields++

    setProgress((completedFields / totalFields) * 100)
  }, [formData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }))

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleCountryChange = (e) => {
    const value = e.target.value
    const selectedCountry = countries.find((country) => country.code === value)
    setFormData((prev) => ({
      ...prev,
      country: value,
      currency: selectedCountry?.currencies[0] || "",
    }))

    if (errors.country) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.country
        return newErrors
      })
    }
  }

  const handleCurrencyChange = (e) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, currency: value }))

    if (errors.currency) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.currency
        return newErrors
      })
    }
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({
      ...prev,
      documents: [...(Array.isArray(prev.documents) ? prev.documents : []), ...files],
    }))

    if (errors.documents) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.documents
        return newErrors
      })
    }
  }

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: Array.isArray(prev.documents) ? prev.documents.filter((_, i) => i !== index) : [],
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required"
    if (!formData.departureDate) newErrors.departureDate = "Departure date is required"
    if (!formData.returnDate) newErrors.returnDate = "Return date is required"
    if (formData.departureDate && formData.returnDate && formData.departureDate > formData.returnDate) {
      newErrors.returnDate = "Return date must be after departure date"
    }
    if (!formData.country) newErrors.country = "Country is required"
    if (!formData.fundingCodes.trim()) newErrors.fundingCodes = "Funding codes are required"
    if (!formData.currency) newErrors.currency = "Currency is required"
    if (!Array.isArray(formData.documents) || formData.documents.length === 0) {
      newErrors.documents = "At least one document is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user._id) {
        throw new Error("User not logged in or user ID not found");
      }

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
        travelType: 'international',
        currency: formData.currency,
        documents: Array.isArray(formData.documents) ? formData.documents : [],
        destination: formData.country,
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
        setSnackbarMessage("Travel request submitted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setFormData({
          purpose: '',
          departureDate: null,
          returnDate: null,
          travelDays: 0,
          country: '',
          fundingCodes: '',
          meansOfTravel: 'company',
          currency: '',
          documents: [],
          location: '',
        });

        setTimeout(() => {
          navigate('/travel/manage/dash');
        }, 2000);
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.message || "Failed to submit travel request");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message || "An error occurred while submitting the travel request");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableCurrencies = () => {
    const selectedCountry = countries.find((country) => country.code === formData.country)
    return selectedCountry?.currencies || []
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(to bottom, #fafafa, #f5f5f5)' }}>
         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10, 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          px: { xs: 2, md: 3 }, 
          borderBottom: '1px solid #e0e0e0',
          background: 'rgba(250, 250, 250, 0.8)',
          backdropFilter: 'blur(12px)'
        }}>
          <IconButton
            onClick={() => navigate("/travel/manage/dash")}
            sx={{ mr: 2, '&:hover': { backgroundColor: 'primary.light' } }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
              <Flight sx={{ color: 'primary.main', fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" component="h1">International Travel Request</Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="caption" color="text.secondary">Completion</Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ width: 128, mt: 0.5, height: 2 }} 
              />
            </Box>
            <Chip 
              label="Details" 
              color={activeTab === "details" ? "primary" : "default"} 
              variant={activeTab === "details" ? "filled" : "outlined"} 
              size="small" 
            />
            <Chip 
              label="Funding" 
              color={activeTab === "funding" ? "primary" : "default"} 
              variant={activeTab === "funding" ? "filled" : "outlined"} 
              size="small" 
            />
            <Chip 
              label="Documents" 
              color={activeTab === "documents" ? "primary" : "default"} 
              variant={activeTab === "documents" ? "filled" : "outlined"} 
              size="small" 
            />
          </Box>
        </Paper>

        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
          {showSuccess ? (
            <Card sx={{ borderColor: 'success.light', bgcolor: 'success.light', boxShadow: 3 }}>
              <CardContent sx={{ pt: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56, mb: 1 }}>
                    <CheckCircle sx={{ color: 'success.dark', fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h4" color="success.dark" fontWeight="bold">Request Submitted Successfully!</Typography>
                  <Typography color="success.dark" textAlign="center" maxWidth="md">
                    Your international travel request has been submitted and is now pending approval. You will be
                    redirected to your requests page.
                  </Typography>
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/travel/manage/dash")}
                      sx={{ borderColor: 'success.light', color: 'success.dark', '&:hover': { bgcolor: 'success.light' } }}
                    >
                      Return to Dashboard
                    </Button>
                    <Button
                      onClick={() => navigate("/travel/requests")}
                      sx={{ bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } }}
                    >
                      View My Requests
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gap: 3 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, newValue) => setActiveTab(newValue)} 
                  sx={{ width: '100%', '& .MuiTabs-indicator': { display: 'none' } }}
                >
                  <Tab 
                    value="details"
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Place sx={{ fontSize: 16, mr: 1 }} />
                        Travel Details
                      </Box>
                    }
                    sx={{
                      minHeight: 48,
                      borderRadius: 2,
                      bgcolor: activeTab === 'details' ? 'background.paper' : 'transparent',
                      boxShadow: activeTab === 'details' ? 1 : 'none',
                      '&.Mui-selected': { color: 'text.primary' }
                    }}
                  />
                  <Tab 
                    value="funding"
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCard sx={{ fontSize: 16, mr: 1 }} />
                        Funding & Transport
                      </Box>
                    }
                    sx={{
                      minHeight: 48,
                      borderRadius: 2,
                      bgcolor: activeTab === 'funding' ? 'background.paper' : 'transparent',
                      boxShadow: activeTab === 'funding' ? 1 : 'none',
                      '&.Mui-selected': { color: 'text.primary' }
                    }}
                  />
                  <Tab 
                    value="documents"
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Description sx={{ fontSize: 16, mr: 1 }} />
                        Documents & Submit
                      </Box>
                    }
                    sx={{
                      minHeight: 48,
                      borderRadius: 2,
                      bgcolor: activeTab === 'documents' ? 'background.paper' : 'transparent',
                      boxShadow: activeTab === 'documents' ? 1 : 'none',
                      '&.Mui-selected': { color: 'text.primary' }
                    }}
                  />
                </Tabs>

                {/* Travel Details Tab */}
                {activeTab === "details" && (
                  <Card sx={{ boxShadow: 3, border: 'none' }}>
                    <CardHeader
                      title="Travel Information"
                      subheader="Enter the basic details about your international travel"
                      sx={{ 
                        bgcolor: 'primary.light', 
                        borderTopLeftRadius: '8px', 
                        borderTopRightRadius: '8px',
                        pb: 2 
                      }}
                      avatar={
                        <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                          <Place sx={{ color: 'primary.main' }} />
                        </Avatar>
                      }
                    />
                    <CardContent sx={{ pt: 3, display: 'grid', gap: 3 }}>
                      <Box sx={{ display: 'grid', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Purpose of Travel
                          </Typography>
                          <Tooltip title="Explain why this travel is necessary for business purposes">
                            <HelpOutline sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
                          </Tooltip>
                        </Box>
                        <TextField
                          multiline
                          rows={4}
                          name="purpose"
                          placeholder="Describe the purpose of your travel"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          error={!!errors.purpose}
                          helperText={errors.purpose && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Close sx={{ fontSize: 14 }} /> {errors.purpose}
                            </Box>
                          )}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: errors.purpose ? 'error.main' : 'primary.main',
                                boxShadow: errors.purpose ? 'none' : '0 0 0 2px rgba(25, 118, 210, 0.2)'
                              }
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 3 }}>
                        <Box sx={{ display: 'grid', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">Departure Date</Typography>
                          <DatePicker
                            value={formData.departureDate}
                            onChange={(date) => handleDateChange(date, "departureDate")}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={!!errors.departureDate}
                                helperText={errors.departureDate && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Close sx={{ fontSize: 14 }} /> {errors.departureDate}
                                  </Box>
                                )}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                      borderColor: errors.departureDate ? 'error.main' : 'primary.main'
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                        </Box>

                        <Box sx={{ display: 'grid', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">Return Date</Typography>
                          <DatePicker
                            value={formData.returnDate}
                            onChange={(date) => handleDateChange(date, "returnDate")}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={!!errors.returnDate}
                                helperText={errors.returnDate && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Close sx={{ fontSize: 14 }} /> {errors.returnDate}
                                  </Box>
                                )}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                      borderColor: errors.returnDate ? 'error.main' : 'primary.main'
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ display: 'grid', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">Total Travel Days</Typography>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime color="primary" />
                          <Typography fontWeight="medium">{formData.travelDays || 0} days</Typography>
                        </Paper>
                      </Box>

                      <Box sx={{ display: 'grid', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">Destination Country</Typography>
                        <Select
                          value={formData.country}
                          onChange={handleCountryChange}
                          error={!!errors.country}
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: errors.country ? 'error.main' : 'primary.main'
                              }
                            }
                          }}
                        >
                          <MenuItem value="" disabled>Select a country</MenuItem>
                          {countries.map((country) => (
                            <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>
                          ))}
                        </Select>
                        {errors.country && (
                          <Typography variant="caption" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Close sx={{ fontSize: 14 }} /> {errors.country}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2, bgcolor: 'action.hover' }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/travel/manage/dash")}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setActiveTab("funding")}
                      >
                        Next: Funding & Transport
                      </Button>
                    </CardActions>
                  </Card>
                )}

                {/* Funding & Transport Tab */}
                {activeTab === "funding" && (
                  <Card sx={{ boxShadow: 3, border: 'none' }}>
                    <CardHeader
                      title="Funding & Transportation"
                      subheader="Provide funding details and transportation information"
                      sx={{ 
                        bgcolor: 'primary.light', 
                        borderTopLeftRadius: '8px', 
                        borderTopRightRadius: '8px',
                        pb: 2 
                      }}
                      avatar={
                        <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                          <CreditCard sx={{ color: 'primary.main' }} />
                        </Avatar>
                      }
                    />
                    <CardContent sx={{ pt: 3, display: 'grid', gap: 3 }}>
                      <Box sx={{ display: 'grid', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Funding Codes
                          </Typography>
                          <Tooltip title="Enter the charge or funding codes for this travel">
                            <HelpOutline sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
                          </Tooltip>
                        </Box>
                        <TextField
                          name="fundingCodes"
                          placeholder="e.g., INT-2023-456, DEPT-TRAVEL-789"
                          value={formData.fundingCodes}
                          onChange={handleInputChange}
                          error={!!errors.fundingCodes}
                          helperText={errors.fundingCodes && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Close sx={{ fontSize: 14 }} /> {errors.fundingCodes}
                            </Box>
                          )}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: errors.fundingCodes ? 'error.main' : 'primary.main',
                                boxShadow: errors.fundingCodes ? 'none' : '0 0 0 2px rgba(25, 118, 210, 0.2)'
                              }
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'grid', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">Means of Travel</Typography>
                        <RadioGroup
                          value={formData.meansOfTravel}
                          onChange={(e) => setFormData(prev => ({ ...prev, meansOfTravel: e.target.value }))}
                        >
                          <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                            <FormControlLabel 
                              value="company" 
                              control={<Radio color="primary" />} 
                              label="Company Vehicle" 
                            />
                          </Paper>
                          <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                            <FormControlLabel 
                              value="personal" 
                              control={<Radio color="primary" />} 
                              label="Personal Vehicle" 
                            />
                          </Paper>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <FormControlLabel 
                              value="other" 
                              control={<Radio color="primary" />} 
                              label="Other (Flight, Train, etc.)" 
                            />
                          </Paper>
                        </RadioGroup>
                      </Box>

                      <Divider />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                          <Language sx={{ color: 'primary.main', fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="h6">Currency Selection</Typography>
                      </Box>

                      <Alert severity="info" sx={{ bgcolor: 'info.light', borderColor: 'info.main' }}>
                        <AlertTitle>Currency Information</AlertTitle>
                        Select the currency you'll need for your international travel. This will be used for fund
                        transfers and expense tracking.
                      </Alert>

                      <Box sx={{ display: 'grid', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">Currency</Typography>
                        <Select
                          value={formData.currency}
                          onChange={handleCurrencyChange}
                          error={!!errors.currency}
                          disabled={!formData.country}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: errors.currency ? 'error.main' : 'primary.main'
                              }
                            }
                          }}
                        >
                          {getAvailableCurrencies().map((currency) => (
                            <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                          ))}
                        </Select>
                        {errors.currency && (
                          <Typography variant="caption" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Close sx={{ fontSize: 14 }} /> {errors.currency}
                          </Typography>
                        )}
                        {!formData.country && (
                          <Typography variant="caption" color="text.secondary">Please select a country first</Typography>
                        )}
                      </Box>

                      {formData.currency && (
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.light' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32, mr: 1 }}>
                              <CreditCard sx={{ color: 'primary.main', fontSize: 20 }} />
                            </Avatar>
                            <Typography fontWeight="medium">Currency Information</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            You've selected <Chip label={formData.currency} variant="outlined" sx={{ mx: 0.5 }} />
                            for your travel to <Typography component="span" fontWeight="medium">
                              {countries.find(c => c.code === formData.country)?.name}
                            </Typography>.
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Funds will be transferred to your corporate travel card in this currency.
                          </Typography>
                        </Paper>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2, bgcolor: 'action.hover' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setActiveTab("details")}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setActiveTab("documents")}
                      >
                        Next: Documents & Submit
                      </Button>
                    </CardActions>
                  </Card>
                )}

                {/* Documents & Submit Tab */}
                {activeTab === "documents" && (
                  <Card sx={{ boxShadow: 3, border: 'none' }}>
                    <CardHeader
                      title="Required Documents"
                      subheader="Upload pre-approved documents for your international travel"
                      sx={{ 
                        bgcolor: 'primary.light', 
                        borderTopLeftRadius: '8px', 
                        borderTopRightRadius: '8px',
                        pb: 2 
                      }}
                      avatar={
                        <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                          <Description sx={{ color: 'primary.main' }} />
                        </Avatar>
                      }
                    />
                    <CardContent sx={{ pt: 3, display: 'grid', gap: 3 }}>
                      <Alert severity="warning" sx={{ bgcolor: 'warning.light', borderColor: 'warning.main' }}>
                        <AlertTitle>Document Requirements</AlertTitle>
                        Please upload all pre-approved documents for international travel, such as visa approvals,
                        flight approvals, and any other required documentation.
                      </Alert>

                      <Box sx={{ display: 'grid', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">Upload Documents</Typography>
                        <Paper
                          variant="outlined"
                          sx={{
                            border: 2,
                            borderStyle: 'dashed',
                            p: 4,
                            textAlign: 'center',
                            bgcolor: errors.documents ? 'error.light' : 'transparent',
                            borderColor: errors.documents ? 'error.main' : 'divider',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault()
                            const files = Array.from(e.dataTransfer.files)
                            setFormData(prev => ({
                              ...prev,
                              documents: [...prev.documents, ...files],
                            }))
                          }}
                        >
                          <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                            <CloudUpload sx={{ color: 'primary.main', fontSize: 24 }} />
                          </Avatar>
                          <Typography fontWeight="medium" gutterBottom>
                            Drag and drop files here, or click to browse
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Supported formats: PDF, DOCX, JPG, PNG (Max 10MB each)
                          </Typography>
                          <input 
                            id="documents" 
                            type="file" 
                            multiple 
                            style={{ display: 'none' }} 
                            onChange={handleFileUpload} 
                          />
                          <label htmlFor="documents">
                            <Button 
                              variant="outlined" 
                              component="span"
                            >
                              Select Files
                            </Button>
                          </label>
                        </Paper>
                        {errors.documents && (
                          <Typography variant="caption" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Close sx={{ fontSize: 14 }} /> {errors.documents}
                          </Typography>
                        )}
                      </Box>

                      {formData.documents.length > 0 && (
                        <Box sx={{ display: 'grid', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">Uploaded Documents</Typography>
                          <Box sx={{ display: 'grid', gap: 1 }}>
                            {formData.documents.map((file, index) => (
                              <Paper key={index} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light', mr: 2 }}>
                                    <Typography variant="caption" fontWeight="bold" textTransform="uppercase">
                                      {file.name.split('.').pop()}
                                    </Typography>
                                  </Avatar>
                                  <Box>
                                    <Typography fontWeight="medium" noWrap sx={{ maxWidth: 300 }}>
                                      {file.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {(file.size / 1024).toFixed(2)} KB
                                    </Typography>
                                  </Box>
                                </Box>
                                <IconButton
                                  onClick={() => handleRemoveFile(index)}
                                  sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.light' } }}
                                >
                                  <Close />
                                </IconButton>
                              </Paper>
                            ))}
                          </Box>
                        </Box>
                      )}

                      <Divider />

                      <Box sx={{ display: 'grid', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle color="primary" />
                          <Typography variant="h6">Review Your Request</Typography>
                        </Box>
                        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'action.hover' }}>
                          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 3 }}>
                            <Box sx={{ display: 'grid', gap: 2 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Purpose</Typography>
                                <Typography>{formData.purpose || "Not specified"}</Typography>
                              </Box>

                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Travel Period</Typography>
                                <Typography>
                                  {formData.departureDate && formData.returnDate ? (
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {format(formData.departureDate, "MMM d, yyyy")} - {format(formData.returnDate, "MMM d, yyyy")}
                                      <Chip label={`${formData.travelDays} days`} variant="outlined" size="small" />
                                    </Box>
                                  ) : "Not specified"}
                                </Typography>
                              </Box>

                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Destination</Typography>
                                <Typography>
                                  {countries.find(c => c.code === formData.country)?.name || "Not specified"}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ display: 'grid', gap: 2 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Currency</Typography>
                                <Typography>{formData.currency || "Not specified"}</Typography>
                              </Box>

                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Funding Codes</Typography>
                                <Typography>{formData.fundingCodes || "Not specified"}</Typography>
                              </Box>

                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Transportation</Typography>
                                <Typography>
                                  {formData.meansOfTravel === "company"
                                    ? "Company Vehicle"
                                    : formData.meansOfTravel === "personal"
                                      ? "Personal Vehicle"
                                      : "Other (Flight, Train, etc.)"}
                                </Typography>
                              </Box>

                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Documents</Typography>
                                <Typography>
                                  <Chip label={`${formData.documents.length}`} size="small" /> file(s) uploaded
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2, bgcolor: 'action.hover' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setActiveTab("funding")}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ minWidth: 160 }}
                      >
                        {isSubmitting ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                            Submitting...
                          </Box>
                        ) : "Submit Travel Request"}
                      </Button>
                    </CardActions>
                  </Card>
                )}
              </Box>
            </form>
          )}
        </Box>
      </Box>
      </Box>
    </LocalizationProvider>
  )
}