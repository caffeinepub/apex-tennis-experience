import { useEffect, useRef } from "react";

export function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      currentRef.current.x += (posRef.current.x - currentRef.current.x) * 0.12;
      currentRef.current.y += (posRef.current.y - currentRef.current.y) * 0.12;
      if (trailRef.current) {
        trailRef.current.style.left = `${currentRef.current.x}px`;
        trailRef.current.style.top = `${currentRef.current.y}px`;
      }
      requestAnimationFrame(animate);
    };

    const handleEnterInteractive = () => {
      cursorRef.current?.classList.add("cursor-hover");
      trailRef.current?.classList.add("trail-hover");
    };
    const handleLeaveInteractive = () => {
      cursorRef.current?.classList.remove("cursor-hover");
      trailRef.current?.classList.remove("trail-hover");
    };

    const interactiveEls = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select, label",
    );
    for (const el of interactiveEls) {
      el.addEventListener("mouseenter", handleEnterInteractive);
      el.addEventListener("mouseleave", handleLeaveInteractive);
    }

    document.addEventListener("mousemove", handleMove);
    const animId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(animId);
      for (const el of interactiveEls) {
        el.removeEventListener("mouseenter", handleEnterInteractive);
        el.removeEventListener("mouseleave", handleLeaveInteractive);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .cursor-dot {
          position: fixed;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-primary);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 99999;
          transition: width 0.2s, height 0.2s, background 0.2s;
          box-shadow: 0 0 6px var(--accent-primary), 0 0 12px var(--accent-primary);
        }
        .cursor-dot.cursor-hover {
          width: 14px;
          height: 14px;
          background: #FF007F;
          box-shadow: 0 0 10px #FF007F, 0 0 20px #FF007F;
        }
        .cursor-trail {
          position: fixed;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--accent-primary);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 99998;
          opacity: 0.5;
          transition: width 0.3s, height 0.3s, opacity 0.3s, border-color 0.3s;
          box-shadow: 0 0 8px var(--accent-primary);
        }
        .cursor-trail.trail-hover {
          width: 48px;
          height: 48px;
          opacity: 0.8;
          border-color: #FF007F;
          box-shadow: 0 0 12px #FF007F;
        }
      `}</style>
      <div ref={cursorRef} className="cursor-dot" />
      <div ref={trailRef} className="cursor-trail" />
    </>
  );
}
