import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const inputClass =
  "w-full rounded-md border border-charcoal/15 bg-white px-4 py-2.5 outline-none focus:border-teal-brand";

const Login = () => {
  const { loginUser, googleLogin, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData(e.target);
    const email = data.get("email").trim();
    const password = data.get("password");

    try {
      setSubmitting(true);
      await loginUser(email, password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      setLoading(false);
      setError("Incorrect email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await googleLogin();
      toast.success("Logged in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      setLoading(false);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-charcoal/10 bg-white p-8 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-teal-brand">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-sm text-charcoal/70">
          Log in to manage your bookings and favorites.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Your password"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/60"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-amber-brand px-5 py-2.5 font-medium text-charcoal transition-colors hover:bg-amber-deep disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-sm text-charcoal/50">
          <span className="h-px flex-1 bg-charcoal/15" />
          or
          <span className="h-px flex-1 bg-charcoal/15" />
        </div>

        <button
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-teal-brand px-5 py-2.5 font-medium text-teal-brand transition-colors hover:bg-teal-brand hover:text-cream"
        >
          <FaGoogle /> Continue with Google
        </button>

        <p className="mt-6 text-center text-sm">
          New to RentNest?{" "}
          <Link to="/register" className="font-medium text-teal-brand hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;