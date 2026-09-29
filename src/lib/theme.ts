export type Theme = "light" | "dark";

export const THEME_KEY = "jigstack-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveTheme(saved: string | null, prefersDark: boolean): Theme {
  if (isTheme(saved)) return saved;
  return prefersDark ? "dark" : "light";
}

/**
 * Runs in <head> before first paint:
 * 1. applies a saved theme (no saved value = follow the OS via CSS),
 * 2. enables scroll-reveal hiding only when motion is allowed, with a 4s failsafe.
 * Kept as a plain string so it can be inlined and unit-tested.
 */
export const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")d.setAttribute("data-theme",t);}catch(e){}if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&"IntersectionObserver" in window){d.classList.add("reveal-on");window.__revealFailsafe=setTimeout(function(){d.classList.remove("reveal-on");},4000);}})();`;

export function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return resolveTheme(attr, matchMedia("(prefers-color-scheme: dark)").matches);
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/** Switch theme, persist it, and reveal it with a circle growing from `origin` when supported. */
export function applyTheme(next: Theme, origin?: HTMLElement): void {
  const root = document.documentElement;
  const commit = () => {
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the choice still applies for this visit.
    }
  };

  const doc = document as ViewTransitionDoc;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce || !origin) {
    commit();
    return;
  }

  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  doc.startViewTransition(commit).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}
