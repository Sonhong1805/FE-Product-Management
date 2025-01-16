"use client";
import { deleteCookie } from "@/helpers/cookie";
import { useAppSelector } from "@/lib/hooks";
import AuthService from "@/services/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button, Container, Nav, NavDropdown } from "react-bootstrap";
import { BsCart3, BsHeart } from "react-icons/bs";
import { logout } from "@/lib/features/user/userSlice";
import withBase from "@/hocs/withBase";
import SearchKeywords from "@/components/Search";

const HeaderClient = (props: IWithBaseProps) => {
  const { dispatch, router } = props;
  const { name: websiteName, logo } = useAppSelector(
    (state) => state.setting.data
  );

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const products =
    useAppSelector((state) => state.user.userInfo.cart?.products) || [];
  const wishlist = useAppSelector((state) => state.user.userInfo.wishlist);
  const totalQuantity = products.reduce(
    (total: number, product: TProductInCart) => total + product.quantity,
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

  return (
    <div>
      <div>
        <Container>
          <Nav className="justify-content-between py-2">
            <Nav.Item>
              <span>Quản lý sản phẩm </span>
              <Link
                href={"/admin/dashboard"}
                className="link-body-emphasis link-underline-opacity-0 text-danger">
                Tại đây
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
              <NavDropdown
                id="nav-dropdown-user"
                title={userInfo?.fullname}
                menuVariant="light">
                <NavDropdown.Item>
                  <Link
                    href={"/account/profile"}
                    className="link-body-emphasis link-underline-opacity-0">
                    Hồ sơ cá nhân
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link
                    href={"/account/orders"}
                    className="link-body-emphasis link-underline-opacity-0">
                    Đơn mua
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Container>
      </div>
      <hr />
      <div className="bg-body-tertiary">
        <Container>
          <div className="d-flex gap-5 justify-content-between align-items-center">
            <Link
              rel="preload"
              href={"/"}
              className="d-inline-flex align-items-center link-body-emphasis link-underline-opacity-0">
              <Image
                src={logo + "" || "/image/logo.png"}
                width={100}
                height={100}
                priority
                style={{ objectFit: "contain" }}
                alt="logo"
              />
              <span className="fw-bolder" style={{ fontSize: "20px" }}>
                {(websiteName || "Product Management")
                  .split(" ")
                  .map((line: string, index: number) => (
                    <em key={index}>
                      {line}
                      <br />
                    </em>
                  ))}
              </span>
            </Link>
            <SearchKeywords />
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
                  {wishlist.length > 99
                    ? "99+"
                    : wishlist.length > 9
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
                  {totalQuantity > 99
                    ? "99+"
                    : totalQuantity > 9
                    ? totalQuantity
                    : "0" + totalQuantity}
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
