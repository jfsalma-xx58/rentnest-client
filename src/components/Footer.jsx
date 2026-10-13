import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "./Logo";
import { siteConfig } from "../config/siteConfig";

// Edit your real details here. Anything left as "" is not shown.
const contact = {
  address: "Dhaka, Bangladesh",
  phone: "+880 1560-017344",
  phoneLink: "+8801560017344",
  email: "info@rentnest.com",
};

const socials = [
  { label: "X", icon: FaXTwitter, url: "https://x.com" },
  { label: "GitHub", icon: FaGithub, url: "https://github.com/jfsalma-xx58" },
  { label: "Facebook", icon: FaFacebookF, url: "" },
  { label: "Instagram", icon: FaInstagram, url: "" },
  { label: "LinkedIn", icon: FaLinkedinIn, url: "" },
];

const socialClass =
  "flex h-10 w-10 items-center justify-center rounded-full " +
  "border border-cream/30 text-cream transition-colors " +
  "hover:border-amber-brand hover:bg-amber-brand hover:text-charcoal";

const linkClass = "text-cream/80 transition-colors hover:text-amber-brand";

const Footer = () => {
  return (
    <footer className="bg-teal-dark text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-cream/80">
            {siteConfig.tagline} Browse verified rentals, book online and pay
            securely, all in one place.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-amber-brand">
            Quick links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className={linkClass}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/properties" className={linkClass}>
                All Properties
              </Link>
            </li>
            <li>
              <Link to="/login" className={linkClass}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className={linkClass}>
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-amber-brand">
            Contact us
          </h3>
          <ul className="space-y-3 text-sm text-cream/80">
            {contact.address && (
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-amber-brand" />
                {contact.address}
              </li>
            )}
            {contact.phone && (
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-amber-brand" />
                <a href={`tel:${contact.phoneLink}`} className={linkClass}>
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.email && (
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-brand" />
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  {contact.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-amber-brand">
            Follow us
          </h3>
          <div className="flex flex-wrap gap-3">
            {socials
              .filter((item) => item.url)
              .map(({ label, icon: Icon, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={socialClass}
                >
                  <Icon />
                </a>
              ))}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/15 py-5 text-center text-sm text-cream/70">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;