"use client";
import withBase from "@/hocs/withBase";
import { changeView, handleQueries } from "@/lib/features/product/productSlice";
import { useAppSelector } from "@/lib/hooks";
import { clientProductsFilterOptions } from "@/options/filter";
import React from "react";
import { TfiViewGrid, TfiViewListAlt } from "react-icons/tfi";
import Select, { SingleValue } from "react-select";

const HeaderShop = (props: IWithBaseProps) => {
  const { dispatch, rangeCount } = props;
  const queries = useAppSelector((state) => state.products.queries);
  const products = useAppSelector((state) => state.products.data);
  const pagination = useAppSelector((state) => state.products.pagination);
  const view = useAppSelector((state) => state.products.view);
  const handleSeletedSort = (option: SingleValue<Option>) => {
    dispatch(
      handleQueries({
        ...queries,
        filter: {
          label: option?.label,
          value: option?.value,
        },
      })
    );
  };

  const handleChangeView = (view: "GRID" | "LIST") => {
    dispatch(changeView(view));
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-5">
      <div>
        {queries.keywords && (
          <div className="fs-5">
            Kết quả tìm kiếm:{" "}
            <strong>
              <em>"{queries.keywords}"</em>
            </strong>
          </div>
        )}
        <div>
          Hiển thị {rangeCount(products, pagination)}
          trên {pagination.totalItems} kết quả.
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center gap-4">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <span>Sắp xếp theo:</span>
          <div style={{ minWidth: "200px" }}>
            <Select
              className="basic-single me-2 w-100"
              classNamePrefix="select"
              name="sort"
              id="sort"
              defaultValue={clientProductsFilterOptions[0]}
              options={clientProductsFilterOptions}
              onChange={handleSeletedSort}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center gap-3">
          <span>Xem:</span>
          <div className="d-flex justify-content-between align-items-center gap-3">
            <TfiViewGrid
              cursor={"pointer"}
              color={view === "GRID" ? "rgb(220 53 69)" : ""}
              size={26}
              onClick={() => handleChangeView("GRID")}
            />
            <TfiViewListAlt
              cursor={"pointer"}
              size={26}
              color={view === "LIST" ? "rgb(220 53 69)" : ""}
              onClick={() => handleChangeView("LIST")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(HeaderShop);
