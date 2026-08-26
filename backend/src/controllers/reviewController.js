import Review from "../models/Review.js";

// Submit a review/feedback
export const createReview = async (req, res) => {
  try {
    const { message, rating } = req.body;

    if (!message || !message.trim()) {
      return res
        .status(400)
        .json({ message: "Please write your review before submitting" });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
      user: req.user._id,
      message: message.trim(),
      rating,
    });

    res.status(201).json({
      message: "Thank you for your feedback!",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Server error while submitting review" });
  }
};

// Get the logged-in user's own past reviews (includes admin reply, if any)
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Get my reviews error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching your reviews" });
  }
};

// Get all reviews from every user (admin only)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ message: "Server error while fetching reviews" });
  }
};

// Admin replies to a specific review
export const replyToReview = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Reply message cannot be empty" });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.reply = {
      message: message.trim(),
      repliedBy: req.user._id,
      repliedAt: new Date(),
    };

    await review.save();

    res.status(200).json({
      message: "Reply sent successfully",
      review,
    });
  } catch (error) {
    console.error("Reply to review error:", error);
    res.status(500).json({ message: "Server error while sending reply" });
  }
};
