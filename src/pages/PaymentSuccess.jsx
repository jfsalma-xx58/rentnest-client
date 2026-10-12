import { Link, Navigate, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  const { state } = useLocation();

  if (!state?.transactionId) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <FaCheckCircle className="mx-auto text-6xl text-teal-brand" />
      <h1 className="mt-6 text-4xl font-bold text-teal-brand">Payment successful</h1>
      <p className="mt-3 text-charcoal/70">
        Your booking request for <span className="font-medium">{state.title}</span> has
        been sent to the owner. You'll see its status change once they respond.
      </p>

      <div className="mt-6 rounded-xl border border-charcoal/10 bg-white p-5 text-left text-sm">
        <p>
          <span className="font-medium">Amount paid:</span> ${state.amount}
        </p>
        <p className="mt-2 break-all">
          <span className="font-medium">Transaction ID:</span> {state.transactionId}
        </p>
        <p className="mt-2">
          <span className="font-medium">Booking status:</span> Pending
        </p>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/properties"
          className="rounded-md bg-amber-brand px-6 py-2.5 font-medium text-charcoal transition-colors hover:bg-amber-deep"
        >
          Browse more properties
        </Link>
        <Link
          to="/"
          className="rounded-md border border-teal-brand px-6 py-2.5 font-medium text-teal-brand transition-colors hover:bg-teal-brand hover:text-cream"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;