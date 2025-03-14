import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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

const DeployItem = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate()

  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [apartment, setApartment] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [savedCoordinates, setSavedCoordinates] = useState(null);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await api.get("/api/stock/");
        setAvailableItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStock();
  }, []);

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

  const handleSave = async () => {
    if (!selectedItem) {
      alert("Please select an item.");
      return;
    }
    if (!quantity) {
      alert("Please enter the quantity.");
      return;
    }
    if (!savedCoordinates) {
      alert("Please select a location from the map by double-clicking.");
      return;
    }

    const dataToSend = {
      stock_id: selectedItem.item_id,
      name: selectedItem.name,
      description: selectedItem.description,
      quantity,
      location: apartment,
      latitude: savedCoordinates.lat,
      longitude: savedCoordinates.lng,
    };
    try {
      const response = await api.post("/api/deployed/", dataToSend);
      if (response.status === 201 || response.status === 200) {
        alert("Item deployed successfully!");
        setSelectedItem("");
        setQuantity("");
        setApartment("");
        setSavedCoordinates(null);
        navigate("/deployed")
      } else {
        alert("Error deploying item.");
      }
    } catch (error) {
      console.error("Error deploying item:", error);
      alert("Error deploying item. Please try again.");
    }
  };

  return (
    <Box m="20px">
      <Header title="Deploy Item" subtitle="Deploy an item to a location" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="select-item-label">Select Item</InputLabel>
          <Select
            labelId="select-item-label"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflowY: "auto",
                },
              },
            }}
          >
            {availableItems.map((item) => (
              <MenuItem key={item.item_id} value={item}>
                {`${item.name} - ${item.description}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Quantity"
          placeholder="Enter quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <TextField
          label="Apartment"
          placeholder="Building/location of deployment"
          fullWidth
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
        />

        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
          <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
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
    InputProps={{ readOnly: true }} // Makes it non-editable
  />

  <TextField
    label="Longitude"
    fullWidth
    value={savedCoordinates ? savedCoordinates.lng : ""}
    InputProps={{ readOnly: true }}
  />
        <Button variant="contained" onClick={handleSave} sx={{ mb: 3, backgroundColor: colors.greenAccent[400] }}>
          Save
        </Button>
      </Box>

      <Dialog open={openLocationModal} onClose={handleCancelLocation}>
        <DialogTitle>Save Location</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to save this location?
            {tempCoordinates && (
              <>Latitude: {tempCoordinates.lat.toFixed(4)}, Longitude: {tempCoordinates.lng.toFixed(4)}</>
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

export default DeployItem;
