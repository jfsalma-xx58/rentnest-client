import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Reveal from "./Reveal";

// Existing property rents in MongoDB are stored in USD.
// Convert them to BDT for display.
const BDT_PER_USD = 123.75;

const formatBdtRent = (rentUsd) => {
  const rentInBdt = Number(rentUsd) * BDT_PER_USD;

  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(rentInBdt)}`;
};

const FeaturedProperties = () => {
  const axiosPublic = useAxiosPublic();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    axiosPublic
      .get("/properties/featured")
      .then((res) => {
        if (active) {
          setProperties(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [axiosPublic]);

  const featured = properties[0];

  return (
    <section
      id="featured-properties"
      className="relative overflow-hidden bg-cream py-16 sm:py-20 lg:py-24"
    >
      {/* Subtle decorative detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full border border-amber-brand/15"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Section label */}
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-deep">
            Featured property
          </p>
        </Reveal>

        {/* Loading state */}
        {loading && (
          <div
            aria-label="Loading featured property"
            className="mt-8 h-72 animate-pulse rounded-3xl bg-charcoal/5"
          />
        )}

        {/* Error state */}
        {error && !loading && (
          <p role="alert" className="mt-8 text-sm text-charcoal/65">
            We couldn't load featured properties right now. Please try again
            later.
          </p>
        )}

        {/* Featured property */}
        {!loading && !error && featured && (
          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[0.8fr_1.6fr] lg:gap-12">
            {/* Property information */}
            <Reveal>
              <div className="max-w-lg lg:py-8">
                <p className="text-xs font-medium uppercase tracking-widest text-charcoal/50">
                  Find your next home
                </p>

                <h2 className="mt-4 font-heading text-4xl font-semibold leading-[1.05] text-teal-dark sm:text-5xl lg:text-6xl">
                  {featured.title}
                </h2>

                {/* Location */}
                {featured.location && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-charcoal/65">
                    <FaMapMarkerAlt
                      aria-hidden="true"
                      className="shrink-0 text-amber-deep"
                    />
                    <span>{featured.location}</span>
                  </p>
                )}

                {/* Property details */}
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs text-charcoal/75">
                  {featured.bedrooms != null && (
                    <span className="flex items-center gap-2">
                      <FaBed
                        aria-hidden="true"
                        className="shrink-0 text-amber-deep"
                      />
                      {featured.bedrooms}{" "}
                      {Number(featured.bedrooms) === 1 ? "Bed" : "Beds"}
                    </span>
                  )}

                  {featured.bathrooms != null && (
                    <span className="flex items-center gap-2">
                      <FaBath
                        aria-hidden="true"
                        className="shrink-0 text-amber-deep"
                      />
                      {featured.bathrooms}{" "}
                      {Number(featured.bathrooms) === 1 ? "Bath" : "Baths"}
                    </span>
                  )}

                  {featured.size != null && (
                    <span className="flex items-center gap-2">
                      <FaRulerCombined
                        aria-hidden="true"
                        className="shrink-0 text-amber-deep"
                      />
                      {Number(featured.size).toLocaleString("en-US")} sqft
                    </span>
                  )}
                </div>

                {/* Rent displayed in BDT */}
                <p className="mt-7 font-heading text-3xl text-amber-deep">
                  {formatBdtRent(featured.rent)}
                  <span className="font-body text-sm text-charcoal/60">
                    {" "}/ {featured.rentType || "Monthly"}
                  </span>
                </p>

                {/* Description */}
                <p className="mt-4 max-w-sm text-sm leading-6 text-charcoal/65">
                  Explore the details, discover the space, and see whether this
                  property feels right for your next chapter.
                </p>

                {/* Property details link */}
                <Link
                  to={`/properties/${featured._id}`}
                  className="mt-7 inline-flex items-center gap-3 rounded-full bg-amber-brand px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-amber-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:ring-offset-2"
                >
                  View Property
                  <FaArrowRight aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            {/* Featured property image */}
            <Reveal delay={0.12} className="min-w-0">
              <Link
                to={`/properties/${featured._id}`}
                aria-label={`Explore ${featured.title}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-teal-dark shadow-xl sm:aspect-[16/10] lg:aspect-[1.35/1]"
              >
                {featured.images?.[0] ? (
                  <img
                    src={featured.images[0]}
                    alt={featured.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-teal-dark text-cream/70">
                    <span className="text-sm">Property image unavailable</span>
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10"
                />

                <span className="absolute right-4 top-4 rounded-full border border-white/50 bg-black/20 px-4 py-2 text-xs text-white backdrop-blur">
                  Featured
                </span>

                <span className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-cream/95 px-4 py-2 text-xs font-semibold text-charcoal">
                  Explore home
                  <FaArrowRight aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && properties.length === 0 && (
          <div className="mt-6 rounded-2xl border border-charcoal/10 p-8 text-charcoal/65">
            Featured properties will appear here when available.
          </div>
        )}

        {/* Explore more properties */}
        {!loading && !error && properties.length > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/10 pt-6">
            <p className="text-sm text-charcoal/60">
              Discover more homes selected for you.
            </p>

            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-brand transition hover:text-amber-deep"
            >
              Explore all properties
              <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;