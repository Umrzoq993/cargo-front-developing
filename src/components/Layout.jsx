import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function Layout() {
  return (
    <>
      <ToastContainer />
      <Outlet />
    </>
  );
}
