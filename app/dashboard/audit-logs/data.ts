// Mock platform audit trail until the API is wired up

export type Severity = "info" | "warning" | "critical";

export interface AuditEvent {
  id: string;
  timestamp: string; // "YYYY-MM-DD HH:mm:ss", UTC
  severity: Severity;
  event: string;
  user: string;
  organisation: string;
  orgId: string;
  ip: string;
  details: string;
}

// Mock "now" so the time-range filters line up with the sample data
export const NOW = new Date("2024-06-17T14:35:00Z");

export const TIME_RANGES = [
  { label: "Last 24 hours", hours: 24 },
  { label: "Last 7 days", hours: 24 * 7 },
  { label: "Last 30 days", hours: 24 * 30 },
  { label: "All time", hours: Infinity },
] as const;

const rows: [string, Severity, string, string, string, string, string][] = [
  ["2024-06-17 14:32:18", "info", "user.login", "sarah.chen@meridian.com", "Meridian Financial Group", "192.168.1.45", "Successful login via SSO (Okta)"],
  ["2024-06-17 14:28:44", "critical", "fraud.alert.triggered", "System", "Nexus Insurance Holdings", "10.0.4.12", "High-risk claim pattern detected on policy NX-88213 (score 0.94)"],
  ["2024-06-17 14:21:09", "warning", "org.settings.updated", "priya@nexusinsurance.com", "Nexus Insurance Holdings", "185.22.14.7", "Session timeout changed from 30 to 120 minutes"],
  ["2024-06-17 14:15:33", "info", "user.created", "admin@axiomvault.io", "Meridian Financial Group", "10.0.0.8", "New analyst account created for d.okafor@meridian.com"],
  ["2024-06-17 13:58:22", "warning", "api.key.rotated", "james@fortresscm.com", "Fortress Capital Markets", "198.51.100.23", "Production ingestion key rotated outside scheduled window"],
  ["2024-06-17 13:47:11", "info", "fraud.case.resolved", "m.thompson@zenith.bank", "Zenith Banking Corp", "192.0.2.61", "Case ZB-4471 closed as false positive"],
  ["2024-06-17 13:31:05", "critical", "billing.payment.failed", "System", "Pinnacle Wealth Management", "10.0.2.19", "Card declined for invoice INV-2024-0136 (insufficient funds)"],
  ["2024-06-17 13:18:44", "info", "feature.flag.toggled", "admin@axiomvault.io", "Global", "10.0.0.8", "Enabled realtime-scoring-v2 for 10% of organisations"],
  ["2024-06-17 12:54:37", "info", "user.login", "james@fortresscm.com", "Fortress Capital Markets", "198.51.100.23", "Successful login with password + TOTP"],
  ["2024-06-17 12:40:02", "warning", "user.login.failed", "unknown@globalpayments.com", "Global Payments Inc", "203.0.113.77", "5 consecutive failed login attempts; account locked for 15 minutes"],
  ["2024-06-17 12:12:56", "info", "report.exported", "sarah.chen@meridian.com", "Meridian Financial Group", "192.168.1.45", "Monthly fraud summary exported as CSV"],
  ["2024-06-17 11:47:30", "critical", "data.export.blocked", "System", "Global Payments Inc", "203.0.113.90", "Bulk export of 48,000 records blocked by DLP policy"],
  ["2024-06-17 10:22:15", "info", "role.updated", "admin@axiomvault.io", "Zenith Banking Corp", "10.0.0.8", "Added 'Case Reviewer' permission to role Fraud Analyst"],
  ["2024-06-17 09:05:48", "info", "user.logout", "m.thompson@zenith.bank", "Zenith Banking Corp", "192.0.2.61", "Session ended by user"],
  ["2024-06-17 07:33:21", "warning", "integration.sync.delayed", "System", "Nexus Insurance Holdings", "10.0.4.12", "AWS CloudTrail sync lagging by 22 minutes"],
  ["2024-06-17 02:10:09", "info", "backup.completed", "System", "Global", "10.0.0.2", "Nightly encrypted backup completed (412 GB)"],
  ["2024-06-16 22:48:57", "critical", "fraud.alert.triggered", "System", "Fortress Capital Markets", "10.0.3.31", "Unusual wire transfer velocity on account FC-20391"],
  ["2024-06-16 18:14:40", "info", "user.created", "priya@nexusinsurance.com", "Nexus Insurance Holdings", "185.22.14.7", "New viewer account created for l.harris@nexusinsurance.com"],
  ["2024-06-15 16:02:11", "warning", "mfa.disabled", "j.adeyemi@pinnaclewm.com", "Pinnacle Wealth Management", "102.89.4.18", "MFA disabled for own account"],
  ["2024-06-14 11:29:03", "info", "api.key.created", "james@fortresscm.com", "Fortress Capital Markets", "198.51.100.23", "Staging API key created with read-only scope"],
  ["2024-06-12 09:45:36", "critical", "org.suspended", "admin@axiomvault.io", "Pinnacle Wealth Management", "10.0.0.8", "Organisation suspended for overdue invoices (3 cycles)"],
  ["2024-06-08 15:20:44", "info", "billing.plan.changed", "finance@globalpayments.com", "Global Payments Inc", "203.0.113.12", "Plan upgraded from Professional to Enterprise"],
  ["2024-05-30 13:11:27", "warning", "detection.rule.disabled", "m.thompson@zenith.bank", "Zenith Banking Corp", "192.0.2.61", "Rule 'Card-not-present velocity' disabled"],
  ["2024-05-21 08:03:50", "info", "org.created", "admin@axiomvault.io", "Meridian Financial Group", "10.0.0.8", "Organisation onboarded on Enterprise plan"],
];

const orgSlug = (name: string) =>
  name === "Global" ? "global" : `org_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "")}`;

export const auditEvents: AuditEvent[] = rows.map(
  ([timestamp, severity, event, user, organisation, ip, details], i) => ({
    id: `evt_${String(i + 1).padStart(3, "0")}`,
    timestamp,
    severity,
    event,
    user,
    organisation,
    orgId: orgSlug(organisation),
    ip,
    details,
  }),
);

// Organisations that appear in the trail, alphabetical with "Global" last
export const auditOrganisations = [...new Set(auditEvents.map((e) => e.organisation))].sort((a, b) =>
  a === "Global" ? 1 : b === "Global" ? -1 : a.localeCompare(b),
);

export const eventTime = (e: AuditEvent) => new Date(`${e.timestamp.replace(" ", "T")}Z`);

export const rawPayload = (e: AuditEvent) =>
  JSON.stringify(
    { event: e.event, severity: e.severity, timestamp: e.timestamp, actor: e.user, ip: e.ip },
    null,
    2,
  );
