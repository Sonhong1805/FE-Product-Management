"use client";
import withBase from "@/hocs/withBase";
import AuthService from "@/services/auth";
import Link from "next/link";
import React, { useState } from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Swal from "sweetalert2";

const Page = (props: IWithBaseProps) => {
  const { router } = props;
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IRegister>();
  const onSubmit: SubmitHandler<IRegister> = async (data) => {
    if (data.confirmPassword !== data.password) {
      setError("confirmPassword", {
        message: "Mật khẩu không khớp!! Vui lòng xác nhận lại mật khẩu",
      });
      return;
    }
    const response = await AuthService.register(data);
    if (response?.success) {
      router.push("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: response?.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <Container className="py-5">
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
          <div className="position-relative">
            <FloatingLabel label="Nhập mật khẩu" className="mb-3">
              <Form.Control
                type={isShowPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                {...register("password", { required: true })}
              />
              {isShowPassword ? (
                <BsEye
                  className="position-absolute"
                  cursor={"pointer"}
                  onClick={() => setIsShowPassword(false)}
                  style={{ top: "19px", right: "10px", fontSize: "25px" }}
                />
              ) : (
                <BsEyeSlash
                  className="position-absolute"
                  cursor={"pointer"}
                  onClick={() => setIsShowPassword(true)}
                  style={{ top: "19px", right: "10px", fontSize: "25px" }}
                />
              )}
            </FloatingLabel>
          </div>
          {errors.password && (
            <span className="text-danger">Vui lòng nhập mật khẩu</span>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <div className="position-relative">
            <FloatingLabel label="Xác nhận lại mật khẩu" className="mb-3">
              <Form.Control
                type={isShowConfirmPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                {...register("confirmPassword", { required: true })}
              />
              {isShowConfirmPassword ? (
                <BsEye
                  className="position-absolute"
                  cursor={"pointer"}
                  onClick={() => setIsShowConfirmPassword(false)}
                  style={{ top: "19px", right: "10px", fontSize: "25px" }}
                />
              ) : (
                <BsEyeSlash
                  className="position-absolute"
                  cursor={"pointer"}
                  onClick={() => setIsShowConfirmPassword(true)}
                  style={{ top: "19px", right: "10px", fontSize: "25px" }}
                />
              )}
            </FloatingLabel>
          </div>
          {errors.confirmPassword && (
            <span className="text-danger">
              {errors.confirmPassword.message ||
                "Vui lòng nhập xác nhận lại mật khẩu"}
            </span>
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

export default withBase(Page);
