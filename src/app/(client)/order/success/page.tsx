"use client";
import { methodPayment } from "@/constants/methodPayment";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import React from "react";
import { Container } from "react-bootstrap";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const Page = () => {
  const orderInfo = useAppSelector((state) => state.order.orderInfo);
  const { width, height } = useWindowSize();

  return (
    <div className="bg-body-secondary pt-5">
      <Confetti width={width} height={height} />
      <Container>
        Đặt hàng thành công
        <Link href="/cart">Quay về giỏ hàng</Link>
        <div>Họ tên: {orderInfo.fullname}</div>
        <div>Emai: {orderInfo.email}</div>
        <div>SDT: {orderInfo.phone}</div>
        <div>Địa chỉ: {orderInfo.address}</div>
        <div>Phương thức thanh toán: {methodPayment[orderInfo.method]}</div>
        <div></div>
      </Container>
    </div>
  );
};

export default Page;
