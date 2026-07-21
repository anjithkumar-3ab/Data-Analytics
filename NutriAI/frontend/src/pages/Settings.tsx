import { Link } from "react-router-dom";
import { Button } from "../components/common";
import { ROUTES } from "../constants";

export default function Settings() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-950">
      <h1 className="text-8xl font-bold text-green-600">Settings</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Settings page is under construction.
      </p>
      <Link to={ROUTES.HOME} className="mt-8">
        <Button variant="outline">Go Home</Button>
      </Link>
    </div>
  );
}
