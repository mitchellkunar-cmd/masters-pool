import { NextResponse } from "next/server";

// ESPN API for Masters Tournament live scores
const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard";

export async function GET() {
  try {
    const res = await fetch(ESPN_URL, { next: { revalidate: 60 } });
    const data = await res.json();

    // Find the Masters event
    const event = data.events?.find(
      (e: { name: string }) =>
        e.name?.toLowerCase().includes("masters") ||
        e.name?.toLowerCase().includes("augusta")
    );

    if (!event) {
      // Return empty if Masters isn't the current tournament
      return NextResponse.json({
        tournament: data.events?.[0]?.name || "No active tournament",
        golfers: [],
        status: data.events?.[0]?.status?.type?.description || "Unknown",
        round: data.events?.[0]?.status?.period || 0,
      });
    }

    const competition = event.competitions?.[0];
    const golfers = (competition?.competitors || []).map(
      (c: {
        athlete: { displayName: string };
        status: { position: { displayName: string }; thru: number };
        score: { displayValue: string };
        linescores: { value: number }[];
        statistics: { name: string; displayValue: string }[];
      }) => ({
        name: c.athlete?.displayName,
        position: c.status?.position?.displayName || "-",
        totalScore: c.score?.displayValue || "-",
        thru: c.status?.thru || 0,
        rounds: (c.linescores || []).map(
          (l: { value: number }) => l.value
        ),
        today:
          c.statistics?.find(
            (s: { name: string }) => s.name === "currentRoundScore"
          )?.displayValue || "-",
      })
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
