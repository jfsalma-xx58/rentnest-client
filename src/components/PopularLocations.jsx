
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Reveal from "./Reveal";

const locations = [
  {
    name: "Dhaka",
    text: "Modern living, endless opportunities.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Sylhet",
    text: "Nature, peace and beautiful homes.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Chattogram",
    text: "Coastal living at its best.",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Cox's Bazar",
    text: "Sun, sea and a slower pace.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85",
  },
];

const PopularLocations = () => (
  <section id="locations" className="scroll-mt-20 bg-[#f1ebdd] py-16 sm:py-20 lg:py-24">
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-deep">
              Explore
            </p>
            <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-teal-dark sm:text-5xl">
              Popular
              <br className="hidden sm:block" /> Locations
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-charcoal/65">
              Discover the unique charm of Bangladesh's most loved
              neighbourhoods.
            </p>
          </div>

          <Link
            to="/properties"
            className="mb-1 inline-flex items-center gap-2 border-b border-charcoal/30 pb-1 text-sm font-medium transition hover:border-amber-deep hover:text-amber-deep"
          >
            View all locations <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </Reveal>

      <div className="mt-9 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {locations.map(({ name, text, image }, index) => (
          <Reveal key={name} delay={index * 0.08} className="h-full">
            <Link
              to={`/properties?location=${encodeURIComponent(name)}`}
              aria-label={`Browse homes in ${name}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-teal-dark shadow-sm"
            >
              <img
                src={image}
                alt={`${name} landscape`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

              <div className="absolute inset-x-4 bottom-4 text-white sm:inset-x-5 sm:bottom-5">
                <h3 className="font-heading text-xl font-semibold sm:text-2xl">
                  {name}
                </h3>
                <p className="mt-1 max-w-[190px] text-xs leading-5 text-white/80">
                  {text}
                </p>
                <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/60 transition group-hover:border-amber-brand group-hover:bg-amber-brand group-hover:text-charcoal">
                  <FaArrowRight className="text-xs" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default PopularLocations;