"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Col, Container, Navbar, Row } from "react-bootstrap";
import { LiaBarsSolid } from "react-icons/lia";
import NavbarNested from "./NavbarNested";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchCategories } from "@/lib/features/category/categoryThunk";

const NavbarClient = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.data);
  useEffect(() => {
    (async () => {
      await dispatch(fetchCategories());
    })();
  }, []);

  return (
    <div className="bg-danger text-light p-0">
      <Container>
        <Row className="d-flex">
          <Col xs={3} className="position-relative p-0">
            <div
              className="d-flex gap-2 align-items-center bg-dark py-2 ps-3 pe-5"
              style={{ cursor: "pointer" }}>
              <LiaBarsSolid size={20} />
              <span>Tất cả danh mục</span>
            </div>
            <div className="position-absolute top-100 w-100">
              {/* <ul
                className="bg-light text-dark nav-menu"
                style={{ maxWidth: "306px" }}>
                {categories.map((category: ICategory) => (
                  <NavbarNested item={category} key={category._id} />
                ))}
              </ul> */}
            </div>
          </Col>
          <Col xs={9}>
            <ul className="d-flex m-0 text-light gap-2">
              <li>
                <Link
                  href={"/about"}
                  className="d-block link-offset-2 link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover  text-light py-2 px-3 ">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href={"/shop"}
                  className="d-block link-offset-2 link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover text-light py-2 px-3 ">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href={"/blog"}
                  className="d-block link-offset-2 link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover text-light py-2 px-3 ">
                  Bài viết
                </Link>
              </li>
              <li>
                <Link
                  href={"/contact"}
                  className="d-block link-offset-2 link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover text-light py-2 px-3 ">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NavbarClient;
