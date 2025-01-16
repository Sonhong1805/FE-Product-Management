"use client";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import {
  FaClipboardCheck,
  FaDiceD6,
  FaPhoneVolume,
  FaShapes,
} from "react-icons/fa";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import SettingsService from "@/services/settings";

const Page = () => {
  const [data, setData] = useState<IDashboard>();

  useEffect(() => {
    (async () => {
      const response = await SettingsService.dashboard();
      if (response.success) {
        setData(response.data);
      }
    })();
  }, []);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tổng quan</h2>
      </div>
      <Row className="mb-3">
        <Col xs={3}>
          <Card bg={"info"} key={"Info"} text={"white"} className="mb-2">
            <Card.Header className="d-flex gap-2 align-items-center">
              <FaDiceD6 /> Sản phẩm
            </Card.Header>
            <Card.Body>
              <Card.Title className="mb-3">
                Tổng số sản phẩm: {data?.products.total}
              </Card.Title>
              <Card.Text>
                Sản phẩm đang hoạt động: {data?.products.active}
              </Card.Text>
              <Card.Text>
                Sản phẩm dừng hoạt động: {data?.products.inactive}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link
                href={"/admin/products"}
                style={{ textDecoration: "none" }}
                className="d-block link-underline-opacity-0 text-white text-end">
                Xem chi tiết <FiEye />
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs={3}>
          <Card bg={"success"} key={"Success"} text={"white"} className="mb-2">
            <Card.Header className="d-flex gap-2 align-items-center">
              <FaShapes />
              Danh mục
            </Card.Header>
            <Card.Body>
              <Card.Title className="mb-3">
                Tổng số danh mục: {data?.categories.total}
              </Card.Title>
              <Card.Text>
                Danh mục đang hoạt động: {data?.categories.active}
              </Card.Text>
              <Card.Text>
                Danh mục dừng hoạt động: {data?.categories.inactive}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link
                href={"/admin/categories"}
                style={{ textDecoration: "none" }}
                className="d-block link-underline-opacity-0 text-white text-end">
                Xem chi tiết <FiEye />
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs={3}>
          <Card bg={"warning"} key={"Warning"} text={"white"} className="mb-2">
            <Card.Header className="d-flex gap-2 align-items-center">
              <FaClipboardCheck />
              Đơn hàng
            </Card.Header>
            <Card.Body>
              <Card.Title className="mb-3">
                Tổng số đơn hàng: {data?.orders.total}
              </Card.Title>
              <Card.Text>Đơn hàng đã duyệt: {data?.orders.approved}</Card.Text>
              <Card.Text>Đơn hàng chờ duyệt: {data?.orders.pending}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link
                href={"/admin/orders"}
                style={{ textDecoration: "none" }}
                className="d-block link-underline-opacity-0 text-white text-end">
                Xem chi tiết <FiEye />
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs={3}>
          <Card bg={"danger"} key={"Danger"} text={"white"} className="mb-2">
            <Card.Header className="d-flex gap-2 align-items-center">
              <FaPhoneVolume />
              Liên hệ
            </Card.Header>
            <Card.Body>
              <Card.Title className="mb-3">
                Tổng số liên hệ: {data?.contacts.total}
              </Card.Title>
              <Card.Text>Liên hệ đã xem: {data?.contacts.active}</Card.Text>
              <Card.Text>Liên hệ chưa xem: {data?.contacts.inactive}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link
                href={"/admin/contacts"}
                style={{ textDecoration: "none" }}
                className="d-block link-underline-opacity-0 text-white text-end">
                Xem chi tiết <FiEye />
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col xs={8}>
          <BarChart />
        </Col>
        <Col xs={4}>
          <PieChart />
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
