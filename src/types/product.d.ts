interface IVariant {
  _id: string;
  name: string;
  thumbnail: FileList | string;
  price: number;
  discount: number;
  discountedPrice: number;
  status: boolean;
  updatedAt?: Date;
}

interface TWishlist {
  _id?: string;
  slug: string;
  title: string;
  thumbnail: FileList | string;
  price: number;
  discount: number;
  discountedPrice: number;
}

interface IRating {
  _id: string;
  email: string;
  star: number;
  content: string;
  createdAt: Date;
}

interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  label: Option;
  colors: Option[] | null;
  thumbnail: FileList | string;
  images: FileList | string[];
  category: ICategory;
  price: number;
  discount: number;
  discountedPrice: number;
  descriptions: string;
  quantity: number;
  sold: number;
  tags: Option[] | null;
  variants: IVariant[];
  ratings: IRating[];
  status: boolean;
  updatedAt?: Date;
}

type IProductInputs = Omit<IProduct, "sold" | "status" | "updatedAt">;
type IRatingInputs = Pick<IRating, "star" | "content">;

type IProductQueries = {
  keywords: string;
  priceTo: number;
  priceFrom: number;
  categorySlug?: string[];
  filter: Option | null;
  colors?: string[];
  tags?: string[];
  label?: string;
};
