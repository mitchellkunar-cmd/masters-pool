import { NextResponse } from "next/server";

const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard";

export async function GET() {
  try {
    const res = await fetch(ESPN_URL, { next: { revalidate: 60 } });
    const data = await res.json();

    const event =
      data.events?.find(
        (e: { name: string }) =>
          e.name?.toLowerCase().includes("masters") ||
          e.name?.toLowerCase().includes("augusta")
      ) || data.events?.[0];

    if (!event) {
      return NextResponse.json({
        tournament: "No active tournament",
        golfers: [],
        status: "Unknown",
        round: 0,
      });
    }

    const competition = event.competitions?.[0];
    const golfers = (competition?.competitors || []).map(
      (c: {
        athlete: { displayName: string };
        status: { position: { displayName: string }; thru: number; type?: { description?: string } };
        score: { displayValue: string };
        linescores: { value: number }[];
        statistics: { name: string; displayValue: string }[];
      }) => {
        const rounds = (c.linescores || []).map((l: { value: number }) => l.value);
        const statusDesc = c.status?.type?.description || "";
        const isCut = statusDesc.toLowerCase().includes("cut");
        const isWD = statusDesc.toLowerCase().includes("wd") || statusDesc.toLowerCase().includes("withdraw");
        const isDQ = statusDesc.toLowerCase().includes("dq") || statusDesc.toLowerCase().includes("disqualif");
        const didNotFinish = isCut || isWD || isDQ;

        // Calculate total strokes
        const roundsPlayed = rounds.filter((r: number) => r > 0);
        let totalStrokes: number;
        if (roundsPlayed.length === 0) {
          // Tournament hasn't started for this golfer
          totalStrokes = 0;
        } else if (didNotFinish) {
          // Cut/WD/DQ: actual strokes + 80 per missing round
          totalStrokes = roundsPlayed.reduce((sum: number, r: number) => sum + r, 0) +
            (4 - roundsPlayed.length) * 80;
        } else {
          // Active or finished: just sum actual strokes
          totalStrokes = roundsPlayed.reduce((sum: number, r: number) => sum + r, 0);
        }

        return {
          name: c.athlete?.displayName,
          position: c.status?.position?.displayName || "-",
          totalScore: c.score?.displayValue || "-",
          totalStrokes,
          rounds,
          roundsPlayed: roundsPlayed.length,
          thru: c.status?.thru || 0,
          today:
            c.statistics?.find(
              (s: { name: string }) => s.name === "currentRoundScore"
            )?.displayValue || "-",
          status: statusDesc,
          didNotFinish,
        };
      }
    );

    return NextResponse.json({
      tournament: event.name,
      golfers,
      status: event.status?.type?.description || "Unknown",
      round: event.status?.period || 0,
    });
  } catch (error) {
    console.error("ESPN API error:", error);
    return NextResponse.json({ tournament: "Error", golfers: [], status: "Error", round: 0 }, { status: 500 });
  }
}
