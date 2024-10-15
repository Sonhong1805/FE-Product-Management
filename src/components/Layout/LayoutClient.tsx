import React from "react";
import HeaderClient from "../Header/HeaderClient";
import FooterClient from "../Footer/FooterClient";
import NavbarClient from "../Navbar/NavbarClient";

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderClient />
      <NavbarClient />
      {children}
      <FooterClient />
    </>
  );
};

export default LayoutClient;
