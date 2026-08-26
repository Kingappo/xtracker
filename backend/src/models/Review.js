import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: [true, "Review message is required"],
      trim: true,
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    reply: {
      message: {
        type: String,
        trim: true,
        maxlength: [1000, "Reply cannot exceed 1000 characters"],
      },
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      repliedAt: {
        type: Date,
      },
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
