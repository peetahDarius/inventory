import { Box, Button, TextField, Link as MuiLink } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const References = ({ userData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [referencesData, setReferencesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReferences = async () => {
    try {
      const response = await api.get("/api/references/");
      setReferencesData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "client_name",
      headerName: "Client Name",
      flex: 1,
      renderCell: (params) => (
        <MuiLink
          component={Link}
          to={`/references/${params.row.id}`}
          underline="hover"
          sx={{ color: colors.greenAccent[400], fontWeight: "bold" }}
        >
          {params.value}
        </MuiLink>
      ),
    },
    { field: "client_phone", headerName: "Client Phone", flex: 1 },
    { field: "client_package", headerName: "Package", flex: 1 },
    { field: "client_location", headerName: "Location", flex: 1 },
    { field: "referer_name", headerName: "Referer Name", flex: 1 },
    { field: "referer_phone", headerName: "Referer Phone", flex: 1 },
    {
      field: "awarded",
      headerName: "Awarded",
      flex: 0.8,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "created_by",
      headerName: "Created by",
      flex: 1,
      valueGetter: (params) => {
        const createdBy = params.row.created_by;
        return createdBy
          ? `${createdBy.first_name} ${createdBy.last_name}`
          : "N/A";
      },
    },
    {
      field: "created_at",
      headerName: "Created",
      flex: 1,
      valueGetter: (params) =>
        new Date(params.row.created_at).toLocaleString(),
    },
  ];

  // 🔎 Filter references based on search input
  const filteredData = referencesData.filter((item) =>
    item.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.client_phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.client_package?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.client_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.referer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.referer_phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.mpesa_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box m="20px">
      <Header title="REFERENCES" subtitle="List of Client References" />

      {/* Create New Reference Button */}
      <Button
        component={Link}
        to="/add-reference"
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
        Create New Reference
      </Button>

      {/* 🔎 Search Bar */}
      <TextField
        label="Search References"
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
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
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
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default References;
