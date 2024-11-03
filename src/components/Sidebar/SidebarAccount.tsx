import { accountLinks } from "@/constants/navbarLink";
import Link from "next/link";
import React from "react";
import { Col } from "react-bootstrap";

const SidebarAccount = () => {
  return (
    <Col xs={3}>
      {accountLinks.map((link) => (
        <Link key={link.id} href={link.href} className="d-block">
          {link.content}
        </Link>
      ))}
    </Col>
  );
};

export default SidebarAccount;
