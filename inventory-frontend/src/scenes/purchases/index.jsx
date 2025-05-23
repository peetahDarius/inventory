import { Box, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const Purchases = ({ userData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [purchasesData, setPurchasesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPurchases = async () => {
    try {
      const response = await api.get("/api/purchased/");
      setPurchasesData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPurchases();
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
          to={`/purchased/${params.row.id}`}
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
    { field: "seller_name", headerName: "Seller", flex: 1 },
    { field: "seller_contact", headerName: "Seller Contact", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "status", headerName: "Status", flex: 1 },
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

  // 🔎 Filter purchases based on search input
  const filteredData = purchasesData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.seller_name &&
      item.seller_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.seller_contact &&
      item.seller_contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.status && item.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.price && item.price.toString().includes(searchQuery)) ||
    (item.quantity && item.quantity.toString().includes(searchQuery))
  );

  return (
    <Box m="20px">
      <Header title="PURCHASES" subtitle="List of Purchase Items" />

      {/* Create New Purchase Button */}
      <Button
        component={Link}
        to="/create-purchase"
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
        Create New Purchase
      </Button>

      {/* 🔎 Search Bar */}
      <TextField
        label="Search Purchases"
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
          "& .name-column--cell": { color: colors.greenAccent[300] },
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

export default Purchases;
