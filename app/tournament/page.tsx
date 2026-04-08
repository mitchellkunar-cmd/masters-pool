"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";

interface GolferScore {
  name: string;
  position: string;
  totalScore: string;
  thru: number;
  today: string;
  rounds: number[];
}

interface TournamentData {
  tournament: string;
  golfers: GolferScore[];
  status: string;
  round: number;
}

function TournamentContent() {
  const [data, setData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchScores = () => {
    fetch("/api/scores")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLastUpdated(new Date());
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-green-200 text-center p-8">Loading scores...</p>;
  if (!data || data.golfers.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-[#FFD700] mb-2">{data?.tournament || "Tournament"}</h2>
        <p className="text-green-200">No live scores available. The tournament may not have started yet.</p>
        <p className="text-green-300 text-sm mt-2">Status: {data?.status}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4 mt-2">
        <div>
          <h2 className="text-2xl font-bold text-[#FFD700]">{data.tournament}</h2>
          <p className="text-green-200 text-sm">
            {data.status} {data.round > 0 && `\u2022 Round ${data.round}`}
          </p>
        </div>
        <div className="text-right">
          <button onClick={fetchScores} className="text-[#FFD700] text-sm underline hover:text-yellow-300">
            Refresh
          </button>
          {lastUpdated && (
            <p className="text-green-300 text-xs mt-1">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#004d35] text-[#FFD700]">
              <th className="p-3 text-left">Pos</th>
              <th className="p-3 text-left">Player</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3 text-center">Today</th>
              <th className="p-3 text-center">Thru</th>
              {data.golfers[0]?.rounds?.map((_, i) => (
                <th key={i} className="p-3 text-center hidden md:table-cell">R{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.golfers.map((g, i) => (
              <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="p-3 font-semibold text-gray-700">{g.position}</td>
                <td className="p-3 font-semibold text-gray-900">{g.name}</td>
                <td className="p-3 text-center font-mono font-semibold text-gray-900">{g.totalScore}</td>
                <td className="p-3 text-center font-mono text-gray-600">{g.today}</td>
                <td className="p-3 text-center text-gray-500">{g.thru || "-"}</td>
                {g.rounds?.map((r, ri) => (
                  <td key={ri} className="p-3 text-center text-gray-500 hidden md:table-cell">{r || "-"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TournamentPage() {
  return (
    <AuthGuard>
      {() => <TournamentContent />}
    </AuthGuard>
  );
}
