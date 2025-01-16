"use client";
import { methodPayment } from "@/constants/methodPayment";
import groupItems from "@/helpers/groupItems";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import { updateStatus } from "@/lib/features/order/orderSlice";
import OrdersService from "@/services/orders";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import { BiExit } from "react-icons/bi";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import Swal from "sweetalert2";

const Page = (props: IWithBaseProps) => {
  const { searchParams, dispatch, router } = props;
  const [orderDetail, setOrderDetail] = useState<IOrder>();

  useEffect(() => {
    (async () => {
      const response = await OrdersService.detail(searchParams.get("id") + "");
      if (response.success) {
        setOrderDetail(response.data);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productsOrderInfoGroups = groupItems(orderDetail?.products || []);
  const totalPrice =
    orderDetail &&
    orderDetail.products.reduce(
      (sum, product) => sum + product.discountedPrice * product.quantity,
      0
    );

  const handleUpdateOrder = async (
    id: string,
    status: "APPROVED" | "CANCELED"
  ) => {
    const response = await OrdersService.update(id, status);
    if (response.success) {
      await dispatch(updateStatus({ id, status }));
      Swal.fire({
        position: "center",
        icon: "success",
        title: response?.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <Container className="pb-5">
      <div className="d-flex justify-content-end mb-4">
        <Button
          variant="warning"
          className="center gap-2"
          aria-hidden="false"
          onClick={() => router.push("/admin/orders")}>
          <BiExit size={20} /> <span>Trở về</span>
        </Button>
      </div>
      <div className="pb-5 text-center w-75 m-auto">
        <div className="mb-3 text-center bg-light p-3 ">
          <h4 className="py-3">Chi tiết đơn hàng</h4>
          <Table className="w-100 pb-5">
            <tbody>
              <tr>
                <td className="text-start fw-bold">Họ tên:</td>
                <td className="text-end">{orderDetail?.fullname}</td>
              </tr>
              <tr>
                <td className="text-start fw-bold">Emai: </td>
                <td className="text-end">{orderDetail?.email}</td>
              </tr>
              <tr>
                <td className="text-start fw-bold">Số diện thoại: </td>
                <td className="text-end">{orderDetail?.phone}</td>
              </tr>
              <tr>
                <td className="text-start fw-bold">Địa chỉ: </td>
                <td className="text-end order-address">
                  {orderDetail?.address}
                </td>
              </tr>
              <tr>
                <td className="text-start fw-bold">Phương thức thanh toán: </td>
                <td className="text-end">
                  {methodPayment[orderDetail?.method || "CASH"]}
                </td>
              </tr>
              <tr>
                <td
                  className="text-start fw-bold "
                  style={{ borderBottom: "none" }}>
                  Tổng thanh toán ({orderDetail?.products.length} Sản phẩm):{" "}
                </td>
                <td
                  className="text-end text-danger fw-bold"
                  style={{ fontSize: "20px", borderBottom: "none" }}>
                  {priceFormat(totalPrice || 0)}
                </td>
              </tr>
            </tbody>
          </Table>
          {orderDetail?.status === "APPROVED" ||
          orderDetail?.status === "CANCELED" ? (
            <div
              className={`w-100 rounded py-2 ${
                orderDetail?.status === "APPROVED"
                  ? "bg-success"
                  : "bg-secondary"
              }`}>
              <strong className="text-white">
                {orderDetail?.status === "APPROVED"
                  ? "Đã duyệt đơn"
                  : "Đã huỷ đơn"}
              </strong>
            </div>
          ) : (
            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="warning"
                className="center d-flex gap-2 flex-fill"
                onClick={() =>
                  handleUpdateOrder(orderDetail?._id + "", "APPROVED")
                }>
                <FiCheckCircle />
                Duyệt đơn
              </Button>
              <Button
                variant="secondary"
                className="center d-flex gap-2 flex-fill"
                onClick={() =>
                  handleUpdateOrder(orderDetail?._id + "", "CANCELED")
                }>
                <FiXCircle />
                Huỷ đơn
              </Button>
            </div>
          )}
        </div>
        <div className="pt-3">
          {productsOrderInfoGroups.length > 0 &&
            productsOrderInfoGroups.map((item: IOrderGroup, index: number) => (
              <Card border="danger" className="w-100 mb-3" key={item.productId}>
                <Card.Header className="text-start">
                  Gói hàng {index + 1} của {productsOrderInfoGroups.length}
                </Card.Header>
                <Card.Body>
                  {item.products?.map((product: TProductInCart) => (
                    <div
                      key={product._id}
                      className="d-flex justify-content-between align-items-start mb-2 gap-2">
                      <div>
                        <Image
                          src={product.thumbnail + "" || "/image/no-image.png"}
                          width={60}
                          height={60}
                          priority
                          alt="thumbnail"
                        />
                      </div>
                      <div
                        className="product-container text-start flex-fill"
                        style={{ width: "315px" }}>
                        <Link
                          href={"/product/" + product.slug}
                          className="product__title">
                          {product.title}
                        </Link>
                        {product.variant && (
                          <div>
                            <strong>Loại:</strong> {product.variant}
                          </div>
                        )}
                      </div>
                      <div className="product-detail text-end flex-fill">
                        <div className="product-detail__price">
                          {priceFormat(product.price)}
                        </div>
                        <div className="product-detail__discount">
                          {priceFormat(product.discountedPrice)} x{" "}
                          {product.quantity}
                        </div>
                      </div>
                      <div
                        className="product-detail__discounted-price text-end flex-fill"
                        style={{ fontSize: "20px" }}>
                        {priceFormat(
                          product.discountedPrice * product.quantity
                        )}
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            ))}
        </div>
      </div>
    </Container>
  );
};

export default withBase(Page);
