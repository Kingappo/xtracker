import Notification from "../models/Notification.js";

export const createNotification = async ({
  userId,
  message,
  type = "general",
}) => {
  try {
    await Notification.create({ user: userId, message, type });
  } catch (error) {
    console.error("Create notification error:", error);
    // don't throw — a failed notification shouldn't break the main action
  }
};
