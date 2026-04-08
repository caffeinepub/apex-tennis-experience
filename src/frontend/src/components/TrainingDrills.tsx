import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";
import type { TrainingDrill } from "../backend.d";
import { DrillDifficulty } from "../backend.d";
import { useTrainingDrills } from "../hooks/useQueries";

const FALLBACK_DRILLS: TrainingDrill[] = [
  {
    id: 1n,
    name: "Cross-Court Groundstroke Rally",
    category: "Groundstrokes",
    difficulty: DrillDifficulty.beginner,
    duration: 20n,
    description:
      "Stand at the baseline and rally cross-court with your partner. Focus on consistent depth and proper swing mechanics. Alternate forehand and backhand sides every 5 minutes.",
  },
  {
    id: 2n,
    name: "Serve & Volley Attack",
    category: "Net Play",
    difficulty: DrillDifficulty.intermediate,
    duration: 15n,
    description:
      "Serve down the T, immediately charge the net, and put away the volley. Your partner feeds soft returns to simulate real match pressure. Mix slice and flat serves.",
  },
  {
    id: 3n,
    name: "Spider Drill Footwork Circuit",
    category: "Footwork",
    difficulty: DrillDifficulty.advanced,
    duration: 10n,
    description:
      "Place 6 balls at each corner and center of the service box. Retrieve each ball to the center cone and return. Record your best time and aim to beat it each session.",
  },
  {
    id: 4n,
    name: "Topspin Lob Defense",
    category: "Defense",
    difficulty: DrillDifficulty.intermediate,
    duration: 12n,
    description:
      "Your partner rushes the net. Hit a high topspin lob to land just inside the baseline. Focus on disguise — disguise the shot as a passing attempt before lifting.",
  },
  {
    id: 5n,
    name: "Second Serve Pressure Drill",
    category: "Serve",
    difficulty: DrillDifficulty.beginner,
    duration: 25n,
    description:
      "Hit 50 consecutive second serves into each service box. Track the percentage of balls landing in the target zone. Aim for 80%+ consistency before advancing.",
  },
  {
    id: 6n,
    name: "Drop Shot & Recovery",
    category: "Tactics",
    difficulty: DrillDifficulty.advanced,
    duration: 15n,
    description:
      "Hit a drop shot, sprint to the net, then recover to baseline for a passing shot. Simulates the modern game's extreme court coverage demands.",
  },
];

const DIFFICULTY_COLORS = {
  [DrillDifficulty.beginner]: {
    color: "#39FF14",
    bg: "rgba(57,255,20,0.1)",
    label: "Beginner",
  },
  [DrillDifficulty.intermediate]: {
    color: "#FFD700",
    bg: "rgba(255,215,0,0.1)",
    label: "Intermediate",
  },
  [DrillDifficulty.advanced]: {
    color: "#FF007F",
    bg: "rgba(255,0,127,0.1)",
    label: "Advanced",
  },
};

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced"];
const LOADING_KEYS = ["dl-a", "dl-b", "dl-c", "dl-d"];

export function TrainingDrills() {
  const { data: drills = [], isLoading } = useTrainingDrills();
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<bigint | null>(null);

  const displayDrills = drills.length > 0 ? drills : FALLBACK_DRILLS;

  const filtered = displayDrills.filter((d) => {
    if (filter === "All") return true;
    const diff = DIFFICULTY_COLORS[d.difficulty];
    return diff?.label === filter;
  });

  return (
    <div data-ocid="training.section">
      <div className="flex flex-wrap gap-2 mb-6" data-ocid="training.tab">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            data-ocid="training.tab"
            className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200"
            style={{
              background:
                filter === f
                  ? "linear-gradient(135deg, #00F5FF, #9D00FF)"
                  : "rgba(255,255,255,0.05)",
              color: filter === f ? "#050505" : "#9AA3B2",
              border: filter === f ? "none" : "1px solid rgba(255,255,255,0.1)",
              cursor: "none",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LOADING_KEYS.map((k) => (
            <div
              key={k}
              className="h-24 rounded-xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
              data-ocid="training.loading_state"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-10 text-gray-600"
          data-ocid="training.empty_state"
        >
          No drills found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((drill, idx) => {
            const diff = DIFFICULTY_COLORS[drill.difficulty];
            const isExpanded = expanded === drill.id;
            return (
              <div
                key={String(drill.id)}
                className="rounded-xl transition-all duration-300"
                data-ocid={`training.item.${idx + 1}`}
                style={{
                  background: isExpanded
                    ? "rgba(18,24,38,0.9)"
                    : "rgba(18,24,38,0.6)",
                  border: isExpanded
                    ? `1px solid ${diff?.color}50`
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isExpanded ? `0 0 20px ${diff?.color}15` : "none",
                }}
              >
                <button
                  type="button"
                  className="w-full text-left p-5"
                  onClick={() => setExpanded(isExpanded ? null : drill.id)}
                  style={{ cursor: "none" }}
                  data-ocid={`training.toggle.${idx + 1}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wide"
                          style={{
                            background: "rgba(58,123,255,0.15)",
                            color: "#3A7BFF",
                          }}
                        >
                          {drill.category}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-black uppercase tracking-wide"
                          style={{ background: diff?.bg, color: diff?.color }}
                        >
                          {diff?.label}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-white text-sm">
                        {drill.name}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={11} />
                        <span>{Number(drill.duration)}min</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} style={{ color: diff?.color }} />
                      ) : (
                        <ChevronDown size={16} className="text-gray-600" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div
                    className="px-5 pb-5"
                    style={{ animation: "slide-up 0.3s ease" }}
                  >
                    <div
                      className="h-px mb-4"
                      style={{ background: `${diff?.color}30` }}
                    />
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {drill.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
