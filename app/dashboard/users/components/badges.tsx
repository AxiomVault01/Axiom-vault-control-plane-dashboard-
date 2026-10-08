import type { Role, UserStatus } from "../data";
import { avatarColor, initials } from "../data";

const roleClass: Record<Role, string> = {
  "Super Admin": "bg-fuchsia-100 text-fuchsia-600",
  "Org Admin": "bg-blue-100 text-blue-600",
  Analyst: "bg-slate-100 text-slate-500",
  Viewer: "bg-slate-100 text-slate-500",
};

const statusDot: Record<UserStatus, string> = {
  Active: "bg-indigo-600",
  Inactive: "bg-slate-400",
  Suspended: "bg-red-500",
};

export function RoleBadge({ role, size = "md" }: { role: Role; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-md ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2 py-1.5 text-sm"
      } ${roleClass[role]}`}
    >
      {role}
    </span>
  );
}

export function StatusLabel({ status }: { status: UserStatus }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-slate-600">
      <span className={`size-2 rounded-full ${statusDot[status]}`} aria-hidden="true" />
      {status}
    </span>
  );
}

export function Avatar({ id, name, size = "sm" }: { id: string; name: string; size?: "sm" | "lg" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full text-white ${avatarColor(id)} ${
        size === "lg" ? "size-16 text-xl" : "size-7 text-[11px] font-medium"
      }`}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
