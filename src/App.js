import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProviderCustom, ThemeContext } from "./context/ThemeContext";
import { ThemeProvider } from "styled-components";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import AdminLayout from "./pages/admin/Adminlayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Shipments from "./pages/admin/Shipments";
import Settings from "./pages/admin/Settings";
import RequireAdmin from "./components/RequireAdmin";

function App() {
  return (
    <ThemeProviderCustom>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/admin"
                    element={
                      <RequireAdmin>
                        <AdminLayout />
                      </RequireAdmin>
                    }
                  >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="shipments" element={<Shipments />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProviderCustom>
  );
}

export default App;
