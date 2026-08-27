import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartPoint {
  month: string;
  income: number;
  expense: number;
}

interface IncomeExpenseChartProps {
  chartData: ChartPoint[];
}

const IncomeExpenseChart = ({ chartData }: IncomeExpenseChartProps) => {
  // "No data yet" means every month in the year has zero income and zero expense —
  // a brand-new user's chart endpoint typically still returns all 12 months, just empty.
  const hasData = chartData.some((d) => d.income > 0 || d.expense > 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {hasData ? (
        <>
          {" "}
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Income vs Expense ({new Date().getFullYear()})
          </h2>
          <ResponsiveContainer width="100%" height={260} className="sm:h-75!">
            <LineChart data={chartData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#16a34a"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#dc2626"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="h-65 sm:h-75 flex flex-col items-center justify-center text-center px-4">
          <p className="text-gray-700 font-medium mb-1">No transactions yet</p>
          <p className="text-sm text-gray-500 max-w-xs">
            Add your first income or expense to start seeing your trends here.
          </p>
        </div>
      )}
    </div>
  );
};

export default IncomeExpenseChart;
