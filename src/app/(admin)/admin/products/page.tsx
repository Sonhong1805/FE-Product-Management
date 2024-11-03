"use client";
import Loading from "@/components/Loading/Loading";
import Pagination from "@/components/Pagination";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import {
  deletedProduct,
  handlePagination,
  handleQueries,
  selectedIdsChanged,
  seletedIdsChangedAll,
  updateFeature,
} from "@/lib/features/product/productSlice";
import { fetchProducts } from "@/lib/features/product/productThunk";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { adminProductsFeaturedOptions } from "@/options/featured";
import { adminProductsFilteredOptions } from "@/options/filter";
import ProductsService from "@/services/products";
import moment from "moment";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

const Page = (props: IWithBaseProps) => {
  const { searchParams, rangeCount, router, pathname, dispatch } = props;

  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const products = useAppSelector((state) => state.products.data);
  const [selectedFeatured, setSelectedFeatured] = useState<Option | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const selectedIds = useAppSelector((state) => state.products.selectedIds);
  const pagination = useAppSelector((state) => state.products.pagination);
  const queries = useAppSelector((state) => state.products.queries);

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
    setOrDeleteParam("name", queries.keywords);
    setOrDeleteParam("priceFrom", queries.priceFrom);
    setOrDeleteParam("priceTo", queries.priceTo);

    const storageParamsKey = localStorage
      .getItem("productFilterValue")
      ?.split(",")[0] as string;

    if (queries.filter && queries.filter.value) {
      const filterLabel = queries.filter.label;
      const filterValue = queries.filter.value;
      const [filterKey] = queries.filter.value.split(",");
      if (filterKey !== storageParamsKey) {
        params.delete(storageParamsKey);
        params.set(filterKey, filterLabel);
        localStorage.setItem("productFilterValue", filterValue);
        localStorage.setItem("productFilterLabel", filterLabel);
      } else {
        params.set(filterKey, filterLabel);
        localStorage.setItem("productFilterValue", filterValue);
        localStorage.setItem("productFilterLabel", filterLabel);
      }
    } else {
      params.delete(storageParamsKey);
      localStorage.removeItem("productFilterValue");
      localStorage.removeItem("productFilterLabel");
    }

    (async () => {
      setLoading(true);
      await dispatch(
        fetchProducts({
          page: pagination.page,
          limit: pagination.limit,
          ...(queries.keywords && { title: queries.keywords }),
          ...(queries.priceFrom > 0 && {
            "discountedPrice[gte]": queries.priceFrom,
          }),
          ...(queries.priceTo > 0 && {
            "discountedPrice[lte]": queries.priceTo,
          }),
          ...(queries.categorySlug?.length && {
            categorySlug: queries.categorySlug,
          }),
          ...(queries.filter !== null
            ? {
                [queries.filter?.value?.split(",")[0]]:
                  queries.filter?.value?.split(",")[1],
              }
            : {}),
        })
      );
      setLoading(false);
    })();
    router.push(pathname + "?" + params.toString());
  }, [queries, pagination.page]);

  const handleChangeOptionsFeatured = (option: Option | null) => {
    setSelectedFeatured(option);
  };

  const handleDeleteProduct = async (cid: string, pid: string) => {
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
        const response = await ProductsService.delete(cid, pid);
        if (response.success) {
          dispatch(deletedProduct(pid));
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

  const handleFeatured = async () => {
    if (selectedIds.length > 0 && selectedFeatured) {
      const response = await ProductsService.changeFeature({
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
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const { register, handleSubmit, setValue } = useForm<IProductQueries>({
    defaultValues: {
      keywords: queries.keywords,
      priceFrom: queries.priceFrom,
      priceTo: queries.priceTo,
    },
  });
  const onSubmit: SubmitHandler<IProductQueries> = (data: IProductQueries) => {
    dispatch(handlePagination({ ...pagination, page: 1 }));
    const filterKey = localStorage
      .getItem("productFilterValue")
      ?.split(",")[0] as string;
    if (!data.filter || !data.filter.value) {
      if (filterKey) {
        dispatch(
          handleQueries({
            ...queries,
            filter: {
              value: "",
              label: "",
            },
          })
        );
      } else {
        dispatch(
          handleQueries({
            ...queries,
            keywords: data.keywords,
            priceFrom: isNaN(data.priceFrom) ? 0 : data.priceFrom,
            priceTo: isNaN(data.priceTo) ? 0 : data.priceTo,
          })
        );
      }
    } else {
      dispatch(
        handleQueries({
          ...queries,
          keywords: data.keywords,
          priceFrom: isNaN(data.priceFrom) ? 0 : data.priceFrom,
          priceTo: isNaN(data.priceTo) ? 0 : data.priceTo,
          filter: data.filter,
        })
      );
    }
  };

  return (
    <Container>
      {loading && <Loading />}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý sản phẩm</h2>
        {userPermissions.includes("products_create") && (
          <Button
            variant="outline-success"
            className="center gap-2"
            aria-hidden="false"
            onClick={() => router.push("/admin/products/create")}>
            <CiCirclePlus size={20} /> <span>Thêm mới</span>
          </Button>
        )}
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
                queries.filter && queries.filter.value ? queries.filter : null
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
                onChange={() => dispatch(seletedIdsChangedAll())}
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
                    onChange={() => dispatch(selectedIdsChanged(product._id))}
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
                  {product.discount !== 0 && (
                    <div>
                      <span className="text-decoration-line-through text-secondary">
                        {priceFormat(product.price)}
                      </span>{" "}
                      <span>(-{product.discount}%)</span>
                    </div>
                  )}
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
                    {userPermissions.includes("products_view") && (
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
                    )}
                    {userPermissions.includes("products_update") && (
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
                    )}
                    {userPermissions.includes("products_delete") && (
                      <Button
                        variant="outline-danger"
                        className="center"
                        onClick={() =>
                          handleDeleteProduct(product.category._id, product._id)
                        }>
                        <TfiTrash />
                      </Button>
                    )}
                    {userPermissions.includes("products_update") && (
                      <Button
                        variant="outline-secondary"
                        className="center"
                        onClick={() =>
                          router.push(
                            "/admin/products/variants?slug=" + product.slug
                          )
                        }>
                        <AiOutlineTags />
                      </Button>
                    )}
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
        <Pagination
          pagination={pagination}
          onHandlePagination={handlePagination}
        />
      </div>
    </Container>
  );
};

export default withBase(Page);
