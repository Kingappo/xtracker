import { Link, useLocation } from "react-router-dom";

const PublicHeader = () => {
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  return (
    <header className="flex flex-wrap justify-between items-center gap-4 px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full">
      <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600">
        XTracker
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
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
