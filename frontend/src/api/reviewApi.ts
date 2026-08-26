import axiosInstance from "./axiosInstance";

export const createReview = async (data: {
  message: string;
  rating?: number;
}) => {
  const res = await axiosInstance.post("/reviews", data);
  return res.data;
};

export const getMyReviews = async () => {
  const res = await axiosInstance.get("/reviews/mine");
  return res.data;
};

export const getAllReviews = async () => {
  const res = await axiosInstance.get("/reviews");
  return res.data;
};

export const replyToReview = async (id: string, message: string) => {
  const res = await axiosInstance.put(`/reviews/${id}/reply`, { message });
  return res.data;
};
