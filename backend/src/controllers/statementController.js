import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import User from "../models/User.js";

// Generate a statement of account for a date range
export const getStatement = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Please provide startDate and endDate" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const dateFilter = { user: userId, date: { $gte: start, $lte: end } };

    // Fetch and merge transactions for the period
    const [incomes, expenses] = await Promise.all([
      Income.find(dateFilter).populate("category", "name").lean(),
      Expense.find(dateFilter).populate("category", "name").lean(),
    ]);

    const taggedIncomes = incomes.map((i) => ({
      ...i,
      transactionType: "income",
    }));
    const taggedExpenses = expenses.map((e) => ({
      ...e,
      transactionType: "expense",
    }));

    const transactions = [...taggedIncomes, ...taggedExpenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date), // chronological order for a statement (oldest first)
    );

    // Totals
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netChange = totalIncome - totalExpense;

    // Budget performance — every budget whose month/year falls within the range
    const allBudgets = await Budget.find({ user: userId })
      .populate("category", "name")
      .lean();

    const relevantBudgets = allBudgets.filter((b) => {
      const budgetStart = new Date(b.year, b.month - 1, 1);
      const budgetEnd = new Date(b.year, b.month, 0, 23, 59, 59);
      return budgetStart <= end && budgetEnd >= start;
    });

    const budgetPerformance = relevantBudgets.map((budget) => {
      const spent = expenses
        .filter((e) => String(e.category._id) === String(budget.category._id))
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        category: budget.category.name,
        month: budget.month,
        year: budget.year,
        budgetAmount: budget.amount,
        spent,
        percentUsed:
          budget.amount > 0
            ? Number(((spent / budget.amount) * 100).toFixed(1))
            : 0,
        status:
          spent >= budget.amount
            ? "exceeded"
            : spent / budget.amount >= 0.85
              ? "warning"
              : "on-track",
      };
    });

    // User info for the statement header
    const user = await User.findById(userId);

    res.status(200).json({
      user: {
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
      },
      period: { startDate: start, endDate: end },
      summary: { totalIncome, totalExpense, netChange },
      transactions,
      budgetPerformance,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error("Get statement error:", error);
    res
      .status(500)
      .json({ message: "Server error while generating statement" });
  }
};
