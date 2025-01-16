import axios from "../customs/axios-customize";

const SettingsService = {
  index: (): Promise<IResponse<ISetting>> => {
    return axios.get("/settings");
  },

  update: (id: string, data: FormData): Promise<IResponse<ISetting>> => {
    return axios.patch(`/settings/${id}`, data);
  },

  dashboard: (): Promise<IResponse<IDashboard>> => {
    return axios.get(`/settings/dashboard`);
  },
};

export default SettingsService;
