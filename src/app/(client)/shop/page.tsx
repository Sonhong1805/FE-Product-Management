"use client";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import PaginationClient from "@/components/Pagination/PaginationClient";
import SidebarShop from "@/components/Sidebar/SidebarShop";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import { handleQueries } from "@/lib/features/product/productSlice";
import { fetchProducts } from "@/lib/features/product/productThunk";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clientProductsSortedOptions } from "@/options/filter";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Select, { SingleValue } from "react-select";

const Page = (props: any) => {
  const { searchParams, rangeCount, router, pathname } = props;
  const dispatch = useAppDispatch();

  const products = useAppSelector((state) => state.products.data);
  const pagination = useAppSelector((state) => state.products.pagination);
  const queries = useAppSelector((state) => state.products.queries);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const setOrDeleteParam = (
      key: string,
      value: string | number | boolean
    ) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    };

    setOrDeleteParam("page", pagination.page);
    setOrDeleteParam("name", queries.keywords);
    setOrDeleteParam("priceFrom", queries.priceFrom);
    setOrDeleteParam("priceTo", queries.priceTo);

    if (queries.categorySlug && queries.categorySlug.length > 0) {
      params.delete("categorySlug[]");
      queries.categorySlug.forEach((slug) => {
        params.append("categorySlug[]", slug);
      });
    } else {
      params.delete("categorySlug[]");
    }

    if (queries.sort && queries.sort.value) {
      params.set("sort", queries.sort.label);
    } else {
      params.delete("sort");
    }

    (async () => {
      await dispatch(
        fetchProducts({
          page: pagination.page,
          limit: pagination.limit,
          ...(queries.keywords && { title: queries.keywords }),
          ...(queries.priceFrom > 0 && {
            "discountedPrice[gte]": queries.priceFrom,
          }),
          ...(queries.priceTo > 0 && {
            "discountedPrice[lte]": queries.priceTo,
          }),
          ...(queries.categorySlug?.length && {
            categorySlug: queries.categorySlug,
          }),
          ...(queries.sort !== null
            ? {
                [queries.sort?.value?.split(",")[0]]:
                  queries.sort?.value?.split(",")[1],
              }
            : {}),
        })
      );
    })();
    router.push(pathname + "?" + params.toString());
  }, [queries, pagination.page]);

  const handleSeletedSort = (option: SingleValue<Option>) => {
    dispatch(
      handleQueries({ sort: { value: option?.value, label: option?.label } })
    );
  };

  return (
    <div className="bg-body-secondary">
      <Breadcrumb title="Sản phẩm" href="/shop" />
      <Container>
        <Row className="bg-light py-2 ps-2 pe-3">
          <SidebarShop />
          <Col xs={9} className="">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                Hiển thị {rangeCount(products, pagination)}
                trên {pagination.totalItems} kết quả.
              </div>
              <div className="d-flex justify-content-between align-items-center gap-3">
                <span>Sắp xếp theo:</span>
                <div style={{ minWidth: "200px" }}>
                  <Select
                    className="basic-single me-2 w-100"
                    classNamePrefix="select"
                    name="sort"
                    id="sort"
                    defaultValue={clientProductsSortedOptions[0]}
                    options={clientProductsSortedOptions}
                    onChange={handleSeletedSort}
                  />
                </div>
              </div>
            </div>
            <Container className="d-grid grid-4">
              {products.map((product: IProduct, index: number) => (
                <Card className="m-2 p-2" key={index}>
                  <Image
                    src={product.thumbnail + "" || "/image/no-image.png"}
                    alt={product.slug}
                    width={100}
                    height={100}
                    quality={100}
                    priority={true}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body>
                    <Link href={"/product/" + product.slug}>
                      {product.title}
                    </Link>
                    <div>{priceFormat(product.discountedPrice)}</div>
                  </Card.Body>
                </Card>
              ))}
            </Container>
            <div className="d-flex justify-content-center align-items-center mb-5">
              <PaginationClient pagination={pagination} dispatch={dispatch} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withBase(Page);
