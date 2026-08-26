import { useEffect, useState } from "react";
import { Users, UserCheck, MessageSquare } from "lucide-react";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import { getDashboardStats } from "../../api/adminApi";
import type { AdminStats } from "../../types";

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers,
          icon: Users,
          color: "text-blue-600 bg-blue-50",
        },
        {
          label: `Active Users (last ${stats.activeWindowDays}d)`,
          value: stats.activeUsers,
          icon: UserCheck,
          color: "text-green-600 bg-green-50",
        },
        {
          label: "Total Reviews",
          value: stats.totalReviews,
          icon: MessageSquare,
          color: "text-amber-600 bg-amber-50",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Overview
        </h1>

        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4"
              >
                <div className={`p-3 rounded-full ${color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
