"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ShoppingCart,
  Users,
  CheckSquare,
  Package,
  Truck,
  CreditCard,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Chip,
} from "@mui/material";

import { useAuth } from "../../authcontext/authcontext"; // Import the useAuth hook
import { Backspace } from "@mui/icons-material";

export default function VendorDashboard() {
  const { user } = useAuth(); // Use the actual useAuth hook
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rfqs");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const getStats = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage or your auth context

        // Fetch RFQs stats
        const rfqsResponse = await fetch(`${backendUrl}/api/rfqs/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const rfqsData = await rfqsResponse.json();

        // Fetch purchase orders stats
        const purchaseOrdersResponse = await fetch(`${backendUrl}/api/purchase-orders/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const purchaseOrdersData = await purchaseOrdersResponse.json();

        // Fetch invoices stats
        const invoicesResponse = await fetch(`${backendUrl}/api/invoices/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const invoicesData = await invoicesResponse.json();

        // Combine all stats into a single object
        const statsData = {
          rfqs: rfqsData,
          purchaseOrders: purchaseOrdersData,
          invoices: invoicesData,
        };

        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch vendor dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getStats();
  }, []);

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

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-destructive gap-2">
        <AlertCircle className="h-8 w-8" />
        <Typography variant="h6">Failed to load dashboard data</Typography>
      </div>
    );
  }

  const vendorTabs = [
    {
      id: "rfqs",
      label: "RFQs",
      icon: <FileText className="h-5 w-5" />,
      description: "View and respond to RFQs from buyers.",
      action: "View RFQs",
      path: "/vendors/qoutes",
      stats: stats.rfqs,
    },
    {
      id: "purchase-orders",
      label: "Purchase Orders",
      icon: <Package className="h-5 w-5" />,
      description: "Manage purchase orders from buyers.",
      action: "Manage POs",
      path: "/vendor-purchase-order",
      stats: stats.purchaseOrders,
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Track and manage invoices for completed orders.",
      action: "Manage Invoices",
      path: "/invoices/submit",
      stats: stats.invoices,
    },
    {
      id: "performance",
      label: "Performance",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "View your performance metrics and ratings.",
      action: "View Performance",
      path: "/vendor/performance",
    },
  ];

  return (
    <Container>
      {/* Header Section with User Welcome */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        mb={4}
        p={4}
        sx={{
          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Vendor Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Manage your vendor activities efficiently
        </Typography>
        <Box display="flex" alignItems="center" mt={2}>
          <Avatar src={user?.avatar} alt={user?.name} />
          <Box ml={2}>
            <Typography variant="body1">Welcome back, {user?.name}!</Typography>
            <Typography variant="body2">{user?.email}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={4} mb={4}>
        <StatCard title="RFQs" icon={<FileText />} total={stats.rfqs.total} items={[
          { label: "Open", value: stats.rfqs.open, color: "primary" },
          { label: "Closed", value: stats.rfqs.closed, color: "secondary" },
        ]} />
        <StatCard title="Purchase Orders" icon={<Package />} total={stats.purchaseOrders.total} items={[
          { label: "Pending", value: stats.purchaseOrders.pending, color: "warning" },
          { label: "Completed", value: stats.purchaseOrders.confirmed, color: "success" },
        ]} />
        <StatCard title="Invoices" icon={<CreditCard />} total={stats.invoices.total} items={[
          { label: "Pending", value: stats.invoices.pending, color: "warning" },
          { label: "Paid", value: stats.invoices.paid, color: "success" },
        ]} />
      </Grid>

      {/* Vendor Process Tabs */}
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 4 }}
      >
        {vendorTabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            value={tab.id}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        ))}
      </Tabs>

      {vendorTabs.map((tab) => (
        <div key={tab.id} hidden={activeTab !== tab.id}>
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <CardHeader title={tab.label} subheader={tab.description} />
            <CardContent>
              {tab.stats && (
                <Box mb={2}>
                  <Typography variant="subtitle2">Current Status</Typography>
                  <Grid container spacing={1}>
                    {Object.entries(tab.stats)
                      .filter(([key]) => key !== "total")
                      .map(([key, value]) => (
                        <Grid item key={key} xs={6} sm={4} md={3}>
                          <Chip variant="outlined" label={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`} />
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              )}
              <Button variant="contained" color="primary" onClick={() => navigate(tab.path)}>
                {tab.action}
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Quick Actions */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={4}>
          <QuickActionCard
            title="RFQs"
            icon={<FileText />}
            description={`${stats.rfqs.open} open RFQs`}
            action="View RFQs"
            onClick={() => navigate("/vendor/rfqs")}
          />
          <QuickActionCard
            title="Purchase Orders"
            icon={<Package />}
            description={`${stats.purchaseOrders.pending} pending POs`}
            action="Manage POs"
            onClick={() => navigate("/vendor/purchase-orders")}
          />
          <QuickActionCard
            title="Invoices"
            icon={<CreditCard />}
            description={`${stats.invoices.pending} pending invoices`}
            action="Manage Invoices"
            onClick={() => navigate("/vendor/invoices")}
          />
        </Grid>
      </Box>
    </Container>
  );
}

// Stat Card Component
function StatCard({ title, icon, total, items }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Card sx={{ "&:hover": { boxShadow: 6 } }}>
          <CardHeader
            title={title}
            avatar={<Avatar sx={{ bgcolor: "primary.main" }}>{icon}</Avatar>}
          />
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {total}
            </Typography>
            {items.map((item, index) => (
              <Box key={index} mb={1}>
                <Typography variant="body2">{item.label}</Typography>
                <Chip label={item.value} color={item.color} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Paper>
    </Grid>
  );
}

// Quick Action Card Component
function QuickActionCard({ title, icon, description, action, onClick }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ "&:hover": { boxShadow: 6 } }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: "primary.main" }}>{icon}</Avatar>
            <Box ml={2}>
              <Typography variant="body1">{title}</Typography>
              <Typography variant="body2" color="textSecondary">{description}</Typography>
            </Box>
          </Box>
          <Button variant="outlined" onClick={onClick}>
            {action}
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}