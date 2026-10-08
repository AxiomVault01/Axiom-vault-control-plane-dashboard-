import {
  Bell,
  Building2,
  CreditCard,
  Flag,
  HeartPulse,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  type LucideIcon,
} from "lucide-react";

// Mock data for the admin dashboard. Swap for API calls (react-query) later.

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export const NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Platform",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/organisations", label: "Organisations", icon: Building2, badge: 24 },
      { href: "/dashboard/users", label: "Users", icon: Users, badge: 1563 },
    ],
  },
  {
    title: "Access & Finance",
    items: [
      { href: "/dashboard/roles", label: "Roles & Permissions", icon: ShieldCheck },
      { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { href: "/dashboard/audit-logs", label: "Audit Logs", icon: ScrollText },
      { href: "/dashboard/system-health", label: "System Health", icon: HeartPulse },
    ],
  },
  {
    title: "Configuration",
    items: [
      { href: "/dashboard/feature-flags", label: "Feature Flags", icon: Flag },
      { href: "/dashboard/detection-config", label: "Detection Config", icon: SlidersHorizontal },
      { href: "/dashboard/notification-templates", label: "Notification Template", icon: Bell },
      { href: "/dashboard/settings", label: "Setting", icon: Settings },
    ],
  },
];

export const currentUser = {
  name: "Admin User",
  email: "admin@axiomvault.io",
  initials: "AV",
  lastLogin: "Today, 9:24 AM",
};

export type Kpi = {
  label: string;
  value: string;
  change: string;
  caption: string;
  tone: "blue" | "green" | "amber" | "pink";
};

export const kpis: Kpi[] = [
  { label: "Monthly Recurring Revenue", value: "₦847,200", change: "+12.3%", caption: "vs last month", tone: "blue" },
  { label: "Active Organizations", value: "284", change: "+18", caption: "new this month", tone: "green" },
  { label: "Fraud Events Detected", value: "14,892", change: "+8.4%", caption: "this month", tone: "amber" },
  { label: "Platform Uptime", value: "99.97%", change: "+0.02%", caption: "30-day SLA", tone: "pink" },
];

// MRR in USD thousands
export const revenue = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 330 },
  { month: "Apr", value: 455 },
  { month: "May", value: 560 },
  { month: "Jun", value: 650 },
  { month: "Jul", value: 730 },
  { month: "Aug", value: 800 },
  { month: "Sep", value: 860 },
  { month: "Oct", value: 915 },
  { month: "Nov", value: 960 },
  { month: "Dec", value: 1000 },
];

export const revenueSummary = [
  { label: "ARR", value: "₦10.17M" },
  { label: "Avg MRR per Org", value: "₦10.17M" },
  { label: "Net Revenue Retention", value: "118%" },
];

export type SubscriptionAlert = {
  id: string;
  org: string;
  issue: string;
  time: string;
  severity: "critical" | "warning";
};

export const subscriptionAlerts: SubscriptionAlert[] = [
  { id: "a1", org: "Pinnacle Wealth Management", issue: "Payment failed", time: "2 min ago", severity: "critical" },
  { id: "a2", org: "Aurora Fintech Ltd", issue: "Trial Expiring", time: "In 3 days", severity: "warning" },
  { id: "a3", org: "Vertex Lending Solutions", issue: "Usage at 94%", time: "Current", severity: "warning" },
];

export type ServiceStatus = "Operational" | "Degraded" | "Down";

export const services: { name: string; latency?: string; status: ServiceStatus }[] = [
  { name: "API Gateway", latency: "42ms", status: "Operational" },
  { name: "Detection Engine", latency: "8ms", status: "Operational" },
  { name: "Audit Pipeline", status: "Operational" },
  { name: "ML Inference", latency: "312ms", status: "Degraded" },
  { name: "Webhook Delivery", status: "Operational" },
];

export type AuditLevel = "Info" | "Warning" | "Critical";

export const auditEvents: {
  id: string;
  level: AuditLevel;
  event: string;
  description: string;
  time: string;
}[] = [
  { id: "e1", level: "Info", event: "user.login", description: "Successful login via SSO (Okta)", time: "14:32:18" },
  { id: "e2", level: "Critical", event: "fraud.alert.triggered", description: "Velocity rule: 47 transactions in 60 seconds from IP 203.0.113.42", time: "14:32:18" },
  { id: "e3", level: "Warning", event: "org.settings.updated", description: "Detection sensitivity threshold changed from 72 to 85", time: "14:32:18" },
  { id: "e4", level: "Info", event: "user.created", description: "New user provisioned: alex.morgan@meridian.com (Analyst)", time: "14:32:18" },
  { id: "e5", level: "Warning", event: "api.key.rotated", description: "Production API key rotated. Previous key invalidated.", time: "14:32:18" },
  { id: "e6", level: "Info", event: "fraud.case.resolved", description: "Case #ZB-2847 marked resolved. False positive confirmed.", time: "14:32:18" },
];

// Header notifications reuse the subscription alerts
export const notifications = subscriptionAlerts.map((a) => ({
  id: a.id,
  title: a.org,
  detail: `${a.issue} · ${a.time}`,
  href: "/dashboard/billing",
}));
