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
