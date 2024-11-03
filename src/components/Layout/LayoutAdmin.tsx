"use client";
import React from "react";
import HeaderAdmin from "../Header/HeaderAdmin";
import FooterAdmin from "../Footer/FooterAdmin";
import NavbarAdmin from "../Navbar/NavbarAdmin";
import { useAppSelector } from "@/lib/hooks";

const LayoutAdmin = ({ children }: { children: React.ReactNode }) => {
  const userInfo = useAppSelector((state) => state.user.userInfo);

  return (
    <div className="d-flex">
      {userInfo.role && userInfo.role.permissions.length > 0 && (
        <>
          <NavbarAdmin />
          <div className="flex-fill">
            <HeaderAdmin />
            {children}
            <FooterAdmin />
          </div>
        </>
      )}
    </div>
  );
};

export default LayoutAdmin;
