// import Link from "next/link";
// import MegaMenu from "./MegaMenu";

// const NAV_LINKS = [
//   { label: "Home", href: "/" },
//   { label: "Services", href: "/services" },
//   { label: "Arrivals", href: "/arrivals" },
//   { label: "Brands", href: "/brands" },
//   { label: "Learn", href: "/edu" },
//   { label: "Blog", href: "/blog" },
//   { label: "Gallery", href: "/gallery" },
//   { label: "Contact", href: "/contact" },
// ] as const;

// export default function Navbar() {
//   return (
//     <nav className="hidden lg:block bg-gradient-to-r from-[#004d8f] via-[#005AA9] to-[#0069c0] shadow-md">
//         <div className="container mx-auto px-4">
//           <div className="flex h-12 items-center justify-between">

//             {/* Nav links */}
//             <div className="flex items-center">
//               <MegaMenu />

//               <span className="mx-2 h-4 w-px bg-white/20" />

//               {NAV_LINKS.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="
//                     relative px-3.5 py-3
//                     text-[13px] font-semibold tracking-wide text-white/85
//                     transition-colors duration-150
//                     hover:text-white
//                     after:absolute after:bottom-0 after:left-3.5 after:right-3.5
//                     after:h-[2px] after:scale-x-0 after:rounded-full
//                     after:bg-cyan-300 after:transition-transform after:duration-200
//                     hover:after:scale-x-100
//                   "
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>

//             {/* Promo pill */}
//             <div className="hidden xl:flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
//               <span className="animate-pulse text-sm">🐠</span>
//               <span className="text-[11px] font-bold tracking-widest text-cyan-200 uppercase">
//                 Fresh Fish Every Week
//               </span>
//             </div>

//           </div>
//         </div>
//       </nav>
//   );
// }