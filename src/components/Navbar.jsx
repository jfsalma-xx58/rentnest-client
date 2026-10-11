import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `font-medium transition-colors hover:text-amber-deep ${
      isActive ? "text-amber-deep" : "text-charcoal"
    }`;

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    toast.success("Logged out");
    navigate("/");
  };

  const links = (
    <>
      <NavLink to="/" className={linkClass} onClick={closeMenu}>
        Home
      </NavLink>
      <NavLink to="/properties" className={linkClass} onClick={closeMenu}>
        All Properties
      </NavLink>
      {user && (
        <NavLink to="/dashboard" className={linkClass} onClick={closeMenu}>
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
          title={user.displayName}
          className="h-10 w-10 rounded-full border-2 border-amber-brand object-cover"
        />
      )}
      <button
        onClick={handleLogout}
        className="rounded-md bg-teal-brand px-5 py-2 font-medium text-cream transition-colors hover:bg-teal-dark"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        onClick={closeMenu}
        className="rounded-md border border-teal-brand px-5 py-2 text-center font-medium text-teal-brand transition-colors hover:bg-teal-brand hover:text-cream"
      >
        Login
      </Link>
      <Link
        to="/register"
        onClick={closeMenu}
        className="rounded-md bg-amber-brand px-5 py-2 text-center font-medium text-charcoal transition-colors hover:bg-amber-deep"
      >
        Register
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">{links}</div>
        <div className="hidden items-center gap-3 md:flex">{buttons}</div>

        <button
          className="text-2xl text-teal-brand md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 border-t border-charcoal/10 px-4 pb-5 pt-4 md:hidden">
          {links}
          <div className="flex flex-col gap-3">{buttons}</div>
        </div>
      )}
    </header>
  );
};

export default Navbar;