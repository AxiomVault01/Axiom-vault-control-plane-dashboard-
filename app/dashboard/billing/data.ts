// Mock billing data until the API is wired up

export type InvoiceStatus = "Paid" | "Failed" | "Pending";

export interface Invoice {
  id: string;
  organisation: string;
  amount: number;
  date: string;
  status: InvoiceStatus;
}

export const billingStats = [
  { label: "MRR", value: "$847,200", change: "+12.3%" },
  { label: "ARR", value: "$10.17M", change: "+12.3%" },
  { label: "Avg Revenue / Org", value: "$2,983", change: "+4.1%" },
  { label: "Churn Rate", value: "0.69%", change: "+0.12%" },
];

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// MRR per month, USD thousands
export const mrrTrend = [42, 168, 284, 386, 478, 558, 627, 686, 735, 776, 815, 847.2];

export const planRevenue = [
  { plan: "Enterprise", orgs: 18, revenue: 74200, color: "#a3420f" },
  { plan: "Professional", orgs: 42, revenue: 21400, color: "#a8a21a" },
  { plan: "Starter", orgs: 224, revenue: 8800, color: "#1e1b8f" },
];

export const invoices: Invoice[] = [
  { id: "INV-2024-0142", organisation: "Nexus Insurance Holdings", amount: 18600, date: "Jun 1, 2024", status: "Paid" },
  { id: "INV-2024-0141", organisation: "Global Payments Inc", amount: 14200, date: "Jun 1, 2024", status: "Paid" },
  { id: "INV-2024-0140", organisation: "Meridian Financial Group", amount: 12400, date: "Jun 1, 2024", status: "Paid" },
  { id: "INV-2024-0139", organisation: "Fortress Capital Markets", amount: 9800, date: "Jun 1, 2024", status: "Paid" },
  { id: "INV-2024-0138", organisation: "Pinnacle Wealth Management", amount: 2800, date: "Jun 1, 2024", status: "Paid" },
  { id: "INV-2024-0137", organisation: "Zenith Banking Corp", amount: 4200, date: "Jun 1, 2024", status: "Paid" },
  { id: "INV-2024-0136", organisation: "Nexus Insurance Holdings", amount: 4200, date: "Jun 1, 2024", status: "Failed" },
  { id: "INV-2024-0135", organisation: "Nexus Insurance Holdings", amount: 4200, date: "Jun 1, 2024", status: "Paid" },
];

export const formatUSD = (n: number) => `$${n.toLocaleString("en-US")}`;
