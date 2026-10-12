import { FaShieldAlt, FaCreditCard, FaSearchLocation, FaHeadset } from "react-icons/fa";

const reasons = [
  {
    icon: FaShieldAlt,
    title: "Approved listings only",
    text: "Every property is reviewed by our team before it appears on RentNest.",
  },
  {
    icon: FaCreditCard,
    title: "Secure reservation",
    text: "Pay a small reservation fee online and hold your place in minutes.",
  },
  {
    icon: FaSearchLocation,
    title: "Search that fits",
    text: "Filter by location, type and price to find the right home quickly.",
  },
  {
    icon: FaHeadset,
    title: "Help when you need it",
    text: "Questions about a booking? Our support team is a message away.",
  },
];

const WhyChooseUs = () => (
  <section className="bg-white py-16">
    <div className="mx-auto max-w-7xl px-4">
      <h2 className="text-center font-heading text-3xl font-bold text-teal-brand md:text-4xl">
        Why Choose RentNest
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-charcoal/70">
        Renting should feel calm. Here is what makes finding your next home easier.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex h-full flex-col rounded-xl border border-charcoal/10 bg-cream p-6"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-brand text-xl text-amber-brand">
              <Icon />
            </span>
            <h3 className="mt-4 font-heading text-xl font-semibold text-charcoal">
              {title}
            </h3>
            <p className="mt-2 text-sm text-charcoal/70">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;