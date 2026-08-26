import { Pencil, Trash2 } from "lucide-react";
import type { Budget } from "../types";

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("en-NG", { style: "currency", currency: "NGN" });

const BudgetCard = ({ budget, spent, onEdit, onDelete }: BudgetCardProps) => {
  const percentUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const isExceeded = percentUsed >= 100;
  const isWarning = percentUsed >= 85 && percentUsed < 100;

  const barColor = isExceeded
    ? "bg-red-500"
    : isWarning
      ? "bg-amber-500"
      : "bg-green-500";
  const textColor = isExceeded
    ? "text-red-600"
    : isWarning
      ? "text-amber-600"
      : "text-gray-600";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">
            {budget.category.name}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(budget.year, budget.month - 1).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(budget)}
            className="text-gray-400 hover:text-blue-600"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(budget._id)}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex justify-between text-sm mb-1">
        <span className={textColor}>{formatCurrency(spent)} spent</span>
        <span className="text-gray-400">
          of {formatCurrency(budget.amount)}
        </span>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {isExceeded && (
        <p className="text-xs text-red-600 mt-2 font-medium">
          ⚠ Budget exceeded
        </p>
      )}
      {isWarning && (
        <p className="text-xs text-amber-600 mt-2 font-medium">
          ⚠ {percentUsed.toFixed(0)}% used — approaching limit
        </p>
      )}
    </div>
  );
};

export default BudgetCard;
