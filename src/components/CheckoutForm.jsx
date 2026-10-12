import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";

const CheckoutForm = ({ booking, property, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError("");
    setProcessing(true);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        const res = await axiosSecure.post("/payments", {
          paymentIntentId: paymentIntent.id,
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
            amount: res.data.amount,
            title: property.title,
          },
        });
      } catch (err) {
        setError(
          "Your payment went through, but we couldn't save the booking. Please click Pay again to retry. You will not be charged twice. Reference: " +
            paymentIntent.id
        );
        setProcessing(false);
      }
    } else {
      setError("Payment was not completed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <PaymentElement />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full rounded-md bg-amber-brand px-5 py-3 font-medium text-charcoal transition-colors hover:bg-amber-deep disabled:opacity-60"
      >
        {processing ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;