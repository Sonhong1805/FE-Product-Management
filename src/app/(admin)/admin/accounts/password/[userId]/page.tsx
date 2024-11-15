"use client";
import withBase from "@/hocs/withBase";
import { useAppSelector } from "@/lib/hooks";
import AccountsService from "@/services/accounts";
import React, { useState } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Swal from "sweetalert2";

const Page = ({ params: { userId } }: { params: { userId: string } }) => {
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<IPasswordInputs>({});
  const onSubmit: SubmitHandler<IPasswordInputs> = async (
    data: IPasswordInputs
  ) => {
    if (data.confirmPassword !== data.newPassword) {
      setError("confirmPassword", {
        message: "Mật khẩu không khớp!! Vui lòng xác nhận lại mật khẩu",
      });
      return;
    }
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
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="">Thay đổi mật khẩu cho tài khoản</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <div className="w-50">
          <Form.Group className="mb-3" controlId="new-password">
            <Form.Label>Mật khẩu mới</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={isShowNewPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                {...register("newPassword", { required: true })}
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
            {errors.newPassword && (
              <span className="text-danger">Vui lòng nhập mật khẩu mới</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirm-password">
            <Form.Label>Xác nhận lại mật khẩu</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={isShowConfirmPassword ? "text" : "password"}
                placeholder="Nhập xác nhận mật khẩu"
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
    </Container>
  );
};

export default Page;
