import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

const PurchasedItem = ({userData}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/api/purchased/${id}/`);
        setItem(response.data);
      } catch (error) {
        console.error("Failed to fetch item details:", error);
      }
    };
    fetchItem();
  }, [id]);

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
        title="Purchased Item Details"
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
            backgroundColor: colors.greenAccent[400],
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
          <Typography variant="body1" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Quantity:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {item.quantity}
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Description:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {item.description}
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Price:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {item.price}
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Status:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {item.status}
          </Typography>

          {item.seller_name && (
            <>
              <Typography variant="body1" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
                Seller Name:
              </Typography>
              <Typography variant="body1" sx={{ color: colors.grey[100] }}>
                {item.seller_name}
              </Typography>
            </>
          )}

          {item.seller_contact && (
            <>
              <Typography variant="body1" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
                Seller Contact:
              </Typography>
              <Typography variant="body1" sx={{ color: colors.grey[100] }}>
                {item.seller_contact}
              </Typography>
            </>
          )}

          {item.seller_description && (
            <>
              <Typography variant="body1" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
                Seller Description:
              </Typography>
              <Typography variant="body1" sx={{ color: colors.grey[100] }}>
                {item.seller_description}
              </Typography>
            </>
          )}
        </Box>
        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "max-content auto",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Created At:
          </Typography>
          <Typography variant="body2" sx={{ color: colors.grey[100] }}>
            {new Date(item.created_at).toLocaleString()}
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Updated At:
          </Typography>
          <Typography variant="body2" sx={{ color: colors.grey[100] }}>
            {new Date(item.updated_at).toLocaleString()}
          </Typography>
          {userData.role === "admin" && <>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Created By:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {item.created_by
              ? `${item.created_by.first_name} ${item.created_by.last_name}`
              : "N/A"}
          </Typography>
          </>}
        </Box>
      </Paper>
    </Box>
  );
};

export default PurchasedItem;
