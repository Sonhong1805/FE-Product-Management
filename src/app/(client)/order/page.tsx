"use client";
import Loading from "@/components/Loading";
import Paypal from "@/components/Paypal";
import { methodPayment } from "@/constants/methodPayment";
import { getCookie } from "@/helpers/cookie";
import groupItems from "@/helpers/groupItems";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import useDebounce from "@/hooks/useDebounce";
import { saveOrderInfo } from "@/lib/features/order/orderSlice";
import { deleteProductsInCart } from "@/lib/features/user/userSlice";
import { useAppSelector } from "@/lib/hooks";
import GoongMapService from "@/services/goong";
import OrdersService from "@/services/orders";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsCart3, BsCash, BsPaypal } from "react-icons/bs";
import { GrLocationPin } from "react-icons/gr";
import { MdPayments } from "react-icons/md";
import Swal from "sweetalert2";

const Page = (props: IWithBaseProps) => {
  const { router, dispatch } = props;
  const cartId: string = getCookie("cartId");
  const [isPaid, setIsPaid] = useState<"SUCCESS" | "ERROR" | "">("");
  const [loading, setLoading] = useState(false);
  const [listAddress, setListAddress] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>();

  const productsInCart =
    useAppSelector((state) => state.user.userInfo?.cart.products) || [];
  const selectedIds = useAppSelector((state) => state.user.selectedIds);
  const orderInfo = useAppSelector((state) => state.orders.orderInfo);
  const productsOrder = productsInCart.filter((product: TProductInCart) =>
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
    setValue,
    formState: { errors },
  } = useForm<TOrderInputs>();
  const onSubmit: SubmitHandler<TOrderInputs> = async (data) => {
    setLoading(true);
    if (!isPaid && data.method === "PAYPAL") {
      setIsPaid("ERROR");
      setLoading(false);
      return;
    }
    const ids = productsOrder.map((product: TProductInCart) => product._id);
    const response = await OrdersService.create(cartId, {
      ...data,
      products: productsOrder,
    });
    if (response.success) {
      setLoading(false);
      dispatch(
        saveOrderInfo({
          ...data,
          products: productsOrder,
        })
      );
      dispatch(deleteProductsInCart(ids));
      Swal.fire({
        icon: "success",
        title: response.message,
        showConfirmButton: false,
        timer: 2000,
      });
      router.push("/order/success");
    }
  };

  const debouncedAddress = useDebounce(watch("address"), 500);

  useEffect(() => {
    (async () => {
      if (selectedAddress !== debouncedAddress) {
        const response = await GoongMapService.search(debouncedAddress);
        if (response.status === "OK") {
          const listAddress = response.predictions.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (address: any) => address.description
          );
          setListAddress(listAddress);
        } else {
          setListAddress([]);
        }
      } else {
        setListAddress([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAddress]);

  const handleSelectedAddress = (address: string) => {
    setSelectedAddress(address);
    setValue("address", address);
    setListAddress([]);
  };

  return (
    <div className="bg-body-secondary py-5">
      {loading && <Loading />}
      <Container>
        <Row>
          <Col xs={5}>
            <h4 className="mb-3">Thông tin giao hàng</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>Họ tên người nhận (*)</Form.Label>
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
                <Form.Label>Email (*)</Form.Label>
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
                <Form.Label>Số điện thoại (*)</Form.Label>
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
                className="mb-3 position-relative"
                controlId="exampleForm.ControlTextarea1">
                <Form.Label>Địa chỉ giao hàng (*)</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Nhập địa chỉ giao hàng"
                  {...register("address", { required: true })}
                />
                {listAddress.length > 0 && (
                  <div className="list-address">
                    <ul>
                      {listAddress.map((address: string, index: number) => (
                        <li
                          key={index}
                          onClick={() => handleSelectedAddress(address)}>
                          <GrLocationPin color="rgb(220 53 69)" /> {address}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {errors.address && (
                  <span className="text-danger">
                    Vui lòng nhập địa chỉ giao hàng
                  </span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phương thức thanh toán</Form.Label>
                <div className="d-flex gap-2">
                  <div>
                    <input
                      className="tag-input"
                      type={"radio"}
                      value="CASH"
                      id="CASH"
                      hidden
                      defaultChecked
                      {...register("method")}
                    />
                    <label htmlFor="CASH" className="tag-label gap-2 py-2">
                      <BsCash size={28} />
                      <span style={{ fontSize: "15px" }}>
                        {methodPayment.CASH}
                      </span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="tag-input"
                      type={"radio"}
                      value="PAYPAL"
                      id="PAYPAL"
                      hidden
                      {...register("method")}
                    />
                    <label htmlFor="PAYPAL" className="tag-label gap-2 py-2">
                      <BsPaypal size={20} />
                      <span style={{ fontSize: "15px" }}>
                        {methodPayment.PAYPAL}
                      </span>
                    </label>
                  </div>
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
              <Button
                variant="success"
                className="w-100 d-flex gap-2 align-items-center justify-content-center"
                style={{ height: "55px" }}
                type="submit">
                <MdPayments size={32} />{" "}
                <span style={{ fontSize: "20px" }}>Đặt hàng</span>
              </Button>
            </Form>
          </Col>
          <Col xs={7}>
            <h4 className="mb-3">Chi tiết gói hàng</h4>
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
                            className="d-flex justify-content-between align-items-start mb-2 gap-2">
                            <figure className="no-image order">
                              <Image
                                src={
                                  product.thumbnail + "" ||
                                  "/image/no-image.png"
                                }
                                width={60}
                                height={60}
                                priority
                                alt="thumbnail"
                              />
                            </figure>
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
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  variant="outline-danger"
                  className="d-flex gap-2 align-items-center"
                  onClick={() => router.push("/shop")}>
                  <BsCart3 />
                  <span>Trở về giỏ hàng</span>
                </Button>
                <span>
                  Tổng thanh toán ({productsOrder.length} Sản phẩm):{" "}
                  <strong className="text-danger" style={{ fontSize: "20px" }}>
                    {priceFormat(totalPrice)}
                  </strong>
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withBase(Page);
