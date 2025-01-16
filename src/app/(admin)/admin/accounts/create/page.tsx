"use client";
import withBase from "@/hocs/withBase";
import AccountsService from "@/services/accounts";
import RolesService from "@/services/roles";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiExit } from "react-icons/bi";
import Select, { MultiValue, SingleValue } from "react-select";
import makeAnimated from "react-select/animated";
import Swal from "sweetalert2";
const animatedComponents = makeAnimated();

const Page = (props: IWithBaseProps) => {
  const { router, searchParams } = props;
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [defaultRole, setDefaultRole] = useState<Option>();

  useEffect(() => {
    const fetchProductDetail = async () => {
      const response = await AccountsService.detail(
        searchParams.get("id") as string
      );
      if (response.success && response.data) {
        const { _id, fullname, avatar, address, email, gender, phone, role } =
          response.data as IAccountsInputs;
        setValue("_id", _id);
        setValue("fullname", fullname);
        setValue("avatar", avatar);
        setValue("address", address);
        setValue("email", email);
        setValue("gender", gender);
        setValue("phone", phone);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue("role", (role?._id as any) || "");
        const roleOption: Option = {
          value: role?._id || "",
          label: role?.title || "",
        };

        setDefaultRole(roleOption || { value: "", label: "" });
      }
    };
    fetchProductDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await RolesService.index(null);
      if (response.success && response.data) {
        const options = response.data.map((role: IRole) => ({
          value: role._id,
          label: role.title,
        }));
        setRoleOptions(options);
      }
    };
    fetchRoles();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IAccountsInputs>();
  const onSubmit: SubmitHandler<IAccountsInputs> = async (
    data: IAccountsInputs
  ) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "avatar" && value instanceof FileList) {
        formData.append("avatar", value[0] || "");
      } else {
        formData.append(key, value as string);
      }
    });
    if (watch("_id")) {
      const response = await AccountsService.update(data._id, formData);
      if (response.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/admin/accounts");
      }
    } else {
      const response = await AccountsService.create(formData);
      if (response.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/admin/accounts");
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const getRoleOptions = (
    newValue: SingleValue<Option> | MultiValue<Option> | null
  ) => {
    if (newValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("role", (newValue as Option).value as any);
      setDefaultRole(newValue as Option);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue("role", "" as any);
      setDefaultRole({ value: "", label: "" });
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{watch("_id") ? "Chỉnh sửa tài khoản" : "Thêm mới tài khoản"}</h2>
        <Button
          variant="warning"
          className="center gap-2"
          aria-hidden="false"
          onClick={() => router.push("/admin/accounts")}>
          <BiExit size={20} /> <span>Trở về</span>
        </Button>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <div className="d-flex gap-5">
          <div className="w-50">
            <Form.Group className="mb-3" controlId="fullname">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                placeholder="Nhập họ tên"
                {...register("fullname", { required: true })}
              />
              {errors.fullname && (
                <span className="text-danger">Vui lòng nhập họ tên</span>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                placeholder="Nhập email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-danger">Vui lòng nhập email</span>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <div className="d-flex gap-5">
                <Form.Check
                  type={"radio"}
                  label="Nam"
                  value="male"
                  id="male"
                  {...register("gender")}
                />
                <Form.Check
                  type={"radio"}
                  label="Nữ"
                  value="female"
                  id="female"
                  {...register("gender")}
                />
                <Form.Check
                  type={"radio"}
                  label="Khác"
                  value="other"
                  id="other"
                  {...register("gender")}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                placeholder="Nhập số điện thoại"
                {...register("phone")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Nhập địa chỉ</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Nhập địa chỉ"
                rows={3}
                {...register("address")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="roles">
              <Form.Label>Vai trò</Form.Label>
              <Select
                closeMenuOnSelect={true}
                components={animatedComponents}
                placeholder="-- Chọn vai trò cho tài khoản --"
                value={defaultRole?.value ? defaultRole : null}
                isClearable={true}
                menuPlacement="top"
                options={roleOptions}
                onChange={getRoleOptions}
              />
            </Form.Group>
            {!watch("_id") && (
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <span className="text-danger">Vui lòng nhập mật khẩu</span>
                )}
              </Form.Group>
            )}
          </div>
          <div className="w-50 text-center">
            <Image
              src={
                watch("avatar") && watch("_id")
                  ? avatarPreview || getValues("avatar") + ""
                  : avatarPreview || "/image/no-image.png"
              }
              width={200}
              height={200}
              alt="avatar"
              priority={true}
              style={{ objectFit: "contain" }}
            />

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Thêm ảnh đại diện</Form.Label>
              <Form.Control
                type="file"
                {...register("avatar")}
                onChange={handleAvatarChange}
              />
            </Form.Group>
          </div>
        </div>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Button
            variant="outline-primary"
            className="w-25 m-auto"
            type="submit">
            {watch("_id") ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default withBase(Page);
