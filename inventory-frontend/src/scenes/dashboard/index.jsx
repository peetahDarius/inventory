import { useEffect, useState, useRef } from "react";
import { Box, Button, useTheme, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import api from "../../api";
import { GoogleMap, LoadScriptNext } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "700px",
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [deployedItems, setDeployedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    fetchDeployed();
  }, []);

  const fetchDeployed = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/deployed/");
      setDeployedItems(response.data);
    } catch (error) {
      console.error("Error fetching deployed items:", error);
    } finally {
      setLoading(false);
    }
  };

  const validDeployedItems = deployedItems.filter((item) => {
    const lat = parseFloat(item.latitude);
    const lng = parseFloat(item.longitude);
    return !isNaN(lat) && !isNaN(lng);
  });

  const mapCenter =
    validDeployedItems.length > 0
      ? {
          lat: parseFloat(validDeployedItems[0].latitude) || defaultCenter.lat,
          lng: parseFloat(validDeployedItems[0].longitude) || defaultCenter.lng,
        }
      : defaultCenter;

  const onLoad = (map) => {
    mapRef.current = map;

    if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
      console.error("Google Maps AdvancedMarkerElement is undefined!");
      return;
    }

    validDeployedItems.forEach((item) => {
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position: {
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
        },
        map: map,
        title: item.name,
      });

      // Attach click event to marker
      marker.addListener("click", () => {
        setSelectedItem(item);
        setIsModalOpen(true); // Open modal
      });
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>

      {/* Google Maps with Advanced Marker Elements */}
      <Box mt="20px">
        <LoadScriptNext
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={["marker"]}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={15}
            options={{ mapId: process.env.REACT_APP_GOOGLE_MAP_ID }}
            onLoad={onLoad}
          />
        </LoadScriptNext>
      </Box>

      {/* Modal for Selected Item */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{selectedItem?.name || "Item Details"}</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
            <Typography><b>Description:</b> {selectedItem.description || "no description"}</Typography>
              <Typography><b>Location:</b> {selectedItem.location}</Typography>
              <Typography><b>Location:</b> {selectedItem.latitude}, {selectedItem.longitude}</Typography>
              <Typography><b>Status:</b> {selectedItem.status || "N/A"}</Typography>
              <Typography><b>Last Updated:</b> {selectedItem.updated_at || "N/A"}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
