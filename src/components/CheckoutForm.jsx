import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";

const formatBdt = (value) =>
  `৳${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const CheckoutForm = ({ booking, property, amount, chargedAmount, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // Stops a double click or double Enter from sending two payments.
  const busy = useRef(false);

  // Set once Stripe has taken the money, so a retry never confirms again.
  const [paidIntentId, setPaidIntentId] = useState("");

  // Saves the booking. The server accepts the same payment twice safely.
  const saveBooking = async (paymentIntentId) => {
    try {
      const res = await axiosSecure.post("/payments", {
        paymentIntentId,
        propertyId: booking.propertyId,
        moveInDate: booking.moveInDate,
        phone: booking.phone,
        notes: booking.notes,
      });
      sessionStorage.removeItem("pending-booking");
      toast.success("Payment successful!");
      navigate("/payment-success", {
        replace: true,
        state: {
          transactionId: res.data.transactionId,
          amount: res.data.amount, // fee in BDT
          chargedAmount,
          title: property.title,
        },
      });
    } catch (err) {
      console.error("Saving the booking failed:", err.response?.data || err);
      setPaidIntentId(paymentIntentId);
      setError(
        (err.response?.data?.message || "We couldn't save your booking.") +
          " Your payment went through and you will not be charged again. " +
          "Click the button below to try saving the booking again. Reference: " +
          paymentIntentId
      );
      busy.current = false;
      setProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || busy.current) return;

    busy.current = true;
    setError("");
    setProcessing(true);

    // Already paid (for example a retry): never confirm a second time.
    if (paidIntentId) {
      await saveBooking(paidIntentId);
      return;
    }

    // Ask Stripe for the current state first.
    const { paymentIntent: current } = await stripe.retrievePaymentIntent(
      clientSecret
    );

    if (current?.status === "succeeded") {
      await saveBooking(current.id);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed. Please try again.");
      busy.current = false;
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      await saveBooking(paymentIntent.id);
    } else {
      setError("Payment was not completed. Please try again.");
      busy.current = false;
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {!paidIntentId && <PaymentElement />}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full rounded-md bg-amber-brand px-5 py-3 font-medium text-charcoal transition-colors hover:bg-amber-deep disabled:opacity-60"
      >
        {processing
          ? "Processing..."
          : paidIntentId
          ? "Save my booking"
          : `Pay ${formatBdt(amount)}`}
      </button>

      {chargedAmount > 0 && (
        <p className="text-center text-xs text-charcoal/60">
          Your card is charged ${Number(chargedAmount).toFixed(2)} USD by Stripe,
          the equivalent of {formatBdt(amount)}.
        </p>
      )}
    </form>
  );
};

export default CheckoutForm;