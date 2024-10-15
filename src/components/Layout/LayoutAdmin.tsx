"use client";
import React from "react";
import HeaderAdmin from "../Header/HeaderAdmin";
import FooterAdmin from "../Footer/FooterAdmin";
import NavbarAdmin from "../Navbar/NavbarAdmin";

const LayoutAdmin = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="d-flex">
      <NavbarAdmin />
      <div className="flex-fill">
        <HeaderAdmin />
        {children}
        <FooterAdmin />
      </div>
    </div>
  );
};

export default LayoutAdmin;
