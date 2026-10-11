import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const inputClass =
  "w-full rounded-md border border-charcoal/15 bg-white px-4 py-2.5 outline-none focus:border-teal-brand";

const passwordInputClass = inputClass + " pr-11";

const Register = () => {
  const { registerUser, updateUserProfile, saveUser, getToken, setLoading } =
    useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData(e.target);
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const photo = data.get("photo").trim();
    const password = data.get("password");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setSubmitting(true);
      await registerUser(email, password);
      await updateUserProfile(name, photo);
      await saveUser({ name, email, photo });
      await getToken(email);
      toast.success("Account created! Welcome to RentNest.");
      navigate("/");
    } catch (err) {
      setLoading(false);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in instead.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-charcoal/10 bg-white p-8 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-teal-brand">
          Create your account
        </h1>
        <p className="mt-2 text-center text-sm text-charcoal/70">
          Join RentNest to find and book your next home.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your name"
              className={inputClass}
            />
          </div>

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
            <label className="mb-1 block text-sm font-medium">Photo URL</label>
            <input
              type="url"
              name="photo"
              required
              placeholder="https://example.com/photo.jpg"
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
                placeholder="At least 6 characters"
                className={passwordInputClass}
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
            {submitting ? "Creating account..." : "Register"}
          </button>
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