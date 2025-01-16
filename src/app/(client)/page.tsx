"use client";
import CarouselBanner from "@/components/Carousel/CarouselBanner";
import CarouselBlog from "@/components/Carousel/CarouselBlog";
import CarouselProduct from "@/components/Carousel/CarouselProduct";
import Loading from "@/components/Loading";
import withBase from "@/hocs/withBase";
import { handleTags, resetQueries } from "@/lib/features/product/productSlice";
import { useAppSelector } from "@/lib/hooks";
import { tagsOptions } from "@/options/tags";
import BlogsService from "@/services/blogs";
import ProductsService from "@/services/products";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Marquee from "react-fast-marquee";

const Home = (props: IWithBaseProps) => {
  const { dispatch, router } = props;

  const categories = useAppSelector((state) => state.categories.data);
  const [electronics, setElectronics] = useState<IProduct[]>([]);
  const [fashion, setFashion] = useState<IProduct[]>([]);
  const [furniture, setFurniture] = useState<IProduct[]>([]);
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [
        responseElectronics,
        responseFashion,
        responseFurniture,
        responseBlogs,
      ] = await Promise.all([
        ProductsService.index({
          limit: 10,
          status: true,
          tags: ["ELECTRONICS"],
        }),
        ProductsService.index({
          limit: 10,
          status: true,
          tags: ["FASHION"],
        }),
        ProductsService.index({
          limit: 10,
          status: true,
          tags: ["FURNITURE"],
        }),
        BlogsService.index({
          limit: 10,
          status: true,
        }),
      ]);
      if (responseElectronics.success) {
        setElectronics(responseElectronics.data as IProduct[]);
      }
      if (responseFashion.success) {
        setFashion(responseFashion.data as IProduct[]);
      }
      if (responseFurniture.success) {
        setFurniture(responseFurniture.data as IProduct[]);
      }
      if (responseBlogs.success) {
        setBlogs(responseBlogs.data as IBlog[]);
      }
      setLoading(false);
    })();
  }, []);

  const handleClickTag = (tag: string) => {
    dispatch(resetQueries());
    dispatch(handleTags(tag));
    router.push("/shop?page=1&tags=" + tag);
  };
  return (
    <div className="bg-body-secondary pb-5">
      {loading && <Loading />}
      <Container>
        <Row>
          <Col xs={3}></Col>
          <Col xs={9} style={{ height: "401px", padding: "0" }}>
            <CarouselBanner />
          </Col>
        </Row>
        <Row>
          <Col xs={6} style={{ padding: "0" }}>
            <Image
              src="/image/banner-home-01.jpg"
              alt="banner-home-01"
              priority
              width={660}
              height={200}
              style={{ objectFit: "cover" }}
            />
          </Col>
          <Col xs={6} style={{ padding: "0" }}>
            <Image
              src="/image/banner-home-02.jpg"
              alt="banner-home-0"
              priority
              width={660}
              height={200}
              style={{ objectFit: "cover" }}
            />
          </Col>
        </Row>
        <Row className="bg-white p-3 mt-3">
          <h3>Danh mục nổi bật</h3>
          <div className="mt-3">
            <Marquee pauseOnHover={true}>
              {categories.map((category) => (
                <Link
                  href={"/shop/" + category.slug}
                  key={category._id}
                  className="link-custom">
                  {category.title.toUpperCase()}
                </Link>
              ))}
            </Marquee>
          </div>
        </Row>
        <Row className="bg-white p-3 mt-3">
          <h3>Thiết bị công nghệ hàng đầu</h3>
          <div className="mt-3">
            <CarouselProduct products={electronics} />
          </div>
        </Row>
        <Row className="bg-white p-3 mt-3">
          <h3>Từ khoá phổ biến</h3>
          <div className="d-flex gap-1 flex-wrap mt-3">
            {tagsOptions.map((tag) => (
              <div
                key={tag.value}
                onClick={() => handleClickTag(tag.value)}
                className="link-custom border">
                {tag.label.toUpperCase()}
              </div>
            ))}
          </div>
        </Row>
        <Row className="bg-white p-3 mt-3">
          <h3>Quần áo thời trang</h3>
          <div className="mt-3">
            <CarouselProduct products={fashion} />
          </div>
        </Row>
        <Row className="bg-white p-3 mt-3">
          <h3>Đồ nội thất hiện đại</h3>
          <div className="mt-3">
            <CarouselProduct products={furniture} />
          </div>
        </Row>
        <Row className="bg-white p-3 mt-3">
          <h3>Bài viết mới</h3>
          <div className="mt-3">
            <CarouselBlog blogs={blogs} />
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default withBase(Home);
