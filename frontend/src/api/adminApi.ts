import axiosInstance from "./axiosInstance";

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await axiosInstance.get("/admin/stats");
  return res.data;
};
