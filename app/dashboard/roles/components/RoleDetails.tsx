"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoles } from "../RolesProvider";
import { RolePicker, RolesHeader, btnOutline, btnPrimary } from "./ui";

export default function RoleDetails() {
  const router = useRouter();
  const { roles, getRole } = useRoles();
  const role = getRole(useSearchParams().get("role"));

  return (
    <div className="space-y-6">
      <RolesHeader
        roleId={role.id}
        actions={
          <>
            <Link href={`/dashboard/roles/permissions?role=${role.id}`} className={btnPrimary}>
              Edit Permission
            </Link>
            <Link href="/dashboard/roles/create" className={btnOutline}>
              Create New Roles
            </Link>
          </>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{role.name}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{role.description}</p>
        </div>
        <RolePicker
          roles={roles}
          value={role.id}
          onChange={(id) => router.replace(`/dashboard/roles/details?role=${id}`)}
        />
      </div>

      <section className="rounded-sm border-l-4 border-blue-700 bg-white px-6 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <h3 className="text-base font-medium text-slate-900">Role Responsibilities</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{role.responsibilities}</p>
      </section>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Assigned to", role.holder.name || "Unassigned"],
          ["Department", role.department],
          ["Created", role.created],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
