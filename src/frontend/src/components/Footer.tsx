import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      className="relative mt-20"
      style={{
        background: "rgba(5,5,10,0.95)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div
              className="text-2xl font-display font-black tracking-widest uppercase mb-3"
              style={{ color: "#00F5FF", textShadow: "0 0 10px #00F5FF" }}
            >
              APEX TENNIS
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Where precision meets power. Elevate your game with elite
              performance gear, expert coaching, and cutting-edge training
              systems.
            </p>
            {/* Newsletter */}
            <div className="mt-6 flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                data-ocid="footer.input"
                className="flex-1 px-4 py-2 rounded-full text-sm bg-transparent text-white placeholder-gray-600 outline-none focus:ring-1"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "14px",
                }}
              />
              <button
                type="button"
                data-ocid="footer.submit_button"
                className="px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest"
                style={{
                  background: "linear-gradient(135deg, #00F5FF, #9D00FF)",
                  color: "#050505",
                  cursor: "none",
                }}
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              Quick Links
            </h4>
            <div className="space-y-3">
              {[
                { to: "/home", label: "Home" },
                { to: "/player", label: "Player Profile" },
                { to: "/blog", label: "Blog" },
                { to: "/rackets", label: "Racket Showcase" },
                { to: "/admin", label: "Admin Panel" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid="footer.link"
                  className="block text-sm text-gray-500 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              Follow Us
            </h4>
            <div className="space-y-3">
              {["Instagram", "Twitter / X", "YouTube", "TikTok"].map((s) => (
                <a
                  key={s}
                  href={`https://example.com/${s.toLowerCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="footer.link"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                >
                  {s}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs text-gray-600">
            &copy; {year} APEX TENNIS. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1"
          >
            Built with ❤ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
