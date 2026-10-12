import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

const locations = ["Dhaka", "Chattogram", "Sylhet", "Cox's Bazar"];

const PopularLocations = () => (
  <section className="bg-cream py-16">
    <div className="mx-auto max-w-7xl px-4">
      <h2 className="text-center font-heading text-3xl font-bold text-teal-brand md:text-4xl">
        Popular Locations
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-charcoal/70">
        Jump straight to the places renters search for most.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {locations.map((place) => (
          <Link
            key={place}
            to={`/properties?location=${encodeURIComponent(place)}`}
            className="group flex items-center justify-between rounded-xl border border-teal-brand/20 bg-white px-6 py-5 transition hover:border-amber-brand hover:shadow-md"
          >
            <span className="flex items-center gap-3 font-heading text-lg font-semibold text-charcoal">
              <FaMapMarkerAlt className="text-amber-deep" />
              {place}
            </span>
            <span className="text-teal-brand transition group-hover:translate-x-1">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default PopularLocations;