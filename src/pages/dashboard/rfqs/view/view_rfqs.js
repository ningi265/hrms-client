import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  Chip,
  TextField,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  styled,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { FilterList, Search, MoreHoriz, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../../../../authcontext/authcontext";
import CreateRFQForm from "../create/create";

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
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "#d1d5db",
            },
            "&:hover fieldset": {
              borderColor: "#4f46e5",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
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

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  background: theme.palette.background.paper,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

export default function RFQsPage() {
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const mockRFQs = [
          {
            id: "rfq-001",
            itemName: "Office Furniture",
            quantity: 10,
            status: "open",
            procurementOfficer: {
              name: "John Doe",
              email: "john@example.com",
            },
            vendors: [
              { id: "v-001", name: "ABC Suppliers" },
              { id: "v-005", name: "Furniture Plus" },
            ],
            quotes: [],
            createdAt: "2023-03-15T10:30:00Z",
          },
          {
            id: "rfq-002",
            itemName: "Laptops",
            quantity: 5,
            status: "closed",
            procurementOfficer: {
              name: "Jane Smith",
              email: "jane@example.com",
            },
            vendors: [
              { id: "v-002", name: "Tech Solutions" },
              { id: "v-006", name: "Gadget Hub" },
            ],
            quotes: [{ id: "q-001", vendorId: "v-002", amount: 5000 }],
            createdAt: "2023-04-01T14:00:00Z",
          },
        ];
        setRfqs(mockRFQs);
      } catch (error) {
        console.error("Failed to fetch RFQs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRFQs();
  }, []);

  const isAdmin = user?.role === "admin";
  const isProcurementOfficer = user?.role === "procurement_officer";
  const isVendor = user?.role === "vendor";

  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch = rfq.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;

    if (isVendor) {
      return matchesSearch && matchesStatus && rfq.vendors.some((v) => v.id === user?.id);
    }

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleMenuClick = (event, rfq) => {
    setAnchorEl(event.currentTarget);
    setSelectedRFQ(rfq);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRFQ(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRFQSuccess = () => {
    // Optionally refresh RFQs list here
    // For now, just close the modal
    handleCloseModal();
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

  return (
    <ThemeProvider theme={theme}>
      <GradientContainer maxWidth="lg">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Request for Quotations
            </Typography>
            {(isAdmin || isProcurementOfficer) && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleOpenModal}
              >
                New RFQs
              </Button>
            )}
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <StyledCard>
            <CardHeader
              title="Manage RFQs"
              subheader={
                isVendor
                  ? "View and respond to RFQs you've been invited to"
                  : "Create and manage requests for quotations"
              }
              sx={{ pb: 0 }}
            />
            <CardContent>
              <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mb={4} alignItems="center">
                <TextField
                  placeholder="Search RFQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: "#6b7280" }} />,
                    sx: { borderRadius: "8px" },
                  }}
                  fullWidth
                  sx={{ maxWidth: { sm: 300 } }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Quotes</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRFQs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        No RFQs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRFQs.map((rfq) => (
                      <motion.tr
                        key={rfq.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                      >
                        <TableCell>{rfq.id}</TableCell>
                        <TableCell>{rfq.itemName}</TableCell>
                        <TableCell>{rfq.quantity}</TableCell>
                        <TableCell>{formatDate(rfq.createdAt)}</TableCell>
                        <TableCell>
                          <Chip
                            label={rfq.status}
                            color={rfq.status === "open" ? "success" : "primary"}
                            size="small"
                            sx={{ textTransform: "capitalize", fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          {rfq.quotes.length} / {rfq.vendors.length}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="More Actions">
                            <IconButton onClick={(e) => handleMenuClick(e, rfq)}>
                              <MoreHoriz />
                            </IconButton>
                          </Tooltip>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl && selectedRFQ?.id === rfq.id)}
                            onClose={handleCloseMenu}
                          >
                            <MenuItem component={Link} to={`/dashboard/rfqs/${rfq.id}`}>
                              View Details
                            </MenuItem>
                            {isVendor && rfq.status === "open" && (
                              <MenuItem component={Link} to={`/dashboard/rfqs/${rfq.id}/quote`}>
                                Submit Quote
                              </MenuItem>
                            )}
                            {(isAdmin || isProcurementOfficer) && rfq.status === "open" && rfq.quotes.length > 0 && (
                              <MenuItem>Select Vendor</MenuItem>
                            )}
                          </Menu>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </StyledCard>
        </motion.div>

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <CreateRFQForm onClose={handleCloseModal} onSuccess={handleRFQSuccess} />
          </DialogContent>
        </Dialog>
      </GradientContainer>
    </ThemeProvider>
  );
}