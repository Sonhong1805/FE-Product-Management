type TProductInCart = Pick<
  IProduct,
  "title" | "slug" | "thumbnail" | "discountedPrice"
> & {
  _id: string;
  quantity: number;
  variant: string;
  selected: boolean;
};

interface ICart {
  _id: string;
  products: TProductInCart[];
  updatedAt?: Date;
}
