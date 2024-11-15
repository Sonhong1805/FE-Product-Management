"use client";
import { getCookie } from "@/helpers/cookie";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import {
  changeVariant,
  clearSelectedVariant,
  previewVariants,
} from "@/lib/features/productDetail/productDetailSlice";
import { fetchProductDetail } from "@/lib/features/productDetail/productDetailThunk";
import { deleteWishlistItem } from "@/lib/features/user/userSlice";
import { createCart } from "@/lib/features/user/userThunk";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import WishlistService from "@/services/wishlist";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { BsCart3 } from "react-icons/bs";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { TfiTrash } from "react-icons/tfi";
import Modal from "react-modal";
import Swal from "sweetalert2";

const Page = (props: IWithBaseProps) => {
  const { dispatch, pathname, router } = props;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const wishlist = useAppSelector((state) => state.user.userInfo.wishlist);
  const productDetail = useAppSelector((state) => state.productDetail.data);
  const [isExistVariant, setIsExistVariant] = useState<boolean>(false);
  const selectedVariant = useAppSelector(
    (state) => state.productDetail.selectedVariant
  );
  const previewVariant = useAppSelector(
    (state) => state.productDetail.previewVariant
  );
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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

  const handleShowProductDetail = async (slug: string) => {
    await dispatch(clearSelectedVariant());
    await dispatch(fetchProductDetail(slug));
    openModal();
  };

  const handleDeleteWishlist = async (slug: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    Swal.fire({
      text: "Bạn có chắc muốn bỏ yêu thích sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Bỏ yêu thích",
      cancelButtonText: "Huỷ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const id = wishlist.find((product) => product.slug === slug)
          ?._id as string;
        const response = await WishlistService.delete(id);
        if (response.success) {
          await dispatch(deleteWishlistItem(id));
          Swal.fire({
            icon: "success",
            title: response?.message,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };

  return (
    <div className="bg-body-secondary">
      <div className="py-4" style={{ minHeight: "200px" }}>
        <Container>
          <h4 className="py-3">Danh sách yêu thích</h4>
          {wishlist.length ? (
            wishlist.map((product: TWishlist) => (
              <div
                className="d-flex justify-content-between align-items-center bg-light p-3 border-bottom gap-3"
                key={product._id}>
                <div className="d-flex flex-fill gap-3">
                  <Image
                    src={product.thumbnail + "" || "/image/no-image.png"}
                    width={100}
                    height={100}
                    alt="thumbnail"
                    priority={true}
                  />
                  <Link
                    href={`product/` + product.slug}
                    className="link-underline-light text-dark link-hover-danger"
                    style={{
                      maxWidth: "800px",
                      fontSize: "24px",
                      lineHeight: "33px",
                    }}>
                    {product.title}
                  </Link>
                </div>
                <div
                  className="product-detail text-end border-start border-2"
                  style={{ minWidth: "170px" }}>
                  <span className="product-detail__price">
                    {priceFormat(product.price || product.price)}
                  </span>
                  <span className="product-detail__discount">
                    (-{product.discount || product.discount}%)
                  </span>
                  <div className="product-detail__discounted-price">
                    {priceFormat(
                      product.discountedPrice || product.discountedPrice
                    )}
                  </div>
                </div>
                <div
                  className="d-flex gap-2 px-3"
                  style={{ maxWidth: "935px" }}>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteWishlist(product.slug)}>
                    <TfiTrash size={24} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleShowProductDetail(product.slug)}>
                    <BsCart3 size={24} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-danger text-center">
              Chưa có sản phẩm yêu thích nào
            </div>
          )}
          <Modal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            onRequestClose={closeModal}
            className={"modal-style"}
            contentLabel="Example Modal">
            <div className="d-flex justify-content-end align-items-center mb-3">
              <IoMdClose size={25} cursor={"pointer"} onClick={closeModal} />
            </div>
            <div className="d-flex justify-content-between gap-5">
              <div>
                <Image
                  src={
                    previewVariant.thumbnail ||
                    productDetail.thumbnail + "" ||
                    "/image/no-image.png"
                  }
                  width={400}
                  height={400}
                  alt="thumbnail"
                  priority={true}
                />
              </div>
              <div style={{ maxWidth: "500px" }}>
                <h4 className="mb-2">{productDetail.title}</h4>
                <div className="product-detail">
                  <span className="product-detail__price">
                    {priceFormat(previewVariant.price || productDetail.price)}
                  </span>
                  <span className="product-detail__discount">
                    (-{previewVariant.discount || productDetail.discount}%)
                  </span>
                  <div className="product-detail__discounted-price">
                    {priceFormat(
                      previewVariant.discountedPrice ||
                        productDetail.discountedPrice
                    )}
                  </div>
                </div>
                <div
                  className={`mb-3  ${
                    isExistVariant ? "bg-danger-subtle p-3" : ""
                  }`}>
                  {selectedVariant && (
                    <div className="py-2">
                      <strong>{selectedVariant}</strong>
                    </div>
                  )}
                  <div className="d-flex flex-wrap gap-2">
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
                          <label
                            htmlFor={variant._id}
                            className="variant-label">
                            {variant.name}
                          </label>
                        </div>
                      ))}
                    {isExistVariant && (
                      <div className="text-danger">
                        Vui lòng chọn Phân loại hàng
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-50">
                  <InputGroup className="mb-3">
                    <Button
                      variant="danger"
                      id="button-addon1"
                      onClick={handleDecreaseQuantity}>
                      <FiMinus />
                    </Button>
                    <Form.Control
                      aria-label="Example text with button addon"
                      aria-describedby="basic-addon1"
                      className="text-center"
                      min={1}
                      max={productDetail.quantity}
                      value={quantity}
                      onChange={handleInputQuantity}
                    />
                    <Button
                      variant="primary"
                      id="button-addon2"
                      onClick={handleIncreaseQuantity}>
                      <FiPlus />
                    </Button>
                  </InputGroup>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-danger"
                    onClick={() => handleAddToCart(false)}>
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleBuyNow(true)}>
                    Mua ngay
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default withBase(Page);
