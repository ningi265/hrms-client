import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Box,
  Snackbar,
  IconButton,
  Tooltip,
  styled,
} from "@mui/material";
import { Check, X, AlertCircle } from "lucide-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";

// Custom theme (light mode only)
const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#ec4899",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 700,
      background: "linear-gradient(90deg, #4f46e5, #ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle1: {
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e5e7eb",
        },
        head: {
          fontWeight: 600,
          color: "#6b7280",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        },
      },
    },
  },
});

// Styled components
const GradientContainer = styled(Container)(({ theme }) => ({
  background: "linear-gradient(135deg, #f9fafb, #e5e7eb)",
  borderRadius: "16px",
  padding: theme.spacing(4),
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #4f46e5, #ec4899)",
  },
}));

export default function ManageRequisitionsPage() {
  const [requisitions, setRequisitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch pending requisitions
  useEffect(() => {
    const fetchPendingRequisitions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/requisitions/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setRequisitions(data);
      } catch (err) {
        setError("Failed to fetch requisitions");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequisitions();
  }, []);

  // Handle accept/reject action
  const handleAction = async (requisitionId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/requisitions/${requisitionId}/${action}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setRequisitions((prev) =>
          prev.map((req) =>
            req._id === requisitionId ? { ...req, status: action === "approve" ? "approved" : "rejected" } : req
          )
        );
        setSnackbarMessage(`Requisition ${action === "approve" ? "approved" : "rejected"} successfully!`);
        setSnackbarOpen(true);
      } else {
        setError(data.message || "Failed to update requisition");
      }
    } catch (err) {
      setError("Failed to update requisition");
      console.error(err);
    }
  };

  // Close the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={60} thickness={5} />
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-[80vh] gap-4"
      >
        <AlertCircle className="h-12 w-12 text-red-500" />
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </motion.div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GradientContainer maxWidth="lg">
        <Box mb={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" gutterBottom>
              Manage Requisitions
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Review and approve or reject pending requisitions with ease.
            </Typography>
          </motion.div>
        </Box>

        {requisitions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert severity="info" sx={{ borderRadius: "8px", mb: 2 }}>
              No pending requisitions found.
            </Alert>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Budget Code</TableCell>
                    <TableCell>Urgency</TableCell>
                    <TableCell>Preferred Supplier</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requisitions.map((requisition) => (
                    <motion.tr
                      key={requisition._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                    >
                      <TableCell>{requisition.employee?.name}</TableCell>
                      <TableCell>{requisition.itemName}</TableCell>
                      <TableCell>{requisition.quantity}</TableCell>
                      <TableCell>{requisition.budgetCode}</TableCell>
                      <TableCell>
                        <Chip
                          label={requisition.urgency}
                          color={requisition.urgency === "high" ? "error" : "warning"}
                          size="small"
                          sx={{ fontWeight: 500, borderRadius: "6px" }}
                        />
                      </TableCell>
                      <TableCell>{requisition.preferredSupplier}</TableCell>
                      <TableCell>{requisition.reason}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Approve Requisition">
                          <IconButton
                            color="success"
                            onClick={() => handleAction(requisition._id, "approve")}
                            sx={{ mr: 1 }}
                          >
                            <Check />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Requisition">
                          <IconButton
                            color="error"
                            onClick={() => handleAction(requisition._id, "reject")}
                          >
                            <X />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%", borderRadius: "8px" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </GradientContainer>
    </ThemeProvider>
  );
}