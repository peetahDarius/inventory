import { Box, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const Stock = ({ userData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [stockData, setStockData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStock = async () => {
    try {
      const response = await api.get("/api/stock/");
      setStockData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStock();
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
          to={`/stocked/${params.row.id}`}
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
    ...(userData?.role === "admin"
      ? [
          {
            field: "created_by",
            headerName: "Created by",
            flex: 1,
            valueGetter: (params) => {
              const createdBy = params.row.created_by;
              return createdBy ? `${createdBy.first_name} ${createdBy.last_name}` : "";
            },
          },
        ]
      : []),
    { field: "item_id", headerName: "Item ID", flex: 0.5 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "created_at",
      headerName: "Created",
      flex: 1,
      valueGetter: (params) => new Date(params.row.created_at).toLocaleString(),
    },
  ];

  // 🔎 Filter the stock data based on search query
  const filteredData = stockData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.item_id && item.item_id.toString().includes(searchQuery))
  );

  return (
    <Box m="20px">
      <Header title="Stock" subtitle="List of Purchase Items" />

      {/* Add into Stock Button */}
      <Button
        component={Link}
        to="/add-stock"
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
        Add into Stock
      </Button>

      {/* 🔎 Search Bar */}
      <TextField
        label="Search Stock"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Stock Data Table */}
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

export default Stock;
