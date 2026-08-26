import Notification from "../models/Notification.js";

//  Get all notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching notifications" });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ notification });
  } catch (error) {
    console.error("Mark as read error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating notification" });
  }
};
