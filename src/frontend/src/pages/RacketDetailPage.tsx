import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import type { Racket } from "../backend.d";
import { RacketDetail3D } from "../components/RacketHighlight3D";
import { useTheme } from "../context/ThemeContext";
import { useCountUp } from "../hooks/useCountUp";
import { useRacket } from "../hooks/useQueries";

const FALLBACK_RACKET: Racket = {
  id: 1n,
  name: "APEX PRO X1",
  category: "Performance",
  price: 289,
  power: 92n,
  weight: 300,
  balance: "Head Heavy",
  inStock: true,
  description:
    "Our flagship performance frame. Built for aggressive baseliners who demand maximum power transfer. Aerospace-grade carbon fiber layup with enhanced sweet spot geometry. The PRO X1 features our revolutionary StringWeb technology that distributes tension evenly across the entire string bed, resulting in unmatched consistency from any position on the court.",
};

function SpecBar({
  label,
  value,
  max = 100,
  color,
}: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  const { count, ref } = useCountUp(pct);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <span className="text-sm font-black" style={{ color }}>
          {value}
          {max === 100 ? "/100" : "g"}
        </span>
      </div>
      <div
        className="h-2 rounded-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-2 rounded-full transition-all duration-1000"
          style={{
            width: `${count}%`,
            background: `linear-gradient(90deg, ${color}, ${color}60)`,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>
    </div>
  );
}

export default function RacketDetailPage() {
  const { id } = useParams({ strict: false });
  const { data: racket, isLoading } = useRacket(BigInt(id || "1"));
  const { accentColor } = useTheme();
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">(
    "idle",
  );

  const display = racket || FALLBACK_RACKET;

  const CATEGORY_COLORS: Record<string, string> = {
    Performance: "#00F5FF",
    Speed: "#9D00FF",
    Control: "#FF007F",
    "All-Court": "#3A7BFF",
    Power: "#39FF14",
    Pro: "#FFD700",
  };
  const color = CATEGORY_COLORS[display.category] || accentColor;

  const handleAddToCart = () => {
    setCartState("adding");
    setTimeout(() => setCartState("added"), 600);
    setTimeout(() => setCartState("idle"), 2600);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050505" }}
      >
        <div className="text-center" data-ocid="racket_detail.loading_state">
          <div
            className="w-16 h-16 rounded-full border-2 border-t-transparent mx-auto animate-spin mb-4"
            style={{
              borderColor: `${accentColor} transparent transparent transparent`,
            }}
          />
          <p className="text-gray-600 text-sm uppercase tracking-widest">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main style={{ background: "#050505" }} className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          to="/rackets"
          data-ocid="racket_detail.link"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          All Rackets
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: 3D model */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${color}08, rgba(10,13,20,0.9))`,
              border: `1px solid ${color}20`,
            }}
          >
            <RacketDetail3D accentColor={color} />
          </div>

          {/* Right: Info */}
          <div>
            <div
              className="text-xs px-3 py-1 rounded-full inline-block mb-4 font-black uppercase tracking-wider"
              style={{
                background: `${color}15`,
                color,
                border: `1px solid ${color}30`,
              }}
            >
              {display.category}
            </div>
            <h1
              className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white mb-2"
              style={{ textShadow: `0 0 20px ${color}30` }}
            >
              {display.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  style={{
                    color: "#FFD700",
                    fill: s <= 4 ? "#FFD700" : "transparent",
                  }}
                />
              ))}
              <span className="text-xs text-gray-500 ml-2">
                4.8 (124 reviews)
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed mb-8">
              {display.description}
            </p>

            {/* Price */}
            <div
              className="text-5xl font-display font-black mb-8"
              style={{ color, textShadow: `0 0 15px ${color}40` }}
            >
              ${display.price}
            </div>

            {/* Spec bars */}
            <div
              className="p-6 rounded-2xl mb-8"
              style={{
                background: "rgba(18,24,38,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-5">
                Specifications
              </h3>
              <SpecBar
                label="Power Rating"
                value={Number(display.power)}
                color={color}
              />
              <SpecBar
                label="Weight"
                value={display.weight}
                max={400}
                color="#9D00FF"
              />
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm uppercase tracking-widest text-gray-400">
                    Balance
                  </span>
                  <span
                    className="text-sm font-black"
                    style={{ color: "#FF007F" }}
                  >
                    {display.balance}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm uppercase tracking-widest text-gray-400">
                    Availability
                  </span>
                  <span
                    className="text-sm font-black"
                    style={{ color: display.inStock ? "#39FF14" : "#FF4444" }}
                  >
                    {display.inStock ? "In Stock" : "Sold Out"}
                  </span>
                </div>
              </div>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!display.inStock || cartState !== "idle"}
              data-ocid="racket_detail.primary_button"
              className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-500"
              style={{
                background:
                  cartState === "added"
                    ? "linear-gradient(135deg, #39FF14, #00CC00)"
                    : !display.inStock
                      ? "rgba(255,255,255,0.05)"
                      : `linear-gradient(135deg, ${color}, #9D00FF)`,
                color: !display.inStock ? "#9AA3B2" : "#050505",
                cursor: display.inStock ? "none" : "not-allowed",
                boxShadow:
                  cartState === "added"
                    ? "0 0 20px rgba(57,255,20,0.4)"
                    : display.inStock
                      ? `0 0 20px ${color}30`
                      : "none",
                transform: cartState === "adding" ? "scale(0.97)" : "scale(1)",
              }}
            >
              {cartState === "added" ? (
                <>
                  <Check size={18} /> Added to Cart!
                </>
              ) : cartState === "adding" ? (
                <span className="animate-pulse">Processing...</span>
              ) : display.inStock ? (
                <>
                  <ShoppingCart size={18} /> Add to Cart
                </>
              ) : (
                "Out of Stock"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
