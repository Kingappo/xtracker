import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <span className="font-bold text-sm tracking-wide">
                XTracker Admin
              </span>

              {/* Desktop links */}
              <div className="hidden sm:flex items-center gap-1">
                {links.map(({ to, label, icon: Icon }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition ${
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1 text-xs text-gray-300 hover:text-white"
            >
              <LogOut size={14} /> Logout
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="sm:hidden p-2 -mr-2 text-gray-300 hover:text-white"
              aria-label="Open admin menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out sm:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-800">
          <span className="font-bold text-sm tracking-wide">
            XTracker Admin
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-300 hover:text-white"
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col p-3 gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition mt-2 border-t border-gray-800 pt-4"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
