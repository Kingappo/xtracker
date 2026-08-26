import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { getStatement } from "../api/statementApi";
import type { Statement as StatementType } from "../types";
import { Printer, FileText, ArrowLeft } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

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

const Statement = () => {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [startDate, setStartDate] = useState(
    firstOfMonth.toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);
  const [statement, setStatement] = useState<StatementType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-NG", { style: "currency", currency: "NGN" });

  const handleGenerate = async () => {
    setError("");
    if (!startDate || !endDate) {
      setError("Please select both a start and end date");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date must be before end date");
      return;
    }

    setIsLoading(true);
    try {
      const res = await getStatement(startDate, endDate);
      setStatement(res);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to generate statement");
      } else {
        setError("Failed to generate statement");
      }
      setStatement(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const statusStyles: Record<string, string> = {
    exceeded: "text-red-600 bg-red-50",
    warning: "text-amber-600 bg-amber-50",
    "on-track": "text-green-600 bg-green-50",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar hidden when printing */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Controls, hidden when printing */}
        <Link
          to="/account"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
        >
          <ArrowLeft size={16} /> Back to Account
        </Link>
        <div className="print:hidden">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            Statement of Account
          </h1>

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                <FileText size={16} />
                {isLoading ? "Generating..." : "Generate Statement"}
              </button>

              {statement && (
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition"
                >
                  <Printer size={16} />
                  Print / Save as PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {/* The actual statement */}
        {statement && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 print:border-0 print:rounded-none print:p-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-6 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-blue-600">XTracker</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Statement of Account
                </p>
              </div>
              <div className="text-sm text-gray-500 sm:text-right">
                <p>
                  {statement.user.firstName} {statement.user.surname}
                </p>
                <p>{statement.user.email}</p>
              </div>
            </div>

            <div className="mb-6 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Period:</span>{" "}
                {new Date(statement.period.startDate).toLocaleDateString()} —{" "}
                {new Date(statement.period.endDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Generated on {new Date(statement.generatedAt).toLocaleString()}
              </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Income</p>
                <p className="text-sm sm:text-base font-bold text-green-600">
                  {formatCurrency(statement.summary.totalIncome)}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Expense</p>
                <p className="text-sm sm:text-base font-bold text-red-600">
                  {formatCurrency(statement.summary.totalExpense)}
                </p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Net Change</p>
                <p
                  className={`text-sm sm:text-base font-bold ${
                    statement.summary.netChange >= 0
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(statement.summary.netChange)}
                </p>
              </div>
            </div>

            {/* Budget performance */}
            {statement.budgetPerformance.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Budget Performance
                </h3>
                <div className="space-y-2">
                  {statement.budgetPerformance.map((b, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {b.category}
                        </p>
                        <p className="text-xs text-gray-400">
                          {monthNames[b.month - 1]} {b.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700">
                          {formatCurrency(b.spent)} /{" "}
                          {formatCurrency(b.budgetAmount)}
                        </p>
                        <span
                          className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${statusStyles[b.status]}`}
                        >
                          {b.percentUsed}% used
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transaction list */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Transactions ({statement.transactions.length})
              </h3>

              {statement.transactions.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No transactions in this period.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
                      <th className="py-2 pr-2">Date</th>
                      <th className="py-2 pr-2">Category</th>
                      <th className="py-2 pr-2">Description</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {statement.transactions.map((tx) => (
                      <tr key={tx._id}>
                        <td className="py-2 pr-2 text-gray-600 whitespace-nowrap">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="py-2 pr-2 text-gray-900">
                          {tx.category.name}
                        </td>
                        <td className="py-2 pr-2 text-gray-500">
                          {tx.description || "—"}
                        </td>
                        <td
                          className={`py-2 text-right font-medium whitespace-nowrap ${
                            tx.transactionType === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.transactionType === "income" ? "+" : "−"}
                          {formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center mt-8 pt-6 border-t border-gray-100">
              This statement was generated by XTracker and reflects data
              recorded in the app.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statement;
