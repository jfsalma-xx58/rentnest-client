import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaDollarSign, FaBuilding, FaCalendarCheck } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const cardClass =
  "flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm";
const iconClass =
  "flex h-14 w-14 items-center justify-center rounded-full " +
  "bg-teal-brand text-2xl text-amber-brand";

const SummaryCard = ({ icon: Icon, label, value }) => (
  <div className={cardClass}>
    <span className={iconClass}>
      <Icon />
    </span>
    <div>
      <p className="text-sm text-charcoal/70">{label}</p>
      <p className="font-heading text-3xl font-bold text-charcoal">{value}</p>
    </div>
  </div>
);

const OwnerAnalytics = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    axiosSecure
      .get("/owner/stats")
      .then((res) => {
        if (active) setStats(res.data);
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

  if (loading) {
    return <p className="text-charcoal/70">Loading your statistics...</p>;
  }

  if (error || !stats) {
    return (
      <p className="text-red-600">
        Could not load your statistics. Please refresh the page.
      </p>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-teal-brand">
        Owner Dashboard
      </h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          icon={FaDollarSign}
          label="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
        <SummaryCard
          icon={FaBuilding}
          label="Total Properties"
          value={stats.totalProperties}
        />
        <SummaryCard
          icon={FaCalendarCheck}
          label="Total Bookings"
          value={stats.totalBookings}
        />
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-teal-brand">
          Monthly Earnings
        </h2>
        <p className="mt-1 text-sm text-charcoal/70">
          Your earnings over the last 12 months.
        </p>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2A2E20" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`$${value}`, "Earnings"]} />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#0F5257"
                strokeWidth={3}
                dot={{ r: 4, fill: "#E0A33A" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OwnerAnalytics;