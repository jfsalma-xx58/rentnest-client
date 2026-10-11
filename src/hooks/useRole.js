import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.email) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);
    axiosSecure
      .get(`/users/role/${user.email}`)
      .then((res) => setRole(res.data.role))
      .catch(() => setRole("tenant"))
      .finally(() => setRoleLoading(false));
  }, [user, authLoading, axiosSecure]);

  return [role, roleLoading];
};

export default useRole;