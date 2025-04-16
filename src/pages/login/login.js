import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardActions, TextField, Typography, Link } from "@mui/material";
import { useAuth } from "../../authcontext/authcontext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password); // This updates the `user` state in AuthProvider
      const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage

      if (!user) {
        throw new Error("User data not found");
      }

      // Redirect based on role
      switch (user.role) {
        case "admin":
        case "procurement_officer":
          navigate("/dashboard"); // Redirect to the main dashboard
          break;
        case "vendor":
          navigate("/vendor-dash"); // Redirect to the vendor dashboard
          break;
        case "employee":
          navigate("/employee-dash"); // Redirect to the employee dashboard
          break;
        default:
          navigate("/"); // Fallback for unknown roles
      }
    } catch (error) {
      alert("Login failed. Invalid credentials."); // Replace with a toast/snackbar
      console.error("Login error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg,rgb(1, 4, 17) 0%,rgb(54, 79, 100) 100%)",display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Card sx={{ background: "linear-gradient(135deg,rgb(221, 223, 237) 0%,rgb(180, 191, 200) 100%)",maxWidth: 400, padding: 3, boxShadow: 3 }}>
        <CardHeader
          title={<Typography variant="h5" fontWeight="bold">Login</Typography>}
          subheader={<Typography color="textSecondary">Enter your credentials to access your account</Typography>}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
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
            <Typography variant="body2" align="right">
              <Link href="/auth/forgot-password" underline="hover">
                Forgot password?
              </Link>
            </Typography>
            <CardActions sx={{ flexDirection: "column", mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link href="/register" underline="hover">
                  Register
                </Link>
              </Typography>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}