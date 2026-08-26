import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../api/authApi";
import { getNotifications } from "../../api/notificationApi";

const Navbar = () => {
  const navlinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Transactions", href: "/transactions" },
    { name: "Incomes", href: "/incomes" },
    { name: "Expenses", href: "/expenses" },
    { name: "Budgets", href: "/budgets" },
    { name: "Categories", href: "/categories" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkUnread = async () => {
      try {
        const res = await getNotifications();
        setHasUnread(
          res.notifications.some((n: { isRead: boolean }) => !n.isRead),
        );
      } catch (error) {}
    };
    checkUnread();
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  const getInitial = (firstName?: string) => {
    if (!firstName) return "?";
    return firstName.trim().charAt(0).toUpperCase();
  };

  const getLinkClass = (href: string) => {
    const isActive = location.pathname === href;
    return isActive
      ? "text-blue-600 font-semibold text-sm"
      : "text-gray-600 hover:text-blue-600 font-medium text-sm transition";
  };

  const getDrawerLinkClass = (href: string) => {
    const isActive = location.pathname === href;
    return isActive
      ? "text-blue-600 font-semibold text-base"
      : "text-gray-700 hover:text-blue-600 font-medium text-base transition";
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 relative">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Toggle menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-gray-600"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <Link to="/dashboard" className="text-xl font-bold text-blue-600">
              XTracker
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navlinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={getLinkClass(link.href)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* notification bell, profile pill & logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/notifications"
              className={`relative transition ${
                location.pathname === "/notifications"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>

            {/* Profile pill -> account page */}
            <Link
              to="/account"
              className={`hidden sm:flex items-center gap-2 px-2 py-1 rounded-full transition ${
                location.pathname === "/account"
                  ? "bg-blue-50"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                {getInitial(user?.firstName)}
              </span>
              <span className="text-sm text-gray-700 font-medium">
                {user?.firstName}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="hidden sm:inline text-sm bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay — dims the page and closes the drawer when tapped */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sliding drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-[80%] bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-bold text-blue-600">XTracker</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-5 py-4">
          {navlinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`py-2.5 ${getDrawerLinkClass(link.href)}`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            to="/account"
            className={`flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 ${
              location.pathname === "/account"
                ? "text-blue-600"
                : "text-gray-700"
            }`}
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
              {getInitial(user?.firstName)}
            </span>
            <span className="text-base font-medium">{user?.firstName}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="mt-4 text-sm bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition self-start"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
