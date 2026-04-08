"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "./Nav";

export default function AuthGuard({ children }: { children: (username: string) => React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error("Not logged in");
        return r.json();
      })
      .then((data) => {
        setUsername(data.username);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#006747] flex items-center justify-center">
        <p className="text-green-200 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#006747]">
      <Nav username={username!} />
      {children(username!)}
    </div>
  );
}
