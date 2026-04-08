import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useCountUp } from "../hooks/useCountUp";
import { useScrollReveal } from "../hooks/useScrollReveal";

const TIMELINE = [
  {
    year: "2018",
    title: "Professional Debut",
    desc: "Turned professional at age 18, making an immediate impact on the ATP Tour with 3 titles in his debut season.",
  },
  {
    year: "2019",
    title: "First ATP 500 Title",
    desc: "Claimed his first major ATP 500 title in Madrid, defeating the world No. 3 in a dominant straight-sets final.",
  },
  {
    year: "2021",
    title: "Grand Slam Victory",
    desc: "Won his first Grand Slam at Roland Garros, becoming the youngest player in 20 years to claim the title.",
  },
  {
    year: "2022",
    title: "World No. 1",
    desc: "Reached the pinnacle of men's tennis, holding the top ranking for a record 78 consecutive weeks.",
  },
  {
    year: "2024",
    title: "APEX Sponsorship",
    desc: "Partnered with APEX Tennis as global ambassador, co-designing the revolutionary PRO X1 racket series.",
  },
];

function StatBar({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm uppercase tracking-widest text-gray-400 font-medium">
          {label}
        </span>
        <span className="text-lg font-black font-display" style={{ color }}>
          {count}
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
            boxShadow: `0 0 10px ${color}80`,
          }}
        />
      </div>
    </div>
  );
}

export default function PlayerPage() {
  useScrollReveal();
  const { accentColor } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main style={{ background: "#050505" }}>
      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-end pb-24 overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #0a0220 0%, #050505 100%)",
        }}
      >
        {/* Parallax bg layer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/assets/generated/rafael-apex-player.dim_600x700.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: 0.2,
            filter: "blur(2px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,1) 100%)",
          }}
        />

        {/* Neon grid lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div
            className="text-xs uppercase tracking-[0.4em] mb-4"
            style={{ color: accentColor }}
          >
            World No. 1 · APEX TENNIS AMBASSADOR
          </div>
          <h1
            className="font-display font-black text-6xl md:text-9xl uppercase tracking-tight text-white leading-none"
            style={{
              textShadow: `0 0 40px ${accentColor}30`,
              animation: "slide-up 0.8s ease forwards",
            }}
          >
            RAFAEL
          </h1>
          <h1
            className="font-display font-black text-6xl md:text-9xl uppercase tracking-tight leading-none"
            style={{
              color: accentColor,
              textShadow: `0 0 30px ${accentColor}60`,
              animation: "slide-up 0.8s ease 0.2s forwards",
              opacity: 0,
            }}
          >
            APEX
          </h1>
          <p
            className="text-gray-400 text-xl mt-6 max-w-md"
            style={{
              animation: "slide-up 0.8s ease 0.4s forwards",
              opacity: 0,
            }}
          >
            The defining player of his generation. Six-time Grand Slam champion,
            78-week World No. 1, and the face of modern tennis.
          </p>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal-hidden">
            <h2
              className="text-4xl font-display font-black uppercase tracking-tight"
              style={{ color: accentColor }}
            >
              PERFORMANCE METRICS
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal-hidden">
            <div>
              <StatBar label="Speed" value={94} color="#00F5FF" />
              <StatBar label="Power" value={97} color="#9D00FF" />
              <StatBar label="Accuracy" value={91} color="#FF007F" />
              <StatBar label="Endurance" value={88} color="#39FF14" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Grand Slams", value: "6", color: "#00F5FF" },
                { label: "ATP Titles", value: "47", color: "#9D00FF" },
                { label: "Weeks at #1", value: "78", color: "#FF007F" },
                { label: "Win Rate", value: "91%", color: "#39FF14" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl text-center"
                  style={{
                    background: "rgba(18,24,38,0.8)",
                    border: `1px solid ${stat.color}20`,
                    boxShadow: `0 0 20px ${stat.color}08`,
                  }}
                >
                  <div
                    className="text-4xl font-display font-black mb-2"
                    style={{
                      color: stat.color,
                      textShadow: `0 0 15px ${stat.color}60`,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAREER TIMELINE ─── */}
      <section className="py-24" style={{ background: "rgba(10,13,20,0.5)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 reveal-hidden">
            <h2 className="text-4xl font-display font-black uppercase tracking-tight text-white">
              CAREER <span style={{ color: accentColor }}>TIMELINE</span>
            </h2>
          </div>
          <div className="relative">
            {/* Center line */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{
                background: `linear-gradient(to bottom, transparent, ${accentColor}50, transparent)`,
              }}
            />
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className={`flex items-center gap-8 mb-12 reveal-hidden ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}
                >
                  <div
                    className="inline-block p-6 rounded-2xl"
                    style={{
                      background: "rgba(18,24,38,0.8)",
                      border: `1px solid ${accentColor}20`,
                    }}
                  >
                    <div
                      className="text-xs uppercase tracking-[0.3em] mb-2"
                      style={{ color: accentColor }}
                    >
                      {item.year}
                    </div>
                    <h3 className="font-display font-black text-white uppercase tracking-wide mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
                {/* Dot */}
                <div
                  className="w-4 h-4 rounded-full shrink-0 z-10"
                  style={{
                    background: accentColor,
                    boxShadow: `0 0 12px ${accentColor}, 0 0 24px ${accentColor}50`,
                  }}
                />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VIDEO HIGHLIGHTS ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal-hidden">
            <h2 className="text-4xl font-display font-black uppercase tracking-tight text-white">
              VIDEO <span style={{ color: accentColor }}>HIGHLIGHTS</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Roland Garros 2021 Final", duration: "3:42" },
              { title: "US Open Semifinal — The Comeback", duration: "4:15" },
              { title: "Best Shots of 2024 Season", duration: "5:28" },
            ].map((video, i) => (
              <div
                key={video.title}
                className="group relative rounded-2xl overflow-hidden reveal-hidden"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}15, rgba(10,13,20,0.9))`,
                  border: "1px solid rgba(255,255,255,0.08)",
                  aspectRatio: "16/9",
                  transitionDelay: `${i * 100}ms`,
                }}
                data-ocid={`video.item.${i + 1}`}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('/assets/generated/rafael-apex-player.dim_600x700.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.3,
                    transform: "scale(1)",
                    transition: "transform 0.5s ease, opacity 0.3s ease",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125"
                    style={{
                      background: `${accentColor}20`,
                      border: `2px solid ${accentColor}`,
                      boxShadow: `0 0 20px ${accentColor}40`,
                    }}
                  >
                    <Play
                      size={20}
                      style={{ color: accentColor, marginLeft: "2px" }}
                    />
                  </div>
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(5,5,5,0.9), transparent)",
                  }}
                >
                  <p className="text-sm font-bold text-white">{video.title}</p>
                  <p className="text-xs text-gray-500">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
