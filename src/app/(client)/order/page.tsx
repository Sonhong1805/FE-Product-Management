"use client";
import Paypal from "@/components/Paypal";
import { getCookie } from "@/helpers/cookie";
import groupItems from "@/helpers/groupItems";
import priceFormat from "@/helpers/priceFormat";
import { saveOrderInfo } from "@/lib/features/order/orderSlice";
import { deleteProductsInCart } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import OrdersService from "@/services/orders";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartId: string = getCookie("cartId");
  const [isPaid, setIsPaid] = useState<"SUCCESS" | "ERROR" | "">("");

  const productsInCart =
    useAppSelector((state) => state.user.userInfo?.cart.products) || [];
  const selectedIds = useAppSelector((state) => state.user.selectedIds);
  const orderInfo = useAppSelector((state) => state.orders.orderInfo);
  const productsOrder = productsInCart.filter((product) =>
    selectedIds.includes(product._id)
  );
  const productsOrderGroups = groupItems(productsOrder);
  const productsOrderInfoGroups = groupItems(orderInfo.products);
  const totalPrice = +productsOrder.reduce(
    (sum: number, product: TProductInCart) =>
      (sum += product.discountedPrice * product.quantity),
    0
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TOrderInputs>({
    defaultValues: {},
  });
  const onSubmit: SubmitHandler<TOrderInputs> = async (data) => {
    if (!isPaid && data.method === "PAYPAL") {
      setIsPaid("ERROR");
      return;
    }
    const ids = productsOrder.map((product) => product._id);
    const response = await OrdersService.create(cartId, {
      ...data,
      products: productsOrder,
    });
    if (response.success) {
      await dispatch(
        saveOrderInfo({
          ...data,
          products: productsOrder,
        })
      );
      await dispatch(deleteProductsInCart(ids));
      Swal.fire({
        icon: "success",
        title: response.message,
        showConfirmButton: false,
        timer: 2000,
      });
      // router.push("/order/success");
    }
  };
  return (
    <div className="bg-body-secondary pt-5">
      <Container>
        <Row>
          <Col xs={6}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>Họ tên người nhận</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên người nhận"
                  {...register("fullname", { required: true })}
                />
                {errors.fullname && (
                  <span className="text-danger">
                    Vui lòng nhập tên người nhận
                  </span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập địa chỉ Email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-danger">Vui lòng nhập email</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập số điện thoại"
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <span className="text-danger">
                    Vui lòng nhập số điện thoại
                  </span>
                )}
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1">
                <Form.Label>Địa chỉ giao hàng</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register("address", { required: true })}
                />
                {errors.address && (
                  <span className="text-danger">
                    Vui lòng nhập địa chỉ giao hàng
                  </span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phương thức thanh toán</Form.Label>
                <div className="d-flex gap-5">
                  <Form.Check
                    type={"radio"}
                    label="Tiền mặt"
                    value="CASH"
                    id="CASH"
                    defaultChecked
                    {...register("method")}
                  />
                  <Form.Check
                    type={"radio"}
                    label="Paypal"
                    value="PAYPAL"
                    id="PAYPAL"
                    {...register("method")}
                  />
                </div>
              </Form.Group>
              {watch("method") === "PAYPAL" && (
                <Form.Group className="mb-3">
                  <Paypal
                    amount={Math.round(totalPrice / 25410)}
                    setIsPaid={setIsPaid}
                  />
                  {isPaid && isPaid === "ERROR" && (
                    <span className="text-danger">
                      Thanh toán không thành công
                    </span>
                  )}
                  {isPaid === "SUCCESS" && (
                    <span className="text-success">Thanh toán thành công</span>
                  )}
                </Form.Group>
              )}
              <Button variant="primary" type="submit">
                Thanh toán
              </Button>
            </Form>
          </Col>
          <Col xs={6}>
            <div className="w-100">
              {[...productsOrderGroups, ...productsOrderInfoGroups].length >
                0 &&
                [...productsOrderGroups, ...productsOrderInfoGroups].map(
                  (item: IOrderGroup, index: number) => (
                    <Card
                      border="danger"
                      className="w-100 mb-3"
                      key={item.productId}>
                      <Card.Header>
                        Gói hàng {index + 1} của {productsOrderGroups.length}
                      </Card.Header>
                      <Card.Body>
                        {item.products?.map((product: TProductInCart) => (
                          <div
                            key={product._id}
                            className="d-flex justify-content-between align-items-center">
                            <div>
                              <Image
                                src={
                                  product.thumbnail + "" ||
                                  "/image/no-image.png"
                                }
                                width={50}
                                height={50}
                                priority
                                alt="thumbnail"
                              />
                            </div>
                            <div>
                              <Link href={"/product/" + product.slug}>
                                {product.title}
                              </Link>
                              <div>{product.variant}</div>
                            </div>
                            <div>
                              <div>{priceFormat(product.price)}</div>
                              <div>
                                {priceFormat(product.discountedPrice)} x{" "}
                                {product.quantity}
                              </div>
                            </div>
                            <div>
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
              <div className="d-flex justify-content-between align-items-center">
                <Button>Trở về cửa hàng</Button>
                <span>{priceFormat(totalPrice)}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Page;
