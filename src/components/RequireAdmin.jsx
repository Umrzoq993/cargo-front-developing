import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function RequireAdmin({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role === "admin") {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
}
