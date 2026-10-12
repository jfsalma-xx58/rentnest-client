import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const Profile = () => {
  const { user } = useAuth();
  const [role, roleLoading] = useRole();

  return (
    <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-teal-brand">My Profile</h1>
      <div className="mt-6 flex flex-col items-center gap-4 text-center">
        <img
          src={user?.photoURL || "https://i.ibb.co/placeholder/avatar.png"}
          alt="profile"
          className="h-28 w-28 rounded-full object-cover bg-cream"
        />
        <div>
          <p className="text-xl font-semibold text-charcoal">{user?.displayName}</p>
          <p className="text-charcoal/70">{user?.email}</p>
          <span className="mt-2 inline-block rounded-full bg-amber-brand px-3 py-1 text-sm font-semibold capitalize text-charcoal">
            {roleLoading ? "Loading..." : role}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;