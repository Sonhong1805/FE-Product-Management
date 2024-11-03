"use client";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import { useAppSelector } from "@/lib/hooks";
import ProductsService from "@/services/products";
import VariantsService from "@/services/variants";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Badge, Button, Container, Form, Table } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiExit } from "react-icons/bi";
import { TfiTrash } from "react-icons/tfi";
import { TiEdit } from "react-icons/ti";
import Swal from "sweetalert2";

const Page = (props: IWithBaseProps) => {
  const { router, searchParams } = props;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<IVariant>({});
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [variants, setVariants] = useState<IVariant[]>([]);

  const initialPrice = useRef(0);
  const initialDiscount = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = searchParams.get("slug");
        const [productResponse, variantsResponse] = await Promise.all([
          ProductsService.detail(slug),
          VariantsService.index(slug),
        ]);
        if (productResponse.success && productResponse.data) {
          const price = productResponse.data.price || 0;
          const discount = productResponse.data.discount || 0;
          initialPrice.current = price;
          initialDiscount.current = discount;
          setValue("price", price);
          setValue("discount", discount);
        }
        if (variantsResponse.success && variantsResponse.data) {
          const variants = variantsResponse.data as IVariant[];
          setVariants(variants);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const onSubmit: SubmitHandler<IVariant> = async (data: IVariant) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "thumbnail" && value instanceof FileList) {
        formData.append("thumbnail", value[0] || "");
      } else {
        formData.append(key, value as string);
      }
    });
    if (watch("_id")) {
      const response = await VariantsService.update(
        searchParams.get("slug"),
        watch("_id"),
        formData
      );
      if (response.success && response.data) {
        setVariants((prev: IVariant[]) =>
          prev
            .map((variant: IVariant) =>
              variant._id === response.data?._id
                ? { ...variant, ...response.data }
                : variant
            )
            .sort((a: IVariant, b: IVariant) => {
              const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
              const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
              return dateB - dateA;
            })
        );
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
        handleReset();
      }
    } else {
      const response = await VariantsService.create(
        searchParams.get("slug"),
        formData
      );
      if (response.success && response.data) {
        setVariants((prev: IVariant[]) => [response.data as IVariant, ...prev]);
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
        handleReset();
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleReset = () => {
    setThumbnailPreview("");
    reset({
      name: "",
      thumbnail: "",
      price: initialPrice.current,
      discount: initialDiscount.current,
    });
  };

  const handleEditVariant = (variant: IVariant) => {
    setValue("_id", variant._id);
    setValue("name", variant.name);
    setValue("price", variant.price);
    setValue("discount", variant.discount);
    setValue("status", variant.status);
    setValue("thumbnail", variant.thumbnail);
    setThumbnailPreview(variant.thumbnail + "");
  };

  const handleDeleteVariant = (id: string) => {
    Swal.fire({
      text: "Bạn có chắc muốn xoá phân loại sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await VariantsService.delete(
          searchParams.get("slug"),
          id
        );
        if (response?.success && response.data) {
          setVariants((prev: IVariant[]) =>
            prev.filter(
              (variant: IVariant) => variant._id !== response.data?._id
            )
          );
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
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Phân loại sản phẩm</h2>
        <Button
          variant="warning"
          className="center gap-2"
          aria-hidden="false"
          onClick={() => router.push("/admin/products")}>
          <BiExit size={20} /> <span>Trở về</span>
        </Button>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <div className="d-flex gap-5">
          <div className="w-50">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên phân loại</Form.Label>
              <Form.Control
                placeholder="Nhập tên phân loại"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-danger">Vui lòng nhập tên phân loại</span>
              )}
            </Form.Group>
            <div className="d-flex mb-3 gap-3 flex-wrap">
              <Form.Group
                className="flex-fill"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Giá (VNĐ)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  defaultValue={getValues("price")}
                  placeholder="Nhập giá sản phẩm"
                  {...register("price", {
                    valueAsNumber: true,
                  })}
                />
              </Form.Group>
              <Form.Group
                className="flex-fill"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Phần trăm giảm giá (??%)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  defaultValue={getValues("discount")}
                  placeholder="Nhập phần trăm giảm giá"
                  {...register("discount", {
                    valueAsNumber: true,
                  })}
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
              <Form.Check
                type={"checkbox"}
                id={`status`}
                label={`Hoạt động`}
                defaultChecked={true}
                {...register("status")}
              />
            </Form.Group>
            <Form.Group
              className="pt-3 d-flex gap-3"
              controlId="exampleForm.ControlInput1">
              <Button
                variant="outline-primary"
                className="w-50 m-auto"
                type="submit">
                {watch("_id") ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button
                variant="outline-secondary"
                className="w-50 m-auto"
                type="reset"
                onClick={handleReset}>
                Huỷ
              </Button>
            </Form.Group>
          </div>
          <div className="w-50">
            <Image
              src={thumbnailPreview || "/image/no-image.png"}
              width={200}
              height={200}
              alt="thumbnail"
              priority={true}
              style={{ objectFit: "contain" }}
            />
            <Form.Group controlId="formFile">
              <Form.Label>Thêm ảnh</Form.Label>
              <Form.Control
                type="file"
                {...register("thumbnail")}
                onChange={handleThumbnailChange}
              />
            </Form.Group>
          </div>
        </div>
      </Form>
      <Table striped bordered hover className="mt-3 caption-top mb-5">
        <caption>Danh sách phân loại</caption>
        <thead className="table-info">
          <tr>
            <th>STT</th>
            <th>Tên phân loại</th>
            <th>Hình ảnh</th>
            <th>Giá (VNĐ)</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {variants.length ? (
            variants.map((variant: IVariant, index: number) => (
              <tr key={variant._id}>
                <td>{index + 1}</td>
                <td>{variant.name}</td>
                <td>
                  <Image
                    src={variant.thumbnail + "" || "/image/no-image.png"}
                    width={80}
                    height={80}
                    alt={variant.name}
                  />
                </td>
                <td>
                  <span className="text-decoration-line-through text-secondary">
                    {priceFormat(variant.price)}
                  </span>{" "}
                  <span>(-{variant.discount}%)</span>
                  <div className="text-danger text-semibold text-price">
                    {priceFormat(variant.discountedPrice)}
                  </div>
                </td>
                <td>
                  <Badge bg={variant.status ? "success" : "danger"}>
                    {variant.status ? "Hoạt động" : "Dừng hoạt động"}
                  </Badge>
                </td>
                <td>{moment(variant.updatedAt).format("DD-MM-YYYY")}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-warning"
                      className="center"
                      onClick={() => handleEditVariant(variant)}>
                      <TiEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="center"
                      onClick={() => handleDeleteVariant(variant._id)}>
                      <TfiTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={7}>Chưa có phân loại nào</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default withBase(Page);
