import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxiosPublic from "../hooks/useAxiosPublic";
import PropertyCard from "./PropertyCard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturedProperties = () => {
  const axiosPublic = useAxiosPublic();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axiosPublic
      .get("/properties/featured")
      .then((res) => setProperties(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [axiosPublic]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-teal-brand md:text-4xl">
          Featured properties
        </h2>
        <p className="mt-3 text-charcoal/70">
          Hand-picked, approved homes ready for you to book today.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-teal-brand border-t-transparent" />
        </div>
      )}

      {error && (
        <p className="py-10 text-center text-charcoal/70">
          We couldn't load the properties right now. Please try again later.
        </p>
      )}

      {!loading && !error && (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {properties.map((property) => (
            <motion.div key={property._id} variants={item}>
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default FeaturedProperties;