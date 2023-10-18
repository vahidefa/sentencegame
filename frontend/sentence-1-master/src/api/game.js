import axiosInstance from "../service/Config";

export const words = async () => {
  return await axiosInstance.get("/words");
};

export const game = async (gameData) => {
  return await axiosInstance.post("game", {
    sentences: gameData,
  });
};

export const getScore = async (getUsersData) => {
  return await axiosInstance.get(
    `/scores?skip=${getUsersData.from}&limit=${getUsersData.to}`
  );
};
