import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Paintbrush, LifeBuoy } from "lucide-react";
import servicesData from "@/data/services.json";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  price: string;
  features: string[];
}

const CATEGORY_MAP: Record<string, { parent: string; icon: React.ReactNode }> = {
  "aquarium-consulting-design": {
    parent: "aquarium",
    icon: <ShieldCheck className="w-6 h-6 text-[#00aaff]" />,
  },
  "custom-aquariums": {
    parent: "aquarium",
    icon: <Paintbrush className="w-6 h-6 text-[#00aaff]" />,
  },
  "aquarium-installation": {
    parent: "aquarium",
    icon: <Paintbrush className="w-6 h-6 text-[#00aaff]" />,
  },
  "aquarium-water-testing": {
    parent: "in-store",
    icon: <LifeBuoy className="w-6 h-6 text-[#00aaff]" />,
  },
  "fish-of-month-club": {
    parent: "in-store",
    icon: <LifeBuoy className="w-6 h-6 text-[#00aaff]" />,
  },
  "pet-nail-wing-trims": {
    parent: "in-store",
    icon: <LifeBuoy className="w-6 h-6 text-[#00aaff]" />,
  },
  "dog-adoption-events": {
    parent: "dog-adoption",
    icon: <LifeBuoy className="w-6 h-6 text-[#00aaff]" />,
  },
};

const SERVICE_GROUPS = [
  {
    title: "Aquarium Services",
    description: "Bespoke consultations, custom designs, and professional installations.",
    slug: "aquarium",
    slugs: ["aquarium-consulting-design", "custom-aquariums", "aquarium-installation"],
  },
  {
    title: "In-Store Services",
    description: "Water quality testing, monthly membership programs, and quick grooming trims.",
    slug: "in-store",
    slugs: ["aquarium-water-testing", "fish-of-month-club", "pet-nail-wing-trims"],
  },
  {
    title: "Dog Adoption Events",
    description: "Meet adoptable dogs from our partner rescue groups and find your new family member.",
    slug: "dog-adoption",
    slugs: ["dog-adoption-events"],
  },
];

export default function ServicesPage() {
  const services = servicesData as ServiceItem[];

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-white">
        {/* Hero Banner Section */}
        <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner/service.png"
              alt="Sierra Services Banner"
              fill
              priority
              className="object-cover object-center filter brightness-[0.7]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#002244]/95 via-[#003d73]/90 to-[#005AA9]/75 z-10" />
          </div>

          <div className="container mx-auto px-6 max-w-6xl relative z-20 text-center pt-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#00aaff] bg-[#00aaff]/10 px-4 py-1.5 rounded-full select-none mb-6">
              🐠 OUR SERVICES
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-6">
              Professional Pet & Aquarium Services
            </h1>
            <p className="text-base md:text-lg text-blue-100/90 font-light leading-relaxed max-w-2xl mx-auto">
              From bespoke tank setups and professional water diagnostics to pet nail trimming and adoption events—we are dedicated to supporting all your pet care needs.
            </p>
          </div>
        </section>

        {/* Services Grouping Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="container mx-auto px-6 max-w-6xl">
            {SERVICE_GROUPS.map((group, groupIdx) => {
              // Get services belonging to this group
              const groupServices = services.filter((s) => group.slugs.includes(s.slug));

              return (
                <div key={group.slug} className={`mb-16 md:mb-24 ${groupIdx > 0 ? "pt-12 border-t border-slate-800/60" : ""}`}>
                  <div className="max-w-2xl mb-10">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3 text-white">
                      {group.title}
                    </h2>
                    <p className="text-sm md:text-base text-slate-400 font-light">
                      {group.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groupServices.map((service) => {
                      const mapping = CATEGORY_MAP[service.slug];
                      const detailUrl = `/services/${mapping?.parent || "consulting"}/${service.slug}`;

                      return (
                        <div
                          key={service.id}
                          className="flex flex-col justify-between backdrop-blur-md bg-white/[0.03] border border-white/10 hover:border-[#00aaff]/40 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[#00aaff]/5 group"
                        >
                          <div>
                            {/* Service Header Info */}
                            <div className="flex items-center justify-between mb-5">
                              <div className="p-3 bg-white/[0.05] rounded-2xl group-hover:bg-[#00aaff]/10 transition-colors">
                                {mapping?.icon || <ShieldCheck className="w-6 h-6 text-[#00aaff]" />}
                              </div>
                              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-full">
                                {service.price}
                              </span>
                            </div>

                            <h3 className="font-extrabold text-xl text-white mb-3 tracking-tight">
                              {service.name}
                            </h3>

                            <p className="text-sm text-slate-300/95 font-light leading-relaxed mb-6">
                              {service.shortDescription}
                            </p>

                            {/* Features list snapshot */}
                            <ul className="flex flex-col gap-2.5 mb-8">
                              {service.features.slice(0, 3).map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                  <CheckCircle2 className="w-4.5 h-4.5 text-[#00aaff] shrink-0 mt-0.5" />
                                  <span className="text-xs font-medium text-slate-200 leading-normal line-clamp-1">
                                    {feat}
                                  </span>
                                </li>
                              ))}
                              {service.features.length > 3 && (
                                <li className="text-[11px] font-bold text-[#00aaff] pl-7">
                                  + {service.features.length - 3} more key features
                                </li>
                              )}
                            </ul>
                          </div>

                          <div>
                            <Link
                              href={detailUrl}
                              className="w-full inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-[#005AA9] text-white px-5 py-3 rounded-2xl text-sm font-bold border border-white/10 hover:border-transparent transition-all duration-250 active:scale-98"
                            >
                              Learn Details
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
