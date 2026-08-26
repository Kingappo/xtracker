import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import { menuItems } from "../../utils/AccountMenuItem";

const Account = () => {
  const { user } = useAuth();

  const getInitial = (name?: string) => {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Account
        </h1>

        {/* Quick profile summary */}
        <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-semibold">
            {getInitial(user?.firstName)}
          </span>
          <div>
            <p className="font-medium text-gray-900">{user?.firstName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 transition"
            >
              <span
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                  item.danger
                    ? "bg-red-50 text-red-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <item.icon size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${item.danger ? "text-red-600" : "text-gray-900"}`}
                >
                  {item.label}
                </p>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
