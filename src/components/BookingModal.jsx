import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const inputClass =
  "w-full rounded-md border border-charcoal/15 bg-white px-4 py-2.5 outline-none focus:border-teal-brand";

const readOnlyClass =
  "w-full rounded-md border border-charcoal/10 bg-cream px-4 py-2.5 text-charcoal/70";

const BookingModal = ({ property, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Today's date in the user's own timezone, so past dates can't be picked
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData(e.target);
    const moveInDate = data.get("moveInDate");
    const phone = data.get("phone").trim();
    const notes = data.get("notes").trim();

    if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
      setError("Please enter a valid contact number.");
      return;
    }

    const booking = {
      propertyId: property._id,
      moveInDate,
      phone,
      notes,
    };
    sessionStorage.setItem("pending-booking", JSON.stringify(booking));
    navigate(`/payment/${property._id}`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-charcoal/60 p-4">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-xl text-charcoal/60 hover:text-charcoal"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-teal-brand">Book this property</h2>
        <p className="mt-1 text-sm text-charcoal/70">{property.title}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Your name</label>
              <input
                type="text"
                value={user?.displayName || ""}
                readOnly
                className={readOnlyClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Your email</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className={readOnlyClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Move-in date</label>
              <input
                type="date"
                name="moveInDate"
                min={today}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Contact number</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+880 1XXXXXXXXX"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Additional notes (optional)
            </label>
            <textarea
              name="notes"
              rows="3"
              placeholder="Anything the owner should know?"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <p className="text-sm text-charcoal/60">
            You'll pay the reservation fee securely on the next page.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-teal-brand px-5 py-2.5 font-medium text-teal-brand transition-colors hover:bg-teal-brand hover:text-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-amber-brand px-5 py-2.5 font-medium text-charcoal transition-colors hover:bg-amber-deep"
            >
              Confirm and pay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;