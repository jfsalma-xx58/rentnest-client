import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { formatBdt, usdToBdt } from "../../utils/money";

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Room"];
const rentTypes = ["Monthly", "Weekly", "Daily"];

const inputClass =
  "w-full rounded-md border border-charcoal/15 bg-white px-3 py-2.5 text-charcoal outline-none focus:border-teal-brand";

const Field = ({ label, children }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-charcoal">
      {label}
    </label>
    {children}
  </div>
);

const EditProperty = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    axiosSecure
      .get(`/properties/mine/${id}`)
      .then((res) => {
        if (!active) return;
        const p = res.data;
        setStatus(p.status);
        setForm({
          title: p.title || "",
          description: p.description || "",
          location: p.location || "",
          type: p.type || "Apartment",
          rent: p.rent ?? "",
          rentType: p.rentType || "Monthly",
          bedrooms: p.bedrooms ?? "",
          bathrooms: p.bathrooms ?? "",
          size: p.size ?? "",
          amenities: (p.amenities || []).join(", "),
          images: (p.images || []).join("\n"),
          extraFeatures: p.extraFeatures || "",
        });
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [axiosSecure, id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const images = form.images
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (images.length === 0) {
      return toast.error("Add at least one image link");
    }
    if (images.some((url) => !/^https?:\/\//i.test(url))) {
      return toast.error("Each image link must start with http:// or https://");
    }

    const amenities = form.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      const res = await axiosSecure.put(`/properties/${id}`, {
        title: form.title,
        description: form.description,
        location: form.location,
        type: form.type,
        rent: Number(form.rent),
        rentType: form.rentType,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        size: Number(form.size),
        amenities,
        images,
        extraFeatures: form.extraFeatures,
      });
      toast.success(
        status === "rejected" && res.data.status === "pending"
          ? "Updated and sent back for review"
          : "Property updated"
      );
      navigate("/dashboard/my-properties");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not update. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-charcoal/70">Loading property...</p>;
  }

  if (notFound || !form) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm">
        <p className="text-charcoal/70">Property not found.</p>
        <Link
          to="/dashboard/my-properties"
          className="mt-4 inline-block rounded-md bg-amber-brand px-5 py-2 font-medium text-charcoal transition-colors hover:bg-amber-deep"
        >
          Back to My Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-teal-brand">
        Update Property
      </h1>
      {status === "rejected" && (
        <p className="mt-1 text-sm text-charcoal/70">
          This property was rejected. Saving your changes sends it back to
          pending for another review.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Property title">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Location">
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Property type">
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputClass}
          >
            {propertyTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Rent (USD)">
          <input
            type="number"
            name="rent"
            min="1"
            value={form.rent}
            onChange={handleChange}
            required
            className={inputClass}
          />
          {Number(form.rent) > 0 && (
            <p className="mt-1 text-xs text-charcoal/60">
              Tenants will see this as {formatBdt(usdToBdt(form.rent))}.
            </p>
          )}
        </Field>

        <Field label="Rent type">
          <select
            name="rentType"
            value={form.rentType}
            onChange={handleChange}
            className={inputClass}
          >
            {rentTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Bedrooms">
          <input
            type="number"
            name="bedrooms"
            min="0"
            value={form.bedrooms}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Bathrooms">
          <input
            type="number"
            name="bathrooms"
            min="0"
            value={form.bathrooms}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Property size (sqft)">
          <input
            type="number"
            name="size"
            min="1"
            value={form.size}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Amenities (separate with commas)">
          <input
            name="amenities"
            value={form.amenities}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Image links (one per line, up to 6)">
            <textarea
              name="images"
              value={form.images}
              onChange={handleChange}
              required
              rows={4}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Extra features (optional)">
            <textarea
              name="extraFeatures"
              value={form.extraFeatures}
              onChange={handleChange}
              rows={2}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-amber-brand px-8 py-3 font-medium text-charcoal transition-colors hover:bg-amber-deep disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <Link
            to="/dashboard/my-properties"
            className="rounded-md border border-teal-brand px-8 py-3 font-medium text-teal-brand transition-colors hover:bg-teal-brand hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;