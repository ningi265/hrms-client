import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { Add, Delete, AttachFile, CheckCircle, Receipt } from '@mui/icons-material';
import { useAuth } from '../../../authcontext/authcontext';

export default function EmployeeReconciliationPage() {
  const { currentUser } = useAuth();
  const [travelRequests, setTravelRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [expenses, setExpenses] = useState([
    { id: Date.now(), category: '', amount: '', description: '', receipt: null }
  ]);
  const [tripReport, setTripReport] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const expenseCategories = [
    'Transportation',
    'Meals',
    'Lodging',
    'Conference Fees',
    'Supplies',
    'Other'
  ];

  useEffect(() => {
    const fetchTravelRequests = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/travel-requests/employee/processed`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (response.ok) {
          // Filter requests for current user that need reconciliation
          const requestsNeedingReconciliation = data.filter(request => {
            // Must be processed by finance
            if (request.financeStatus !== 'processed') return false;
            
            // Must be this user's request
            if (request.employee._id !== currentUser.id) return false;
            
            // Check reconciliation status
            if (!request.reconciliation) return true; // No reconciliation exists
            if (request.reconciliation.status === 'changes_requested') return true; // Changes needed
            
            return false;
          });
          
          setTravelRequests(requestsNeedingReconciliation);
          if (requestsNeedingReconciliation.length > 0) {
            setSelectedRequest(requestsNeedingReconciliation[0]);
          }
        } else {
          throw new Error(data.message || 'Failed to fetch travel requests');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchTravelRequests();
    }
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { id: Date.now(), category: '', amount: '', description: '', receipt: null }]);
  };

  const handleRemoveExpense = (id) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const handleExpenseChange = (id, field, value) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const handleReceiptChange = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      handleExpenseChange(id, 'receipt', file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRequest) {
      setError('No travel request selected');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('tripReport', tripReport);
      
      expenses.forEach((expense, index) => {
        formData.append(`expenses[${index}][category]`, expense.category);
        formData.append(`expenses[${index}][amount]`, expense.amount);
        formData.append(`expenses[${index}][description]`, expense.description);
        if (expense.receipt) {
          formData.append(`expenses[${index}][receipt]`, expense.receipt);
        }
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/travel-requests/${selectedRequest._id}/reconcile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setSuccess(true);
      // Reset form
      setExpenses([{ id: Date.now(), category: '', amount: '', description: '', receipt: null }]);
      setTripReport('');
      
      // Refresh the list
      const updatedRequests = travelRequests.filter(req => req._id !== selectedRequest._id);
      setTravelRequests(updatedRequests);
      setSelectedRequest(updatedRequests[0] || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => {
      return total + (parseFloat(expense.amount) || 0);
    }, 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Travel Expense Reconciliation
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="New Reconciliation" icon={<Receipt />} />
        <Tab label="Reconciliation History" icon={<CheckCircle />} />
      </Tabs>

      {tabValue === 0 ? (
        <>
          {error && (
            <Box mb={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {success && (
            <Box mb={2}>
              <Alert severity="success">Reconciliation submitted successfully!</Alert>
            </Box>
          )}

          {travelRequests.length === 0 ? (
            <Alert severity="info">
              No travel requests requiring reconciliation found.
            </Alert>
          ) : (
            <>
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Select Travel Request
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Travel Request</InputLabel>
                  <Select
                    value={selectedRequest?._id || ''}
                    onChange={(e) => {
                      const selected = travelRequests.find(req => req._id === e.target.value);
                      setSelectedRequest(selected);
                    }}
                    label="Travel Request"
                  >
                    {travelRequests.map(request => (
                      <MenuItem key={request._id} value={request._id}>
                        {request.purpose} - {new Date(request.departureDate).toLocaleDateString()} to {new Date(request.returnDate).toLocaleDateString()}
                        {request.reconciliation?.status === 'changes_requested' && (
                          <Chip label="Changes Requested" color="warning" size="small" sx={{ ml: 1 }} />
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedRequest && (
                  <Box mt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Purpose"
                          value={selectedRequest.purpose}
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Location"
                          value={selectedRequest.location}
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Departure Date"
                          value={new Date(selectedRequest.departureDate).toLocaleDateString()}
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Return Date"
                          value={new Date(selectedRequest.returnDate).toLocaleDateString()}
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Payment Method"
                          value={selectedRequest.paymentMethod || 'none'}
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Per Diem Amount"
                          value={`$${selectedRequest.perDiemAmount || '0'}`}
                          fullWidth
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>

              {selectedRequest && (
                <form onSubmit={handleSubmit}>
                  <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Trip Report
                    </Typography>
                    <TextField
                      label="Trip Summary"
                      multiline
                      rows={4}
                      fullWidth
                      value={tripReport}
                      onChange={(e) => setTripReport(e.target.value)}
                      required
                    />
                  </Paper>

                  <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">Expenses</Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={handleAddExpense}
                      >
                        Add Expense
                      </Button>
                    </Box>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount ($)</TableCell>
                            <TableCell>Receipt</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell>
                                <FormControl fullWidth>
                                  <InputLabel>Category</InputLabel>
                                  <Select
                                    value={expense.category}
                                    label="Category"
                                    onChange={(e) => handleExpenseChange(expense.id, 'category', e.target.value)}
                                    required
                                  >
                                    {expenseCategories.map((category) => (
                                      <MenuItem key={category} value={category}>
                                        {category}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={expense.description}
                                  onChange={(e) => handleExpenseChange(expense.id, 'description', e.target.value)}
                                  fullWidth
                                  required
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={expense.amount}
                                  onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                                  fullWidth
                                  inputProps={{ step: "0.01", min: "0" }}
                                  required
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  accept="image/*,.pdf"
                                  style={{ display: 'none' }}
                                  id={`receipt-upload-${expense.id}`}
                                  type="file"
                                  onChange={(e) => handleReceiptChange(expense.id, e)}
                                  required={expense.amount >= 25}
                                />
                                <label htmlFor={`receipt-upload-${expense.id}`}>
                                  <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<AttachFile />}
                                  >
                                    {expense.receipt ? expense.receipt.name : 'Upload'}
                                  </Button>
                                </label>
                                {expense.amount >= 25 && !expense.receipt && (
                                  <Typography color="error" variant="caption">
                                    Receipt required for amounts $25+
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => handleRemoveExpense(expense.id)}
                                  disabled={expenses.length <= 1}
                                >
                                  <Delete color={expenses.length <= 1 ? "disabled" : "error"} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Box mt={2} textAlign="right">
                      <Typography variant="h6">
                        Total Expenses: ${calculateTotal()}
                      </Typography>
                    </Box>
                  </Paper>

                  <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                      size="large"
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : 'Submit Reconciliation'}
                    </Button>
                  </Box>
                </form>
              )}
            </>
          )}
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Reconciliation History
          </Typography>
          <Typography color="textSecondary">
            View your past reconciliation submissions here
          </Typography>
          {/* TODO: Implement reconciliation history */}
        </Paper>
      )}
    </Box>
  );
}