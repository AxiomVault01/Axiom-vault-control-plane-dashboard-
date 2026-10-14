// Mock notification templates until the API is wired up

export type Channel = "email" | "sms" | "webhook";
export type TemplateStatus = "active" | "draft";
export type SeverityLevel = "Critical" | "High" | "Medium" | "Low";

export interface TemplateContent {
  subject: string; // email subject, or webhook endpoint
  fromName: string; // email sender, or SMS sender ID
  body: string;
}

export interface TemplateVersion extends TemplateContent {
  version: number;
  date: string;
  author: string;
  note: string;
}

export interface Template extends TemplateContent {
  id: string;
  name: string;
  description: string;
  channel: Channel;
  event: string;
  severities: SeverityLevel[];
  status: TemplateStatus;
  version: number;
  modified: string;
  history: TemplateVersion[]; // newest first, includes the current version
}

export const SEVERITY_LEVELS: SeverityLevel[] = ["Critical", "High", "Medium", "Low"];

export const TEMPLATE_EVENTS = [
  "fraud.alert.triggered",
  "fraud.case.assigned",
  "fraud.case.resolved",
  "billing.payment.failed",
  "report.weekly_digest",
  "user.login.suspicious",
  "api.key.rotated",
];

export const VARIABLES = [
  "recipient_name",
  "event_id",
  "timestamp",
  "risk_score",
  "reason",
  "org_name",
  "dashboard_url",
  "amount",
  "account_id",
  "device_id",
  "location",
  "merchant_name",
];

// Values used by Live Preview
export const SAMPLE_VALUES: Record<string, string> = {
  recipient_name: "Sarah Chen",
  event_id: "evt_8f21a9",
  timestamp: "2024-06-17 14:32:18 UTC",
  risk_score: "94",
  reason: "Velocity spike across 3 new devices",
  org_name: "Meridian Financial Group",
  dashboard_url: "https://app.axiomvault.io/cases/evt_8f21a9",
  amount: "$12,480.00",
  account_id: "acc_20391",
  device_id: "dev_7c1e",
  location: "Lagos, NG",
  merchant_name: "Northwind Electronics",
  case_id: "case_4471",
  analyst_name: "James Okafor",
  invoice_id: "INV-2024-0136",
  alert_count: "38",
};

export const channelFields: Record<Channel, { subject?: string; fromName?: string; body: string }> = {
  email: { subject: "Subject Line", fromName: "From Name", body: "Body" },
  sms: { fromName: "Sender ID", body: "Message" },
  webhook: { subject: "Endpoint URL", body: "JSON Payload" },
};

const highBody = `Dear {{recipient_name}},

A high-severity fraud event has been detected on your account.

**Event Details:**
• Event ID: {{event_id}}
• Timestamp: {{timestamp}}
• Risk Score: {{risk_score}}/100
• Transaction Amount: {{amount}}
• Flagged Reason: {{reason}}

**Recommended Action:**
Please review this alert immediately in your AxiomVault dashboard and confirm or dismiss it within 4 hours.

If this activity is legitimate, mark it as reviewed. If fraudulent, initiate the escalation workflow.

---
{{dashboard_url}}`;

type Seed = Omit<Template, "history" | "version" | "modified"> & { versions: [string, string][] }; // [date, note], oldest first

const seeds: Seed[] = [
  {
    id: "fraud-high", name: "Fraud Alert — High Severity", description: "Sent to org admins for high-risk fraud alerts", channel: "email", event: "fraud.alert.triggered", severities: ["Critical", "High"], status: "active",
    subject: "🚨 High-Priority Fraud Alert - {{org_name}}", fromName: "AxiomVault Fraud Intelligence", body: highBody,
    versions: [["Feb 2, 2024", "Initial version"], ["Mar 18, 2024", "Added risk score"], ["May 4, 2024", "Shortened review window to 4 hours"], ["Jun 10, 2024", "Added transaction amount"]],
  },
  {
    id: "fraud-medium", name: "Fraud Alert — Medium Severity", description: "Daily-review fraud alerts", channel: "email", event: "fraud.alert.triggered", severities: ["Medium"], status: "active",
    subject: "Fraud alert for review - {{org_name}}", fromName: "AxiomVault Fraud Intelligence",
    body: `Hi {{recipient_name}},\n\nA medium-severity event ({{event_id}}) was flagged at {{timestamp}} with a risk score of {{risk_score}}/100.\n\n**Reason:** {{reason}}\n\nPlease review it within 24 hours:\n{{dashboard_url}}`,
    versions: [["Feb 2, 2024", "Initial version"], ["Apr 11, 2024", "Copy tweaks"], ["Jun 8, 2024", "Added reason"]],
  },
  {
    id: "case-assigned", name: "Case Assigned Notification", description: "Tells an analyst a case is theirs", channel: "email", event: "fraud.case.assigned", severities: ["Critical", "High", "Medium", "Low"], status: "active",
    subject: "Case {{case_id}} assigned to you", fromName: "AxiomVault Cases",
    body: `Hi {{analyst_name}},\n\nCase {{case_id}} for {{org_name}} has been assigned to you.\n\n**Risk Score:** {{risk_score}}/100\n**Reason:** {{reason}}\n\nOpen the case: {{dashboard_url}}`,
    versions: [["Mar 1, 2024", "Initial version"], ["May 22, 2024", "Added risk score"]],
  },
  {
    id: "payment-failed", name: "Payment Failed Alert", description: "Billing contact notification on failed charges", channel: "email", event: "billing.payment.failed", severities: ["High"], status: "active",
    subject: "Action required: payment failed for {{org_name}}", fromName: "AxiomVault Billing",
    body: `Hi {{recipient_name}},\n\nWe couldn't process the payment for invoice {{invoice_id}} ({{amount}}).\n\nPlease update your payment method to avoid service interruption:\n{{dashboard_url}}`,
    versions: [["Jan 9, 2024", "Initial version"], ["Feb 14, 2024", "Added invoice ID"], ["Mar 3, 2024", "Copy tweaks"], ["Apr 20, 2024", "Updated link"], ["May 15, 2024", "Softer tone"]],
  },
  {
    id: "weekly-digest", name: "Weekly Digest Report", description: "Weekly summary for org admins", channel: "email", event: "report.weekly_digest", severities: ["Low"], status: "draft",
    subject: "Your weekly AxiomVault summary - {{org_name}}", fromName: "AxiomVault Reports",
    body: `Hi {{recipient_name}},\n\nThis week {{org_name}} received **{{alert_count}} alerts**.\n\nView the full report: {{dashboard_url}}`,
    versions: [["Jun 14, 2024", "Initial draft"]],
  },
  {
    id: "sms-high", name: "High-Priority SMS Alert", description: "SMS for critical fraud events", channel: "sms", event: "fraud.alert.triggered", severities: ["Critical"], status: "active",
    subject: "", fromName: "AXIOMVLT",
    body: `AxiomVault: Critical fraud alert {{event_id}} for {{org_name}}. Risk {{risk_score}}/100. Review now: {{dashboard_url}}`,
    versions: [["Mar 12, 2024", "Initial version"], ["Apr 30, 2024", "Shortened to one segment"]],
  },
  {
    id: "webhook-stream", name: "Webhook — Fraud Event Stream", description: "Machine-readable fraud events for SIEM", channel: "webhook", event: "fraud.alert.triggered", severities: ["Critical", "High", "Medium", "Low"], status: "active",
    subject: "https://hooks.example.com/axiomvault", fromName: "",
    body: `{\n  "event_id": "{{event_id}}",\n  "org": "{{org_name}}",\n  "timestamp": "{{timestamp}}",\n  "risk_score": {{risk_score}},\n  "reason": "{{reason}}",\n  "account_id": "{{account_id}}",\n  "device_id": "{{device_id}}"\n}`,
    versions: [["Jan 5, 2024", "Initial version"], ["Feb 1, 2024", "Added device_id"], ["Mar 9, 2024", "Added account_id"], ["Apr 2, 2024", "Renamed org field"], ["May 6, 2024", "Numeric risk score"], ["Jun 1, 2024", "Added reason"]],
  },
];

export const initialTemplates: Template[] = seeds.map(({ versions, ...t }) => {
  const content = { subject: t.subject, fromName: t.fromName, body: t.body };
  return {
    ...t,
    version: versions.length,
    modified: versions[versions.length - 1][0],
    // Older versions share the current content in this mock
    history: versions
      .map(([date, note], i) => ({ ...content, version: i + 1, date, note, author: "admin" }))
      .reverse(),
  };
});

export const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const fillVariables = (text: string) =>
  text.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, name: string) => SAMPLE_VALUES[name] ?? m);
