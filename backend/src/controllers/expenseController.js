import Expense from "../models/Expense.js";
import Category from "../models/Category.js";
import { checkBudgetExceeded } from "../utils/checkBudget.js";

// Create expense
export const createExpense = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;

    if (!category || !amount) {
      return res
        .status(400)
        .json({ message: "Please provide category and amount" });
    }

    const categoryDoc = await Category.findOne({
      _id: category,
      user: req.user._id,
      type: "expense",
    });

    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid expense category" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      category,
      amount,
      description,
      date: date || Date.now(),
    });

    await checkBudgetExceeded({
      userId: req.user._id,
      categoryId: category,
      date: expense.date,
    });

    res.status(201).json({ expense });
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({ message: "Server error while creating expense" });
  }
};

// Get all expenses for logged-in user
export const getExpenses = async (req, res) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    const expenses = await Expense.find(filter)
      .populate("category", "name type")
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Server error while fetching expenses" });
  }
};

// Get single expense
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("category", "name type");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ expense });
  } catch (error) {
    console.error("Get expense error:", error);
    res.status(500).json({ message: "Server error while fetching expense" });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (category) {
      const categoryDoc = await Category.findOne({
        _id: category,
        user: req.user._id,
        type: "expense",
      });
      if (!categoryDoc) {
        return res.status(400).json({ message: "Invalid expense category" });
      }
      expense.category = category;
    }

    if (amount !== undefined) expense.amount = amount;
    if (description !== undefined) expense.description = description;
    if (date) expense.date = date;

    await expense.save();

    await checkBudgetExceeded({
      userId: req.user._id,
      categoryId: expense.category,
      date: expense.date,
    });

    res.status(200).json({ expense });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Server error while updating expense" });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Server error while deleting expense" });
  }
};
