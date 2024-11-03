export const permissionAll: IPermissionAll = {
  dashboard: {
    view: "dashboard_view",
  },
  categories: {
    view: "categories_view",
    create: "categories_create",
    update: "categories_update",
    delete: "categories_delete",
  },
  products: {
    view: "products_view",
    create: "products_create",
    update: "products_update",
    delete: "products_delete",
  },
  orders: {
    view: "orders_view",
    create: "orders_create",
    update: "orders_update",
    delete: "orders_delete",
    approved: "orders_approved",
    canceled: "orders_canceled",
  },
  blogs: {
    view: "blogs_view",
    create: "blogs_create",
    update: "blogs_update",
    delete: "blogs_delete",
  },
  accounts: {
    view: "accounts_view",
    create: "accounts_create",
    update: "accounts_update",
    delete: "accounts_delete",
  },
  roles: {
    view: "roles_view",
    create: "roles_create",
    update: "roles_update",
    delete: "roles_delete",
  },
  permissions: {
    view: "permissions_view",
    update: "permissions_update",
  },
  settings: {
    view: "settings_view",
    update: "settings_update",
  },
};

export const permissionModule: IPermissionModule = {
  dashboard: "dashboard",
  categories: "categories",
  products: "products",
  orders: "orders",
  blogs: "blogs",
  accounts: "accounts",
  roles: "roles",
  permissions: "permissions",
  settings: "settings",
};
