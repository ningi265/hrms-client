import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Badge,
  Input,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  Box
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"; // For the actions menu
import { Plus, Search, Star } from "lucide-react";
import { useAuth } from "../../../authcontext/authcontext";

export default function VendorsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Fetch vendors from the backend
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://hrms-6s3i.onrender.com/api/vendors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        setError("Failed to fetch vendors");
        console.error("Failed to fetch vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Render rating stars
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <Star
            className="absolute top-0 left-0 h-4 w-4 fill-yellow-400 text-yellow-400 overflow-hidden"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Handle menu click
  const handleMenuClick = (event, vendor) => {
    setAnchorEl(event.currentTarget);
    setSelectedVendor(vendor);
  };

  // Close menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedVendor(null);
  };

  // Handle delete vendor
  const handleDeleteVendor = async (vendorId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://hrms-6s3i.onrender.com/api/vendors/${vendorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the deleted vendor from the list
        setVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
      } else {
        setError("Failed to delete vendor");
      }
    } catch (error) {
      setError("Failed to delete vendor");
      console.error("Failed to delete vendor:", error);
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
        <Typography variant="h4" className="font-bold">
          Vendors
        </Typography>
        <Link to="/vendors/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[350px]"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Categories</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell className="text-right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No vendors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <TableRow key={vendor._id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>
                          <div>{vendor.email}</div>
                          <div className="text-sm text-muted-foreground">{vendor.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {vendor.categories.map((category, index) => (
                              <Badge key={index} variant="outline">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{renderRating(vendor.rating || 0)}</TableCell>
                        <TableCell className="text-right">
                          <IconButton onClick={(event) => handleMenuClick(event, vendor)}>
                            <MoreHorizIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                          >
                            <MenuItem onClick={() => navigate(`/dashboard/vendors/${selectedVendor?._id}`)}>
                              View Details
                            </MenuItem>
                            <MenuItem onClick={() => navigate(`/dashboard/vendors/${selectedVendor?._id}/edit`)}>
                              Edit
                            </MenuItem>
                            <MenuItem onClick={() => handleDeleteVendor(selectedVendor?._id)}>
                              Delete
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}