import axios from "../customs/axios-customize";

const OrdersService = {
  index: (params: Record<string, any>): Promise<IResponse<IOrder[]>> => {
    return axios.get("/orders", { params });
  },
  detailByUserId: (userId: string): Promise<IResponse<IOrder[]>> => {
    return axios.get(`/orders/user/${userId}`);
  },
  detail: (id: string): Promise<IResponse<IOrder[]>> => {
    return axios.get(`/orders/${id}`);
  },

  create: (cartId: string, data: IOrder): Promise<IResponse<null>> => {
    return axios.post(`/orders/${cartId}`, data);
  },

  update: (
    id: string,
    status: "APPROVED" | "CANCELED"
  ): Promise<IResponse<null>> => {
    return axios.patch(`/orders/${id}`, { status });
  },

  delete: (id: string): Promise<IResponse<null>> => {
    return axios.delete(`/orders/${id}`);
  },

  changeFeature: ({
    ids,
    feature,
  }: {
    ids: (string | number)[];
    feature: string;
  }): Promise<IResponse<null>> => {
    return axios.put("/orders/feature", { ids, feature });
  },
};

export default OrdersService;
