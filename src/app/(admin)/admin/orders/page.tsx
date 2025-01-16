"use client";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import { methodPayment } from "@/constants/methodPayment";
import priceFormat from "@/helpers/priceFormat";
import setOrDeleteParam from "@/helpers/setOrDeleteParam";
import withBase from "@/hocs/withBase";
import {
  deleteOrder,
  handlePagination,
  handleQueries,
  updateStatus,
} from "@/lib/features/order/orderSlice";
import { fetchOrders } from "@/lib/features/order/orderThunk";
import { useAppSelector } from "@/lib/hooks";
import { adminOrdersFilteredOptions } from "@/options/filter";
import OrdersService from "@/services/orders";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Container,
  Form,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiCheckCircle, FiEye, FiXCircle } from "react-icons/fi";
import { TfiTrash } from "react-icons/tfi";
import Select, { SingleValue } from "react-select";
import Swal from "sweetalert2";

const Page = (props: IWithBaseProps) => {
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const { router, pathname, searchParams, rangeCount, dispatch } = props;
  const pagination = useAppSelector((state) => state.orders.pagination);
  const orders = useAppSelector((state) => state.orders.data);
  const queries = useAppSelector((state) => state.orders.queries);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrdersData = async () => {
    await dispatch(
      fetchOrders({
        page: pagination.page,
        limit: 6,
        ...(queries._id && { _id: queries._id }),
        ...(queries.priceFrom > 0 && {
          "totalPrice[gte]": queries.priceFrom,
        }),
        ...(queries.priceTo > 0 && { "totalPrice[lte]": queries.priceTo }),
        ...(queries.filter !== null && queries.filter?.value
          ? {
              [queries.filter?.value?.split(",")[0]]:
                queries.filter?.value?.split(",")[1],
            }
          : {}),
      })
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setOrDeleteParam(params, "page", pagination.page);
    setOrDeleteParam(params, "orderId", queries._id);
    setOrDeleteParam(params, "priceFrom", queries.priceFrom);
    setOrDeleteParam(params, "priceTo", queries.priceTo);
    setOrDeleteParam(
      params,
      "filter",
      queries.filter?.value && queries.filter?.value.split(",")[1]
    );

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      fetchOrdersData();
      setLoading(false);
      router.push(pathname + "?" + params.toString());
    }, 1000);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries, pagination.page]);

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

  const handleDeleteOrder = async (id: string) => {
    const response = await OrdersService.delete(id);
    if (response.success) {
      await dispatch(deleteOrder(id));
      Swal.fire({
        position: "center",
        icon: "success",
        title: response?.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const { register, handleSubmit, setValue } = useForm<IOrderQueries>({
    defaultValues: {
      _id: queries._id,
      priceFrom: queries.priceFrom > 0 ? queries.priceFrom : undefined,
      priceTo: queries.priceTo > 0 ? queries.priceTo : undefined,
    },
  });
  const onSubmit: SubmitHandler<IOrderQueries> = (data: IOrderQueries) => {
    dispatch(
      handleQueries({
        ...queries,
        _id: data._id,
        priceFrom: isNaN(data.priceFrom) ? 0 : data.priceFrom,
        priceTo: isNaN(data.priceTo) ? 0 : data.priceTo,
        filter: data.filter,
      })
    );
  };

  return (
    <Container>
      {loading && <Loading />}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý đơn hàng</h2>
      </div>
      <Tabs
        defaultActiveKey="search"
        id="uncontrolled-tab-example"
        className="mb-3">
        <Tab eventKey="search" title="Tìm kiếm">
          <Form className="d-flex w-100" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="me-2 w-25">
              <Form.Control
                type="text"
                placeholder="Nhập mã đơn hàng"
                {...register("_id")}
              />
            </Form.Group>
            <Form.Group className="d-flex me-2 w-25 gap-2 align-items-center">
              Giá
              <Form.Control
                className="flex-fill"
                type="text"
                placeholder="từ"
                {...register("priceFrom", {
                  valueAsNumber: true,
                })}
              />
              -
              <Form.Control
                className="flex-fill"
                type="text"
                placeholder="đến"
                {...register("priceTo", {
                  valueAsNumber: true,
                })}
              />
            </Form.Group>
            <Select
              className="basic-single me-2"
              classNamePrefix="select"
              placeholder="-- Chọn bộ lọc --"
              name="filter"
              isClearable={true}
              defaultValue={
                queries.filter && queries.filter.value ? queries.filter : null
              }
              options={adminOrdersFilteredOptions}
              onChange={(option: SingleValue<Option>) =>
                setValue("filter", option as Option)
              }
            />
            <Button variant="outline-success" type="submit">
              Tìm kiếm
            </Button>
          </Form>
        </Tab>
      </Tabs>
      <Table striped bordered hover className="mt-3 caption-top">
        <caption>Danh sách đơn hàng </caption>
        <thead className="table-info">
          <tr>
            <th>STT</th>
            <th>Mã đơn hàng</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Phương thức thanh toán</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length ? (
            orders.map((order: IOrder, index: number) => (
              <tr key={order._id}>
                <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                <td>{order._id}</td>
                <td>
                  {order.products.slice(0, 4).map((product) => (
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
                <td className="text-danger fw-bold">
                  {priceFormat(order.totalPrice)}
                </td>
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
                <td>{moment(order.updatedAt).format("DD-MM-YYYY")}</td>
                <td>
                  <div className="d-grid gap-2 grid-2">
                    {userPermissions.includes("orders_view") && (
                      <Button
                        variant="outline-success"
                        className="center"
                        onClick={() =>
                          router.push(`/admin/orders/view?id=${order._id}`)
                        }>
                        <FiEye />
                      </Button>
                    )}
                    {(userPermissions.includes("orders_approved") &&
                      (order.status === "APPROVED" ||
                        order.status === "CANCELED")) || (
                      <Button
                        variant="outline-warning"
                        className="center"
                        onClick={() =>
                          handleUpdateOrder(order._id, "APPROVED")
                        }>
                        <FiCheckCircle />
                      </Button>
                    )}
                    {(userPermissions.includes("orders_canceled") &&
                      (order.status === "APPROVED" ||
                        order.status === "CANCELED")) || (
                      <Button
                        variant="outline-secondary"
                        className="center"
                        onClick={() =>
                          handleUpdateOrder(order._id, "CANCELED")
                        }>
                        <FiXCircle />
                      </Button>
                    )}
                    {userPermissions.includes("orders_delete") && (
                      <Button
                        variant="outline-danger"
                        className="center"
                        onClick={() => handleDeleteOrder(order._id)}>
                        <TfiTrash />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={9}>Chưa có đơn hàng nào</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          Hiển thị {rangeCount(orders, pagination)}
          trên {pagination.totalItems} kết quả.
        </div>
        <Pagination
          pagination={pagination}
          siblingCount={1}
          onHandlePagination={handlePagination}
        />
      </div>
    </Container>
  );
};

export default withBase(Page);
