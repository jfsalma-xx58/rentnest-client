import { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      toast.success("Logged out");
      navigate("/");
    } catch {
      toast.error("Unable to log out. Please try again.");
    }
  };

  const linkClass = ({ isActive }) =>
    isHome
      ? `border-b pb-1 text-sm font-medium transition-colors ${
          isActive
            ? "border-amber-brand text-amber-brand"
            : "border-transparent text-white/90 hover:text-white"
        }`
      : `font-medium transition-colors hover:text-amber-deep ${
          isActive ? "text-amber-deep" : "text-charcoal"
        }`;

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={closeMenu}>
        Home
      </NavLink>

      <NavLink
        to="/properties"
        className={linkClass}
        onClick={closeMenu}
      >
        Properties
      </NavLink>

      {user && (
        <NavLink
          to="/dashboard"
          className={linkClass}
          onClick={closeMenu}
        >
          Dashboard
        </NavLink>
      )}
    </>
  );

  const buttons = user ? (
    <>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={user.displayName || "Profile"}
          title={user.displayName || "Profile"}
          className="h-10 w-10 rounded-full border-2 border-amber-brand object-cover"
        />
      )}

      <button
        type="button"
        onClick={handleLogout}
        className={
          isHome
            ? "rounded-lg border border-white/70 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-charcoal"
            : "rounded-md bg-teal-brand px-5 py-2 font-medium text-cream transition-colors hover:bg-teal-dark"
        }
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        onClick={closeMenu}
        className={
          isHome
            ? "px-2 py-2 text-center text-sm font-semibold text-white hover:opacity-80"
            : "rounded-md border border-teal-brand px-5 py-2 text-center font-medium text-teal-brand transition-colors hover:bg-teal-brand hover:text-cream"
        }
      >
        Login
      </Link>

      <Link
        to="/register"
        onClick={closeMenu}
        className={`rounded-md bg-amber-brand text-center font-medium text-charcoal transition-colors hover:bg-amber-deep ${
          isHome
            ? "rounded-lg px-5 py-2.5 text-sm font-semibold"
            : "px-5 py-2"
        }`}
      >
        Get Started
      </Link>
    </>
  );

  const headerClass = isHome
    ? `fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "bg-teal-dark/95 shadow-md backdrop-blur"
          : "bg-transparent"
      }`
    : "sticky top-0 z-50 border-b border-charcoal/10 bg-cream";

  const innerClass = isHome
    ? "mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-8 px-5 sm:px-10 md:grid md:grid-cols-[1fr_auto_1fr] lg:px-0"
    : "mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:grid md:grid-cols-[1fr_auto_1fr]";

  return (
    <header className={headerClass}>
      <nav className={innerClass} aria-label="Primary">
        <div className="justify-self-start">
          <Logo light={isHome} />
        </div>

        <div className="hidden items-center justify-center gap-8 md:flex">
          {links}
        </div>

        <div className="hidden items-center justify-end gap-3 md:flex">
          {buttons}
        </div>

        <button
          type="button"
          className={`text-2xl md:hidden ${
            isHome ? "text-white" : "text-teal-brand"
          }`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {open && (
        <div
          className={`flex flex-col gap-4 border-t px-5 pb-5 pt-4 md:hidden ${
            isHome
              ? "border-white/10 bg-teal-dark"
              : "border-charcoal/10 bg-cream"
          }`}
        >
          {links}

          <div className="flex flex-col gap-3">
            {buttons}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;