import axiosInstance from "../service/Config";

export const sentenceAssessor = async () => {
  return await axiosInstance.get(`/sentence/assessor?skip=${0}&limit=${5}`);
};
export const allsentence = async (allsentenceData) => {
  return await axiosInstance.get(
    `/sentence/total?skip=${allsentenceData.from}&limit=${allsentenceData.to}`
  );
};

export const acceptedSentence = async (acceptedSentenceData) => {
  return await axiosInstance.get(
    `/sentence/accepted?skip=${acceptedSentenceData.from}&limit=${acceptedSentenceData.to}`
  );
};

export const sentence = async (sentenceData) => {
  return await axiosInstance.put("/sentence/determine", sentenceData);
};
