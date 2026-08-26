import axiosInstance from "./axiosInstance";

export const getBudgets = async (params?: {
  month?: number;
  year?: number;
}) => {
  const res = await axiosInstance.get("/budgets", { params });
  return res.data;
};

export const createBudget = async (data: {
  category: string;
  amount: number;
  month: number;
  year: number;
}) => {
  const res = await axiosInstance.post("/budgets", data);
  return res.data;
};

export const updateBudget = async (id: string, data: { amount: number }) => {
  const res = await axiosInstance.put(`/budgets/${id}`, data);
  return res.data;
};

export const deleteBudget = async (id: string) => {
  const res = await axiosInstance.delete(`/budgets/${id}`);
  return res.data;
};
