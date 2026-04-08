import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useBlogPost } from "../hooks/useQueries";

export default function BlogDetailPage() {
  const { id } = useParams({ strict: false });
  const [scrollProgress, setScrollProgress] = useState(0);
  const { accentColor } = useTheme();
  const { data: post, isLoading } = useBlogPost(BigInt(id || "1"));

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const CATEGORY_COLORS: Record<string, string> = {
    Training: "#00F5FF",
    Gear: "#9D00FF",
    Mindset: "#FF007F",
    Nutrition: "#39FF14",
    Tournament: "#3A7BFF",
  };
  const color = post
    ? CATEGORY_COLORS[post.category] || accentColor
    : accentColor;

  const formatDate = (ts: bigint) => {
    const date = new Date(Number(ts) * 1000);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const FALLBACK_CONTENT = `The modern game of tennis demands an unprecedented combination of power, precision, and mental fortitude. Elite players must master the technical fundamentals while simultaneously developing the tactical intelligence to outmaneuver world-class opponents across a variety of surfaces and conditions.

The serve remains the single most important shot in tennis. A dominant serve can neutralize an opponent's strengths, dictate rally patterns, and provide free points in pressure moments. Developing a high-level serve requires coordinated effort across multiple technical domains.

First, the trophy position must be optimized. This is the loading phase just before the upward swing begins. The tossing arm should be fully extended with the ball positioned slightly forward and to the racket side. The hitting shoulder should drop to create elastic energy, while the knees bend to initiate the kinetic chain that will power the serve.

The swing itself should follow a precise sequence: legs extend to initiate upward momentum, hips rotate before the shoulders unwind, and the arm whips through in a fast pronation motion that snaps the racket face through the contact zone. The wrist snap at contact is where the final velocity is added.

Consistency is built through thousands of repetitions with conscious focus on each element of the kinetic chain. Use video analysis to identify technical flaws and work with a qualified coach to develop corrective drills that rebuild muscle memory.`;

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050505" }}
      >
        <div
          className="space-y-4 w-full max-w-2xl px-6"
          data-ocid="blog_detail.loading_state"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`skel-${String(i)}`}
              className="h-6 rounded animate-pulse"
              style={{
                background: "rgba(255,255,255,0.06)",
                width: `${60 + Math.random() * 40}%`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const title = post?.title || "Mastering the Modern Serve";
  const author = post?.author || "Coach Rafael";
  const publishedAt = post?.publishedAt || 1700000000n;
  const category = post?.category || "Training";
  const content = post?.content || FALLBACK_CONTENT;
  const imageUrl =
    post?.imageUrl || "/assets/generated/blog-training-hero.dim_800x500.jpg";

  return (
    <main style={{ background: "#050505" }}>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 z-50 transition-all duration-100"
        style={{
          width: `${scrollProgress}%`,
          background: `linear-gradient(90deg, ${accentColor}, #9D00FF, #FF007F)`,
          boxShadow: `0 0 6px ${accentColor}`,
        }}
        data-ocid="blog_detail.section"
      />

      {/* Hero */}
      <div className="pt-16">
        <div
          className="relative h-72 md:h-96 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${color}20, rgba(10,13,20,0.9))`,
          }}
        >
          {imageUrl && !imageUrl.startsWith("placeholder") && (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              style={{ opacity: 0.4 }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.4) 100%)",
            }}
          />
          <div className="absolute bottom-8 left-0 right-0 max-w-4xl mx-auto px-6">
            <div
              className="text-xs px-3 py-1 rounded-full inline-block mb-4 font-black uppercase tracking-wider"
              style={{
                background: `${color}20`,
                color,
                border: `1px solid ${color}40`,
              }}
            >
              {category}
            </div>
            <h1
              className="text-3xl md:text-5xl font-display font-black text-white leading-tight"
              style={{ animation: "slide-up 0.8s ease forwards" }}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Meta */}
        <div
          className="flex items-center justify-between mb-10 pb-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <div className="font-medium text-white">{author}</div>
            <div className="text-sm text-gray-500">
              {formatDate(publishedAt)}
            </div>
          </div>
          <Link
            to="/blog"
            data-ocid="blog_detail.link"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            All Posts
          </Link>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          {content.split("\n\n").map((para, i) => (
            <p
              key={`para-${String(i)}`}
              className="text-gray-400 leading-relaxed mb-6"
              style={{
                animation: `slide-up 0.6s ease ${i * 100}ms forwards`,
                opacity: 0,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Back CTA */}
        <div
          className="mt-16 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link
            to="/blog"
            data-ocid="blog_detail.secondary_button"
            className="btn-neon-outline inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </article>
    </main>
  );
}
