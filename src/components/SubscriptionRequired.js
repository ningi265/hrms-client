// SubscriptionRequired.js
import { useEffect, useState } from 'react';
import { useNavigate, useLocation,Outlet } from 'react-router-dom';
import { useAuth } from '../authcontext/authcontext';
import { CircularProgress, Box } from '@mui/material';

const SubscriptionRequired = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsChecking(false);
      return;
    }

    const checkAccess = () => {
      if (!user.billing) {
        return false;
      }

      const { subscription, trialEndDate } = user.billing;
      const now = new Date();
      const trialEnd = trialEndDate ? new Date(trialEndDate) : null;

      if (subscription?.status === 'active' && subscription?.plan !== 'trial') {
        return true;
      }

      if (subscription?.plan === 'trial') {
        if (!trialEnd || isNaN(trialEnd.getTime())) {
          return false;
        }
        return trialEnd > now;
      }

      return false;
    };

    const hasAccess = checkAccess();

    if (!hasAccess && !location.pathname.startsWith('/billing')) {
      navigate('/billing', { 
        replace: true,
        state: { from: location.pathname }
      });
    } else if (hasAccess && location.pathname.startsWith('/billing')) {
      navigate('/dashboard', { replace: true });
    }

    setIsChecking(false);
  }, [user, authLoading, navigate, location]);

  if (authLoading || isChecking) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

   return <Outlet />;
};

export default SubscriptionRequired;