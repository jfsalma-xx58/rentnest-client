import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaCalendarCheck,
  FaHeart,
  FaPlusCircle,
  FaBuilding,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const linksByRole = {
  tenant: [
    { to: "/dashboard", label: "Overview", icon: FaHome, end: true },
    { to: "/dashboard/profile", label: "My Profile", icon: FaUser },
    { to: "/dashboard/my-bookings", label: "My Bookings", icon: FaCalendarCheck },
    { to: "/dashboard/favorites", label: "Favorites", icon: FaHeart },
  ],
  owner: [
    { to: "/dashboard", label: "Overview", icon: FaHome, end: true },
    { to: "/dashboard/add-property", label: "Add Property", icon: FaPlusCircle },
    { to: "/dashboard/my-properties", label: "My Properties", icon: FaBuilding },
    {
      to: "/dashboard/booking-requests",
      label: "Booking Requests",
      icon: FaClipboardList,
    },
    { to: "/dashboard/profile", label: "My Profile", icon: FaUser },
  ],
  admin: [
    { to: "/dashboard", label: "Overview", icon: FaHome, end: true },
    { to: "/dashboard/profile", label: "My Profile", icon: FaUser },
  ],
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [role, roleLoading] = useRole();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = linksByRole[role] || linksByRole.tenant;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-teal-dark text-cream">
      <div className="px-6 py-5 border-b border-white/10">
        <Link to="/" className="font-heading text-2xl font-bold">
          Rent<span className="text-amber-brand">Nest</span>
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <img
            src={user?.photoURL || "https://i.ibb.co/placeholder/avatar.png"}
            alt="profile"
            className="h-10 w-10 rounded-full object-cover bg-cream"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.displayName}</p>
            <span className="inline-block rounded-full bg-amber-brand px-2 py-0.5 text-xs font-semibold capitalize text-charcoal">
              {roleLoading ? "..." : role}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-amber-brand text-charcoal"
                  : "hover:bg-white/10"
              }`
            }
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10"
        >
          <FaHome /> Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <Toaster position="top-right" />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64">{sidebar}</aside>
        </div>
      )}

      <div className="lg:ml-64">
        <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-xl text-teal-brand"
            aria-label="Toggle menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
          <span className="font-heading text-lg font-bold text-teal-brand">
            Dashboard
          </span>
          <span className="w-5" />
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;