import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { getCategories } from "../api/categoryApi";
import type { Transaction, Category, PaginationInfo } from "../types";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getTransactions } from "../api/transactionAPi";

interface Totals {
  totalIncome: number;
  totalExpense: number;
  netChange: number;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const limit = 15;

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await getTransactions({
        page,
        limit,
        type,
        category: category || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setTransactions(res.transactions);
      setPagination(res.pagination);
      setTotals(res.totals);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories().then((res) => setCategories(res.categories));
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, type, category, startDate, endDate]);

  const handleFilterChange = (setter: (value: any) => void) => (value: any) => {
    setter(value);
    setPage(1);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-NG", { style: "currency", currency: "NGN" });

  const clearFilters = () => {
    setType("all");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const filteredCategoryName = category
    ? categories.find((c) => c._id === category)?.name
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Transaction History
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <select
              value={type}
              onChange={(e) => handleFilterChange(setType)(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={category}
              onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => handleFilterChange(setStartDate)(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => handleFilterChange(setEndDate)(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(type !== "all" || category || startDate || endDate) && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Totals summary */}
        {totals && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-400 mb-1">
                Total Income{" "}
                {filteredCategoryName ? `(${filteredCategoryName})` : ""}
              </p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(totals.totalIncome)}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-400 mb-1">
                Total Expense{" "}
                {filteredCategoryName ? `(${filteredCategoryName})` : ""}
              </p>
              <p className="text-lg font-bold text-red-600">
                {formatCurrency(totals.totalExpense)}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-400 mb-1">Net Change</p>
              <p
                className={`text-lg font-bold ${totals.netChange >= 0 ? "text-blue-600" : "text-red-600"}`}
              >
                {formatCurrency(totals.netChange)}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">
            No transactions found for the selected filters.
          </p>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div key={tx._id} className="flex items-center gap-3 p-4">
                  {tx.transactionType === "income" ? (
                    <ArrowUpCircle
                      size={20}
                      className="text-green-500 shrink-0"
                    />
                  ) : (
                    <ArrowDownCircle
                      size={20}
                      className="text-red-500 shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {tx.category.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.date).toLocaleDateString()}
                      {tx.description ? ` · ${tx.description}` : ""}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      tx.transactionType === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.transactionType === "income" ? "+" : "−"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages} (
                  {pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    disabled={page === pagination.totalPages}
                    className="p-2 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
