import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Shared Google Analytics 4 Client
export const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;

// Helper to format YYYYMMDD date strings (e.g. "20260721" -> "Jul 21")
export function formatGADate(dateStr: string): string {
  if (dateStr.length !== 8) return dateStr;
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  const date = new Date(year, month, day);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
