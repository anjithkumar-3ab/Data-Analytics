import { User, Camera } from "lucide-react";

interface ProfileAvatarProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

/** User avatar with name, email, and optional camera overlay for editing. */
export default function ProfileAvatar({ name, email, avatarUrl }: ProfileAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
      <div className="relative shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 ring-2 ring-green-500 ring-offset-2 dark:bg-green-900/30 dark:text-green-400 dark:ring-offset-gray-900">
            <User size={36} />
          </div>
        )}
        <button
          className="absolute bottom-0 right-0 rounded-full bg-green-600 p-1.5 text-white shadow hover:bg-green-700 transition-colors"
          aria-label="Change avatar"
          title="Change avatar"
        >
          <Camera size={14} />
        </button>
      </div>
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
      </div>
    </div>
  );
}
