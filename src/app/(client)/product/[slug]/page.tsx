"use client";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Rating from "@/components/Rating/Rating";
import Wishlist from "@/components/Wishlist/Wishlist";
import { getCookie } from "@/helpers/cookie";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import {
  changeVariant,
  clearSelectedVariant,
  previewVariants,
} from "@/lib/features/productDetail/productDetailSlice";
import { fetchProductDetail } from "@/lib/features/productDetail/productDetailThunk";
import { createCart } from "@/lib/features/user/userThunk";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Swal from "sweetalert2";

interface IProps extends IWithBaseProps {
  params: { slug: string };
}

const Page = (props: IProps) => {
  const { params, dispatch, router } = props;
  const [quantity, setQuantity] = useState<number>(1);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const productDetail = useAppSelector((state) => state.productDetail.data);
  const selectedVariant = useAppSelector(
    (state) => state.productDetail.selectedVariant
  );
  const previewVariant = useAppSelector(
    (state) => state.productDetail.previewVariant
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

  const thumbnailRef = useRef<HTMLDivElement | null>(null);
  const viewerInstanceRef = useRef<Viewer | null>(null);

  useEffect(() => {
    let Viewer;
    import("viewerjs").then((module) => {
      Viewer = module.default;

      if (thumbnailRef.current) {
        viewerInstanceRef.current = new Viewer(thumbnailRef.current, {
          // Thêm các tùy chọn cho ảnh đơn nếu cần
        });
      }
    });

    return () => {
      if (viewerInstanceRef.current) viewerInstanceRef.current.destroy();
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
    await dispatch(
      previewVariants({ index: previewVariant.index, ...variant })
    );
    setIsExistVariant(false);
  };

  const handlePreviewImage = (index: number, image: string) => {
    dispatch(
      previewVariants({
        ...previewVariant,
        name: selectedVariant,
        index,
        thumbnail: image,
      })
    );
  };

  const handleAddToCart = async (selected: boolean) => {
    const { price, discountedPrice } = previewVariant;
    const { _id, slug, title, thumbnail } = productDetail;
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
          price,
          discountedPrice,
          quantity,
          variant: selectedVariant,
          selected,
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

  const handleBuyNow = (selected: boolean) => {
    handleAddToCart(selected);
    router.push("/cart");
  };

  return (
    <div className="bg-body-secondary pb-5">
      <Breadcrumb title={productDetail.category.title} href={`/shop`} />
      <Container>
        <Row className="bg-light py-4">
          <Col xs={6}>
            <div className="d-flex gap-3">
              <div
                className="d-flex flex-column gap-3 overflow-y-scroll px-3"
                style={{ maxHeight: "450px" }}>
                {(productDetail.images as string[]).map(
                  (image: string, index: number) => (
                    <div
                      className={`gallery-image ${
                        previewVariant.index === index ? "active" : ""
                      }`}
                      onClick={() => handlePreviewImage(index, image)}
                      key={index}>
                      <Image
                        src={image + "" || "/image/no-image.png"}
                        width={100}
                        height={100}
                        alt="thumbnail"
                        priority={true}
                      />
                    </div>
                  )
                )}
              </div>
              <div style={{ cursor: "zoom-in" }} ref={thumbnailRef}>
                <Image
                  src={
                    previewVariant.thumbnail ||
                    productDetail.thumbnail + "" ||
                    "/image/no-image.png"
                  }
                  width={450}
                  height={450}
                  alt="thumbnail"
                  priority={true}
                />
              </div>
            </div>
          </Col>
          <Col xs={6}>
            <Wishlist />
            <div>{productDetail.title}</div>
            <div>
              Giá gốc:{priceFormat(previewVariant.price || productDetail.price)}
            </div>
            <div>
              Giảm giá:-{previewVariant.discount || productDetail.discount}%
            </div>
            <div>
              Thành tiền:
              {priceFormat(
                previewVariant.discountedPrice || productDetail.discountedPrice
              )}
            </div>
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
            <Button
              variant="outline-danger"
              onClick={() => handleAddToCart(false)}>
              Thêm vào giỏ hàng
            </Button>
            <Button variant="outline-danger" onClick={() => handleBuyNow(true)}>
              Mua ngay
            </Button>
          </Col>
        </Row>
      </Container>
      <Rating />
    </div>
  );
};

export default withBase(Page);
