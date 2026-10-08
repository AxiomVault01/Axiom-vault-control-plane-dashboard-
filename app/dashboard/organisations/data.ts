// Mock data for the organisations pages. Swap for API calls (react-query) later.

export type OrgStatus = "Active" | "Suspended" | "Trial";
export type Billing = "Paid" | "Overdue" | "Trial";
export type Plan = "Starter" | "Enterprise" | "Trial";

export type Organisation = {
  id: string;
  name: string;
  plan: Plan;
  users: number;
  billing: Billing;
  lastActive: string;
  status: OrgStatus;
};

const rows: [string, Plan, number, Billing, string, OrgStatus][] = [
  ["Acme Retail Group", "Starter", 2, "Paid", "2 hrs ago", "Active"],
  ["Cyber Dyne Systems", "Enterprise", 5, "Overdue", "2 days ago", "Suspended"],
  ["Starlight", "Trial", 3, "Trial", "2 hrs ago", "Trial"],
  ["Agris Data Solution", "Enterprise", 5, "Paid", "4 hrs ago", "Active"],
  ["Meridian Capital", "Enterprise", 12, "Paid", "1 day ago", "Active"],
  ["Northwind Payments", "Enterprise", 8, "Overdue", "5 days ago", "Suspended"],
  ["Bluepeak Labs", "Trial", 2, "Trial", "1 day ago", "Trial"],
  ["Orion Microfinance", "Starter", 4, "Paid", "2 hrs ago", "Active"],
  ["Pinnacle Wealth Management", "Enterprise", 9, "Overdue", "3 days ago", "Suspended"],
  ["Aurora Fintech Ltd", "Trial", 3, "Trial", "6 hrs ago", "Trial"],
  ["Vertex Lending Solutions", "Enterprise", 15, "Paid", "30 mins ago", "Active"],
  ["Helix Insurance", "Starter", 3, "Overdue", "1 week ago", "Suspended"],
  ["Quantum Ledger", "Trial", 1, "Trial", "3 hrs ago", "Trial"],
  ["Sahel Microcredit", "Starter", 2, "Paid", "5 hrs ago", "Active"],
  ["Redwood Securities", "Enterprise", 7, "Overdue", "4 days ago", "Suspended"],
  ["Kestrel Pay", "Trial", 2, "Trial", "1 day ago", "Trial"],
  ["Lagoon Bank", "Enterprise", 20, "Paid", "10 mins ago", "Active"],
  ["Ironclad Trust", "Starter", 3, "Overdue", "2 weeks ago", "Suspended"],
  ["Nimbus Remit", "Trial", 2, "Trial", "2 days ago", "Trial"],
  ["Summit Credit Union", "Enterprise", 6, "Overdue", "6 days ago", "Suspended"],
  ["Cobalt Exchange", "Trial", 4, "Trial", "8 hrs ago", "Trial"],
  ["Granite Holdings", "Starter", 2, "Overdue", "3 weeks ago", "Suspended"],
  ["Lumen Wallet", "Trial", 1, "Trial", "12 hrs ago", "Trial"],
  ["Harbor Logistics Finance", "Starter", 2, "Paid", "1 day ago", "Active"],
];

const slug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const organisations: Organisation[] = rows.map(
  ([name, plan, users, billing, lastActive, status]) => ({
    id: slug(name),
    name,
    plan,
    users,
    billing,
    lastActive,
    status,
  }),
);

export const orgStats = {
  total: organisations.length,
  active: organisations.filter((o) => o.status === "Active").length,
  suspended: organisations.filter((o) => o.status === "Suspended").length,
  trial: organisations.filter((o) => o.status === "Trial").length,
};

export const getOrganisation = (id: string) =>
  organisations.find((o) => o.id === id);

/* ---------- Organisation details (same mock profile for every org) ---------- */

export const orgProfile = {
  orgId: "AX-8821-ACME-001",
  industry: "Aerospace & Defense",
  headquarters: "Palo Alto, CA",
  deployment: "Multi-Cloud Hybrid",
  nodesUsed: 18,
  nodesTotal: 25,
  nextRenewal: "Oct 12, 2025",
  billingContact: "fin-ops@acme.com",
  uptime: "99.98%",
  latency: "42ms",
  latencyBars: [40, 55, 35, 60, 45, 75, 50, 40, 65, 55, 45, 60],
  totalUsers: 5,
  usersTrend: "+12%",
  activeAlerts: 8,
  criticalAlerts: 1,
  alertsProcessed: 2,
  storageUsed: "14.2 TB",
  storagePercent: 82,
};

// Data ingestion volume in millions of events
export const ingestionDays = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 30];
export const ingestionSeries = [
  { key: "auth", label: "Auth Logs", color: "#2563eb", values: [20, 30, 35, 27, 25, 32, 55, 68, 55, 30, 15, 28, 60, 88, 85, 40] },
  { key: "audit", label: "Audit Logs", color: "#334155", values: [30, 35, 36, 34, 33, 38, 55, 64, 55, 35, 24, 30, 52, 65, 68, 38] },
  { key: "system", label: "System Metrics", color: "#94a3b8", values: [16, 17, 18, 17, 19, 22, 25, 27, 25, 22, 16, 18, 23, 27, 25, 20], dashed: true },
];

export const alertBreakdown = [
  { label: "Critical", count: 1, bar: "bg-red-700", text: "text-red-700" },
  { label: "High", count: 4, bar: "bg-orange-500", text: "text-orange-600" },
  { label: "Medium", count: 2, bar: "bg-yellow-400", text: "text-yellow-600" },
  { label: "Low", count: 1, bar: "bg-emerald-500", text: "text-emerald-600" },
];

export const resources = [
  { label: "Compute Cluster", value: "72%", percent: 72 },
  { label: "Network Throughput", value: "45%", percent: 45 },
  { label: "API Gateway Latency", value: "18ms", percent: 30 },
];

export type OrgUserStatus = "Active" | "Invited" | "Suspended";
export type OrgUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: OrgUserStatus;
};

export const orgUsers: OrgUser[] = [
  { id: "u1", name: "Elena Vance", email: "e.vance@acme.com", role: "Org Admin", lastActive: "2 mins ago", status: "Active" },
  { id: "u2", name: "Marcus Chen", email: "m.chen@acme.com", role: "Developer", lastActive: "1 hour ago", status: "Active" },
  { id: "u3", name: "Sarah Jenkins", email: "s.jenkins@acme.com", role: "Billing Owner", lastActive: "Oct 24, 2023", status: "Active" },
  { id: "u4", name: "David K.", email: "d.k@acme.com", role: "Developer", lastActive: "Never", status: "Invited" },
  { id: "u5", name: "Priya Nair", email: "p.nair@acme.com", role: "Analyst", lastActive: "Never", status: "Invited" },
];

export type LogStatus = "Success" | "Warning" | "Failed";
export type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: LogStatus;
  hash: string;
};

export const auditLogs: AuditLog[] = [
  { id: "l1", timestamp: "2023-10-31 14:22:01", user: "Elena Vance", action: "API Key Rotation", resource: "key-prod-009", ip: "192.168.1.42", status: "Success", hash: "a8f2...9b11" },
  { id: "l2", timestamp: "2023-10-31 12:45:12", user: "Marcus Chen", action: "Config Rollback", resource: "infra-cfg-v2.1", ip: "172.16.0.84", status: "Warning", hash: "e43c...10d4" },
  { id: "l3", timestamp: "2023-10-31 11:30:05", user: "System Agent", action: "Failed Login", resource: "auth-gateway", ip: "203.0.113.11", status: "Failed", hash: "991a...ff01" },
  { id: "l4", timestamp: "2023-10-30 18:02:44", user: "Sarah Jenkins", action: "Invoice Downloaded", resource: "inv-2023-10", ip: "192.168.1.17", status: "Success", hash: "5c7e...a2b0" },
  { id: "l5", timestamp: "2023-10-30 09:15:33", user: "Elena Vance", action: "User Invited", resource: "d.k@acme.com", ip: "192.168.1.42", status: "Success", hash: "0d9f...43ce" },
  { id: "l6", timestamp: "2023-10-29 22:41:09", user: "System Agent", action: "Rate Limit Hit", resource: "ingest-api", ip: "198.51.100.7", status: "Warning", hash: "b61a...7e2d" },
];

export type Integration = {
  id: string;
  name: string;
  description: string;
  icon: "cloud" | "database" | "webhook";
  connected: boolean;
};

export const integrations: Integration[] = [
  { id: "aws", name: "AWS CloudTrail", description: "Syncing logs from us-east-1 and us-west-2", icon: "cloud", connected: true },
  { id: "gcp", name: "Google Cloud Operations Suite", description: "Project-level audit log ingestion active", icon: "database", connected: true },
  { id: "datadog", name: "Datadog Log Stream", description: "Forward system alert events to an external webhook destination", icon: "webhook", connected: false },
];

export type ApiKey = {
  id: string;
  name: string;
  token: string;
  createdBy: string;
  created: string;
  lastUsed: string;
  revoked: boolean;
};

export const apiKeys: ApiKey[] = [
  { id: "k1", name: "Prod-Ingestion-Token-009", token: "ax_live_4f8c2a91d7e3b6059b11", createdBy: "Elena Vance (Admin)", created: "Jan 12, 2024", lastUsed: "1 min ago", revoked: false },
  { id: "k2", name: "Staging-Testing-Key", token: "ax_test_9a1d5e7c3b2f8a6410d4", createdBy: "Marcus Chen (Dev)", created: "Mar 05, 2024", lastUsed: "2 hours ago", revoked: false },
  { id: "k3", name: "Legacy-SIEM-Exporter", token: "ax_live_2b7e9c4a1f6d3e8a5f01", createdBy: "System Agent", created: "Oct 15, 2023", lastUsed: "Never", revoked: true },
];

export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
