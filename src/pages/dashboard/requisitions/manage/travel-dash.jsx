import { useState ,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarToday,
  ChevronRight,
  Schedule,
  Public,
  Dashboard,
  Place,
  FlightTakeoff,
  Add,
  Settings,
  AccountBalanceWallet,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { useSnackbar } from "notistack";
import LocalTravelForm from "../../../employee-dash/travel"; 
import InternationalTravelForm from "../../requisitions/manage/international"; 

export default function TravelDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [anchorEl, setAnchorEl] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    stats: null,
    quickLinks: null,
    loading: false
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [totalPending, setTotalPending] = useState();
  const [pendingLocal, setPendingLocal] = useState();
  const [pendingInternational, setPendingInternational] = useState();
  const [localModalOpen, setLocalModalOpen] = useState(false);
  const [internationalModalOpen, setInternationalModalOpen] = useState(false);

  

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Sample data for charts
  const travelData = [
    { name: "Jan", local: 2, international: 1 },
    { name: "Feb", local: 1, international: 0 },
    { name: "Mar", local: 3, international: 1 },
    { name: "Apr", local: 0, international: 2 },
    { name: "May", local: 2, international: 0 },
    { name: "Jun", local: 1, international: 1 },
  ];


  useEffect(() => {
    const fetchPendingStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/travel-requests/pending/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data) {
          setTotalPending(response.data.totalPending || 0);
          setPendingLocal(response.data.pendingLocal || 0);
          setPendingInternational(response.data.pendingInternational || 0);
        }
      } catch (error) {
        enqueueSnackbar("Failed to load pending stats", { variant: "error" });
        console.error("Error fetching pending stats:", error);
      }
    };
  
    fetchPendingStats();
  }, []); 
  
  
  


  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
        {/* Local Travel Modal */}
<Dialog
  open={localModalOpen}
  onClose={() => setLocalModalOpen(false)}
  fullWidth
  maxWidth="md"
  sx={{
    '& .MuiDialog-paper': {
      height: '80vh', // Adjust height as needed
      maxHeight: '800px'
    }
  }}
>
  <DialogTitle>
    <Box display="flex" alignItems="center">
      <Place sx={{ mr: 1 }} />
      New Local Travel Request
    </Box>
  </DialogTitle>
  <DialogContent dividers>
    <LocalTravelForm 
      onCancel={() => setLocalModalOpen(false)}
      onSubmitSuccess={() => {
        setLocalModalOpen(false);
        // Add any success handling here (e.g., refresh data, show notification)
        enqueueSnackbar("Local travel request submitted successfully!", { variant: "success" });
      }}
    />
  </DialogContent>
</Dialog>

      {/* International Travel Modal */}
<Dialog
  open={internationalModalOpen}
  onClose={() => setInternationalModalOpen(false)}
  fullWidth
  maxWidth="md"
  sx={{
    '& .MuiDialog-paper': {
      height: '80vh', // Adjust height as needed
      maxHeight: '800px'
    }
  }}
>
  <DialogTitle>
    <Box display="flex" alignItems="center">
      <Public sx={{ mr: 1 }} />
      New International Travel Request
    </Box>
  </DialogTitle>
  <DialogContent dividers>
    <InternationalTravelForm 
      onCancel={() => setInternationalModalOpen(false)}
      onSubmitSuccess={() => {
        setInternationalModalOpen(false);
        // Add any success handling here
        enqueueSnackbar("International travel request submitted successfully!", { variant: "success" });
      }}
    />
  </DialogContent>
</Dialog>

      <Box component="main" sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
           Travel Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleMenuOpen}
            >
              New Travel Request
            </Button>
            <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { 
            setLocalModalOpen(true); 
            handleMenuClose(); 
          }}>
            <Place sx={{ mr: 1 }} />
            Local Travel
          </MenuItem>
          <MenuItem onClick={() => { 
            setInternationalModalOpen(true); 
            handleMenuClose(); 
          }}>
            <Public sx={{ mr: 1 }} />
            International Travel
          </MenuItem>
        </Menu>
          </Box>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Overview" value="overview" />
            <Tab label="Travel Stats" value="stats" />
          </Tabs>
        </Paper>

        {activeTab === "overview" && (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardHeader
                    title="Total Trips"
                    avatar={<FlightTakeoff color="disabled" />}
                    sx={{ pb: 0 }}
                    titleTypographyProps={{ variant: "subtitle2" }}
                  />
                  <CardContent>
                    <Typography variant="h4">12</Typography>
                    <Typography variant="caption" color="text.secondary">
                      +2 from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardHeader
                    title="Pending Approvals"
                    avatar={<Schedule color="disabled" />}
                    sx={{ pb: 0 }}
                    titleTypographyProps={{ variant: "subtitle2" }}
                  />
                  <CardContent>
                    <Typography variant="h4">{totalPending}</Typography>
                    <Typography variant="caption" color="text.secondary">
                    {pendingLocal} local, {pendingInternational} international
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardHeader
                    title="Budget Used"
                    avatar={<AccountBalanceWallet color="disabled" />}
                    sx={{ pb: 0 }}
                    titleTypographyProps={{ variant: "subtitle2" }}
                  />
                  <CardContent>
                    <Typography variant="h4">$4,320</Typography>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress variant="determinate" value={72} sx={{ height: 8, borderRadius: 4 }} />
                      <Typography variant="caption" color="text.secondary">
                        72% of annual budget
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardHeader
                    title="Upcoming Trips"
                    avatar={<CalendarToday color="disabled" />}
                    sx={{ pb: 0 }}
                    titleTypographyProps={{ variant: "subtitle2" }}
                  />
                  <CardContent>
                    <Typography variant="h4">2</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Next: Chicago (May 15)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card component={Link} to="/travel/requests" sx={{ textDecoration: "none", transition: "all 0.2s", "&:hover": { borderColor: "primary.main", boxShadow: 1 } }}>
                  <CardHeader
                    title="Manage Requests"
                    subheader="View and manage all your travel requests"
                  />
                  <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip icon={<Dashboard color="primary" />} sx={{ bgcolor: "primary.light" }} />
                      <Typography>12 total requests</Typography>
                    </Box>
                    <ChevronRight color="disabled" />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card component={Link} to="/travel/expenses" sx={{ textDecoration: "none", transition: "all 0.2s", "&:hover": { borderColor: "primary.main", boxShadow: 1 } }}>
                  <CardHeader
                    title="Expense Reports"
                    subheader="Submit and track your travel expenses"
                  />
                  <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip icon={<AccountBalanceWallet color="primary" />} sx={{ bgcolor: "primary.light" }} />
                      <Typography>3 pending reports</Typography>
                    </Box>
                    <ChevronRight color="disabled" />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card component={Link} to="/travel/documents" sx={{ textDecoration: "none", transition: "all 0.2s", "&:hover": { borderColor: "primary.main", boxShadow: 1 } }}>
                  <CardHeader
                    title="Travel Documents"
                    subheader="Manage your passport, visa and other documents"
                  />
                  <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip icon={<Public color="primary" />} sx={{ bgcolor: "primary.light" }} />
                      <Typography>2 documents expiring soon</Typography>
                    </Box>
                    <ChevronRight color="disabled" />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {activeTab === "stats" && (
          <>
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title="Travel History"
                subheader="Your travel patterns over the last 6 months"
              />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={travelData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="local" name="Local Trips" fill="#1976d2" />
                      <Bar dataKey="international" name="International Trips" fill="#9c27b0" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader
                    title="Travel by Type"
                    subheader="Breakdown of your travel types"
                  />
                  <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "primary.main" }} />
                            <Typography variant="body2">Local Travel</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            9 trips (75%)
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "secondary.main" }} />
                            <Typography variant="body2">International Travel</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            3 trips (25%)
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={25} sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                      <Divider />
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Top Destinations
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2">New York</Typography>
                            <Typography variant="body2">3 trips</Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2">London</Typography>
                            <Typography variant="body2">2 trips</Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2">Chicago</Typography>
                            <Typography variant="body2">2 trips</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader
                    title="Travel Expenses"
                    subheader="Your expense breakdown"
                  />
                  <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "blue.500" }} />
                            <Typography variant="body2">Flights</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            $2,450 (56.7%)
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={56.7} sx={{ height: 8, borderRadius: 4, "& .MuiLinearProgress-bar": { bgcolor: "blue.500" } }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "green.500" }} />
                            <Typography variant="body2">Accommodation</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            $1,200 (27.8%)
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={27.8} sx={{ height: 8, borderRadius: 4, "& .MuiLinearProgress-bar": { bgcolor: "green.500" } }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "orange.500" }} />
                            <Typography variant="body2">Ground Transport</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            $420 (9.7%)
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={9.7} sx={{ height: 8, borderRadius: 4, "& .MuiLinearProgress-bar": { bgcolor: "orange.500" } }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "red.500" }} />
                            <Typography variant="body2">Meals & Other</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            $250 (5.8%)
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={5.8} sx={{ height: 8, borderRadius: 4, "& .MuiLinearProgress-bar": { bgcolor: "red.500" } }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}