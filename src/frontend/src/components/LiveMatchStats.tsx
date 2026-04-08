import { Activity } from "lucide-react";
import type { MatchStats } from "../backend.d";
import { MatchStatus } from "../backend.d";
import { useCurrentMatches } from "../hooks/useQueries";

const FALLBACK_MATCHES: MatchStats[] = [
  {
    status: MatchStatus.live,
    player: "R. Apex",
    opponent: "K. Novak",
    score: "6-4, 3-2",
    setScores: ["6-4", "3-2"],
  },
  {
    status: MatchStatus.completed,
    player: "M. Santos",
    opponent: "A. Williams",
    score: "7-5, 6-3",
    setScores: ["7-5", "6-3"],
  },
];

function MatchCard({ match }: { match: MatchStats }) {
  const isLive = match.status === MatchStatus.live;

  return (
    <div
      className="rounded-xl p-5 transition-all duration-300"
      style={{
        background: "rgba(18,24,38,0.8)",
        border: isLive
          ? "1px solid rgba(0,245,255,0.3)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: isLive ? "0 0 20px rgba(0,245,255,0.08)" : "none",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isLive ? (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-red-400">
                Live
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-gray-600" />
              <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
                Completed
              </span>
            </>
          )}
        </div>
        <span className="text-xs text-gray-600 uppercase tracking-wider">
          Match
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 text-right">
          <div className="font-display font-black text-white text-sm tracking-wider">
            {match.player}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className="font-display font-black text-xl px-3 py-1 rounded-lg"
            style={{
              color: isLive ? "#00F5FF" : "#9AA3B2",
              background: isLive
                ? "rgba(0,245,255,0.08)"
                : "rgba(255,255,255,0.04)",
              textShadow: isLive ? "0 0 10px #00F5FF" : "none",
            }}
          >
            {match.score}
          </div>
          <div className="flex gap-1 mt-1">
            {match.setScores.map((s, i) => (
              <span
                key={`set-${match.player}-${i}`}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#9AA3B2",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 text-left">
          <div className="font-display font-black text-white text-sm tracking-wider">
            {match.opponent}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LiveMatchStats() {
  const { data: matches = [], isLoading } = useCurrentMatches();
  const displayMatches = matches.length > 0 ? matches : FALLBACK_MATCHES;

  const loadingKeys = ["lm-a", "lm-b"];

  return (
    <div
      className="rounded-2xl p-6"
      data-ocid="live_stats.panel"
      style={{
        background: "rgba(10,13,20,0.9)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <Activity size={20} style={{ color: "#FF007F" }} />
        <h3 className="font-display font-black text-lg uppercase tracking-wider">
          Live Match Stats
        </h3>
        <div
          className="ml-auto text-xs px-2 py-1 rounded-full"
          style={{
            background: "rgba(255,0,127,0.1)",
            color: "#FF007F",
            border: "1px solid rgba(255,0,127,0.3)",
          }}
        >
          {displayMatches.filter((m) => m.status === MatchStatus.live).length}{" "}
          Live
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {loadingKeys.map((k) => (
            <div
              key={k}
              className="h-24 rounded-xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
              data-ocid="live_stats.loading_state"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {displayMatches.map((match, idx) => (
            <MatchCard key={`match-${match.player}-${idx}`} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
