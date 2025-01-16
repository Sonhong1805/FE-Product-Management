"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { LiaBarsSolid } from "react-icons/lia";
import NavbarNested from "./NavbarNested";
import { useAppSelector } from "@/lib/hooks";
import { fetchCategories } from "@/lib/features/category/categoryThunk";
import { fetchSettings } from "@/lib/features/setting/settingThunk";
import { clientNavbarLinks } from "@/constants/navbarLink";
import withBase from "@/hocs/withBase";
import { handlePagination as handlePaginationProduct } from "@/lib/features/product/productSlice";
import { handlePagination as handlePaginationBlog } from "@/lib/features/blog/blogSlice";

const NavbarClient = (props: IWithBaseProps) => {
  const { dispatch, pathname, router } = props;
  const categories = useAppSelector((state) => state.categories.data);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(fetchSettings()),
        dispatch(fetchCategories()),
      ]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(document.documentElement.scrollHeight);
    };
    // updateHeight();
    window.addEventListener("resize", updateHeight);
    const observer = new MutationObserver(updateHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("resize", updateHeight);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const showCategories = document.getElementById("show-categories");
      if (
        showCategories &&
        !showCategories.contains(e.target as Node) &&
        isShowMenu &&
        pathname !== "/"
      ) {
        setIsShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isShowMenu, pathname]);

  useEffect(() => {
    if (pathname === "/") {
      setIsShowMenu(true);
    } else {
      setIsShowMenu(false);
    }
  }, [pathname]);

  const memoizedCategories = useMemo(
    () =>
      categories
        .toSorted((a: ICategory, b: ICategory) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        })
        .map((category: ICategory) => (
          <NavbarNested item={category} key={category._id} parentSlug={""} />
        )),
    [categories]
  );

  const handleNextLink = (href: string) => {
    if (href === "/shop?page=1") {
      dispatch(handlePaginationProduct({ page: 1 }));
    }
    if (href === "/blog?page=1") {
      dispatch(handlePaginationBlog({ page: 1 }));
    }

    router.push(href);
  };

  return (
    <div className="bg-danger text-light p-0 position-relative">
      <Container>
        <Row className="d-flex">
          <Col xs={3} className="position-relative p-0">
            <div
              id="show-categories"
              className="d-flex gap-2 align-items-center bg-dark py-2 ps-3 pe-5"
              style={{ cursor: "pointer" }}
              onClick={() => setIsShowMenu((prev) => !prev)}>
              <LiaBarsSolid size={20} />
              <span>Tất cả danh mục</span>
            </div>
            {isShowMenu && (
              <div
                className="position-absolute top-100 w-100"
                style={{ zIndex: "998" }}>
                <ul
                  className="bg-light text-dark nav-menu border m-0 p-0"
                  style={{ listStyle: "none" }}>
                  {memoizedCategories}
                </ul>
              </div>
            )}
          </Col>
          <Col xs={9}>
            <ul
              className="d-flex m-0 text-light gap-2 m-0 p-0"
              style={{ listStyle: "none" }}>
              {clientNavbarLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextLink(link.href);
                    }}
                    className="d-block bg-danger text-white link-offset-2 link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover py-2 px-3">
                    {link.content}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
      {/* 181 là chiều cao của header */}
      {pathname !== "/" && isShowMenu && (
        <div className="overlay" style={{ height: `${height - 181}px` }}></div>
      )}
    </div>
  );
};

export default withBase(NavbarClient);
