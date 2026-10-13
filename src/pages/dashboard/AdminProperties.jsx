import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const statusStyles = {
  pending: "bg-amber-brand/20 text-amber-deep",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const overlayClass =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4";
const modalClass = "w-full max-w-md rounded-xl bg-white p-6 shadow-lg";
const amberButton =
  "rounded-md bg-amber-brand px-6 py-2 font-medium text-charcoal " +
  "hover:bg-amber-deep disabled:opacity-60";
const outlineButton =
  "rounded-md border border-teal-brand px-6 py-2 font-medium text-teal-brand " +
  "hover:bg-teal-brand hover:text-cream";
const approveClass =
  "flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 " +
  "text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60";
const rejectClass =
  "flex items-center gap-2 rounded-md border border-red-300 px-3 py-1.5 " +
  "text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60";
const updateClass =
  "flex items-center gap-2 rounded-md border border-teal-brand px-3 py-1.5 " +
  "text-xs font-medium text-teal-brand hover:bg-teal-brand hover:text-cream";

const AdminProperties = () => {
  const axiosSecure = useAxiosSecure();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    axiosSecure
      .get("/admin/properties")
      .then((res) => {
        if (active) setProperties(res.data);
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

  const approve = async (id) => {
    try {
      setBusyId(id);
      await axiosSecure.patch(`/admin/properties/${id}/status`, {
        status: "approved",
      });
      setProperties((prev) =>
        prev.map((p) => {
          if (p._id !== id) return p;
          const { rejectionFeedback, ...rest } = p;
          return { ...rest, status: "approved" };
        })
      );
      toast.success("Property approved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not approve. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const openReject = (property) => {
    setFeedback("");
    setRejectTarget(property);
  };

  const submitReject = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      return toast.error("Please write the rejection feedback");
    }
    try {
      setSaving(true);
      await axiosSecure.patch(`/admin/properties/${rejectTarget._id}/status`, {
        status: "rejected",
        feedback,
      });
      setProperties((prev) =>
        prev.map((p) =>
          p._id === rejectTarget._id
            ? { ...p, status: "rejected", rejectionFeedback: feedback.trim() }
            : p
        )
      );
      toast.success("Property rejected");
      setRejectTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not reject. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setSaving(true);
      await axiosSecure.delete(`/admin/properties/${deleteTarget._id}`);
      setProperties((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success("Property deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-teal-brand">
        All Properties
      </h1>

      {loading && <p className="mt-6 text-charcoal/70">Loading properties...</p>}

      {error && (
        <p className="mt-6 text-red-600">
          Could not load properties. Please refresh the page.
        </p>
      )}

      {!loading && !error && properties.length === 0 && (
        <p className="mt-6 text-charcoal/70">No properties yet.</p>
      )}

      {!loading && !error && properties.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal/70">
                <th className="py-3 pr-4 font-semibold">Property</th>
                <th className="py-3 pr-4 font-semibold">Owner</th>
                <th className="py-3 pr-4 font-semibold">Rent</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property._id}
                  className="border-b border-charcoal/5 last:border-0"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.images?.[0]}
                        alt={property.title}
                        className="h-12 w-16 rounded-md bg-cream object-cover"
                      />
                      <div>
                        <p className="font-semibold text-charcoal">
                          {property.title}
                        </p>
                        <p className="text-xs text-charcoal/60">
                          {property.location} · {property.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-charcoal">{property.ownerName}</p>
                    <p className="text-xs text-charcoal/60">
                      {property.ownerEmail}
                    </p>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-charcoal">
                    ${Number(property.rent).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[property.status] ||
                        "bg-charcoal/10 text-charcoal"
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      {property.status !== "approved" && (
                        <button
                          onClick={() => approve(property._id)}
                          disabled={busyId === property._id}
                          className={approveClass}
                        >
                          <FaCheck /> Approve
                        </button>
                      )}
                      {property.status !== "rejected" && (
                        <button
                          onClick={() => openReject(property)}
                          className={rejectClass}
                        >
                          <FaTimes /> Reject
                        </button>
                      )}
                      <Link
                        to={`/dashboard/all-properties/edit/${property._id}`}
                        className={updateClass}
                      >
                        <FaEdit /> Update
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(property)}
                        className={rejectClass}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection feedback modal */}
      {rejectTarget && (
        <div className={overlayClass}>
          <form onSubmit={submitReject} className={modalClass}>
            <h2 className="font-heading text-xl font-bold text-teal-brand">
              Reject property
            </h2>
            <p className="mt-1 text-sm text-charcoal/60">
              {rejectTarget.title}
            </p>
            <label className="mt-4 block text-sm font-medium text-charcoal">
              Rejection feedback for the owner
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={500}
              rows={4}
              required
              placeholder="Explain what the owner should fix..."
              className="mt-1 w-full rounded-md border border-charcoal/20 p-3 text-sm outline-none focus:border-teal-brand"
            />
            <p className="mt-1 text-right text-xs text-charcoal/50">
              {feedback.length}/500
            </p>
            <div className="mt-4 flex gap-3">
              <button type="submit" disabled={saving} className={amberButton}>
                {saving ? "Rejecting..." : "Reject"}
              </button>
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                disabled={saving}
                className={outlineButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className={overlayClass}>
          <div className={modalClass}>
            <h2 className="font-heading text-xl font-bold text-teal-brand">
              Delete this property?
            </h2>
            <p className="mt-3 text-sm text-charcoal/80">
              "{deleteTarget.title}" will be removed permanently.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="rounded-md bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={saving}
                className={outlineButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;