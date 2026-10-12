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
    let active = true;
    axiosSecure
      .get(`/users/role/${user.email}`)
      .then((res) => {
        if (active) setRole(res.data?.role || "tenant");
      })
      .catch(() => {
        if (active) setRole("tenant");
      })
      .finally(() => {
        if (active) setRoleLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.email, authLoading, axiosSecure]);

  return [role, roleLoading];
};

export default useRole;