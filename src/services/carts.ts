import axios from "../customs/axios-customize";

const CartsService = {
  create: (data: TProductInCart): Promise<IResponse<ICart>> => {
    return axios.post("/carts", data);
  },

  update: ({
    cartId,
    _id,
    type,
  }: {
    cartId: string;
    _id: string;
    type: "plus" | "minus";
  }): Promise<
    IResponse<{
      _id: string;
      quantity: number;
    }>
  > => {
    return axios.patch(`/carts/${cartId}/${_id}`, { type });
  },
  delete: (cartId: string, id: string): Promise<IResponse<ICart>> => {
    return axios.delete(`/carts/${cartId}/${id}`);
  },

  selected: (
    cartId: string,
    selectedIds: string[],
    type: "change" | "delete"
  ): Promise<IResponse<any>> => {
    return axios.put(`/carts/${cartId}/selected`, { selectedIds, type });
  },
};

export default CartsService;
