import type { Metadata } from "next";
import ContactUsPageClient from "@/components/contact-us/ContactUsPageClient";

export const metadata: Metadata = {
  title: "Pet Supplies near Renton, WA | Sierra Fish & Pets",
  description:
    "Sierra Fish and Pets near Renton, WA, offers dog, puppy, fish aquarium, accessories, and pet food supplies. Call now!",
  keywords: [
    "pet shop Renton, WA",
    "pet supplies Renton, WA",
    "pet supplies near Renton, WA",
    "fish aquarium Renton, WA",
    "puppy supplies Renton, WA",
    "aquarium accessories Renton, WA",
    "dog supplies Renton, WA",
    "pet food supplies Renton, WA",
    "pet food store Renton, WA",
  ],
  alternates: {
    canonical: "https://www.sierrafishandpets.com/contact-us",
  },
};

export default function ContactUsPage() {
  return <ContactUsPageClient />;
}
