import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Badge,
  Select,
  InputAdornment,
  Input,
  CircularProgress,
  Alert,
  Box
} from "@mui/material";
import { FilterList, Search, MoreHoriz, Add } from "@mui/icons-material";
import { useAuth } from "../../../../authcontext/authcontext";

export default function RFQsPage() {
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch RFQs from the backend
  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/rfqs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched RFQs:", data); // Log the fetched data
        setRfqs(Array.isArray(data) ? data : []); // Ensure rfqs is always an array
      } catch (error) {
        setError("Failed to fetch RFQs");
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

  // Filter RFQs based on search term and status
  const filteredRFQs = Array.isArray(rfqs)
    ? rfqs.filter((rfq) => {
        const matchesSearch = rfq.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;

        if (isVendor) {
          return matchesSearch && matchesStatus && rfq.vendors.some((v) => v._id === user?.id);
        }

        return matchesSearch && matchesStatus;
      })
    : [];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle menu click
  const handleMenuClick = (event, rfq) => {
    setAnchorEl(event.currentTarget);
    setSelectedRFQ(rfq);
  };

  // Close menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRFQ(null);
  };

  // Handle view details
  const handleViewDetails = (rfqId) => {
    navigate(`/dashboard/rfqs/${rfqId}`);
  };

  // Handle submit quote (for vendors)
  const handleSubmitQuote = (rfqId) => {
    navigate(`/dashboard/rfqs/${rfqId}/quote`);
  };

  // Handle select vendor (for procurement officers/admins)
  const handleSelectVendor = async (rfqId, vendorId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/rfqs/${rfqId}/select-vendor`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId }),
      });
      const data = await response.json();

      if (response.ok) {
        // Update the RFQ status in the UI
        setRfqs((prev) =>
          prev.map((rfq) =>
            rfq._id === rfqId ? { ...rfq, status: "closed", selectedVendor: vendorId } : rfq
          )
        );
      } else {
        setError(data.message || "Failed to select vendor");
      }
    } catch (error) {
      setError("Failed to select vendor");
      console.error("Failed to select vendor:", error);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh" // Full viewport height
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" component="h1">
          Request for Quotations
        </Typography>
        <div className="flex gap-2">
          {(isAdmin || isProcurementOfficer) && (
            <Link to="/rfqs/create">
              <Button variant="contained" color="primary">
                <Add className="mr-2" />
                New RFQ
              </Button>
            </Link>
          )}
          <Link to="/vendors/">
            <Button variant="contained" color="secondary">
              Add Vendors
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Manage RFQs"
          subheader={
            isVendor
              ? "View and respond to RFQs you've been invited to"
              : "Create and manage requests for quotations"
          }
        />
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex w-full sm:w-auto items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search RFQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  }
                  fullWidth
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterList className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </div>
            </div>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Procurement Officer</TableCell>
                  <TableCell>Vendors</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Quotes</TableCell>
                  <TableCell className="text-right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRFQs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} style={{ textAlign: "center", padding: "16px" }}>
                      No RFQs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRFQs.map((rfq) => (
                    <TableRow key={rfq._id}>
                      <TableCell>{rfq._id}</TableCell>
                      <TableCell>{rfq.itemName}</TableCell>
                      <TableCell>{rfq.quantity}</TableCell>
                      <TableCell>{rfq.procurementOfficer?.name}</TableCell>
                      <TableCell>
                        {rfq.vendors.map((vendor) => vendor.name).join(", ")}
                      </TableCell>
                      <TableCell>{formatDate(rfq.createdAt)}</TableCell>
                      <TableCell>
                        {rfq.status === "open" ? (
                          <Badge color="success">Open</Badge>
                        ) : (
                          <Badge color="primary">Closed</Badge>
                        )}
                      </TableCell>
                      <TableCell>{rfq.quotes.length}</TableCell>
                      <TableCell className="text-right">
                        <Button onClick={(e) => handleMenuClick(e, rfq)} variant="outlined" size="small">
                          <MoreHoriz />
                        </Button>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={() => handleViewDetails(rfq._id)}>View Details</MenuItem>
                          {isVendor && rfq.status === "open" && (
                            <MenuItem onClick={() => handleSubmitQuote(rfq._id)}>Submit Quote</MenuItem>
                          )}
                          {(isAdmin || isProcurementOfficer) && rfq.status === "open" && rfq.quotes.length > 0 && (
                            <MenuItem onClick={() => handleSelectVendor(rfq._id, rfq.quotes[0].vendor)}>
                              Select Vendor
                            </MenuItem>
                          )}
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}