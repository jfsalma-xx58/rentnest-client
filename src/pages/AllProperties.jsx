import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";
import PropertyCard from "../components/PropertyCard";
import Loading from "../components/Loading";

// Change this to 3 if you want to see pagination with only 6 properties
const PAGE_SIZE = 6;

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Room"];

const inputClass =
  "w-full rounded-md border border-charcoal/15 bg-white px-3 py-2.5 text-charcoal outline-none focus:border-teal-brand";

const AllProperties = () => {
  const axiosPublic = useAxiosPublic();
  const [searchParams, setSearchParams] = useSearchParams();

  const locationQuery = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [form, setForm] = useState({
    location: locationQuery,
    type,
    minPrice,
    maxPrice,
  });
  const [data, setData] = useState({ properties: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Keep the form in sync with the address bar (for example after a banner search)
  useEffect(() => {
    setForm({ location: locationQuery, type, minPrice, maxPrice });
  }, [locationQuery, type, minPrice, maxPrice]);

  // Ask the server for the properties whenever the filters change
  useEffect(() => {
    setLoading(true);
    setError(false);
    axiosPublic
      .get("/properties", {
        params: {
          location: locationQuery,
          type,
          minPrice,
          maxPrice,
          sort,
          page,
          limit: PAGE_SIZE,
        },
      })
      .then((res) => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [axiosPublic, locationQuery, type, minPrice, maxPrice, sort, page]);

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ ...form, page: "" });
  };

  const handleSort = (e) => updateParams({ sort: e.target.value, page: "" });

  const goToPage = (nextPage) => {
    updateParams({ page: nextPage > 1 ? String(nextPage) : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => setSearchParams({});

  const hasFilters = locationQuery || type || minPrice || maxPrice || sort;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-teal-brand md:text-4xl">
          All properties
        </h1>
        <p className="mt-3 text-charcoal/70">
          Search and filter approved rentals to find your next home.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="grid gap-3 rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Dhaka"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Property type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Any type</option>
            {propertyTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Min rent (BDT)</label>
          <input
            type="number"
            name="minPrice"
            min="0"
            value={form.minPrice}
            onChange={handleChange}
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Max rent (BDT)</label>
          <input
            type="number"
            name="maxPrice"
            min="0"
            value={form.maxPrice}
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
      </form>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-charcoal/70">
          {loading
            ? "Loading..."
            : `${data.total} ${data.total === 1 ? "property" : "properties"} found`}
          {hasFilters && !loading && (
            <button
              onClick={clearAll}
              className="ml-3 font-medium text-teal-brand hover:underline"
            >
              Clear filters
            </button>
          )}
        </p>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by</label>
          <select
            value={sort}
            onChange={handleSort}
            className="rounded-md border border-charcoal/15 bg-white px-3 py-2 text-sm outline-none focus:border-teal-brand"
          >
            <option value="">Newest first</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading && <Loading />}

      {error && !loading && (
        <p className="py-16 text-center text-charcoal/70">
          We couldn't load the properties right now. Please try again later.
        </p>
      )}

      {!loading && !error && data.properties.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-charcoal/70">
            No properties match your search.
          </p>
          <button
            onClick={clearAll}
            className="mt-4 rounded-md bg-amber-brand px-6 py-2 font-medium text-charcoal transition-colors hover:bg-amber-deep"
          >
            Clear filters
          </button>
        </div>
      )}

      {!loading && !error && data.properties.length > 0 && (
        <>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="rounded-md border border-teal-brand px-4 py-2 text-sm font-medium text-teal-brand transition-colors hover:bg-teal-brand hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: data.totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => goToPage(number)}
                    className={`h-10 w-10 rounded-md text-sm font-medium transition-colors ${
                      number === page
                        ? "bg-teal-brand text-cream"
                        : "border border-charcoal/15 text-charcoal hover:border-teal-brand"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= data.totalPages}
                className="rounded-md border border-teal-brand px-4 py-2 text-sm font-medium text-teal-brand transition-colors hover:bg-teal-brand hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllProperties;