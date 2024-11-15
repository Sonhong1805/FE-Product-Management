"use client";
import { useAppSelector } from "@/lib/hooks";
import AccountsService from "@/services/accounts";
import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Swal from "sweetalert2";

const Page = () => {
  const userId = useAppSelector((state) => state.user.userInfo._id);
  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false);
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
    <Col xs={9}>
      <div className="bg-light p-4">
        <h4 className="py-3">Thay đổi mật khẩu</h4>
        <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
          <div className="w-50">
            <Form.Group className="mb-3" controlId="current-password">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={isShowCurrentPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu hiện tại"
                  {...register("currentPassword", { required: true })}
                />
                {isShowCurrentPassword ? (
                  <BsEye
                    className="position-absolute"
                    cursor={"pointer"}
                    onClick={() => setIsShowCurrentPassword(false)}
                    style={{ top: "6px", right: "10px", fontSize: "25px" }}
                  />
                ) : (
                  <BsEyeSlash
                    className="position-absolute"
                    cursor={"pointer"}
                    onClick={() => setIsShowCurrentPassword(true)}
                    style={{ top: "6px", right: "10px", fontSize: "25px" }}
                  />
                )}
              </div>
              {errors.currentPassword && (
                <span className="text-danger">
                  Vui lòng nhập mật khẩu hiện tại
                </span>
              )}
            </Form.Group>
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
      </div>
    </Col>
  );
};

export default Page;
