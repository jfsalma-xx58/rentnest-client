import { FaSearch, FaCalendarCheck, FaKey } from "react-icons/fa";

const steps = [
  {
    icon: FaSearch,
    title: "Find a property",
    text: "Search by location, type and budget, then save favorites you like.",
  },
  {
    icon: FaCalendarCheck,
    title: "Reserve it online",
    text: "Choose your move-in date and pay the reservation fee securely.",
  },
  {
    icon: FaKey,
    title: "Move in",
    text: "The owner confirms your booking and you get ready for the keys.",
  },
];

const HowItWorks = () => (
  <section className="bg-teal-dark py-16 text-cream">
    <div className="mx-auto max-w-7xl px-4">
      <h2 className="text-center font-heading text-3xl font-bold md:text-4xl">
        How It Works
      </h2>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <div key={title} className="text-center">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-brand text-2xl text-charcoal">
              <Icon />
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-cream text-sm font-bold text-teal-dark">
                {index + 1}
              </span>
            </div>
            <h3 className="mt-5 font-heading text-xl font-semibold">{title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-cream/80">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;