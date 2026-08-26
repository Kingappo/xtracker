import axiosInstance from "./axiosInstance";

export const getStatement = async (startDate: string, endDate: string) => {
  const res = await axiosInstance.get("/statement", {
    params: { startDate, endDate },
  });
  return res.data;
};
