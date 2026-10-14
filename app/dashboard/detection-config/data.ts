// Mock detection rules until the API is wired up

export interface Rule {
  id: string;
  name: string;
  tag: string;
  enabled: boolean;
  sensitivity: number; // 0-100
  // Observed at `baseSensitivity`; the UI scales these as sensitivity changes
  baseSensitivity: number;
  baseFalsePositive: number; // percent
  baseTriggered: number; // last 30 days
  color: { track: string; thumb: string; text: string };
}

export interface DetectionConfig {
  globalSensitivity: number;
  rules: Rule[];
}

const rule = (
  id: string,
  name: string,
  tag: string,
  enabled: boolean,
  sensitivity: number,
  fp: number,
  triggered: number,
  color: Rule["color"],
): Rule => ({ id, name, tag, enabled, sensitivity, baseSensitivity: sensitivity, baseFalsePositive: fp, baseTriggered: triggered, color });

export const initialConfig: DetectionConfig = {
  globalSensitivity: 81,
  rules: [
    rule("velocity", "High Velocity Transactions", "velocity", true, 25, 2.1, 1847, { track: "#3b82f6", thumb: "#93c5fd", text: "#3b82f6" }),
    rule("geo", "Unusual Geographic Activity", "geolocation", true, 97, 4.7, 892, { track: "#22c55e", thumb: "#86efac", text: "#15803d" }),
    rule("device", "Device Fingerprint Mismatch", "device", true, 70, 1.3, 3241, { track: "#06b6d4", thumb: "#a5f3fc", text: "#0891b2" }),
    rule("behavioral", "Behavioral Anomaly Detection", "behavioral", true, 50, 5.2, 618, { track: "#fdba74", thumb: "#f97316", text: "#c2410c" }),
    rule("network", "Network Graph Clustering", "network", false, 25, 0.8, 0, { track: "#d8b4fe", thumb: "#e9d5ff", text: "#a855f7" }),
    rule("ato", "Account Takeover Signals", "ato", true, 70, 1.9, 427, { track: "#fca5a5", thumb: "#ef4444", text: "#dc2626" }),
  ],
};

// Rough model of how the global sensitivity trades alerts for accuracy
export function globalImpact(s: number) {
  return {
    dailyAlerts: Math.round(0.0058 * s * s),
    falsePositive: Math.max(0.1, 0.2 + s * 0.01),
    truePositive: Math.round(40 + s * 0.53),
  };
}

// Scale a rule's observed stats to its current sensitivity
export function ruleStats(r: Rule) {
  if (!r.enabled) return { falsePositive: r.baseFalsePositive, triggered: 0 };
  const ratio = r.baseSensitivity ? r.sensitivity / r.baseSensitivity : 1;
  return {
    falsePositive: Math.max(0.1, r.baseFalsePositive * ratio),
    triggered: Math.round(r.baseTriggered * ratio),
  };
}
