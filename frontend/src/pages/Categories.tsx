import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Navbar from "../components/navbar/Navbar";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";
import type { Category } from "../types";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalType, setModalType] = useState<"income" | "expense">("expense");

  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.categories);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = (type: "income" | "expense") => {
    setEditingCategory(null);
    setModalType(type);
    setName("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setModalType(category.type);
    setName(category.name);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Please enter a category name");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, { name });
      } else {
        await createCategory({ name, type: modalType });
      }
      setIsModalOpen(false);
      fetchCategories();
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deleteTarget._id);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const message =
          err.response.data.message || "Failed to delete category";
        alert(message);
      } else {
        alert("Failed to delete category");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const renderCategoryList = (list: Category[], type: "income" | "expense") => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900 capitalize">
          {type} Categories
        </h2>
        <button
          onClick={() => openAddModal(type)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-gray-400">No {type} categories yet.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((cat) => (
            <li
              key={cat._id}
              className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md"
            >
              <span className="text-sm text-gray-800">{cat.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Categories
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div>
            <div className="flex  justify-between">
              <Link
                to="/incomes"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
              >
                <ArrowLeft size={16} /> Back to Incomes
              </Link>
              <Link
                to="/expenses"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
              >
                <ArrowLeft size={16} /> Back to Expenses
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderCategoryList(incomeCategories, "income")}
              {renderCategoryList(expenseCategories, "expense")}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingCategory
            ? "Edit Category"
            : `Add ${modalType === "income" ? "Income" : "Expense"} Category`
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                modalType === "income"
                  ? "e.g. Salary, Freelance"
                  : "e.g. Food, Transport"
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : editingCategory
                ? "Update Category"
                : "Add Category"}
          </button>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Categories;
