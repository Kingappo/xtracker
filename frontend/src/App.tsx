import { Routes, Route } from "react-router-dom";
import TopLoadingBar from "./components/TopLoadingBar";
import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/passwordResetPages/ForgotPassword";
import ResetPassword from "./pages/passwordResetPages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Incomes from "./pages/Incomes";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Categories from "./pages/Categories";
import Notifications from "./pages/Notifications";
import Account from "./pages/accountsPages/Account";
import Transactions from "./pages/Transactions";
import Statement from "./pages/Statement";
import AccountDelete from "./pages/accountsPages/AccountDelete";
import AccountChangePassword from "./pages/accountsPages/AccountChangePassword";
import AccountProfile from "./pages/accountsPages/AccountProfile";
import AccountReview from "./pages/accountsPages/AccountReview";
import AdminReviews from "./pages/adminPages/AdminReviews";
import AdminUsers from "./pages/adminPages/AdminUsers";
import AdminDashboard from "./pages/adminPages/AdminDashboard";
import {
  AdminRoute,
  ProtectedRoute,
  PublicOnlyRoute,
} from "./components/ProtectionRoutes";

function App() {
  return (
    <>
      <TopLoadingBar />
      <Routes>
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <Welcome />
              //{" "}
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incomes"
          element={
            <ProtectedRoute>
              <Incomes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/profile"
          element={
            <ProtectedRoute>
              <AccountProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/change-password"
          element={
            <ProtectedRoute>
              <AccountChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/delete"
          element={
            <ProtectedRoute>
              <AccountDelete />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/statement"
          element={
            <ProtectedRoute>
              <Statement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/review"
          element={
            <ProtectedRoute>
              <AccountReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <AdminRoute>
              <AdminReviews />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
