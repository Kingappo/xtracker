import Budget from "../models/Budget.js";
import Category from "../models/Category.js";
import { createNotification } from "../utils/createNotification.js";

// Create a budget
export const createBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || !amount || !month || !year) {
      return res
        .status(400)
        .json({ message: "Please provide category, amount, month, and year" });
    }

    if (month < 1 || month > 12) {
      return res
        .status(400)
        .json({ message: "Month must be between 1 and 12" });
    }

    const categoryDoc = await Category.findOne({
      _id: category,
      user: req.user._id,
      type: "expense",
    });

    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid expense category" });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      amount,
      month,
      year,
    });

    await createNotification({
      userId: req.user._id,
      type: "budget-created",
      message: `A new budget of ${amount} was set for "${categoryDoc.name}" (${month}/${year}).`,
    });

    res.status(201).json({ budget });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A budget already exists for this category and month",
      });
    }
    console.error("Create budget error:", error);
    res.status(500).json({ message: "Server error while creating budget" });
  }
};

// Get all budgets. optional filter by month or year
export const getBudgets = async (req, res) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.month) filter.month = Number(req.query.month);
    if (req.query.year) filter.year = Number(req.query.year);

    const budgets = await Budget.find(filter)
      .populate("category", "name type")
      .sort({ year: -1, month: -1 });

    res.status(200).json({ budgets });
  } catch (error) {
    console.error("Get budgets error:", error);
    res.status(500).json({ message: "Server error while fetching budgets" });
  }
};

// Update a budget
export const updateBudget = async (req, res) => {
  try {
    const { amount } = req.body;

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("category", "name");

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (amount !== undefined) {
      budget.amount = amount;
      budget.alertSent = false;
      budget.warningSent = false;
    }

    await budget.save();

    await createNotification({
      userId: req.user._id,
      type: "budget-updated",
      message: `Your budget for "${budget.category.name}" was updated to ${budget.amount}.`,
    });

    res.status(200).json({ budget });
  } catch (error) {
    console.error("Update budget error:", error);
    res.status(500).json({ message: "Server error while updating budget" });
  }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("category", "name");

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const categoryName = budget.category.name;
    const { month, year } = budget;

    await budget.deleteOne();

    await createNotification({
      userId: req.user._id,
      type: "budget-deleted",
      message: `Your budget for "${categoryName}" (${month}/${year}) was deleted.`,
    });

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Delete budget error:", error);
    res.status(500).json({ message: "Server error while deleting budget" });
  }
};
