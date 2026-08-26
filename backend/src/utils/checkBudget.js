import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import sendEmail from "./sendEmail.js";
import { createNotification } from "./createNotification.js";
import { baseEmailTemplate } from "./emailTemplate.js";

export const checkBudgetExceeded = async ({ userId, categoryId, date }) => {
  try {
    const expenseDate = new Date(date);
    const month = expenseDate.getMonth() + 1;
    const year = expenseDate.getFullYear();

    const budget = await Budget.findOne({
      user: userId,
      category: categoryId,
      month,
      year,
    }).populate("category", "name");

    if (!budget) return;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: userId,
      category: categoryId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const percentUsed = (totalSpent / budget.amount) * 100;
    const categoryName = budget.category.name;
    const user = await User.findById(userId);

    if (percentUsed >= 100 && !budget.alertSent) {
      await createNotification({
        userId,
        type: "budget-exceeded",
        message: `You've exceeded your "${categoryName}" budget for this month. Budget: ${budget.amount}, Spent: ${totalSpent}.`,
      });

      // Exceeded budget email
      try {
        await sendEmail({
          to: user.email,
          subject: `Budget Exceeded — ${categoryName}`,
          html: baseEmailTemplate({
            title: `Budget Exceeded: ${categoryName}`,
            bodyContent: `
      <p>Hi ${user.name},</p>
      <p>You've exceeded your set budget for <strong>${categoryName}</strong> this month.</p>
      <table width="100%" cellpadding="8" cellspacing="0" style="margin-top:12px; background-color:#fef2f2; border-radius:6px;">
        <tr>
          <td style="color:#991b1b; font-weight:600;">Budget</td>
          <td style="color:#991b1b; text-align:right;">${budget.amount}</td>
        </tr>
        <tr>
          <td style="color:#991b1b; font-weight:600;">Total Spent</td>
          <td style="color:#991b1b; text-align:right;">${totalSpent}</td>
        </tr>
      </table>
      <p style="margin-top:16px;">Consider reviewing your spending in this category.</p>
    `,
          }),
        });
      } catch (emailError) {
        console.error("Exceeded budget email failed to send", emailError);
      }

      budget.alertSent = true;
      budget.warningSent = true;
      await budget.save();
      return;
    }

    //  85% to 99%: WARNING alert
    if (percentUsed >= 85 && !budget.warningSent) {
      await createNotification({
        userId,
        type: "budget-warning",
        message: `You've used ${percentUsed.toFixed(0)}% of your "${categoryName}" budget this month. Budget: ${budget.amount}, Spent so far: ${totalSpent}.`,
      });

      // Warning alert email
      try {
        await sendEmail({
          to: user.email,
          subject: `Budget Warning — ${categoryName} (${percentUsed.toFixed(0)}% used)`,
          html: baseEmailTemplate({
            title: `Budget Warning: ${categoryName}`,
            bodyContent: `
      <p>Hi ${user.name},</p>
      <p>You've used <strong>${percentUsed.toFixed(0)}%</strong> of your <strong>${categoryName}</strong> budget for this month.</p>
      <table width="100%" cellpadding="8" cellspacing="0" style="margin-top:12px; background-color:#fffbeb; border-radius:6px;">
        <tr>
          <td style="color:#92400e; font-weight:600;">Budget</td>
          <td style="color:#92400e; text-align:right;">${budget.amount}</td>
        </tr>
        <tr>
          <td style="color:#92400e; font-weight:600;">Spent so far</td>
          <td style="color:#92400e; text-align:right;">${totalSpent}</td>
        </tr>
      </table>
      <p style="margin-top:16px;">You're approaching your limit — consider slowing down spending in this category.</p>
    `,
          }),
        });
      } catch (emailError) {
        console.error("Budget warning email failed to send:", emailError);
      }

      budget.warningSent = true;
      await budget.save();
    }
  } catch (error) {
    console.error("Budget check error:", error);
  }
};
