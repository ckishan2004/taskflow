import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";


// Use Footer only on dashboard-ish pages (same feel like your HTML)
export default function MainLayout() {
  const { pathname } = useLocation();
  const showFooter = ["/", "/calendar", "/reports", "/settings"].includes(pathname);

  return (
    <>
      <Header />
      <Outlet />
      {showFooter ? <Footer /> : null}
    </>
  );
}
