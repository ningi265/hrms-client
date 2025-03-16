import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Apartment, Description, ShoppingCart, People } from "@mui/icons-material";

export default function Home() {
  const features = [
    { icon: <Description fontSize="large" />, title: "Requisition Management", description: "Create and track requisition requests from employees" },
    { icon: <People fontSize="large" />, title: "Vendor Management", description: "Maintain a database of qualified vendors" },
    { icon: <ShoppingCart fontSize="large" />, title: "Purchase Orders", description: "Generate and track purchase orders" },
    { icon: <Apartment fontSize="large" />, title: "Invoice Processing", description: "Manage invoices from submission to payment" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#1976D2", color: "white", padding: "16px 0", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold">HRMS Procurement System</Typography>
        <div style={{ marginTop: "10px" }}>
          <Link to="/login">
            <Button variant="contained" color="secondary" style={{ marginRight: "8px" }}>Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="outlined" style={{ borderColor: "white", color: "white" }}>Register</Button>
          </Link>
        </div>
      </header>

      {/* Main Section */}
      <main style={{ flex: 1, textAlign: "center", padding: "40px 16px" }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Streamline Your Procurement Process
        </Typography>
        <Typography variant="h6" color="textSecondary" style={{ maxWidth: "600px", margin: "0 auto 24px" }}>
          A complete solution for managing requisitions, vendors, purchase orders, and invoices.
        </Typography>
        <Link to="/register">
          <Button variant="contained" size="large" style={{ padding: "12px 24px" }}>
            Get Started
          </Button>
        </Link>
      </main>

      {/* Features Section */}
      <section style={{ padding: "40px 16px", textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Key Features</Typography>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", maxWidth: "1000px", margin: "0 auto" }}>
          {features.map((feature, index) => (
            <Card key={index} style={{ padding: "16px", transition: "0.3s", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
              <CardHeader avatar={feature.icon} title={feature.title} titleTypographyProps={{ fontWeight: "bold" }} />
              <CardContent>
                <Typography color="textSecondary">{feature.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#424242", color: "white", textAlign: "center", padding: "16px 0" }}>
        <Typography variant="body2">© {new Date().getFullYear()} HRMS Procurement System. All rights reserved.</Typography>
      </footer>
    </div>
  );
}
