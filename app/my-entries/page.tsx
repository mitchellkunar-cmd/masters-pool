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
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry? You can re-submit new picks after.")) return;
    setDeleting(id);
    const res = await fetch("/api/entries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
    setDeleting(null);
  };

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
            <p className="text-green-200 text-sm">{entry.name} &bull; Submitted {entry.submittedAt} ET</p>
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
            <div className="pt-3 border-t mt-3">
              <button
                onClick={() => handleDelete(entry.id)}
                disabled={deleting === entry.id}
                className="text-red-500 text-sm font-semibold hover:text-red-700 disabled:opacity-50"
              >
                {deleting === entry.id ? "Deleting..." : "Delete Entry"}
              </button>
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
