import { Box, Button, TextField, Typography, Paper, Autocomplete } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const CreatePurchase = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [purchaseItems, setPurchaseItems] = useState([]);
  const [equipments, setEquipments] = useState([])
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    description: "",
    price: "",
    seller_name: "",
    seller_contact: "",
    seller_description: "",
  });

  useEffect(() => {
    fetchEquipments()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchEquipments = async () => {
    try {
      const response = await api.get("/api/equipments/")
      setEquipments(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaveItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: purchaseItems.length + 1,
      ...formData,
    };
    setPurchaseItems((prev) => [...prev, newItem]);
    setFormData({
      name: "",
      quantity: "",
      description: "",
      price: "",
      seller_name: "",
      seller_contact: "",
      seller_description: "",
    });
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    const successfulSubmissions = [];
    const failedSubmissions = [];

    // Loop through each purchase item sequentially
    for (const item of purchaseItems) {
      try {
        const response = await api.post("/api/purchased/", item);
        if (response.status === 201) {
          successfulSubmissions.push(item);
        } else {
          failedSubmissions.push(item);
        }
      } catch (error) {
        failedSubmissions.push(item);
      }
    }

    if (failedSubmissions.length === 0) {
      // All items submitted successfully: redirect
      navigate("/purchase");
    } else {
      // Remove successfully submitted items from the table.
      setPurchaseItems(failedSubmissions);
      setSubmitting(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Item Name", flex: 1 },
    { field: "quantity", headerName: "Quantity", type: "number", flex: 0.5 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "price", headerName: "Price", type: "number", flex: 0.5 },
    { field: "seller_name", headerName: "Seller Name", flex: 1 },
    { field: "seller_contact", headerName: "Seller Contact", flex: 1 },
    { field: "seller_description", headerName: "Seller Description", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="Create Purchase" subtitle="Add new purchase items" />

      {/* Table rendered at the top */}
      <Box
        mb={2}
        height="40vh"
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
        }}
      >
        <DataGrid
          rows={purchaseItems}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </Box>

      {/* Submit All Button below the table */}
      <Button
        variant="contained"
        onClick={handleSubmitAll}
        disabled={submitting}
        sx={{
          mb: 2,
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          textTransform: "none",
          padding: "10px",
          fontSize: "16px",
        }}
      >
        Submit All
      </Button>

      {/* Form rendered at the bottom */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: colors.primary[400],
        }}
      >
        <Typography variant="h5" sx={{ color: colors.grey[100], mb: 2 }}>
          Add New Purchase Item
        </Typography>
        <Box
          component="form"
          onSubmit={handleSaveItem}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Autocomplete
  freeSolo
  options={equipments}
  getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
  onChange={(event, value) => {
    if (typeof value === 'string') {
      setFormData((prev) => ({
        ...prev,
        name: value,
        description: "",
      }));
    } else if (value) {
      setFormData((prev) => ({
        ...prev,
        name: value.name,
        description: value.description,
      }));
    } else {
      setFormData((prev) => ({ ...prev, name: "", description: "" }));
    }
  }}
  onInputChange={(event, newInputValue) => {
    setFormData((prev) => ({
      ...prev,
      name: newInputValue,
      description: "",
    }));
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Item Name"
      name="name"
      variant="outlined"
      fullWidth
      value={formData.name}
      onChange={handleInputChange}
    />
  )}
/>

          <TextField
            label="Quantity"
            name="quantity"
            variant="outlined"
            fullWidth
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
          />
          <TextField
  label="Description"
  name="description"
  variant="outlined"
  fullWidth
  multiline
  rows={3}
  value={formData.description}
  onChange={handleInputChange}
  InputProps={{
    readOnly: equipments.some(eq => eq.name === formData.name)
  }}
/>

          <TextField
            label="Price"
            name="price"
            variant="outlined"
            fullWidth
            type="number"
            value={formData.price}
            onChange={handleInputChange}
          />
          <TextField
            label="Seller Name"
            name="seller_name"
            variant="outlined"
            fullWidth
            value={formData.seller_name}
            onChange={handleInputChange}
          />
          <TextField
            label="Seller Contact"
            name="seller_contact"
            variant="outlined"
            fullWidth
            value={formData.seller_contact}
            onChange={handleInputChange}
          />
          <TextField
            label="Seller Description"
            name="seller_description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={formData.seller_description}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              textTransform: "none",
              padding: "10px",
              fontSize: "16px",
            }}
          >
            Save Item
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreatePurchase;
