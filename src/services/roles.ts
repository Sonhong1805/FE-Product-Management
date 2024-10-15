import axios from "../customs/axios-customize";

const RolesService = {
  index: (params: Record<string, any> | null): Promise<IResponse<IRole[]>> => {
    return axios.get("/roles", { params });
  },

  detail: (id: string): Promise<IResponse<IRole>> => {
    return axios.get("/roles/" + id);
  },

  create: (data: IRoleInputs): Promise<IResponse<IRoleInputs>> => {
    return axios.post("/roles", data);
  },

  update: ({
    id,
    title,
    description,
  }: {
    id: string;
    title: string;
    description: string;
  }): Promise<IResponse<IRole>> => {
    return axios.patch(`/roles/${id}`, { title, description });
  },
  delete: (id: string): Promise<IResponse<IRole>> => {
    return axios.delete("/roles/" + id);
  },
  changeFeature: ({
    ids,
    feature,
  }: {
    ids: (string | number)[];
    feature: string;
  }): Promise<IResponse<IRole>> => {
    return axios.post("/roles/feature", { ids, feature });
  },

  updatePermissions: (roles: IRole[]): Promise<IResponse<IRole[]>> => {
    return axios.post("/roles/updatePermissions", { roles });
  },
};

export default RolesService;
