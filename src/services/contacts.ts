import axios from "../customs/axios-customize";

const ContactsService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  index: (params: Record<string, any>): Promise<IResponse<IContact[]>> => {
    return axios.get("/contacts", { params });
  },

  detail: (id: string): Promise<IResponse<IContact>> => {
    return axios.get("/contacts/" + id);
  },

  create: (data: IContact): Promise<IResponse<IContact>> => {
    return axios.post("/contacts", data);
  },

  delete: (id: string): Promise<IResponse<IContact>> => {
    return axios.delete(`/contacts/${id}`);
  },

  accept: (email: string, answers: string): Promise<IResponse<IContact>> => {
    return axios.post(`/contacts/accept`, { email, answers });
  },

  changeFeature: ({
    ids,
    feature,
  }: {
    ids: (string | number)[];
    feature: string;
  }): Promise<IResponse<IContact>> => {
    return axios.post("/contacts/feature", { ids, feature });
  },
};

export default ContactsService;
