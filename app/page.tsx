"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#006747] flex items-center justify-center">
      <p className="text-green-200">Redirecting...</p>
    </div>
  );
}
