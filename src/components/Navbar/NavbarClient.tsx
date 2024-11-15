"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Col, Container, Navbar, Row } from "react-bootstrap";
import { LiaBarsSolid } from "react-icons/lia";
import NavbarNested from "./NavbarNested";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchCategories } from "@/lib/features/category/categoryThunk";
import { usePathname } from "next/navigation";
import { fetchSettings } from "@/lib/features/setting/settingThunk";

const NavbarClient = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const categories = useAppSelector((state) => state.categories.data);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(fetchSettings()),
        dispatch(fetchCategories()),
      ]);
    })();
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      setIsShowMenu(true);
    } else {
      setIsShowMenu(false);
    }
  }, [pathname]);

  return (
    <div className="bg-danger text-light p-0">
      <Container>
        <Row className="d-flex">
          <Col xs={3} className="position-relative p-0">
            <div
              className="d-flex gap-2 align-items-center bg-dark py-2 ps-3 pe-5"
              style={{ cursor: "pointer" }}
              onClick={() => setIsShowMenu(!isShowMenu)}>
              <LiaBarsSolid size={20} />
              <span>Tất cả danh mục</span>
            </div>
            {isShowMenu && (
              <div className="position-absolute top-100 w-100">
                <ul
                  className="bg-light text-dark nav-menu border m-0 p-0"
                  style={{ listStyle: "none" }}>
                  {categories.map((category: ICategory) => (
                    <NavbarNested
                      item={category}
                      key={category._id}
                      parentSlug={""}
                    />
                  ))}
                </ul>
              </div>
            )}
          </Col>
          <Col xs={9}>
            <ul
              className="d-flex m-0 text-light gap-2 m-0 p-0"
              style={{ listStyle: "none" }}>
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
