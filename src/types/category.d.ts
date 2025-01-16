interface ICategory {
  _id: string;
  title: string;
  breadcrumbs?: string;
  parent_slug: string;
  productIds: string[];
  status: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  children?: Array<Omit<ICategory, "children">>;
}

interface ICategoryInputs {
  title: string;
  parent_slug: string;
}

interface ICategoryQueries {
  title: string;
  status: Option | null;
}
