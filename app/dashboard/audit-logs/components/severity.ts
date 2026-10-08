import type { Severity } from "../data";

export const severityClass: Record<Severity, string> = {
  info: "text-blue-600",
  warning: "text-amber-500",
  critical: "text-red-600",
};
