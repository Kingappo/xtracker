import axiosInstance from "./axiosInstance";

export const getChartSummary = async (year: number) => {
  const res = await axiosInstance.get(`/charts/summary?year=${year}`);
  return res.data;
};

export const getTodaySummary = async () => {
  const res = await axiosInstance.get("/charts/today");
  return res.data;
};

export const getCategoryBreakdown = async (month: number, year: number) => {
  const res = await axiosInstance.get(
    `/charts/category-breakdown?month=${month}&year=${year}`,
  );
  return res.data;
};

export const getDailySummary = async (month: number, year: number) => {
  const res = await axiosInstance.get(
    `/charts/daily?month=${month}&year=${year}`,
  );
  return res.data;
};
