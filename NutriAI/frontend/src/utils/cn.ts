/**
 * Tiny utility to merge Tailwind class strings, filtering out falsy values.
 * For production projects consider `clsx` + `tailwind-merge`; this suffices
 * for a lightweight in-house alternative.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
