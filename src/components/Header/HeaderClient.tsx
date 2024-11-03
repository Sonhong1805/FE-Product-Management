"use client";
import { deleteCookie } from "@/helpers/cookie";
import {
  handlePagination,
  handleQueries,
} from "@/lib/features/product/productSlice";
import { useAppSelector } from "@/lib/hooks";
import AuthService from "@/services/auth";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Container, Form, InputGroup, Nav } from "react-bootstrap";
import { BsCart3, BsHeart, BsSearch } from "react-icons/bs";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { logout } from "@/lib/features/user/userSlice";
import withBase from "@/hocs/withBase";

const HeaderClient = (props: IWithBaseProps) => {
  const { dispatch, router } = props;
  const { name: websiteName, logo } = useAppSelector(
    (state) => state.setting.data
  );
  const queries = useAppSelector((state) => state.products.queries);
  const [keywords, setKeywords] = useState<string>(queries.keywords || "");

  useEffect(() => {
    setKeywords(queries.keywords);
  }, [queries]);

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const products =
    useAppSelector((state) => state.user.userInfo.cart?.products) || [];
  const wishlist = useAppSelector((state) => state.user.userInfo.wishlist);
  const totalQuantity = products.reduce(
    (total: number, product: TProductInCart) => total + product.quantity,
    0
  );
  const pagination = useAppSelector((state) => state.products.pagination);

  const handleLogout = async () => {
    const response = await AuthService.logout();
    if (response.success) {
      await dispatch(logout());
      localStorage.removeItem("access_token");
      deleteCookie("cartId");
      router.push("/login");
    }
  };
  const handleFilterKeywords = () => {
    dispatch(handlePagination({ ...pagination, page: 1 }));
    dispatch(handleQueries({ keywords }));
  };

  return (
    <div>
      <div>
        <Container>
          <Nav className="justify-content-between py-2">
            <Nav.Item>
              <Link
                href={"/admin/dashboard"}
                className="link-body-emphasis link-underline-opacity-0 text-danger">
                Quản trị viên
              </Link>
            </Nav.Item>
            {!isAuthenticated ? (
              <div className="d-flex">
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
              </div>
            ) : (
              <div className="d-flex">
                <Nav.Item>
                  <Link
                    href={"/account/profile"}
                    className="link-body-emphasis link-underline-opacity-0">
                    {userInfo?.fullname}
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
              </div>
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
                src={logo + "" || "/image/logo.png"}
                width={100}
                height={100}
                priority={true}
                style={{ objectFit: "contain" }}
                alt="logo"
              />
              <span className="fw-bolder" style={{ fontSize: "20px" }}>
                {(websiteName || "Product Management")
                  .split(" ")
                  .map((line, index) => (
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
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <Button
                className="bg-danger border border-danger"
                onClick={handleFilterKeywords}>
                <BsSearch size={20} className="text-light" />
              </Button>
            </InputGroup>
            <div className="d-flex gap-5 align-items-center">
              <Button
                type="button"
                className="bg-transparent position-relative border border-0 d-flex align-items-center"
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

export default withBase(HeaderClient);
