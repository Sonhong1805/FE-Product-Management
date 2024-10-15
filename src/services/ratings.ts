import axios from "../customs/axios-customize";

const RatingsService = {
  create: ({
    pid,
    star,
    content,
  }: {
    pid: string;
    star: number;
    content: string;
  }): Promise<IResponse<IRating>> => {
    return axios.post("/ratings/" + pid, { star, content });
  },

  delete: (pid: string, id: string): Promise<IResponse<any>> => {
    return axios.delete(`/ratings/${pid}/${id}`);
  },
};

export default RatingsService;
