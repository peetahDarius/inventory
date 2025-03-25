import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

const Reference = ({ userData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const [reference, setReference] = useState(null);
  const [awarded, setAwarded] = useState(false);

  useEffect(() => {
    const fetchReference = async () => {
      try {
        const response = await api.get(`/api/references/${id}/`);
        setReference(response.data);
        setAwarded(response.data.awarded);
      } catch (error) {
        console.error("Failed to fetch reference details:", error);
      }
    };
    fetchReference();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/api/references/${id}/`, { ...reference, awarded });
      alert("Award status updated successfully!");
    } catch (error) {
      console.error("Failed to update award status:", error);
    }
  };

  if (!reference) {
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
        title="Reference Details"
        subtitle={`Details for Reference ID: ${id}`}
      />
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: colors.primary[400],
          maxWidth: "900px",
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

        <Typography variant="h4" sx={{ color: colors.grey[100], mb: 2 }}>
          {reference.client_name}
        </Typography>

        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "max-content auto",
            gap: 2,
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Client Phone:
          </Typography>
          <Typography sx={{ color: colors.grey[100] }}>
            {reference.client_phone}
          </Typography>

          <Typography sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Package:
          </Typography>
          <Typography sx={{ color: colors.grey[100] }}>
            {reference.client_package}
          </Typography>

          <Typography sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Location:
          </Typography>
          <Typography sx={{ color: colors.grey[100] }}>
            {reference.client_location}
          </Typography>

          <Typography sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Referer Name:
          </Typography>
          <Typography sx={{ color: colors.grey[100] }}>
            {reference.referer_name}
          </Typography>
          <Typography sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Referer Phone:
          </Typography>
          <Typography sx={{ color: colors.grey[100] }}>
            {reference.referer_phone}
          </Typography>

          <Typography sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Mpesa Message:
          </Typography>
          <Typography sx={{ color: colors.grey[100] }}>
            {reference.mpesa_message}
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={awarded}
              onChange={(e) => setAwarded(e.target.checked)}
              sx={{ color: colors.greenAccent[400] }}
            />
          }
          label={
            <Typography sx={{ color: colors.grey[100] }}>Awarded</Typography>
          }
        />

        {userData.role === "admin" && 
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
        }

        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />

        <Typography sx={{ fontWeight: "bold", color: colors.grey[100] }}>
          Map Location:
        </Typography>
        <Box
          sx={{
            height: "500px",
            width: "100%",
            my: 2,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Google Maps Iframe */}
          <Box
            backgroundColor={colors.primary[400]}
            borderRadius="8px"
            // boxShadow={3}
            height="500px"
            mt="30px"
          >
            <Box
              component="iframe"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0, borderRadius: "8px" }}
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${reference.latitude},${reference.longitude}&zoom=15`}
              allowFullScreen
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "max-content auto",
            gap: 2,
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: colors.grey[100] }}>
            Created At:
          </Typography>
          <Typography sx={{ color: colors.grey[100] }}>
            {new Date(reference.created_at).toLocaleString()}
          </Typography>

          {userData.role === "admin" && reference.created_by && (
            <>
              <Typography sx={{ fontWeight: "bold", color: colors.grey[100] }}>
                Created By:
              </Typography>
              <Typography sx={{ color: colors.grey[100] }}>
                {reference.created_by.first_name}{" "}
                {reference.created_by.last_name}
              </Typography>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Reference;
