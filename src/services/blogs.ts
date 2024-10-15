import axios from "../customs/axios-customize";

const BlogsService = {
  index: (params: Record<string, any>): Promise<IResponse<IBlog[]>> => {
    return axios.get("/blogs", { params });
  },

  detail: (id: string): Promise<IResponse<IBlog>> => {
    return axios.get("/blogs/" + id);
  },

  create: (data: FormData): Promise<IResponse<IBlog>> => {
    return axios.post("/blogs", data);
  },

  update: (id: string, data: FormData): Promise<IResponse<IBlog>> => {
    return axios.patch(`/blogs/${id}`, data);
  },
  delete: (id: string): Promise<IResponse<IBlog>> => {
    return axios.delete("/blogs/" + id);
  },
  changeFeature: ({
    ids,
    feature,
  }: {
    ids: (string | number)[];
    feature: string;
  }): Promise<IResponse<IBlog>> => {
    return axios.post("/blogs/feature", { ids, feature });
  },
};

export default BlogsService;
