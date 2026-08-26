import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, MessageSquare, Reply } from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import { createReview, getMyReviews } from "../../api/reviewApi";
import type { Review } from "../../types";
import axios from "axios";

const AccountReview = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pastReviews, setPastReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const fetchMyReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const res = await getMyReviews();
      setPastReviews(res.reviews);
    } catch (err) {
      // fail silently, not critical if this list doesn't load
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!message.trim()) {
      setError("Please write your feedback before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createReview({
        message,
        rating: rating > 0 ? rating : undefined,
      });
      setSuccess(res.message);
      setMessage("");
      setRating(0);
      fetchMyReviews();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to submit review");
      } else {
        setError("Failed to submit review");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          to="/account"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"
        >
          <ArrowLeft size={16} /> Back to Account
        </Link>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Send Feedback
        </h1>

        {/* Submit form */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 mb-6">
          <p className="text-sm text-gray-500 mb-4">
            We'd love to hear what you think of XTracker, what's working, what's
            not, or what you'd like to see next.
          </p>

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (optional)
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star === rating ? 0 : star)}
                    className="text-amber-400 hover:scale-110 transition"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={24}
                      fill={star <= rating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Feedback
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Tell us what you think..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                {message.length}/1000
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Feedback"}
            </button>
          </form>
        </div>

        {/* Past reviews */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Your Past Feedback
          </h2>

          {isLoadingReviews ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : pastReviews.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <MessageSquare size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">
                You haven't sent any feedback yet.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {pastReviews.map((review) => (
                <div key={review._id} className="p-4">
                  {review.rating && (
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className="text-amber-400"
                          fill={
                            star <= review.rating! ? "currentColor" : "none"
                          }
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-700">{review.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>

                  {review.reply?.message && (
                    <div className="mt-3 flex gap-2 bg-blue-50 border border-blue-100 rounded-md p-3">
                      <Reply
                        size={14}
                        className="text-blue-500 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-blue-700 mb-1">
                          Reply from XTracker team
                        </p>
                        <p className="text-sm text-gray-700">
                          {review.reply.message}
                        </p>
                        {review.reply.repliedAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(
                              review.reply.repliedAt,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountReview;
