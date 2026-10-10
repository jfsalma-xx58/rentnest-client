import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

const PropertyCard = ({ property }) => {
  const {
    _id,
    title,
    location,
    type,
    rent,
    rentType,
    bedrooms,
    bathrooms,
    size,
    images,
  } = property;

  const periodLabel = { Monthly: "mo", Weekly: "wk", Daily: "day" }[rentType] || "mo";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative">
        <img
          src={images?.[0]}
          alt={title}
          className="h-52 w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-teal-brand px-3 py-1 text-xs font-medium text-cream">
          {type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold text-teal-brand">{title}</h3>

        <p className="mt-1 flex items-center gap-2 text-sm text-charcoal/70">
          <FaMapMarkerAlt className="text-amber-deep" /> {location}
        </p>

        <div className="mt-4 flex items-center gap-4 text-sm text-charcoal/80">
          <span className="flex items-center gap-1.5">
            <FaBed className="text-teal-brand" /> {bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <FaBath className="text-teal-brand" /> {bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <FaRulerCombined className="text-teal-brand" /> {size} sqft
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="text-lg font-bold text-charcoal">
            ${rent}
            <span className="text-sm font-normal text-charcoal/60">/{periodLabel}</span>
          </p>
          <Link
            to={`/properties/${_id}`}
            className="rounded-md bg-amber-brand px-4 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-amber-deep"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;