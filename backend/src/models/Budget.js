import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: [0.01, "Budget amount must be greater than 0"],
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    warningSent: {
      type: Boolean,
      default: false,
    },
    alertSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

budgetSchema.index(
  { user: 1, category: 1, month: 1, year: 1 },
  { unique: true },
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
