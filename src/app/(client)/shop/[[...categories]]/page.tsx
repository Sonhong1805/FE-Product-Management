"use client";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import HeaderShop from "@/components/Header/HeaderShop";
import Loading from "@/components/Loading/Loading";
import Pagination from "@/components/Pagination";
import ProductList from "@/components/Product/ProductList";
import SidebarShop from "@/components/Sidebar/SidebarShop";
import withBase from "@/hocs/withBase";
import { handlePagination } from "@/lib/features/product/productSlice";
import { fetchProducts } from "@/lib/features/product/productThunk";
import { useAppSelector } from "@/lib/hooks";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

interface IProps extends IWithBaseProps {
  params: { categories?: string[] };
}

const Page = (props: IProps) => {
  const {
    searchParams,
    router,
    pathname,
    dispatch,
    params: { categories },
  } = props;

  const products = useAppSelector((state) => state.products.data);
  const pagination = useAppSelector((state) => state.products.pagination);
  const queries = useAppSelector((state) => state.products.queries);
  const isFirstRender = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const priceMax = useAppSelector((state) => state.products.priceMax);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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
    setOrDeleteParam(
      "priceTo",
      queries.priceTo > 0 && queries.priceTo < priceMax
        ? queries.priceTo
        : false
    );
    setOrDeleteParam(
      "colors",
      queries.colors?.length ? queries.colors.join(",") : false
    );
    setOrDeleteParam(
      "tags",
      queries.tags?.length ? queries.tags.join(",") : false
    );
    if (categories?.length) {
      const categorySlug = queries.categorySlug;
      const filterCategory = categorySlug?.filter(
        (slug) => slug !== categories.at(-1)
      );
      setOrDeleteParam(
        "categories",
        filterCategory?.length ? filterCategory.join(",") : false
      );
    } else {
      setOrDeleteParam(
        "categories",
        queries.categorySlug?.length ? queries.categorySlug.join(",") : false
      );
    }

    const sortKey = localStorage
      .getItem("productSortValue")
      ?.split(",")[0] as string;
    if (queries.filter && queries.filter.value) {
      const { label, value } = queries.filter;
      const [filterKey] = value.split(",");
      if (filterKey !== sortKey) {
        params.delete(sortKey);
        params.set(filterKey, label);
        localStorage.setItem("productSortValue", value);
      } else {
        params.set(filterKey, label);
        localStorage.setItem("productSortValue", value);
      }
    } else {
      params.delete(sortKey);
      localStorage.removeItem("productSortValue");
    }

    (async () => {
      setLoading(true);
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
          ...(queries.colors?.length && {
            colors: queries.colors,
          }),
          ...(queries.tags?.length && {
            tags: queries.tags,
          }),
          ...(queries.filter !== null
            ? {
                [queries.filter?.value?.split(",")[0]]:
                  queries.filter?.value?.split(",")[1],
              }
            : {}),
        })
      );
      setLoading(false);
    })();
    router.push(pathname + "?" + params.toString());
  }, [queries, pagination.page]);

  return (
    <div className="bg-body-secondary">
      {loading && <Loading />}
      <Breadcrumb title="Sản phẩm" href="/shop" />
      <Container className="pb-5">
        <Row className="bg-light py-2 ps-2 pe-3">
          <SidebarShop categorySlug={categories?.at(-1)} />
          <Col xs={9} className="">
            <HeaderShop />
            <ProductList products={products} />
            {products.length > 0 ? (
              <div className="d-flex justify-content-center align-items-center mb-5">
                <Pagination
                  pagination={pagination}
                  onHandlePagination={handlePagination}
                />
              </div>
            ) : (
              <div className="h3 text-center ">
                <em>"Hiện tại không có sản phẩm nào"</em>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withBase(Page);
