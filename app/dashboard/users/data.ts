// Mock data for the users page. Swap for API calls (react-query) later.

export type Role = "Super Admin" | "Org Admin" | "Analyst" | "Viewer";
export type UserStatus = "Active" | "Inactive" | "Suspended";

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  organisation: string;
  status: UserStatus;
  mfa: boolean;
  lastActive: string;
};

export const ROLES: Role[] = ["Super Admin", "Org Admin", "Analyst", "Viewer"];

const rows: [string, string, Role, string, UserStatus, boolean, string][] = [
  ["Sarah Chen", "sarah.chen@meridian.com", "Org Admin", "Meridian Financial Group", "Active", true, "2 minutes ago"],
  ["Marcus Thompson", "m.thompson@zenith.bank", "Analyst", "Zenith Banking Corp", "Active", true, "15 minutes ago"],
  ["Priya Patel", "priya@nexusinsurance.com", "Super Admin", "Nexus Insurance Holdings", "Active", true, "1 hour ago"],
  ["James Sullivan", "james@fortresscm.com", "Org Admin", "Nexus Insurance Holdings", "Active", false, "3 hours ago"],
  ["Elena Vasquez", "evasquez@globalpay.io", "Viewer", "Fortress Capital Markets", "Inactive", false, "12 days ago"],
  ["David Kim", "d.kim@pacific.cu", "Analyst", "Global Payments Inc", "Active", true, "5 hours ago"],
  ["Rachel Nguyen", "rachel@aurorafintech.ca", "Org Admin", "Pacific Credit Union", "Active", true, "1 day ago"],
  ["William Park", "wpark@horizonsec.co.uk", "Analyst", "Aurora Fintech Ltd", "Suspended", false, "3 weeks ago"],
  ["Amara Okafor", "amara@lagoonbank.ng", "Org Admin", "Lagoon Bank", "Active", true, "10 minutes ago"],
  ["Tom Becker", "t.becker@vertexlending.com", "Analyst", "Vertex Lending Solutions", "Active", true, "30 minutes ago"],
  ["Hannah Li", "hannah.li@orionmf.com", "Viewer", "Orion Microfinance", "Active", false, "2 days ago"],
  ["Carlos Mendes", "cmendes@redwoodsec.com", "Analyst", "Redwood Securities", "Suspended", false, "1 month ago"],
  ["Fatima Bello", "f.bello@sahelcredit.com", "Org Admin", "Sahel Microcredit", "Active", true, "4 hours ago"],
  ["Noah Fischer", "noah@kestrelpay.com", "Viewer", "Kestrel Pay", "Inactive", false, "9 days ago"],
  ["Grace Adeyemi", "grace@axiomvault.io", "Super Admin", "AxiomVault", "Active", true, "Just now"],
  ["Liam O'Brien", "liam@pinnaclewm.com", "Analyst", "Pinnacle Wealth Management", "Active", true, "6 hours ago"],
  ["Sofia Rossi", "s.rossi@cobaltx.com", "Viewer", "Cobalt Exchange", "Active", false, "1 day ago"],
  ["Ethan Brooks", "ethan@summitcu.org", "Org Admin", "Summit Credit Union", "Suspended", true, "2 weeks ago"],
  ["Mei Tanaka", "mei@lumenwallet.app", "Analyst", "Lumen Wallet", "Active", true, "20 minutes ago"],
  ["Daniel Osei", "d.osei@granite.co", "Viewer", "Granite Holdings", "Inactive", false, "1 month ago"],
  ["Isabel Cruz", "isabel@nimbusremit.com", "Analyst", "Nimbus Remit", "Active", true, "2 hours ago"],
  ["Oliver Grant", "o.grant@helixins.com", "Org Admin", "Helix Insurance", "Active", true, "45 minutes ago"],
  ["Zara Ahmed", "zara@quantumledger.io", "Viewer", "Quantum Ledger", "Active", false, "3 days ago"],
  ["Lucas Meyer", "lucas@harborlf.com", "Analyst", "Harbor Logistics Finance", "Active", true, "8 hours ago"],
];

export const users: PlatformUser[] = rows.map(
  ([name, email, role, organisation, status, mfa, lastActive], i) => ({
    id: `usr_${i + 1}`,
    name,
    email,
    role,
    organisation,
    status,
    mfa,
    lastActive,
  }),
);

export const userStats = { total: 1284, organisations: 284 };

// Permissions granted per role
const PERMISSIONS = [
  { label: "View fraud alerts", roles: ["Super Admin", "Org Admin", "Analyst", "Viewer"] },
  { label: "Manage detection rules", roles: ["Super Admin", "Org Admin", "Analyst"] },
  { label: "Export reports", roles: ["Super Admin", "Org Admin", "Analyst"] },
  { label: "Manage users", roles: ["Super Admin"] },
] satisfies { label: string; roles: Role[] }[];

export const permissionsFor = (role: Role) =>
  PERMISSIONS.map((p) => ({ label: p.label, granted: p.roles.includes(role) }));

export const recentActivity = [
  { event: "user.login", time: "2m ago" },
  { event: "alert.viewed", time: "14m ago" },
  { event: "report.exported", time: "2h ago" },
];

export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Stable avatar colour per user
const AVATAR_COLORS = ["bg-red-500", "bg-blue-700", "bg-fuchsia-500", "bg-green-500", "bg-purple-600"];
export const avatarColor = (id: string) =>
  AVATAR_COLORS[Number(id.replace(/\D/g, "")) % AVATAR_COLORS.length];
