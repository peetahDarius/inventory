import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Purchases from "./scenes/purchases";
import Login from "./scenes/login";
import ProtectedRoute from "./components/ProtectedRoutes";
import CreatePurchase from "./scenes/purchases/CreatePurchase";
import PurchasedItem from "./scenes/purchases/PurchasedItem";
import Stock from "./scenes/stock";
import AddStock from "./scenes/stock/AddStock";
import Deployed from "./scenes/deployed";
import DeployItem from "./scenes/deployed/DeployItem";
import DeployedItem from "./scenes/deployed/DeployedItem";
import AddTeamMember from "./scenes/team/AddTeamMember";
import TeamMember from "./scenes/team/TeamMember";
import { connect } from 'react-redux'
import { fetchUser } from "./redux";
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from './apiConstants';
import StockedItem from "./scenes/stock/StockedItem";

function App({fetchUser, userData}) {
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(null);

useEffect(() => {
  const loadUser = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        navigate("/login");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      await fetchUser(userId);  // Wait for Redux to fetch user
      setLoading(false);
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false)
    }
  };

  loadUser();
}, [fetchUser, navigate]);

  const location = useLocation();
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // Determine if the current route is the login page
  const isLoginPage = location.pathname === "/login";

  return loading || userData.loading ? ( <h2> Loading... </h2>) : userData.error ? (<h2> {userData.error }</h2>) :  (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && <Sidebar userData={userData.user} isSidebar={isSidebar} />}
          <main className="content">
            {!isLoginPage && <Topbar userData={userData.user} setIsSidebar={setIsSidebar} />}
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <Team />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-team-member"
                element={
                  <ProtectedRoute>
                    <AddTeamMember />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/:id"
                element={
                  <ProtectedRoute>
                    <TeamMember />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/purchase"
                element={
                  <ProtectedRoute>
                    <Purchases userData={userData.user} />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/create-purchase"
                element={
                  <ProtectedRoute>
                    <CreatePurchase />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/purchased/:id"
                element={
                  <ProtectedRoute>
                    <PurchasedItem userData={userData.user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stock"
                element={
                  <ProtectedRoute>
                    <Stock userData={userData.user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-stock"
                element={
                  <ProtectedRoute>
                    <AddStock />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stocked/:id"
                element={
                  <ProtectedRoute>
                    <StockedItem userData={userData.user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deployed"
                element={
                  <ProtectedRoute>
                    <Deployed userData={userData.user}/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deploy-item"
                element={
                  <ProtectedRoute>
                    <DeployItem/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deployed/:id"
                element={
                  <ProtectedRoute>
                    <DeployedItem userData={userData.user} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


const mapStateToProps = state => {
  return {
    userData: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: (userId) => dispatch(fetchUser(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
