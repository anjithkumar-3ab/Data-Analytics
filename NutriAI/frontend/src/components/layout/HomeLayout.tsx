import { type ReactNode } from "react";
import HomeNavbar from "./HomeNavbar";
import Footer from "./Footer";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <HomeNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
