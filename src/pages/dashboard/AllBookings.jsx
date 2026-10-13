import { useEffect, useState } from "react";
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

const AllBookings = () => {
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    axiosSecure
      .get("/admin/bookings")
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
        All Bookings
      </h1>

      {loading && <p className="mt-6 text-charcoal/70">Loading bookings...</p>}

      {error && (
        <p className="mt-6 text-red-600">
          Could not load bookings. Please refresh the page.
        </p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p className="mt-6 text-charcoal/70">No bookings yet.</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal/70">
                <th className="py-3 pr-4 font-semibold">Property</th>
                <th className="py-3 pr-4 font-semibold">Tenant</th>
                <th className="py-3 pr-4 font-semibold">Owner</th>
                <th className="py-3 pr-4 font-semibold">Booked On</th>
                <th className="py-3 pr-4 font-semibold">Amount</th>
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
                    <p className="font-semibold text-charcoal">
                      {booking.propertyTitle}
                    </p>
                    <p className="text-xs text-charcoal/60">
                      {booking.location}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-charcoal">{booking.tenantName}</p>
                    <p className="text-xs text-charcoal/60">
                      {booking.tenantEmail}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-charcoal">{booking.ownerName}</p>
                    <p className="text-xs text-charcoal/60">
                      {booking.ownerEmail}
                    </p>
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

export default AllBookings;