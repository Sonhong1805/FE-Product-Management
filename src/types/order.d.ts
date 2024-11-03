interface IOrder {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  status: "APPROVED" | "PENDING" | "CANCELED";
  products: TProductInCart[];
  totalPrice: number;
  method: "CASH" | "PAYPAL";
  updatedAt?: Date;
}

interface IOrderGroup {
  productId: string;
  products: TProductInCart[];
}
type TOrderInputs = Omit<IOrder, "products">;
type IOrderQueries = {
  _id: string;
  priceTo: number;
  priceFrom: number;
  filter: Option;
};
