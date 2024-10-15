interface IUser {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  avatar: String;
  phone: String;
  gender: String;
  address: String;
  role: IRole;
  cart: ICart;
  wishlist: TWishlist[];
  status?: boolean;
  updatedAt?: Date;
}

type IAccountsInputs = Omit<IUser, "status" | "updatedAt">;

interface IAccountsSearch {
  keywords: string;
  role: Option | null;
  filter: Option | null;
}
