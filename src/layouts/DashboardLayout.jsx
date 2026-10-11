import { useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaCalendarCheck,
  FaHeart,
  FaUser,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../components/Logo";
import Loading from "../components/Loading";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const profileLink = { to: "/dashboard/profile", label: "Profile", icon: FaUser };

// Owner and admin links get added here as we build their pages
const linksByRole = {
  tenant: [
    { to: "/dashboard/my-bookings", label: "My Bookings", icon: FaCalendarCheck },
    { to: "/dashboard/favorites", label: "Favorites", icon: FaHeart },
    profileLink,
  ],
  owner: [profileLink],
  admin: [profileLink],
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [role, roleLoading] = useRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/");
  };

  if (roleLoading) return <Loading />;

  const links = linksByRole[role] || linksByRole.tenant;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-4 py-2.5 font-medium transition-colors ${
      isActive
        ? "bg-amber-brand text-charcoal"
        : "text-cream/80 hover:bg-cream/10 hover:text-cream"
    }`;

  const sidebarContent = (
    <div className="flex h-full flex-col p-5">
      <Logo light />

      <div className="mt-8 flex items-center gap-3 rounded-lg bg-cream/10 p-3">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "Profile"}
            className="h-11 w-11 rounded-full border-2 border-amber-brand object-cover"
          />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-brand font-bold text-charcoal">
            {(user?.displayName || user?.email || "?").charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {user?.displayName || "User"}
          </p>
          <span className="mt-0.5 inline-block rounded-full bg-amber-brand px-2 py-0.5 text-xs font-medium capitalize text-charcoal">
            {role}
          </span>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={closeMenu}>
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-cream/15 pt-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-md px-4 py-2.5 font-medium text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <FaHome /> Back to home
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-md px-4 py-2.5 text-left font-medium text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-teal-dark text-cream lg:sticky lg:top-0 lg:block lg:h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60" onClick={closeMenu} />
          <aside className="relative h-full w-64 bg-teal-dark text-cream">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-charcoal/10 bg-white px-4 py-3 lg:hidden">
          <Logo />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="text-2xl text-teal-brand"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default DashboardLayout;