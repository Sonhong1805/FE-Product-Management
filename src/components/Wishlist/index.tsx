import withBase from "@/hocs/withBase";
import {
  addToWishlist,
  deleteWishlistItem,
} from "@/lib/features/user/userSlice";
import { useAppSelector } from "@/lib/hooks";
import WishlistService from "@/services/wishlist";
import React, { memo } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";

const Wishlist = (props: IWithBaseProps) => {
  const { dispatch, router } = props;
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
      style={{ minWidth: "32px" }}
      onClick={handleDeleteWishlist}
    />
  ) : (
    <BsHeart
      size={30}
      cursor={"pointer"}
      style={{ minWidth: "32px" }}
      onClick={handleAddToWishlist}
    />
  );
};

export default withBase(memo(Wishlist));
