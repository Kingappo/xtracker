export interface User {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  isVerified: boolean;
  role: "user" | "admin";
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Category {
  _id: string;
  name: string;
  type: "income" | "expense";
}

export interface Income {
  _id: string;
  category: Category;
  amount: number;
  description?: string;
  date: string;
}

export interface Expense {
  _id: string;
  category: Category;
  amount: number;
  description?: string;
  date: string;
}

export interface Budget {
  _id: string;
  category: Category;
  amount: number;
  month: number;
  year: number;
  warningSent: boolean;
  alertSent: boolean;
}

export interface AppNotification {
  _id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  category: Category;
  amount: number;
  description?: string;
  date: string;
  transactionType: "income" | "expense";
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StatementTransaction {
  _id: string;
  category: { _id: string; name: string };
  amount: number;
  description?: string;
  date: string;
  transactionType: "income" | "expense";
}

export interface BudgetPerformance {
  category: string;
  month: number;
  year: number;
  budgetAmount: number;
  spent: number;
  percentUsed: number;
  status: "exceeded" | "warning" | "on-track";
}

export interface Statement {
  user: { firstName: string; surname: string; email: string };
  period: { startDate: string; endDate: string };
  summary: {
    totalIncome: number;
    totalExpense: number;
    netChange: number;
  };
  transactions: StatementTransaction[];
  budgetPerformance: BudgetPerformance[];
  generatedAt: string;
}

export interface ReviewReply {
  message: string;
  repliedBy: string;
  repliedAt: string;
}

export interface Review {
  _id: string;
  user?: { _id: string; name: string; email: string };
  message: string;
  rating?: number;
  reply?: ReviewReply;
  createdAt: string;
}
export interface AdminUser {
  _id: string;
  firstName: string;
  surname: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  isActive: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalReviews: number;
  activeWindowDays: number;
}
