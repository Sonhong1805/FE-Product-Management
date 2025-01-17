import axios from "../customs/axios-customize";

const AuthService = {
  register: ({
    fullname,
    email,
    password,
  }: IRegister): Promise<IResponse<IRegister>> => {
    return axios.post("/auth/register", { fullname, email, password });
  },
  login: ({ email, password }: ILogin): Promise<IResponse<ILogin>> => {
    return axios.post("/auth/login", { email, password });
  },
  logout: (): Promise<IResponse<null>> => {
    return axios.post("/auth/logout");
  },
  account: () => {
    return axios.get("/auth/account");
  },
  forgotPassword: (email: string): Promise<IResponse<null>> => {
    return axios.post("/auth/forgot-password", { email });
  },
  otpPassword: (email: string, otp: string): Promise<IResponse<null>> => {
    return axios.post("/auth/otp-password", { email, otp });
  },
  resetPassword: (
    email: string,
    password: string
  ): Promise<IResponse<null>> => {
    return axios.post("/auth/reset-password", { email, password });
  },
};

export default AuthService;
