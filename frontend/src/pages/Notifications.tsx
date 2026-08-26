import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { getNotifications, markAsRead } from "../api/notificationApi";
import type { AppNotification } from "../types";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.notifications);
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      // update locally instead of refetching, since it's a small, predictable change
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "budget-exceeded":
        return <AlertTriangle size={18} className="text-red-500" />;
      case "budget-warning":
        return <AlertTriangle size={18} className="text-amber-500" />;
      case "budget-created":
      case "budget-updated":
        return <CheckCircle2 size={18} className="text-blue-500" />;
      case "income-updated":
        return <TrendingUp size={18} className="text-green-500" />;
      case "expense-updated":
        return <TrendingDown size={18} className="text-red-500" />;
      case "budget-deleted":
        return <AlertTriangle size={18} className="text-gray-500" />;
      default:
        return <Bell size={18} className="text-gray-400" />;
    }
  };

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / 1000,
    );
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() =>
                  !notification.isRead && handleMarkAsRead(notification._id)
                }
                className={`flex gap-3 p-4 cursor-pointer transition ${
                  notification.isRead
                    ? "bg-white"
                    : "bg-blue-50/50 hover:bg-blue-50"
                }`}
              >
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${notification.isRead ? "text-gray-600" : "text-gray-900 font-medium"}`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {timeAgo(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
