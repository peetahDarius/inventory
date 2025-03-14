import { Box, Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const AddTeamMember = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await api.post("/api/user/register/", formData)
        navigate("/team");
    } catch (error) {
        console.error(error)
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Add Team Member
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
        <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
        <TextField label="Username" name="username" value={formData.username} onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <TextField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        <TextField label="Default Password" name="password" type="text" value={formData.password} onChange={handleChange} required />
        <Select name="role" value={formData.role} onChange={handleChange} required>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddTeamMember;
