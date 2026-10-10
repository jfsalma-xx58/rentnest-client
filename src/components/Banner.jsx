import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import bannerImg from "../assets/banner.jpg";

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Room"];

const inputClass =
  "w-full rounded-md border border-charcoal/15 bg-white px-3 py-2.5 text-charcoal outline-none focus:border-teal-brand";

const Banner = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    location: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e) =>
    setSearch({ ...search, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(search).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section
      className="relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      <div className="absolute inset-0 bg-teal-dark/70" />

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-4xl font-bold text-cream md:text-6xl"
        >
          Find a place that feels like{" "}
          <span className="text-amber-brand">home</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-2xl text-lg text-cream/90"
        >
          Discover verified rentals, book instantly and pay securely, all in
          one transparent marketplace.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 grid w-full max-w-5xl gap-3 rounded-xl bg-cream p-4 text-left shadow-xl sm:grid-cols-2 lg:grid-cols-5"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={search.location}
              onChange={handleChange}
              placeholder="e.g. Dhaka"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Property type</label>
            <select
              name="type"
              value={search.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Any type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Min price</label>
            <input
              type="number"
              name="minPrice"
              min="0"
              value={search.minPrice}
              onChange={handleChange}
              placeholder="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Max price</label>
            <input
              type="number"
              name="maxPrice"
              min="0"
              value={search.maxPrice}
              onChange={handleChange}
              placeholder="Any"
              className={inputClass}
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-amber-brand px-5 py-2.5 font-medium text-charcoal transition-colors hover:bg-amber-deep"
            >
              <FaSearch /> Search
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default Banner;