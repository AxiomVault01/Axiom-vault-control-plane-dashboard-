"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MoreVertical, Search } from "lucide-react";
import { toast } from "react-toastify";
import { Pagination, Panel, Pill } from "../../components/ui";
import { initials, orgUsers, type OrgUser, type OrgUserStatus } from "../../data";

const PAGE_SIZE = 5;
const ROLES = Array.from(new Set(orgUsers.map((u) => u.role)));
const STATUSES: OrgUserStatus[] = ["Active", "Invited", "Suspended"];

const statusPill: Record<OrgUserStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Invited: "bg-slate-100 text-slate-600",
  Suspended: "bg-red-50 text-red-600",
};

function RowActions({
  user,
  onChange,
  onRemove,
}: {
  user: OrgUser;
  onChange: (status: OrgUserStatus) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const item = "block w-full px-4 py-2 text-left text-xs hover:bg-slate-50";
  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label={`Actions for ${user.name}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="rounded p-1.5 text-slate-700 hover:bg-slate-100"
      >
        <MoreVertical className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg">
          {user.status === "Invited" && (
            <button type="button" className={item} onClick={() => { toast.success(`Invite resent to ${user.email}`); setOpen(false); }}>
              Resend invite
            </button>
          )}
          {user.status === "Suspended" ? (
            <button type="button" className={item} onClick={() => { onChange("Active"); setOpen(false); }}>
              Reactivate
            </button>
          ) : (
            <button type="button" className={item} onClick={() => { onChange("Suspended"); setOpen(false); }}>
              Suspend
            </button>
          )}
          <button type="button" className={`${item} text-red-600 hover:bg-red-50`} onClick={() => { onRemove(); setOpen(false); }}>
            Remove user
          </button>
        </div>
      )}
    </div>
  );
}

// Users tab
export default function OrganisationUsersPage() {
  const [users, setUsers] = useState(orgUsers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (!role || u.role === role) &&
        (!status || u.status === status) &&
        (!q || [u.name, u.email, u.role].some((v) => v.toLowerCase().includes(q))),
    );
  }, [users, query, role, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const setUserStatus = (id: string, s: OrgUserStatus) => {
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, status: s } : u)));
    toast.success(`User ${s === "Active" ? "reactivated" : "suspended"}`);
  };
  const removeUser = (id: string) => {
    setUsers((list) => list.filter((u) => u.id !== id));
    toast.success("User removed");
  };

  const select =
    "h-10 rounded border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:border-[#0b2b5d] focus:outline-none";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex h-10 flex-1 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-slate-500 focus-within:border-[#0b2b5d]">
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">Search users</span>
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search users by name, email, or role..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </label>
        <div className="flex gap-3">
          <select aria-label="Role type" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className={select}>
            <option value="">Role Type</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={select}>
            <option value="">Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <Panel className="overflow-hidden rounded-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-170 text-left text-xs">
            <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold sm:pl-16">User</th>
                <th scope="col" className="px-4 py-3 font-semibold">Assigned Role</th>
                <th scope="col" className="px-4 py-3 font-semibold">Last Active</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-6 py-3 sm:pl-10">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded bg-slate-200 text-[10px] font-bold text-slate-700">
                        {initials(u.name)}
                      </span>
                      <span>
                        <span className="block font-semibold text-slate-900">{u.name}</span>
                        <span className="block text-[11px] text-slate-500">{u.email}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-800">{u.role}</td>
                  <td className="px-4 py-3 text-slate-800">{u.lastActive}</td>
                  <td className="px-4 py-3"><Pill className={statusPill[u.status]}>{u.status}</Pill></td>
                  <td className="px-4 py-3 text-center">
                    <RowActions user={u} onChange={(s) => setUserStatus(u.id, s)} onRemove={() => removeUser(u.id)} />
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">No users match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100">
          <Pagination
            page={current}
            pageCount={pageCount}
            onChange={setPage}
            summary={filtered.length ? `Showing ${start + 1}-${start + visible.length} of ${filtered.length} Users` : "Showing 0 Users"}
          />
        </div>
      </Panel>
    </div>
  );
}
