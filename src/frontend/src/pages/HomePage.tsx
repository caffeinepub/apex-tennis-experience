import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AICoachPanel } from "../components/AICoachPanel";
import { LiveMatchStats } from "../components/LiveMatchStats";
import { RacketHighlight3D } from "../components/RacketHighlight3D";
import { TrainingDrills } from "../components/TrainingDrills";
import { useTheme } from "../context/ThemeContext";
import { useCountUp } from "../hooks/useCountUp";
import { useBlogPosts, useRackets } from "../hooks/useQueries";
import { useRipple } from "../hooks/useRipple";
import { useScrollReveal } from "../hooks/useScrollReveal";

// Animated letter-by-letter headline
function AnimatedHeadline({
  text,
  delay = 0,
  color = "#F2F5FF",
}: { text: string; delay?: number; color?: string }) {
  // Convert to array of {char, key} objects with unique position keys
  const letters = Array.from(text).map((char, i) => ({ char, pos: i }));
  return (
    <span className="inline-flex flex-wrap" aria-label={text}>
      {letters.map(({ char, pos }) => (
        <span
          key={`${text}-${pos}`}
          style={{
            display: "inline-block",
            opacity: 0,
            animation: "letter-reveal 0.5s ease forwards",
            animationDelay: `${delay + pos * 40}ms`,
            color,
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// Player stat bar
function StatBar({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <span className="text-sm font-black" style={{ color }}>
          {count}
        </span>
      </div>
      <div
        className="h-1 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-1 rounded-full transition-all duration-1000"
          style={{
            width: `${count}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

// Blog card
function BlogCard({
  post,
  idx,
}: {
  post: {
    title: string;
    excerpt: string;
    author: string;
    id: string | bigint;
    imageUrl: string;
    category: string;
  };
  idx: number;
}) {
  const [hovered, setHovered] = useState(false);
  const categoryColors: Record<string, string> = {
    Training: "#00F5FF",
    Gear: "#9D00FF",
    Mindset: "#FF007F",
    Nutrition: "#39FF14",
    Tournament: "#3A7BFF",
  };
  const color = categoryColors[post.category] || "#00F5FF";

  return (
    <Link
      to="/blog/$id"
      params={{ id: String(post.id) }}
      data-ocid={`blog_preview.item.${idx + 1}`}
      className="flex-shrink-0 w-72 rounded-2xl overflow-hidden block transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(18,24,38,0.8)",
        border: hovered
          ? `1px solid ${color}50`
          : "1px solid rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${color}20`
          : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="h-44 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}30, rgba(0,0,0,0.8))`,
        }}
      >
        {post.imageUrl && !post.imageUrl.startsWith("placeholder") ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color}20, rgba(0,0,0,0.6))`,
            }}
          >
            <span className="text-5xl opacity-30">🎾</span>
          </div>
        )}
        <div
          className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-black uppercase tracking-wider"
          style={{
            background: `${color}20`,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          {post.category}
        </div>
      </div>
      <div className="p-5">
        <h4 className="font-display font-bold text-white text-sm mb-2 line-clamp-2">
          {post.title}
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">{post.author}</span>
          <span
            className="text-xs font-black uppercase tracking-wide"
            style={{ color }}
          >
            Read More →
          </span>
        </div>
      </div>
    </Link>
  );
}

const FALLBACK_BLOG_POSTS = [
  {
    id: "1",
    title: "Mastering the Modern Serve: Power, Placement & Spin",
    excerpt:
      "Unlock elite serve mechanics with biomechanics-driven drills used by Top 10 players.",
    author: "Coach Rafael",
    imageUrl: "/assets/generated/blog-training-hero.dim_800x500.jpg",
    category: "Training",
  },
  {
    id: "2",
    title: "2024's Best Performance Rackets: An Expert Deep Dive",
    excerpt:
      "We tested 12 frames over 6 months. Here's what the data reveals about racket selection.",
    author: "Gear Lab",
    imageUrl: "/assets/generated/blog-gear-hero.dim_800x500.jpg",
    category: "Gear",
  },
  {
    id: "3",
    title: "The Mental Game: How Champions Think Under Pressure",
    excerpt:
      "Sport psychologists break down what separates clutch players from those who collapse.",
    author: "Dr. A. Voss",
    imageUrl: "/assets/generated/blog-mindset-hero.dim_800x500.jpg",
    category: "Mindset",
  },
  {
    id: "4",
    title: "Tournament Prep: 30-Day Peak Performance Protocol",
    excerpt:
      "The exact nutrition, recovery, and training structure used at elite academies worldwide.",
    author: "Performance Team",
    imageUrl: "/assets/generated/blog-training-hero.dim_800x500.jpg",
    category: "Tournament",
  },
];

const FALLBACK_RACKETS = [
  {
    id: "1",
    name: "APEX PRO X1",
    category: "Performance",
    price: 289,
    power: 92,
    weight: 300,
    balance: "Head Heavy",
    inStock: true,
    description: "Elite attack frame",
  },
  {
    id: "2",
    name: "APEX SPEED 100",
    category: "Speed",
    price: 249,
    power: 85,
    weight: 280,
    balance: "Head Light",
    inStock: true,
    description: "Lightning fast handling",
  },
  {
    id: "3",
    name: "APEX CONTROL S",
    category: "Control",
    price: 269,
    power: 78,
    weight: 310,
    balance: "Even Balance",
    inStock: true,
    description: "Precision placement",
  },
];

export default function HomePage() {
  useScrollReveal();
  const ripple = useRipple();
  const { accentColor } = useTheme();
  const { data: blogPosts = [] } = useBlogPosts();
  const { data: rackets = [] } = useRackets();
  const [cardHovered, setCardHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayPosts = blogPosts.length > 0 ? blogPosts : FALLBACK_BLOG_POSTS;
  const displayRackets = rackets.length > 0 ? rackets : FALLBACK_RACKETS;

  return (
    <main className="relative" style={{ background: "#050505" }}>
      {/* ─── HERO ─── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(0,245,255,0.06) 0%, rgba(157,0,255,0.04) 40%, #050505 70%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left: text */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8"
              style={{
                background: `${accentColor}10`,
                border: `1px solid ${accentColor}30`,
                color: accentColor,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: accentColor }}
              />
              World No. 1 Performance Brand
            </div>
            <h1 className="font-display font-black uppercase leading-none mb-6">
              <div className="text-5xl md:text-7xl tracking-tight text-white">
                <AnimatedHeadline text="UNLEASH" delay={200} />
                <br />
                <AnimatedHeadline
                  text="PRECISION."
                  delay={600}
                  color={accentColor}
                />
              </div>
              <div className="text-3xl md:text-5xl mt-2 text-gray-300 tracking-tight">
                <AnimatedHeadline text="PLAY BEYOND LIMITS." delay={1200} />
              </div>
            </h1>
            <p
              className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md"
              style={{
                animation: "slide-up 0.8s ease 1.8s forwards",
                opacity: 0,
              }}
            >
              Built for those who demand more. APEX Tennis delivers elite
              performance gear, scientific training programs, and equipment
              engineered at the apex of the sport.
            </p>
            <div
              className="flex flex-wrap gap-4"
              style={{
                animation: "slide-up 0.8s ease 2.1s forwards",
                opacity: 0,
              }}
            >
              <Link
                to="/rackets"
                data-ocid="hero.primary_button"
                className="btn-neon-primary flex items-center gap-2"
                onClick={ripple}
              >
                Explore Gear <ArrowRight size={16} />
              </Link>
              <Link
                to="/blog"
                data-ocid="hero.secondary_button"
                className="btn-neon-outline flex items-center gap-2"
                onClick={ripple}
              >
                Read Blog
              </Link>
            </div>
          </div>

          {/* Right: player silhouette */}
          <div className="flex items-center justify-center">
            <div
              className="relative animate-float-slow"
              style={{
                filter: `drop-shadow(0 0 30px ${accentColor}60)`,
              }}
            >
              <img
                src="/assets/generated/tennis-player-silhouette.dim_600x800.png"
                alt="Neon Tennis Player"
                className="w-full max-w-md object-contain"
                style={{ mixBlendMode: "screen" }}
              />
              {/* Glow rings */}
              <div
                className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${accentColor}50, transparent 70%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs uppercase tracking-widest text-gray-600">
            Scroll
          </span>
          <div
            className="w-px h-8"
            style={{
              background: `linear-gradient(to bottom, ${accentColor}, transparent)`,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ─── FEATURED PLAYER ─── */}
      <section id="apex-elite" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal-hidden">
            <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
              The Best in the Game
            </div>
            <h2
              className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight"
              style={{
                color: accentColor,
                textShadow: `0 0 20px ${accentColor}40`,
              }}
            >
              THE APEX ELITE
            </h2>
          </div>

          {/* Player card */}
          <div className="max-w-2xl mx-auto reveal-hidden">
            <div
              className="rounded-2xl p-8 transition-all duration-400"
              onMouseEnter={() => setCardHovered(true)}
              onMouseLeave={() => setCardHovered(false)}
              data-ocid="player_card.card"
              style={{
                background: "rgba(18,24,38,0.8)",
                backdropFilter: "blur(12px)",
                border: cardHovered
                  ? `1px solid ${accentColor}50`
                  : "1px solid rgba(255,255,255,0.08)",
                transform: cardHovered ? "translateY(-8px)" : "translateY(0)",
                boxShadow: cardHovered
                  ? `0 30px 60px rgba(0,0,0,0.6), 0 0 40px ${accentColor}20`
                  : "0 8px 32px rgba(0,0,0,0.4)",
                transition: "all 0.3s ease",
              }}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="shrink-0">
                  <div
                    className="w-24 h-24 rounded-2xl overflow-hidden"
                    style={{
                      border: `2px solid ${accentColor}50`,
                      boxShadow: `0 0 20px ${accentColor}30`,
                    }}
                  >
                    <img
                      src="/assets/generated/rafael-apex-player.dim_600x700.jpg"
                      alt="Rafael Apex"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <div
                      className="text-xs px-2 py-1 rounded-full font-black uppercase tracking-wider inline-block"
                      style={{
                        background: `${accentColor}15`,
                        color: accentColor,
                      }}
                    >
                      ATP #1
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-display font-black text-2xl uppercase tracking-wide text-white mb-1">
                    Rafael Apex
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest">
                    APEX Tennis Ambassador
                  </p>

                  {/* Stats */}
                  <div className="space-y-4">
                    <StatBar label="Speed" value={94} color="#00F5FF" />
                    <StatBar label="Power" value={97} color="#9D00FF" />
                    <StatBar label="Accuracy" value={91} color="#FF007F" />
                    <StatBar label="Endurance" value={88} color="#39FF14" />
                  </div>
                </div>
              </div>
              <div
                className="mt-6 pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <Link
                  to="/player"
                  data-ocid="player_card.link"
                  className="text-sm font-black uppercase tracking-widest flex items-center gap-2"
                  style={{ color: accentColor }}
                >
                  View Full Profile <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RACKET 3D HIGHLIGHT ─── */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 60% 50%, rgba(157,0,255,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                Precision Engineering
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white mb-6">
                APEX{" "}
                <span
                  style={{ color: "#9D00FF", textShadow: "0 0 15px #9D00FF" }}
                >
                  PRO X1
                </span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Engineered with aerospace-grade carbon fiber and a revolutionary
                string bed pattern, the PRO X1 delivers unmatched power transfer
                and pinpoint accuracy at every ball speed.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Weight", value: "300g" },
                  { label: "Balance", value: "32cm" },
                  { label: "Power", value: "92/100" },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="text-center p-4 rounded-xl"
                    style={{
                      background: "rgba(157,0,255,0.08)",
                      border: "1px solid rgba(157,0,255,0.2)",
                    }}
                  >
                    <div
                      className="text-xl font-black font-display"
                      style={{ color: "#9D00FF" }}
                    >
                      {spec.value}
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mt-1">
                      {spec.label}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/rackets"
                data-ocid="racket_highlight.primary_button"
                className="btn-neon-primary inline-flex items-center gap-2"
                onClick={ripple}
              >
                Shop Rackets <ArrowRight size={16} />
              </Link>
            </div>
            <div className="reveal-right">
              <RacketHighlight3D accentColor={accentColor} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG PREVIEW ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12 reveal-hidden">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                Knowledge Hub
              </div>
              <h2
                className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight"
                style={{ color: "#F2F5FF" }}
              >
                APEX <span style={{ color: accentColor }}>INSIGHTS</span>
              </h2>
            </div>
            <Link
              to="/blog"
              data-ocid="blog_preview.link"
              className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest font-black"
              style={{ color: accentColor }}
            >
              All Posts <ArrowRight size={14} />
            </Link>
          </div>

          {/* Horizontal scroll */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayPosts.map((post, i) => (
              <BlogCard
                key={String(post.id)}
                post={{ ...post, id: String(post.id) }}
                idx={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── RACKET SHOP PREVIEW ─── */}
      <section className="py-24" style={{ background: "rgba(10,13,20,0.5)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal-hidden">
            <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
              Premium Collection
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white">
              RACKET SHOWCASE <span style={{ color: accentColor }}>SHOP</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {displayRackets.slice(0, 3).map((r, i) => (
              <Link
                key={String(r.id)}
                to="/rackets/$id"
                params={{ id: String(r.id) }}
                data-ocid={`shop_preview.item.${i + 1}`}
                className="rounded-2xl p-6 transition-all duration-300 block group"
                style={{
                  background: "rgba(18,24,38,0.7)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
                }}
              >
                <div
                  className="w-32 h-32 mx-auto rounded-full mb-6 flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle, ${accentColor}10, transparent)`,
                    border: `2px solid ${accentColor}20`,
                  }}
                >
                  <img
                    src="/assets/generated/racket-apex-pro.dim_400x400.png"
                    alt={r.name}
                    className="w-24 h-24 object-contain"
                    style={{ filter: `hue-rotate(${i * 60}deg)` }}
                  />
                </div>
                <h3 className="font-display font-black text-white text-center uppercase tracking-wider mb-2">
                  {r.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      style={{ color: "#FFD700", fill: "#FFD700" }}
                    />
                  ))}
                </div>
                <p
                  className="text-center text-xl font-black"
                  style={{ color: accentColor }}
                >
                  ${r.price}
                </p>
                <button
                  type="button"
                  data-ocid={`shop_preview.button.${i + 1}`}
                  className="mt-4 w-full py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, #9D00FF)`,
                    color: "#050505",
                    cursor: "none",
                  }}
                >
                  Shop Now
                </button>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/rackets"
              data-ocid="shop_preview.link"
              className="btn-neon-outline inline-flex items-center gap-2"
            >
              View All Rackets <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AI COACH + LIVE STATS ─── */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(0,245,255,0.03) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal-hidden">
            <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
              Intelligence & Live Data
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white">
              PERFORMANCE <span style={{ color: accentColor }}>HUB</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 reveal-hidden">
            <AICoachPanel />
            <div className="space-y-8">
              <LiveMatchStats />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRAINING DRILLS ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal-hidden">
            <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
              Interactive Training
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white">
              TRAINING <span style={{ color: accentColor }}>DRILLS</span>
            </h2>
          </div>
          <div className="reveal-hidden">
            <TrainingDrills />
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section
        className="py-32 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #00F5FF, #9D00FF, #FF007F)",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 4s ease infinite",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "rgba(5,5,5,0.4)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight text-white mb-6">
            ELEVATE YOUR GAME
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            Join over 50,000 elite players who've chosen APEX for their
            competitive edge.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/rackets"
              data-ocid="cta.primary_button"
              className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest bg-white text-black hover:scale-105 transition-transform"
              onClick={ripple}
            >
              Explore Gear
            </Link>
            <Link
              to="/player"
              data-ocid="cta.secondary_button"
              className="px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest bg-transparent text-white border-2 border-white hover:bg-white hover:text-black transition-all"
              onClick={ripple}
            >
              Join Elite
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
