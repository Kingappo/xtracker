import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import SummaryCard from "../components/SummaryCard";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import { useAuth } from "../context/AuthContext";
import { getChartSummary, getTodaySummary } from "../api/chartApi";

interface ChartPoint {
  month: string;
  income: number;
  expense: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [isNewUser] = useState(() => {
    const flag = sessionStorage.getItem("isNewUser") === "true";
    if (flag) sessionStorage.removeItem("isNewUser");
    return flag;
  });

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
          {isNewUser ? "Welcome" : "Welcome back"}, {user?.firstName} 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          {isNewUser
            ? "Let's get your finances set up."
            : "Here's your financial overview."}
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
            <IncomeExpenseChart chartData={chartData} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
