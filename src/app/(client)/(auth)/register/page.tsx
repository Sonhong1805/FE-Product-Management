"use client";
import AuthService from "@/services/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>();
  const onSubmit: SubmitHandler<IRegister> = async (data) => {
    const response = await AuthService.register(data);
    if (response?.success) {
      router.push("/login");
    } else {
      alert("Error");
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-3">Đăng ký tài khoản</h1>
      <Form
        style={{ width: "30rem" }}
        className="m-auto"
        onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <FloatingLabel label="Nhập họ tên" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Nhập họ tên"
              {...register("fullname", { required: true })}
            />
          </FloatingLabel>
          {errors.fullname && (
            <span className="text-danger">Vui lòng nhập họ tên</span>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Nhập địa chỉ email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Nhập địa chỉ email"
              {...register("email", { required: true })}
            />
          </FloatingLabel>
          {errors.email && (
            <span className="text-danger">Vui lòng nhập địa chỉ email</span>
          )}
        </Form.Group>
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
            Đăng ký
          </Button>
        </Form.Group>
        <div className="mb-3">
          Đăng nhập{" "}
          <Link
            href={"/login"}
            className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
            Tại đây
          </Link>
        </div>
      </Form>
    </Container>
  );
};

export default Page;
