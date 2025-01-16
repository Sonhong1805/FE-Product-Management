"use client";
import { updateUserInfo } from "@/lib/features/user/userSlice";
import { useAppSelector } from "@/lib/hooks";
import AccountsService from "@/services/accounts";
import Image from "next/image";
import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const Page = () => {
  const dispatch = useDispatch();
  const [avatarPreview, setAvatarPreview] = useState("");
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IAccountInputs>({
    defaultValues: {
      fullname: userInfo.fullname,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      avatar: userInfo.avatar,
      gender: userInfo.gender,
    },
  });
  const onSubmit: SubmitHandler<IAccountInputs> = async (
    data: IAccountInputs
  ) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "avatar" && value instanceof FileList) {
        formData.append("avatar", value[0] || userInfo.avatar + "");
      } else {
        formData.append(key, value as string);
      }
    });
    const response = await AccountsService.update(userInfo._id, formData);
    if (response.success) {
      dispatch(updateUserInfo({ ...data }));
      Swal.fire({
        position: "center",
        icon: "success",
        title: response.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
  return (
    <Col xs={9}>
      <div className="bg-light p-4">
        <h4 className="py-3">Hồ sơ cá nhân</h4>
        <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
          <div className="d-flex gap-5">
            <div className="w-50">
              <Form.Group className="mb-3" controlId="fullname">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                  placeholder="Nhập họ tên"
                  {...register("fullname", { required: true })}
                />
                {errors.fullname && (
                  <span className="text-danger">Vui lòng nhập họ tên</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  placeholder="Nhập họ tên"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-danger">Vui lòng nhập email</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <div className="d-flex gap-5">
                  <Form.Check
                    type={"radio"}
                    label="Nam"
                    value="male"
                    id="male"
                    {...register("gender")}
                  />
                  <Form.Check
                    type={"radio"}
                    label="Nữ"
                    value="female"
                    id="female"
                    {...register("gender")}
                  />
                  <Form.Check
                    type={"radio"}
                    label="Khác"
                    value="other"
                    id="other"
                    {...register("gender")}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  placeholder="Nhập số điện thoại"
                  {...register("phone")}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Nhập địa chỉ</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Nhập địa chỉ"
                  rows={3}
                  {...register("address")}
                />
              </Form.Group>
            </div>
            <div className="w-50 text-center">
              <Image
                src={
                  getValues("avatar")
                    ? avatarPreview || getValues("avatar") + ""
                    : avatarPreview || "/image/no-image.png"
                }
                width={200}
                height={200}
                alt="avatar"
                priority={true}
                style={{ objectFit: "contain" }}
              />

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Thêm ảnh đại diện</Form.Label>
                <Form.Control
                  type="file"
                  {...register("avatar")}
                  onChange={handleAvatarChange}
                />
              </Form.Group>
            </div>
          </div>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Button
              variant="outline-primary"
              className="w-25 m-auto"
              type="submit">
              Lưu
            </Button>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
};

export default Page;
