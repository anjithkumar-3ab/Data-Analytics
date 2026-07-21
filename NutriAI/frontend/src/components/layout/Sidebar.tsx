import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  User,
  Bot,
  History,
  CalendarDays,
  BarChart3,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { defaultUser } from "../../constants/user";
import { ROUTES } from "../../constants";
import { cn } from "../../utils";

interface NavGroup {
  label: string;
  items: {
    to: string;
    label: string;
    icon: React.ElementType;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { to: ROUTES.HOME, label: "Home", icon: Home },
      { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
      { to: ROUTES.PROFILE, label: "Profile", icon: User },
    ],
  },
  {
    label: "Diet",
    items: [
      { to: ROUTES.RECOMMENDATION, label: "Recommendation", icon: Bot },
      { to: ROUTES.HISTORY, label: "History", icon: History },
      { to: ROUTES.WEEKLY_PLANNER, label: "Weekly Planner", icon: CalendarDays },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: ROUTES.ANALYTICS, label: "Analytics", icon: BarChart3 },
      { to: ROUTES.POWERBI, label: "Power BI", icon: Database },
      { to: ROUTES.ADMIN, label: "Admin", icon: Settings },
      { to: ROUTES.SETTINGS, label: "Settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/** Collapsible sidebar with navigation sections. On mobile it renders as a drawer. */
export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const user = defaultUser;
  const location = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition-all duration-300 ease-in-out h-screen sticky top-0",
          collapsed ? "w-18" : "w-64",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
          {!collapsed && (
            <span className="text-lg font-bold text-green-600">🥗 NutriAI</span>
          )}
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {group.label}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive: active }) =>
                          cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                            active
                              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                            collapsed && "justify-center px-2",
                          )
                        }
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon
                          size={20}
                          className={cn(
                            "shrink-0",
                            isActive
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-400 dark:text-gray-500",
                          )}
                        />
                        {!collapsed && <span>{item.label}</span>}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3 dark:border-gray-800">
          {!collapsed ? (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.name ?? user?.email ?? "User"}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
            </div>
          )}
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {!collapsed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={onToggle}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 top-0 z-50 flex w-64 flex-col bg-white dark:bg-gray-900 shadow-xl md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
                <span className="text-lg font-bold text-green-600">🥗 NutriAI</span>
                <button
                  onClick={onToggle}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {navGroups.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      {group.label}
                    </p>
                    <ul className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.to;
                        return (
                          <li key={item.to}>
                            <NavLink
                              to={item.to}
                              onClick={onToggle}
                              className={({ isActive: active }) =>
                                cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                  active
                                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                                )
                              }
                            >
                              <Icon
                                size={20}
                                className={cn(
                                  "shrink-0",
                                  isActive
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-400 dark:text-gray-500",
                                )}
                              />
                              <span>{item.label}</span>
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
              <div className="border-t border-gray-200 p-3 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                    {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.name ?? user?.email ?? "User"}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
