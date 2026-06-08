// import Link from "next/link";
// import { Phone, Mail, MapPin, Clock } from "lucide-react";

// export default function TopBar() {
//   return (
//     <div className="hidden lg:block bg-slate-950 text-white">
//       <div className="container mx-auto flex h-9 items-center justify-between px-4">

//         {/* Left — contact details */}
//         <div className="flex items-center gap-5">

//           <a
//             href="tel:5306711147"
//             className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-300 transition-colors hover:text-cyan-400"
//           >
//             <Phone className="h-3 w-3 text-cyan-500" />
//             (530) 671-1147
//           </a>

//           <span className="h-3 w-px bg-slate-700" />

//           <a
//             href="mailto:info@sierrafishandpets.com"
//             className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-300 transition-colors hover:text-cyan-400"
//           >
//             <Mail className="h-3 w-3 text-cyan-500" />
//             info@sierrafishandpets.com
//           </a>

//           <span className="h-3 w-px bg-slate-700" />

//           <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-400">
//             <MapPin className="h-3 w-3 text-cyan-500" />
//             Yuba City, CA
//           </span>

//         </div>

//         {/* Center — promo */}
//         <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold tracking-widest text-cyan-400 uppercase">
//           <span className="animate-pulse">🐠</span>
//           Fresh Fish Arrivals Every Week — In-Store
//         </div>

//         {/* Right — utility + toggle */}
//         <div className="flex items-center gap-4">

//           <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-400">
//             <Clock className="h-3 w-3 text-cyan-500" />
//             Mon–Sat 10am–7pm
//           </span>

//           <span className="h-3 w-px bg-slate-700" />

//           <Link
//             href="/contact"
//             className="text-[11px] font-semibold tracking-wide text-slate-300 transition-colors hover:text-cyan-400"
//           >
//             Contact
//           </Link>

//           <span className="h-3 w-px bg-slate-700" />

//           <Link
//             href="/faqs"
//             className="text-[11px] font-semibold tracking-wide text-slate-300 transition-colors hover:text-cyan-400"
//           >
//             FAQs
//           </Link>

//         </div>
//       </div>
//     </div>
//   );
// }