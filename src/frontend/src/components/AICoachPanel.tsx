import { Bot, ChevronDown, ChevronUp, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";
import type { Tip } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useTips } from "../hooks/useQueries";

export function AICoachPanel() {
  const { data: tips = [], isLoading } = useTips();
  const [expandedId, setExpandedId] = useState<bigint | null>(null);
  const [randomTip, setRandomTip] = useState<Tip | null>(null);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const { actor } = useActor();

  const handleRandomTip = async () => {
    if (!actor) return;
    setLoadingRandom(true);
    try {
      const tip = await actor.getRandomTip();
      setRandomTip(tip);
    } catch {
      // ignore
    } finally {
      setLoadingRandom(false);
    }
  };

  const LOADING_KEYS = ["sk-a", "sk-b", "sk-c"];

  const displayTips: Tip[] =
    tips.length > 0
      ? tips
      : [
          {
            id: 1n,
            question: "How do I improve my serve speed?",
            answer:
              "Focus on the kinetic chain — legs drive the power through hips, core, shoulder, arm, and wrist snap. Practice explosive leg drive and a full trophy pose before contact.",
          },
          {
            id: 2n,
            question: "What's the best footwork drill for clay courts?",
            answer:
              "The split-step is crucial. Time it to land just as your opponent strikes the ball. Practice lateral shuffles with resistance bands and spider drills to build reactive quickness.",
          },
          {
            id: 3n,
            question: "How should I approach a tiebreak mentally?",
            answer:
              "Treat every tiebreak point as a mini-game. Win the first point, stay with your patterns, and embrace the pressure as energy. Breathe between points and have a clear tactical plan.",
          },
          {
            id: 4n,
            question: "When should I come to the net?",
            answer:
              "Approach on short balls that land inside the service line, after a deep forcing shot, or on your opponent's weaker side. Commit fully — hesitation leads to passed shots.",
          },
        ];

  return (
    <div
      className="rounded-2xl p-6 md:p-8"
      data-ocid="ai_coach.panel"
      style={{
        background: "rgba(10,13,20,0.9)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0,245,255,0.2)",
        boxShadow: "0 0 40px rgba(0,245,255,0.05), 0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00F5FF, #9D00FF)" }}
          >
            <Bot size={18} className="text-black" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg uppercase tracking-wider text-white">
              AI COACH PANEL
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Performance Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 uppercase tracking-wider">
            Online
          </span>
        </div>
      </div>

      {/* Random tip highlight */}
      {randomTip && (
        <div
          className="mb-6 p-4 rounded-xl"
          style={{
            background: "rgba(0,245,255,0.05)",
            border: "1px solid rgba(0,245,255,0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} style={{ color: "#00F5FF" }} />
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: "#00F5FF" }}
            >
              Random Tip
            </span>
          </div>
          <p className="text-sm font-medium text-white mb-1">
            {randomTip.question}
          </p>
          <p className="text-sm text-gray-400">{randomTip.answer}</p>
        </div>
      )}

      {/* Q&A list */}
      <div className="space-y-3 mb-6">
        {isLoading
          ? LOADING_KEYS.map((k) => (
              <div
                key={k}
                className="h-12 rounded-lg animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            ))
          : displayTips.slice(0, 6).map((tip, idx) => (
              <div
                key={String(tip.id)}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background:
                    expandedId === tip.id
                      ? "rgba(0,245,255,0.05)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    expandedId === tip.id
                      ? "1px solid rgba(0,245,255,0.3)"
                      : "1px solid rgba(255,255,255,0.08)",
                }}
                data-ocid={`ai_coach.item.${idx + 1}`}
              >
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                  onClick={() =>
                    setExpandedId(expandedId === tip.id ? null : tip.id)
                  }
                  style={{ cursor: "none" }}
                >
                  <span className="text-sm font-medium text-gray-200 flex-1">
                    {tip.question}
                  </span>
                  {expandedId === tip.id ? (
                    <ChevronUp
                      size={16}
                      style={{ color: "#00F5FF", flexShrink: 0 }}
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="text-gray-500"
                      style={{ flexShrink: 0 }}
                    />
                  )}
                </button>
                {expandedId === tip.id && (
                  <div
                    className="px-4 pb-4"
                    style={{
                      animation: "slide-up 0.3s ease",
                    }}
                  >
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {tip.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* Random tip button */}
      <button
        type="button"
        onClick={handleRandomTip}
        disabled={loadingRandom}
        data-ocid="ai_coach.primary_button"
        className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300"
        style={{
          background: loadingRandom
            ? "rgba(0,245,255,0.1)"
            : "linear-gradient(135deg, #00F5FF, #9D00FF)",
          color: loadingRandom ? "#00F5FF" : "#050505",
          cursor: "none",
          border: loadingRandom ? "1px solid #00F5FF" : "none",
        }}
      >
        <RefreshCw size={16} className={loadingRandom ? "animate-spin" : ""} />
        {loadingRandom ? "Thinking..." : "Get Random Tip"}
      </button>
    </div>
  );
}
