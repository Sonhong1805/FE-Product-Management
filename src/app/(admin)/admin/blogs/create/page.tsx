"use client";
import withBase from "@/hocs/withBase";
import BlogsService from "@/services/blogs";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiExit } from "react-icons/bi";
import Swal from "sweetalert2";
const Editor = dynamic(() => import("@/components/Editor/Editor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Page = (props: any) => {
  const { router, searchParams } = props;
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  useEffect(() => {
    const fetchBlogDetail = async () => {
      const response = await BlogsService.detail(
        searchParams.get("id") as string
      );
      if (response.success && response.data) {
        const { _id, title, thumbnail, content } = response.data as IBlogInputs;
        setValue("_id", _id);
        setValue("title", title);
        setValue("thumbnail", thumbnail);
        setValue("content", content);
      }
    };
    fetchBlogDetail();
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IBlogInputs>();
  const onSubmit: SubmitHandler<IBlogInputs> = async (data: IBlogInputs) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "thumbnail" && value instanceof FileList) {
        formData.append("thumbnail", value[0] || "");
      } else {
        formData.append(key, value as string);
      }
    });

    if (watch("_id")) {
      const response = await BlogsService.update(watch("_id"), formData);
      if (response.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/admin/blogs");
      }
    } else {
      const response = await BlogsService.create(formData);
      if (response.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/admin/blogs");
      }
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const getValueContent = (html: string) => setValue("content", html);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{watch("_id") ? "Chỉnh sửa bài viết" : "Thêm mới bài viết"}</h2>
        <Button
          variant="warning"
          className="center gap-2"
          aria-hidden="false"
          onClick={() => router.push("/admin/blogs")}>
          <BiExit size={20} /> <span>Trở về</span>
        </Button>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <div className="d-flex gap-5">
          <div className="w-50">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tiêu đề bài viết</Form.Label>
              <Form.Control
                placeholder="Nhập tiêu đề bài viết"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <span className="text-danger">
                  Vui lòng nhập tiêu đề bài viết
                </span>
              )}
            </Form.Group>
            <Image
              src={
                watch("thumbnail")
                  ? thumbnailPreview || getValues("thumbnail") + ""
                  : thumbnailPreview || "/image/no-image.png"
              }
              width={200}
              height={200}
              alt="thumbnail"
              priority={true}
              style={{ objectFit: "contain" }}
            />

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Thêm ảnh</Form.Label>
              <Form.Control
                type="file"
                {...register("thumbnail")}
                onChange={handleThumbnailChange}
              />
            </Form.Group>
          </div>
        </div>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          {watch("_id") && (
            <Editor
              title="Nhập nội dung"
              value={getValues("content")}
              onGetValue={getValueContent}
            />
          )}
          {!watch("_id") && (
            <Editor
              title="Nhập nội dung"
              value={""}
              onGetValue={getValueContent}
            />
          )}
        </Form.Group>
        <Form.Group
          className="mb-3 text-center"
          controlId="exampleForm.ControlInput1">
          <Button
            variant="outline-primary"
            className="w-25 m-auto"
            type="submit">
            Thêm mới
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default withBase(Page);
