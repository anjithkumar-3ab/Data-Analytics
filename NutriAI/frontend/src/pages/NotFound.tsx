import { Link } from "react-router-dom";
import { Button } from "../components/common";
import { ROUTES } from "../constants";

/** 404 page displayed for unmatched routes. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-950">
      <h1 className="text-8xl font-bold text-green-600">404</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Page not found.
      </p>
      <Link to={ROUTES.HOME} className="mt-8">
        <Button variant="outline">Go Home</Button>
      </Link>
    </div>
  );
}
