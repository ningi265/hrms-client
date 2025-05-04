import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  styled,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { useNavigate } from "react-router-dom";

// Custom theme
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
      color: "#6b7280",
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
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          background: "#ffffff",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiSnackbarContent-root": {
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
  },
});

// Custom styled components
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

export default function InvoicesPage() {
  const { token, user, logout } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/invoices`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch invoices");

        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
        setError("Failed to fetch invoices. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [token]);

  const openDialog = (invoice, type) => {
    setSelectedInvoice(invoice);
    setActionType(type);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedInvoice(null);
    setActionType("");
  };

  const handleInvoiceAction = async () => {
    if (!selectedInvoice || !token) {
      setSnackbarMessage("Invalid request. Please try again.");
      setSnackbarOpen(true);
      return;
    }

    setIsProcessing(true);

    try {
      let url;
      let method = "POST";

      switch (actionType) {
        case "approve":
          url = `${backendUrl}/api/invoices/${selectedInvoice._id}/approve`;
          break;
        case "reject":
          url = `${backendUrl}/api/invoices/${selectedInvoice._id}/reject`;
          break;
        case "mark-as-paid":
          url = `${backendUrl}/api/invoices/${selectedInvoice._id}/pay`;
          break;
        default:
          throw new Error("Invalid action type");
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Invalid or expired token") {
          setSnackbarMessage("Your session has expired. Please log in again.");
          setSnackbarOpen(true);
          logout();
          return;
        }
        throw new Error(data.message || "Failed to perform action");
      }

      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === selectedInvoice._id ? data.invoice : invoice
        )
      );

      setSnackbarMessage(`Invoice ${actionType.replace("-", " ")} successfully!`);
      setSnackbarOpen(true);
      closeDialog();
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayInvoice = (invoice) => {
    navigate("/invoices/pay", { state: { invoice } });
  };

  const getStatusChip = (status) => {
    const color =
      status === "approved" ? "success" :
      status === "rejected" ? "error" :
      status === "pending" ? "warning" :
      status === "paid" ? "primary" : "default";
    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
            <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <GradientContainer maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert severity="error" sx={{ borderRadius: "8px" }}>
            {error}
          </Alert>
        </motion.div>
      </GradientContainer>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GradientContainer maxWidth="lg">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" component="h1" mb={4}>
            Invoices
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>PO Number</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Amount Due</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <motion.tr
                      key={invoice._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                    >
                      <TableCell>{invoice.invoiceNumber || "N/A"}</TableCell>
                      <TableCell>{invoice.po?.poNumber || "N/A"}</TableCell>
                      <TableCell>{invoice.vendor?.name || "N/A"}</TableCell>
                      <TableCell>${invoice.amountDue?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>{getStatusChip(invoice.status)}</TableCell>
                      <TableCell align="right">
                        {invoice.status === "pending" && (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => openDialog(invoice, "approve")}
                              disabled={isProcessing}
                              sx={{ mr: 1, borderRadius: "8px", textTransform: "none" }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => openDialog(invoice, "reject")}
                              disabled={isProcessing}
                              sx={{ borderRadius: "8px", textTransform: "none" }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {invoice.status === "approved" && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handlePayInvoice(invoice)}
                              sx={{ mr: 1, borderRadius: "8px", textTransform: "none" }}
                            >
                              Pay
                            </Button>
                            <Button
                              variant="contained"
                              color="info"
                              onClick={() => openDialog(invoice, "mark-as-paid")}
                              sx={{ borderRadius: "8px", textTransform: "none" }}
                            >
                              Mark as Paid
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>

        <Dialog
          open={isDialogOpen}
          onClose={closeDialog}
          maxWidth="sm"
          fullWidth
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ p: 3, background: "linear-gradient(135deg, #f9fafb, #e5e7eb)" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #4f46e5, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                Confirm {actionType.replace("-", " ")}
              </Typography>
              <DialogContent sx={{ p: 0 }}>
                <Typography variant="body1">
                  Are you sure you want to {actionType.replace("-", " ")} invoice{" "}
                  <strong>{selectedInvoice?.invoiceNumber || "N/A"}</strong>?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={closeDialog}
                  sx={{ borderRadius: "8px", textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvoiceAction}
                  variant="contained"
                  color="primary"
                  disabled={isProcessing}
                  sx={{ borderRadius: "8px", textTransform: "none" }}
                >
                  {isProcessing ? <CircularProgress size={24} /> : "Confirm"}
                </Button>
              </DialogActions>
            </Box>
          </motion.div>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarMessage.includes("successfully") ? "success" : "error"}
            sx={{ width: "100%", borderRadius: "8px" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </GradientContainer>
    </ThemeProvider>
  );
}