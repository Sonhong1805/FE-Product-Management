"use client";
import { useAppSelector } from "@/lib/hooks";
import AccountsService from "@/services/accounts";
import Image from "next/image";
import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Page = () => {
  const userId = useAppSelector((state) => state.user.userInfo._id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IPasswordInputs>({});
  const onSubmit: SubmitHandler<IPasswordInputs> = async (
    data: IPasswordInputs
  ) => {
    const response = await AccountsService.updatePassword(userId, data);
    if (response.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: response?.message,
        showConfirmButton: false,
        timer: 2000,
      });
      reset();
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: response?.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
  return (
    <Col xs={9}>
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <div className="w-50">
          <Form.Group className="mb-3" controlId="fullname">
            <Form.Label>Mật khẩu hiện tại</Form.Label>
            <Form.Control
              placeholder="Nhập mật khẩu hiện tại"
              {...register("currentPassword", { required: true })}
            />
            {errors.currentPassword && (
              <span className="text-danger">
                Vui lòng nhập mật khẩu hiện tại
              </span>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              placeholder="Nhập mật khẩu mới"
              {...register("newPassword", { required: true })}
            />
            {errors.newPassword && (
              <span className="text-danger">Vui lòng nhập mật khẩu mới</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Xác nhận lại mật khẩu</Form.Label>
            <Form.Control
              placeholder="Nhập xác nhận mật khẩu"
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && (
              <span className="text-danger">Vui lòng nhập mật khẩu mới</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Button
              variant="outline-primary"
              className="w-25 m-auto"
              type="submit">
              Thay đổi
            </Button>
          </Form.Group>
        </div>
      </Form>
    </Col>
  );
};

export default Page;
