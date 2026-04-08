import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navLinks = [
  { label: "Home", to: "/home" },
  { label: "Player", to: "/player" },
  { label: "Blog", to: "/blog" },
  { label: "Rackets", to: "/rackets" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme, accentColor } = useTheme();
  const { login, clear, identity } = useInternetIdentity();
  const routerState = useRouterState();
  const location = { pathname: routerState.location.pathname };
  const isLoggedIn = !!identity;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset mobile menu on route change
  const closeMobile = () => setMobileOpen(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: closeMobile is stable
  useEffect(() => {
    closeMobile();
  }, [location.pathname]); // eslint-disable-line

  return (
    <>
      <nav
        style={{
          background: scrolled ? "rgba(5,5,5,0.9)" : "rgba(5,5,5,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid rgba(0,245,255,0.15)"
            : "1px solid rgba(255,255,255,0.06)",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/home"
              className="flex items-center gap-2 group"
              data-ocid="navbar.link"
            >
              <Zap
                size={20}
                style={{ color: accentColor }}
                className="animate-pulse"
              />
              <span
                className="text-xl font-display font-black tracking-widest uppercase"
                style={{
                  color: accentColor,
                  textShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentColor}`,
                }}
              >
                APEX TENNIS
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid="navbar.link"
                  className="relative text-sm font-body font-medium uppercase tracking-widest text-gray-300 hover:text-white transition-colors group"
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                    style={{
                      background: accentColor,
                      boxShadow: `0 0 6px ${accentColor}`,
                    }}
                  />
                  {location.pathname === link.to && (
                    <span
                      className="absolute -bottom-1 left-0 h-px w-full"
                      style={{
                        background: accentColor,
                        boxShadow: `0 0 6px ${accentColor}`,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                data-ocid="navbar.toggle"
                className="relative w-12 h-6 rounded-full border transition-all duration-300"
                style={{
                  background:
                    theme === "blue"
                      ? "rgba(0,245,255,0.15)"
                      : "rgba(255,0,127,0.15)",
                  borderColor: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`,
                }}
                title={`Switch to ${
                  theme === "blue" ? "Neon Pink" : "Neon Blue"
                } theme`}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                  style={{
                    left: theme === "blue" ? "2px" : "calc(100% - 22px)",
                    background: accentColor,
                    boxShadow: `0 0 8px ${accentColor}`,
                  }}
                />
                <span className="sr-only">Toggle theme</span>
              </button>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={clear}
                  data-ocid="navbar.button"
                  className="text-sm font-medium px-4 py-1.5 rounded-full text-gray-300 border border-gray-600 hover:border-gray-400 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  data-ocid="navbar.primary_button"
                  className="text-sm font-black uppercase tracking-wider px-5 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, #9D00FF)`,
                    color: "#050505",
                    boxShadow: `0 0 16px ${accentColor}50`,
                  }}
                >
                  JOIN THE ELITE
                </button>
              )}
            </div>

            <button
              type="button"
              className="md:hidden text-gray-300 hover:text-white p-2"
              data-ocid="navbar.toggle"
              onClick={() => setMobileOpen((o) => !o)}
              style={{ cursor: "none" }}
            >
              {mobileOpen ? (
                <X size={24} />
              ) : (
                <Menu
                  size={24}
                  style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }}
                />
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-16"
          style={{
            background: "rgba(5,5,5,0.97)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex flex-col items-center gap-8 mt-16">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid="navbar.link"
                className="text-2xl font-display font-black uppercase tracking-widest transition-colors"
                style={{
                  color:
                    location.pathname === link.to ? accentColor : "#F2F5FF",
                }}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              data-ocid="navbar.toggle"
              className="mt-4 text-sm uppercase tracking-widest px-6 py-2 rounded-full border"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              {theme === "blue" ? "Switch to Pink" : "Switch to Blue"}
            </button>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={clear}
                data-ocid="navbar.button"
                className="text-gray-400"
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={login}
                data-ocid="navbar.primary_button"
                className="font-black uppercase tracking-wider px-8 py-3 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #9D00FF)`,
                  color: "#050505",
                }}
              >
                JOIN THE ELITE
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
