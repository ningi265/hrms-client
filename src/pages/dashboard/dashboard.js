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

export default function DashboardPage() {
  const { user } = useAuth(); // Use the actual useAuth hook
  const navigation = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("need-identification");

  useEffect(() => {
    const getStats = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage or your auth context

        // Fetch requisitions stats
        const requisitionsResponse = await fetch("https://hrms-6s3i.onrender.com/api/requisitions/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const requisitionsData = await requisitionsResponse.json();

        // Fetch RFQs stats
        const rfqsResponse = await fetch("https://hrms-6s3i.onrender.com/api/rfqs/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const rfqsData = await rfqsResponse.json();

        // Fetch purchase orders stats
        const purchaseOrdersResponse = await fetch("https://hrms-6s3i.onrender.com/api/purchase-orders/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const purchaseOrdersData = await purchaseOrdersResponse.json();

        // Fetch invoices stats
        const invoicesResponse = await fetch("https://hrms-6s3i.onrender.com/api/invoices/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const invoicesData = await invoicesResponse.json();

        // Combine all stats into a single object
        const statsData = {
          requisitions: requisitionsData,
          rfqs: rfqsData,
          purchaseOrders: purchaseOrdersData,
          invoices: invoicesData,
        };

        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
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
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <AlertCircle className="h-8 w-8" />
        <Typography variant="h6">Failed to load dashboard data</Typography>
      </Box>
    );
  }
  const procurementStages = [
   
    {
      id: "requisitioning",
      label: "Requisitioning",
      icon: <ShoppingCart className="h-5 w-5" />,
      description: "Submit requisition forms and track approvals.",
      action: "Manage Requisitions",
      path: "/requisitions/manage",
      stats: stats.requisitions,
    },
    {
      id: "supplier-sourcing",
      label: "Supplier Sourcing",
      icon: <Users className="h-5 w-5" />,
      description: "Manage vendor RFQs and compare offers.",
      action: "View RFQs",
      path: "/rfqs/view",
      stats: stats.rfqs,
    },
    {
      id: "vendor-selection",
      label: "Vendor Selection",
      icon: <CheckSquare className="h-5 w-5" />,
      description: "Evaluate and select vendors based on performance and cost.",
      action: "View Vendor Ratings",
      path: "/vendors/select",
    },
    {
      id: "purchase-orders",
      label: "Purchase Orders",
      icon: <Package className="h-5 w-5" />,
      description: "Create and manage purchase orders.",
      action: "Manage Purchase Orders",
      path: "/purchase",
      stats: stats.purchaseOrders,
    },
    {
      id: "order-fulfillment",
      label: "Order Fulfillment",
      icon: <Truck className="h-5 w-5" />,
      description: "Track order deliveries and confirm receipts.",
      action: "Track Orders",
      path: "/track-deliveries",
    },
    {
      id: "invoice-payment",
      label: "Invoice & Payment",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Approve invoices and process payments.",
      action: "Process Payments",
      path: "/invoices/manage",
      stats: stats.invoices,
    },
    {
      id: "reports-analytics",
      label: "Reports & Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Analyze procurement data and vendor performance.",
      action: "View Reports",
      path: "/reports-analytics",
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
          Procurement Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Manage your procurement processes efficiently
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
        <StatCard title="Requisitions" icon={<ShoppingCart />} total={stats.requisitions.total} items={[
          { label: "Pending", value: stats.requisitions.pending, color: "warning" },
          { label: "Approved", value: stats.requisitions.approved, color: "success" },
          { label: "Rejected", value: stats.requisitions.rejected, color: "error" },
        ]} />
        <StatCard title="RFQs" icon={<Users />} total={stats.rfqs.total} items={[
          { label: "Open", value: stats.rfqs.open, color: "primary" },
          { label: "Closed", value: stats.rfqs.closed, color: "secondary" },
        ]} />
        <StatCard title="Purchase Orders" icon={<Package />} total={stats.purchaseOrders.total} items={[
          { label: "Pending", value: stats.purchaseOrders.pending, color: "warning" },
          { label: "Approved", value: stats.purchaseOrders.approved, color: "success" },
          { label: "Rejected", value: stats.purchaseOrders.rejected, color: "error" },
        ]} />
        <StatCard title="Invoices" icon={<CreditCard />} total={stats.invoices.total} items={[
          { label: "Pending", value: stats.invoices.pending, color: "warning" },
          { label: "Approved", value: stats.invoices.approved, color: "success" },
          { label: "Paid", value: stats.invoices.paid, color: "primary" },
        ]} />
      </Grid>

      {/* Procurement Process Tabs */}
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 4 }}
      >
        {procurementStages.map((stage) => (
          <Tab
            key={stage.id}
            label={stage.label}
            value={stage.id}
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

      {procurementStages.map((stage) => (
        <div key={stage.id} hidden={activeTab !== stage.id}>
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <CardHeader title={stage.label} subheader={stage.description} />
            <CardContent>
              {stage.stats && (
                <Box mb={2}>
                  <Typography variant="subtitle2">Current Status</Typography>
                  <Grid container spacing={1}>
                    {Object.entries(stage.stats)
                      .filter(([key]) => key !== "total")
                      .map(([key, value]) => (
                        <Grid item key={key} xs={6} sm={4} md={3}>
                          <Chip variant="outlined" label={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`} />
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              )}
              <Button variant="contained" color="primary" onClick={() => navigation(stage.path)}>
                {stage.action}
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
            title="Requisitions"
            icon={<ShoppingCart />}
            description={`${stats.requisitions.pending} pending approvals`}
            action="Manage Requisitions"
            onClick={() => navigation("/requisitioning")}
          />
          <QuickActionCard
            title="Purchase Orders"
            icon={<Package />}
            description={`${stats.purchaseOrders.pending} pending approvals`}
            action="Manage POs"
            onClick={() => navigation("/purchase-orders")}
          />
          <QuickActionCard
            title="Invoices"
            icon={<CreditCard />}
            description={`${stats.invoices.pending} pending payments`}
            action="Process Payments"
            onClick={() => navigation("/invoice-payment")}
          />
          <QuickActionCard
            title="Reports"
            icon={<BarChart3 />}
            description="View procurement analytics"
            action="View Reports"
            onClick={() => navigation("/reports-analytics")}
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