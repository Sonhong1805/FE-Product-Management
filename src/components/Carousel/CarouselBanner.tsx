import Image from "next/image";
import Link from "next/link";
import { Carousel } from "react-bootstrap";
import React, { memo, useState } from "react";

const CarouselBanner = () => {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };
  return (
    <Carousel
      data-bs-theme="dark"
      activeIndex={index}
      onSelect={handleSelect}
      className="h-100"
      style={{ background: "aliceblue" }}>
      <Carousel.Item>
        <div
          className="d-flex justify-content-between align-items-center h-100"
          style={{ paddingInline: "130px" }}>
          <div>
            <h3 style={{ width: "239px" }} className="mb-2">
              Mua sắm dễ dàng - Ưu đãi ngập tràn!
            </h3>
            <div style={{ width: "239px" }} className="mb-3">
              Tiện lợi khi mua sắm và các chương trình giảm giá hấp dẫn
            </div>
            <Link href={"/shop"} className="d-block btn btn-danger w-50">
              Xem ngay
            </Link>
          </div>
          <figure
            className="position-relative flex-fill"
            style={{ width: "180px", height: "300px" }}>
            <Image
              src="/image/img-slider-01.png"
              alt="slider-01"
              priority
              fill
              sizes="(max-width: 79rem) 100vw, 79rem"
              className="position-absolute"
              style={{ objectFit: "contain" }}
            />
          </figure>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div
          className="d-flex justify-content-between align-items-center h-100"
          style={{ paddingInline: "130px" }}>
          <div>
            <h3 style={{ width: "239px" }} className="mb-2">
              Hàng chất lượng, giá yêu thương!
            </h3>
            <div style={{ width: "239px" }} className="mb-3">
              Tạo niềm tin về chất lượng sản phẩm với mức giá hợp lý.
            </div>
            <Link href={"/shop"} className="d-block btn btn-danger w-50">
              Xem ngay
            </Link>
          </div>
          <figure
            className="position-relative flex-fill"
            style={{ width: "180px", height: "300px" }}>
            <Image
              src="/image/img-slider-02.png"
              alt="slider-02"
              priority
              fill
              sizes="(max-width: 79rem) 100vw, 79rem"
              className="position-absolute"
              style={{
                objectFit: "contain",
                transform: "translate(93px, 171px) scale(2.5)",
              }}
            />
          </figure>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div
          className="d-flex justify-content-between align-items-center h-100"
          style={{ paddingInline: "130px" }}>
          <div>
            <h3 style={{ width: "330px" }} className="mb-2">
              Khám phá xu hướng mới - Mua sắm ngay hôm nay!
            </h3>
            <div style={{ width: "239px" }} className="mb-3">
              Tìm kiếm những sản phẩm hiện đại, thời thượng.
            </div>
            <Link href={"/shop"} className="d-block btn btn-danger w-50">
              Xem ngay
            </Link>
          </div>
          <figure
            className="position-relative flex-fill"
            style={{ width: "180px", height: "300px" }}>
            <Image
              src="/image/img-slider-03.png"
              alt="slider-03"
              priority
              fill
              sizes="(max-width: 79rem) 100vw, 79rem"
              className="position-absolute"
              style={{ objectFit: "contain" }}
            />
          </figure>
        </div>
      </Carousel.Item>
    </Carousel>
  );
};

export default memo(CarouselBanner);
