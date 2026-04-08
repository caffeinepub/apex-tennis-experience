import { useEffect, useRef } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = "0px 0px -50px 0px" } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        }
      },
      { threshold, rootMargin },
    );

    const elements = document.querySelectorAll(
      ".reveal-hidden, .reveal-left, .reveal-right",
    );
    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);
}

export function useScrollRevealRef<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return ref;
}
