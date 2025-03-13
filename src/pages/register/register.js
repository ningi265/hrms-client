"use client";

import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardActions, TextField, Typography, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useAuth } from "../../authcontext/authcontext";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(name, email, password, role);
      alert("Registration successful!"); // Replace with a better UI notification
      navigate.push("/dashboard");
    } catch (error) {
      alert("Registration failed. Please try again."); // Replace with a toast/snackbar
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Card sx={{ maxWidth: 400, padding: 3, boxShadow: 3 }}>
        <CardHeader
          title={<Typography variant="h5" fontWeight="bold">Create an account</Typography>}
          subheader={<Typography color="textSecondary">Enter your details to create an account</Typography>}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="procurement_officer">Procurement Officer</MenuItem>
                <MenuItem value="vendor">Vendor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <CardActions sx={{ flexDirection: "column", mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
  Already have an account?{" "}
  <Link to="/login" underline="hover"> {/* Correct path for login */}
    Login
  </Link>
</Typography>

            </CardActions>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
