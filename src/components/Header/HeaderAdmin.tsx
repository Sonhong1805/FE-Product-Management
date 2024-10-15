"use client";
import { deleteCookie } from "@/helpers/cookie";
import AuthService from "@/services/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";

const HeaderAdmin = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const response = await AuthService.logout();
    if (response.success) {
      localStorage.removeItem("access_token");
      deleteCookie("cartId");
      router.push("/login");
    }
  };
  return (
    <Navbar bg="secondary" data-bs-theme="dark" className="mb-3">
      <Container>
        <Navbar.Brand>Admin</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="danger" onClick={handleLogout}>
            Đăng xuất
          </Button>{" "}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderAdmin;
