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
  slug: string;
  title: string;
  thumbnail: FileList | string;
  images: FileList | string[];
  category: ICategory;
  price: number;
  discount: number;
  discountedPrice: number;
  descriptions: string;
  quantity: number;
  sold: number;
  highlights: Option[];
  variants: IVariant[];
  ratings: IRating[];
  status: boolean;
  updatedAt?: Date;
}

type IProductInputs = Omit<IProduct, "sold" | "status" | "updatedAt" | "slug">;
type IRatingInputs = Pick<IRating, "star" | "content">;

interface IProductSearch {
  keywords: string;
  priceTo: number;
  priceFrom: number;
  filter: Option | null;
  categorySlug?: string[];
}

type IProductQueries = {
  keywords: string;
  priceTo: number;
  priceFrom: number;
  categorySlug?: string[];
  sort: Option;
};
