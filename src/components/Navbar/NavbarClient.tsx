"use client";
import Link from "next/link";
import React from "react";
import { Container, Navbar } from "react-bootstrap";

const NavbarClient = () => {
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Link href={"/login"} className="btn btn-primary me-1">
            Login
          </Link>
          <Link href={"/register"} className="btn btn-primary">
            Register
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarClient;
