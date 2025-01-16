import axios from "../customs/axios-customize";

const ProductsService = {
  index: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: Record<string, any>
  ): Promise<IResponse<IProduct[]>> => {
    return axios.get("/products", { params });
  },

  detail: (slug: string): Promise<IResponse<IProduct>> => {
    return axios.get("/products/" + slug);
  },

  create: (data: FormData): Promise<IResponse<IProduct>> => {
    return axios.post("/products", data);
  },

  update: (id: string, data: FormData): Promise<IResponse<IProduct>> => {
    return axios.patch(`/products/${id}`, data);
  },
  delete: (cid: string, pid: string): Promise<IResponse<IProduct>> => {
    return axios.delete(`/products/${cid}/${pid}`);
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
