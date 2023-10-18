import axiosInstance from "../service/Config";
export const getScore = async (getUsersData) => {
  return await axiosInstance.get(
    `/users?skip=${getUsersData.from}&limit=${getUsersData.to}`
  );
};
