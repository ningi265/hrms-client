// billingManagement.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Divider, LinearProgress, Paper } from '@mui/material';
import { CreditCard, Cancel, Refresh, Event } from '@mui/icons-material';

const BillingManagement = ({ user }) => {
  const [subscription, setSubscription] = useState(user.billing?.subscription || {});
  const [loading, setLoading] = useState(false);
     const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;


  // Add these API calls to your dashboard component or a separate service file

// Get user subscription status
const fetchSubscriptionStatus = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${backendUrl}/api/billing/subscription`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

// Cancel subscription
const cancelSubscription = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${backendUrl}/api/billing/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

// Reactivate subscription
const reactivateSubscription = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${backendUrl}/api/billing/reactivate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};


  const handleCancelSubscription = async () => {


    setLoading(true);
    try {
      await cancelSubscription();
      setSubscription(prev => ({ ...prev, status: 'canceled' }));
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setLoading(true);
    try {
      await reactivateSubscription();
      setSubscription(prev => ({ ...prev, status: 'active' }));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressValue = () => {
    if (!subscription.currentPeriodStart || !subscription.currentPeriodEnd) return 0;
    
    const start = new Date(subscription.currentPeriodStart).getTime();
    const end = new Date(subscription.currentPeriodEnd).getTime();
    const now = new Date().getTime();
    
    return ((now - start) / (end - start)) * 100;
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Subscription Management
          </Typography>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Current Plan: {subscription.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : 'None'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Status: {subscription.status}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Billing Period
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {formatDate(subscription.currentPeriodStart)}
                </Typography>
                <Typography variant="body2">
                  {formatDate(subscription.currentPeriodEnd)}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getProgressValue()} 
                sx={{ height: 8, borderRadius: 4 }} 
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {subscription.status === 'active' && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {subscription.cancelAtPeriodEnd 
                    ? 'Subscription will cancel at period end'
                    : 'Subscription is active'}
                </Typography>
                <Button
                  variant="outlined"
                  color={subscription.cancelAtPeriodEnd ? 'primary' : 'error'}
                  startIcon={subscription.cancelAtPeriodEnd ? <Refresh /> : <Cancel />}
                  onClick={subscription.cancelAtPeriodEnd ? handleReactivateSubscription : handleCancelSubscription}
                  disabled={loading}
                >
                  {subscription.cancelAtPeriodEnd ? 'Reactivate' : 'Cancel'}
                </Button>
              </Box>
            )}
          </Paper>
          
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<CreditCard />}
            onClick={() => window.location.href = `${backendUrl}/billing/portal`}
          >
            Manage Payment Methods
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Billing History
          </Typography>
          {user.billing?.invoices?.length > 0 ? (
            <Box>
              {user.billing.invoices.map((invoice, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ${(invoice.amount / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Status: {invoice.status}
                  </Typography>
                  {invoice.pdfUrl && (
                    <Button 
                      size="small" 
                      onClick={() => window.open(invoice.pdfUrl, '_blank')}
                    >
                      Download Invoice
                    </Button>
                  )}
                  {index < user.billing.invoices.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No billing history available
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BillingManagement;