"use client";
import { deleteCookie } from "@/helpers/cookie";
import { handleQueries } from "@/lib/features/product/productSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import AuthService from "@/services/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Container, Form, InputGroup, Nav } from "react-bootstrap";
import { BsCart3, BsHeart } from "react-icons/bs";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { logout } from "@/lib/features/user/userSlice";

const HeaderClient = () => {
  const name = "Product Management";
  const [keywords, setKeywords] = useState<string>("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const products = useAppSelector((state) => state.user.userInfo.cart.products);
  const wishlist = useAppSelector((state) => state.user.userInfo.wishlist);
  const totalQuantity = products.reduce(
    (total: number, product) => total + product.quantity,
    0
  );

  const handleLogout = async () => {
    const response = await AuthService.logout();
    if (response.success) {
      await dispatch(logout());
      localStorage.removeItem("access_token");
      deleteCookie("cartId");
      router.push("/login");
    }
  };
  const handleFilterKeywords = async () => {
    await dispatch(handleQueries({ keywords }));
  };
  return (
    <div>
      <div>
        <Container>
          <Nav className="justify-content-end py-2">
            {!isAuthenticated ? (
              <>
                <Nav.Item>
                  <Link
                    href={"/login"}
                    className="link-body-emphasis link-underline-opacity-0">
                    Đăng nhập
                  </Link>
                </Nav.Item>
                <Nav.Item className="px-2">/</Nav.Item>
                <Nav.Item>
                  <Link
                    href={"/register"}
                    className="link-body-emphasis link-underline-opacity-0">
                    Đăng ký
                  </Link>
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Item>
                  <Link
                    href={"/login"}
                    className="link-body-emphasis link-underline-opacity-0">
                    {userInfo.fullname}
                  </Link>
                </Nav.Item>
                <Nav.Item className="px-2">/</Nav.Item>
                <Nav.Item>
                  <Link
                    href={""}
                    className="link-body-emphasis link-underline-opacity-0"
                    onClick={handleLogout}>
                    Đăng xuất
                  </Link>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Container>
      </div>
      <hr />
      <div className="bg-body-tertiary">
        <Container>
          <div className="d-flex gap-5 justify-content-between align-items-center">
            <Link
              href={"/"}
              className="d-inline-flex align-items-center link-body-emphasis link-underline-opacity-0">
              <Image
                src="/image/logo.png"
                width={100}
                height={100}
                priority={true}
                style={{ objectFit: "contain" }}
                alt="logo"
              />
              <span className="fw-bolder" style={{ fontSize: "20px" }}>
                {name.split(" ").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </span>
            </Link>
            <InputGroup className="pe-5 w-50">
              <Form.Control
                placeholder="Tìm kiếm sản phẩm tại đây"
                aria-label="Tìm kiếm sản phẩm tại đây"
                aria-describedby="basic-addon2"
                onChange={(e) => setKeywords(e.target.value)}
              />
              <Button
                className="bg-info-subtle border border-info"
                onClick={handleFilterKeywords}>
                <PiMagnifyingGlassBold size={28} className="text-info" />
              </Button>
            </InputGroup>
            <div className="d-flex gap-5 align-items-center">
              <Button
                type="button"
                className="bg-transparent position-relative border border-0"
                onClick={() =>
                  isAuthenticated
                    ? router.push("/wishlist")
                    : router.push("/login")
                }>
                <BsHeart size={30} className="text-dark" />
                <span
                  className="position-absolute translate-middle badge rounded-pill bg-danger"
                  style={{ top: "10px", right: "-20px" }}>
                  {wishlist.length > 9
                    ? wishlist.length
                    : "0" + wishlist.length}
                </span>
              </Button>
              <Button
                type="button"
                className="bg-transparent position-relative border border-0"
                onClick={() =>
                  isAuthenticated ? router.push("/cart") : router.push("/login")
                }>
                <BsCart3 size={30} className="text-dark" />
                <span
                  className="position-absolute translate-middle badge rounded-pill bg-danger"
                  style={{ top: "10px", right: "-20px" }}>
                  {totalQuantity > 9 ? totalQuantity : "0" + totalQuantity}
                </span>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HeaderClient;
