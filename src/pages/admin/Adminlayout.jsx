import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  Content,
  Wrapper,
  NavItem,
  SidebarHeader,
  ToggleButton,
  ProfileBox,
  Navbar,
} from "./AdminLayout.styled";
import {
  LayoutDashboard,
  Users,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import NotificationBell from "../../components/NotificationBell";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard />, path: "/admin/dashboard" },
  { label: "Foydalanuvchilar", icon: <Users />, path: "/admin/users" },
  { label: "Buyurtmalar", icon: <Truck />, path: "/admin/shipments" },
  { label: "Sozlamalar", icon: <Settings />, path: "/admin/settings" },
];

const token = localStorage.getItem("access_token");
const user = token ? jwtDecode(token) : {};

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const { dark, toggleTheme } = useContext(ThemeContext);

  return (
    <Wrapper>
      <Sidebar $collapsed={collapsed}>
        <SidebarHeader>
          <ToggleButton onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </ToggleButton>
          {!collapsed && <h3>Tujjor Admin</h3>}
        </SidebarHeader>

        {navItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            $active={location.pathname === item.path}
            $collapsed={collapsed}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </NavItem>
        ))}

        <NavItem
          as="div"
          $collapsed={collapsed}
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
          }}
        >
          <span className="icon">
            <LogOut />
          </span>
          <span className="label">Chiqish</span>
        </NavItem>
        <ProfileBox $collapsed={collapsed}>
          <div className="avatar">
            {user.username?.charAt(0).toUpperCase() || "A"}
          </div>
          {!collapsed && <div className="username">{user.username}</div>}
        </ProfileBox>
        <NavItem as="div" $collapsed={collapsed} onClick={toggleTheme}>
          <span className="icon">{dark ? <Sun /> : <Moon />}</span>
          <span className="label">{dark ? "Light Mode" : "Dark Mode"}</span>
        </NavItem>
      </Sidebar>

      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
}
