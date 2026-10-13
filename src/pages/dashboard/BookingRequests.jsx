import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const statusStyles = {
  pending: "bg-amber-brand/20 text-amber-deep",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const approveClass =
  "flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 " +
  "text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60";
const rejectClass =
  "flex items-center gap-2 rounded-md border border-red-300 px-3 py-1.5 " +
  "text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60";

const BookingRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let active = true;
    axiosSecure
      .get("/bookings/requests")
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

  const decide = async (id, status) => {
    try {
      setBusyId(id);
      await axiosSecure.patch(`/bookings/${id}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, bookingStatus: status } : b))
      );
      toast.success(
        status === "approved" ? "Booking approved" : "Booking rejected"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not update. Try again."
      );
    } finally {
      setBusyId(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-teal-brand">
        Booking Requests
      </h1>

      {loading && <p className="mt-6 text-charcoal/70">Loading requests...</p>}

      {error && (
        <p className="mt-6 text-red-600">
          Could not load booking requests. Please refresh the page.
        </p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p className="mt-6 text-charcoal/70">
          No booking requests yet. They will appear here when a tenant
          books one of your properties.
        </p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal/70">
                <th className="py-3 pr-4 font-semibold">Tenant</th>
                <th className="py-3 pr-4 font-semibold">Property</th>
                <th className="py-3 pr-4 font-semibold">Booking Amount</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 font-semibold">Actions</th>
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
                      {booking.tenantName}
                    </p>
                    <p className="text-xs text-charcoal/60">
                      {booking.tenantEmail}
                    </p>
                    <p className="text-xs text-charcoal/60">{booking.phone}</p>
                  </td>
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
                        <p className="text-xs text-charcoal/60">
                          Move-in: {formatDate(booking.moveInDate)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-charcoal">
                    ${Number(booking.amount).toFixed(2)}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[booking.bookingStatus] ||
                        "bg-charcoal/10 text-charcoal"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3">
                    {booking.bookingStatus === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => decide(booking._id, "approved")}
                          disabled={busyId === booking._id}
                          className={approveClass}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          onClick={() => decide(booking._id, "rejected")}
                          disabled={busyId === booking._id}
                          className={rejectClass}
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-charcoal/50">Decided</span>
                    )}
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

export default BookingRequests;