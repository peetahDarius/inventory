import { Box, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const Deployed = ({ userData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [deployedData, setDeployedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDeployed = async () => {
    try {
      const response = await api.get("/api/deployed/");
      setDeployedData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeployed();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Item Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Link
          to={`/deployed/${params.row.id}`}
          style={{
            color: colors.greenAccent[300],
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "stock_id",
      headerName: "Stock ID",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "description", headerName: "Description", flex: 1 },
    ...(userData?.role === "admin"
      ? [
          {
            field: "created_by",
            headerName: "Created by",
            flex: 1,
            valueGetter: (params) => {
              const createdBy = params.row.created_by;
              return createdBy
                ? `${createdBy.first_name} ${createdBy.last_name}`
                : "";
            },
          },
        ]
      : []),
    {
      field: "created_at",
      headerName: "Created",
      flex: 1,
      valueGetter: (params) =>
        new Date(params.row.created_at).toLocaleString(),
    },
  ];

  // 🔎 Filtering logic based on searchQuery
  const filteredData = deployedData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location &&
        item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.stock_id && item.stock_id.toString().includes(searchQuery))
  );

  return (
    <Box m="20px">
      <Header title="Deployed" subtitle="List of Deployed Items" />

      {/* Deploy Item Button */}
      <Button
        component={Link}
        to="/deploy-item"
        variant="contained"
        sx={{
          mb: 2,
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.greenAccent[500],
          },
          textTransform: "none",
        }}
      >
        Deploy to Site
      </Button>

      {/* 🔎 Search Bar */}
      <TextField
        label="Search Deployed Items"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Data Grid */}
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
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Deployed;
