"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import { tiers, tiebreakerScores } from "@/lib/golfers";

function PicksForm({ username }: { username: string }) {
  const router = useRouter();
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [tiebreaker, setTiebreaker] = useState("");
  const [teamName, setTeamName] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePick = (tier: number, golferName: string) => {
    setPicks((prev) => ({ ...prev, [`tier${tier}`]: golferName }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    for (let i = 1; i <= 6; i++) {
      if (!picks[`tier${i}`]) { setError(`Please make a selection for Tier ${i}.`); return; }
    }
    if (!tiebreaker) { setError("Please select a tiebreaker score."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, name, picks, tiebreaker }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); setSubmitting(false); return; }
      router.push("/my-entries");
    } catch {
      setError("Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 pb-12 space-y-6">
      <p className="text-green-200 text-center text-sm mt-2">
        Logged in as <strong className="text-white">{username}</strong> &mdash; Pick one golfer per tier
      </p>
      <div className="bg-[#004d35] rounded-lg px-4 py-3 text-green-200 text-sm space-y-1">
        <p className="text-[#FFD700] font-semibold">How It Works</p>
        <p>Pick 6 golfers (one per tier). Your best 4 of 6 scores count toward your team total.</p>
        <p>Cut/WD/DQ golfers get 80 for each unfinished round. Lowest total strokes wins. Playoff holes do not count.</p>
        <p className="text-[#FFD700] font-semibold mt-2">$20 Per Entry</p>
        <p>Venmo: <strong className="text-white">mitch_kunar15</strong> &bull; Zelle: <strong className="text-white">7407558221</strong></p>
        <p className="text-[#FFD700] font-semibold mt-2">Deadline: 7:00 AM ET, Thursday April 9</p>
      </div>

      {tiers.map((tier) => (
        <div key={tier.tier} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#004d35] px-5 py-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#FFD700]">({tier.tier}) {tier.label}</h2>
            <span className="text-green-200 text-sm">Pick {tier.pick}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {tier.golfers.map((golfer) => {
              const isSelected = picks[`tier${tier.tier}`] === golfer.name;
              return (
                <label
                  key={golfer.name}
                  className={`flex items-center px-5 py-3 cursor-pointer transition-colors ${
                    isSelected ? "bg-[#006747] text-white" : "hover:bg-green-50"
                  }`}
                >
                  <input type="radio" name={`tier${tier.tier}`} value={golfer.name} checked={isSelected}
                    onChange={() => handlePick(tier.tier, golfer.name)} className="sr-only" />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${
                    isSelected ? "border-[#FFD700] bg-[#FFD700]" : "border-gray-300"
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#006747]" />}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className={`font-semibold ${isSelected ? "text-white" : "text-gray-900"}`}>{golfer.name}</span>
                      <span className={`ml-2 text-xs ${isSelected ? "text-green-200" : "text-gray-400"}`}>WR {golfer.worldRanking}</span>
                    </div>
                    <span className={`text-sm font-mono font-semibold ${isSelected ? "text-[#FFD700]" : "text-gray-500"}`}>{golfer.odds}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Tiebreaker */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#004d35] px-5 py-3">
          <h2 className="text-lg font-bold text-[#FFD700]">Tiebreaker</h2>
          <p className="text-green-200 text-sm">What will the winning golfer&apos;s score be at the end of the tournament, not including playoff holes?</p>
        </div>
        <div className="p-5">
          <select value={tiebreaker} onChange={(e) => setTiebreaker(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-[#006747] focus:outline-none">
            <option value="">Select a score...</option>
            {tiebreakerScores.map((score) => <option key={score} value={score}>{score}</option>)}
          </select>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#004d35] px-5 py-3">
          <h2 className="text-lg font-bold text-[#FFD700]">Your Info</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Team Name</label>
            <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-[#006747] focus:outline-none" placeholder="e.g. Birdie Brigade" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-[#006747] focus:outline-none" />
          </div>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <button type="submit" disabled={submitting}
        className="w-full bg-[#FFD700] text-[#004d35] font-bold py-4 rounded-xl text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-lg">
        {submitting ? "Submitting..." : "Submit Entry"}
      </button>
    </form>
  );
}

export default function PicksPage() {
  return (
    <AuthGuard>
      {(username) => <PicksForm username={username} />}
    </AuthGuard>
  );
}
