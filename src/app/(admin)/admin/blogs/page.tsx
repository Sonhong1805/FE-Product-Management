"use client";
import withBase from "@/hocs/withBase";
import { adminBlogsFilteredOptions } from "@/options/filter";
import moment from "moment";
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
import { CiCirclePlus } from "react-icons/ci";
import { TfiTrash } from "react-icons/tfi";
import { TiEdit } from "react-icons/ti";
import Select, { SingleValue } from "react-select";
import Swal from "sweetalert2";
import BlogsService from "@/services/blogs";
import { adminBlogsFeaturedOptions } from "@/options/featured";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";
import Pagination from "@/components/Pagination";
import {
  deletedBlog,
  handlePagination,
  handleQueries,
  selectedIdsChanged,
  seletedIdsChangedAll,
  updateFeature,
} from "@/lib/features/blog/blogSlice";
import { fetchBlogs } from "@/lib/features/blog/blogThunk";
import Loading from "@/components/Loading/Loading";

const Page = (props: IWithBaseProps) => {
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const { router, pathname, searchParams, rangeCount, dispatch } = props;
  const [selectedFeatured, setSelectedFeatured] = useState<Option | null>(null);
  const blogs = useAppSelector((state) => state.blogs.data);
  const pagination = useAppSelector((state) => state.blogs.pagination);
  const queries = useAppSelector((state) => state.blogs.queries);
  const [loading, setLoading] = useState<boolean>(false);
  const selectedIds = useAppSelector((state) => state.products.selectedIds);

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

    const storageParamsKey = localStorage
      .getItem("blogFilterValue")
      ?.split(",")[0] as string;

    if (queries.filter && queries.filter.value) {
      const filterLabel = queries.filter.label;
      const filterValue = queries.filter.value;
      const [filterKey] = queries.filter.value.split(",");
      if (filterKey !== storageParamsKey) {
        params.delete(storageParamsKey);
        params.set(filterKey, filterLabel);
        localStorage.setItem("blogFilterValue", filterValue);
        localStorage.setItem("blogFilterLabel", filterLabel);
      } else {
        params.set(filterKey, filterLabel);
        localStorage.setItem("blogFilterValue", filterValue);
        localStorage.setItem("blogFilterLabel", filterLabel);
      }
    } else {
      params.delete(storageParamsKey);
      localStorage.removeItem("blogFilterValue");
      localStorage.removeItem("blogFilterLabel");
    }

    (async () => {
      setLoading(true);
      await dispatch(
        fetchBlogs({
          page: pagination.page,
          limit: pagination.limit,
          ...(queries.keywords && { title: queries.keywords }),
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

  const deleteBlog = async (id: string) => {
    Swal.fire({
      text: "Bạn có chắc muốn xoá bài viết này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await BlogsService.delete(id);
        if (response?.success) {
          dispatch(deletedBlog(id));
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
      const response = await BlogsService.changeFeature({
        ids: selectedIds,
        feature: selectedFeatured.value,
      });
      if (response?.success) {
        await dispatch(
          updateFeature({
            ids: selectedIds,
            feature: selectedFeatured.value,
          })
        );
        Swal.fire({
          icon: response?.success ? "success" : "error",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const { register, handleSubmit, setValue } = useForm<IBlogsQueries>({
    defaultValues: {
      keywords: queries.keywords,
    },
  });
  const onSubmit: SubmitHandler<IBlogsQueries> = async (
    data: IBlogsQueries
  ) => {
    dispatch(handlePagination({ ...pagination, page: 1 }));
    const filterKey = localStorage
      .getItem("blogFilterValue")
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
          })
        );
      }
    } else {
      dispatch(
        handleQueries({
          ...queries,
          keywords: data.keywords,
          filter: data.filter,
        })
      );
    }
  };

  return (
    <Container>
      {loading && <Loading />}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý bài viết</h2>
        {userPermissions.includes("blogs_create") && (
          <Button
            variant="outline-success"
            className="center gap-2"
            aria-hidden="false"
            onClick={() => router.push("/admin/blogs/create")}>
            <CiCirclePlus size={20} /> <span>Thêm mới</span>
          </Button>
        )}
      </div>
      <Tabs
        defaultActiveKey="search"
        id="uncontrolled-tab-example"
        className="mb-3">
        <Tab eventKey="search" title="Tìm kiếm">
          <Form className="d-flex w-50" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="me-2 flex-fill">
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề hoặc tên tác giả"
                {...register("keywords")}
              />
            </Form.Group>
            <Select
              className="basic-single me-2"
              classNamePrefix="select"
              placeholder="-- Chọn trạng thái --"
              name="filter"
              isClearable={true}
              defaultValue={
                queries.filter && queries.filter.value ? queries.filter : null
              }
              options={adminBlogsFilteredOptions}
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
                options={adminBlogsFeaturedOptions}
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
        <caption>Danh sách bài viết</caption>
        <thead className="table-info">
          <tr>
            <th>
              <Form.Check
                type={"checkbox"}
                checked={
                  selectedIds.length > 0 && selectedIds.length === blogs.length
                }
                onChange={() => dispatch(seletedIdsChangedAll())}
              />
            </th>
            <th>STT</th>
            <th>Tiêu đề</th>
            <th>Hình ảnh</th>
            <th>Tác giả</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length ? (
            blogs.map((blog: IBlog, index: number) => (
              <tr key={blog._id}>
                <td>
                  <Form.Check
                    type={"checkbox"}
                    checked={selectedIds.includes(blog._id)}
                    onChange={() => dispatch(selectedIdsChanged(blog._id))}
                  />
                </td>
                <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                <td>{blog.title}</td>
                <td>
                  <Image
                    src={blog.thumbnail + "" || "/image/no-image.png"}
                    width={80}
                    height={80}
                    alt={blog.title}
                  />
                </td>
                <td>{blog.author}</td>
                <td>
                  <Badge bg={blog.status ? "success" : "danger"}>
                    {blog.status ? "Hoạt động" : "Dừng hoạt động"}
                  </Badge>
                </td>
                <td>{moment(blog.updatedAt).format("DD-MM-YYYY")}</td>
                <td>
                  <div className="d-flex gap-2">
                    {userPermissions.includes("blogs_update") && (
                      <Button
                        variant="outline-warning"
                        className="center"
                        onClick={() =>
                          router.push("/admin/blogs/create?id=" + blog._id)
                        }>
                        <TiEdit />
                      </Button>
                    )}
                    {userPermissions.includes("blogs_delete") && (
                      <Button
                        variant="outline-danger"
                        className="center"
                        onClick={() => deleteBlog(blog._id)}>
                        <TfiTrash />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={8}>Chưa có bài viết nào</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          Hiển thị {rangeCount(blogs, pagination)}
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
