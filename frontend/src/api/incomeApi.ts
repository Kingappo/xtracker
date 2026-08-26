import axiosInstance from "./axiosInstance";

export const getIncomes = async (params?: {
  category?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const res = await axiosInstance.get("/incomes", { params });
  return res.data;
};

export const createIncome = async (data: {
  category: string;
  amount: number;
  description?: string;
  date?: string;
}) => {
  const res = await axiosInstance.post("/incomes", data);
  return res.data;
};

export const updateIncome = async (
  id: string,
  data: {
    category?: string;
    amount?: number;
    description?: string;
    date?: string;
  },
) => {
  const res = await axiosInstance.put(`/incomes/${id}`, data);
  return res.data;
};

export const deleteIncome = async (id: string) => {
  const res = await axiosInstance.delete(`/incomes/${id}`);
  return res.data;
};
