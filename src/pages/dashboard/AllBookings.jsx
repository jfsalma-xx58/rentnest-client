import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const statusStyles = {
  pending: "bg-amber-brand/20 text-amber-deep",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  paid: "bg-teal-brand/10 text-teal-brand",
};

const Badge = ({ value }) => {
  const status = value || "unknown";

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        statusStyles[status] || "bg-charcoal/10 text-charcoal"
      }`}
    >
      {status}
    </span>
  );
};

// The reservation fee is already saved in BDT, so it is not converted.
const formatBdtAmount = (amountBdt) => {
  const amount = Number(amountBdt);

  if (!Number.isFinite(amount)) return "—";

  return `৳${new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

// What Stripe actually charged, in USD (saved with each booking).
const formatUsdAmount = (amountUsd) => {
  const amount = Number(amountUsd);

  if (!Number.isFinite(amount) || amount <= 0) return "";

  return `$${amount.toFixed(2)} USD charged`;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const AllBookings = () => {
  const axiosSecure = useAxiosSecure();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await axiosSecure.get("/admin/bookings");

        if (active) {
          setBookings(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      active = false;
    };
  }, [axiosSecure]);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-teal-brand">
            All Bookings
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Review property reservations and payment statuses.
          </p>
        </div>

        {!loading && !error && (
          <span className="rounded-full bg-teal-brand/10 px-3 py-1 text-sm font-semibold text-teal-brand">
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
          </span>
        )}
      </div>

      {loading && (
        <p className="mt-6 text-charcoal/70">Loading bookings...</p>
      )}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          <p>Could not load bookings. Please try again.</p>
          <button
            type="button"
            onClick={() => {
              setError(false);
              setLoading(true);

              axiosSecure
                .get("/admin/bookings")
                .then((res) => {
                  setBookings(Array.isArray(res.data) ? res.data : []);
                })
                .catch(() => setError(true))
                .finally(() => setLoading(false));
            }}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p className="mt-6 text-charcoal/70">No bookings yet.</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal/70">
                <th className="py-3 pr-4 font-semibold">Property</th>
                <th className="py-3 pr-4 font-semibold">Tenant</th>
                <th className="py-3 pr-4 font-semibold">Owner</th>
                <th className="py-3 pr-4 font-semibold">Booked On</th>
                <th className="py-3 pr-4 font-semibold">Amount (BDT)</th>
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
                      {booking.propertyTitle || "Untitled property"}
                    </p>
                    <p className="text-xs text-charcoal/60">
                      {booking.location || "Location unavailable"}
                    </p>
                  </td>

                  <td className="py-3 pr-4">
                    <p className="text-charcoal">
                      {booking.tenantName || "—"}
                    </p>
                    <p className="text-xs text-charcoal/60">
                      {booking.tenantEmail || "—"}
                    </p>
                  </td>

                  <td className="py-3 pr-4">
                    <p className="text-charcoal">
                      {booking.ownerName || "—"}
                    </p>
                    <p className="text-xs text-charcoal/60">
                      {booking.ownerEmail || "—"}
                    </p>
                  </td>

                  <td className="py-3 pr-4 text-charcoal">
                    {formatDate(booking.createdAt)}
                  </td>

                  <td className="py-3 pr-4">
                    <p className="font-semibold text-teal-brand">
                      {formatBdtAmount(booking.amount)}
                    </p>
                    {formatUsdAmount(booking.chargedAmount) && (
                      <p className="mt-1 text-xs text-charcoal/60">
                        {formatUsdAmount(booking.chargedAmount)}
                      </p>
                    )}
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

          <p className="mt-4 text-xs text-charcoal/50">
            Fees are saved in BDT. The USD figure is the amount Stripe
            charged the card.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllBookings;