import { createRatings } from "@/lib/features/productDetail/productDetailThunk";
import { useAppSelector } from "@/lib/hooks";
import React, { useState } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsStarFill } from "react-icons/bs";
import RatingPagination from "./RatingPagination";
import Swal from "sweetalert2";
import withBase from "@/hocs/withBase";

const Rating = (props: IWithBaseProps) => {
  const { dispatch, pathname, router } = props;
  const pid = useAppSelector((state) => state.productDetail.data._id);
  const ratings = useAppSelector((state) => state.productDetail.data.ratings);
  const productDetail = useAppSelector((state) => state.productDetail.data);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRatingInputs>();
  const [selectedStar, setSelectedStar] = useState<number>(5);
  const [hoverStar, setHoverStar] = useState<number | null>(5);

  const onSubmit: SubmitHandler<IRatingInputs> = (data) => {
    data.star = selectedStar;
    if (!isAuthenticated) {
      Swal.fire({
        title: "Bạn chưa đăng nhập?",
        text: "Bạn cần đăng nhập để mua hàng",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Huỷ",
        confirmButtonText: "Đăng nhập",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login?rollback=" + pathname);
        }
      });
    } else {
      dispatch(createRatings({ pid, ...data }));
    }
  };

  return (
    <Container>
      <Row className="bg-light py-4">
        <h3>Đánh giá sản phẩm</h3>
      </Row>

      <Row className="bg-light py-2 ps-2 pe-3">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex align-items-center gap-3 mb-2">
            <span>
              Đánh giá của bạn <span className="text-danger">*</span>:{" "}
            </span>
            {[...Array(5)].map((_, index) => {
              const currentStar = index + 1;
              return (
                <div
                  key={currentStar}
                  className="d-flex align-items-center gap-2">
                  <label htmlFor={`rate${currentStar}`} className="">
                    <input
                      type="radio"
                      id={`rate${currentStar}`}
                      value={currentStar}
                      {...register("star", {
                        valueAsNumber: true,
                      })}
                      onChange={() => setSelectedStar(currentStar)}
                      hidden
                    />
                    <BsStarFill
                      cursor={"pointer"}
                      size={28}
                      color={
                        currentStar <= (hoverStar || selectedStar)
                          ? "#FFE31A"
                          : ""
                      }
                      onMouseEnter={() => setHoverStar(currentStar)}
                      onMouseLeave={() => setHoverStar(null)}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <span>
              Nhận xét của bạn <span className="text-danger">*</span>:{" "}
            </span>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập nội dung"
              {...register("content", { required: true })}
            />
            {errors.content && (
              <span className="text-danger">Vui lòng nhập nội dung</span>
            )}
          </Form.Group>
          <Button type="submit" variant="outline-danger">
            Gửi đi
          </Button>
        </Form>
      </Row>
      <Row className="bg-light py-2 ps-2 pe-3">
        <h4 className="mb-3">
          ({ratings.length}) đánh giá cho{" "}
          <em>&quot; {productDetail.title} &quot;</em>
        </h4>
        <RatingPagination itemsPerPage={4} items={ratings} />
      </Row>
    </Container>
  );
};

export default withBase(Rating);
