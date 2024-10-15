"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import React, { useEffect, useState } from "react";
import SidebarNested from "./SidebarNested";
import { Button, Col } from "react-bootstrap";
import Slider from "rc-slider";
import priceFormat from "@/helpers/priceFormat";
import {
  handleCategorySlug,
  handleQueries,
} from "@/lib/features/product/productSlice";

const SidebarShop = () => {
  const dispatch = useAppDispatch();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const categories = useAppSelector((state) => state.categories.data);
  const priceMax = useAppSelector((state) => state.products.priceMax);
  const [range, setRange] = useState<number[]>([0, priceMax]);

  useEffect(() => {
    setRange([0, priceMax]);
  }, [priceMax]);

  const handleChangeSlider = (value: number | number[]) => {
    setRange(value as number[]);
  };

  const handleToggleItem = (slug: string) => {
    setExpandedItems({
      ...expandedItems,
      [slug]: !expandedItems[slug],
    });
  };

  const handleFilterPrice = async () => {
    await dispatch(
      handleQueries({
        priceFrom: range[0],
        priceTo: range[1],
      })
    );
  };

  const handleFilterCategory = async (slug: string) => {
    await dispatch(handleCategorySlug(slug));
  };
  return (
    <Col xs={3} className="border-end">
      <div className="mb-3 border-bottom pb-3">
        <div className="mb-2">
          <span className="fw-bold">Tất cả danh mục</span>
        </div>
        <ul className="nav-side">
          {categories.map((category: ICategory) => (
            <SidebarNested
              item={category}
              expandedItems={expandedItems}
              onHandleToggleItem={handleToggleItem}
              key={category._id}
              onHandleFilterCategory={handleFilterCategory}
            />
          ))}
        </ul>
      </div>
      <div className="mb-3">
        <div className="mb-3">
          <span className="fw-bold">Giá sản phẩm</span>
        </div>
        <div>
          <Slider
            range
            min={0}
            max={priceMax}
            onChange={handleChangeSlider}
            value={range}
            pushable={true}
            className="mb-3 px-2"
          />
          <div className="mb-2">
            Giá :{" "}
            <span className="text-danger text-price fw-bold">
              {priceFormat(range[0])}
            </span>{" "}
            -{" "}
            <span className="text-danger text-price fw-bold">
              {priceFormat(range[1])}
            </span>
          </div>
          <Button
            variant="danger"
            className="w-50 fw-bold"
            onClick={handleFilterPrice}>
            Lọc
          </Button>
        </div>
      </div>
    </Col>
  );
};

export default SidebarShop;
