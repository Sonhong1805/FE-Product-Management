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

export const clientProductsSortedOptions: readonly Option[] = [
  { value: "", label: "Mặc định" },
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
