import React from "react";
import "./style.scss";
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import { BsFacebook, BsYoutube } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

const FooterClient = () => {
  return (
    <div className="footer-client">
      <div className="line"></div>
      <Container className="pt-5">
        <Row className="pb-3">
          <Col xs={4}>
            <div className="title">Liên hệ</div>
            <ul className="footer-list">
              <li>Email: nguyenhongson@gmail.com</li>
              <li>Hotline: (+84)-327-842-451</li>
              <li>
                Địa chỉ: 435 Trần Quốc Tảng, Cẩm Thịnh, Cẩm Phả, Quảng Ninh
              </li>
            </ul>
          </Col>
          <Col xs={2}>
            <div className="title">Liên kết</div>
            <ul className="footer-list">
              <li>
                <Link href="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link href="/shop?page=1">Sản phẩm</Link>
              </li>
              <li>
                <Link href="/blog?page=1">Bài viết</Link>
              </li>
              <li>
                <Link href="/contact">Liên hệ</Link>
              </li>
            </ul>
          </Col>
          <Col xs={3}>
            <div className="title">Hỗ trợ</div>
            <ul className="footer-list">
              <li>Câu hỏi thường gặp</li>
              <li>Liên hệ hỗ trợ</li>
              <li>Hướng dẫn mua hàng</li>
            </ul>
          </Col>
          <Col xs={3}>
            <div className="title">Mạng xã hội</div>
            <ul className="footer-list">
              <li className="d-flex align-items-center gap-2 mb-3">
                <BsFacebook size={24} color="#1877F2" /> Facebook
              </li>
              <li className="d-flex align-items-center gap-2 mb-3">
                <BsYoutube size={24} color="FF0000" /> Youtube
              </li>
              <li className="d-flex align-items-center gap-2 mb-3">
                <FcGoogle size={24} /> Google
              </li>
            </ul>
          </Col>
        </Row>
        <hr />
        <div className="about-me py-3">
          <strong>Đôi chút về dự án:</strong> Dự án này được tạo ra để vừa học
          vừa áp dụng kiến thức về NodeJS và MongoDB. Tuy có đôi chút khó khăn
          và giao diện cũng chưa được đẹp nhưng đã kịp hoàn thành trong 3 tháng.
          Nếu có lỗi trong quá trình trải nghiệm, bạn có thể liên hệ qua email
          để đội ngũ (thật ra có mình tôi) có thể hỗ trợ trong thời gian sớm
          nhất đảm bảo trải nghiệm tốt nhất cho khách hàng.
        </div>
        <div className="about-me">
          <strong>Thiết kế và lập trình bởi: </strong>
          Nguyễn Hồng Sơn
        </div>
      </Container>
    </div>
  );
};

export default FooterClient;
