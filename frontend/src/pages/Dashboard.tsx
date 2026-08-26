import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import SummaryCard from "../components/SummaryCard";
import { useAuth } from "../context/AuthContext";
import { getChartSummary, getTodaySummary } from "../api/chartApi";
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

const Dashboard = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [todayIncome, setTodayIncome] = useState(0);
  const [todayExpense, setTodayExpense] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = new Date().getFullYear();
        const [summaryRes, todayRes] = await Promise.all([
          getChartSummary(year),
          getTodaySummary(),
        ]);

        setChartData(summaryRes.chartData);
        setTodayIncome(todayRes.totalIncome);
        setTodayExpense(todayRes.totalExpense);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = chartData.reduce((sum, d) => sum + d.expense, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          Here's your financial overview.
        </p>

        {isLoading ? (
          <p className="text-gray-500">Loading dashboard...</p>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <SummaryCard
                label="Total Income (Year)"
                amount={totalIncome}
                color="green"
              />
              <SummaryCard
                label="Total Expense (Year)"
                amount={totalExpense}
                color="red"
              />
              <SummaryCard label="Balance" amount={balance} color="blue" />
            </div>

            {/* Today's snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <SummaryCard
                label="Today's Income"
                amount={todayIncome}
                color="green"
              />
              <SummaryCard
                label="Today's Expense"
                amount={todayExpense}
                color="red"
              />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Income vs Expense ({new Date().getFullYear()})
              </h2>
              <ResponsiveContainer
                width="100%"
                height={260}
                className="sm:h-75!"
              >
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
