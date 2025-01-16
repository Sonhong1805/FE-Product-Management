"use client";
import priceFormat from "@/helpers/priceFormat";
import withBase from "@/hocs/withBase";
import { handleQueries } from "@/lib/features/product/productSlice";
import { useAppSelector } from "@/lib/hooks";
import Slider from "rc-slider";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const FilterPrice = (props: IWithBaseProps) => {
  const { dispatch } = props;
  const priceMax = useAppSelector((state) => state.products.priceMax);
  const { priceFrom, priceTo } = useAppSelector(
    (state) => state.products.queries
  );
  const [range, setRange] = useState<number[] | null>(null);

  useEffect(() => {
    if (priceMax !== undefined) {
      setRange([+priceFrom || 0, +priceTo || priceMax]);
    }
  }, [priceMax, priceFrom, priceTo]);

  if (range === null) return null;

  const handleChangeSlider = (value: number | number[]) =>
    setRange(value as number[]);

  const handleFilterPrice = async () => {
    await dispatch(
      handleQueries({
        priceFrom: range[0],
        priceTo: range[1],
      })
    );
  };
  return (
    <div className="mb-3 border-bottom pb-3">
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
          defaultValue={[+priceFrom || 0, +priceTo || priceMax]}
          pushable={true}
          className="mb-3 px-2"
          aria-labelledby="min-price-label max-price-label"
          aria-valuemin={0}
          aria-valuemax={priceMax}
          aria-valuenow={range[0]}
          aria-valuetext={`Min: ${range[0]}, Max: ${range[1]}`}
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
  );
};

export default withBase(FilterPrice);
