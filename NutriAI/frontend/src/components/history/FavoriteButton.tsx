import { Star } from "lucide-react";
import { cn } from "../../utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  className?: string;
}

/** Toggle button for marking/unmarking a recommendation as favorite. */
export default function FavoriteButton({
  isFavorite,
  onClick,
  className,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "rounded-lg p-2 transition-colors",
        isFavorite
          ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          : "text-gray-400 hover:bg-gray-100 hover:text-yellow-500 dark:hover:bg-gray-800",
        className,
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
}
