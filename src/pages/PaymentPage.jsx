import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../components/Loading";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const formatBdt = (value) =>
  `৳${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const PaymentPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const [booking] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("pending-booking"));
    } catch {
      return null;
    }
  });

  const [property, setProperty] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0); // fee in BDT
  const [chargedAmount, setChargedAmount] = useState(0); // Stripe charge in USD
  const [error, setError] = useState("");

  useEffect(() => {
    if (!booking || booking.propertyId !== id) return;

    Promise.all([
      axiosSecure.get(`/properties/${id}`),
      axiosSecure.post("/create-payment-intent", {
        propertyId: id,
        moveInDate: booking.moveInDate,
      }),
    ])
      .then(([propertyRes, intentRes]) => {
        setProperty(propertyRes.data);
        setClientSecret(intentRes.data.clientSecret);
        setAmount(intentRes.data.amount);
        setChargedAmount(intentRes.data.chargedAmount);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Could not start the payment.");
      });
  }, [axiosSecure, id, booking]);

  if (!booking || booking.propertyId !== id) {
    return <Navigate to={`/properties/${id}`} replace />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-teal-brand">Payment unavailable</h1>
        <p className="mt-3 text-charcoal/70">{error}</p>
      </div>
    );
  }

  if (!clientSecret || !property) return <Loading />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold text-teal-brand">Secure payment</h1>

      <div className="mt-6 rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-teal-brand">{property.title}</h2>
        <div className="mt-3 space-y-1 text-sm text-charcoal/80">
          <p>
            <span className="font-medium">Move-in date:</span> {booking.moveInDate}
          </p>
          <p>
            <span className="font-medium">Contact number:</span> {booking.phone}
          </p>
          {booking.notes && (
            <p>
              <span className="font-medium">Notes:</span> {booking.notes}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-charcoal/10 pt-4">
          <span className="font-medium">Reservation fee (10% of rent)</span>
          <span className="text-2xl font-bold text-charcoal">{formatBdt(amount)}</span>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "stripe", variables: { colorPrimary: "#0F5257" } },
          }}
        >
          <CheckoutForm
            booking={booking}
            property={property}
            amount={amount}
            chargedAmount={chargedAmount}
            clientSecret={clientSecret}
          />
        </Elements>

        <p className="mt-4 text-center text-xs text-charcoal/60">
          Test mode: use card number 4242 4242 4242 4242, any future expiry date,
          any CVC and any ZIP.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;