"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";

interface Entry {
  id: string;
  username: string;
  teamName: string;
  name: string;
  picks: Record<string, string>;
  tiebreaker: string;
  submittedAt: string;
}

function AdminContent({ username }: { username: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, teamName: string) => {
    if (!confirm(`Delete entry "${teamName}"? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await fetch("/api/admin/delete", {
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
    // Only allow admin user
    if (username.toLowerCase() !== "mitch") {
      setLoading(false);
      return;
    }
    setAuthorized(true);
    fetch("/api/entries")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <p className="text-green-200 text-center p-8">Loading...</p>;

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <p className="text-red-400 text-lg">Access denied.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 mt-4">
      <h2 className="text-2xl font-bold text-[#FFD700] mb-1">Admin View</h2>
      <p className="text-green-200 text-sm mb-4">{entries.length} entries submitted</p>

      {entries.length === 0 ? (
        <p className="text-green-200">No entries yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#004d35] text-[#FFD700]">
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Team Name</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">T1</th>
                <th className="p-3 text-left">T2</th>
                <th className="p-3 text-left">T3</th>
                <th className="p-3 text-left">T4</th>
                <th className="p-3 text-left">T5</th>
                <th className="p-3 text-left">T6</th>
                <th className="p-3 text-center">TB</th>
                <th className="p-3 text-left">Submitted</th>
                <th className="p-3 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.id} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 font-mono font-semibold text-[#006747]">{entry.username}</td>
                  <td className="p-3 font-semibold text-gray-900">{entry.teamName}</td>
                  <td className="p-3 text-gray-700">{entry.name}</td>
                  <td className="p-3 text-gray-700 text-xs">{entry.picks?.tier1}</td>
                  <td className="p-3 text-gray-700 text-xs">{entry.picks?.tier2}</td>
                  <td className="p-3 text-gray-700 text-xs">{entry.picks?.tier3}</td>
                  <td className="p-3 text-gray-700 text-xs">{entry.picks?.tier4}</td>
                  <td className="p-3 text-gray-700 text-xs">{entry.picks?.tier5}</td>
                  <td className="p-3 text-gray-700 text-xs">{entry.picks?.tier6}</td>
                  <td className="p-3 text-center text-gray-700 font-mono">{entry.tiebreaker}</td>
                  <td className="p-3 text-gray-500 text-xs whitespace-nowrap">{entry.submittedAt} ET</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(entry.id, entry.teamName)}
                      disabled={deleting === entry.id}
                      className="text-red-500 text-xs font-semibold hover:text-red-700 disabled:opacity-50"
                    >
                      {deleting === entry.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard>
      {(username) => <AdminContent username={username} />}
    </AuthGuard>
  );
}
