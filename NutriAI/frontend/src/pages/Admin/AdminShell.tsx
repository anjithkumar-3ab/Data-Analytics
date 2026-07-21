import { useState, useCallback } from "react";
import { AdminSidebar, AdminNavbar } from "../../components/admin";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Foods from "./Foods";
import Recommendations from "./Recommendations";
import Categories from "./Categories";
import Analytics from "./Analytics";
import Settings from "./Settings";
import SystemLogs from "./SystemLogs";
import type { AdminSection } from "../../types/admin";

const sectionTitles: Record<AdminSection, string> = {
  dashboard: "Dashboard",
  users: "Users",
  foods: "Foods",
  recommendations: "Recommendations",
  categories: "Categories",
  analytics: "Analytics",
  settings: "Settings",
  logs: "System Logs",
};

/** Enterprise admin panel – section-based SPA with collapsible sidebar. */
export default function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = useCallback(() => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <Users />;
      case "foods":
        return <Foods />;
      case "recommendations":
        return <Recommendations />;
      case "categories":
        return <Categories />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      case "logs":
        return <SystemLogs />;
      default:
        return <Dashboard />;
    }
  }, [activeSection]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sectionTitles[activeSection]}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
