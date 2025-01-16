"use client";
import Breadcrumb from "@/components/Breadcrumb";
import ContactsService from "@/services/contacts";
import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Page = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IContact>();
  const onSubmit: SubmitHandler<IContact> = async (data) => {
    const response = await ContactsService.create(data);
    if (response.success) {
      Swal.fire({
        icon: "success",
        title: response?.message,
        showConfirmButton: false,
        timer: 2000,
      });
      reset();
    }
  };
  return (
    <>
      <Breadcrumb title="Liên hệ" href="/contact" />
      <div className="bg-white">
        <Container>
          <h2 className="py-3">Liên hệ</h2>
        </Container>
      </div>
      <div className="bg-body-secondary pb-5 pt-3">
        <Container className="bg-white p-3">
          <div className="d-flex justify-content-between">
            <div>
              <h4 className="pb-3">Thông tin liên hệ</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  Họ tên: <strong>Nguyễn Hồng Sơn</strong>
                </li>
                <li className="list-group-item">
                  Hotline: <strong>(+84) 327-842-451</strong>
                </li>
                <li className="list-group-item">
                  Email: <strong>nguyenhongson18052003@gmail.com</strong>
                </li>
                <li className="list-group-item">
                  Địa chỉ 1:{" "}
                  <strong>
                    435 Trần Quốc Tảng, Cẩm Thịnh, Cẩm Phả, Quảng Ninh
                  </strong>
                </li>
                <li className="list-group-item">
                  Địa chỉ 2:{" "}
                  <strong>
                    173 P. Định Công, Phương Liệt, Thanh Xuân, Hà Nội
                  </strong>
                </li>
                <li className="list-group-item">
                  Facebook:{" "}
                  <strong>
                    https://www.facebook.com/hong.son.143284/about
                  </strong>
                </li>
                <li className="list-group-item">
                  Github: <strong>https://github.com/Sonhong1805</strong>
                </li>
              </ul>
            </div>
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.602025600248!2d107.3403277749153!3d21.008584280635663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314b0106030f9f41%3A0x7ea2a41a59df7766!2zNDM1IFRy4bqnbiBRdeG7kWMgVOG6o25nLCBD4bqpbSBUaOG7i25oLCBD4bqpbSBQaOG6oywgUXXhuqNuZyBOaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1735021216209!5m2!1svi!2s"
                width="600"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
          <div className="pt-5">
            <h4 className="pb-3">Đặt câu hỏi nếu thắc mắc ?</h4>
            <Form className="m-auto" onSubmit={handleSubmit(onSubmit)}>
              <div className="d-flex justify-content-between gap-4 pb-4">
                <Form.Group className="mb-3 flex-fill">
                  <Form.Label>
                    Họ tên <span className="text-danger">(*)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập họ tên"
                    {...register("fullName", { required: true })}
                  />
                  {errors.fullName && (
                    <span className="text-danger">Vui lòng nhập họ tên</span>
                  )}
                </Form.Group>
                <Form.Group className="mb-3 flex-fill">
                  <Form.Label>
                    Email <span className="text-danger">(*)</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <span className="text-danger">
                      Vui lòng nhập địa chỉ email
                    </span>
                  )}
                </Form.Group>
                <Form.Group className="mb-3 flex-fill">
                  <Form.Label>
                    Chủ đề <span className="text-danger">(*)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập chủ đề"
                    {...register("topic", { required: true })}
                  />
                  {errors.topic && (
                    <span className="text-danger">Vui lòng nhập chủ đề</span>
                  )}
                </Form.Group>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>
                  Nội dung <span className="text-danger">(*)</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  rows={5}
                  placeholder="Nhập nội dung"
                  {...register("content", { required: true })}
                />
                {errors.content && (
                  <span className="text-danger">Vui lòng nhập nội dung</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3 text-center w-100">
                <Button variant="danger" className="w-25" type="submit">
                  Gửi liên hệ
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Page;
