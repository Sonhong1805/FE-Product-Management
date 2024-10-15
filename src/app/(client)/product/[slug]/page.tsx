"use client";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Rating from "@/components/Rating/Rating";
import Wishlist from "@/components/Wishlist/Wishlist";
import { getCookie } from "@/helpers/cookie";
import priceFormat from "@/helpers/priceFormat";
import {
  changeVariant,
  clearSelectedVariant,
} from "@/lib/features/productDetail/productDetailSlice";
import { fetchProductDetail } from "@/lib/features/productDetail/productDetailThunk";
import { createCart } from "@/lib/features/user/userThunk";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Swal from "sweetalert2";

const Page = ({ params }: { params: { slug: string } }) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number>(1);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const productDetail = useAppSelector((state) => state.productDetail.data);
  const selectedVariant = useAppSelector(
    (state) => state.productDetail.selectedVariant
  );

  const [isExistVariant, setIsExistVariant] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await dispatch(fetchProductDetail(params.slug));
    })();
    return () => {
      dispatch(clearSelectedVariant());
    };
  }, []);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleInputQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleVariant = async (variant: IVariant) => {
    await dispatch(changeVariant(variant));
    setIsExistVariant(false);
  };

  const handleAddToCart = async () => {
    const { _id, slug, title, thumbnail, discountedPrice } = productDetail;
    const cartId = getCookie("cartId");
    if (productDetail.variants.length > 0 && !selectedVariant) {
      setIsExistVariant(true);
    } else {
      if (!isAuthenticated) {
        alert("Vui lòng đăng nhập");
      } else {
        const data = {
          _id,
          cartId,
          productId: _id,
          title,
          slug,
          thumbnail,
          discountedPrice,
          quantity,
          variant: selectedVariant,
          selected: false,
        };
        const response = await dispatch(createCart(data)).unwrap();
        if (response.success) {
          Swal.fire({
            icon: response?.success ? "success" : "error",
            title: response?.message,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    }
  };

  return (
    <div className="bg-body-secondary">
      <Breadcrumb title={productDetail.category.title} href={`/shop`} />
      <Container>
        <Row className="bg-light py-2 ps-2 pe-3">
          <Col xs={6}>
            <Image
              src={productDetail.thumbnail + "" || "/image/no-image.png"}
              width={200}
              height={200}
              alt="thumbnail"
              priority={true}
            />
          </Col>
          <Col xs={6}>
            <Wishlist />
            <div>{productDetail.title}</div>
            <div>Giá gốc:{priceFormat(productDetail.price)}</div>
            <div>Giảm giá:-{productDetail.discount}%</div>
            <div>Thành tiền:{priceFormat(productDetail.discountedPrice)}</div>
            <div className="d-flex flex-wrap gap-2">
              <strong>{selectedVariant}</strong>
              {productDetail.variants.length > 0 &&
                productDetail.variants.map((variant: IVariant) => (
                  <div key={variant._id}>
                    <Form.Check
                      type={"radio"}
                      id={variant._id}
                      name="variant"
                      label={variant.name}
                      onChange={() => handleVariant(variant)}
                    />
                  </div>
                ))}
              {isExistVariant && <span>Vui lòng chọn Phân loại hàng</span>}
            </div>
            <div>
              <InputGroup className="mb-3">
                <Button
                  variant="outline-secondary"
                  id="button-addon1"
                  onClick={handleDecreaseQuantity}>
                  -
                </Button>
                <Form.Control
                  aria-label="Example text with button addon"
                  aria-describedby="basic-addon1"
                  className="w-25"
                  min={1}
                  value={quantity}
                  onChange={handleInputQuantity}
                />
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  onClick={handleIncreaseQuantity}>
                  +
                </Button>
              </InputGroup>
            </div>
            <Button variant="outline-danger" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </Button>
          </Col>
        </Row>
        <Rating />
      </Container>
    </div>
  );
};

export default Page;
