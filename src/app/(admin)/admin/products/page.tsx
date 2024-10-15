"use client";
import Pagination from "@/components/Pagination/Pagination";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import { adminProductsFeaturedOptions } from "@/options/featured";
import { adminProductsFilteredOptions } from "@/options/filter";
import ProductsService from "@/services/products";
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
import { AiOutlineTags } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { TfiTrash } from "react-icons/tfi";
import { TiEdit } from "react-icons/ti";
import Select, { SingleValue } from "react-select";
import Swal from "sweetalert2";

const Page = (props: any) => {
  const { router, pathname, searchParams, rangeCount } = props;
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedFeatured, setSelectedFeatured] = useState<Option | null>(null);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 5,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState<IProductSearch>({
    keywords: searchParams.get("title") || "",
    priceTo: searchParams.get("priceTo") || 0,
    priceFrom: searchParams.get("priceFrom") || 0,
    filter: {
      label: localStorage.getItem("filterLabel") || "",
      value: localStorage.getItem("filterValue") || "",
    },
  });

  const fetchProducts = async () => {
    const response = await ProductsService.index({
      page: pagination.page,
      limit: pagination.limit,
      ...(search.keywords && { title: search.keywords }),
      ...(search.priceFrom > 0 && { "discountedPrice[gte]": search.priceFrom }),
      ...(search.priceTo > 0 && { "discountedPrice[lte]": search.priceTo }),
      ...(search.filter !== null
        ? {
            [search.filter?.value?.split(",")[0]]:
              search.filter?.value?.split(",")[1],
          }
        : {}),
    });
    if (response?.success && response?.data && response?.pagination) {
      setProducts(response.data || []);
      setPagination(response.pagination);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (pagination.page) {
      params.set("page", pagination.page.toString());
    }

    if (search.keywords) {
      params.set("title", search.keywords);
    } else {
      params.delete("title");
    }

    if (search.priceFrom > 0) {
      params.set("priceFrom", search.priceFrom.toString());
    } else {
      params.delete("priceFrom");
    }
    if (search.priceTo > 0) {
      params.set("priceTo", search.priceTo.toString());
    } else {
      params.delete("priceTo");
    }
    const storageParamsKey = localStorage
      .getItem("filterValue")
      ?.split(",")[0] as string;
    if (search.filter && search.filter.value) {
      const filterLabel = search.filter.label;
      const filterValue = search.filter.value;
      const [filterKey] = search.filter.value.split(",");
      if (filterKey !== storageParamsKey) {
        params.delete(storageParamsKey);
        params.set(filterKey, filterLabel);
        localStorage.setItem("filterValue", filterValue);
        localStorage.setItem("filterLabel", filterLabel);
      } else {
        params.set(filterKey, filterLabel);
        localStorage.setItem("filterValue", filterValue);
        localStorage.setItem("filterLabel", filterLabel);
      }
    } else {
      params.delete(storageParamsKey);
      localStorage.removeItem("filterValue");
      localStorage.removeItem("filterLabel");
    }

    router.push(pathname + "?" + params.toString());
    fetchProducts();
  }, [pagination.page, search]);

  const handleSeletedAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      const ids: (string | number)[] = products.map(
        (product: IProduct) => product._id
      );
      setSelectedIds(ids);
    }
  };

  const handleChangeOptionsFeatured = (option: Option | null) => {
    setSelectedFeatured(option);
  };

  const deleteProduct = async (id: string) => {
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
        const response = await ProductsService.delete(id);
        if (response?.success) {
          setProducts((prev) =>
            prev.filter(
              (product: IProduct) => product._id !== response.data?._id
            )
          );
          if (products.length === 1) {
            setPagination((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
              totalItems: prev.totalItems - 1,
            }));
          } else {
            setPagination((prev) => ({
              ...prev,
              totalItems: prev.totalItems - 1,
            }));
          }
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

  const handleSelectedIds = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleFeatured = async () => {
    if (selectedIds.length > 0 && selectedFeatured) {
      const response = await ProductsService.changeFeature({
        ids: selectedIds,
        feature: selectedFeatured.value,
      });
      if (response?.success) {
        fetchProducts();
        Swal.fire({
          icon: response?.success ? "success" : "error",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const { register, handleSubmit, setValue } = useForm<IProductSearch>({
    defaultValues: {
      keywords: search.keywords,
    },
  });
  const onSubmit: SubmitHandler<IProductSearch> = async (
    data: IProductSearch
  ) => {
    const filterKey = localStorage
      .getItem("filterValue")
      ?.split(",")[0] as string;
    if (!data.filter || !data.filter.value) {
      if (filterKey) {
        setSearch({
          ...search,
          filter: {
            value: "",
            label: "",
          },
        });
      } else {
        setSearch({
          ...search,
          keywords: data.keywords,
          priceFrom: isNaN(data.priceFrom) ? 0 : data.priceFrom,
          priceTo: isNaN(data.priceTo) ? 0 : data.priceTo,
        });
      }
    } else {
      setSearch({
        ...search,
        keywords: data.keywords,
        priceFrom: isNaN(data.priceFrom) ? 0 : data.priceFrom,
        priceTo: isNaN(data.priceTo) ? 0 : data.priceTo,
        filter: data.filter,
      });
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý sản phẩm</h2>
        <Button
          variant="outline-success"
          className="center gap-2"
          aria-hidden="false"
          onClick={() => router.push("/admin/products/create")}>
          <CiCirclePlus size={20} /> <span>Thêm mới</span>
        </Button>
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
                placeholder="Nhập tên sản phẩm"
                {...register("keywords")}
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
                search.filter && search.filter.value ? search.filter : null
              }
              options={adminProductsFilteredOptions}
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
                options={adminProductsFeaturedOptions}
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
        <caption>Danh sách sản phẩm </caption>
        <thead className="table-info">
          <tr>
            <th>
              <Form.Check
                type={"checkbox"}
                checked={
                  selectedIds.length > 0 &&
                  selectedIds.length === products.length
                }
                onChange={handleSeletedAll}
              />
            </th>
            <th>STT</th>
            <th className="col-title-product">Tên sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Danh mục</th>
            <th>Giá (VNĐ)</th>
            <th>Số lượng</th>
            <th>Đã bán</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length ? (
            products.map((product: IProduct, index: number) => (
              <tr key={product._id}>
                <td>
                  <Form.Check
                    type={"checkbox"}
                    checked={selectedIds.includes(product._id)}
                    onChange={() => handleSelectedIds(product._id)}
                  />
                </td>
                <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                <td className="col-title-product">{product.title}</td>
                <td>
                  <Image
                    src={product.thumbnail + "" || "/image/no-image.png"}
                    width={80}
                    height={80}
                    alt={product.title}
                  />
                </td>
                <td>{product.category?.title}</td>
                <td>
                  <span className="text-decoration-line-through text-secondary">
                    {priceFormat(product.price)}
                  </span>{" "}
                  <span>(-{product.discount}%)</span>
                  <div className="text-danger text-semibold text-price">
                    {priceFormat(product.discountedPrice)}
                  </div>
                </td>
                <td>{product.quantity}</td>
                <td>{product.sold}</td>
                <td>
                  <Badge bg={product.status ? "success" : "danger"}>
                    {product.status ? "Hoạt động" : "Dừng hoạt động"}
                  </Badge>
                </td>
                <td>{moment(product.updatedAt).format("DD-MM-YYYY")}</td>
                <td>
                  <div className="d-grid gap-2 grid-2">
                    <Button
                      variant="outline-success"
                      className="center"
                      onClick={() =>
                        router.push(
                          "/admin/products/create?slug=" + product.slug
                        )
                      }>
                      <FiEye />
                    </Button>
                    <Button
                      variant="outline-warning"
                      className="center"
                      onClick={() =>
                        router.push(
                          "/admin/products/create?slug=" + product.slug
                        )
                      }>
                      <TiEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="center"
                      onClick={() => deleteProduct(product._id)}>
                      <TfiTrash />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="center"
                      onClick={() =>
                        router.push(
                          "/admin/products/variants?id=" + product._id
                        )
                      }>
                      <AiOutlineTags />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={11}>Chưa có sản phẩm nào</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          Hiển thị {rangeCount(products, pagination)}
          trên {pagination.totalItems} kết quả.
        </div>
        <Pagination pagination={pagination} setPagination={setPagination} />
      </div>
    </Container>
  );
};

export default withBase(Page);
