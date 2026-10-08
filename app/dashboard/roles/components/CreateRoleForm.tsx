"use client";

import { useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Info, Pencil, UserPlus } from "lucide-react";
import { DEPARTMENTS, TAKEN_USERNAMES, baseUsername, emptyForm, slugify, type RoleForm } from "../data";
import { useRoles } from "../RolesProvider";
import EditUsernameModal from "./modals/EditUsernameModal";
import GeneratePasswordModal, { type PasswordOptions } from "./modals/GeneratePasswordModal";
import SuccessModal from "./modals/SuccessModal";
import { Breadcrumbs, btnOutline, btnPrimary, inputClass } from "./ui";

type Errors = Partial<Record<keyof RoleForm, string>>;
type Notice = "draft" | "delivered" | "created" | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({
  label,
  htmlFor,
  error,
  className = "",
  labelClass = "text-sm text-slate-700",
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  labelClass?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={`mb-1.5 block ${labelClass}`}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white px-4 py-6 sm:px-5">
      <h2 className="mb-5 flex items-center gap-2 text-base font-medium text-slate-900">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CreateRoleForm() {
  const { drafts } = useRoles();
  const draftId = useSearchParams().get("draft");
  const draft = drafts.find((d) => d.id === draftId);
  // Keyed by the URL (not the draft's existence) so deleting the draft after
  // creating the role doesn't remount the form mid-success-modal
  return <Form key={draftId ?? "new"} draftId={draft?.id} initial={draft?.form ?? emptyForm} />;
}

function Form({ draftId: initialDraftId, initial }: { draftId?: string; initial: RoleForm }) {
  const router = useRouter();
  const { roles, createRole, saveDraft, deleteDrafts } = useRoles();
  const [form, setForm] = useState<RoleForm>(initial);
  const [draftId, setDraftId] = useState(initialDraftId);
  const [usernameEdited, setUsernameEdited] = useState(!!initial.username);
  const [errors, setErrors] = useState<Errors>({});
  const [modal, setModal] = useState<"username" | "password" | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const set = <K extends keyof RoleForm>(key: K, value: RoleForm[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Keep the username in step with the name until it's edited by hand
      if (key === "fullName" && !usernameEdited) next.username = baseUsername(String(value));
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (!form.roleName.trim()) e.roleName = "Role name is required.";
    else if (roles.some((r) => r.id === slugify(form.roleName))) e.roleName = "A role with this name already exists.";
    if (!form.department) e.department = "Select a department.";
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!EMAIL.test(form.email.trim())) e.email = "Enter a valid work email address.";
    if (!form.jobTitle.trim()) e.jobTitle = "Job title is required.";
    if (!form.username) e.username = "Username is required.";
    else if (TAKEN_USERNAMES.has(form.username)) e.username = "This username is already taken. Edit it to continue.";
    if (!form.password) e.password = "Generate a temporary password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const create = () => {
    if (!validate()) return;
    createRole(form);
    if (draftId) deleteDrafts([draftId]);
    setNotice("created");
  };

  const save = () => {
    setDraftId(saveDraft(form, draftId).id);
    setNotice("draft");
  };

  const applyPassword = (password: string, opts: PasswordOptions) => {
    setForm((f) => ({
      ...f,
      password,
      sendCredentials: opts.sendCredentials,
      forcePasswordChange: opts.forcePasswordChange,
    }));
    setErrors((e) => ({ ...e, password: undefined }));
    setModal(null);
    if (opts.sendCredentials) setNotice("delivered");
  };

  const closeNotice = () => {
    // A created role is done: start a fresh form
    if (notice === "created") {
      setForm(emptyForm);
      setDraftId(undefined);
      setUsernameEdited(false);
      router.replace("/dashboard/roles/create");
    }
    setNotice(null);
  };

  const invalid = (key: keyof RoleForm) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Roles & Permissions", href: "/dashboard/roles" },
          { label: "Admin Roles", href: "/dashboard/roles" },
          { label: draftId ? "Edit Draft" : "Create Role" },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Create Admin Role</h1>
          <p className="mt-1 text-sm text-slate-600">
            Define a new administrator role and configure its platform access.
          </p>
          {draftId && <p className="mt-1 text-xs font-medium text-orange-600">Editing #{draftId}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => router.push("/dashboard/roles")} className={btnOutline}>
            Cancel
          </button>
          <button type="button" onClick={save} className={btnOutline}>
            Save Draft
          </button>
          <button type="button" onClick={create} className={btnPrimary}>
            Create Role
          </button>
        </div>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          create();
        }}
        className="space-y-8"
      >
        <Card title="Role Information" icon={<Info className="size-4.5 text-[#0b2b5d]" aria-hidden="true" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role Name" htmlFor="roleName" error={errors.roleName}>
              <input
                id="roleName"
                value={form.roleName}
                onChange={(e) => set("roleName", e.target.value)}
                className={inputClass}
                {...invalid("roleName")}
              />
            </Field>
            <Field label="Department" htmlFor="department" error={errors.department}>
              <select
                id="department"
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
                className={`${inputClass} border-slate-500`}
                {...invalid("department")}
              >
                <option value="">Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Description"
              htmlFor="description"
              className="sm:col-span-2"
              labelClass="font-mono text-xs uppercase tracking-wider text-slate-700"
            >
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the responsibilities and scope of this role..."
                className={`${inputClass} h-auto resize-y py-2.5`}
              />
            </Field>
          </div>
          <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.customRole}
              onChange={(e) => set("customRole", e.target.checked)}
              className="peer sr-only"
            />
            <span className="flex size-4 items-center justify-center rounded-full border-2 border-blue-700 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-300">
              {form.customRole && <span className="size-2 rounded-full bg-blue-700" />}
            </span>
            Custom Role
          </label>
        </Card>

        <Card title="Administrator Information" icon={<UserPlus className="size-4.5 text-[#0b2b5d]" aria-hidden="true" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" htmlFor="fullName" error={errors.fullName} labelClass="text-xs text-slate-700">
              <input
                id="fullName"
                autoComplete="off"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                className={inputClass}
                {...invalid("fullName")}
              />
            </Field>
            <Field label="Work Email Address" htmlFor="email" error={errors.email} labelClass="text-xs text-slate-700">
              <input
                id="email"
                type="email"
                autoComplete="off"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputClass}
                {...invalid("email")}
              />
            </Field>
            <Field label="Job Title" htmlFor="jobTitle" error={errors.jobTitle} labelClass="text-xs text-slate-700">
              <input
                id="jobTitle"
                value={form.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                className={inputClass}
                {...invalid("jobTitle")}
              />
            </Field>
            <Field label="Username" htmlFor="username" error={errors.username} labelClass="text-xs text-slate-700">
              <div className="relative">
                <input id="username" readOnly value={form.username} className={`${inputClass} pr-10`} {...invalid("username")} />
                <button
                  type="button"
                  onClick={() => setModal("username")}
                  aria-label="Edit username"
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-blue-700 hover:text-blue-900"
                >
                  <Pencil className="size-3.5" />
                </button>
              </div>
            </Field>
            <Field
              label="Temporary Password"
              htmlFor="password"
              error={errors.password}
              className="sm:col-span-2"
              labelClass="text-xs text-slate-700"
            >
              <div className="flex gap-2">
                <input
                  id="password"
                  type="password"
                  readOnly
                  value={form.password}
                  className={`${inputClass} font-mono`}
                  {...invalid("password")}
                />
                <button
                  type="button"
                  onClick={() => setModal("password")}
                  className={`${btnOutline} shrink-0 border-slate-900 text-slate-900`}
                >
                  {form.password ? "Regenerate" : "Generate"}
                </button>
              </div>
            </Field>
          </div>

          <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
            {(
              [
                ["sendCredentials", "Send login credentials via email", "Automated welcome email with secure temporary link."],
                ["forcePasswordChange", "Force password change", "Require user to update credentials on their first login."],
              ] as const
            ).map(([key, title, hint]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-200 px-3 py-3"
              >
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{title}</span>
                  <span className="block text-xs text-slate-600">{hint}</span>
                </span>
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  className="size-4.5 shrink-0 accent-blue-700"
                />
              </label>
            ))}
            <p className="flex items-start gap-2 rounded-md bg-indigo-100 px-4 py-3 text-xs text-blue-800">
              <Info className="mt-px size-4 shrink-0" aria-hidden="true" />
              Login credentials and a setup guide will be automatically dispatched to the provided email address upon
              account activation.
            </p>
          </div>
        </Card>
      </form>

      <EditUsernameModal
        open={modal === "username"}
        onClose={() => setModal(null)}
        onSave={(username) => {
          set("username", username);
          setUsernameEdited(true);
          setModal(null);
        }}
        initial={form.username}
        fullName={form.fullName}
        department={form.department}
        jobTitle={form.jobTitle}
      />

      <GeneratePasswordModal
        open={modal === "password"}
        onClose={() => setModal(null)}
        onUse={applyPassword}
        initialOptions={{
          sendCredentials: form.sendCredentials,
          forcePasswordChange: form.forcePasswordChange,
          requireMfa: true,
          expires24h: true,
        }}
      />

      <SuccessModal
        open={notice !== null}
        onClose={closeNotice}
        message={
          notice === "created"
            ? "Role successfully Created"
            : notice === "delivered"
              ? "Password successfully delivered"
              : "Draft successfully saved"
        }
        action={notice === "created" ? { label: "View Roles", onClick: () => router.push("/dashboard/roles") } : undefined}
      />
    </div>
  );
}
