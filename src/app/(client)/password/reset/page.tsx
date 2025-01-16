"use client";
import withBase from "@/hocs/withBase";
import AuthService from "@/services/auth";
import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Swal from "sweetalert2";

const Page = (props: IWithBaseProps) => {
  const { router } = props;
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TResetPassword>();
  const onSubmit: SubmitHandler<TResetPassword> = async (data) => {
    if (data.confirmPassword !== data.password) {
      setError("confirmPassword", {
        message: "Mật khẩu không khớp!! Vui lòng xác nhận lại mật khẩu",
      });
      return;
    }
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
      <h1 className="text-center mb-3">Đặt lại mật khẩu mới</h1>
      <Form
        className="m-auto"
        style={{ width: "30rem" }}
        onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu mới</Form.Label>
          <div className="position-relative">
            <Form.Control
              type={isShowNewPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              {...register("password", { required: true })}
            />
            {isShowNewPassword ? (
              <BsEye
                className="position-absolute"
                cursor={"pointer"}
                onClick={() => setIsShowNewPassword(false)}
                style={{ top: "6px", right: "10px", fontSize: "25px" }}
              />
            ) : (
              <BsEyeSlash
                className="position-absolute"
                cursor={"pointer"}
                onClick={() => setIsShowNewPassword(true)}
                style={{ top: "6px", right: "10px", fontSize: "25px" }}
              />
            )}
          </div>
          {errors.password && (
            <span className="text-danger">Vui lòng nhập mật khẩu</span>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Xác nhận lại mật khẩu</Form.Label>
          <div className="position-relative">
            <Form.Control
              type={isShowConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận lại mật khẩu"
              {...register("confirmPassword", { required: true })}
            />
            {isShowConfirmPassword ? (
              <BsEye
                className="position-absolute"
                cursor={"pointer"}
                onClick={() => setIsShowConfirmPassword(false)}
                style={{ top: "6px", right: "10px", fontSize: "25px" }}
              />
            ) : (
              <BsEyeSlash
                className="position-absolute"
                cursor={"pointer"}
                onClick={() => setIsShowConfirmPassword(true)}
                style={{ top: "6px", right: "10px", fontSize: "25px" }}
              />
            )}
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
            Xác nhận
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default withBase(Page);
