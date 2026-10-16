import { useEffect, useRef, useState } from "react";
import {
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Reveal from "./Reveal";
import useAxiosPublic from "../hooks/useAxiosPublic";

const CustomerReviews = () => {
  const reviewsContainerRef = useRef(null);
  const axiosPublic = useAxiosPublic();
  const [reviews, setReviews] = useState([]);

  // Real reviews from the database (rated 4 or 5 stars, up to four).
  useEffect(() => {
    let active = true;

    axiosPublic
      .get("/reviews/featured")
      .then((res) => {
        if (!active) return;

        const list = Array.isArray(res.data) ? res.data : [];

        // Same field names the cards already use, so the design is unchanged.
        setReviews(
          list.map((item) => ({
            id: item._id,
            name: item.reviewerName || "Tenant",
            role: "Tenant",
            location: "RentNest member",
            rating: item.rating,
            text: item.comment,
          }))
        );
      })
      .catch(() => {
        if (active) setReviews([]);
      });

    return () => {
      active = false;
    };
  }, [axiosPublic]);

  const scrollReviews = (direction) => {
    const container = reviewsContainerRef.current;

    if (!container) return;

    const firstCard = container.querySelector("[data-review-card]");
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 16;
    const scrollAmount = cardWidth + gap;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;

    // Next: loop back to the first review.
    if (direction > 0 && currentScroll >= maxScroll - 5) {
      container.scrollTo({
        left: 0,
        behavior: "smooth",
      });
      return;
    }

    // Previous: loop to the last review.
    if (direction < 0 && currentScroll <= 5) {
      container.scrollTo({
        left: maxScroll,
        behavior: "smooth",
      });
      return;
    }

    container.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-teal-dark py-16 text-cream sm:py-20">
      {/* Background image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80"
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-teal-dark/95 via-teal-dark/90 to-teal-dark/75" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.6fr] lg:items-center lg:gap-14">
          {/* Section introduction and navigation */}
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-brand">
              Tenant experiences
            </p>

            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl">
              What our
              <br />
              customers <span className="italic text-amber-brand">say.</span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-cream/75">
              Finding a home is personal. We're here to make the journey feel
              simpler, clearer and more comfortable.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => scrollReviews(-1)}
                aria-label="Previous reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 text-cream/80 transition hover:border-amber-brand hover:bg-amber-brand hover:text-teal-dark focus:outline-none focus:ring-2 focus:ring-amber-brand"
              >
                <FaArrowLeft className="text-xs" />
              </button>

              <button
                type="button"
                onClick={() => scrollReviews(1)}
                aria-label="Next reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 text-cream/80 transition hover:border-amber-brand hover:bg-amber-brand hover:text-teal-dark focus:outline-none focus:ring-2 focus:ring-amber-brand"
              >
                <FaArrowRight className="text-xs" />
              </button>
            </div>

            <p className="mt-4 text-xs text-cream/55">
              Explore our customer stories
            </p>
          </Reveal>

          {/* Review carousel */}
          <div
            ref={reviewsContainerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Customer reviews"
          >
            {reviews.length === 0 && (
              <p className="text-sm text-cream/70">
                No reviews yet. Be the first to share your experience.
              </p>
            )}

            {reviews.map((review, index) => (
              <Reveal
                key={review.id}
                delay={index * 0.08}
                className="h-full w-full shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] xl:w-[calc((100%-2rem)/3)]"
              >
                <figure
                  data-review-card
                  className="flex h-full min-h-[290px] flex-col rounded-2xl bg-cream p-5 text-charcoal shadow-xl sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="font-heading text-4xl leading-none text-amber-deep"
                  >
                    “
                  </span>

                  <blockquote className="mt-1 flex-1 text-sm leading-6 text-charcoal/75">
                    {review.text}
                  </blockquote>

                  {/* Star rating */}
                  <div
                    className="mt-5 flex gap-1 text-amber-deep"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? "" : "opacity-25"}
                      />
                    ))}
                  </div>

                  {/* Reviewer details */}
                  <figcaption className="mt-4 border-t border-charcoal/10 pt-4">
                    <p className="text-sm font-semibold">{review.name}</p>

                    <p className="mt-1 text-xs text-charcoal/55">
                      {review.role}
                    </p>

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-charcoal/65">
                      <FaMapMarkerAlt
                        className="shrink-0 text-amber-deep"
                        aria-hidden="true"
                      />
                      {review.location}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;