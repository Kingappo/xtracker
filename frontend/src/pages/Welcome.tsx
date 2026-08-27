import { Link } from "react-router-dom";
import PublicHeader from "../components/navbar/PublicHeader";
import Footer from "../components/Footer";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex flex-col">
      <PublicHeader />

      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          Take control of your money, one entry at a time.
        </h2>
        <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl">
          Track your income and expenses, set budgets, and get alerted before
          you overspend, all in one simple dashboard.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition text-center"
          >
            Create free account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition text-center"
          >
            I already have an account
          </Link>
          <Link
            to="/documentation"
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Read the documentation →
          </Link>
        </div>

        {/* Feature highlights */}
        <div
          id="features"
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-4xl w-full px-2 sm:px-0 scroll-mt-20"
        >
          <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-gray-100 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">
              📊 Visual Insights
            </h3>
            <p className="text-sm text-gray-600">
              See exactly where your money goes with clear, simple charts.
            </p>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-gray-100 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">
              🔔 Budget Alerts
            </h3>
            <p className="text-sm text-gray-600">
              Get notified by email and in-app when you're close to your limit.
            </p>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-gray-100 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">
              🔒 Secure & Private
            </h3>
            <p className="text-sm text-gray-600">
              Your financial data is protected and only ever visible to you.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Welcome;
