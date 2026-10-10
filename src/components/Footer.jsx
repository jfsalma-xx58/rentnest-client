import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "./Logo";
import { siteConfig } from "../config/siteConfig";

const Footer = () => {
  const socialClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:border-amber-brand hover:bg-amber-brand hover:text-charcoal";

  const linkClass = "text-cream/80 transition-colors hover:text-amber-brand";

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
              <Link to="/" className={linkClass}>Home</Link>
            </li>
            <li>
              <Link to="/properties" className={linkClass}>All Properties</Link>
            </li>
            <li>
              <Link to="/login" className={linkClass}>Login</Link>
            </li>
            <li>
              <Link to="/register" className={linkClass}>Register</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-amber-brand">
            Contact us
          </h3>
          <ul className="space-y-3 text-sm text-cream/80">
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-amber-brand" />
              Comilla, Chittagong, Bangladesh
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-amber-brand" />
              +880 1234 567890
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-amber-brand" />
              support@rentnest.com
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-amber-brand">
            Follow us
          </h3>
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className={socialClass}>
              <FaFacebookF />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className={socialClass}>
              <FaXTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className={socialClass}>
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className={socialClass}>
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/15 py-5 text-center text-sm text-cream/70">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;