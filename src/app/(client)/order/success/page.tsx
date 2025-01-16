"use client";
import { methodPayment } from "@/constants/methodPayment";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import Confetti from "react-confetti";
import groupItems from "@/helpers/groupItems";
import { FiCheckCircle } from "react-icons/fi";
import Image from "next/image";
import priceFormat from "@/helpers/priceFormat";
import { useRouter } from "next/navigation";
import { BsArrowLeftCircle, BsBoxSeam } from "react-icons/bs";
import useWindowSize from "@/hooks/useWindowSize";
import Loading from "@/components/Loading";
import { resetOrderInfo } from "@/lib/features/order/orderSlice";

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const orderInfo = useAppSelector((state) => state.orders.orderInfo);
  const productsOrderInfoGroups = groupItems(orderInfo.products);
  const totalPrice = orderInfo.products.reduce(
    (sum, product) => sum + product.discountedPrice * product.quantity,
    0
  );
  const { width, height } = useWindowSize();
  useEffect(() => {
    if (!orderInfo.email) {
      setLoading(true);
      router.push("/cart");
    } else {
      setLoading(false);
    }

    return () => {
      dispatch(resetOrderInfo());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderInfo.email]);

  return (
    <div className="bg-body-secondary py-5">
      {loading && <Loading />}
      {!loading && <Confetti width={width} height={height} />}
      {!loading && (
        <Container className="w-50">
          <div className="mb-3 text-center bg-light p-3 rounded-2">
            <div className="d-flex justify-content-center align-items-center gap-3">
              <FiCheckCircle size={30} className="text-success" />
              <strong className="text-success h3">Đặt hàng thành công</strong>
            </div>
            <div className="d-flex gap-2 justify-content-center my-3">
              <Button
                variant="outline-secondary"
                className="d-flex gap-2 align-items-center"
                onClick={() => router.push("/shop")}>
                <BsArrowLeftCircle /> <span>Tiếp tục mua sắm</span>
              </Button>
              <Button
                variant="outline-secondary"
                className="d-flex gap-2 align-items-center"
                onClick={() => router.push("/account/orders")}>
                <BsBoxSeam /> <span>Theo dõi đơn hàng</span>
              </Button>
            </div>
            <Table className="m-auto">
              <tbody>
                <tr>
                  <td className="text-start fw-bold">Họ tên:</td>
                  <td className="text-end">{orderInfo.fullname}</td>
                </tr>
                <tr>
                  <td className="text-start fw-bold">Emai: </td>
                  <td className="text-end">{orderInfo.email}</td>
                </tr>
                <tr>
                  <td className="text-start fw-bold">Số diện thoại: </td>
                  <td className="text-end">{orderInfo.phone}</td>
                </tr>
                <tr>
                  <td className="text-start fw-bold">Địa chỉ: </td>
                  <td className="text-end order-address">
                    {orderInfo.address}
                  </td>
                </tr>
                <tr>
                  <td className="text-start fw-bold">
                    Phương thức thanh toán:{" "}
                  </td>
                  <td className="text-end">
                    {methodPayment[orderInfo.method]}
                  </td>
                </tr>
                <tr>
                  <td
                    className="text-start fw-bold "
                    style={{ borderBottom: "none" }}>
                    Tổng thanh toán ({orderInfo.products.length} Sản phẩm):{" "}
                  </td>
                  <td
                    className="text-end text-danger fw-bold"
                    style={{ fontSize: "20px", borderBottom: "none" }}>
                    {priceFormat(totalPrice || 0)}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="pt-3">
            {productsOrderInfoGroups.length > 0 &&
              productsOrderInfoGroups.map(
                (item: IOrderGroup, index: number) => (
                  <Card
                    border="danger"
                    className="w-100 mb-3"
                    key={item.productId}>
                    <Card.Header>
                      Gói hàng {index + 1} của {productsOrderInfoGroups.length}
                    </Card.Header>
                    <Card.Body>
                      {item.products?.map((product: TProductInCart) => (
                        <div
                          key={product._id}
                          className="d-flex justify-content-between align-items-start mb-2 gap-2">
                          <div>
                            <Image
                              src={
                                product.thumbnail + "" || "/image/no-image.png"
                              }
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
                )
              )}
          </div>
        </Container>
      )}
    </div>
  );
};

export default Page;
