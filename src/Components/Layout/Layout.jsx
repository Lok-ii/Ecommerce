import React, { memo } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = memo(() => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
});

export default Layout;
