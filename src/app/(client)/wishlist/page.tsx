"use client";
import { getCookie } from "@/helpers/cookie";
import {
  changeVariant,
  clearSelectedVariant,
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
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import Swal from "sweetalert2";

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const wishlist = useAppSelector((state) => state.user.userInfo.wishlist);
  const productDetail = useAppSelector((state) => state.productDetail.data);
  const [isExistVariant, setIsExistVariant] = useState<boolean>(false);
  const selectedVariant = useAppSelector(
    (state) => state.productDetail.selectedVariant
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
    <Container>
      {wishlist.map((product: TWishlist) => (
        <div
          className="d-flex justify-content-between align-items-center"
          key={product._id}>
          <Image
            src={product.thumbnail + "" || "/image/no-image.png"}
            width={200}
            height={200}
            alt="thumbnail"
            priority={true}
          />
          <Link href={`product/` + product.slug}>{product.title}</Link>
          <div>{product.discountedPrice}</div>
          <div>
            <Button onClick={() => handleDeleteWishlist(product.slug)}>
              Xoá
            </Button>
            <Button onClick={() => handleShowProductDetail(product.slug)}>
              Giỏ hàng
            </Button>
          </div>
        </div>
      ))}

      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onRequestClose={closeModal}
        className={"modal-style"}
        contentLabel="Example Modal">
        <div className="d-flex justify-content-end align-items-center mb-3">
          <IoMdClose size={25} cursor={"pointer"} onClick={closeModal} />
        </div>
        <div className="d-flex justify-content-between align-items-center gap-5">
          <div>
            <Image
              src={productDetail.thumbnail + "" || "/image/no-image.png"}
              width={200}
              height={200}
              alt="thumbnail"
              priority={true}
            />
          </div>
          <div>
            <div style={{ maxWidth: "300px" }}>{productDetail.title}</div>
            <div>Giá gốc:{productDetail.price}</div>
            <div>Giảm giá:{productDetail.discount}-%</div>
            <div>Thành tiền:{productDetail.discountedPrice}</div>
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
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default Page;
