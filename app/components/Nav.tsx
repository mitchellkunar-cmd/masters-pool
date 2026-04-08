"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Nav({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const links = [
    { href: "/picks", label: "Make Picks" },
    { href: "/my-entries", label: "My Entries" },
    { href: "/leaderboard", label: "Pool Leaderboard" },
    { href: "/tournament", label: "Tournament" },
  ];

  return (
    <div className="bg-[#004d35] border-b-4 border-[#FFD700]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/picks" className="flex items-center gap-3">
          <img src="/masters-logo.svg" alt="The Masters" className="h-10" />
          <span className="text-2xl font-bold text-[#FFD700] tracking-tight">405 Masters Pool</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-green-200 text-sm hidden sm:inline">
            <strong className="text-white">{username}</strong>
          </span>
          <button onClick={handleLogout} className="text-green-300 text-sm underline hover:text-white">
            Logout
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-1.5 rounded-t-lg text-sm font-semibold transition-colors ${
              pathname === link.href
                ? "bg-[#006747] text-[#FFD700]"
                : "text-green-200 hover:text-white hover:bg-[#005a3c]"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
