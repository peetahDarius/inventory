import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../apiConstants";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message)
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.blueAccent[700]}, ${colors.primary[400]})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: { xs: "90%", sm: "400px" },
          borderRadius: 2,
          backgroundColor: colors.primary[400],
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: colors.grey[100] }}
        >
          Login
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          gutterBottom
          sx={{ color: colors.grey[300] }}
        >
          Sign in to your account
        </Typography>
        <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            InputLabelProps={{
              style: { color: colors.grey[100] },
            }}
            InputProps={{
              style: { color: colors.grey[100] },
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputLabelProps={{
              style: { color: colors.grey[100] },
            }}
            InputProps={{
              style: { color: colors.grey[100] },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              mt: 3,
              backgroundColor: colors.greenAccent[400],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[500],
              },
              textTransform: "none",
              padding: "10px",
              fontSize: "16px",
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
