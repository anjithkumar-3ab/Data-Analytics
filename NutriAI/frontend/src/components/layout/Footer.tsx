import { Heart } from "lucide-react";

/** Minimal footer displayed on authenticated pages. */
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-3 text-center text-xs text-gray-400 dark:border-gray-800 dark:bg-gray-900">
      &copy; {new Date().getFullYear()} NutriAI &mdash; Built with{" "}
      <Heart size={12} className="inline text-red-400" /> for health
    </footer>
  );
}
