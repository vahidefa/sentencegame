import axios from "axios";

const API_URL = "http://193.176.241.213:8002/";
// const API_URL = "http://192.168.1.34:8002/";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const modifiedToken = token?.replace(/['"]+/g, "");
    if (token) {
      config.headers.token = modifiedToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
