"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SierraEduRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const slug = searchParams?.get("slug");
    const category = searchParams?.get("category");

    if (slug) {
      router.replace(`/education/${slug}`);
    } else if (category) {
      router.replace(`/education?category=${category}`);
    } else {
      router.replace("/education");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-slate-400 text-sm font-medium">Redirecting to Education...</div>
    </div>
  );
}

export default function SierraEduRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-400 text-sm font-medium">Loading…</div>
        </div>
      }
    >
      <SierraEduRedirectContent />
    </Suspense>
  );
}
