import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Lightbulb,
  Tags,
  BarChart3,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { cn } from "../../utils";
import type { AdminSection } from "../../types/admin";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "foods", label: "Foods", icon: UtensilsCrossed },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "recommendations", label: "Recommendations", icon: Lightbulb },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "logs", label: "System Logs", icon: ScrollText },
  { id: "settings", label: "Settings", icon: Settings },
];

/** Admin-specific sidebar with section navigation. */
export default function AdminSidebar({
  collapsed,
  onToggle,
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out h-screen sticky top-0 dark:border-gray-800 dark:bg-gray-900",
        collapsed ? "w-18 items-center" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-indigo-600" />
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Admin
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 text-left",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                size={20}
                className={cn(
                  "shrink-0",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 dark:text-gray-500",
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
