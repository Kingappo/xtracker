import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="text-xl font-bold text-blue-600">
              XTracker
            </Link>
            <p className="mt-3 text-sm text-gray-500 max-w-xs">
              A simple way to track your income, expenses, and budgets, all in
              one place.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  Features
                </a>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/register"
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  to="/forgot-password"
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@xtracker.app"
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  support@xtracker.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} XTracker. Built for learning and
            growth.
          </p>
          <p className="flex items-center gap-1">Built by Kingsley</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
