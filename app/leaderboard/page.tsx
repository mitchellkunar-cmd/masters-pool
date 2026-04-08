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
  totalStrokes: number;
  rounds: number[];
  roundsPlayed: number;
  didNotFinish: boolean;
  status: string;
}

interface GolferPick {
  tier: number;
  name: string;
  totalStrokes: number;
  displayScore: string;
  didNotFinish: boolean;
  countsToward: boolean;
}

interface RankedEntry extends Entry {
  teamScore: number;
  golferPicks: GolferPick[];
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
        // Get all 6 golfer scores
        const allPicks: GolferPick[] = [];
        for (let i = 1; i <= 6; i++) {
          const pickName = entry.picks[`tier${i}`];
          const found = golferMap.get(pickName?.toLowerCase());

          if (found) {
            allPicks.push({
              tier: i,
              name: pickName,
              totalStrokes: found.totalStrokes,
              displayScore: found.didNotFinish
                ? `${found.totalStrokes} (${found.status})`
                : found.totalScore || `${found.totalStrokes}`,
              didNotFinish: found.didNotFinish,
              countsToward: false,
            });
          } else {
            // Golfer not found in tournament data yet
            allPicks.push({
              tier: i,
              name: pickName,
              totalStrokes: 0,
              displayScore: "-",
              didNotFinish: false,
              countsToward: false,
            });
          }
        }

        // Best 4 of 6: sort by strokes ascending, take best 4
        const sorted = [...allPicks].sort((a, b) => a.totalStrokes - b.totalStrokes);
        const best4Names = new Set(sorted.slice(0, 4).map((p) => `${p.tier}`));
        allPicks.forEach((p) => {
          p.countsToward = best4Names.has(`${p.tier}`);
        });

        const teamScore = sorted.slice(0, 4).reduce((sum, p) => sum + p.totalStrokes, 0);

        return { ...entry, teamScore, golferPicks: allPicks };
      });

      ranked.sort((a, b) => a.teamScore - b.teamScore);
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
        <p className="text-green-200">No entries yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-2 mt-2">
        <div>
          <h2 className="text-2xl font-bold text-[#FFD700]">Pool Leaderboard</h2>
          <p className="text-green-200 text-sm">{tournamentName} &bull; {ranked.length} entries</p>
        </div>
        <div className="text-right">
          <button onClick={fetchData} className="text-[#FFD700] text-sm underline hover:text-yellow-300">Refresh</button>
          {lastUpdated && <p className="text-green-300 text-xs mt-1">Updated {lastUpdated.toLocaleTimeString()}</p>}
        </div>
      </div>

      {/* Rules */}
      <div className="bg-[#004d35] rounded-lg px-4 py-2 mb-4 text-green-200 text-xs">
        Best 4 of 6 golfers count &bull; Cut/WD/DQ = 80 per unfinished round &bull; Lowest total strokes wins &bull; Playoff holes do not count
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#004d35] text-[#FFD700]">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Team</th>
              <th className="p-3 text-center font-bold">Score</th>
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
                  {entry.teamScore === 0 ? "-" : entry.teamScore}
                </td>
                {entry.golferPicks.map((gp) => (
                  <td key={gp.tier} className="p-3">
                    <div className={`text-xs font-medium truncate max-w-[100px] ${
                      gp.countsToward ? "text-gray-900" : "text-gray-400 line-through"
                    }`}>
                      {gp.name}
                    </div>
                    <div className={`text-xs font-mono ${
                      gp.didNotFinish
                        ? "text-red-500"
                        : gp.countsToward
                        ? "text-gray-700 font-semibold"
                        : "text-gray-400"
                    }`}>
                      {gp.totalStrokes}
                    </div>
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
