"use client";

import { Fragment, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CornerDownRight } from "lucide-react";
import { Pagination } from "../../organisations/components/ui";
import { NO_ACCESS, RESOURCES, type AdminRole, type PermissionSet } from "../data";
import { useRoles } from "../RolesProvider";
import SuccessModal from "./modals/SuccessModal";
import { RolePicker, RolesHeader, btnOutline, btnPrimary } from "./ui";

const PAGE_SIZE = 6; // resource groups per page

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-full transition ${
        on ? "bg-indigo-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`size-3.5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </button>
  );
}

const samePermissions = (a: PermissionSet, b: PermissionSet) =>
  RESOURCES.every((r) => [...(a[r.key] ?? [])].sort().join() === [...(b[r.key] ?? [])].sort().join());

export default function PermissionMatrix() {
  const { getRole } = useRoles();
  const role = getRole(useSearchParams().get("role"));
  // Remount per role so unsaved edits never leak into another role
  return <Matrix key={role.id} role={role} />;
}

function Matrix({ role }: { role: AdminRole }) {
  const router = useRouter();
  const { roles, getPermissions, applyPermissions } = useRoles();
  const saved = getPermissions(role.id);
  const [draft, setDraft] = useState<PermissionSet>(saved);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);

  const dirty = !samePermissions(draft, saved);

  const toggle = (resource: string, action: string) =>
    setDraft((d) => {
      const granted = d[resource] ?? [];
      if (action === NO_ACCESS) {
        // No Access clears everything; switching it off restores basic View
        return { ...d, [resource]: granted.length ? [] : ["View"] };
      }
      return {
        ...d,
        [resource]: granted.includes(action) ? granted.filter((a) => a !== action) : [...granted, action],
      };
    });

  const apply = () => {
    applyPermissions(role.id, draft);
    setNotice("Changes successfully Applied");
  };
  const discard = () => {
    setDraft(saved);
    setNotice("Changes successfully Discarded");
  };
  const closeNotice = useCallback(() => setNotice(null), []);

  const pageCount = Math.ceil(RESOURCES.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visible = RESOURCES.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <RolesHeader
        roleId={role.id}
        actions={
          dirty && (
            <>
              <button type="button" onClick={discard} className={btnOutline}>
                Discard Changes
              </button>
              <button type="button" onClick={apply} className={btnPrimary}>
                Apply Changes
              </button>
            </>
          )
        }
      />

      <div className="flex justify-end">
        <RolePicker
          roles={roles}
          value={role.id}
          onChange={(id) => router.replace(`/dashboard/roles/permissions?role=${id}`)}
        />
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <h2 className="bg-slate-200/70 px-4 py-4 text-sm font-semibold text-slate-900">
          Core Operations &amp; Intelligence Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-120 text-left text-sm">
            <thead className="bg-indigo-50/60 font-mono text-xs uppercase tracking-widest text-slate-700">
              <tr>
                <th scope="col" className="border-y border-slate-200 px-4 py-3 font-medium">
                  Resource / Action
                </th>
                <th scope="col" className="w-2/5 border border-r-0 border-slate-200 px-4 py-3 text-center font-medium">
                  {role.name} Access
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((res) => {
                const granted = draft[res.key] ?? [];
                return (
                  <Fragment key={res.key}>
                    <tr className="border-b border-slate-200 bg-slate-50/60">
                      <th scope="rowgroup" className="px-4 py-3 text-left font-semibold text-slate-900">
                        {res.label}
                      </th>
                      <td className="border-l border-slate-200 bg-white" />
                    </tr>
                    {[...res.actions, NO_ACCESS].map((action) => {
                      const on = action === NO_ACCESS ? granted.length === 0 : granted.includes(action);
                      return (
                        <tr key={action} className="border-b border-slate-200 last:border-b-0">
                          <td className="px-4 py-2.5 text-slate-600">
                            <span className="flex items-center gap-2 pl-2">
                              <CornerDownRight className="size-3.5 text-slate-400" aria-hidden="true" />
                              {action}
                            </span>
                          </td>
                          <td className="border-l border-slate-200 bg-indigo-50/40 px-4 py-2.5 text-center">
                            <Toggle
                              on={on}
                              onChange={() => toggle(res.key, action)}
                              label={`${res.label}: ${action}`}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={setPage}
        summary={`Showing ${start + 1}-${start + visible.length} of ${RESOURCES.length} Resources`}
      />

      <SuccessModal
        open={notice !== null}
        message={notice ?? ""}
        onClose={closeNotice}
        action={{
          label: "View Permission",
          onClick: () => {
            closeNotice();
            setPage(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
        }}
      />
    </div>
  );
}
