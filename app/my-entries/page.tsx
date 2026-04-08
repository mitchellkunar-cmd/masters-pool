"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import { tiers } from "@/lib/golfers";
import Link from "next/link";

interface Entry {
  id: string;
  teamName: string;
  name: string;
  picks: Record<string, string>;
  tiebreaker: string;
  submittedAt: string;
}

function MyEntriesContent({ username }: { username: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((all) => {
        const mine = all.filter(
          (e: { username: string }) => e.username?.toLowerCase() === username.toLowerCase()
        );
        setEntries(mine);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <p className="text-green-200 text-center p-8">Loading...</p>;

  if (entries.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <p className="text-green-200 text-lg mb-4">You haven&apos;t submitted any picks yet.</p>
        <Link href="/picks" className="bg-[#FFD700] text-[#004d35] font-bold px-6 py-3 rounded-lg hover:bg-yellow-400">
          Make Your Picks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 mt-4 space-y-6">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#004d35] px-5 py-3">
            <h2 className="text-lg font-bold text-[#FFD700]">{entry.teamName}</h2>
            <p className="text-green-200 text-sm">{entry.name} &bull; Submitted {new Date(entry.submittedAt).toLocaleDateString()}</p>
          </div>
          <div className="p-5 space-y-2">
            {tiers.map((t) => (
              <div key={t.tier} className="flex justify-between text-sm">
                <span className="text-gray-500 font-semibold">Tier {t.tier}</span>
                <span className="text-gray-900 font-medium">{entry.picks[`tier${t.tier}`]}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-gray-500 font-semibold">Tiebreaker</span>
              <span className="text-gray-900 font-medium">{entry.tiebreaker}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyEntriesPage() {
  return (
    <AuthGuard>
      {(username) => <MyEntriesContent username={username} />}
    </AuthGuard>
  );
}
