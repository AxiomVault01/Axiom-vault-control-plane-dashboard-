"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pagination } from "../../organisations/components/ui";
import { Avatar } from "../../users/components/badges";
import { useRoles } from "../RolesProvider";
import { RoleBadge, RolesHeader, btnOutline, btnPrimary } from "./ui";

const PAGE_SIZE = 5;

export default function RolesTable() {
  const router = useRouter();
  const { roles } = useRoles();
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(roles.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = roles.slice(start, start + PAGE_SIZE);

  const open = (id: string) => router.push(`/dashboard/roles/details?role=${id}`);

  return (
    <div className="space-y-6">
      <RolesHeader
        actions={
          <>
            <Link href="/dashboard/roles/drafts" className={btnOutline}>
              Saved Draft
            </Link>
            <Link href="/dashboard/roles/create" className={btnPrimary}>
              Create New Roles
            </Link>
          </>
        }
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
            <thead className="bg-slate-100 text-slate-900">
              <tr>
                {["User", "Roles", "Departments", "Role created Date"].map((h) => (
                  <th key={h} scope="col" className="px-5 py-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => open(r.id)}
                  className="cursor-pointer border-t border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar id={r.holder.id} name={r.holder.name || r.name} />
                      <span className="min-w-0">
                        <span className="block font-medium text-slate-900">{r.holder.name || "Unassigned"}</span>
                        <span className="block text-xs text-slate-600">{r.holder.email}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/roles/details?role=${r.id}`}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`View ${r.name} role details`}
                    >
                      <RoleBadge tone={r.tone}>{r.name}</RoleBadge>
                    </Link>
                  </td>
                  <td className="px-5 py-4">{r.department}</td>
                  <td className="px-5 py-4">{r.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={current}
        pageCount={pageCount}
        onChange={setPage}
        summary={`Showing ${start + 1}-${start + visible.length} of ${roles.length} Roles`}
      />
    </div>
  );
}
