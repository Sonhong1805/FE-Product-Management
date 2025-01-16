import React, { memo, useState } from "react";
import { Carousel } from "react-bootstrap";
import ProductItem from "../Product/ProductItem";

interface IProps {
  products: IProduct[];
}

const CarouselProduct = (props: IProps) => {
  const { products } = props;
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      className="carousel-product"
      data-bs-theme="dark"
      activeIndex={index}
      onSelect={handleSelect}
      indicators={false}
      interval={null}>
      <Carousel.Item>
        <div className="product-container grid grid-5 bg-white">
          {products?.slice(0, 5)?.map((product: IProduct) => (
            <ProductItem product={product} key={product._id} />
          ))}
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="product-container grid grid-5 bg-white">
          {products?.slice(5, 10)?.map((product: IProduct) => (
            <ProductItem product={product} key={product._id} />
          ))}
        </div>
      </Carousel.Item>
    </Carousel>
  );
};

export default memo(CarouselProduct);
