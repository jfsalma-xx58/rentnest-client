import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const statusStyles = {
  pending: "bg-amber-brand/20 text-amber-deep",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  paid: "bg-teal-brand/10 text-teal-brand",
};

const Badge = ({ value }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
      statusStyles[value] || "bg-charcoal/10 text-charcoal"
    }`}
  >
    {value}
  </span>
);

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    axiosSecure
      .get("/bookings/my")
      .then((res) => {
        if (active) setBookings(res.data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [axiosSecure]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-teal-brand">
        My Bookings
      </h1>

      {loading && <p className="mt-6 text-charcoal/70">Loading bookings...</p>}

      {error && (
        <p className="mt-6 text-red-600">
          Could not load your bookings. Please refresh the page.
        </p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="mt-6 text-center">
          <p className="text-charcoal/70">You haven't booked any property yet.</p>
          <Link
            to="/properties"
            className="mt-4 inline-block rounded-md bg-amber-brand px-5 py-2 font-medium text-charcoal transition-colors hover:bg-amber-deep"
          >
            Browse Properties
          </Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal/70">
                <th className="py-3 pr-4 font-semibold">Property</th>
                <th className="py-3 pr-4 font-semibold">Booking Date</th>
                <th className="py-3 pr-4 font-semibold">Amount Paid</th>
                <th className="py-3 pr-4 font-semibold">Booking Status</th>
                <th className="py-3 font-semibold">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-charcoal/5 last:border-0"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.propertyImage}
                        alt={booking.propertyTitle}
                        className="h-12 w-16 rounded-md bg-cream object-cover"
                      />
                      <div>
                        <p className="font-semibold text-charcoal">
                          {booking.propertyTitle}
                        </p>
                        <p className="text-xs text-charcoal/60">
                          {booking.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-charcoal">
                    {formatDate(booking.createdAt)}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-charcoal">
                    ${Number(booking.amount).toFixed(2)}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge value={booking.bookingStatus} />
                  </td>
                  <td className="py-3">
                    <Badge value={booking.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;