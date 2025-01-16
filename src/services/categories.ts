import axios from "../customs/axios-customize";

const CategoriesService = {
  index: (): Promise<IResponse<ICategory[]>> => {
    return axios.get("/categories");
  },

  detail: (slug: string): Promise<IResponse<ICategory>> => {
    return axios.get("/categories/" + slug);
  },

  create: ({
    title,
    parent_slug,
  }: ICategoryInputs): Promise<IResponse<ICategory[]>> => {
    return axios.post("/categories", { title, parent_slug });
  },

  update: ({
    slug,
    title,
    parent_slug,
  }: {
    slug: string;
    title: string;
    parent_slug: string;
  }): Promise<IResponse<ICategory[]>> => {
    return axios.patch(`/categories/${slug}`, { title, parent_slug });
  },
  delete: (slug: string): Promise<IResponse<ICategory[]>> => {
    return axios.delete("/categories/" + slug);
  },
  changeFeature: ({
    slugs,
    feature,
  }: {
    slugs: string[];
    feature: string;
  }): Promise<IResponse<ICategory[]>> => {
    return axios.post("/categories/feature", { slugs, feature });
  },

  getSubCategories: (
    categorySlug: string | undefined
  ): Promise<IResponse<ICategory[]>> => {
    return axios.post("/categories/get-sub-categories", { categorySlug });
  },
};

export default CategoriesService;
