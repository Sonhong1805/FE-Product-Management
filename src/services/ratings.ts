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
};

export default RatingsService;
