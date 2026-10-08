"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { currentUser } from "../data";
import {
  defaultPermissions,
  initialDrafts,
  initialRoles,
  slugify,
  type AdminRole,
  type Draft,
  type PermissionSet,
  type RoleForm,
} from "./data";

// Client-side store shared by every roles page so changes survive tab navigation.
// Replace with react-query mutations once the API exists.

type RolesStore = {
  roles: AdminRole[];
  drafts: Draft[];
  getRole: (id: string | null) => AdminRole;
  getPermissions: (roleId: string) => PermissionSet;
  applyPermissions: (roleId: string, perms: PermissionSet) => void;
  createRole: (form: RoleForm) => AdminRole;
  saveDraft: (form: RoleForm, draftId?: string) => Draft;
  deleteDrafts: (ids: string[]) => void;
};

const RolesContext = createContext<RolesStore | null>(null);

export function RolesProvider({ children }: { children: ReactNode }) {
  const [roles, setRoles] = useState(initialRoles);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [permissions, setPermissions] = useState<Record<string, PermissionSet>>({});

  const getRole = (id: string | null) =>
    roles.find((r) => r.id === id) ?? roles.find((r) => r.id === "super-admin") ?? roles[0];

  const getPermissions = (roleId: string) => permissions[roleId] ?? defaultPermissions(roleId);

  const applyPermissions = (roleId: string, perms: PermissionSet) =>
    setPermissions((p) => ({ ...p, [roleId]: perms }));

  const createRole = (form: RoleForm) => {
    const role: AdminRole = {
      id: slugify(form.roleName),
      name: form.roleName.trim(),
      description: form.description.trim() || `${form.roleName.trim()} role.`,
      responsibilities:
        form.description.trim() ||
        `Users assigned to the ${form.roleName.trim()} role are granted only the access listed in the permission matrix.`,
      department: form.department,
      created: new Date().toISOString().slice(0, 10),
      tone: form.customRole ? "blue" : "gray",
      holder: { id: `usr_${Date.now()}`, name: form.fullName.trim(), email: form.email.trim() },
    };
    setRoles((r) => [role, ...r]);
    return role;
  };

  const saveDraft = (form: RoleForm, draftId?: string) => {
    const now = new Date().toISOString();
    const existing = drafts.find((d) => d.id === draftId);
    const draft: Draft = existing
      ? { ...existing, form, editedAt: now, editedBy: currentUser.name }
      : {
          id: `DRAFT-${Math.max(9820, ...drafts.map((d) => Number(d.id.slice(6)))) + 1}`,
          form,
          editedAt: now,
          createdAt: now,
          editedBy: currentUser.name,
          status: "Draft",
        };
    setDrafts((list) => (existing ? list.map((d) => (d.id === draft.id ? draft : d)) : [draft, ...list]));
    return draft;
  };

  const deleteDrafts = (ids: string[]) => setDrafts((list) => list.filter((d) => !ids.includes(d.id)));

  return (
    <RolesContext.Provider
      value={{ roles, drafts, getRole, getPermissions, applyPermissions, createRole, saveDraft, deleteDrafts }}
    >
      {children}
    </RolesContext.Provider>
  );
}

export function useRoles() {
  const ctx = useContext(RolesContext);
  if (!ctx) throw new Error("useRoles must be used inside <RolesProvider>");
  return ctx;
}
