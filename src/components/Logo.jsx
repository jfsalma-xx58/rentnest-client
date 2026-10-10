import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Logo = ({ light = false }) => {
  return (
    <Link to="/" className="inline-flex items-center gap-2">
      <FaHome
        className={`text-2xl ${light ? "text-amber-brand" : "text-teal-brand"}`}
      />
      <span className="font-heading text-2xl font-bold">
        <span className={light ? "text-cream" : "text-teal-brand"}>Rent</span>
        <span className={light ? "text-amber-brand" : "text-amber-deep"}>Nest</span>
      </span>
    </Link>
  );
};

export default Logo;