import axios from "../customs/axios-customize";

const VariantsService = {
  index: (pSlug: string): Promise<IResponse<IVariant[]>> => {
    return axios.get("/variants/" + pSlug);
  },

  create: (pid: string, data: FormData): Promise<IResponse<IVariant>> => {
    return axios.post("/variants/" + pid, data);
  },

  update: (
    pid: string,
    vid: string,
    data: FormData
  ): Promise<IResponse<IVariant>> => {
    return axios.patch(`/variants/${pid}/${vid}`, data);
  },
  delete: (pid: string, vid: string): Promise<IResponse<IVariant>> => {
    return axios.delete(`/variants/${pid}/${vid}`);
  },
};

export default VariantsService;
