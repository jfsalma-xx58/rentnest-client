import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const roles = ["tenant", "owner", "admin"];

const roleStyles = {
  tenant: "bg-teal-brand/10 text-teal-brand",
  owner: "bg-amber-brand/20 text-amber-deep",
  admin: "bg-red-100 text-red-700",
};

const selectClass =
  "rounded-md border border-charcoal/20 bg-white px-3 py-1.5 text-sm " +
  "capitalize outline-none focus:border-teal-brand disabled:opacity-50";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let active = true;
    axiosSecure
      .get("/admin/users")
      .then((res) => {
        if (active) setUsers(res.data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [axiosSecure]);

  const changeRole = async (id, role) => {
    try {
      setBusyId(id);
      await axiosSecure.patch(`/admin/users/${id}/role`, { role });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );
      toast.success(`Role changed to ${role}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not change the role. Try again."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-teal-brand">
        All Users
      </h1>

      {loading && <p className="mt-6 text-charcoal/70">Loading users...</p>}

      {error && (
        <p className="mt-6 text-red-600">
          Could not load users. Please refresh the page.
        </p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal/70">
                <th className="py-3 pr-4 font-semibold">User</th>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">Role</th>
                <th className="py-3 font-semibold">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => {
                const isMe = item.email === user?.email;
                return (
                  <tr
                    key={item._id}
                    className="border-b border-charcoal/5 last:border-0"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="h-10 w-10 rounded-full bg-cream object-cover"
                          />
                        ) : (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-brand text-cream">
                            {item.name?.[0] || "U"}
                          </span>
                        )}
                        <span className="font-semibold text-charcoal">
                          {item.name}
                          {isMe && (
                            <span className="ml-2 text-xs font-normal text-charcoal/50">
                              (you)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-charcoal">{item.email}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          roleStyles[item.role] || "bg-charcoal/10"
                        }`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <select
                        value={item.role}
                        onChange={(e) => changeRole(item._id, e.target.value)}
                        disabled={isMe || busyId === item._id}
                        title={isMe ? "You can't change your own role" : ""}
                        className={selectClass}
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;