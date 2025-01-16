"use client";
import withBase from "@/hocs/withBase";
import { updateSettings } from "@/lib/features/setting/settingThunk";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Page = () => {
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const dispatch = useAppDispatch();
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [logoPreview, setLogoPreview] = useState("");
  const setting = useAppSelector((state) => state.setting.data);
  useEffect(() => {
    (async () => {
      if (setting._id) {
        const { _id, name, logo, email, phone, address, copyright } =
          setting as ISetting;
        setValue("_id", _id);
        setValue("name", name);
        setValue("logo", logo);
        setValue("email", email);
        setValue("phone", phone);
        setValue("address", address);
        setValue("copyright", copyright);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ISetting>();
  const onSubmit: SubmitHandler<ISetting> = async (data: ISetting) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "logo" && value instanceof FileList) {
        formData.append("logo", value[0] || "");
      } else {
        formData.append(key, value as string);
      }
    });

    const response = await dispatch(
      updateSettings({ id: data._id, data: formData })
    ).unwrap();
    if (response.success && !isEditable) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: response?.message,
        showConfirmButton: false,
        timer: 2000,
      });
      setIsEditable(true);
    }
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Cài đặt chung</h2>
          {userPermissions.includes("settings_update") && (
            <>
              {!isEditable ? (
                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="center gap-2"
                    aria-hidden="false">
                    <span>Cập nhật</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="center gap-2"
                    aria-hidden="false"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditable(true);
                    }}>
                    <span>Huỷ</span>
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="warning"
                  className="center gap-2"
                  aria-hidden="false"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditable(false);
                  }}>
                  <span>Chỉnh sửa</span>
                </Button>
              )}
            </>
          )}
        </div>
        <div className="d-flex gap-5 mb-5">
          <div className="w-50">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên Website</Form.Label>
              <Form.Control
                placeholder="Nhập tên website"
                disabled={isEditable}
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-danger">Vui lòng nhập tên website</span>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                placeholder="Nhập email"
                disabled={isEditable}
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-danger">Vui lòng nhập email</span>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Số điện thoại liên hệ</Form.Label>
              <Form.Control
                placeholder="Nhập điện thoại liên hệ"
                disabled={isEditable}
                {...register("phone", { required: true })}
              />
              {errors.phone && (
                <span className="text-danger">
                  Vui lòng nhập điện thoại liên hệ
                </span>
              )}
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1">
              <Form.Label>Nhập địa chỉ</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("address")}
                disabled={isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Copyright</Form.Label>
              <Form.Control
                placeholder="Nhập copyright"
                disabled={isEditable}
                {...register("copyright", { required: true })}
              />
              {errors.copyright && (
                <span className="text-danger">Vui lòng nhập copyright</span>
              )}
            </Form.Group>
          </div>
          <div className="w-50">
            <Image
              src={
                watch("logo")
                  ? logoPreview || watch("logo") + ""
                  : logoPreview || "/image/no-image.png"
              }
              width={200}
              height={200}
              alt="logo"
              priority={true}
              style={{ objectFit: "contain" }}
            />

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Thêm Logo</Form.Label>
              <Form.Control
                type="file"
                disabled={isEditable}
                {...register("logo")}
                onChange={handleLogoChange}
              />
            </Form.Group>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default withBase(Page);
