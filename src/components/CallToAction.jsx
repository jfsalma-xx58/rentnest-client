import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Reveal from "./Reveal";
import { getAsset } from "../utils/getAsset";

const CallToAction = () => {
  const bg = getAsset("cta");

  return (
    <section
      className="relative overflow-hidden bg-teal-dark bg-cover bg-center"
      style={bg ? { backgroundImage: `url(${bg})` } : undefined}
    >
      <div className="absolute inset-0 bg-teal-dark/70" />
      <Reveal>
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center text-cream md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-brand">
            Ready for your next chapter?
          </p>
          <h2 className="mt-4 font-heading text-4xl font-semibold md:text-6xl">
            Your next chapter starts here.
          </h2>
          <p className="mt-4 text-cream/85">
            Explore homes that fit your life and your budget.
          </p>
          <Link
            to="/properties"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber-brand px-7 py-3.5 text-sm font-semibold text-charcoal transition-colors hover:bg-amber-deep"
          >
            Explore Homes <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
};

export default CallToAction;