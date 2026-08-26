import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import type { Budget, Category } from "../../types";

interface BudgetFormProps {
  categories: Category[];
  editingBudget?: Budget | null;
  onSubmit: (data: { category: string; amount: number }) => Promise<void>;
  submitLabel: string;
}

const BudgetForm = ({
  categories,
  editingBudget,
  onSubmit,
  submitLabel,
}: BudgetFormProps) => {
  const [formCategory, setFormCategory] = useState(
    editingBudget ? editingBudget.category._id : categories[0]?._id || "",
  );
  const [formAmount, setFormAmount] = useState(
    editingBudget ? String(editingBudget.amount) : "",
  );
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formCategory || !formAmount) {
      setFormError("Please fill in category and amount");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ category: formCategory, amount: Number(formAmount) });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setFormError(err.response.data.message || "Something went wrong");
      } else {
        setFormError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = editingBudget ? [editingBudget.category] : categories;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {formError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={formCategory}
          onChange={(e) => setFormCategory(e.target.value)}
          disabled={!!editingBudget} // category can't be changed once set, only the amount
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          {categoryOptions.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Budget Amount
        </label>
        <input
          type="number"
          step="0.01"
          value={formAmount}
          onChange={(e) => setFormAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default BudgetForm;
