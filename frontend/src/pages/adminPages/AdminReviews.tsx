import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Star, MessageSquare, Reply } from "lucide-react";
import axios from "axios";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import { getAllReviews, replyToReview } from "../../api/reviewApi";
import type { Review } from "../../types";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data.reviews);
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReplySubmit = async (e: FormEvent, reviewId: string) => {
    e.preventDefault();
    const message = replyDrafts[reviewId]?.trim();
    if (!message) return;

    setSubmittingId(reviewId);
    try {
      await replyToReview(reviewId, message);
      setOpenReplyId(null);
      setReplyDrafts((prev) => ({ ...prev, [reviewId]: "" }));
      fetchReviews();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to send reply");
      } else {
        setError("Failed to send reply");
      }
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Reviews
        </h1>

        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <MessageSquare size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {review.user?.name || "Unknown user"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {review.user?.email}
                    </p>
                  </div>
                  {review.rating && (
                    <div className="flex gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={13}
                          className="text-amber-400"
                          fill={
                            star <= review.rating! ? "currentColor" : "none"
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-700 mt-2">{review.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>

                {review.reply?.message ? (
                  <div className="mt-3 flex gap-2 bg-blue-50 border border-blue-100 rounded-md p-3">
                    <Reply
                      size={14}
                      className="text-blue-500 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-blue-700 mb-1">
                        Your reply
                      </p>
                      <p className="text-sm text-gray-700">
                        {review.reply.message}
                      </p>
                    </div>
                  </div>
                ) : openReplyId === review._id ? (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, review._id)}
                    className="mt-3 space-y-2"
                  >
                    <textarea
                      value={replyDrafts[review._id] || ""}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [review._id]: e.target.value,
                        }))
                      }
                      rows={3}
                      maxLength={1000}
                      placeholder="Write a reply..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={submittingId === review._id}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {submittingId === review._id
                          ? "Sending..."
                          : "Send Reply"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenReplyId(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setOpenReplyId(review._id)}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reply
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
