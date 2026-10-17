import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Reveal from "./Reveal";
import PropertyCard from "./PropertyCard";

const HOME_PROPERTY_COUNT = 6;

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

  // The server lists the featured property first, then the newest ones.
  const shown = properties.slice(0, HOME_PROPERTY_COUNT);

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
        {/* Section heading */}
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-deep">
            Featured properties
          </p>

          <h2 className="mt-4 font-heading text-4xl font-semibold leading-[1.05] text-teal-dark sm:text-5xl">
            Find your next home
          </h2>
        </Reveal>

        {/* Loading state */}
        {loading && (
          <div
            aria-label="Loading featured properties"
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: HOME_PROPERTY_COUNT }, (_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-xl bg-charcoal/5"
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <p role="alert" className="mt-8 text-sm text-charcoal/65">
            We couldn't load featured properties right now. Please try again
            later.
          </p>
        )}

        {/* Property grid: 3 per row on desktop */}
        {!loading && !error && shown.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((property, index) => (
              <Reveal
                key={property._id}
                delay={(index % 3) * 0.08}
                className="h-full"
              >
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && properties.length === 0 && (
          <div className="mt-6 rounded-2xl border border-charcoal/10 p-8 text-charcoal/65">
            Featured properties will appear here when available.
          </div>
        )}

        {/* Explore more properties */}
        {!loading && !error && properties.length > 0 && (
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