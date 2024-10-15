"use client";
import {
  addToWishlist,
  deleteWishlistItem,
} from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import WishlistService from "@/services/wishlist";
import { useRouter } from "next/navigation";
import React from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const productDetail = useAppSelector((state) => state.productDetail.data);
  const wishlist = useAppSelector((state) => state.user.userInfo.wishlist);

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const { slug, title, thumbnail, price, discount, discountedPrice } =
      productDetail;
    const response = await WishlistService.create({
      slug,
      title,
      thumbnail,
      price,
      discount,
      discountedPrice,
    });
    if (response.success && response.data) {
      await dispatch(addToWishlist(response.data));
    }
  };

  const handleDeleteWishlist = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const id = wishlist.find((product) => product.slug === productDetail.slug)
      ?._id as string;
    const response = await WishlistService.delete(id);
    if (response.success) {
      await dispatch(deleteWishlistItem(id));
    }
  };

  return wishlist.some((product) => product.slug === productDetail.slug) ? (
    <BsHeartFill
      size={30}
      cursor={"pointer"}
      className="text-danger"
      onClick={handleDeleteWishlist}
    />
  ) : (
    <BsHeart size={30} cursor={"pointer"} onClick={handleAddToWishlist} />
  );
};

export default Wishlist;
