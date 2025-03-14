import { Box, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api";

const AddStock = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [availableItems, setAvailableItems] = useState([]);

  const fetchPendingPurchases = async () => {
    try {
      const response = await api.get("/api/purchased/pending/");
      setAvailableItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPendingPurchases();
  }, []);

  // State to track quantity input per item (keyed by item id)
  const [quantities, setQuantities] = useState({});

  // Prepare rows for DataGrid
  const rows = availableItems.map((item) => ({
    ...item,
    id: item.id,
  }));

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAdd = async (row) => {
    const qty = quantities[row.id];
    if (!qty || Number(qty) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    const dataToSend = {
      item_id: row.id,
      name: row.name,
      description: row.description,
      quantity: Number(qty),
    };
    try {
      const response = await api.post("/api/stock/", dataToSend);
      if (response.status === 201 || response.status === 200) {
        setQuantities((prev) => ({ ...prev, [row.id]: "" }));
        alert(`Item ${row.name} added successfully!`);
        // Re-fetch pending purchases to update available items and re-render the component
        fetchPendingPurchases();
      } else {
        alert("Error adding stock item.");
      }
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("Error adding stock item. Please try again.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.5,
      renderCell: (params) => (
        <TextField
          type="number"
          size="small"
          value={quantities[params.row.id] || ""}
          onChange={(e) =>
            handleQuantityChange(params.row.id, e.target.value)
          }
          sx={{
            input: { color: colors.grey[100] },
          }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => handleAdd(params.row)}
          sx={{
            backgroundColor: colors.greenAccent[400],
            color: colors.grey[100],
            textTransform: "none",
          }}
        >
          Add
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Add Stock" subtitle="Add new stock items" />
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
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default AddStock;
