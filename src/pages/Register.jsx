import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaHouseUser, FaKey } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { getAdditionalUserInfo } from "firebase/auth";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const inputClass =
  "w-full rounded-md border border-charcoal/15 bg-white px-4 py-2.5 outline-none focus:border-teal-brand";

const Register = () => {
  const {
    user,
    registerUser,
    loginUser,
    updateUserProfile,
    saveUser,
    getToken,
    setLoading,
    googleLogin,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const registrationState = location.state || {};

  const [role, setRole] = useState("tenant");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const googlePending = registrationState.googlePending === true;

  const finishRegistration = async ({ name, email, photo, role }) => {
    const response = await saveUser({
      name,
      email,
      photo: photo || "",
      role,
    });

    // Existing profiles must retain their server-side role.
    // The backend should return inserted=false when a profile already exists.
    await getToken(email);

    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const photo = String(data.get("photo") || "").trim();
    const password = String(data.get("password") || "");

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setSubmitting(true);

      const result = await registerUser(email, password);

      await updateUserProfile(name, photo || null);

      await finishRegistration({
        name,
        email,
        photo,
        role,
      });

      toast.success(
        role === "owner"
          ? "Owner account created! Welcome to RentNest."
          : "Tenant account created! Welcome to RentNest."
      );

      navigate("/", { replace: true });
    } catch (err) {
      setLoading(false);

      if (err.code === "auth/email-already-in-use") {
        // An earlier attempt may have created the sign-in account but not the
        // RentNest profile. If the password is right, finish the profile now.
        try {
          setLoading(true);
          await loginUser(email, password);
          await updateUserProfile(name, photo || null);
          await finishRegistration({ name, email, photo, role });
          toast.success("Welcome to RentNest!");
          navigate("/", { replace: true });
          return;
        } catch (retryError) {
          setLoading(false);
          setError(
            "This email is already registered. Please log in to your account."
          );
        }
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Please choose a stronger password.");
      } else if (err.response?.status === 409) {
        setError(
          "A RentNest profile already exists for this email. Please log in."
        );
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleRegistration = async () => {
    setError("");

    try {
      setGoogleSubmitting(true);

      let googleUser = null;

      if (googlePending) {
        // A new Google account was authenticated from the Login page.
        googleUser = user;

        if (!googleUser?.email) {
          throw new Error(
            "Your Google session has expired. Please continue with Google again."
          );
        }
      } else {
        const result = await googleLogin();
        googleUser = result.user;

        const additionalInfo = getAdditionalUserInfo(result);

        if (!additionalInfo?.isNewUser) {
          // Existing Google accounts keep their original database role.
          // The backend must not overwrite an existing profile's role.
          await getToken(googleUser.email);

          toast.success("Welcome back to RentNest!");
          navigate("/", { replace: true });
          return;
        }
      }

      await finishRegistration({
        name:
          googleUser.displayName ||
          registrationState.name ||
          "",
        email: googleUser.email,
        photo:
          googleUser.photoURL ||
          registrationState.photo ||
          "",
        role,
      });

      toast.success(
        role === "owner"
          ? "Owner account created! Welcome to RentNest."
          : "Tenant account created! Welcome to RentNest."
      );

      navigate("/", { replace: true });
    } catch (err) {
      setLoading(false);

      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else if (err.response?.status === 404) {
        setError(
          "Your RentNest profile could not be found. Please try registration again."
        );
      } else {
        setError(err.message || "Google registration failed. Please try again.");
      }
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const busy = submitting || googleSubmitting;

  return (
    <div className="mx-auto flex max-w-7xl justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-charcoal/10 bg-white p-8 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-teal-brand">
          Create your account
        </h1>

        <p className="mt-2 text-center text-sm text-charcoal/70">
          Choose how you want to use RentNest.
        </p>

        {registrationState.message && (
          <p className="mt-4 rounded-md bg-cream p-3 text-sm text-charcoal">
            {registrationState.message}
          </p>
        )}

        {/* Account type selection */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("tenant")}
            aria-pressed={role === "tenant"}
            className={`rounded-lg border p-4 text-left transition-colors ${
              role === "tenant"
                ? "border-teal-brand bg-teal-brand/5 ring-1 ring-teal-brand"
                : "border-charcoal/15 hover:border-teal-brand/50"
            }`}
          >
            <FaKey className="mb-3 text-xl text-teal-brand" />

            <span className="block font-semibold text-charcoal">
              Tenant
            </span>

            <span className="mt-1 block text-xs leading-relaxed text-charcoal/70">
              Find homes, save favorites, and manage bookings.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("owner")}
            aria-pressed={role === "owner"}
            className={`rounded-lg border p-4 text-left transition-colors ${
              role === "owner"
                ? "border-teal-brand bg-teal-brand/5 ring-1 ring-teal-brand"
                : "border-charcoal/15 hover:border-teal-brand/50"
            }`}
          >
            <FaHouseUser className="mb-3 text-xl text-teal-brand" />

            <span className="block font-semibold text-charcoal">
              Owner
            </span>

            <span className="mt-1 block text-xs leading-relaxed text-charcoal/70">
              List properties and manage booking requests.
            </span>
          </button>
        </div>

        {/* Google registration */}
        <button
          type="button"
          onClick={handleGoogleRegistration}
          disabled={busy}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-charcoal/15 bg-white px-5 py-2.5 font-medium text-charcoal transition-colors hover:bg-cream disabled:opacity-60"
        >
          <FcGoogle className="text-xl" />

          {googleSubmitting
            ? "Setting up your account..."
            : "Continue with Google"}
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-charcoal/10" />
          <span className="text-xs text-charcoal/50">
            OR REGISTER WITH EMAIL
          </span>
          <div className="h-px flex-1 bg-charcoal/10" />
        </div>

        {/* Email registration */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Full name
            </label>

            <input
              type="text"
              name="name"
              required
              defaultValue={registrationState.name || ""}
              placeholder="Your name"
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              defaultValue={registrationState.email || ""}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Photo URL{" "}
              <span className="font-normal text-charcoal/50">
                (optional)
              </span>
            </label>

            <input
              type="url"
              name="photo"
              defaultValue={registrationState.photo || ""}
              placeholder="https://example.com/photo.jpg"
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
                minLength={6}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className={`${inputClass} pr-11`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
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
            disabled={busy || googlePending}
            className="w-full rounded-md bg-amber-brand px-5 py-2.5 font-medium text-charcoal transition-colors hover:bg-amber-deep disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>

          {googlePending && (
            <p className="text-xs leading-relaxed text-charcoal/60">
              Your Google account is awaiting setup. Complete registration
              using the Google button above.
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-teal-brand hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;