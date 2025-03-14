import { useState } from "react";
import { Box, IconButton, useTheme, Menu, MenuItem, Typography, Button, Modal, TextField } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN } from "../../apiConstants";

const Topbar = ({userData}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [openModal, setOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const navigate = useNavigate();

  // State for dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleResetPassword = async () => {
    try {
      await api.post(`/api/user/change-password/`, {
        existing_password: oldPassword,
        user_id: userData.id,
        new_password: newPassword,
      });
      alert("Password has been reset successfully!");
      setOpenModal(false);
      navigate("/");
    } catch (error) {
      console.error("Error resetting password:", error.response.data);
      alert("Failed to reset password");
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN); // Remove token
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleMenuClick}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* DROPDOWN MENU */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => setOpenModal(true)}>
          <Typography>Change Password</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
      {/* Reset Password Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" mb={2}>
            Reset Password
          </Typography>
          <TextField
            label="Old Password"
            type="text"
            fullWidth
            variant="outlined"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="text"
            fullWidth
            variant="outlined"
            value={newPassword}
            sx={{ marginTop: "15px"}}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleResetPassword}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Topbar;
