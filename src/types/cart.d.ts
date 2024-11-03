type TProductInCart = Pick<
  IProduct,
  "title" | "slug" | "thumbnail" | "price" | "discountedPrice"
> & {
  _id: string;
  quantity: number;
  variant: string;
  selected: boolean;
  productId: string;
};

interface ICart {
  _id: string;
  products: TProductInCart[];
  updatedAt?: Date;
}
