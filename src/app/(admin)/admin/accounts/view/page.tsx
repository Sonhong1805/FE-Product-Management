"use client";
import withBase from "@/hocs/withBase";
import { useAppSelector } from "@/lib/hooks";
import AccountsService from "@/services/accounts";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { BiExit } from "react-icons/bi";
import { TiEdit } from "react-icons/ti";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const Page = (props: IWithBaseProps) => {
  const { router, searchParams } = props;
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const [accountDetail, setAccountDetail] = useState<IUser>();

  const avatarRef = useRef<HTMLDivElement | null>(null);
  const viewerInstanceRef = useRef<Viewer | null>(null);

  useEffect(() => {
    let Viewer;
    import("viewerjs").then((module) => {
      Viewer = module.default;

      if (avatarRef.current) {
        viewerInstanceRef.current = new Viewer(avatarRef.current, {});
      }
    });

    return () => {
      if (viewerInstanceRef.current) viewerInstanceRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    const fetchProductDetail = async () => {
      const response = await AccountsService.detail(
        searchParams.get("id") as string
      );
      if (response.success && response.data) {
        setAccountDetail(response.data);
      }
    };
    fetchProductDetail();
  }, [searchParams]);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Thông tin tài khoản</h2>
        <div className="d-flex gap-2">
          {userPermissions.includes("accounts_update") &&
            accountDetail?.email !== "admin@gmail.com" && (
              <Button
                variant="primary"
                className="center gap-2"
                aria-hidden="false"
                onClick={() =>
                  router.push("/admin/accounts/create?id=" + accountDetail?._id)
                }>
                <TiEdit size={20} /> <span>Chỉnh sửa</span>
              </Button>
            )}
          <Button
            variant="warning"
            className="center gap-2"
            aria-hidden="false"
            onClick={() => router.push("/admin/accounts")}>
            <BiExit size={20} /> <span>Trở về</span>
          </Button>
        </div>
      </div>
      <Form className="mb-5">
        <div className="d-flex gap-5">
          <div className="w-50">
            <Form.Group className="mb-3" controlId="fullname">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                value={accountDetail?.fullname || "Chưa có họ tên"}
                readOnly
                onChange={() => {}}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={accountDetail?.email || "Chưa có họ tên"}
                readOnly
                onChange={() => {}}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <div className="d-flex gap-5">
                <Form.Check
                  type={"radio"}
                  label="Nam"
                  value="male"
                  id="male"
                  defaultChecked={accountDetail?.gender === "male"}
                />
                <Form.Check
                  type={"radio"}
                  label="Nữ"
                  value="female"
                  id="female"
                  defaultChecked={accountDetail?.gender === "female"}
                />
                <Form.Check
                  type={"radio"}
                  label="Khác"
                  value="other"
                  id="other"
                  defaultChecked={accountDetail?.gender === "other"}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                value={accountDetail?.phone + "" || "Chưa có số điện thoại"}
                readOnly
                onChange={() => {}}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                as="textarea"
                value={accountDetail?.address + "" || "Chưa có địa chỉ"}
                onChange={() => {}}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="roles">
              <Form.Label>Vai trò</Form.Label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                value={{
                  label: accountDetail?.role.title || "Chưa có vai trò",
                }}
                onChange={() => {}}
              />
            </Form.Group>
          </div>
          <div className="w-50 text-center" ref={avatarRef}>
            <Image
              src={
                accountDetail?.avatar
                  ? accountDetail.avatar + ""
                  : "/image/no-image.png"
              }
              width={200}
              height={200}
              alt="avatar"
              priority={true}
              style={{ objectFit: "contain", cursor: "pointer" }}
            />
            <div className="mt-1">Ảnh đại diện</div>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default withBase(Page);
