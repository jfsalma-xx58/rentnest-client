import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { formatBdt, usdToBdt } from "../../utils/money";

const Favorites = () => {
  const axiosSecure = useAxiosSecure();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    axiosSecure
      .get("/favorites")
      .then((res) => {
        if (active) setFavorites(res.data);
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
  }, [axiosSecure]);

  const handleRemove = async (id) => {
    try {
      const res = await axiosSecure.delete(`/favorites/${id}`);
      if (res.data.deletedCount > 0) {
        setFavorites((prev) => prev.filter((item) => item._id !== id));
        toast.success("Removed from favorites");
      }
    } catch (err) {
      toast.error("Could not remove. Please try again.");
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-teal-brand">
        Favorites
      </h1>

      {loading && <p className="mt-6 text-charcoal/70">Loading favorites...</p>}

      {error && (
        <p className="mt-6 text-red-600">
          Could not load your favorites. Please refresh the page.
        </p>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className="mt-6 text-center">
          <p className="text-charcoal/70">You haven't saved any property yet.</p>
          <Link
            to="/properties"
            className="mt-4 inline-block rounded-md bg-amber-brand px-5 py-2 font-medium text-charcoal transition-colors hover:bg-amber-deep"
          >
            Browse Properties
          </Link>
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal/70">
                <th className="py-3 pr-4 font-semibold">Property</th>
                <th className="py-3 pr-4 font-semibold">Type</th>
                <th className="py-3 pr-4 font-semibold">Rent</th>
                <th className="py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-charcoal/5 last:border-0"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-12 w-16 rounded-md bg-cream object-cover"
                      />
                      <div>
                        <Link
                          to={`/properties/${item.propertyId}`}
                          className="font-semibold text-charcoal hover:text-amber-deep"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-charcoal/60">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 capitalize text-charcoal">
                    {item.type}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-charcoal">
                    {formatBdt(usdToBdt(item.rent))}
                    {item.rentType ? ` / ${item.rentType}` : ""}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="flex items-center gap-2 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <FaTrash /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Favorites;