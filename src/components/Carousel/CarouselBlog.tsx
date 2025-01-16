import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Carousel } from "react-bootstrap";

interface IProps {
  blogs: IBlog[];
}

const CarouselBlog = (props: IProps) => {
  const { blogs } = props;
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      data-bs-theme="dark"
      activeIndex={index}
      onSelect={handleSelect}
      indicators={false}
      interval={null}
      className="carousel-blog">
      <Carousel.Item>
        <div className="d-grid grid-5 gap-2">
          {blogs.slice(0, 5).map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog._id}
              className="blog__card"
              style={{ width: "234px" }}>
              <figure className="m-0">
                <Image
                  src={blog.thumbnail + "" || "/image/no-image.png"}
                  alt="thumbnail"
                  width={234}
                  height={132}
                  style={{ objectFit: "contain" }}
                />
              </figure>
              <div className="blog__card--title">
                <span>{blog.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="d-grid grid-5 gap-2">
          {blogs.slice(5, 10).map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog._id}
              className="blog__card"
              style={{ width: "234px" }}>
              <figure className="m-0">
                <Image
                  src={blog.thumbnail + "" || "/image/no-image.png"}
                  alt="thumbnail"
                  width={234}
                  height={132}
                  style={{ objectFit: "contain" }}
                />
              </figure>
              <div className="blog__card--title">
                <span>{blog.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </Carousel.Item>
    </Carousel>
  );
};

export default CarouselBlog;
