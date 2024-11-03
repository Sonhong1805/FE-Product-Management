interface ILogin {
  email: string;
  password: string;
  accessToken?: string;
  user?: IUser;
}

interface IRegister extends ILogin {
  fullname: string;
  confirmPassword: string;
}

type TForgotPassword = Pick<ILogin, "email">;
type TResetPassword = Pick<IRegister, "password" | "confirmPassword">;
