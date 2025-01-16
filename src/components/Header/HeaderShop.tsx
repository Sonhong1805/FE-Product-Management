import withBase from "@/hocs/withBase";
import { changeView, handleQueries } from "@/lib/features/product/productSlice";
import { useAppSelector } from "@/lib/hooks";
import { clientProductsFilteredOptions } from "@/options/filter";
import React, { memo, useEffect, useState } from "react";
import { TfiViewGrid, TfiViewListAlt } from "react-icons/tfi";
import Select, { SingleValue } from "react-select";

const HeaderShop = (props: IWithBaseProps) => {
  const { dispatch, searchParams } = props;
  const queries = useAppSelector((state) => state.products.queries);
  const products = useAppSelector((state) => state.products.data);
  const pagination = useAppSelector((state) => state.products.pagination);
  const view = useAppSelector((state) => state.products.view);
  const [keywords, setKeywords] = useState<string>("");
  const [defaultSort, setDefaultSort] = useState<Option>(
    clientProductsFilteredOptions[0]
  );

  useEffect(() => {
    if (queries.keywords) {
      setKeywords(queries.keywords);
    } else {
      setKeywords("");
    }
  }, [queries.keywords]);

  useEffect(() => {
    if (queries.sort) {
      setDefaultSort(queries.sort);
    } else {
      setDefaultSort(clientProductsFilteredOptions[0]);
    }
  }, [queries.sort]);

  const handleSeletedSort = (option: SingleValue<Option>) => {
    dispatch(
      handleQueries({
        ...queries,
        sort: option,
      })
    );
  };

  const handleChangeView = (view: "GRID" | "LIST") => {
    dispatch(changeView(view));
  };

  const rangeCount = (items: IProduct[], pagination: IPagination) => {
    const currentPage = Number(searchParams?.get("page")) || 1;
    const pageSize = pagination.limit;
    const start = items.length ? (currentPage - 1) * pageSize + 1 : 0;
    const end = Math.min(currentPage * pageSize, pagination?.totalItems || 0);
    return pagination.totalItems > 0 ? end - start + 1 : 0;
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-5">
      <div>
        {keywords.length > 0 && (
          <div className="fs-5">
            Kết quả tìm kiếm:{" "}
            <strong>
              <em>&quot; {keywords} &quot;</em>
            </strong>
          </div>
        )}
        <div>
          Hiển thị {rangeCount(products, pagination)} trên{" "}
          {pagination.totalItems} kết quả.
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
              instanceId="sort"
              value={
                defaultSort.value
                  ? defaultSort
                  : clientProductsFilteredOptions[0]
              }
              options={clientProductsFilteredOptions}
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

export default withBase(memo(HeaderShop));
