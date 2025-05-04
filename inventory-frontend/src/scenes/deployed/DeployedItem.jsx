import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

const DeployedItem = ({ userData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/api/deployed/${id}/`);
        setItem(response.data);
      } catch (error) {
        console.error("Failed to fetch item details:", error);
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/deployed/${id}/`);
      alert("Item deleted successfully");
      navigate("/deployed");
    } catch (error) {
      console.error("Failed to delete the item", error);
      alert("Failed to delete item.");
    } finally {
      setOpenDeleteModal(false);
    }
  };

  const handleOpenModal = () => setOpenDeleteModal(true);
  const handleCloseModal = () => setOpenDeleteModal(false);

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
        title="Deployed Item Details"
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: colors.greenAccent[400],
              color: colors.grey[100],
              textTransform: "none",
            }}
          >
            Back to List
          </Button>
          {userData.role === "admin" && (
            <Button
              variant="contained"
              color="error"
              onClick={handleOpenModal}
              sx={{ textTransform: "none" }}
            >
              Delete
            </Button>
          )}
        </Box>

        {/* Delete Confirmation Modal */}
        <Dialog open={openDeleteModal} onClose={handleCloseModal}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this deployed item? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>

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
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {item.quantity}
          </Typography>

          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", color: colors.grey[100] }}
          >
            Description:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {item.description}
          </Typography>

          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", color: colors.grey[100] }}
          >
            Location:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {item.location}
          </Typography>

          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", color: colors.grey[100] }}
          >
            Stock ID:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {item.stock_id}
          </Typography>
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
                  ? `${item.created_by.first_name} ${item.created_by.last_name}`
                  : "N/A"}
              </Typography>
            </>
          )}
        </Box>
      </Paper>

      {/* Google Maps Iframe */}
      <Box
        p="20px"
        backgroundColor={colors.primary[400]}
        borderRadius="8px"
        boxShadow={3}
        height="800px"
        mt="30px"
      >
        <Typography variant="h5" mt="3px" mb="10px" color={colors.grey[100]}>
          Location
        </Typography>
        <Box
          component="iframe"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0, borderRadius: "8px" }}
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${item.latitude},${item.longitude}&zoom=15`}
          allowFullScreen
        />
      </Box>
    </Box>
  );
};

export default DeployedItem;
