import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const Profile = () => {
  const { user } = useAuth();
  const [role] = useRole();

  const joined = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-brand">My profile</h1>

      <div className="mt-6 max-w-2xl rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "Profile"}
              className="h-28 w-28 rounded-full border-4 border-amber-brand object-cover"
            />
          ) : (
            <span className="flex h-28 w-28 items-center justify-center rounded-full bg-amber-brand text-4xl font-bold text-charcoal">
              {(user?.displayName || user?.email || "?").charAt(0).toUpperCase()}
            </span>
          )}

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-teal-brand">
              {user?.displayName || "User"}
            </h2>
            <span className="mt-2 inline-block rounded-full bg-teal-brand px-3 py-1 text-xs font-medium capitalize text-cream">
              {role}
            </span>
          </div>
        </div>

        <dl className="mt-8 divide-y divide-charcoal/10 text-sm">
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-medium">Full name</dt>
            <dd className="text-charcoal/80">{user?.displayName || "Not set"}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-medium">Email</dt>
            <dd className="break-all text-charcoal/80">{user?.email}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-medium">Role</dt>
            <dd className="capitalize text-charcoal/80">{role}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-medium">Member since</dt>
            <dd className="text-charcoal/80">{joined}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Profile;