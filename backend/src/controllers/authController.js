import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import { baseEmailTemplate } from "../utils/emailTemplate.js";
import Category from "../models/Category.js";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import Notification from "../models/Notification.js";
import Review from "../models/Review.js";

const getAdminEmails = () => {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export const registerUser = async (req, res) => {
  try {
    const { firstName, surname, email, password } = req.body;

    if (!firstName || !surname || !email || !password) {
      return res.status(400).json({
        message: "Please provide first name, surname, email, and password",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    const isAdminEmail = getAdminEmails().includes(email.toLowerCase());

    const user = await User.create({
      firstName,
      surname,
      email,
      password,
      role: isAdminEmail ? "admin" : "user",
      lastLogin: new Date(),
      verificationToken,
      verificationTokenExpires,
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to XTracker - Verify your email",
        html: baseEmailTemplate({
          title: `Welcome, ${user.firstName} 👋`,
          bodyContent: `
      <p>Thanks for signing up for XTracker! We're excited to help you take control of your finances.</p>
      <p>Please verify your email address. This link expires in 24 hours.</p>
    `,
          buttonText: "Verify Email",
          buttonUrl: verifyUrl,
        }),
      });
    } catch (emailError) {
      console.error("Welcome email failed to send:", emailError);
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

//Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: "Server error during email verification" });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isAdminEmail = getAdminEmails().includes(user.email.toLowerCase());
    if (isAdminEmail && user.role !== "admin") {
      user.role = "admin";
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// User's profile
export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        surname: req.user.surname,
        email: req.user.email,
        isVerified: req.user.isVerified,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide current and new password" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    // change password email
    try {
      await sendEmail({
        to: user.email,
        subject: "Your XTracker password was changed",
        html: baseEmailTemplate({
          title: "Password Changed",
          bodyContent: `
      <p>Hi ${user.firstName},</p>
      <p>This is a confirmation that your XTracker account password was just changed.</p>
      <p style="margin-top:16px; padding:12px; background-color:#fef2f2; border-left:4px solid #ef4444; border-radius:4px; color:#991b1b;">
        If you did not make this change, please contact support immediately.
      </p>
    `,
        }),
      });
    } catch (emailError) {
      console.error("Welcome email failed to send:", emailError);
    }

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error while changing password" });
  }
};

// forgot password reset with email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide your email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "XTracker Password Reset Request",
      html: baseEmailTemplate({
        title: "Reset Your Password",
        bodyContent: `
      <p>Hi ${user.firstName},</p>
      <p>We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
    `,
        buttonText: "Reset Password",
        buttonUrl: resetUrl,
      }),
    });

    res.status(200).json({
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error while processing request" });
  }
};

// Forgotton password using token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Forgot password reset email
    await sendEmail({
      to: user.email,
      subject: "Your XTracker password was reset",
      html: baseEmailTemplate({
        title: "Password Reset Successful",
        bodyContent: `
      <p>Hi ${user.firstName},</p>
      <p>Your password has just been reset successfully. You can now log in with your new password.</p>
      <p style="margin-top:16px; padding:12px; background-color:#fef2f2; border-left:4px solid #ef4444; border-radius:4px; color:#991b1b;">
        If you did not do this, please contact support immediately.
      </p>
    `,
      }),
    });

    res
      .status(200)
      .json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error while resetting password" });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// Delete user's account
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Please enter your password to confirm deletion" });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const userEmail = user.email;
    const userFirstName = user.firstName;
    const userId = req.user._id;

    await Promise.all([
      Category.deleteMany({ user: userId }),
      Income.deleteMany({ user: userId }),
      Expense.deleteMany({ user: userId }),
      Budget.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
      Review.deleteMany({ user: userId }),
    ]);

    await User.findByIdAndDelete(userId);

    // Account deleted email
    try {
      await sendEmail({
        to: userEmail,
        subject: "Your XTracker account has been deleted",
        html: baseEmailTemplate({
          title: "Account Deleted",
          bodyContent: `
      <p>Hi ${userFirstName},</p>
      <p>Your XTracker account and all associated data have been permanently deleted, as requested.</p>
      <p style="margin-top:16px; padding:12px; background-color:#fef2f2; border-left:4px solid #ef4444; border-radius:4px; color:#991b1b;">
        If you did not request this, please contact support immediately.
      </p>
    `,
        }),
      });
    } catch (emailError) {
      console.error("Account deletion email failed to send:", emailError);
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error while deleting account" });
  }
};
