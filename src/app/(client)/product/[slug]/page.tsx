"use client";
import Breadcrumb from "@/components/Breadcrumb";
import Rating from "@/components/Rating/Rating";
import Wishlist from "@/components/Wishlist";
import { convertQuantity } from "@/helpers/convertQuantity";
import { getCookie } from "@/helpers/cookie";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import { saveSelectedIds } from "@/lib/features/product/productSlice";
import {
  clearSelectedVariant,
  previewVariants,
} from "@/lib/features/productDetail/productDetailSlice";
import { fetchProductDetail } from "@/lib/features/productDetail/productDetailThunk";
import { createCart } from "@/lib/features/user/userThunk";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { BsStarFill } from "react-icons/bs";
import { FiMinus, FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";

interface IProps extends IWithBaseProps {
  params: { slug: string };
}

const Page = (props: IProps) => {
  const { params, dispatch, router, pathname } = props;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (quantity >= productDetail.quantity - productDetail.sold) {
      setQuantity(productDetail.quantity - productDetail.sold);
    }
  };

  const handleInputQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    }
    if (newQuantity >= productDetail.quantity - productDetail.sold) {
      setQuantity(productDetail.quantity - productDetail.sold);
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
        const stock = productDetail.quantity - productDetail.sold;
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
          stock,
          variant: selectedVariant,
          selected,
        };
        const response = await dispatch(createCart(data)).unwrap();
        if (response.success) {
          const selectedIdsProductInCart =
            response.data.products
              .filter((product: TProductInCart) => product.selected)
              .map((product: TProductInCart) => product._id) || [];
          await dispatch(saveSelectedIds(selectedIdsProductInCart));
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
      <Breadcrumb title={productDetail.category?.title} href={`/shop`} />
      <Container className="mt-3 mb-5">
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
            <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
              <h4>{productDetail.title}</h4>
              <Wishlist />
            </div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="">({productDetail.ratings.length})</div>
              <div className="d-flex gap-2">
                {new Array(5).fill("").map((_, index) => (
                  <BsStarFill color="#FFE31A" key={index} />
                ))}
              </div>
            </div>
            <div className="py-1 mb-2">
              {productDetail.quantity === 0 ? (
                <>Hết hàng</>
              ) : (
                <>
                  Còn:{" "}
                  {convertQuantity(productDetail.quantity - productDetail.sold)}{" "}
                  / {convertQuantity(productDetail.quantity)} sản phẩm
                </>
              )}
            </div>
            <div className="product-detail">
              {productDetail.discount > 0 && (
                <>
                  <span className="product-detail__price">
                    {priceFormat(previewVariant.price || productDetail.price)}
                  </span>
                  <span className="product-detail__discount">
                    (-{previewVariant.discount || productDetail.discount}%)
                  </span>
                </>
              )}
              <div className="product-detail__discounted-price">
                {priceFormat(
                  previewVariant.discountedPrice ||
                    productDetail.discountedPrice
                )}
              </div>
            </div>
            <div className="py-2">
              <div className="mb-2">
                <span className="me-2">Phân loại: </span>
                <span className={`${isExistVariant && "p-3"}`}>
                  {selectedVariant && <strong>{selectedVariant}</strong>}
                </span>
              </div>
              <div
                className={`d-flex flex-wrap gap-2 p-2 ${
                  isExistVariant && "bg-danger-subtle"
                } mb-2`}>
                {productDetail.variants.length > 0 &&
                  productDetail.variants.map((variant: IVariant) => (
                    <div key={variant._id}>
                      <input
                        type={"radio"}
                        id={variant._id}
                        name="variant"
                        hidden
                        className="variant-input"
                        onChange={() => handleVariant(variant)}
                      />
                      <label htmlFor={variant._id} className="variant-label">
                        {variant.name}
                      </label>
                    </div>
                  ))}
              </div>
              {isExistVariant && (
                <div className="text-danger">Vui lòng chọn Phân loại hàng</div>
              )}
            </div>
            <div className="w-25">
              <InputGroup className="mb-3">
                <Button
                  variant="secondary"
                  id="button-addon1"
                  disabled={productDetail.quantity === 0}
                  onClick={handleDecreaseQuantity}>
                  <FiMinus />
                </Button>
                <Form.Control
                  aria-label="Example text with button addon"
                  aria-describedby="basic-addon1"
                  className="text-center"
                  min={1}
                  max={productDetail.quantity}
                  value={productDetail.quantity === 0 ? 0 : quantity}
                  disabled={productDetail.quantity === 0}
                  onChange={handleInputQuantity}
                />
                <Button
                  variant="secondary"
                  id="button-addon2"
                  disabled={productDetail.quantity === 0}
                  onClick={handleIncreaseQuantity}>
                  <FiPlus />
                </Button>
              </InputGroup>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-danger"
                disabled={productDetail.quantity === 0}
                onClick={() => handleAddToCart(false)}>
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="danger"
                disabled={productDetail.quantity === 0}
                onClick={() => handleBuyNow(true)}>
                Mua ngay
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Container className="mb-3 bg-light">
        <div className="py-4">
          <h3 className="mb-2">Mô tả sản phẩm</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: productDetail.descriptions,
            }}></div>
        </div>
      </Container>
      <Rating />
    </div>
  );
};

export default withBase(Page);
