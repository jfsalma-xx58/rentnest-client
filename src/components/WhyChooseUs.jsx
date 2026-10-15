import {
  FaSearchLocation,
  FaShieldAlt,
  FaCalendarCheck,
  FaCreditCard,
  FaHeart,
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import Reveal from "./Reveal";

const benefits = [
  {
    icon: FaSearchLocation,
    title: "Find the right fit",
    text: "Useful filters for rent, location, property type and amenities.",
  },
  {
    icon: FaShieldAlt,
    title: "Rent with confidence",
    text: "Clear listing details and transparent processes.",
  },
  {
    icon: FaCalendarCheck,
    title: "Make your next move easier",
    text: "A clear path from discovering a home to contacting the owner or reserving it.",
  },
  {
    icon: MdEventAvailable,
    title: "Convenient online reservations",
    text: "Reserve properties through RentNest with a convenient online booking process.",
  },
  {
    icon: FaCreditCard,
    title: "Secure online payments",
    text: "Pay reservation fees through RentNest's Stripe-powered payment system.",
  },
  {
    icon: FaHeart,
    title: "Keep your favorite homes close",
    text: "Save properties you love and revisit them while comparing your options.",
  },
];

const WhyChooseUs = () => (
  <section className="overflow-hidden bg-cream">
    <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
      <div className="relative min-h-[300px] bg-teal-dark lg:min-h-[560px]">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
          alt="Warm, naturally lit contemporary living room"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      <div className="flex items-center px-5 py-14 sm:px-10 lg:px-14 lg:py-20 xl:px-20">
        <div className="w-full">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-deep">
              Why choose RentNest?
            </p>
            <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-tight text-teal-dark sm:text-4xl lg:text-5xl">
              A smarter way
              <br />
              to find your next home.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-5 lg:mt-12">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 0.1} className="h-full">
                <div
                  className={`h-full ${
                    index > 0
                      ? "sm:border-l sm:border-charcoal/15 sm:pl-5"
                      : ""
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-brand/15 text-xl text-amber-deep">
                    <Icon />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold leading-snug text-charcoal">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-charcoal/65">
                    {text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;