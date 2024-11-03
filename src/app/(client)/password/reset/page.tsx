"use client";
import AuthService from "@/services/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TResetPassword>();
  const onSubmit: SubmitHandler<TResetPassword> = async (data) => {
    const email = localStorage.getItem("email") as string;
    const response = await AuthService.resetPassword(email, data.password);
    if (response.success) {
      Swal.fire({
        icon: "success",
        title: response?.message,
        showConfirmButton: false,
        timer: 2000,
      });
      localStorage.removeItem("email");
      router.push("/login");
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-3">Đặt lại mật khẩu mới</h1>
      <Form
        className="m-auto"
        style={{ width: "30rem" }}
        onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <FloatingLabel label="Nhập mật khẩu" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password", { required: true })}
            />
          </FloatingLabel>
          {errors.password && (
            <span className="text-danger">Vui lòng nhập mật khẩu</span>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Xác nhận lại mật khẩu" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Xác nhận lại mật khẩu"
              {...register("confirmPassword", { required: true })}
            />
          </FloatingLabel>
          {errors.confirmPassword && (
            <span className="text-danger">Vui lòng nhập xác nhận mật khẩu</span>
          )}
        </Form.Group>
        <Form.Group className="mb-3 text-center w-100">
          <Button variant="outline-primary" className="w-100" type="submit">
            Xác nhận
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Page;
