import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAdditionalUserInfo } from "firebase/auth";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const inputClass =
  "w-full rounded-md border border-charcoal/15 bg-white px-4 py-2.5 outline-none focus:border-teal-brand";

const Login = () => {
  const { loginUser, googleLogin, getToken, setLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const axiosSecure = useAxiosSecure();

  // After a successful login: owners and admins land on their dashboard,
  // tenants go back to where they came from (the home page by default).
  // Someone sent here from a protected page still returns to that page.
  const goAfterLogin = async (email) => {
    if (from === "/") {
      try {
        const res = await axiosSecure.get(
          `/users/role/${encodeURIComponent(email.trim().toLowerCase())}`
        );
        const role = res.data?.role;

        if (role === "owner" || role === "admin") {
          navigate("/dashboard", { replace: true });
          return;
        }
      } catch (roleError) {
        // If the role can't be read, fall back to the normal redirect.
        console.error("Could not read role after login:", roleError.message);
      }
    }

    navigate(from, { replace: true });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData(e.target);
    const email = data.get("email").trim();
    const password = data.get("password");

    try {
      setSubmitting(true);

      await loginUser(email, password);
      await getToken(email);

      toast.success("Welcome back!");
      await goAfterLogin(email);
    } catch (err) {
      setLoading(false);

      if (err.code === "auth/user-not-found") {
        navigate("/register", {
          replace: true,
          state: {
            email,
            message:
              "No account was found for this email. Create your RentNest account below.",
          },
        });
        return;
      }

      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/invalid-credential") {
        setError(
          "We couldn't verify those login details. Check your email and password, or create an account if you haven't registered yet."
        );
      } else if (err.response?.status === 404) {
        navigate("/register", {
          replace: true,
          state: {
            email,
            message:
              "Please finish setting up your RentNest profile.",
          },
        });
      } else {
        console.error("Email login failed:", err);
        setError("Login failed. Please check your details and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");

    try {
      setGoogleSubmitting(true);

      // Step 1: Authenticate with Google through Firebase.
      const result = await googleLogin();
      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);

      if (!user?.email) {
        throw new Error(
          "Google authentication did not provide an email address."
        );
      }

      // New Google users must complete RentNest registration
      // and choose their role before accessing the application.
      if (additionalInfo?.isNewUser) {
        navigate("/register", {
          replace: true,
          state: {
            googlePending: true,
            email: user.email,
            name: user.displayName || "",
            photo: user.photoURL || "",
          },
        });
        return;
      }

      // Step 2: Obtain the RentNest JWT for an existing profile.
      try {
        await getToken(user.email);
      } catch (tokenError) {
        console.error("RentNest Google session setup failed:", {
          code: tokenError.code,
          message: tokenError.message,
          status: tokenError.response?.status,
          response: tokenError.response?.data,
        });

        if (tokenError.response?.status === 404) {
          navigate("/register", {
            replace: true,
            state: {
              googlePending: true,
              email: user.email,
              name: user.displayName || "",
              photo: user.photoURL || "",
              message:
                "Please finish setting up your RentNest profile.",
            },
          });
          return;
        }

        throw tokenError;
      }

      // Both Firebase authentication and RentNest JWT setup succeeded.
      toast.success("Welcome back!");
      await goAfterLogin(user.email);
    } catch (err) {
      console.error("Google login flow failed:", {
        code: err.code,
        message: err.message,
        status: err.response?.status,
        response: err.response?.data,
      });

      if (err.code === "auth/popup-closed-by-user") {
        return;
      }

      if (err.response?.status === 404) {
        setError(
          "Your RentNest profile could not be found. Please complete registration."
        );
      } else if (err.response) {
        setError(
          "Google signed you in, but RentNest couldn't finish setting up your session. Please try again."
        );
      } else {
        setError(
          "We couldn't complete Google sign-in. Please try again."
        );
      }
    } finally {
      setGoogleSubmitting(false);
      setLoading(false);
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
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                autoComplete="current-password"
                placeholder="Your password"
                className={`${inputClass} pr-11`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/60"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || googleSubmitting}
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
          type="button"
          onClick={handleGoogle}
          disabled={submitting || googleSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-teal-brand px-5 py-2.5 font-medium text-teal-brand transition-colors hover:bg-teal-brand hover:text-cream disabled:opacity-60"
        >
          <FaGoogle />
          {googleSubmitting
            ? "Connecting to Google..."
            : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm">
          New to RentNest?{" "}
          <Link
            to="/register"
            className="font-medium text-teal-brand hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;