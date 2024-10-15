import { adminNavbarLinks } from "@/constants/navbarLink";
import withBase from "@/hocs/withBase";
import { fetchSettings } from "@/lib/features/setting/settingThunk";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Nav, Navbar } from "react-bootstrap";

const NavbarAdmin = ({ pathname }: any) => {
  const setting = useAppSelector((state) => state.setting.data);
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(fetchSettings());
    })();
  }, []);

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      style={{ width: "200px", height: "100vh", position: "sticky", top: "0" }}>
      <Link href="/">
        <Image
          src={setting.logo + "" || "/image/no-image.png"}
          alt="logo"
          width={100}
          height={100}
          priority={true}
        />
      </Link>
      <Nav className="me-auto w-100">
        {adminNavbarLinks.map((link) => (
          <Link
            className={`link-underline link-underline-opacity-0 w-100 d-block text-light px-2 py-3 ${
              pathname.startsWith(link.href) && "bg-light-subtle"
            }`}
            href={link.href}
            key={link.id}>
            {link.content}
          </Link>
        ))}
      </Nav>
    </Navbar>
  );
};

export default withBase(NavbarAdmin);
