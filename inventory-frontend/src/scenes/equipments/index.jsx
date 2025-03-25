import { Box, Button, Typography, useTheme, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useEffect, useState } from "react";

const Equipments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [usersData, setUsersData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      const response = await api.get("/api/equipments/");
      setUsersData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "created_at",
      headerName: "Created",
      flex: 0.5,
      valueGetter: (params) =>
        new Date(params.row.created_at).toLocaleString(),
    },
  ];

  // 🔎 Filtered Data based on search query
  const filteredData = usersData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box m="20px">
      <Header title="Equipments" subtitle="Managing the Equipments" />
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/add-equipment")}
      >
        Add Equipment
      </Button>

      {/* 🔎 Search Bar */}
      <TextField
        label="Search Equipments"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid rows={filteredData} columns={columns} />
      </Box>
    </Box>
  );
};

export default Equipments;
