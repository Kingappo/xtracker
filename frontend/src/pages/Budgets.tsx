import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import BudgetCard from "../components/BudgetCard";
import BudgetForm from "../components/forms/BudgetForm";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../api/budgetApi";
import { getCategories } from "../api/categoryApi";
import { getCategoryBreakdown } from "../api/chartApi";
import type { Budget, Category } from "../types";
import { Plus } from "lucide-react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Budgets = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [spentByCategory, setSpentByCategory] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Budget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [budgetRes, categoryRes, breakdownRes] = await Promise.all([
        getBudgets({ month, year }),
        getCategories("expense"),
        getCategoryBreakdown(month, year),
      ]);

      setBudgets(budgetRes.budgets);
      setCategories(categoryRes.categories);

      // Convert the breakdown array into a lookup map: { categoryName: totalSpent }
      const map: Record<string, number> = {};
      breakdownRes.breakdown.forEach(
        (item: { category: string; total: number }) => {
          map[item.category] = item.total;
        },
      );
      setSpentByCategory(map);
    } catch (err) {
      setError("Failed to load budgets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  // Categories that don't already have a budget set for this month/year
  const availableCategories = categories.filter(
    (cat) => !budgets.some((b) => b.category._id === cat._id),
  );

  const openAddModal = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const openEditModal = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: {
    category: string;
    amount: number;
  }) => {
    if (editingBudget) {
      await updateBudget(editingBudget._id, { amount: data.amount });
    } else {
      await createBudget({
        category: data.category,
        amount: data.amount,
        month,
        year,
      });
    }
    setIsModalOpen(false);
    fetchData();
  };

  // BudgetCard calls onDelete with just the id, so we look up the full
  // object here to pass into ConfirmModal for a descriptive message.
  const handleDeleteRequest = (id: string) => {
    const budget = budgets.find((b) => b._id === id);
    if (budget) setDeleteTarget(budget);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBudget(deleteTarget._id);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      alert("Failed to delete budget");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Budgets
          </h1>
          <button
            onClick={openAddModal}
            disabled={availableCategories.length === 0}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={16} /> Add Budget
          </button>
        </div>

        {/* Month/Year selector */}
        <div className="flex gap-3 mb-6">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {monthNames.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : budgets.length === 0 ? (
          <p className="text-gray-500">
            No budgets set for {monthNames[month - 1]} {year}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                spent={spentByCategory[budget.category.name] || 0}
                onEdit={openEditModal}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? "Edit Budget" : "Add Budget"}
      >
        <BudgetForm
          categories={availableCategories}
          editingBudget={editingBudget}
          onSubmit={handleFormSubmit}
          submitLabel={editingBudget ? "Update Budget" : "Add Budget"}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Budget"
        message={
          deleteTarget
            ? `Are you sure you want to delete the ${deleteTarget.category.name} budget for ${monthNames[deleteTarget.month - 1]} ${deleteTarget.year}? This cannot be undone.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Budgets;
