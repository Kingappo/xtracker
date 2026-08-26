import User from "../models/User.js";
import Review from "../models/Review.js";

const ACTIVE_WINDOW_DAYS = 7;

// Get all registered users, with an isActive flag based on recent login
export const getAllUsers = async (req, res) => {
  try {
    const activeSince = new Date(
      Date.now() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    );

    const users = await User.find().sort({ createdAt: -1 });

    const usersWithActivity = users.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      isActive: user.lastLogin ? user.lastLogin >= activeSince : false,
    }));

    res.status(200).json({ users: usersWithActivity });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// Get summary stats for the admin dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const activeSince = new Date(
      Date.now() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    );

    const [totalUsers, activeUsers, totalReviews] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: activeSince } }),
      Review.countDocuments(),
    ]);

    res.status(200).json({
      totalUsers,
      activeUsers,
      totalReviews,
      activeWindowDays: ACTIVE_WINDOW_DAYS,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
};
