type PermissionGroup = {
  view: string;
  create: string;
  update: string;
  delete: string;
};

interface IPermissionAll {
  categories: PermissionGroup;
  products: PermissionGroup;
}

interface IPermissionModule {
  categories: string;
  products: string;
}
