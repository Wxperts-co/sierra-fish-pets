import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sierra Edu: Pet Care Guides & Tips | Sierra Fish & Pets",
  description:
    "Learn pet care, aquarium setup, nutrition tips, and reptile habitat management with Sierra Edu educational guides from Sierra Fish & Pets in Renton, WA.",
  alternates: {
    canonical: "https://sierrafishandpets.com/education",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SierraEduLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
