import Category from "../models/Category.js";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Please provide name and type" });
    }

    if (!["income", "expense"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Type must be 'income' or 'expense'" });
    }

    const category = await Category.create({
      user: req.user._id,
      name,
      type,
    });

    res.status(201).json({ category });
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({
        message: "You already have a category with this name and type",
      });
    }
    console.error("Create category error:", error);
    res.status(500).json({ message: "Server error while creating category" });
  }
};

// Get all categories for logged-in user
export const getCategories = async (req, res) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error while fetching categories" });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) category.name = name;
    if (type) {
      if (!["income", "expense"].includes(type)) {
        return res
          .status(400)
          .json({ message: "Type must be 'income' or 'expense'" });
      }
      category.type = type;
    }

    await category.save();

    res.status(200).json({ category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already have a category with this name and type",
      });
    }
    console.error("Update category error:", error);
    res.status(500).json({ message: "Server error while updating category" });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if this category is still in use anywhere before allowing deletion
    const [incomeCount, expenseCount, budgetCount] = await Promise.all([
      Income.countDocuments({ category: category._id }),
      Expense.countDocuments({ category: category._id }),
      Budget.countDocuments({ category: category._id }),
    ]);

    if (incomeCount > 0 || expenseCount > 0 || budgetCount > 0) {
      return res.status(400).json({
        message:
          "This category is still in use and cannot be deleted. Please remove or reassign all related income, expense, and budget entries first.",
        details: { incomeCount, expenseCount, budgetCount },
      });
    }

    await Category.findByIdAndDelete(category._id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Server error while deleting category" });
  }
};
