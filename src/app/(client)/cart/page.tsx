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
import React, { useEffect } from "react";
import { Button, Container, Form, InputGroup, Table } from "react-bootstrap";
import { TfiTrash } from "react-icons/tfi";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const Page = () => {
  const dispatch = useDispatch();
  const products = useAppSelector((state) => state.user.userInfo.cart.products);
  const totalPrice = products.reduce(
    (sum, product) => sum + product.discountedPrice * product.quantity,
    0
  );
  const selectedIds = useAppSelector((state) => state.user.selectedIds);
  const cartId: string = getCookie("cartId");

  useEffect(() => {
    (async () => {
      await CartsService.selected(cartId, selectedIds, "change");
    })();
  }, [selectedIds]);

  const handleUpdateProductInCart = async (
    _id: string,
    type: "plus" | "minus"
  ) => {
    await dispatch(updateCart({ cartId, _id, type }) as any);
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

  return (
    <div className="bg-body-secondary">
      <Container>
        <Table striped bordered hover className="mt-3 caption-top">
          <caption>Giỏ hàng của tôi</caption>
          <thead className="table-info">
            <tr>
              <th>
                <Form.Check
                  type={"checkbox"}
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === products.length
                  }
                  onChange={() => dispatch(seletedIdsChangedAll())}
                />
              </th>
              <th style={{ maxWidth: "300px" }}>Tên sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Giá (VNĐ)</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product: TProductInCart) => (
                <tr key={product._id}>
                  <td>
                    <Form.Check
                      type={"checkbox"}
                      checked={selectedIds.includes(product._id)}
                      onChange={() => dispatch(selectedIdsChanged(product._id))}
                    />
                  </td>
                  <td style={{ maxWidth: "300px" }}>
                    {product.title} <div>{product.variant}</div>
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
                    <div className="text-danger text-semibold text-price">
                      {priceFormat(product.discountedPrice)}
                    </div>
                  </td>
                  <td>
                    <InputGroup className="mb-3" style={{ maxWidth: "100px" }}>
                      <Button
                        variant="outline-secondary"
                        id="button-addon1"
                        onClick={() =>
                          handleUpdateProductInCart(product._id, "minus")
                        }>
                        -
                      </Button>
                      <Form.Control
                        aria-label="Example text with button addon"
                        aria-describedby="basic-addon1"
                        className="w-25"
                        min={1}
                        value={product.quantity}
                        readOnly
                      />
                      <Button
                        variant="outline-secondary"
                        id="button-addon2"
                        onClick={() =>
                          handleUpdateProductInCart(product._id, "plus")
                        }>
                        +
                      </Button>
                    </InputGroup>
                  </td>
                  <td>
                    {priceFormat(product.discountedPrice * product.quantity)}
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      className="center"
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
          <Button variant="danger" onClick={handleDeletedSelectedIds}>
            Xoá
          </Button>
          <div className="">{priceFormat(totalPrice)}</div>
        </div>
      </Container>
    </div>
  );
};

export default Page;
