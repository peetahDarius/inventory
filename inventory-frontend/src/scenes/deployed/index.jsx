import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const Deployed = ({userData}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [deployedData, setDeployedData] = useState([]);

  const fetchDeployed = async () => {
    try {
      const response = await api.get("/api/deployed/");
      setDeployedData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeployed();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Item Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Link
          to={`/deployed/${params.row.id}`}
          style={{
            color: colors.greenAccent[300],
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "stock_id",
      headerName: "Stock ID",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "description", headerName: "Description", flex: 1 },
    ...(userData?.row === "admin" ? [
      {
        field: "created_by",
        headerName: "Created by",
        flex: 1,
        valueGetter: (params) => {
          const createdBy = params.row.created_by;
          return createdBy ? `${createdBy.first_name} ${createdBy.last_name}` : "";
        },
      },
    ]
    :
    []
  ),
    {
      field: "created_at",
      headerName: "Created",
      flex: 1,
      valueGetter: (params) =>
        new Date(params.row.created_at).toLocaleString(),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Deployed" subtitle="List of Deployed Items" />
      {/* Create New Purchase Button */}
      <Button
        component={Link}
        to="/deploy-item"
        variant="contained"
        sx={{
          mb: 2,
          backgroundColor: colors.greenAccent[400],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.greenAccent[500],
          },
          textTransform: "none",
        }}
      >
        Deploy an item
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
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={deployedData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Deployed;
