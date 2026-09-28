"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Close } from "@/components/icons";
import type { Project } from "@/content/types";

type DrawerApi = { open: (id: string, trigger: HTMLElement) => void };

const DrawerContext = createContext<DrawerApi | null>(null);

export function useProjectDrawer(): DrawerApi {
  const api = useContext(DrawerContext);
  if (!api) throw new Error("useProjectDrawer must be used inside <ProjectDrawerProvider>");
  return api;
}

export function ProjectDrawerProvider({ projects, children }: { projects: Project[]; children: ReactNode }) {
  const [current, setCurrent] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const open = useCallback(
    (id: string, trigger: HTMLElement) => {
      const project = projects.find((p) => p.id === id);
      if (!project) return;
      window.clearTimeout(hideTimer.current);
      triggerRef.current = trigger;
      setCurrent(project);
      setMounted(true);
      setIsOpen(false);
      // Lock page scroll without the layout jumping when the scrollbar disappears.
      const gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = gap ? `${gap}px` : "";
      document.documentElement.style.overflow = "hidden";
      // Two frames: mount closed, then open so the CSS transition runs.
      requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)));
    },
    [projects],
  );

  const close = useCallback((focusTarget?: HTMLElement | null) => {
    setIsOpen(false);
    document.documentElement.style.overflow = "";
    document.body.style.paddingRight = "";
    hideTimer.current = window.setTimeout(() => setMounted(false), 500);
    (focusTarget ?? triggerRef.current)?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    bodyRef.current?.scrollTo(0, 0);
    closeRef.current?.focus({ preventScroll: true });
  }, [isOpen, current]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button, a[href]"));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, close]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  // "Start a project": close, jump to the form, and pre-fill the project type if it is empty.
  const startProject = () => {
    const field = document.getElementById("cf-project") as HTMLInputElement | null;
    if (current && field && !field.value) field.value = `Something like ${current.title}`;
    close(document.getElementById("cf-name"));
  };

  return (
    <DrawerContext.Provider value={{ open }}>
      {children}
      {mounted && current ? (
        <div className={`drawer${isOpen ? " is-open" : ""}`}>
          <div className="drawer-backdrop" onClick={() => close()} />
          <aside ref={panelRef} className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabIndex={-1}>
            <header className="drawer-top">
              <p className="kicker">{current.year} · {current.category}</p>
              <button ref={closeRef} className="icon-btn" type="button" aria-label="Close project details" onClick={() => close()}>
                <Close />
              </button>
            </header>

            <div ref={bodyRef} className="drawer-body">
              <h2 className="drawer-title" id="drawer-title">{current.title}</h2>
              <dl className="facts drawer-facts">
                <div><dt className="kicker">Platforms</dt><dd>{current.platforms}</dd></div>
                {current.users ? <div><dt className="kicker">Users</dt><dd>{current.users}</dd></div> : null}
              </dl>
              {current.live ? (
                <a className="btn btn-ghost btn-sm drawer-live" href={current.live} target="_blank" rel="noopener noreferrer">
                  Visit live site <ArrowUpRight />
                </a>
              ) : null}
              {current.image ? (
                <div className="drawer-shot">
                  <Image src={current.image.src} alt={current.image.alt} fill sizes="(max-width: 600px) 100vw, 560px" />
                </div>
              ) : null}
              <section>
                <p className="kicker">Overview</p>
                <div className="drawer-overview">
                  {current.detail?.overview.map((para) => <p key={para}>{para}</p>)}
                </div>
              </section>
              <section>
                <p className="kicker">Key features</p>
                <ul className="drawer-features">
                  {current.detail?.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </section>
              <section>
                <p className="kicker">Built with</p>
                <ul className="tags">{current.stack.map((t) => <li key={t}>{t}</li>)}</ul>
              </section>
            </div>

            <footer className="drawer-foot">
              <p className="drawer-cta-text">Want something like this?</p>
              <a className="btn btn-primary" href="#contact" onClick={startProject}>Start a project <ArrowRight /></a>
            </footer>
          </aside>
        </div>
      ) : null}
    </DrawerContext.Provider>
  );
}
