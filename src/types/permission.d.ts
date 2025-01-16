type TPermissionGroup = {
  view: string;
  create: string;
  update: string;
  delete: string;
};

type TPermissionOrder = Omit<
  TPermissionGroup & {
    approved: string;
    canceled: string;
  },
  "create"
>;

type TPermissionDashboard = Pick<TPermissionGroup, "view">;
type TPermissionPermissions = Omit<TPermissionGroup, "create" | "delete">;
type TPermissionSettings = Omit<TPermissionGroup, "create" | "delete">;

interface IPermissionAll {
  dashboard: TPermissionDashboard;
  categories: TPermissionGroup;
  products: TPermissionGroup;
  orders: TPermissionOrder;
  blogs: TPermissionGroup;
  contacts: TPermissionGroup;
  accounts: TPermissionGroup;
  roles: TPermissionGroup;
  permissions: TPermissionPermissions;
  settings: TPermissionSettings;
}

interface IPermissionModule {
  dashboard: string;
  categories: string;
  products: string;
  orders: string;
  blogs: string;
  contacts: string;
  accounts: string;
  roles: string;
  permissions: string;
  settings: string;
}
