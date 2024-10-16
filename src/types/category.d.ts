interface ICategory {
  _id: string;
  title: string;
  parent_slug: string;
  status: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  children?: any;
}

interface ICategoryInputs {
  title: string;
  parent_slug: string;
}
