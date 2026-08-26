import Income from "../models/Income.js";
import Expense from "../models/Expense.js";

// Get merged income + expense transaction history (paginated, filterable)
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 20);
    const type = req.query.type || "all";

    const dateFilter = {};
    if (req.query.startDate) dateFilter.$gte = new Date(req.query.startDate);
    if (req.query.endDate) dateFilter.$lte = new Date(req.query.endDate);

    const baseFilter = { user: userId };
    if (Object.keys(dateFilter).length > 0) baseFilter.date = dateFilter;
    if (req.query.category) baseFilter.category = req.query.category;

    let incomes = [];
    let expenses = [];

    if (type === "all" || type === "income") {
      incomes = await Income.find(baseFilter)
        .populate("category", "name type")
        .lean();
      incomes = incomes.map((item) => ({ ...item, transactionType: "income" }));
    }

    if (type === "all" || type === "expense") {
      expenses = await Expense.find(baseFilter)
        .populate("category", "name type")
        .lean();
      expenses = expenses.map((item) => ({
        ...item,
        transactionType: "expense",
      }));
    }

    // Totals across the FULL filtered set (before pagination slices it down)
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const merged = [...incomes, ...expenses].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    const total = merged.length;
    const startIndex = (page - 1) * limit;
    const paginated = merged.slice(startIndex, startIndex + limit);

    res.status(200).json({
      transactions: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      totals: {
        totalIncome,
        totalExpense,
        netChange: totalIncome - totalExpense,
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching transactions" });
  }
};
