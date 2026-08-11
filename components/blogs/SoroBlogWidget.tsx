"use client";

import { useEffect } from "react";

export default function SoroBlogWidget() {
  useEffect(() => {
    const scriptId = "soro-blog-script";

    // Prevent duplicate script loading if component re-mounts
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://app.trysoro.com/api/embed/0b35c5e0-e43d-4fdb-afb0-472b3e411676";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div id="soro-blog" className="w-full my-6" />
  );
}
