import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import Banner from "../components/Banner";
import FeaturedProperties from "../components/FeaturedProperties";
import WhyChooseUs from "../components/WhyChooseUs";
import PopularLocations from "../components/PopularLocations";
import CustomerReviews from "../components/CustomerReviews";

const Home = () => {
  return (
    <div className="overflow-hidden bg-cream">
      <Banner />

      <FeaturedProperties />

      <PopularLocations />

      <WhyChooseUs />

      <CustomerReviews />

      <section className="relative isolate overflow-hidden bg-teal-dark px-5 py-16 text-center text-cream sm:py-20">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.openai.com/static-rsc-4/l3pPwbqBXRPgeJ3h9CnQ7HWmymOjoj4ZoY1JUhkNvDa4Z4sxeIEQeuufzBqvOjO7LE6ydZndEt_HNHT8ffJ8E8sg-9zXfU4DrHVr67biGodPTabmfqYsUQOxPsooy4TwvB7lN4xc8GlbKVID8ZRkjpk6MhrSYQy91T8tbDZEW8UAU4wv6DrqfOTzRfm2qhml?purpose=fullsize"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-brand">
          Ready to find your place?
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
          Your next chapter
          <br />
          starts here.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/80">
          Explore places that fit your lifestyle, your needs and your budget.
        </p>

        <Link
          to="/properties"
          className="mt-7 inline-flex items-center gap-3 rounded-full bg-amber-brand px-7 py-3 text-sm font-semibold text-charcoal transition hover:bg-amber-deep"
        >
          Explore homes <FaArrowRight />
        </Link>
      </section>
    </div>
  );
};

export default Home;