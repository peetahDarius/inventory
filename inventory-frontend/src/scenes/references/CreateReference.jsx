import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "700px",
};

const defaultCenter = { lat: -1.5312, lng: 37.2674 };

const CreateReference = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    client_package: "",
    client_location: "",
    referer_name: "",
    referer_phone: "",
    mpesa_message: "",
  });

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [savedCoordinates, setSavedCoordinates] = useState(null);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchAddress, setSearchAddress] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMapDoubleClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setTempCoordinates({ lat, lng });
    setOpenLocationModal(true);
  };

  const handleSaveLocation = () => {
    setSavedCoordinates(tempCoordinates);
    setMapCenter(tempCoordinates);
    setOpenLocationModal(false);
  };

  const handleCancelLocation = () => {
    setTempCoordinates(null);
    setOpenLocationModal(false);
  };

  const onLoadAutocomplete = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapCenter(newCenter);
        setSearchAddress(place.formatted_address || place.name);
      }
    }
  };

  const handleSubmit = async () => {
    if (!savedCoordinates) {
      alert("Please select a location from the map by double-clicking.");
      return;
    }

    const dataToSend = {
      ...formData,
      latitude: savedCoordinates.lat,
      longitude: savedCoordinates.lng,
      awarded: false,
    };

    try {
      const response = await api.post("/api/references/", dataToSend);
      if (response.status === 201 || response.status === 200) {
        alert("Reference created successfully!");
        navigate("/references");
      } else {
        alert("Error creating reference.");
      }
    } catch (error) {
      console.error("Error creating reference:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Error. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <Box m="20px">
      <Header title="Create Reference" subtitle="Add a new client reference" />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          label="Client Name"
          name="client_name"
          fullWidth
          value={formData.client_name}
          onChange={handleChange}
        />

        <TextField
          label="Client Phone"
          name="client_phone"
          fullWidth
          value={formData.client_phone}
          onChange={handleChange}
        />

        <TextField
          label="Client Package"
          name="client_package"
          fullWidth
          value={formData.client_package}
          onChange={handleChange}
        />

        <TextField
          label="Client Location"
          name="client_location"
          fullWidth
          value={formData.client_location}
          onChange={handleChange}
        />

        <TextField
          label="Referer Name"
          name="referer_name"
          fullWidth
          value={formData.referer_name}
          onChange={handleChange}
        />

        <TextField
          label="Referer Phone"
          name="referer_phone"
          fullWidth
          value={formData.referer_phone}
          onChange={handleChange}
        />

        <TextField
          label="MPESA Message"
          name="mpesa_message"
          fullWidth
          multiline
          rows={4}
          value={formData.mpesa_message}
          onChange={handleChange}
        />

        {/* Google Maps */}
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          <Autocomplete
            onLoad={onLoadAutocomplete}
            onPlaceChanged={onPlaceChanged}
          >
            <TextField
              label="Search Location"
              fullWidth
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
          </Autocomplete>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={15}
            onDblClick={handleMapDoubleClick}
          >
            {savedCoordinates && <Marker position={savedCoordinates} />}
          </GoogleMap>
        </LoadScript>

        <TextField
          label="Latitude"
          fullWidth
          value={savedCoordinates ? savedCoordinates.lat : ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Longitude"
          fullWidth
          value={savedCoordinates ? savedCoordinates.lng : ""}
          InputProps={{ readOnly: true }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mb: 3, backgroundColor: colors.greenAccent[400] }}
        >
          Submit Reference
        </Button>
      </Box>

      {/* Confirm Location Modal */}
      <Dialog open={openLocationModal} onClose={handleCancelLocation}>
        <DialogTitle>Save Location</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to save this location?
            {tempCoordinates && (
              <>
                <br />
                Latitude: {tempCoordinates.lat.toFixed(4)}, Longitude:{" "}
                {tempCoordinates.lng.toFixed(4)}
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLocation}>Cancel</Button>
          <Button onClick={handleSaveLocation}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateReference;
