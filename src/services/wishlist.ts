import axios from "../customs/axios-customize";

const WishlistService = {
  create: (data: TWishlist): Promise<IResponse<TWishlist>> => {
    return axios.post("/wishlist", data);
  },

  delete: (id: string): Promise<IResponse<string>> => {
    return axios.delete(`/wishlist/${id}`);
  },
};

export default WishlistService;
