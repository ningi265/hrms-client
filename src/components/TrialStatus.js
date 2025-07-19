// components/TrialStatus.js
import { useEffect, useState } from 'react';
import { useAuth } from '../authcontext/authcontext';
import { Alert, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TrialStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (user?.billing?.trialEndDate) {
      const trialEnd = new Date(user.billing.trialEndDate);
      const now = new Date();
      const diffTime = trialEnd - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays);
    }
  }, [user]);

  if (!user?.billing?.subscription || user.billing.subscription.plan !== 'trial') {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity={daysLeft <= 3 ? 'warning' : 'info'}
        action={
          <Button 
            color="inherit" 
            size="small"
            onClick={() => navigate('/billing')}
          >
            Upgrade
          </Button>
        }
      >
        {daysLeft > 0 ? (
          <Typography variant="body2">
            You have {daysLeft} day{daysLeft !== 1 ? 's' : ''} left in your trial
          </Typography>
        ) : (
          <Typography variant="body2">
            Your trial has ended. Please upgrade to continue using the service.
          </Typography>
        )}
      </Alert>
    </Box>
  );
};

export default TrialStatus;