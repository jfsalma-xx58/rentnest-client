import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";

const PaymentPage = () => {
  const { id } = useParams();
  const [booking] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("pending-booking"));
    } catch {
      return null;
    }
  });

  if (!booking || booking.propertyId !== id) {
    return <Navigate to={`/properties/${id}`} replace />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold text-teal-brand">Payment</h1>
      <div className="mt-6 rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm">
        <p>
          <span className="font-medium">Move-in date:</span> {booking.moveInDate}
        </p>
        <p className="mt-2">
          <span className="font-medium">Contact number:</span> {booking.phone}
        </p>
        {booking.notes && (
          <p className="mt-2">
            <span className="font-medium">Notes:</span> {booking.notes}
          </p>
        )}
        <p className="mt-6 text-charcoal/70">Stripe payment comes next.</p>
      </div>
    </div>
  );
};

export default PaymentPage;