"use client";
import Pagination from "@/components/Pagination";
import { methodPayment } from "@/constants/methodPayment";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import {
  deleteOrder,
  handlePagination,
  handleQueries,
  selectedIdsChanged,
  seletedIdsChangedAll,
  updateFeature,
  updateStatus,
} from "@/lib/features/order/orderSlice";
import { fetchOrders } from "@/lib/features/order/orderThunk";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  adminOrdersFeaturedOptions,
  adminProductsFeaturedOptions,
} from "@/options/featured";
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

const Page = (props: any) => {
  const dispatch = useAppDispatch();
  const { router, pathname, searchParams, rangeCount } = props;
  const [selectedFeatured, setSelectedFeatured] = useState<Option | null>(null);
  const pagination = useAppSelector((state) => state.order.pagination);
  const selectedIds = useAppSelector((state) => state.order.selectedIds);
  const orders = useAppSelector((state) => state.order.data);
  const queries = useAppSelector((state) => state.order.queries);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const setOrDeleteParam = (
      key: string,
      value: string | number | boolean
    ) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    };

    setOrDeleteParam("page", pagination.page);
    setOrDeleteParam("id", queries._id);
    setOrDeleteParam("priceFrom", queries.priceFrom);
    setOrDeleteParam("priceTo", queries.priceTo);

    const storageParamsKey = localStorage
      .getItem("orderFilterValue")
      ?.split(",")[0] as string;

    if (queries.filter && queries.filter.value) {
      const filterLabel = queries.filter.label;
      const filterValue = queries.filter.value;
      const [filterKey] = queries.filter.value.split(",");
      if (filterKey !== storageParamsKey) {
        params.delete(storageParamsKey);
        params.set(filterKey, filterLabel);
        localStorage.setItem("orderFilterValue", filterValue);
        localStorage.setItem("orderFilterLabel", filterLabel);
      } else {
        params.set(filterKey, filterLabel);
        localStorage.setItem("orderFilterValue", filterValue);
        localStorage.setItem("orderFilterLabel", filterLabel);
      }
    } else {
      params.delete(storageParamsKey);
      localStorage.removeItem("orderFilterValue");
      localStorage.removeItem("orderFilterLabel");
    }

    (async () => {
      await dispatch(
        fetchOrders({
          page: pagination.page,
          limit: pagination.limit,
          ...(queries._id && { _id: queries._id }),
          ...(queries.priceFrom > 0 && {
            "totalPrice[gte]": queries.priceFrom,
          }),
          ...(queries.priceTo > 0 && { "totalPrice[lte]": queries.priceTo }),
          ...(queries.filter !== null
            ? {
                [queries.filter?.value?.split(",")[0]]:
                  queries.filter?.value?.split(",")[1],
              }
            : {}),
        })
      );
    })();
    router.push(pathname + "?" + params.toString());
  }, [queries, pagination.page]);

  const handleChangeOptionsFeatured = (option: Option | null) => {
    setSelectedFeatured(option);
  };

  const handleFeatured = async () => {
    if (selectedIds.length > 0 && selectedFeatured) {
      const response = await OrdersService.changeFeature({
        ids: selectedIds,
        feature: selectedFeatured.value,
      });
      if (response.success) {
        await dispatch(
          updateFeature({
            ids: selectedIds,
            feature: selectedFeatured.value,
          })
        );
        Swal.fire({
          icon: response.success ? "success" : "error",
          title: response.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

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
      _id: searchParams.get("id"),
      priceFrom: searchParams.get("priceFrom"),
      priceTo: searchParams.get("priceTo"),
    },
  });
  const onSubmit: SubmitHandler<IOrderQueries> = async (
    data: IOrderQueries
  ) => {
    const filterKey = localStorage
      .getItem("orderFilterValue")
      ?.split(",")[0] as string;
    if (!data.filter || !data.filter.value) {
      if (filterKey) {
        await dispatch(
          handleQueries({
            ...queries,
            filter: {
              value: "",
              label: "",
            },
          })
        );
      } else {
        await dispatch(
          handleQueries({
            ...queries,
            _id: data._id,
            priceFrom: isNaN(data.priceFrom) ? 0 : data.priceFrom,
            priceTo: isNaN(data.priceTo) ? 0 : data.priceTo,
          })
        );
      }
    } else {
      await dispatch(
        handleQueries({
          ...queries,
          _id: data._id,
          priceFrom: isNaN(data.priceFrom) ? 0 : data.priceFrom,
          priceTo: isNaN(data.priceTo) ? 0 : data.priceTo,
          filter: data.filter,
        })
      );
    }
  };

  return (
    <Container>
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
        <Tab eventKey="feartured" title="Tính năng">
          <Form className="d-flex">
            <div className="d-flex w-50 ">
              <Select
                className="basic-single flex-fill me-2"
                classNamePrefix="select"
                placeholder="-- Chọn tính năng muốn áp dụng --"
                isClearable={true}
                isSearchable={true}
                name="featured"
                options={adminOrdersFeaturedOptions}
                onChange={handleChangeOptionsFeatured}
              />
              <Button variant="outline-primary" onClick={handleFeatured}>
                Áp dụng
              </Button>
            </div>
          </Form>
        </Tab>
      </Tabs>
      <Table striped bordered hover className="mt-3 caption-top">
        <caption>Danh sách đơn hàng </caption>
        <thead className="table-info">
          <tr>
            <th>
              <Form.Check
                type={"checkbox"}
                checked={
                  selectedIds.length > 0 && selectedIds.length === orders.length
                }
                onChange={() => dispatch(seletedIdsChangedAll())}
              />
            </th>
            <th>STT</th>
            <th>Mã đơn hàng</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length ? (
            orders.map((order: IOrder, index: number) => (
              <tr key={order._id}>
                <td>
                  <Form.Check
                    type={"checkbox"}
                    checked={selectedIds.includes(order._id)}
                    onChange={() => dispatch(selectedIdsChanged(order._id))}
                  />
                </td>
                <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
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
                <td>{moment(order.updatedAt).format("DD-MM-YYYY")}</td>
                <td>
                  <div className="d-grid gap-2 grid-2">
                    <Button variant="outline-success" className="center">
                      <FiEye />
                    </Button>
                    <Button
                      variant="outline-warning"
                      className="center"
                      onClick={() => handleUpdateOrder(order._id, "APPROVED")}>
                      <FiCheckCircle />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="center"
                      onClick={() => handleUpdateOrder(order._id, "CANCELED")}>
                      <FiXCircle />
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="center"
                      onClick={() => handleDeleteOrder(order._id)}>
                      <TfiTrash />
                    </Button>
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
          dispatch={dispatch}
          onHandlePagination={handlePagination}
        />
      </div>
    </Container>
  );
};

export default withBase(Page);
