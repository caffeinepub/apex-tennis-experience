import { Link } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import type { BlogPost } from "../backend.d";
import { useTheme } from "../context/ThemeContext";
import { useBlogPosts } from "../hooks/useQueries";
import { useScrollReveal } from "../hooks/useScrollReveal";

const CATEGORIES = [
  "All",
  "Training",
  "Gear",
  "Mindset",
  "Nutrition",
  "Tournament",
];

const CATEGORY_COLORS: Record<string, string> = {
  Training: "#00F5FF",
  Gear: "#9D00FF",
  Mindset: "#FF007F",
  Nutrition: "#39FF14",
  Tournament: "#3A7BFF",
  All: "#F2F5FF",
};

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 1n,
    title: "Mastering the Modern Serve: Power, Placement & Spin",
    excerpt:
      "Unlock elite serve mechanics with biomechanics-driven drills used by Top 10 players. Learn the kinetic chain and explosive hip rotation secrets.",
    content: "Full article content here...",
    author: "Coach Rafael",
    publishedAt: 1700000000n,
    imageUrl: "/assets/generated/blog-training-hero.dim_800x500.jpg",
    category: "Training",
  },
  {
    id: 2n,
    title: "2024's Best Performance Rackets: An Expert Deep Dive",
    excerpt:
      "We tested 12 frames over 6 months. Here's what the data reveals about racket selection for intermediate and advanced players.",
    content: "Full article content...",
    author: "Gear Lab Team",
    publishedAt: 1701000000n,
    imageUrl: "/assets/generated/blog-gear-hero.dim_800x500.jpg",
    category: "Gear",
  },
  {
    id: 3n,
    title: "The Mental Game: How Champions Think Under Pressure",
    excerpt:
      "Sport psychologists break down what separates clutch players from those who crumble in big moments. The science of performance under pressure.",
    content: "Full article...",
    author: "Dr. A. Voss",
    publishedAt: 1702000000n,
    imageUrl: "/assets/generated/blog-mindset-hero.dim_800x500.jpg",
    category: "Mindset",
  },
  {
    id: 4n,
    title: "Tournament Prep: 30-Day Peak Performance Protocol",
    excerpt:
      "The exact nutrition, recovery, and training structure used at elite academies to peak for major tournaments.",
    content: "Full article...",
    author: "Performance Team",
    publishedAt: 1703000000n,
    imageUrl: "/assets/generated/blog-training-hero.dim_800x500.jpg",
    category: "Tournament",
  },
  {
    id: 5n,
    title: "Optimal Nutrition Timing for Match Day",
    excerpt:
      "What to eat before, during, and after matches to maintain peak energy and recovery. Evidence-based guidance from sports dietitians.",
    content: "Full article...",
    author: "Nutrition Lab",
    publishedAt: 1704000000n,
    imageUrl: "/assets/generated/blog-gear-hero.dim_800x500.jpg",
    category: "Nutrition",
  },
  {
    id: 6n,
    title: "Clay Court Strategy: Spin Patterns & Positioning",
    excerpt:
      "Winning on clay requires different tactics than hard courts. Mastering high kick serves, heavy topspin, and defensive sliding footwork.",
    content: "Full article...",
    author: "Coach Rafael",
    publishedAt: 1705000000n,
    imageUrl: "/assets/generated/blog-training-hero.dim_800x500.jpg",
    category: "Training",
  },
];

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const color = CATEGORY_COLORS[post.category] || "#00F5FF";

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 12;
    setTilt({ x, y });
  }, []);

  const formatDate = (ts: bigint) => {
    const date = new Date(Number(ts) * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link
      to="/blog/$id"
      params={{ id: String(post.id) }}
      data-ocid={`blog.item.${index + 1}`}
    >
      <div
        ref={cardRef}
        className="rounded-2xl overflow-hidden mb-6 block transition-all duration-200"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setTilt({ x: 0, y: 0 });
        }}
        style={{
          background: "rgba(18,24,38,0.8)",
          border: hovered
            ? `1px solid ${color}50`
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: hovered
            ? `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${color}15`
            : "0 4px 20px rgba(0,0,0,0.3)",
          transform: hovered
            ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
            : "none",
          transformOrigin: "center center",
          transition: hovered
            ? "transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease"
            : "all 0.3s ease",
        }}
      >
        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ height: index % 3 === 0 ? "220px" : "180px" }}
        >
          {post.imageUrl && !post.imageUrl.startsWith("placeholder") ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${color}30, rgba(10,13,20,0.9))`,
              }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: hovered
                ? "linear-gradient(to top, rgba(5,5,5,0.8), rgba(5,5,5,0.3))"
                : "linear-gradient(to top, rgba(5,5,5,0.6), transparent)",
              transition: "background 0.3s ease",
            }}
          />
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

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display font-bold text-white mb-2 leading-snug">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-gray-400">
                {post.author}
              </div>
              <div className="text-xs text-gray-600">
                {formatDate(post.publishedAt)}
              </div>
            </div>
            <span
              className="text-xs font-black uppercase tracking-wide transition-colors"
              style={{ color: hovered ? color : "#9AA3B2" }}
            >
              Read More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  useScrollReveal();
  const { accentColor } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: posts = [], isLoading } = useBlogPosts();

  const displayPosts = posts.length > 0 ? posts : FALLBACK_POSTS;
  const filtered =
    activeCategory === "All"
      ? displayPosts
      : displayPosts.filter((p) => p.category === activeCategory);

  // Split into 3 columns for masonry
  const columns: BlogPost[][] = [[], [], []];
  filtered.forEach((post, i) => columns[i % 3].push(post));

  return (
    <main style={{ background: "#050505" }}>
      {/* Header */}
      <section
        className="pt-32 pb-16 text-center relative"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.06), transparent 60%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-4">
            Knowledge & Strategy
          </div>
          <h1
            className="text-5xl md:text-7xl font-display font-black uppercase tracking-tight text-white mb-4"
            style={{ animation: "slide-up 0.7s ease forwards" }}
          >
            APEX <span style={{ color: accentColor }}>INSIGHTS</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Expert analysis, training guides, and gear reviews from the world's
            top tennis minds.
          </p>
        </div>
      </section>

      {/* Category filters */}
      <div
        className="sticky top-16 z-30 py-4"
        style={{ background: "rgba(5,5,5,0.95)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2" data-ocid="blog.tab">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-ocid="blog.tab"
                className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200"
                style={{
                  background:
                    activeCategory === cat
                      ? `linear-gradient(135deg, ${accentColor}, #9D00FF)`
                      : "rgba(255,255,255,0.05)",
                  color: activeCategory === cat ? "#050505" : "#9AA3B2",
                  border:
                    activeCategory === cat
                      ? "none"
                      : "1px solid rgba(255,255,255,0.1)",
                  cursor: "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`blog-skel-${String(i)}`}
                  className="h-64 rounded-2xl animate-pulse"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                  data-ocid="blog.loading_state"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-20 text-gray-600"
              data-ocid="blog.empty_state"
            >
              <div className="text-5xl mb-4">🎾</div>
              <p className="text-lg">No posts in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {columns.map((col, ci) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed 3-column masonry
                <div key={`col-${ci}`}>
                  {col.map((post, pi) => (
                    <BlogCard
                      key={String(post.id)}
                      post={post}
                      index={ci * 10 + pi}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
