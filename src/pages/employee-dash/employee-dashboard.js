"use client";

import { useState } from "react";
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
  Card,
  CardContent,
  CardHeader,
  Chip,
} from "@mui/material";
import { useAuth } from "../../authcontext/authcontext";

const mockStats = {
  requisitions: { total: 10, pending: 3, approved: 5, rejected: 2 },
  rfqs: { total: 8, open: 4, closed: 4 },
  purchaseOrders: { total: 15, pending: 6, approved: 7, rejected: 2 },
  invoices: { total: 12, pending: 4, approved: 5, paid: 3 },
};

const employees = [
  { id: 1, name: "John Doe", role: "Approver", stage: "requisitioning" },
  { id: 2, name: "Jane Smith", role: "Approver", stage: "purchase-orders" },
  { id: 3, name: "Alice Johnson", role: "Approver", stage: "invoice-payment" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigation = useNavigate();
  const [activeTab, setActiveTab] = useState("need-identification");

  const procurementStages = [
    { id: "need-identification", label: "Need Identification", icon: <FileText className="h-5 w-5" />, description: "Identify and request necessary goods and services.", action: "Start Request", path: "/requisitions" },
    { id: "requisitioning", label: "Requisitioning", icon: <ShoppingCart className="h-5 w-5" />, description: "Submit requisition forms and track approvals.", action: "Manage Requisitions", path: "/requisitions/manage", stats: mockStats.requisitions },
    { id: "purchase-orders", label: "Purchase Orders", icon: <Package className="h-5 w-5" />, description: "Create and manage purchase orders.", action: "Manage Purchase Orders", path: "/purchase-orders", stats: mockStats.purchaseOrders },
    { id: "invoice-payment", label: "Invoice & Payment", icon: <CreditCard className="h-5 w-5" />, description: "Approve invoices and process payments.", action: "Process Payments", path: "/invoice-payment", stats: mockStats.invoices },
  ];

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="flex-start" mb={4} p={4} sx={{ background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", color: "white", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Employee Dashboard</Typography>
        <Typography variant="subtitle1">Manage your procurement processes efficiently</Typography>
        <Box display="flex" alignItems="center" mt={2}>
          <Avatar src={user?.avatar} alt={user?.name} />
          <Box ml={2}>
            <Typography variant="body1">Welcome back, {user?.name}!</Typography>
            <Typography variant="body2">{user?.email}</Typography>
          </Box>
        </Box>
      </Box>
      <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} variant="scrollable" scrollButtons="auto" sx={{ mb: 4 }}>
        {procurementStages.map((stage) => (
          <Tab key={stage.id} label={stage.label} value={stage.id} sx={{ textTransform: "none", fontWeight: "bold", "&.Mui-selected": { color: "primary.main" } }} />
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
                    {Object.entries(stage.stats).filter(([key]) => key !== "total").map(([key, value]) => (
                      <Grid item key={key} xs={6} sm={4} md={3}>
                        <Chip variant="outlined" label={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              <Button variant="contained" color="primary" onClick={() => navigation(stage.path)}>{stage.action}</Button>
            </CardContent>
          </Card>
          <Typography variant="h6">Responsible Employees</Typography>
          <Grid container spacing={2}>
            {employees.filter(emp => emp.stage === stage.id).map(emp => (
              <Grid item key={emp.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="body1">{emp.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{emp.role}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </Container>
  );
}
