import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

const StockedItem = ({ userData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/api/stock/${id}/`);
        setItem(response.data);
        setQuantity(response.data.quantity);
      } catch (error) {
        console.error("Failed to fetch item details:", error);
      }
    };
    fetchItem();
  }, [id]);

  const handleUpdate = async () => {
    const data = {...item, quantity}
    try {
      await api.put(`/api/stock/${id}/`, data );
      alert("Quantity updated successfully!");
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  if (!item) {
    return (
      <Box m="20px">
        <Typography variant="h6" sx={{ color: colors.grey[100] }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header
        title="Stocked Item Details"
        subtitle={`Details for Item ID: ${id}`}
      />
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: colors.primary[400],
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            mb: 2,
            backgroundColor: colors.greenAccent[700],
            color: colors.grey[100],
            textTransform: "none",
          }}
        >
          Back to List
        </Button>
        <Typography
          variant="h4"
          sx={{ color: colors.grey[100], mb: 2, textTransform: "capitalize" }}
        >
          {item.name}
        </Typography>
        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "max-content auto",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", color: colors.grey[100] }}
          >
            Quantity:
          </Typography>
          <TextField
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            variant="outlined"
            sx={{ backgroundColor: colors.grey[900], borderRadius: 1 }}
          />

          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", color: colors.grey[100] }}
          >
            Description:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {item.description}
          </Typography>
        </Box>
        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{
              backgroundColor: colors.blueAccent[500],
              color: colors.grey[100],
              textTransform: "none",
            }}
          >
            Update
          </Button>
        </Box>
        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "max-content auto",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: colors.grey[100] }}
          >
            Created At:
          </Typography>
          <Typography variant="body2" sx={{ color: colors.grey[100] }}>
            {new Date(item.created_at).toLocaleString()}
          </Typography>

          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: colors.grey[100] }}
          >
            Updated At:
          </Typography>
          <Typography variant="body2" sx={{ color: colors.grey[100] }}>
            {new Date(item.updated_at).toLocaleString()}
          </Typography>
          {userData.role === "admin" && (
            <>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: colors.grey[100] }}
              >
                Created By:
              </Typography>
              <Typography variant="body1" sx={{ color: colors.grey[100] }}>
                {item.created_by
                  ? ` ${item.created_by.first_name} ${item.created_by.last_name} `
                  : "N/A"}
              </Typography>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default StockedItem;
