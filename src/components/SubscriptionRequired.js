import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../authcontext/authcontext';
import { CircularProgress, Box } from '@mui/material';

const employeeRoles = [
  "Software Engineer",
  "Senior Software Engineer", 
  "Lead Engineer",
  "Product Manager",
  "Senior Product Manager",
  "Data Scientist",
  "Data Analyst",
  "UI/UX Designer",
  "Senior Designer",
  "DevOps Engineer",
  "Quality Assurance Engineer",
  "Business Analyst",
  "Project Manager",
  "Scrum Master",
  "Sales Representative",
  "Sales Manager",
  "Marketing Specialist",
  "Marketing Manager",
  "HR Specialist",
  "HR Manager",
  "Finance Analyst",
  "Accountant",
  "Administrative Assistant",
  "Office Manager",
  "Customer Support Representative",
  "Customer Success Manager"
];

const enterpriseRoles = [
  "Enterprise(CEO, CFO, etc.)",
  "CEO",
  "CFO",
  "CTO",
  "COO",
  "Executive"
];

const SubscriptionRequired = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV;

  // Fetch subscription data on component mount
  useEffect(() => {
    if (!user) return;
    fetchSubscriptionData();
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubscriptionLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/billing/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Helper function to determine subscription status
  const getSubscriptionStatus = () => {
    if (!user || !subscriptionData) return null;

    const subscription = subscriptionData.subscription;
    const trial = subscriptionData.trial;

    // Check if user has an active paid subscription
    if (subscription && ['active', 'trialing'].includes(subscription.status) && subscription.plan !== 'trial') {
      return {
        type: 'paid',
        hasAccess: true
      };
    }

    // Check if user is on trial
    if (trial && trial.isActive && trial.remainingDays > 0) {
      return {
        type: 'trial',
        hasAccess: true,
        remainingDays: trial.remainingDays
      };
    }

    // Check if trial has expired
    if (subscription && subscription.plan === 'trial' && (!trial || !trial.isActive)) {
      return {
        type: 'expired',
        hasAccess: false
      };
    }

    return {
      type: 'free',
      hasAccess: false
    };
  };

  useEffect(() => {
    if (authLoading || subscriptionLoading) return;

    if (!user) {
      navigate('/login', {
        replace: true,
        state: { from: location.pathname }
      });
      setIsChecking(false);
      return;
    }

    // Check user role and redirect accordingly
    const checkRoleAndRedirect = () => {
      // Check if user is a vendor
      if (user.role === 'Vendor' || user.position === 'Vendor') {
        if (!location.pathname.startsWith('/vendor-dash')) {
          navigate('/vendor-dash', {
            replace: true,
            state: { from: location.pathname }
          });
        }
        return true;
      }

      // Check if user is an enterprise executive
      if (enterpriseRoles.some(role => 
        user.role === role || 
        user.position === role ||
        (user.position && user.position.toLowerCase() === role.toLowerCase())
      )) {
        if (!location.pathname.startsWith('/dashboard')) {
          navigate('/dashboard', {
            replace: true,
            state: { from: location.pathname }
          });
        }
        return true;
      }

      // Check if user is an employee
      if (employeeRoles.some(role => 
        user.role === role || 
        user.position === role ||
        (user.position && user.position.toLowerCase() === role.toLowerCase())
      )) {
        if (!location.pathname.startsWith('/employee-dash')) {
          navigate('/employee-dash', {
            replace: true,
            state: { from: location.pathname }
          });
        }
        return true;
      }

      return false;
    };

    const hasRoleBasedAccess = checkRoleAndRedirect();
    if (hasRoleBasedAccess) {
      setHasAccess(true);
      setIsChecking(false);
      return;
    }

    // For users without specific roles, check subscription status
    const subscriptionStatus = getSubscriptionStatus();
    const hasSubscriptionAccess = subscriptionStatus?.hasAccess || false;

    setHasAccess(hasSubscriptionAccess);

    if (!hasSubscriptionAccess) {
      if (!location.pathname.startsWith('/billing')) {
        navigate('/billing', { 
          replace: true,
          state: { 
            from: location.pathname,
            subscriptionExpired: true 
          }
        });
      }
    } else if (hasSubscriptionAccess && location.pathname.startsWith('/billing')) {
      navigate('/dashboard', { replace: true });
    }

    setIsChecking(false);
  }, [user, authLoading, subscriptionLoading, navigate, location]);

  if (authLoading || isChecking || subscriptionLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
     
      </Box>
    );
  }

  // Only render children if user has access
  return hasAccess ? <Outlet /> : null;
};

export default SubscriptionRequired;