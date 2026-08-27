import { Link, useLocation } from "react-router-dom";

const PublicHeader = () => {
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isDocs = location.pathname === "/documentation";

  return (
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full">
      <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600">
        XTracker
      </Link>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          to="/documentation"
          className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition ${
            isDocs
              ? "text-blue-600 underline underline-offset-4"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Documentation
        </Link>
        <Link
          to="/login"
          className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition ${
            isLogin
              ? "text-blue-600 underline underline-offset-4"
              : "text-blue-600 hover:underline"
          }`}
        >
          Log In
        </Link>
        <Link
          to="/register"
          className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md font-medium transition ${
            isRegister
              ? "bg-blue-700 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Get Started
        </Link>
      </div>
    </header>
  );
};

export default PublicHeader;
