import { nested } from "@/helpers/createNested";
import withBase from "@/hocs/withBase";
import React, { useEffect, useState } from "react";
import SidebarNested from "../Sidebar/SidebarNested";
import CategoriesService from "@/services/categories";
import { useAppDispatch } from "@/lib/hooks";
import {
  handleCategoriesSlug,
  handleCategorySlug,
  resetQueries,
  updatedCategorySlug,
} from "@/lib/features/product/productSlice";

interface IProps extends IWithBaseProps {
  categorySlug: string | undefined;
}

const FilterCategory = (props: IProps) => {
  const { dispatch, categorySlug, searchParams } = props;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    (async () => {
      const response = await CategoriesService.getSubCategories(categorySlug);
      if (response.success && response.data) {
        const nestedData = nested(response.data);
        setCategories(nestedData);
        dispatch(resetQueries());
        if (searchParams.get("categories")) {
          const allCategoriesSlug = searchParams
            .get("categories")
            .split(",")
            .filter((c: string) => c);
          dispatch(handleCategoriesSlug([categorySlug, ...allCategoriesSlug]));
        } else {
          dispatch(handleCategorySlug(categorySlug));
        }
      }
    })();
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
  return (
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
  );
};

export default withBase(FilterCategory);