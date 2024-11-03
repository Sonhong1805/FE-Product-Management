"use client";
import withBase from "@/hocs/withBase";
import { handleColors } from "@/lib/features/product/productSlice";
import { useAppSelector } from "@/lib/hooks";
import { colorsOptions } from "@/options/colors";
import React, { ChangeEvent } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const FilterColor = (props: IWithBaseProps) => {
  const { dispatch } = props;
  const colors = useAppSelector((state) => state.products.queries.colors);
  const handleFilterColor = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(handleColors(value));
  };

  return (
    <div className="mb-3 border-bottom pb-3">
      <div className="mb-3">
        <span className="fw-bold">Màu sắc</span>
      </div>
      <div className="d-flex gap-2 flex-wrap">
        {colorsOptions.map((option) => (
          <div key={option.value}>
            <OverlayTrigger
              key={"top"}
              placement={"top"}
              overlay={
                <Tooltip id={option.value}>
                  <strong>{option.label}</strong>.
                </Tooltip>
              }>
              <div>
                <input
                  className="color-input"
                  type="checkbox"
                  id={option.value}
                  value={option.value}
                  checked={colors?.includes(option.value)}
                  onChange={handleFilterColor}
                  hidden
                />
                <label
                  htmlFor={option.value}
                  style={{ backgroundColor: option.color }}
                  className="color-label"></label>
              </div>
            </OverlayTrigger>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withBase(FilterColor);
