"use client";
import withBase from "@/hocs/withBase";
import ProductsService from "@/services/products";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { BiExit } from "react-icons/bi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { colourStyles } from "@/constants/colourStyles";
const animatedComponents = makeAnimated();
import "../style.scss";
import { FiEye } from "react-icons/fi";
import Viewer from "viewerjs";
import Link from "next/link";
import { AiOutlineTags } from "react-icons/ai";
import { TiEdit } from "react-icons/ti";

const Page = (props: IWithBaseProps) => {
  const { router, searchParams } = props;
  const [productDetail, setProductDetail] = useState<IProduct>();
  const thumbnailRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const viewerInstanceRef = useRef<Viewer | null>(null);

  useEffect(() => {
    let Viewer;
    import("viewerjs").then((module) => {
      Viewer = module.default;

      if (thumbnailRef.current) {
        viewerInstanceRef.current = new Viewer(thumbnailRef.current, {
          // Thêm các tùy Chưa có cho ảnh đơn nếu cần
        });
      }

      if (galleryRef.current) {
        viewerInstanceRef.current = new Viewer(galleryRef.current, {});
      }
    });

    return () => {
      if (viewerInstanceRef.current) viewerInstanceRef.current.destroy();
    };
  }, []);

  const openGallery = async (index: number) => {
    if (viewerInstanceRef.current) {
      viewerInstanceRef.current.destroy();
    }

    const { default: Viewer } = await import("viewerjs");
    viewerInstanceRef.current = new Viewer(
      galleryRef.current as HTMLDivElement,
      {
        initialViewIndex: index,
      }
    );

    viewerInstanceRef.current.show();
  };

  useEffect(() => {
    (async () => {
      const response = await ProductsService.detail(searchParams.get("slug"));
      if (response.success) {
        setProductDetail(response.data);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("slug")]);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Chi tiết sản phẩm</h2>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            className="center gap-2"
            aria-hidden="false"
            onClick={() =>
              router.push("/admin/products/create?slug=" + productDetail?.slug)
            }>
            <TiEdit size={20} /> <span>Chỉnh sửa</span>
          </Button>
          <Button
            variant="warning"
            className="center gap-2"
            aria-hidden="false"
            onClick={() => router.push("/admin/products")}>
            <BiExit size={20} /> <span>Trở về</span>
          </Button>
        </div>
      </div>
      <Form className="mb-5">
        <div className="d-flex gap-5">
          <div className="w-50">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                value={productDetail?.title || "Chưa có tên sản phẩm"}
                onChange={() => {}}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Mô tả ngắn sản phẩm (for SEO)</Form.Label>
              <Form.Control
                as="textarea"
                value={
                  productDetail?.description ||
                  "Chưa có mô tả ngắn cho sản phẩm"
                }
                onChange={() => {}}
                readOnly
              />
            </Form.Group>
            <div className="d-flex mb-3 gap-3 flex-wrap">
              <Form.Group
                className="flex-fill"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Danh mục</Form.Label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  placeholder={"-- Chưa có danh mục sản phẩm --"}
                  value={{
                    label:
                      productDetail?.category.title ||
                      "-- Chưa có danh mục sản phẩm --",
                  }}
                  onChange={() => {}}
                />
              </Form.Group>
              <Form.Group
                className="flex-fill"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Nhãn</Form.Label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  placeholder="-- Chưa có nhãn sản phẩm --"
                  value={
                    productDetail?.label || {
                      label: "-- Chưa có nhãn sản phẩm --",
                    }
                  }
                  onChange={() => {}}
                />
              </Form.Group>
            </div>
            <Form.Group
              className="flex-fill mb-3"
              controlId="exampleForm.ControlInput1">
              <Form.Label>Giá</Form.Label>
              <InputGroup>
                <Form.Control
                  value={productDetail?.price || "Chưa có giá sản phẩm"}
                  onChange={() => {}}
                  readOnly
                />
                <InputGroup.Text id="basic-addon2">VND</InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <div className="d-flex mb-3 gap-3 flex-wrap">
              <Form.Group
                className="flex-fill"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Phần trăm giảm giá</Form.Label>
                <InputGroup>
                  <Form.Control
                    value={
                      productDetail?.discount || "Chưa có phần trăm giảm giá"
                    }
                    onChange={() => {}}
                    readOnly
                  />
                  <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group
                className="flex-fill"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Số lượng</Form.Label>
                <Form.Control
                  value={productDetail?.quantity || "Chưa có số lượng"}
                  onChange={() => {}}
                  readOnly
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Màu sắc sản phẩm</Form.Label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                placeholder="-- Chưa có màu sắc cho sản phẩm --"
                value={productDetail?.colors}
                isMulti
                styles={colourStyles}
                onChange={() => {}}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Từ khoá phổ biến</Form.Label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                placeholder={"-- Chưa có tag cho sản phẩm --"}
                value={
                  productDetail?.tags || {
                    label: "-- Chưa có tag cho sản phẩm --",
                  }
                }
                isMulti
                onChange={() => {}}
              />
            </Form.Group>
          </div>
          <div className="w-50">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Slug sản phẩm</Form.Label>
              <Form.Control
                value={productDetail?.slug || "Chưa có slug của sản phẩm"}
                readOnly
                onChange={() => {}}
              />
            </Form.Group>
            <div ref={thumbnailRef} className="mb-3">
              <Image
                src={
                  productDetail?.thumbnail
                    ? productDetail.thumbnail + ""
                    : "/image/no-image.png"
                }
                width={257}
                height={257}
                alt="thumbnail"
                priority={true}
                style={{ objectFit: "contain", cursor: "pointer" }}
              />
            </div>
            <div>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1">
                <Form.Label>
                  Phân loại sản phẩm{" "}
                  <Link
                    className="text-secondary"
                    href={
                      "/admin/products/variants?slug=" + productDetail?.slug
                    }>
                    <AiOutlineTags />
                  </Link>
                </Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {productDetail && productDetail?.variants.length > 0 ? (
                    productDetail?.variants.map((variant: IVariant) => (
                      <div key={variant._id}>
                        <div className="variant-input"></div>
                        <div className="variant-label">{variant.name}</div>
                      </div>
                    ))
                  ) : (
                    <div>Chưa có phân loại sản phẩm</div>
                  )}
                </div>
              </Form.Group>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3 flex-wrap mb-3" ref={galleryRef}>
          {((productDetail?.images as string[]) || []).map(
            (image: string | File, index: number) => (
              <div className="gallery" key={index}>
                <div className="gallery-icons">
                  <FiEye
                    color="#FFFFFF"
                    size={24}
                    cursor={"pointer"}
                    onClick={() => openGallery(index)}
                  />
                </div>
                <Image
                  src={image as string}
                  width={200}
                  height={200}
                  priority={true}
                  style={{ objectFit: "contain" }}
                  alt="images"
                />
              </div>
            )
          )}
        </div>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Mô tả sản phẩm </Form.Label>
          <div
            dangerouslySetInnerHTML={{
              __html: productDetail?.descriptions || "",
            }}></div>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default withBase(Page);
