import withBase from "@/hocs/withBase";
import { handleTags, resetQueries } from "@/lib/features/product/productSlice";
import { useAppSelector } from "@/lib/hooks";
import { tagsOptions } from "@/options/tags";
import React, { ChangeEvent } from "react";

const FilterTag = (props: IWithBaseProps) => {
  const { dispatch } = props;
  const tags = useAppSelector((state) => state.products.queries.tags);
  const handleFilterTag = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(handleTags(value));
  };

  const handleResetQueries = () => {
    dispatch(resetQueries());
  };
  return (
    <div className="mb-3 pb-3">
      <div className="mb-3">
        <span className="fw-bold">Từ khoá phổ biến</span>
      </div>
      <div className="d-flex gap-2 flex-wrap">
        {tagsOptions.map((option) => (
          <div key={option.value}>
            <input
              className="tag-input"
              type="checkbox"
              id={option.value}
              value={option.value}
              checked={tags?.includes(option.value)}
              onChange={handleFilterTag}
              hidden
            />
            <label htmlFor={option.value} className="tag-label">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button className="btn-reset-queries" onClick={handleResetQueries}>
          RESET
        </button>
      </div>
    </div>
  );
};

export default withBase(FilterTag);
