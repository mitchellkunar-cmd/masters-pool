"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";

interface Entry {
  teamName: string;
  name: string;
  username: string;
  picks: Record<string, string>;
  tiebreaker: string;
}

interface GolferScore {
  name: string;
  totalScore: string;
  position: string;
}

interface RankedEntry extends Entry {
  totalScore: number;
  golferScores: { tier: number; name: string; score: string }[];
}

function parseScore(score: string): number {
  if (!score || score === "-" || score === "E") return 0;
  if (score === "CUT" || score === "WD" || score === "DQ") return 999;
  return parseInt(score, 10) || 0;
}

function LeaderboardContent() {
  const [ranked, setRanked] = useState<RankedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tournamentName, setTournamentName] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = () => {
    Promise.all([
      fetch("/api/entries").then((r) => r.json()),
      fetch("/api/scores").then((r) => r.json()),
    ]).then(([entries, scores]) => {
      setTournamentName(scores.tournament || "");
      const golferMap = new Map<string, GolferScore>();
      (scores.golfers || []).forEach((g: GolferScore) => {
        golferMap.set(g.name.toLowerCase(), g);
      });

      const ranked: RankedEntry[] = entries.map((entry: Entry) => {
        const golferScores: { tier: number; name: string; score: string }[] = [];
        let totalScore = 0;

        for (let i = 1; i <= 6; i++) {
          const pickName = entry.picks[`tier${i}`];
          const found = golferMap.get(pickName?.toLowerCase());
          const score = found?.totalScore || "-";
          golferScores.push({ tier: i, name: pickName, score });
          totalScore += parseScore(score);
        }

        return { ...entry, totalScore, golferScores };
      });

      ranked.sort((a, b) => a.totalScore - b.totalScore);
      setRanked(ranked);
      setLastUpdated(new Date());
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-green-200 text-center p-8">Loading leaderboard...</p>;

  if (ranked.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-green-200">No entries yet. The pool leaderboard will appear once picks are submitted.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4 mt-2">
        <div>
          <h2 className="text-2xl font-bold text-[#FFD700]">Pool Leaderboard</h2>
          <p className="text-green-200 text-sm">{tournamentName} &bull; {ranked.length} entries</p>
        </div>
        <div className="text-right">
          <button onClick={fetchData} className="text-[#FFD700] text-sm underline hover:text-yellow-300">Refresh</button>
          {lastUpdated && <p className="text-green-300 text-xs mt-1">Updated {lastUpdated.toLocaleTimeString()}</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#004d35] text-[#FFD700]">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Team</th>
              <th className="p-3 text-center font-bold">Total</th>
              <th className="p-3 text-left">T1</th>
              <th className="p-3 text-left">T2</th>
              <th className="p-3 text-left">T3</th>
              <th className="p-3 text-left">T4</th>
              <th className="p-3 text-left">T5</th>
              <th className="p-3 text-left">T6</th>
              <th className="p-3 text-center">TB</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((entry, i) => (
              <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="p-3 font-bold text-gray-700">{i + 1}</td>
                <td className="p-3">
                  <div className="font-semibold text-gray-900">{entry.teamName}</div>
                  <div className="text-xs text-gray-400">{entry.name}</div>
                </td>
                <td className="p-3 text-center font-mono font-bold text-lg text-gray-900">
                  {entry.totalScore === 0 ? "E" : entry.totalScore > 0 ? `+${entry.totalScore}` : entry.totalScore}
                </td>
                {entry.golferScores.map((gs) => (
                  <td key={gs.tier} className="p-3">
                    <div className="text-gray-900 text-xs font-medium truncate max-w-[100px]">{gs.name}</div>
                    <div className="text-gray-500 text-xs font-mono">{gs.score}</div>
                  </td>
                ))}
                <td className="p-3 text-center text-gray-500 font-mono">{entry.tiebreaker}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <AuthGuard>
      {() => <LeaderboardContent />}
    </AuthGuard>
  );
}
