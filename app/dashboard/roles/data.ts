// Mock data for the roles & permissions pages. Swap for API calls (react-query) later.

export type BadgeTone = "blue" | "pink" | "purple" | "gray";

export type AdminRole = {
  id: string;
  name: string;
  description: string;
  responsibilities: string;
  department: string;
  created: string; // YYYY-MM-DD
  tone: BadgeTone;
  holder: { id: string; name: string; email: string };
};

export const DEPARTMENTS = [
  "Administration",
  "Engineering",
  "Product & Design",
  "Customer Support",
  "Business Ops",
  "Security",
  "Risk & Compliance",
  "Legal",
  "IT Operations",
  "Finance",
];

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const seed: [string, BadgeTone, string, string, string, string, string][] = [
  ["Chief Technology Officer", "blue", "usr_1", "Sarah Chen", "sarah.chen@meridian.com", "Administration", "Owns the technical direction of the platform with full access to infrastructure, detection and integration settings."],
  ["Super Admin", "pink", "usr_2", "Marcus Thompson", "m.thompson@zenith.bank", "Engineering", "Full administrative access to all system modules, billing, and user management settings. This role is intended for system owners and lead security officers."],
  ["Org Admin", "purple", "usr_3", "Priya Patel", "priya@nexusinsurance.com", "Product & Design", "Manages organisations, their users and day-to-day configuration without access to platform-wide billing or feature flags."],
  ["Content Creator", "blue", "usr_4", "James Sullivan", "james@fortresscm.com", "Customer Support", "Creates and maintains notification templates and customer-facing content."],
  ["Billing Admin", "gray", "usr_5", "Elena Vasquez", "evasquez@globalpay.io", "Business Ops", "Manages subscriptions, invoices and payment settings for all organisations."],
  ["Security Administrator", "blue", "usr_6", "David Kim", "d.kim@pacific.cu", "Security", "Oversees detection rules, audit logs and access reviews across the platform."],
  ["Analyst", "gray", "usr_7", "Rachel Nguyen", "rachel@aurorafintech.ca", "Risk & Compliance", "Investigates fraud alerts and exports reports. Read-only access to configuration."],
  ["Viewer", "gray", "usr_8", "William Park", "wpark@horizonsec.co.uk", "Legal", "Read-only access to dashboards and reports."],
  ["Compliance Officer", "purple", "usr_9", "Amara Okafor", "amara@lagoonbank.ng", "Legal", "Reviews audit trails and exports evidence for regulatory reporting."],
  ["Support Lead", "blue", "usr_10", "Tom Becker", "t.becker@vertexlending.com", "Customer Support", "Assists organisations with account issues and can view users and system health."],
];

export const initialRoles: AdminRole[] = seed.map(
  ([name, tone, id, holderName, email, department, description], i) => ({
    id: slugify(name),
    name,
    tone,
    department,
    description,
    responsibilities:
      name === "Super Admin"
        ? "The Super Admin role represents the highest tier of authority within the AxiomVault environment. Users assigned to this role are granted unrestricted access to the entire infrastructure."
        : `Users assigned to the ${name} role are responsible for the ${department.toLowerCase()} function within AxiomVault and are granted only the access listed in the permission matrix.`,
    created: `2024-06-${String(i + 1).padStart(2, "0")}`,
    holder: { id, name: holderName, email },
  }),
);

/* ---------- Permission matrix ---------- */

export const NO_ACCESS = "No Access";

export const RESOURCES: { key: string; label: string; actions: string[] }[] = [
  { key: "dashboard", label: "Dashboard", actions: ["View", "Manage"] },
  { key: "organisations", label: "Organisations", actions: ["View", "Edit", "Suspend / Delete"] },
  { key: "users", label: "Users", actions: ["View", "Edit", "Delete"] },
  { key: "billing", label: "Billing", actions: ["View", "Manage"] },
  { key: "audit-logs", label: "Audit Logs", actions: ["View", "Export"] },
  { key: "system-health", label: "System Health", actions: ["View", "Manage"] },
  { key: "feature-flags", label: "Feature Flags", actions: ["View", "Manage"] },
  { key: "detection-config", label: "Detection Config", actions: ["View", "Edit"] },
  { key: "notifications", label: "Notifications", actions: ["View", "Edit"] },
];

// resource key -> granted actions (empty = No Access)
export type PermissionSet = Record<string, string[]>;

const full = (): PermissionSet =>
  Object.fromEntries(RESOURCES.map((r) => [r.key, [...r.actions]]));
const viewOnly = (): PermissionSet =>
  Object.fromEntries(RESOURCES.map((r) => [r.key, ["View"]]));

const extras: Record<string, PermissionSet> = {
  "org-admin": { organisations: ["View", "Edit"], users: ["View", "Edit"], "feature-flags": [] },
  "content-creator": { notifications: ["View", "Edit"], billing: [], "feature-flags": [] },
  "billing-admin": { billing: ["View", "Manage"], "detection-config": [], "feature-flags": [] },
  "security-administrator": { "detection-config": ["View", "Edit"], "audit-logs": ["View", "Export"], users: ["View", "Edit"] },
  analyst: { "audit-logs": ["View", "Export"], billing: [], "feature-flags": [] },
  viewer: { billing: [], "feature-flags": [], "detection-config": [] },
  "compliance-officer": { "audit-logs": ["View", "Export"], "feature-flags": [] },
  "support-lead": { users: ["View", "Edit"], billing: [] },
};

export const defaultPermissions = (roleId: string): PermissionSet =>
  roleId === "super-admin" || roleId === "chief-technology-officer"
    ? full()
    : { ...viewOnly(), ...extras[roleId] };

/* ---------- Create role form & drafts ---------- */

export type RoleForm = {
  roleName: string;
  department: string;
  description: string;
  customRole: boolean;
  fullName: string;
  email: string;
  jobTitle: string;
  username: string;
  password: string;
  sendCredentials: boolean;
  forcePasswordChange: boolean;
};

export const emptyForm: RoleForm = {
  roleName: "",
  department: "",
  description: "",
  customRole: true,
  fullName: "",
  email: "",
  jobTitle: "",
  username: "",
  password: "",
  sendCredentials: true,
  forcePasswordChange: true,
};

export type DraftStatus = "Draft" | "Pending Review";
export type DraftType = "Administrator" | "Role";

export type Draft = {
  id: string; // e.g. DRAFT-9821
  form: RoleForm;
  editedBy: string;
  editedAt: string; // ISO
  createdAt: string; // ISO
  status: DraftStatus;
};

export const draftType = (d: Draft): DraftType =>
  d.form.fullName.trim() ? "Administrator" : "Role";

export const draftName = (form: RoleForm) =>
  form.roleName.trim() || form.fullName.trim() || "Untitled draft";

const draft = (
  id: number,
  edited: string,
  editedBy: string,
  status: DraftStatus,
  form: Partial<RoleForm>,
): Draft => ({
  id: `DRAFT-${id}`,
  form: { ...emptyForm, ...form },
  editedBy,
  editedAt: edited,
  createdAt: edited,
  status,
});

export const initialDrafts: Draft[] = [
  draft(9821, "2026-07-20T10:42:00", "James Okafor", "Draft", {
    roleName: "Security Administrator", jobTitle: "Security Lead", fullName: "Sarah Johnson",
    email: "s.johnson@axiomvault.io", username: "sarah.johnson", department: "Security",
  }),
  draft(9822, "2026-07-20T09:15:00", "Elena Rodriguez", "Draft", {
    roleName: "Compliance Officer", jobTitle: "Risk Auditor", department: "Legal",
  }),
  draft(9823, "2026-07-19T16:30:00", "James Okafor", "Draft", {
    roleName: "Cloud Architect", jobTitle: "Systems Admin", fullName: "Marcus Chen",
    email: "m.chen@axiomvault.io", username: "marcus.chen", department: "IT Operations",
  }),
  draft(9824, "2026-07-18T14:05:00", "Elena Rodriguez", "Pending Review", {
    roleName: "Fraud Ops Manager", jobTitle: "Operations Manager", fullName: "Ada Ozoani",
    email: "ada@axiomvault.io", username: "ada.ozoani1", department: "Risk & Compliance",
  }),
  draft(9825, "2026-07-17T11:20:00", "James Okafor", "Pending Review", {
    roleName: "Finance Controller", jobTitle: "Controller", department: "Finance",
  }),
];

/* ---------- Usernames ---------- */

// Usernames already taken on the platform
export const TAKEN_USERNAMES = new Set([
  "admin",
  "ada.ozoani",
  "ada.nwosu",
  "sarah.chen",
  "marcus.thompson",
  "priya.patel",
  "james.sullivan",
]);

export const USERNAME_PATTERN = /^[a-z0-9]+([._][a-z0-9]+)*$/;

export const baseUsername = (fullName: string) =>
  fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .join(".");

export function usernameSuggestions(fullName: string, department: string, taken: Set<string>) {
  const parts = baseUsername(fullName).split(".").filter(Boolean);
  if (!parts.length) return [];
  const first = parts[0];
  const last = parts[parts.length - 1];
  const base = parts.length > 1 ? `${first}.${last}` : first;
  const dept = department.toLowerCase().replace(/[^a-z]/g, "").slice(0, 3) || "adm";
  const candidates = [`${base}1`, `${base}${dept}`, parts.length > 1 ? `${first[0]}.${last}` : `${first}.${dept}`, `${base}2`, `${base}.${dept}`];
  return [...new Set(candidates)].filter((c) => !taken.has(c)).slice(0, 3);
}

/* ---------- Temporary passwords ---------- */

const SETS = {
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lower: "abcdefghijkmnopqrstuvwxyz",
  digits: "23456789",
  special: "!@#$%&*?",
};

const randomIndex = (n: number) => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % n;
};

export function generatePassword(length = 12) {
  const all = Object.values(SETS).join("");
  // One from each set guarantees every criterion is met
  const chars = Object.values(SETS).map((s) => s[randomIndex(s.length)]);
  while (chars.length < length) chars.push(all[randomIndex(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export const passwordChecks = (pw: string) => [
  { label: "12+ characters", ok: pw.length >= 12 },
  { label: "Uppercase letters", ok: /[A-Z]/.test(pw) },
  { label: "Lowercase letters", ok: /[a-z]/.test(pw) },
  { label: "Numbers", ok: /\d/.test(pw) },
  { label: "Special characters", ok: /[^A-Za-z0-9]/.test(pw) },
];

export const STRENGTH_LABELS = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
