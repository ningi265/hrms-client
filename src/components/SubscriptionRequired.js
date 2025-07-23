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

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
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
      setIsChecking(false);
      return;
    }

    // For users without specific roles, check subscription status
    const checkSubscriptionAccess = () => {
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

    const hasSubscriptionAccess = checkSubscriptionAccess();

    if (!hasSubscriptionAccess && !location.pathname.startsWith('/billing')) {
      navigate('/billing', { 
        replace: true,
        state: { from: location.pathname }
      });
    } else if (hasSubscriptionAccess && location.pathname.startsWith('/billing')) {
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