import axios from "../customs/axios-customize";

const ProductsService = {
  index: (params: Record<string, any>): Promise<IResponse<IProduct[]>> => {
    return axios.get("/products", { params });
  },

  detail: (slug: string): Promise<IResponse<IProduct>> => {
    return axios.get("/products/" + slug);
  },

  create: (data: FormData): Promise<IResponse<IProduct>> => {
    return axios.post("/products", data);
  },
  upload: (formData: FormData): Promise<IResponse<IProduct>> => {
    return axios.post("/products/upload", formData);
  },

  update: (id: string, data: FormData): Promise<IResponse<IProduct>> => {
    return axios.patch(`/products/${id}`, data);
  },
  delete: (id: string): Promise<IResponse<IProduct>> => {
    return axios.delete("/products/" + id);
  },
  changeFeature: ({
    ids,
    feature,
  }: {
    ids: (string | number)[];
    feature: string;
  }): Promise<IResponse<IProduct>> => {
    return axios.post("/products/feature", { ids, feature });
  },
};

export default ProductsService;
