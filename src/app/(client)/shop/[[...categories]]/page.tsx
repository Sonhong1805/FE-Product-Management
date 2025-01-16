"use client";
import Breadcrumb from "@/components/Breadcrumb";
import HeaderShop from "@/components/Header/HeaderShop";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import ProductList from "@/components/Product/ProductList";
import SidebarShop from "@/components/Sidebar/SidebarShop";
import setOrDeleteParam from "@/helpers/setOrDeleteParam";
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
  const priceMax = useAppSelector((state) => state.products.priceMax);
  const isFirstRender = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProductsData = async () => {
    await dispatch(
      fetchProducts({
        page: pagination.page,
        limit: 12,
        status: true,
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
        ...(queries.sort !== null &&
        queries.sort?.value &&
        queries.sort?.value !== "default"
          ? {
              [queries.sort?.value?.split(",")[0]]:
                queries.sort?.value?.split(",")[1],
            }
          : {}),
      })
    );
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    setOrDeleteParam(params, "page", pagination.page);
    setOrDeleteParam(params, "name", queries.keywords);
    setOrDeleteParam(params, "priceFrom", queries.priceFrom);
    setOrDeleteParam(
      params,
      "priceTo",
      queries.priceTo < priceMax ? queries.priceTo : false
    );
    setOrDeleteParam(
      params,
      "colors",
      queries.colors?.length ? queries.colors.join(",") : false
    );
    setOrDeleteParam(
      params,
      "tags",
      queries.tags?.length ? queries.tags.join(",") : false
    );
    if (categories?.length) {
      const categorySlug = queries.categorySlug;
      const filterCategory = categorySlug?.filter(
        (slug: string) => slug !== categories.at(-1)
      );
      setOrDeleteParam(
        params,
        "categories",
        filterCategory?.length ? filterCategory.join(",") : false
      );
    } else {
      setOrDeleteParam(
        params,
        "categories",
        queries.categorySlug?.length ? queries.categorySlug.join(",") : false
      );
    }

    setOrDeleteParam(
      params,
      "sort",
      queries.sort?.value &&
        queries.sort?.value !== "default" &&
        queries.sort?.value.split(",")[1]
    );
    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      fetchProductsData();
      setLoading(false);
      router.push(pathname + "?" + params.toString());
    }, 1000);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries, pagination.page]);

  return (
    <div className="bg-body-secondary">
      {loading && <Loading />}
      <Breadcrumb title="Sản phẩm" href="/shop" />
      <Container className="pb-5 mt-3">
        <Row className="bg-light py-2 ps-2 pe-3">
          <SidebarShop categorySlug={categories?.at(-1)} />
          <Col xs={9} className="">
            <HeaderShop />
            <ProductList products={products} />
            {products.length > 0 ? (
              <div className="d-flex justify-content-center align-items-center mb-5">
                <Pagination
                  pagination={pagination}
                  siblingCount={1}
                  onHandlePagination={handlePagination}
                />
              </div>
            ) : (
              <div className="h3 text-center">
                <em>&quot; Hiện tại không có sản phẩm nào &quot;</em>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withBase(Page);
