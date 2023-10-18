import axiosInstance from "../service/Config";

// const token = localStorage.getItem("token");
const config = { headers: { "content-type": "multipart/form-data" } };

export const profile = async () => {
  return await axiosInstance.get("/user");
};

export const upload = async (file) => {
  return await axiosInstance.post("/user/upload", file, config);
};

export const updateUser = async (updateUserData) => {
  return await axiosInstance.put("/user/update", {
    password: updateUserData.password,
    phone: updateUserData.phone,
  });
};

export const getUsers = async (getUsersData) => {
  return await axiosInstance.get(
    `/users?skip=${getUsersData.from}&limit=${getUsersData.to}`
  );
};
