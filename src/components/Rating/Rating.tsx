"use client";
import { ratingsDescription } from "@/constants/ratings";
import { deleteRatingsItem } from "@/lib/features/productDetail/productDetailSlice";
import { createRatings } from "@/lib/features/productDetail/productDetailThunk";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import RatingsService from "@/services/ratings";
import moment from "moment";
import React from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";

const Rating = () => {
  const dispatch = useAppDispatch();
  const pid = useAppSelector((state) => state.productDetail.data._id);
  const ratings = useAppSelector((state) => state.productDetail.data.ratings);
  const currentEmail = useAppSelector((state) => state.user.userInfo.email);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRatingInputs>();
  const onSubmit: SubmitHandler<IRatingInputs> = async (data) => {
    const { star, content } = data;
    await dispatch(createRatings({ pid, star: +star, content }));
  };

  const handleDeleteRating = async(id: string) => {
    const response = await RatingsService.delete(pid,id);
    if( response.success){
      await dispatch(deleteRatingsItem(id));
    }
  };
  return (
    <Container>
      <Row className="bg-light py-2 ps-2 pe-3">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            {ratingsDescription.map((rating) => (
              <Form.Check
                key={rating.value}
                type={"radio"}
                value={+rating.value}
                id={rating.label}
                label={rating.label}
                {...register("star", {
                  valueAsNumber: true,
                })}
              />
            ))}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập nội dung"
              {...register("content")}
            />
          </Form.Group>
          <Button type="submit">Gửi đánh giá</Button>
        </Form>
      </Row>
      <Row className="bg-light py-2 ps-2 pe-3">
        {ratings.map((rating: IRating) => (
          <div key={rating._id}>
            <div className="d-flex justify-content-between">
              <span>
                {rating.email}: {rating.star}sao -{" "}
                {moment(rating.createdAt).format("DD/MM/YYYY")}
              </span>
              {currentEmail === rating.email && (
                <Button onClick={() => handleDeleteRating(rating._id)}>
                  Xoá
                </Button>
              )}
            </div>
            <div>{rating.content}</div>
          </div>
        ))}
      </Row>
    </Container>
  );
};

export default Rating;
