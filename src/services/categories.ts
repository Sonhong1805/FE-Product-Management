import axios from "../customs/axios-customize";

const CategoriesService = {
  index: (): Promise<IResponse<ICategory[]>> => {
    return axios.get("/categories");
  },

  detail: (id: string): Promise<IResponse<ICategory>> => {
    return axios.get("/categories/" + id);
  },

  create: ({
    title,
    parent_slug,
  }: {
    title: string;
    parent_slug: string;
  }): Promise<IResponse<ICategory>> => {
    return axios.post("/categories", { title, parent_slug });
  },

  update: ({
    id,
    title,
    parent_id,
  }: {
    id: string;
    title: string;
    parent_id: string;
  }): Promise<IResponse<ICategory>> => {
    return axios.patch(`/categories/${id}`, { title, parent_id });
  },
  delete: (id: string): Promise<IResponse<ICategory>> => {
    return axios.delete("/categories/" + id);
  },
  changeFeature: ({
    ids,
    feature,
  }: {
    ids: (string | number)[];
    feature: string;
  }): Promise<IResponse<ICategory>> => {
    return axios.post("/categories/feature", { ids, feature });
  },
};

export default CategoriesService;
