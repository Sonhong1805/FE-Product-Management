"use client";
import { methodPayment } from "@/constants/methodPayment";
import priceFormat from "@/helpers/priceFormat";
import { updateStatus } from "@/lib/features/order/orderSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import OrdersService from "@/services/orders";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Table } from "react-bootstrap";
import { FiEye } from "react-icons/fi";
import { TfiTrash } from "react-icons/tfi";
import Swal from "sweetalert2";

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const userId = useAppSelector((state) => state.user.userInfo._id);
  useEffect(() => {
    (async () => {
      const response = await OrdersService.detailByUserId(userId);
      if (response.success) {
        setOrders(response.data || []);
      }
    })();
  }, []);

  const handleCancelledOrder = async (id: string) => {
    const response = await OrdersService.update(id, "CANCELED");
    if (response.success) {
      dispatch(updateStatus({ id, status: "CANCELED" }));
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
    <Col xs={9}>
      <div className="bg-light p-4">
        <h4 className="py-3">Đơn hàng đã mua</h4>
        <Table striped bordered hover className="mt-3 caption-top">
          <caption>Danh sách đơn hàng </caption>
          <thead className="table-info">
            <tr>
              <th>STT</th>
              <th>Mã đơn hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length ? (
              orders.map((order: IOrder, index: number) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>
                    {order.products.map((product) => (
                      <Image
                        key={product._id}
                        src={product.thumbnail + "" || "/image/no-image.png"}
                        width={50}
                        height={50}
                        alt={product.title}
                        priority
                        className="me-1"
                      />
                    ))}
                  </td>
                  <td>{priceFormat(order.totalPrice)}</td>
                  <td>{methodPayment[order.method]}</td>
                  <td>
                    {order.status === "APPROVED" && (
                      <Badge bg="success">Đã duyệt</Badge>
                    )}
                    {order.status === "PENDING" && (
                      <Badge bg="warning" text="dark">
                        Chờ duyệt
                      </Badge>
                    )}
                    {order.status === "CANCELED" && (
                      <Badge bg="secondary">Đã huỷ</Badge>
                    )}
                  </td>
                  <td>
                    <div className="d-grid gap-2 grid-2">
                      <Button
                        variant="outline-success"
                        className="center"
                        onClick={() =>
                          router.push("/account/orders/" + order._id)
                        }>
                        <FiEye />
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="center"
                        onClick={() => handleCancelledOrder(order._id)}>
                        <TfiTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan={7}>Chưa có đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Col>
  );
};

export default Page;
