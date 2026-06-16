"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrderDetailsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/orders");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <p className="text-slate-500 font-semibold animate-pulse">Redirecting...</p>
    </div>
  );
}
