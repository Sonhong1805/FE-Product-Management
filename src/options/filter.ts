export const adminCategoriesFilteredOptions: readonly Option[] = [
  { value: "status,true", label: "Hoạt động" },
  { value: "status,false", label: "Dừng hoạt động" },
];

export const adminProductsFilteredOptions: readonly Option[] = [
  { value: "status,true", label: "Hoạt động" },
  { value: "status,false", label: "Dừng hoạt động" },
  { value: "sort,-discountedPrice", label: "Giá giảm dần" },
  { value: "sort,discountedPrice", label: "Giá tăng dần" },
];

export const clientProductsFilterOptions: readonly Option[] = [
  { value: "", label: "Mặc định" },
  { value: "label,NEW", label: "Mới nhất" },
  { value: "label,OUTSTANDING", label: "Nổi bật" },
  { value: "label,POPULAR", label: "Theo độ phổ biến" },
  { value: "label,RATING", label: "Theo điểm đánh giá" },
  { value: "label,PROMOTION", label: "Đang khuyến mãi" },
  { value: "sort,-discountedPrice", label: "Giá giảm dần" },
  { value: "sort,discountedPrice", label: "Giá tăng dần" },
];

export const adminRolesFilteredOptions: readonly Option[] = [
  { value: "status,true", label: "Hoạt động" },
  { value: "status,false", label: "Dừng hoạt động" },
];

export const adminAccountsFilteredOptions: readonly Option[] = [
  { value: "status,true", label: "Hoạt động" },
  { value: "status,false", label: "Dừng hoạt động" },
];

export const adminBlogsFilteredOptions: readonly Option[] = [
  { value: "status,true", label: "Hoạt động" },
  { value: "status,false", label: "Dừng hoạt động" },
];

export const adminOrdersFilteredOptions: readonly Option[] = [
  { value: "status,APPROVED", label: "Đã duyệt" },
  { value: "status,PENDING", label: "Chờ duyệt" },
  { value: "status,CANCELED", label: "Đã huỷ" },
  { value: "sort,totalPrice", label: "Giá tăng dần" },
  { value: "sort,-totalPrice", label: "Giá giảm dần" },
];
