import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import type { Category } from "../../types";
import axios from "axios";

interface FormValues {
  category: string;
  amount: string;
  description: string;
  date: string;
}

interface TransactionFormProps {
  categories: Category[];
  initialValues?: FormValues;
  onSubmit: (data: {
    category: string;
    amount: number;
    description: string;
    date: string;
  }) => Promise<void>;
  submitLabel: string;
}

const emptyForm = (categories: Category[]): FormValues => ({
  category: categories[0]?._id || "",
  amount: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
});

const TransactionForm = ({
  categories,
  initialValues,
  onSubmit,
  submitLabel,
}: TransactionFormProps) => {
  const [formData, setFormData] = useState<FormValues>(
    initialValues || emptyForm(categories),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Repopulate the whole form at once when initialValues changes (e.g. Add -> Edit)
  useEffect(() => {
    setFormData(initialValues || emptyForm(categories));
    setFormError("");
  }, [initialValues, categories]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.category || !formData.amount) {
      setFormError("Please fill in category and amount");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        category: formData.category,
        amount: Number(formData.amount),
        description: formData.description,
        date: formData.date,
      });
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
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          step="0.01"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
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

export default TransactionForm;
