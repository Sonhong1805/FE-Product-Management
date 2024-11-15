interface ICategory {
  _id: string;
  title: string;
  parent_slug: string;
  productIds: string[];
  status: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  children?: ICategory[];
}

interface ICategoryInputs {
  title: string;
  parent_slug: string;
}
