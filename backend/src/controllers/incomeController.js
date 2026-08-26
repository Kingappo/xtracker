import Income from "../models/Income.js";
import Category from "../models/Category.js";

// Create income
export const createIncome = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;

    if (!category || !amount) {
      return res
        .status(400)
        .json({ message: "Please provide category and amount" });
    }

    // Make sure the category exists, belongs to this user, and is type "income"
    const categoryDoc = await Category.findOne({
      _id: category,
      user: req.user._id,
      type: "income",
    });

    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid income category" });
    }

    const income = await Income.create({
      user: req.user._id,
      category,
      amount,
      description,
      date: date || Date.now(),
    });

    res.status(201).json({ income });
  } catch (error) {
    console.error("Create income error:", error);
    res.status(500).json({ message: "Server error while creating income" });
  }
};

// Get all incomes for logged-in user
export const getIncomes = async (req, res) => {
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

    const incomes = await Income.find(filter)
      .populate("category", "name type")
      .sort({ date: -1 });

    res.status(200).json({ incomes });
  } catch (error) {
    console.error("Get incomes error:", error);
    res.status(500).json({ message: "Server error while fetching incomes" });
  }
};

// Get single income
export const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("category", "name type");

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({ income });
  } catch (error) {
    console.error("Get income error:", error);
    res.status(500).json({ message: "Server error while fetching income" });
  }
};

// Update income
export const updateIncome = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;

    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    if (category) {
      const categoryDoc = await Category.findOne({
        _id: category,
        user: req.user._id,
        type: "income",
      });
      if (!categoryDoc) {
        return res.status(400).json({ message: "Invalid income category" });
      }
      income.category = category;
    }

    if (amount !== undefined) income.amount = amount;
    if (description !== undefined) income.description = description;
    if (date) income.date = date;

    await income.save();

    res.status(200).json({ income });
  } catch (error) {
    console.error("Update income error:", error);
    res.status(500).json({ message: "Server error while updating income" });
  }
};

// Delete income
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Delete income error:", error);
    res.status(500).json({ message: "Server error while deleting income" });
  }
};
