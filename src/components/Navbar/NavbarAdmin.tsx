import withBase from "@/hocs/withBase";
import { fetchSettings } from "@/lib/features/setting/settingThunk";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Nav, Navbar } from "react-bootstrap";
import {
  FaClipboardCheck,
  FaCogs,
  FaDiceD6,
  FaPhoneVolume,
  FaShapes,
  FaThLarge,
  FaUserCog,
  FaUserLock,
  FaUserPlus,
} from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";

export const adminNavbarLinks = [
  {
    id: 1,
    href: "/admin/dashboard",
    content: "Tổng quan",
    permission: "dashboard_view",
    icon: <FaThLarge />,
  },
  {
    id: 2,
    href: "/admin/categories",
    content: "Danh mục",
    permission: "categories_view",
    icon: <FaShapes />,
  },
  {
    id: 3,
    href: "/admin/products",
    content: "Sản phẩm",
    permission: "products_view",
    icon: <FaDiceD6 />,
  },
  {
    id: 4,
    href: "/admin/orders",
    content: "Đơn hàng",
    permission: "orders_view",
    icon: <FaClipboardCheck />,
  },
  {
    id: 5,
    href: "/admin/blogs",
    content: "Bài viết",
    permission: "blogs_view",
    icon: <FaFilePen />,
  },
  {
    id: 6,
    href: "/admin/contacts",
    content: "Liên hệ",
    permission: "contacts_view",
    icon: <FaPhoneVolume />,
  },
  {
    id: 7,
    href: "/admin/accounts",
    content: "Tài khoản",
    permission: "accounts_view",
    icon: <FaUserPlus />,
  },
  {
    id: 8,
    href: "/admin/roles",
    content: "Vai trò",
    permission: "roles_view",
    icon: <FaUserCog />,
  },
  {
    id: 9,
    href: "/admin/permissions",
    content: "Phân quyền",
    permission: "permissions_view",
    icon: <FaUserLock />,
  },
  {
    id: 10,
    href: "/admin/settings",
    content: "Cài đặt chung",
    permission: "settings_view",
    icon: <FaCogs />,
  },
];

const NavbarAdmin = ({ pathname, dispatch }: IWithBaseProps) => {
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const setting = useAppSelector((state) => state.setting.data);
  useEffect(() => {
    (async () => {
      await dispatch(fetchSettings());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      style={{ width: "200px", height: "100vh", position: "sticky", top: "0" }}>
      <Link href="/">
        <Image
          src={setting.logo + "" || "/image/no-image.png"}
          alt="logo"
          width={100}
          height={100}
          priority={true}
        />
      </Link>
      <Nav className="me-auto w-100">
        {adminNavbarLinks.map(
          (link) =>
            userPermissions.includes(link.permission) && (
              <Link
                className={`link-underline link-underline-opacity-0 w-100 d-block text-light px-2 py-3 ${
                  pathname.startsWith(link.href) && "bg-light-subtle"
                }`}
                href={link.href}
                key={link.id}>
                <span className="me-2">{link.icon}</span>
                {link.content}
              </Link>
            )
        )}
      </Nav>
    </Navbar>
  );
};

export default withBase(NavbarAdmin);
