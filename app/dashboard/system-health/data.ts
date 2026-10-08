// Mock infrastructure telemetry until the monitoring API is wired up

export type ServiceStatus = "Operational" | "Degraded" | "Outage";
export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime: number; // percent, 30 days
  latencyMs: number | null; // null = not request-serving
  region: string;
  version: string;
}

export interface LogEntry {
  id: number;
  time: string; // HH:mm:ss.SSS
  level: LogLevel;
  message: string;
  meta: Record<string, string | number | boolean>;
}

export const LAST_UPDATED = "14:32:18";

export const healthStats = [
  { label: "Overall Uptime", value: "99.97%", caption: "30-day SLA", tone: "blue" },
  { label: "API p50 Latency", value: "42ms", caption: "p99: 128ms", tone: "green" },
  { label: "Throughput", value: "19.8K/s", caption: "peak today", tone: "fuchsia" },
  { label: "Error Rate", value: "0.04%", caption: "last 24h", tone: "red" },
] as const;

// Hourly samples, 00:00 → 23:00
export const latencySeries = [28, 28, 28, 27, 23, 30, 40, 48, 56, 66, 76, 84, 88, 82, 62, 44, 38, 40, 46, 42, 34, 27, 20, 14];
export const throughputSeries = [3.1, 2.4, 1.9, 1.6, 1.8, 3.2, 6.4, 10.2, 13.8, 16.1, 17.9, 19.4, 19.8, 18.7, 16.2, 14.9, 14.1, 13.6, 12.4, 10.8, 8.9, 6.7, 5.2, 4.0];

export const services: Service[] = [
  { id: "api-gateway", name: "API Gateway", status: "Operational", uptime: 99.99, latencyMs: 42, region: "us-east-1", version: "2.4.1" },
  { id: "fraud-engine", name: "Fraud Detection Engine", status: "Operational", uptime: 99.97, latencyMs: 8, region: "us-east-1", version: "5.12.0" },
  { id: "ml-inference", name: "ML Inference Service", status: "Degraded", uptime: 99.84, latencyMs: 312, region: "us-east-1", version: "1.9.3" },
  { id: "audit-pipeline", name: "Audit Pipeline", status: "Operational", uptime: 100, latencyMs: null, region: "us-east-1", version: "3.0.7" },
  { id: "webhooks", name: "Webhook Delivery", status: "Operational", uptime: 99.95, latencyMs: null, region: "us-east-1", version: "1.4.2" },
  { id: "db-cluster", name: "Database Cluster", status: "Operational", uptime: 100, latencyMs: 3, region: "us-east-1", version: "PostgreSQL 16.3" },
  { id: "redis", name: "Cache Layer (Redis)", status: "Operational", uptime: 100, latencyMs: 0.8, region: "us-east-1", version: "7.2.4" },
  { id: "notifications", name: "Notification Service", status: "Operational", uptime: 99.98, latencyMs: 64, region: "eu-west-1", version: "2.1.0" },
];

type Template = [LogLevel, string, Record<string, string | number | boolean>?];

// Most recent first; "{name}" and "{version}" are filled per service
const baseLogs: Template[] = [
  ["INFO", "Service started - version {version}", { pid: 4182, node: "node-a3" }],
  ["INFO", "Health check passed (uptime {uptime}%)", { check: "http", status: 200 }],
  ["DEBUG", "Config loaded from environment (14 vars)", { source: "env" }],
  ["INFO", "Incoming request: GET /v2/health", { method: "GET", path: "/v2/health", requestId: "req_8f21a" }],
  ["INFO", "Request processed successfully", { requestId: "req_8f21a", durationMs: 12 }],
  ["INFO", "Incoming request: POST /v2/events/ingest", { method: "POST", path: "/v2/events/ingest", requestId: "req_8f21b" }],
  ["DEBUG", "Cache hit - key: session:usr_1:perms (ttl 243s)", { key: "session:usr_1:perms", ttl: 243 }],
  ["INFO", "Metrics flushed to Prometheus endpoint", { series: 1284 }],
  ["INFO", "Autoscaler: no scaling action required (CPU 31%, MEM 52%)", { cpu: 31, mem: 52, replicas: 6 }],
  ["DEBUG", "Background job completed: gc_stale_sessions", { removed: 118, durationMs: 340 }],
  ["INFO", "Deployment heartbeat OK - last deploy 4h 12m ago", { deployId: "dep_2291" }],
  ["INFO", "Audit event written: api.request.completed", { eventId: "evt_001" }],
  ["ERROR", "Rate limit check: org nexus-insurance 2847/5000 rpm", { org: "nexus-insurance", rpm: 2847, limit: 5000 }],
  ["WARN", "TLS certificate valid - expires in 84 days", { daysLeft: 84, issuer: "Let's Encrypt" }],
];

const degradedLogs: Template[] = [
  ["WARN", "p95 inference latency above threshold (312ms > 250ms)", { p95: 312, threshold: 250 }],
  ["ERROR", "GPU node gpu-2 unresponsive - draining traffic", { node: "gpu-2", healthy: false }],
  ["WARN", "Request queue depth at 82% of capacity", { depth: 820, capacity: 1000 }],
];

// Pool cycled through while the log viewer is in Live mode
export const liveTemplates: Template[] = [
  ["INFO", "Incoming request: GET /v2/organisations", { method: "GET", path: "/v2/organisations" }],
  ["INFO", "Request processed successfully", { durationMs: 18 }],
  ["DEBUG", "Cache miss - key: org:settings (refetched)", { key: "org:settings" }],
  ["INFO", "Health check passed", { check: "http", status: 200 }],
  ["WARN", "Slow query detected (412ms)", { durationMs: 412, table: "events" }],
  ["INFO", "Metrics flushed to Prometheus endpoint", { series: 1291 }],
];

const fill = (s: string, svc: Service) =>
  s.replace("{version}", svc.version).replace("{uptime}", String(svc.uptime)).replace("{name}", svc.name);

export function formatLogTime(ms: number) {
  const d = new Date(ms);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}.${p(d.getUTCMilliseconds(), 3)}`;
}

// Base time for the mock logs: LAST_UPDATED on an arbitrary day
export const LOG_BASE_MS = Date.parse(`2024-06-17T${LAST_UPDATED}.441Z`);

export function makeEntry(t: Template, svc: Service, id: number, timeMs: number): LogEntry {
  const [level, message, meta = {}] = t;
  return { id, time: formatLogTime(timeMs), level, message: fill(message, svc), meta: { service: svc.id, region: svc.region, ...meta } };
}

export function logsFor(svc: Service): LogEntry[] {
  const templates = svc.status === "Degraded" ? [...degradedLogs, ...baseLogs.slice(0, 11)] : baseLogs;
  // ~1.1s apart, newest first
  return templates.map((t, i) => makeEntry(t, svc, templates.length - i, LOG_BASE_MS - i * 1137));
}
