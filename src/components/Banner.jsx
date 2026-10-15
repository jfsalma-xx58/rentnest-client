import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbCurrencyTaka } from "react-icons/tb";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHome,
  FaShieldAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaHeadset,
  FaPlay,
  FaArrowDown,
} from "react-icons/fa";

const bannerImg = "https://i.ibb.co/F4tZ4bjz/banner.jpg";

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Room"];

const features = [
  {
    icon: FaShieldAlt,
    title: "Verified listings",
    description: "Listings checked by our team",
  },
  {
    icon: FaCreditCard,
    title: "Secure payments",
    description: "Your money is protected",
  },
  {
    icon: FaCalendarAlt,
    title: "Easy reservations",
    description: "Book in minutes",
  },
  {
    icon: FaHeadset,
    title: "24/7 support",
    description: "We're here for you",
  },
];

const today = new Date().toISOString().split("T")[0];

const cell =
  "flex min-w-0 items-center gap-3 rounded-lg border border-charcoal/10 bg-white/80 px-3 py-2.5 transition-colors hover:bg-white focus-within:border-amber-brand focus-within:bg-white";

const label = "block text-[11px] font-semibold text-charcoal";

const field =
  "mt-0.5 w-full min-w-0 bg-transparent text-xs text-charcoal outline-none placeholder:text-charcoal/50";

const Banner = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    location: "",
    type: "",
    minPrice: "",
    maxPrice: "",
    moveIn: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const min = search.minPrice === "" ? null : Number(search.minPrice);
    const max = search.maxPrice === "" ? null : Number(search.maxPrice);

    if ((min !== null && min < 0) || (max !== null && max < 0)) {
      setError("Rent cannot be negative.");
      return;
    }

    if (min !== null && max !== null && min > max) {
      setError("Minimum rent cannot be higher than maximum rent.");
      return;
    }

    const params = new URLSearchParams();

    Object.entries(search).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    navigate(`/properties?${params.toString()}`);
  };

  const scrollToSearch = () => {
    document
      .getElementById("rentnest-search")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="relative">
      {/* Hero image and all hero content */}
      <div
        className="relative min-h-[1050px] overflow-hidden bg-gradient-to-br from-teal-dark via-teal-brand to-amber-deep/70 bg-cover bg-center sm:min-h-[900px] lg:min-h-[760px]"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        {/* Overlays keep text readable over the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/15" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/45 to-transparent" />

        {/* Handwritten brand note */}
        <p
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-28 hidden -rotate-[8deg] text-[1.9rem] leading-[1.05] text-[#f2d9a4] md:block lg:right-20"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          Good Spaces.
          <br />
          Brighter Lives.
        </p>

        {/* Main headline */}
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 pb-[560px] pt-28 sm:px-10 sm:pb-[480px] lg:px-0 lg:pb-[330px] lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-[700px] text-left"
          >
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-cream sm:text-[11px]">
              More than a rental
            </p>

            <div className="relative">
              <h1 className="font-heading text-[3.4rem] font-semibold leading-[0.92] tracking-[-0.05em] text-white sm:text-7xl lg:text-[5.6rem]">
                Find a place
                <br />
                that feels like
                <br />
                <span className="font-normal italic text-amber-brand">
                  home.
                </span>
              </h1>

              <p className="mt-4 max-w-[330px] text-xs leading-[1.8] text-white/90 sm:text-[13px] lg:absolute lg:bottom-1 lg:left-[280px] lg:mt-0">
                Discover verified rentals in Bangladesh's most desirable
                neighborhoods. Find your next home with confidence.
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToSearch}
              className="mt-6 inline-flex items-center gap-3 text-xs text-white transition-opacity hover:opacity-75"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80">
                <FaPlay className="ml-0.5 text-[9px]" />
              </span>
              Explore available homes
            </button>
          </motion.div>
        </div>

        {/* Search form inside the hero image */}
        <div
          id="rentnest-search"
          className="absolute inset-x-0 bottom-[250px] z-20 mx-auto w-[calc(100%-32px)] max-w-[1040px] sm:bottom-[205px] sm:w-[calc(100%-64px)] lg:bottom-[135px]"
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid gap-2 rounded-2xl border border-white/60 bg-cream/95 p-3 shadow-[0_14px_45px_rgba(0,0,0,0.22)] backdrop-blur-md sm:grid-cols-2 sm:p-4 lg:grid-cols-[1.25fr_1fr_1.25fr_1fr_auto] lg:items-stretch"
          >
            <label className={cell}>
              <FaMapMarkerAlt className="shrink-0 text-lg text-teal-brand" />
              <span className="min-w-0 flex-1">
                <span className={label}>Where do you want to live?</span>
                <input
                  type="text"
                  name="location"
                  value={search.location}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka"
                  className={field}
                />
              </span>
            </label>

            <label className={cell}>
              <FaHome className="shrink-0 text-lg text-teal-brand" />
              <span className="min-w-0 flex-1">
                <span className={label}>Property type</span>
                <select
                  name="type"
                  value={search.type}
                  onChange={handleChange}
                  className={`${field} cursor-pointer`}
                >
                  <option value="">Any type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <div className={cell}>
              <TbCurrencyTaka className="shrink-0 text-xl text-teal-brand" />
              <span className="min-w-0 flex-1">
                <span className={label}>Rent per month (BDT)</span>
                <span className="flex items-center gap-1.5">
                  <input
                    type="number"
                    name="minPrice"
                    min="0"
                    inputMode="numeric"
                    aria-label="Minimum rent in BDT"
                    value={search.minPrice}
                    onChange={handleChange}
                    placeholder="Min"
                    className={field}
                  />
                  <span className="text-xs text-charcoal/40">–</span>
                  <input
                    type="number"
                    name="maxPrice"
                    min="0"
                    inputMode="numeric"
                    aria-label="Maximum rent in BDT"
                    value={search.maxPrice}
                    onChange={handleChange}
                    placeholder="Max"
                    className={field}
                  />
                </span>
              </span>
            </div>

            <label className={cell}>
              <FaCalendarAlt className="shrink-0 text-base text-teal-brand" />
              <span className="min-w-0 flex-1">
                <span className={label}>Move-in date</span>
                <input
                  type="date"
                  name="moveIn"
                  min={today}
                  value={search.moveIn}
                  onChange={handleChange}
                  className={`${field} cursor-pointer`}
                />
              </span>
            </label>

            <button
              type="submit"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-amber-brand px-6 py-3 text-xs font-semibold text-charcoal transition-colors hover:bg-amber-deep sm:col-span-2 lg:col-span-1 lg:min-w-[150px]"
            >
              <FaSearch />
              Search homes
            </button>

            {error && (
              <p
                role="alert"
                className="text-xs font-medium text-red-700 sm:col-span-2 lg:col-span-5"
              >
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Feature strip inside the hero image */}
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-teal-dark/85 px-5 py-5 backdrop-blur-sm sm:px-10 sm:py-6">
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-5 gap-y-5 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-center lg:gap-8 lg:px-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-brand/50 text-amber-brand">
                  <Icon className="text-base" />
                </span>

                <div className="min-w-0">
                  <h2 className="text-xs font-semibold text-white sm:text-sm">
                    {title}
                  </h2>
                  <p className="mt-1 text-[10px] leading-4 text-white/85 sm:text-xs">
                    {description}
                  </p>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                window.scrollBy({
                  top: window.innerHeight * 0.8,
                  behavior: "smooth",
                })
              }
              className="col-span-2 flex items-center justify-center gap-3 text-xs text-white/90 transition-opacity hover:opacity-75 lg:col-span-1 lg:justify-self-end"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50">
                <FaArrowDown className="text-xs" />
              </span>
              Scroll down
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;