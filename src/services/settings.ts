import axios from "../customs/axios-customize";

const SettingsService = {
  index: (): Promise<IResponse<ISetting>> => {
    return axios.get("/settings");
  },

  update: (id: string, data: FormData): Promise<IResponse<ISetting>> => {
    return axios.patch(`/settings/${id}`, data);
  },
};

export default SettingsService;
