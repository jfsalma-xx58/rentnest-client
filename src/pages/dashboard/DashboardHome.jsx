import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const DashboardHome = () => {
  const { user } = useAuth();
  const [role] = useRole();

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-3xl font-bold text-teal-brand">
        Welcome, {user?.displayName || "there"}!
      </h1>
      <p className="mt-2 text-charcoal/70">
        You are signed in as a <span className="font-semibold capitalize">{role}</span>.
        Use the menu to manage your account.
      </p>
    </div>
  );
};

export default DashboardHome;