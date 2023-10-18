import axiosInstance from "../service/Config";

export const login = async (loginData) => {
  return await axiosInstance.post("/user/login", {
    username: loginData.username,
    password: loginData.password,
  });
};

export const register = async (registerDate) => {
  return await axiosInstance.post("/user/register", {
    username: registerDate.username,
    password: registerDate.password,
    phone: registerDate.phone,
  });
};
