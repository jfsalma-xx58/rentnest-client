import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../components/Loading";
import BookingModal from "../components/BookingModal";

const PropertyDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [favoriteId, setFavoriteId] = useState(null);
  const [favBusy, setFavBusy] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get(`/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [axiosSecure, id]);

  useEffect(() => {
    axiosSecure
      .get(`/favorites/check/${id}`)
      .then((res) => setFavoriteId(res.data.favorited ? res.data.favoriteId : null))
      .catch(() => setFavoriteId(null));
  }, [axiosSecure, id]);

  const handleFavorite = async () => {
    try {
      setFavBusy(true);
      if (favoriteId) {
        await axiosSecure.delete(`/favorites/${favoriteId}`);
        setFavoriteId(null);
        toast.success("Removed from favorites");
      } else {
        const res = await axiosSecure.post("/favorites", { propertyId: id });
        setFavoriteId(res.data.favoriteId || null);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFavBusy(false);
    }
  };

  if (loading) return <Loading />;

  if (notFound || !property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-teal-brand">Property not found</h1>
        <p className="mt-3 text-charcoal/70">
          This property may have been removed or the link is wrong.
        </p>
        <Link
          to="/properties"
          className="mt-6 inline-block rounded-md bg-amber-brand px-6 py-2 font-medium text-charcoal transition-colors hover:bg-amber-deep"
        >
          Browse properties
        </Link>
      </div>
    );
  }

  const {
    title,
    location,
    type,
    rent,
    rentType,
    bedrooms,
    bathrooms,
    size,
    description,
    amenities = [],
    extraFeatures,
    images = [],
    ownerName,
    ownerEmail,
  } = property;

  const periodLabel = { Monthly: "month", Weekly: "week", Daily: "day" }[rentType] || "month";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-5">
        {/* Images */}
        <div className="lg:col-span-3">
          <img
            src={images[activeImage]}
            alt={title}
            className="h-80 w-full rounded-xl object-cover md:h-[420px]"
          />
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-lg border-2 ${
                    index === activeImage ? "border-amber-brand" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Summary card */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-teal-brand px-3 py-1 text-xs font-medium text-cream">
                {type}
              </span>
              <button
                onClick={handleFavorite}
                disabled={favBusy}
                aria-label={favoriteId ? "Remove from favorites" : "Add to favorites"}
                className="flex items-center gap-2 rounded-full border border-teal-brand px-4 py-1.5 text-sm font-medium text-teal-brand transition-colors hover:bg-teal-brand hover:text-cream disabled:opacity-60"
              >
                {favoriteId ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                {favoriteId ? "Saved" : "Save"}
              </button>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-teal-brand">{title}</h1>
            <p className="mt-2 flex items-center gap-2 text-charcoal/70">
              <FaMapMarkerAlt className="text-amber-deep" /> {location}
            </p>

            <p className="mt-6 text-3xl font-bold text-charcoal">
              ${rent}
              <span className="text-base font-normal text-charcoal/60">
                {" "}
                / {periodLabel}
              </span>
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-cream p-3">
                <FaBed className="mx-auto text-xl text-teal-brand" />
                <p className="mt-1 text-sm font-medium">{bedrooms} Beds</p>
              </div>
              <div className="rounded-lg bg-cream p-3">
                <FaBath className="mx-auto text-xl text-teal-brand" />
                <p className="mt-1 text-sm font-medium">{bathrooms} Baths</p>
              </div>
              <div className="rounded-lg bg-cream p-3">
                <FaRulerCombined className="mx-auto text-xl text-teal-brand" />
                <p className="mt-1 text-sm font-medium">{size} sqft</p>
              </div>
            </div>

            <button
              onClick={() => setShowBooking(true)}
              className="mt-6 w-full rounded-md bg-amber-brand px-5 py-3 font-medium text-charcoal transition-colors hover:bg-amber-deep"
            >
              Book Property
            </button>

            <div className="mt-6 border-t border-charcoal/10 pt-5 text-sm">
              <p className="font-medium text-teal-brand">Listed by</p>
              <p className="mt-1">{ownerName}</p>
              <p className="text-charcoal/70">{ownerEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description and amenities */}
      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-teal-brand">About this property</h2>
          <p className="mt-3 leading-relaxed text-charcoal/80">{description}</p>

          {extraFeatures && (
            <>
              <h3 className="mt-8 text-xl font-semibold text-teal-brand">
                Extra features
              </h3>
              <p className="mt-2 text-charcoal/80">{extraFeatures}</p>
            </>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-teal-brand">Amenities</h2>
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {amenities.map((item) => (
              <li key={item} className="flex items-center gap-2 text-charcoal/80">
                <FaCheckCircle className="text-amber-deep" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showBooking && (
        <BookingModal property={property} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
};

export default PropertyDetails;