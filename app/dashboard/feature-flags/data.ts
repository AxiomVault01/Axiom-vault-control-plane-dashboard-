import { organisations } from "../organisations/data";

// Mock flags and overrides until the API is wired up

export const CATEGORIES = ["Detection", "Workflow", "API", "Security", "Compliance", "UI", "Other"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Flag {
  key: string; // unique, snake_case
  name: string;
  description: string;
  category: Category;
  enabled: boolean;
  rollout?: number; // percent of organisations, defaults to 100
}

export interface Override {
  id: string;
  organisation: string;
  flagKey: string;
  value: boolean;
  note: string;
  setBy: string;
}

export const initialFlags: Flag[] = [
  { key: "advanced_ml_detection", name: "Advanced ML Detection", description: "Next-gen ML fraud detection pipeline with transformer architecture", category: "Detection", enabled: true },
  { key: "real_time_graph_analysis", name: "Real-Time Graph Analysis", description: "Entity relationship graph analysis for syndicated fraud rings", category: "Detection", enabled: true },
  { key: "behavioral_biometrics", name: "Behavioral Biometrics", description: "Keystroke dynamics and mouse movement fraud signals", category: "Detection", enabled: false },
  { key: "auto_case_routing", name: "Auto Case Routing", description: "Automatically route fraud cases to available analysts", category: "Workflow", enabled: true },
  { key: "bulk_export_api", name: "Bulk Export API", description: "High-volume data export endpoints for enterprise clients", category: "API", enabled: true },
  { key: "sso_saml_v2", name: "SAML 2.0 SSO", description: "Enterprise SSO integration via SAML 2.0 protocol", category: "Security", enabled: true },
  { key: "audit_streaming", name: "Audit Log Streaming", description: "Real-time audit event streaming via webhooks", category: "Compliance", enabled: true },
  { key: "dark_mode_ui", name: "Dark Mode UI", description: "Dark theme across the entire application interface", category: "UI", enabled: true },
];

export const initialOverrides: Override[] = [
  { id: "ov1", organisation: "Aurora Fintech Ltd", flagKey: "advanced_ml_detection", value: false, note: "Trial org — ML detection disabled until onboarding complete", setBy: "admin" },
  { id: "ov2", organisation: "Pinnacle Wealth Management", flagKey: "bulk_export_api", value: false, note: "Suspended account — exports disabled pending payment", setBy: "admin" },
  { id: "ov3", organisation: "Zenith Banking Corp", flagKey: "behavioral_biometrics", value: true, note: "Early access pilot participant", setBy: "admin" },
];

export const overrideOrganisations = [
  ...new Set([...organisations.map((o) => o.name), ...initialOverrides.map((o) => o.organisation)]),
].sort((a, b) => a.localeCompare(b));

// Organisations on the platform, used for rollout impact estimates
export const TOTAL_ORGS = 284;

export const toFlagKey = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "");
