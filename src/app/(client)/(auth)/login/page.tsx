"use client";
import { setCookie } from "@/helpers/cookie";
import { saveUserInfo } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import AuthService from "@/services/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    const response = await AuthService.login(data);
    if (response?.success && response.data) {
      localStorage.setItem("access_token", response.data.accessToken as string);
      const cartId = response.data.user?.cart?._id as string;
      if (cartId) {
        setCookie("cartId", cartId);
      }
      dispatch(saveUserInfo(response.data.user));
      router.push("/");
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-3">Đăng nhập</h1>
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
        <Form.Group className="mb-3 d-flex justify-content-between">
          <Link
            href={"/forgot-password"}
            className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
            Quên mật khẩu ?
          </Link>
          <span>
            Bạn chưa có tài khoản?{" "}
            <Link
              href={"/register"}
              className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
              Đăng ký
            </Link>
          </span>
        </Form.Group>
        <Form.Group className="mb-3 text-center w-100">
          <Button variant="outline-primary" className="w-100" type="submit">
            Đăng nhập
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Page;
