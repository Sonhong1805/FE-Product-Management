interface ISetting {
  _id: string;
  name: string;
  logo: FileList | string;
  email: string;
  phone: string;
  address: string;
  copyright: string;
  updatedAt?: Date;
}

interface IDashboard {
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  categories: {
    total: number;
    active: number;
    inactive: number;
  };
  orders: {
    total: number;
    approved: number;
    pending: number;
  };
  contacts: {
    total: number;
    active: number;
    inactive: number;
  };
}
