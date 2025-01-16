"use client";
import withBase from "@/hocs/withBase";
import ContactsService from "@/services/contacts";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { BiExit } from "react-icons/bi";
import Swal from "sweetalert2";

const Page = (props: IWithBaseProps) => {
  const { router, searchParams } = props;
  const [contactDetail, setContactDetail] = useState<IContact>();

  useEffect(() => {
    (async () => {
      const response = await ContactsService.detail(
        searchParams.get("id") + ""
      );
      if (response.success) {
        setContactDetail(response.data);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      answers: { value: string };
    };
    const answersValue = target.answers.value;
    const response = await ContactsService.accept(
      contactDetail?.email + "",
      answersValue
    );
    if (response) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: response?.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Chi tiết liên hệ</h2>
        <div className="d-flex gap-2">
          <Button
            variant="warning"
            className="center gap-2"
            aria-hidden="false"
            onClick={() => router.push("/admin/contacts")}>
            <BiExit size={20} /> <span>Trở về</span>
          </Button>
        </div>
      </div>
      <Form className="mb-5" onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between gap-4 pb-4">
          <Form.Group className="mb-3 flex-fill">
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Họ tên"
              readOnly
              value={contactDetail?.fullName || ""}
              onChange={() => {}}
            />
          </Form.Group>
          <Form.Group className="mb-3 flex-fill">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Địa chỉ email"
              readOnly
              value={contactDetail?.email || ""}
              onChange={() => {}}
            />
          </Form.Group>
          <Form.Group className="mb-3 flex-fill">
            <Form.Label>Chủ đề</Form.Label>
            <Form.Control
              type="text"
              placeholder="Chủ đề"
              readOnly
              value={contactDetail?.topic || ""}
              onChange={() => {}}
            />
          </Form.Group>
        </div>
        <Form.Group className="mb-3">
          <Form.Label>Nội dung</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows={5}
            placeholder="Nội dung"
            readOnly
            value={contactDetail?.content || ""}
            onChange={() => {}}
          />
        </Form.Group>
        <Form.Group className="mb-3 flex-fill">
          <Form.Label>Trả lời thắc mắc</Form.Label>
          <Form.Control
            as="textarea"
            type="text"
            placeholder="Nội dung"
            name="answers"
          />
        </Form.Group>
        <Form.Group className="mb-3 flex-fill">
          <Button variant="outline-primary" type="submit" className="w-25">
            Trả lời
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default withBase(Page);
