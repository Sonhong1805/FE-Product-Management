"use client";
import { accountLinks } from "@/constants/navbarLink";
import withBase from "@/hocs/withBase";
import Link from "next/link";
import React from "react";
import { Col } from "react-bootstrap";

const SidebarAccount = (props: IWithBaseProps) => {
  const { pathname } = props;
  return (
    <Col xs={3}>
      <div className="bg-light h-100 p-3">
        {accountLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={`side-bar-link ${
              pathname === link.href ? "active" : ""
            }`}>
            {link.content}
          </Link>
        ))}
      </div>
    </Col>
  );
};

export default withBase(SidebarAccount);
