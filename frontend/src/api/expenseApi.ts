import axiosInstance from "./axiosInstance";

export const getExpenses = async (params?: {
  category?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const res = await axiosInstance.get("/expenses", { params });
  return res.data;
};

export const createExpense = async (data: {
  category: string;
  amount: number;
  description?: string;
  date?: string;
}) => {
  const res = await axiosInstance.post("/expenses", data);
  return res.data;
};

export const updateExpense = async (
  id: string,
  data: {
    category?: string;
    amount?: number;
    description?: string;
    date?: string;
  },
) => {
  const res = await axiosInstance.put(`/expenses/${id}`, data);
  return res.data;
};

export const deleteExpense = async (id: string) => {
  const res = await axiosInstance.delete(`/expenses/${id}`);
  return res.data;
};
