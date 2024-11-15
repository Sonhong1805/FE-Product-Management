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

type IAccountsInputs = Omit<IUser, "status" | "updatedAt"> & {
  confirmPassword?: string;
};
type IAccountInputs = Pick<
  IUser,
  "fullname" | "email" | "phone" | "address" | "avatar" | "gender"
>;

interface IAccountsQueries {
  keywords: string;
  role: Option | null;
  filter: Option | null;
}

interface IPasswordInputs {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}
