"use client";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import useDebounce from "@/hooks/useDebounce";
import {
  handlePagination,
  handleQueries,
} from "@/lib/features/product/productSlice";
import { useAppSelector } from "@/lib/hooks";
import ProductsService from "@/services/products";
import Image from "next/image";
import Link from "next/link";
import React, { memo, useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";
import { BsSearch, BsXCircleFill } from "react-icons/bs";

const SearchKeywords = (props: IWithBaseProps) => {
  const { dispatch } = props;
  const queries = useAppSelector((state) => state.products.queries);
  const [keywords, setKeywords] = useState<string>("");
  const [productsSuggest, setProductsSuggest] = useState<IProduct[]>([]);
  const pagination = useAppSelector((state) => state.products.pagination);
  const [isFocus, setIsFocus] = useState(false);
  const firstRender = useRef(true);
  const [isHovering, setIsHovering] = useState(false);

  const keywordsDebounce = useDebounce(keywords, 500);

  useEffect(() => {
    if (queries.keywords) {
      setKeywords(queries.keywords);
    } else {
      setKeywords("");
    }
  }, [queries.keywords]);

  const handleFilterKeywords = () => {
    dispatch(handlePagination({ ...pagination, page: 1 }));
    dispatch(handleQueries({ keywords }));
    setIsFocus(false);
  };

  useEffect(() => {
    (async () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      if (isFocus) {
        const response = await ProductsService.index({
          title: keywordsDebounce || queries.keywords,
        });
        if (response.success) {
          setProductsSuggest(response.data || []);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordsDebounce, isFocus]);

  const handleResetKeywords = (event: React.MouseEvent) => {
    event.stopPropagation();
    setKeywords("");
    setProductsSuggest([]);
    setIsFocus(false);
  };

  return (
    <div className="search-group pe-5 w-50">
      <InputGroup className="d-flex">
        <div className="position-relative flex-fill">
          <Form.Control
            className="search-keyword"
            placeholder="Tìm kiếm sản phẩm tại đây"
            aria-label="Tìm kiếm sản phẩm tại đây"
            aria-describedby="basic-addon2"
            value={keywords}
            name="keywords"
            onChange={(e) => setKeywords(e.target.value)}
            onBlur={() => {
              if (!isHovering) setIsFocus(false);
            }}
            onFocus={() => setIsFocus(true)}
          />
          {isFocus && keywords.length > 0 && (
            <BsXCircleFill
              cursor="pointer"
              className="position-absolute text-secondary"
              style={{ top: "10px", right: "10px" }}
              onClick={handleResetKeywords}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            />
          )}
        </div>
        <Button
          className="bg-danger border border-danger center"
          aria-label="Search"
          style={{ width: "10%" }}
          onClick={handleFilterKeywords}>
          <BsSearch size={20} className="text-light" />
        </Button>
      </InputGroup>
      {productsSuggest.length > 0 && keywords.length > 0 ? (
        <ListGroup
          className={`search-suggest pe-5 mt-2 ${!isFocus && "d-none"}`}>
          <ListGroup.Item>
            {productsSuggest.length} kết quả tìm thấy với{" "}
            <em> &quot; {keywords} &quot;</em>
          </ListGroup.Item>
          {productsSuggest.map((product: IProduct) => (
            <ListGroup.Item key={product._id}>
              <Image
                src={product.thumbnail + "" || "/image/no-image.png"}
                alt=""
                width={50}
                height={50}
              />
              <div className="ps-2 w-100 overflow-hidden">
                <Link
                  href={"/product/" + product.slug}
                  className="suggest-title link-body-emphasis link-underline-opacity-0">
                  {product.title}
                </Link>
                <div className="suggest-price text-danger">
                  {priceFormat(product.discountedPrice)}
                </div>
              </div>
            </ListGroup.Item>
          ))}
          <ListGroup.Item className="justify-content-center">
            <span
              className="text-danger"
              onMouseDown={handleFilterKeywords}
              style={{ cursor: "pointer" }}>
              Xem tất cả kết quả &gt;&gt;
            </span>
          </ListGroup.Item>
        </ListGroup>
      ) : (
        keywords.length > 0 &&
        productsSuggest.length > 0 && (
          <ListGroup
            className={`search-suggest pe-5 mt-2 ${!isFocus && "d-none"}`}>
            <ListGroup.Item>
              0 tìm thấy sản phẩm <em> &quot; {keywords} &quot;</em>
            </ListGroup.Item>
          </ListGroup>
        )
      )}
    </div>
  );
};

export default withBase(memo(SearchKeywords));
