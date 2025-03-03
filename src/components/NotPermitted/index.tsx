import React from "react";
import "./style.scss";
import Link from "next/link";

const NotPermitted = () => {
  return (
    <div>
      <div className="forbidden">
        <div className="title">403</div>
        <div className="message">Bạn không có quyền truy cập</div>
        <Link href={"/"} className="home">
          Trở về trang chủ
        </Link>
      </div>
      <div className="account-test">
        <div>Tài khoản để test</div>
        <ul>
          <li>Email: admin@gmail.com</li>
          <li>Password: admin</li>
        </ul>
        <Link href={"/login"} className="text-danger">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

export default NotPermitted;
