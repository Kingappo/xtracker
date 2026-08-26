import axiosInstance from "./axiosInstance";

export const getCategories = async (type?: "income" | "expense") => {
  const res = await axiosInstance.get("/categories", {
    params: type ? { type } : {},
  });
  return res.data;
};

export const createCategory = async (data: {
  name: string;
  type: "income" | "expense";
}) => {
  const res = await axiosInstance.post("/categories", data);
  return res.data;
};

export const updateCategory = async (
  id: string,
  data: { name?: string; type?: "income" | "expense" },
) => {
  const res = await axiosInstance.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await axiosInstance.delete(`/categories/${id}`);
  return res.data;
};
