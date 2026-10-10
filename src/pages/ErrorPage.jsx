import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const ErrorPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
      <Logo />
      <h1 className="text-7xl font-bold text-teal-brand">404</h1>
      <p className="text-lg">Sorry, we couldn't find the page you're looking for.</p>
      <Link
        to="/"
        className="rounded-md bg-amber-brand px-6 py-2 font-medium text-charcoal transition-colors hover:bg-amber-deep"
      >
        Back to home
      </Link>
    </div>
  );
};

export default ErrorPage;