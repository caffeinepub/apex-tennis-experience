import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { Racket } from "../backend.d";
import { useTheme } from "../context/ThemeContext";
import { useRackets } from "../hooks/useQueries";
import { useScrollReveal } from "../hooks/useScrollReveal";

const FALLBACK_RACKETS: Racket[] = [
  {
    id: 1n,
    name: "APEX PRO X1",
    category: "Performance",
    price: 289,
    power: 92n,
    weight: 300,
    balance: "Head Heavy",
    inStock: true,
    description:
      "Our flagship performance frame. Built for aggressive baseliners who demand maximum power transfer. Aerospace-grade carbon fiber layup with enhanced sweet spot geometry.",
  },
  {
    id: 2n,
    name: "APEX SPEED 100",
    category: "Speed",
    price: 249,
    power: 85n,
    weight: 280,
    balance: "Head Light",
    inStock: true,
    description:
      "Lightning-fast maneuverability designed for serve-and-volley specialists. Lightweight frame with reinforced throat construction for exceptional control at the net.",
  },
  {
    id: 3n,
    name: "APEX CONTROL S",
    category: "Control",
    price: 269,
    power: 78n,
    weight: 310,
    balance: "Even Balance",
    inStock: true,
    description:
      "The surgeons choice. Precise string bed response with enhanced dampening for players who prioritize placement over raw power. Favored by clay court specialists.",
  },
  {
    id: 4n,
    name: "APEX BLADE 98",
    category: "All-Court",
    price: 319,
    power: 88n,
    weight: 295,
    balance: "Head Light",
    inStock: true,
    description:
      "Versatility redefined. The BLADE 98 performs across all surfaces with consistent feel and adaptable power. Ideal for the complete player.",
  },
  {
    id: 5n,
    name: "APEX ULTRA 105",
    category: "Power",
    price: 239,
    power: 96n,
    weight: 285,
    balance: "Head Heavy",
    inStock: true,
    description:
      "Maximum power for players seeking an extra level of force behind every shot. Oversized head with power-boosting geometry.",
  },
  {
    id: 6n,
    name: "APEX TOUR 90",
    category: "Pro",
    price: 349,
    power: 82n,
    weight: 315,
    balance: "Head Light",
    inStock: false,
    description:
      "The pro player's tool. Compact head size for exceptional feel and precision. Used by our APEX ambassadors on the ATP Tour.",
  },
];

function RacketCard({ racket, index }: { racket: Racket; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { accentColor } = useTheme();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 15;
    setTilt({ x, y });
  }, []);

  const CATEGORY_COLORS: Record<string, string> = {
    Performance: "#00F5FF",
    Speed: "#9D00FF",
    Control: "#FF007F",
    "All-Court": "#3A7BFF",
    Power: "#39FF14",
    Pro: "#FFD700",
  };
  const color = CATEGORY_COLORS[racket.category] || accentColor;

  return (
    <Link
      to="/rackets/$id"
      params={{ id: String(racket.id) }}
      data-ocid={`rackets.item.${index + 1}`}
    >
      <div
        ref={cardRef}
        className="rounded-2xl overflow-hidden transition-all duration-200"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setTilt({ x: 0, y: 0 });
        }}
        style={{
          background: "rgba(18,24,38,0.8)",
          border: hovered
            ? `1px solid ${color}60`
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: hovered
            ? `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${color}20`
            : "0 4px 20px rgba(0,0,0,0.3)",
          transform: hovered
            ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)`
            : "translateY(0)",
          transformOrigin: "center center",
          transition: hovered
            ? "transform 0.1s ease, box-shadow 0.3s, border-color 0.3s"
            : "all 0.4s ease",
          animation: `float ${3 + (index % 3) * 0.7}s ease-in-out ${index * 0.2}s infinite`,
        }}
      >
        {/* Image area */}
        <div
          className="relative h-52 flex items-center justify-center"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${color}10, rgba(10,13,20,0.9))`,
          }}
        >
          <img
            src="/assets/generated/racket-apex-pro.dim_400x400.png"
            alt={racket.name}
            className="w-36 h-36 object-contain transition-transform duration-500"
            style={{
              filter: `hue-rotate(${index * 40}deg) drop-shadow(0 0 10px ${color}60)`,
              transform: hovered ? "scale(1.1) rotateY(15deg)" : "scale(1)",
            }}
          />
          {!racket.inStock && (
            <div
              className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-black uppercase tracking-wider"
              style={{
                background: "rgba(255,0,0,0.2)",
                color: "#FF4444",
                border: "1px solid rgba(255,0,0,0.3)",
              }}
            >
              Sold Out
            </div>
          )}
          <div
            className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-black uppercase tracking-wider"
            style={{
              background: `${color}15`,
              color,
              border: `1px solid ${color}30`,
            }}
          >
            {racket.category}
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-display font-black text-white uppercase tracking-wider mb-2">
            {racket.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                style={{
                  color: "#FFD700",
                  fill: s <= 4 ? "#FFD700" : "transparent",
                }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ background: "rgba(255,255,255,0.05)", color: "#9AA3B2" }}
            >
              {racket.weight}g
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ background: "rgba(255,255,255,0.05)", color: "#9AA3B2" }}
            >
              {racket.balance}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ background: `${color}10`, color }}
            >
              PWR {Number(racket.power)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className="text-2xl font-display font-black"
              style={{ color }}
            >
              ${racket.price}
            </span>
            <span
              className="text-xs font-black uppercase tracking-wide"
              style={{
                color: hovered ? color : "#9AA3B2",
                transition: "color 0.3s",
              }}
            >
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function RacketsPage() {
  useScrollReveal();
  const { accentColor } = useTheme();
  const { data: rackets = [], isLoading } = useRackets();
  const displayRackets = rackets.length > 0 ? rackets : FALLBACK_RACKETS;

  return (
    <main style={{ background: "#050505" }}>
      {/* Header */}
      <section
        className="pt-32 pb-16 text-center relative"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(157,0,255,0.07), transparent 60%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-4">
            Premium Performance Collection
          </div>
          <h1
            className="text-5xl md:text-7xl font-display font-black uppercase tracking-tight text-white mb-4"
            style={{ animation: "slide-up 0.7s ease forwards" }}
          >
            RACKET <span style={{ color: accentColor }}>SHOWCASE</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Engineered for champions. Each APEX racket is precision-tested by
            ATP professionals and refined for maximum performance.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((k) => (
                <div
                  key={k}
                  className="h-80 rounded-2xl animate-pulse"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                  data-ocid="rackets.loading_state"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayRackets.map((racket, i) => (
                <RacketCard key={String(racket.id)} racket={racket} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
