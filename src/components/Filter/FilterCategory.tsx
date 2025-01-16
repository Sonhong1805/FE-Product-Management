import { nested } from "@/helpers/createNested";
import withBase from "@/hocs/withBase";
import React, { useEffect, useMemo, useState } from "react";
import SidebarNested from "../Sidebar/SidebarNested";
import CategoriesService from "@/services/categories";
import {
  handleCategoriesSlug,
  handleCategorySlug,
  handleQueries,
  resetQueries,
  updatedCategorySlug,
} from "@/lib/features/product/productSlice";
import { saveParentCategories } from "@/lib/features/category/categorySlice";
import { useAppSelector } from "@/lib/hooks";

interface IProps extends IWithBaseProps {
  categorySlug: string | undefined;
}

const FilterCategory = (props: IProps) => {
  const { dispatch, categorySlug, searchParams } = props;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [categories, setCategories] = useState<ICategory[]>([]);
  const queries = useAppSelector((state) => state.products.queries);

  useEffect(() => {
    (async () => {
      const response = await CategoriesService.getSubCategories(categorySlug);
      if (response.success && response.data) {
        const nestedData = nested(response.data);
        setCategories(nestedData);
        dispatch(resetQueries());
        dispatch(saveParentCategories(response.parentCategories));
        dispatch(
          handleQueries({
            keywords: queries.keywords,
            priceFrom: queries.priceFrom,
            priceTo: queries.priceTo,
            colors: queries.colors,
            tags: queries.tags,
            sort: queries.sort,
          })
        );
        if (searchParams.get("categories")) {
          const allCategoriesSlug = searchParams
            .get("categories")
            .split(",")
            .filter((category: string) => category);
          dispatch(handleCategoriesSlug([categorySlug, ...allCategoriesSlug]));
        } else {
          dispatch(handleCategorySlug(categorySlug));
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);

  const handleToggleItem = (slug: string) => {
    setExpandedItems({
      ...expandedItems,
      [slug]: !expandedItems[slug],
    });
  };

  const handleFilterCategory = async (slug: string) => {
    if (categorySlug) {
      await dispatch(updatedCategorySlug({ categorySlug, slug }));
    } else {
      await dispatch(handleCategorySlug(slug));
    }
  };

  const memoizedCategories = useMemo(
    () =>
      categories.map((category) => (
        <SidebarNested
          item={category}
          expandedItems={expandedItems}
          onHandleToggleItem={handleToggleItem}
          key={category._id}
          onHandleFilterCategory={handleFilterCategory}
        />
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, expandedItems]
  );

  return (
    <div className="mb-3 border-bottom pb-3">
      <div className="mb-2">
        <span className="fw-bold">Tất cả danh mục</span>
      </div>
      <ul className="nav-side p-0 m-0" style={{ listStyle: "none" }}>
        {memoizedCategories}
      </ul>
    </div>
  );
};

export default withBase(FilterCategory);
