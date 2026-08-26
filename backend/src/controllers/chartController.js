import mongoose from "mongoose";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";

// Get aggregated income vs expense data for charting
export const getChartSummary = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const userId = req.user._id;

    // Aggregate incomes grouped by month for the given year
    const incomeData = await Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31T23:59:59`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Aggregate expenses grouped by month for the given year
    const expenseData = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31T23:59:59`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // A clean 12-month array (Jan-Dec), filling in 0 for months with no data
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = monthNames.map((name, index) => {
      const monthNum = index + 1;
      const income = incomeData.find((d) => d._id === monthNum);
      const expense = expenseData.find((d) => d._id === monthNum);

      return {
        month: name,
        income: income ? income.total : 0,
        expense: expense ? expense.total : 0,
      };
    });

    res.status(200).json({ year, chartData });
  } catch (error) {
    console.error("Chart summary error:", error);
    res.status(500).json({ message: "Server error while fetching chart data" });
  }
};

// Get category breakdown for expenses
export const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const breakdown = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          _id: 0,
          category: "$categoryInfo.name",
          total: 1,
        },
      },
    ]);

    res.status(200).json({ month, year, breakdown });
  } catch (error) {
    console.error("Category breakdown error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching category breakdown" });
  }
};

// Get daily income vs expense totals for a given month
export const getDailySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const incomeData = await Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const expenseData = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Number of days in this month
    const daysInMonth = new Date(year, month, 0).getDate();

    const dailyData = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const income = incomeData.find((d) => d._id === day);
      const expense = expenseData.find((d) => d._id === day);

      return {
        day,
        income: income ? income.total : 0,
        expense: expense ? expense.total : 0,
      };
    });

    res.status(200).json({ month, year, dailyData });
  } catch (error) {
    console.error("Daily summary error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching daily summary" });
  }
};

// Get today's total income and expense
export const getTodaySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const incomeResult = await Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expenseResult = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      date: startOfDay.toISOString().split("T")[0],
      totalIncome: incomeResult.length > 0 ? incomeResult[0].total : 0,
      totalExpense: expenseResult.length > 0 ? expenseResult[0].total : 0,
    });
  } catch (error) {
    console.error("Today summary error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching today's summary" });
  }
};
