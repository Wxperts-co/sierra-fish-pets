import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Calendar | Sierra Fish & Pets",
  description:
    "Explore upcoming pet events, adoption fairs, educational workshops, and in-store activities at Sierra Fish & Pets in Renton, WA.",
  alternates: {
    canonical: "https://www.sierrafishandpets.com/event-calendar",
  },
};

export default function EventCalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
