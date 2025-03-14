import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useEffect, useState } from "react";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([])

  useEffect(() => {
    fetchTeam()
  }, [])
  
  const fetchTeam = async () => {
    try {
      const response = await api.get("/api/user/register/")
      setUsersData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "first_name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row }) => (
        <Typography
          color={colors.greenAccent[300]}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(`/team/${row.id}`)}
        >
          {row.first_name} {row.last_name}
        </Typography>
      ),
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { role } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={
            role === "admin"
              ? colors.greenAccent[600]
              : colors.greenAccent[700]
          }
          borderRadius="4px"
        >
          {role === "admin" && <AdminPanelSettingsOutlinedIcon />}
          {role === "manager" && <SecurityOutlinedIcon />}
          {role === "user" && <LockOpenOutlinedIcon />}
          <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
            {role}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/add-team-member")}
      >
        Add Team Member
      </Button>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
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
        <DataGrid rows={usersData} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
