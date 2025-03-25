import { Box, Button, MenuItem, Select, TextField, Typography, TextareaAutosize } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const AddEquipments = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await api.post("/api/equipments/", formData)
        navigate("/equipments");
    } catch (error) {
        console.error(error)
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Add Equipment
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} required />
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </Box>
    </Box>
  );
};

export default AddEquipments;
