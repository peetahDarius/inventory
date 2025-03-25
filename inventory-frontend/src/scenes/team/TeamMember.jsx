import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Modal,
  TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

const TeamMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Edit Profile States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchMember();
  }, []);

  const fetchMember = async () => {
    try {
      const response = await api.get(`/api/user/${id}/`);
      setMember(response.data);
      setEditData({
        username: response.data.username || "",
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async () => {
    try {
      await api.post(`/api/user/change-password/`, {
        user_id: id,
        new_password: newPassword,
      });
      alert("Password has been reset successfully!");
      setOpenModal(false);
      navigate("/team");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password.");
    }
  };

  const handleEditProfile = async () => {
    try {
      await api.patch(`/api/user/${id}/`, editData);
      alert("Profile updated successfully!");
      setEditModalOpen(false);
      fetchMember(); // Refresh updated data
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (!member) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" color="error">
          Team Member Not Found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Card
        sx={{
          width: 400,
          p: 3,
          textAlign: "center",
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {member.username}'s Profile
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1"><strong>ID:</strong> {member.id}</Typography>
          <Typography variant="body1"><strong>Username:</strong> {member.username}</Typography>
          <Typography variant="body1"><strong>First Name:</strong> {member.first_name}</Typography>
          <Typography variant="body1"><strong>Last Name:</strong> {member.last_name}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {member.email}</Typography>
          <Typography variant="body1"><strong>Phone:</strong> {member.phone}</Typography>
          <Typography variant="body1"><strong>Role:</strong> {member.role}</Typography>

          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            {member.role !== "admin" && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => setOpenModal(true)}
              >
                Reset Password
              </Button>
            )}
            {/* Edit Profile Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditModalOpen(true)}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

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
          <Typography variant="h6" mb={2}>Reset Password</Typography>
          <TextField
            label="New Password"
            type="text"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleResetPassword}>Confirm</Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>Edit Profile</Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Username"
              value={editData.username}
              onChange={(e) => setEditData({ ...editData, username: e.target.value })}
            />
            <TextField
              label="First Name"
              value={editData.first_name}
              onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
            />
            <TextField
              label="Last Name"
              value={editData.last_name}
              onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
            <TextField
              label="Phone"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            />
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleEditProfile}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TeamMember;
