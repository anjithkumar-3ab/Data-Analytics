import { useContext } from "react";
import { ThemeContext } from "../context";

/**
 * Consume the ThemeContext. Must be called inside <ThemeProvider>.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
