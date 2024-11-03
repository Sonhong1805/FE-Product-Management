import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,
  withCredentials: true,
});

if (
  typeof window !== "undefined" &&
  window &&
  window.localStorage &&
  window.localStorage.getItem("access_token")
) {
  instance.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  };
}

const handleRefreshToken = async () => {
  const response = await instance.get("/auth/refresh");
  if (response && response.data) return response.data.accessToken;
  else return null;
};

// Thêm một bộ đón chặn request
instance.interceptors.request.use(
  function (config) {
    // Làm gì đó trước khi request dược gửi đi
    return config;
  },
  function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
  }
);

const NO_RETRY_HEADER = "x-no-retry";

// Thêm một bộ đón chặn response
instance.interceptors.response.use(
  function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response

    return response.data;
  },
  async function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const accessToken = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = "true";
      if (accessToken) {
        error.config.headers["Authorization"] = `Bearer ${accessToken}`;
        localStorage.setItem("access_token", accessToken);
        return instance.request(error.config);
      }
    }

    if (
      error.config &&
      error.response &&
      +error.response.status === 400 &&
      error.config.url === "/auth/refresh"
    ) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
