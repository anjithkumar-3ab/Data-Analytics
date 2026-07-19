import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h2 className="text-xl font-bold mb-8">Menu</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/" className="hover:text-green-400">
          🏠 Home
        </Link>

        <Link to="/dashboard" className="hover:text-green-400">
          📊 Dashboard
        </Link>

        <Link to="/nutrition" className="hover:text-green-400">
          🥗 Nutrition
        </Link>

        <Link to="/meal-plan" className="hover:text-green-400">
          🍽️ Meal Plan
        </Link>

        <Link to="/profile" className="hover:text-green-400">
          👤 Profile
        </Link>
      </nav>
    </aside>
  );
}