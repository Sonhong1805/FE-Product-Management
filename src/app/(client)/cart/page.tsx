"use client";
import { getCookie } from "@/helpers/cookie";
import priceFormat from "@/helpers/priceFormat";
import {
  deleteProductInCart,
  selectedIdsChanged,
  selectedIdsDeleted,
  seletedIdsChangedAll,
} from "@/lib/features/user/userSlice";
import { updateCart } from "@/lib/features/user/userThunk";
import { useAppSelector } from "@/lib/hooks";
import CartsService from "@/services/carts";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { Button, Container, Form, InputGroup, Table } from "react-bootstrap";
import { BsArrowLeftCircle } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { TfiTrash } from "react-icons/tfi";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const productsInCart =
    useAppSelector((state) => state.user.userInfo?.cart.products) || [];
  const selectedIds = useAppSelector((state) => state.user.selectedIds);
  const isFirstRender = useRef(true);

  const productsOrder = productsInCart.filter((product) =>
    selectedIds.includes(product._id)
  );
  const totalPrice = productsOrder.reduce(
    (sum, product) => sum + product.discountedPrice * product.quantity,
    0
  );
  const cartId: string = getCookie("cartId");

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    (async () => {
      await CartsService.selected(cartId, selectedIds, "change");
    })();
  }, [selectedIds]);

  const handleUpdateProductInCart = async (
    _id: string,
    type: "plus" | "minus" | "input",
    quantity: number
  ) => {
    await dispatch(updateCart({ cartId, _id, type, quantity }) as any);
  };

  const handleDeleteProductInCart = async (id: string) => {
    Swal.fire({
      text: "Bạn có chắc muốn xoá sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await CartsService.delete(cartId, id);
        if (response?.success) {
          await dispatch(deleteProductInCart(id));
          Swal.fire({
            icon: "success",
            title: response?.message,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };

  const handleDeletedSelectedIds = async () => {
    if (selectedIds.length > 0) {
      Swal.fire({
        text: "Bạn có chắc muốn xoá những sản phẩm này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xoá",
        cancelButtonText: "Huỷ",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await CartsService.selected(
            cartId,
            selectedIds,
            "delete"
          );
          if (response?.success) {
            await dispatch(selectedIdsDeleted(selectedIds));
            Swal.fire({
              icon: "success",
              title: response?.message,
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Vui lòng chọn ít nhất 1 sản phẩm",
        showConfirmButton: true,
      });
    }
  };

  const handleOrder = () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng chọn ít nhất 1 sản phẩm",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    const productOrders = productsInCart.filter((product: TProductInCart) =>
      selectedIds.includes(product._id)
    );
    if (productOrders.length > 0) {
      router.push("/order");
    }
  };

  return (
    <div className="bg-body-secondary py-3">
      <Container>
        <Table striped bordered hover className="caption-top">
          <caption>Giỏ hàng của tôi</caption>
          <thead className="table-info">
            <tr>
              <th>
                <Form.Check
                  type={"checkbox"}
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === productsInCart.length
                  }
                  onChange={() => dispatch(seletedIdsChangedAll())}
                />
              </th>
              <th style={{ maxWidth: "300px" }}>Tên sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Giá (VNĐ)</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th style={{ maxWidth: "60px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {productsInCart.length ? (
              productsInCart.map((product: TProductInCart) => (
                <tr key={product._id}>
                  <td>
                    <Form.Check
                      type={"checkbox"}
                      checked={selectedIds.includes(product._id)}
                      onChange={() => dispatch(selectedIdsChanged(product._id))}
                    />
                  </td>
                  <td
                    className="product-container"
                    style={{ maxWidth: "300px" }}>
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
                  </td>
                  <td>
                    <Image
                      src={product.thumbnail + "" || "/image/no-image.png"}
                      width={80}
                      height={80}
                      alt={product.title}
                    />
                  </td>
                  <td>
                    <div className="text-dark text-semibold text-price">
                      {priceFormat(product.discountedPrice)}
                    </div>
                  </td>
                  <td style={{ maxWidth: "100px" }}>
                    <InputGroup className="mb-3">
                      <Button
                        variant="danger"
                        id="button-addon1"
                        disabled={product.maxQuantity === 0}
                        onClick={() =>
                          handleUpdateProductInCart(
                            product._id,
                            "minus",
                            product.quantity
                          )
                        }>
                        -
                      </Button>
                      <Form.Control
                        aria-label="Example text with button addon"
                        aria-describedby="basic-addon1"
                        className="w-25"
                        min={1}
                        max={product?.maxQuantity}
                        disabled={product.maxQuantity === 0}
                        value={product.quantity}
                        onChange={(e) =>
                          handleUpdateProductInCart(
                            product._id,
                            "input",
                            +e.target.value
                          )
                        }
                      />
                      <Button
                        variant="primary"
                        id="button-addon2"
                        onClick={() =>
                          handleUpdateProductInCart(
                            product._id,
                            "plus",
                            product.quantity
                          )
                        }>
                        +
                      </Button>
                    </InputGroup>
                  </td>
                  <td className="text-end">
                    <div className="text-danger text-semibold text-price">
                      {priceFormat(product.discountedPrice * product.quantity)}
                    </div>
                  </td>
                  <td className="text-center ">
                    <Button
                      variant="outline-danger"
                      className="m-auto"
                      onClick={() => handleDeleteProductInCart(product._id)}>
                      <TfiTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan={7}>Chưa có sản phẩm nào trong giỏ hàng</td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="mb-5 d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              className="d-flex gap-2 align-items-center"
              onClick={() => router.push("/shop")}>
              <BsArrowLeftCircle /> <span>Tiếp tục mua hàng</span>
            </Button>
            <Button
              variant="outline-danger"
              className="d-flex gap-2 align-items-center"
              onClick={handleDeletedSelectedIds}>
              <TfiTrash /> <span>Xoá ({selectedIds.length})</span>
            </Button>
          </div>
          <div className="d-flex gap-3 align-items-end">
            <span>
              Tổng thanh toán ({selectedIds.length} Sản phẩm):{" "}
              <strong className="text-danger" style={{ fontSize: "20px" }}>
                {priceFormat(totalPrice)}
              </strong>
            </span>
            <Button
              variant="outline-success"
              className="d-flex gap-2 align-items-center"
              onClick={handleOrder}>
              <MdOutlinePayments /> <span>Mua hàng</span>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Page;
