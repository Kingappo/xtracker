import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/navbar/PublicHeader";
import Footer from "../components/Footer";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "getting-started", label: "Getting Started" },
  { id: "categories", label: "Categories" },
  { id: "incomes-expenses", label: "Incomes & Expenses" },
  { id: "budgets", label: "Budgets & Alerts" },
  { id: "transactions", label: "Transaction History" },
  { id: "notifications", label: "Notifications" },
  { id: "statement", label: "Statement of Account" },
  { id: "account", label: "Account Settings" },
  { id: "faq", label: "FAQ" },
];

const Documentation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, token } = useAuth();
  const isLoggedIn = !!(user && token);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleSectionClick = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex flex-col">
      {isLoggedIn ? <Navbar /> : <PublicHeader />}

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Mobile - open table of contents */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden flex items-center gap-2 mb-6 text-sm font-medium text-gray-700 border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
        >
          <Menu size={16} /> Contents
        </button>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-8 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-gray-600 hover:text-blue-600 py-1.5 transition"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 space-y-14">
            <header>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                XTracker Documentation
              </h1>
              <p className="mt-2 text-gray-600">
                Everything you need to know to track your income, manage
                budgets, and stay on top of your spending.
              </p>
            </header>

            <section id="overview" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                XTracker is a personal finance tracker. You record your income
                and expenses under categories you define, set monthly budgets
                per category, and XTracker keeps you informed with in-app and
                email alerts when you're approaching or have exceeded a limit.
                You can review everything through a full transaction history,
                and generate a printable Statement of Account for any date
                range.
              </p>
            </section>

            <section id="getting-started" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Getting Started
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <span className="font-semibold text-gray-900">
                    1. Create an account.
                  </span>{" "}
                  Register with your first name, surname, email, and a password
                  of at least 6 characters.
                </p>
                <p>
                  <span className="font-semibold text-gray-900">
                    2. Verify your email.
                  </span>{" "}
                  After registering, you'll receive a verification link by
                  email. It expires after 24 hours, you can still use the app
                  before verifying, but it's worth doing early in case you ever
                  need password recovery.
                </p>
                <p>
                  <span className="font-semibold text-gray-900">
                    3. Set up your categories first.
                  </span>{" "}
                  Before you can log any income or expense, you need at least
                  one matching category, see the Categories section below. This
                  is the one required setup step.
                </p>
              </div>
            </section>

            <section id="categories" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Categories
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Categories organize your income and expenses — things like
                "Salary" or "Freelance" for income, and "Food" or "Transport"
                for expenses. Every category has a type, income or expense, and
                can only be used for entries of that same type. You can rename a
                category at any time; you can only delete one if nothing is
                currently using it.
              </p>
            </section>

            <section id="incomes-expenses" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Incomes & Expenses
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Log individual income or expense entries with a category, an
                amount, an optional description, and a date. Entries are grouped
                by month, with each month showing its own subtotal for the
                category you're currently filtering by, alongside the running
                total across every month.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Editing or deleting an entry always asks for confirmation first,
                nothing is removed by accident.
              </p>
            </section>

            <section id="budgets" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Budgets & Alerts
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Set a monthly spending limit for any expense category. Only one
                budget can exist per category, per month, once set, the category
                is locked on that budget, though you can always update the
                amount.
              </p>
              <p className="text-gray-600 leading-relaxed">
                As your spending against that category approaches the limit,
                you'll get a warning notification. Once you exceed it, you'll
                get an exceeded notification instead, both delivered in-app and
                by email.
              </p>
            </section>

            <section id="transactions" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Transaction History
              </h2>
              <p className="text-gray-600 leading-relaxed">
                A single combined, paginated view of every income and expense
                entry, newest first. Filter by type, category, or a date range.
                The totals shown always reflect your current filters, not just
                the page you're looking at.
              </p>
            </section>

            <section id="notifications" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Notifications
              </h2>
              <p className="text-gray-600 leading-relaxed">
                XTracker notifies you when a budget is created, updated,
                deleted, approaching its limit, or exceeded. Unread
                notifications show a dot on the bell icon in the navigation bar;
                opening a notification marks it as read.
              </p>
            </section>

            <section id="statement" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Statement of Account
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Generate a formatted statement for any date range, showing every
                transaction in that period alongside a summary of total income,
                total expenses, net change, and how each budget performed. It's
                designed to print cleanly or save as a PDF directly from your
                browser.
              </p>
            </section>

            <section id="account" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Account Settings
              </h2>
              <p className="text-gray-600 leading-relaxed">
                From your Account page you can view your profile, change your
                password, or permanently delete your account. Deleting your
                account removes all of your categories, income and expense
                entries, budgets, notifications, and reviews, this cannot be
                undone, and requires your password to confirm.
              </p>
            </section>

            <section id="faq" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-3">FAQ</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Why can't I add an income or expense?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    You need at least one category of the matching type first.
                    Go to Categories and create one, it only takes a moment.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Why won't a category delete?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    A category can't be deleted while it's still attached to an
                    income, expense, or budget entry. Remove or reassign those
                    first.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    I forgot my password — what now?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Use "Forgot password?" on the login page. You'll get a reset
                    link by email, valid for one hour.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Is my data private?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, every category, entry, and budget is scoped strictly to
                    your account. Nothing is shared or visible to other users.
                  </p>
                </div>
              </div>
            </section>

            {!isLoggedIn && (
              <div className="pt-6 border-t border-gray-100">
                <Link
                  to="/register"
                  className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                >
                  Ready to start? Create your account
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>

      {!isLoggedIn && <Footer />}

      {/* Mobile table-of-contents drawer */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-[80%] bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-bold text-blue-600">Contents</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-5 py-4">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={handleSectionClick}
              className="py-2.5 text-gray-700 hover:text-blue-600 font-medium text-base transition"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Documentation;
