"use client";
import React from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-3">Đăng kí</h1>
      <Form className="w-50 m-auto" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <FloatingLabel label="Email address" className="mb-3">
            <Form.Control
              type="email"
              placeholder="name@example.com"
              {...register("email", { required: true })}
            />
          </FloatingLabel>
          {errors.email && (
            <span className="text-danger">This field is required</span>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Password" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
          </FloatingLabel>
          {errors.password && (
            <span className="text-danger">This field is required</span>
          )}
        </Form.Group>
        <Form.Group className="mb-3 text-center">
          <Button variant="primary " type="submit">
            Đăng kí
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Page;
