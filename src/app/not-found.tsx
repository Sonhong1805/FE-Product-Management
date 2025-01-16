import Link from "next/link";
import "./not-found.scss";

const NotFound = () => {
  return (
    <div className="forbidden">
      <div className="title">404</div>
      <div className="message">
        Oops! Trang bạn đang tìm kiếm không tồn tại.{" "}
      </div>
      <Link href={"/"} className="home">
        Trở về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
