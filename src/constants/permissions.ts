import { permissionAll, permissionModule } from "./permission";

export const permissions = [
  {
    title: "Dashboard",
    module: permissionModule.dashboard,
    actions: [{ title: "Xem", permission: permissionAll.dashboard.view }],
  },
  {
    title: "Quản lý danh mục",
    module: permissionModule.categories,
    actions: [
      { title: "Xem", permission: permissionAll.categories.view },
      { title: "Thêm", permission: permissionAll.categories.create },
      { title: "Sửa", permission: permissionAll.categories.update },
      { title: "Xoá", permission: permissionAll.categories.delete },
    ],
  },
  {
    title: "Quản lý sản phẩm",
    module: permissionModule.products,
    actions: [
      { title: "Xem", permission: permissionAll.products.view },
      { title: "Thêm", permission: permissionAll.products.create },
      { title: "Sửa", permission: permissionAll.products.update },
      { title: "Xoá", permission: permissionAll.products.delete },
    ],
  },
  {
    title: "Quản lý đơn hàng",
    module: permissionModule.orders,
    actions: [
      { title: "Xem", permission: permissionAll.orders.view },
      { title: "Sửa", permission: permissionAll.orders.update },
      { title: "Xoá", permission: permissionAll.orders.delete },
      { title: "Duyệt đơn", permission: permissionAll.orders.approved },
      { title: "Huỷ đơn", permission: permissionAll.orders.canceled },
    ],
  },
  {
    title: "Quản lý bài viết",
    module: permissionModule.blogs,
    actions: [
      { title: "Xem", permission: permissionAll.blogs.view },
      { title: "Thêm", permission: permissionAll.blogs.create },
      { title: "Sửa", permission: permissionAll.blogs.update },
      { title: "Xoá", permission: permissionAll.blogs.delete },
    ],
  },
  {
    title: "Quản lý liên hệ",
    module: permissionModule.contacts,
    actions: [
      { title: "Xem", permission: permissionAll.contacts.view },
      { title: "Thêm", permission: permissionAll.contacts.create },
      { title: "Sửa", permission: permissionAll.contacts.update },
      { title: "Xoá", permission: permissionAll.contacts.delete },
    ],
  },
  {
    title: "Quản lý tài khoản",
    module: permissionModule.accounts,
    actions: [
      { title: "Xem", permission: permissionAll.accounts.view },
      { title: "Thêm", permission: permissionAll.accounts.create },
      { title: "Sửa", permission: permissionAll.accounts.update },
      { title: "Xoá", permission: permissionAll.accounts.delete },
    ],
  },
  {
    title: "Quản lý vai trò",
    module: permissionModule.roles,
    actions: [
      { title: "Xem", permission: permissionAll.roles.view },
      { title: "Thêm", permission: permissionAll.roles.create },
      { title: "Sửa", permission: permissionAll.roles.update },
      { title: "Xoá", permission: permissionAll.roles.delete },
    ],
  },
  {
    title: "Phân quyền tài khoản",
    module: permissionModule.permissions,
    actions: [
      { title: "Xem", permission: permissionAll.permissions.view },
      { title: "Sửa", permission: permissionAll.permissions.update },
    ],
  },
  {
    title: "Cài đặt chung",
    module: permissionModule.settings,
    actions: [
      { title: "Xem", permission: permissionAll.settings.view },
      { title: "Sửa", permission: permissionAll.settings.update },
    ],
  },
];
