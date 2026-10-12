import { FaStar, FaQuoteLeft } from "react-icons/fa";

const reviews = [
  {
    name: "Nusrat Jahan",
    role: "Tenant, Dhaka",
    rating: 5,
    text: "Booking was quick and the reservation fee was clear from the start. I moved in without any surprises.",
  },
  {
    name: "Tanvir Ahmed",
    role: "Tenant, Sylhet",
    rating: 5,
    text: "The filters saved me hours. I found a flat in my budget in one evening.",
  },
  {
    name: "Mehnaz Rahman",
    role: "Property Owner",
    rating: 4,
    text: "Listing my apartment was simple, and the booking requests arrived in one place.",
  },
  {
    name: "Imran Hossain",
    role: "Tenant, Chattogram",
    rating: 5,
    text: "Everything was in one dashboard: my bookings, favorites and payments.",
  },
];

const CustomerReviews = () => (
  <section className="bg-white py-16">
    <div className="mx-auto max-w-7xl px-4">
      <h2 className="text-center font-heading text-3xl font-bold text-teal-brand md:text-4xl">
        What Our Customers Say
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="flex h-full flex-col rounded-xl border border-charcoal/10 bg-cream p-6"
          >
            <FaQuoteLeft className="text-2xl text-amber-brand" />
            <p className="mt-4 flex-1 text-sm text-charcoal/80">{review.text}</p>
            <div className="mt-4 flex gap-1 text-amber-brand">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={i < review.rating ? "" : "text-charcoal/20"}
                />
              ))}
            </div>
            <p className="mt-2 font-semibold text-charcoal">{review.name}</p>
            <p className="text-xs text-charcoal/60">{review.role}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CustomerReviews;