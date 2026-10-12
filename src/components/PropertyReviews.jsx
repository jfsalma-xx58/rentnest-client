import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Stars = ({ value }) => (
  <div className="flex gap-1 text-amber-brand">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar key={i} className={i < value ? "" : "text-charcoal/20"} />
    ))}
  </div>
);

const PropertyReviews = ({ propertyId }) => {
  const { user } = useAuth();
  const [role] = useRole();
  const axiosSecure = useAxiosSecure();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    axiosSecure
      .get(`/reviews/${propertyId}`)
      .then((res) => {
        if (active) setReviews(res.data);
      })
      .catch(() => {
        if (active) setReviews([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [axiosSecure, propertyId]);

  const alreadyReviewed = reviews.some(
    (review) => review.reviewerEmail === user?.email
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      return toast.error("Please choose a star rating");
    }
    if (!comment.trim()) {
      return toast.error("Please write a comment");
    }
    try {
      setSubmitting(true);
      const res = await axiosSecure.post("/reviews", {
        propertyId,
        rating,
        comment,
      });
      setReviews((prev) => [res.data.review, ...prev]);
      setRating(0);
      setComment("");
      toast.success("Thanks for your review!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not post review. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-teal-brand">
        Reviews ({reviews.length})
      </h2>

      {role === "tenant" && !alreadyReviewed && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm"
        >
          <p className="font-medium text-charcoal">Share your experience</p>

          <div className="mt-3 flex gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
              >
                <FaStar
                  className={
                    star <= (hover || rating)
                      ? "text-amber-brand"
                      : "text-charcoal/20"
                  }
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Write your review..."
            className="mt-4 w-full rounded-md border border-charcoal/20 p-3 text-sm outline-none focus:border-teal-brand"
          />
          <p className="mt-1 text-right text-xs text-charcoal/50">
            {comment.length}/500
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-md bg-amber-brand px-6 py-2 font-medium text-charcoal transition-colors hover:bg-amber-deep disabled:opacity-60"
          >
            {submitting ? "Posting..." : "Post Review"}
          </button>
        </form>
      )}

      {role === "tenant" && alreadyReviewed && (
        <p className="mt-4 text-sm text-charcoal/70">
          You have already reviewed this property.
        </p>
      )}

      {loading && <p className="mt-6 text-charcoal/70">Loading reviews...</p>}

      {!loading && reviews.length === 0 && (
        <p className="mt-6 text-charcoal/70">
          No reviews yet. Be the first to share your experience.
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-xl border border-charcoal/10 bg-white p-5"
            >
              <div className="flex items-center gap-3">
                {review.reviewerPhoto ? (
                  <img
                    src={review.reviewerPhoto}
                    alt={review.reviewerName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-brand text-cream">
                    {review.reviewerName?.[0] || "T"}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-charcoal">
                    {review.reviewerName}
                  </p>
                  <p className="truncate text-xs text-charcoal/60">
                    {review.reviewerEmail}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Stars value={review.rating} />
                <span className="text-xs text-charcoal/60">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <p className="mt-3 text-sm text-charcoal/80">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PropertyReviews;