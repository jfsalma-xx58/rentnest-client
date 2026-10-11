import { Navigate } from "react-router-dom";
import useRole from "../../hooks/useRole";
import Loading from "../../components/Loading";

const DashboardHome = () => {
  const [role, roleLoading] = useRole();

  if (roleLoading) return <Loading />;

  // Owners and admins get their own home pages once we build them
  const target = role === "tenant" ? "/dashboard/my-bookings" : "/dashboard/profile";

  return <Navigate to={target} replace />;
};

export default DashboardHome;