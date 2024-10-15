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
import Pagination from "@/components/Pagination/Pagination";
import BlogsService from "@/services/blogs";
import { adminBlogsFeaturedOptions } from "@/options/featured";
import Image from "next/image";

const Page = (props: any) => {
  const { router, pathname, searchParams, rangeCount } = props;
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [selectedFeatured, setSelectedFeatured] = useState<Option | null>(null);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 5,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState<IBlogsSearch>({
    keywords: searchParams.get("title") || "",
    filter: {
      label: searchParams.get("status") || "",
      value: localStorage.getItem("statusValue") || "",
    },
  });

  const fetchBlogs = async () => {
    const response = await BlogsService.index({
      page: pagination.page,
      limit: pagination.limit,
      ...(search.keywords && { title: search.keywords }),
      ...(search.filter && search.filter.value
        ? {
            [search.filter?.value?.split(",")[0]]:
              search.filter?.value?.split(",")[1],
          }
        : {}),
    });
    if (response?.success && response?.data && response?.pagination) {
      setBlogs(response.data || []);
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

    if (search.filter && search.filter.value) {
      params.set("status", search.filter.label);
      localStorage.setItem("statusValue", search.filter.value);
    } else {
      params.delete("status");
      localStorage.removeItem("statusValue");
    }

    router.push(pathname + "?" + params.toString());
    fetchBlogs();
  }, [pagination.page, search]);

  const handleSeletedAll = () => {
    if (selectedIds.length === blogs.length) {
      setSelectedIds([]);
    } else {
      const ids: (string | number)[] = blogs.map((blog: IBlog) => blog._id);
      setSelectedIds(ids);
    }
  };

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
          setBlogs((prev: IBlog[]) =>
            prev.filter((blog: IBlog) => blog._id !== response.data?._id)
          );

          if (blogs.length === 1) {
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
      const response = await BlogsService.changeFeature({
        ids: selectedIds,
        feature: selectedFeatured.value,
      });
      if (response?.success) {
        fetchBlogs();
        Swal.fire({
          icon: response?.success ? "success" : "error",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const { register, handleSubmit, setValue } = useForm<IBlogsSearch>({
    defaultValues: {
      keywords: search.keywords,
    },
  });
  const onSubmit: SubmitHandler<IBlogsSearch> = async (data: IBlogsSearch) => {
    setSearch({
      ...search,
      keywords: data.keywords,
      filter: data.filter,
    });
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý bài viết</h2>
        <Button
          variant="outline-success"
          className="center gap-2"
          aria-hidden="false"
          onClick={() => router.push("/admin/blogs/create")}>
          <CiCirclePlus size={20} /> <span>Thêm mới</span>
        </Button>
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
                search.filter && search.filter.value ? search.filter : null
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
                onChange={handleSeletedAll}
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
                    onChange={() => handleSelectedIds(blog._id)}
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
                    <Button
                      variant="outline-warning"
                      className="center"
                      onClick={() =>
                        router.push("/admin/blogs/create?id=" + blog._id)
                      }>
                      <TiEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="center"
                      onClick={() => deleteBlog(blog._id)}>
                      <TfiTrash />
                    </Button>
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
        <Pagination pagination={pagination} setPagination={setPagination} />
      </div>
    </Container>
  );
};

export default withBase(Page);
