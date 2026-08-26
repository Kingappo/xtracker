import axiosInstance from "./axiosInstance";
import type { AuthResponse } from "../types";

export const registerUser = async (data: {
  firstName: string;
  surname: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const verifyEmail = async (token: string) => {
  const res = await axiosInstance.get(`/auth/verify-email/${token}`);
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axiosInstance.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await axiosInstance.put(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return res.data;
};

export const getProfile = async () => {
  const res = await axiosInstance.get("/auth/profile");
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res = await axiosInstance.put("/auth/change-password", data);
  return res.data;
};

export const deleteAccount = async (password: string) => {
  const res = await axiosInstance.delete("/auth/delete-account", {
    data: { password },
  });
  return res.data;
};
