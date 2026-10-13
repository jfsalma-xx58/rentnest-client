import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
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
  "rounded-md bg-amber-brand px-6 py-2 font-medium text-charcoal hover:bg-amber-deep";
const outlineButton =
  "rounded-md border border-teal-brand px-6 py-2 font-medium text-teal-brand hover:bg-teal-brand hover:text-cream";

const MyProperties = () => {
  const axiosSecure = useAxiosSecure();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [feedbackFor, setFeedbackFor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    axiosSecure
      .get("/properties/mine")
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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axiosSecure.delete(`/properties/${deleteTarget._id}`);
      setProperties((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success("Property deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-teal-brand">
        My Properties
      </h1>

      {loading && <p className="mt-6 text-charcoal/70">Loading properties...</p>}

      {error && (
        <p className="mt-6 text-red-600">
          Could not load your properties. Please refresh the page.
        </p>
      )}

      {!loading && !error && properties.length === 0 && (
        <div className="mt-6 text-center">
          <p className="text-charcoal/70">You haven't added any property yet.</p>
          <Link
            to="/dashboard/add-property"
            className={`mt-4 inline-block ${amberButton}`}
          >
            Add Property
          </Link>
        </div>
      )}

      {!loading && !error && properties.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal/70">
                <th className="py-3 pr-4 font-semibold">Property</th>
                <th className="py-3 pr-4 font-semibold">Type</th>
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
                          {property.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-charcoal">{property.type}</td>
                  <td className="py-3 pr-4 font-semibold text-charcoal">
                    ${Number(property.rent).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[property.status] ||
                          "bg-charcoal/10 text-charcoal"
                        }`}
                      >
                        {property.status}
                      </span>
                      {property.status === "rejected" && (
                        <button
                          onClick={() => setFeedbackFor(property)}
                          className="rounded-full p-2 text-teal-brand hover:bg-teal-brand/10"
                          title="View rejection feedback"
                          aria-label="View rejection feedback"
                        >
                          <FaEye />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/my-properties/edit/${property._id}`}
                        className="flex items-center gap-2 rounded-md border border-teal-brand px-3 py-1.5 text-xs font-medium text-teal-brand hover:bg-teal-brand hover:text-cream"
                      >
                        <FaEdit /> Update
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(property)}
                        className="flex items-center gap-2 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
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
      {feedbackFor && (
        <div className={overlayClass}>
          <div className={modalClass}>
            <h2 className="font-heading text-xl font-bold text-teal-brand">
              Rejection feedback
            </h2>
            <p className="mt-1 text-sm text-charcoal/60">{feedbackFor.title}</p>
            <p className="mt-4 rounded-md bg-cream p-4 text-sm text-charcoal">
              {feedbackFor.rejectionFeedback || "No feedback was provided."}
            </p>
            <p className="mt-3 text-xs text-charcoal/60">
              Updating this property sends it back for review.
            </p>
            <button
              onClick={() => setFeedbackFor(null)}
              className={`mt-5 ${amberButton}`}
            >
              Close
            </button>
          </div>
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
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
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

export default MyProperties;