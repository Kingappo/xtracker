import { Fragment, useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../api/incomeApi";
import { getCategories } from "../api/categoryApi";
import { groupByMonth } from "../utils/groupByMonth";
import type { Income, Category } from "../types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import TransactionForm from "../components/forms/Transactionform";
import { Link } from "react-router-dom";

const Incomes = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Income | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [incomeRes, categoryRes] = await Promise.all([
        getIncomes(filterCategory ? { category: filterCategory } : {}),
        getCategories("income"),
      ]);
      setIncomes(incomeRes.incomes);
      setCategories(categoryRes.categories);
    } catch (err) {
      setError("Failed to load incomes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterCategory]);

  const openAddModal = () => {
    setEditingIncome(null);
    setIsModalOpen(true);
  };

  const openEditModal = (income: Income) => {
    setEditingIncome(income);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: {
    category: string;
    amount: number;
    description: string;
    date: string;
  }) => {
    if (editingIncome) {
      await updateIncome(editingIncome._id, data);
    } else {
      await createIncome(data);
    }
    setIsModalOpen(false);
    fetchData();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteIncome(deleteTarget._id);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      alert("Failed to delete income");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-NG", { style: "currency", currency: "NGN" });

  const totalAmount = incomes.reduce((sum, income) => sum + income.amount, 0);
  const filteredCategoryName = filterCategory
    ? categories.find((c) => c._id === filterCategory)?.name
    : null;

  const groupedIncomes = groupByMonth(incomes);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Incomes
          </h1>
          <button
            onClick={openAddModal}
            disabled={categories.length === 0}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={16} /> Add Income
          </button>
        </div>

        {/* Category filter and overall total across all months */}
        <div className="flex flex-wrap justify-between items-center gap-3 bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="text-right">
            <p className="text-xs text-gray-400">
              Total{" "}
              {filteredCategoryName ? `(${filteredCategoryName})` : "(All)"}
            </p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        {categories.length === 0 && !isLoading && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded">
            You need to create an income category first before adding income
            entries.
            <Link to={"/categories"} className="ml-2 underline">
              Create category
            </Link>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : incomes.length === 0 ? (
          <p className="text-gray-500">No income entries found.</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Desktop table */}
            <table className="w-full hidden sm:table">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Description
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Amount
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {groupedIncomes.map((group) => (
                  <Fragment key={group.key}>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-4 py-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            {group.label}
                          </span>
                          <span className="text-xs font-semibold text-green-600">
                            {formatCurrency(group.total)}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {group.items.map((income) => (
                      <tr key={income._id}>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(income.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {income.category.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {income.description || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium text-right">
                          {formatCurrency(income.amount)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => openEditModal(income)}
                            className="text-gray-400 hover:text-blue-600 mr-3"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(income)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {groupedIncomes.map((group) => (
                <div key={group.key}>
                  <div className="flex justify-between items-center bg-gray-50 px-4 py-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {group.label}
                    </span>
                    <span className="text-xs font-semibold text-green-600">
                      {formatCurrency(group.total)}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {group.items.map((income) => (
                      <div key={income._id} className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {income.category.name}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
                            {formatCurrency(income.amount)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {new Date(income.date).toLocaleDateString()}
                          {income.description ? ` · ${income.description}` : ""}
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditModal(income)}
                            className="text-xs text-blue-600 flex items-center gap-1"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(income)}
                            className="text-xs text-red-600 flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIncome ? "Edit Income" : "Add Income"}
      >
        <TransactionForm
          categories={categories}
          initialValues={
            editingIncome
              ? {
                  category: editingIncome.category._id,
                  amount: String(editingIncome.amount),
                  description: editingIncome.description || "",
                  date: editingIncome.date.split("T")[0],
                }
              : undefined
          }
          onSubmit={handleFormSubmit}
          submitLabel={editingIncome ? "Update Income" : "Add Income"}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Income"
        message={
          deleteTarget
            ? `Are you sure you want to delete this ${deleteTarget.category.name} income of ${formatCurrency(deleteTarget.amount)}? This cannot be undone.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Incomes;
