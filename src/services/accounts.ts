import axios from "../customs/axios-customize";

const AccountsService = {
  index: (params: Record<string, any>): Promise<IResponse<IUser[]>> => {
    return axios.get("/accounts", { params });
  },

  detail: (id: string): Promise<IResponse<IUser>> => {
    return axios.get("/accounts/" + id);
  },

  create: (data: FormData): Promise<IResponse<IUser>> => {
    return axios.post("/accounts", data);
  },

  update: (id: string, data: FormData): Promise<IResponse<IUser>> => {
    return axios.patch(`/accounts/${id}`, data);
  },
  delete: (id: string): Promise<IResponse<IUser>> => {
    return axios.delete("/accounts/" + id);
  },
  changeFeature: ({
    ids,
    feature,
  }: {
    ids: (string | number)[];
    feature: string;
  }): Promise<IResponse<IUser>> => {
    return axios.post("/accounts/feature", { ids, feature });
  },
};

export default AccountsService;
