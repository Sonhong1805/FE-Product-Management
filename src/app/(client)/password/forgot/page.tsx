"use client";
import AuthService from "@/services/auth";
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
  } = useForm<TForgotPassword>();
  const onSubmit: SubmitHandler<TForgotPassword> = async (data) => {
    const response = await AuthService.forgotPassword(data.email);
    if (response.success) {
      router.push("/password/otp");
      localStorage.setItem("email", data.email);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-3">Quên mật khẩu</h1>
      <Form
        className="m-auto"
        style={{ width: "30rem" }}
        onSubmit={handleSubmit(onSubmit)}>
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
