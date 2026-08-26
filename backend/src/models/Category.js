import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Category type is required"],
    },
  },
  { timestamps: true },
);

categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
