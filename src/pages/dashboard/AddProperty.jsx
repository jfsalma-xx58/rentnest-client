import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Room"];
const rentTypes = ["Monthly", "Weekly", "Daily"];

const inputClass =
  "w-full rounded-md border border-charcoal/15 bg-white px-3 py-2.5 text-charcoal outline-none focus:border-teal-brand";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  type: "Apartment",
  rent: "",
  rentType: "Monthly",
  bedrooms: "",
  bathrooms: "",
  size: "",
  amenities: "",
  images: "",
  extraFeatures: "",
};

const Field = ({ label, children }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-charcoal">
      {label}
    </label>
    {children}
  </div>
);

const AddProperty = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

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
      await axiosSecure.post("/properties", {
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
      toast.success("Property submitted. It will show once an admin approves it.");
      setForm(emptyForm);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not add the property. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-teal-brand">
        Add Property
      </h1>
      <p className="mt-1 text-sm text-charcoal/70">
        New properties start as pending until an admin approves them.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Property title">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="e.g. Sunny two-bedroom flat"
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
            placeholder="e.g. Dhaka"
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
            placeholder="Wi-Fi, Parking, Lift"
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
              placeholder="https://example.com/photo-1.jpg"
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

        <div className="rounded-md bg-cream p-4 text-sm md:col-span-2">
          <p className="font-medium text-teal-brand">Owner information</p>
          <p className="mt-1 text-charcoal/80">{user?.displayName}</p>
          <p className="text-charcoal/70">{user?.email}</p>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-amber-brand px-8 py-3 font-medium text-charcoal transition-colors hover:bg-amber-deep disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Add Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;