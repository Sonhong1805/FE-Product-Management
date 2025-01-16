import { convertQuantity } from "@/helpers/convertQuantity";
import priceFormat from "@/helpers/priceFormat";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { memo } from "react";
import { BsCart3, BsStarFill } from "react-icons/bs";

const ProductItem = ({ product }: { product: IProduct }) => {
  const router = useRouter();
  return (
    <div className="product">
      <div className="product__header">
        {product.label?.label ? (
          <div className="product__label">{product.label.label}</div>
        ) : (
          <div></div>
        )}
        {product.discount ? (
          <div className="product__discount">{product.discount}% off</div>
        ) : (
          <div></div>
        )}
      </div>
      <div
        className="product__image-container"
        onClick={() => router.push(`/product/${product.slug}`)}>
        <Image
          src={product.thumbnail + "" || "/image/no-image.png"}
          alt={product.title}
          width={223}
          height={223}
          priority
          style={{
            width: "223px",
            height: "223px",
            objectFit: "cover",
          }}
          className="product__image"
        />
        <div className="product__overlay">
          <BsCart3 size={30} cursor={"pointer"} className="text-light" />
        </div>
      </div>
      <div className="product__content">
        <Link
          href={"/product/" + product.slug}
          className="product__title"
          prefetch={true}>
          {product.title}
        </Link>
        <div className="product__pricing justify-content-between">
          {product.discount ? (
            <div className="product__price">{priceFormat(product.price)}</div>
          ) : (
            <div></div>
          )}
          <div className="product__discounted-price ">
            {priceFormat(product.discountedPrice)}
          </div>
        </div>
        <div className="product__details">
          <div className="product__ratings gap-2">
            <div className="product__ratings-count">
              ({product.ratings.length})
            </div>
            <div className="product__ratings-stars">
              {new Array(5).fill("").map((_, index) => (
                <BsStarFill color="#FFE31A" key={index} />
              ))}
            </div>
          </div>
          <div className="product__quantity">
            Đã bán: {convertQuantity(product.sold)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductItem);
