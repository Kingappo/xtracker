import axiosInstance from "./axiosInstance";

export const getTransactions = async (params: {
  page?: number;
  limit?: number;
  type?: "all" | "income" | "expense";
  category?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const res = await axiosInstance.get("/transactions", { params });
  return res.data;
};
