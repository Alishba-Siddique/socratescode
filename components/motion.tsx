"use client";

import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const range = (value: number, start: number, end: number) =>
  clamp((value - start) / (end - start));
const ease = (value: number) => value * value * (3 - 2 * value);

/** Lenis and scroll scenes share one RAF clock; layout work runs only when dirty. */
export function Motion({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const header = document.querySelector<HTMLElement>(".site-header");
    // Header legibility also matters when animation is disabled.
    const syncHeader = () =>
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
    window.addEventListener("scroll", syncHeader, { passive: true });
    syncHeader();
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      const preference = root.dataset.motionPreference ?? "system";
      const active =
        preference === "on" || (preference !== "off" && !media.matches);
      root.dataset.motion = active ? "on" : "off";
      setEnabled(active);
      if (!active) {
        root.classList.remove("motion-ready");
        return;
      }
      const lenis = new Lenis({
        autoRaf: false,
        // The site preference already resolves OS settings and explicit opt-in.
        respectReducedMotion: false,
        lerp: 0.095,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      });
      // Intercept in-page links so native hash jumps do not race Lenis.
      // Preserve modifier-clicks, URL history, and keyboard focus at the destination.
      const onAnchor = (event: MouseEvent) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const link = event
          .composedPath()
          .find(
            (node): node is HTMLAnchorElement =>
              node instanceof HTMLAnchorElement,
          );
        if (
          !link ||
          link.hasAttribute("download") ||
          (link.target && link.target !== "_self")
        )
          return;
        const url = new URL(link.href);
        if (
          url.origin !== location.origin ||
          url.pathname !== location.pathname ||
          url.search !== location.search ||
          !url.hash
        )
          return;
        let id: string;
        try {
          id = decodeURIComponent(url.hash.slice(1));
        } catch {
          return;
        }
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        if (location.hash !== url.hash) history.pushState(null, "", url.hash);
        lenis.scrollTo(target, {
          onComplete: () => {
            const priorTabIndex = target.getAttribute("tabindex");
            if (priorTabIndex === null) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
            if (priorTabIndex === null) {
              target.addEventListener(
                "blur",
                () => target.removeAttribute("tabindex"),
                { once: true },
              );
            }
          },
        });
      };
      window.addEventListener("click", onAnchor);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
            } else if (
              entry.boundingClientRect.top >=
              (entry.rootBounds?.bottom ?? window.innerHeight)
            ) {
              entry.target.classList.remove("is-revealed");
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
      );
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((element) => observer.observe(element));
      const scenes = [
        ...document.querySelectorAll<HTMLElement>("[data-scene]"),
      ].map((element) => ({
        element,
        progress: -1,
        sticky: element.querySelector<HTMLElement>(
          ".story-sticky, .study-sticky, .practice-sticky",
        ),
        captions: [...element.querySelectorAll<HTMLElement>("[data-caption]")],
        floats: [...element.querySelectorAll<HTMLElement>("[data-float]")],
      }));
      const heroArt = document.querySelector<HTMLElement>(".hero-art");
      const heroCopy = document.querySelector<HTMLElement>(".hero-content");
      const parallax = [
        ...document.querySelectorAll<HTMLElement>("[data-parallax]"),
      ];
      const statements = [
        ...document.querySelectorAll<HTMLElement>("[data-drift]"),
      ];
      const cards = [...document.querySelectorAll<HTMLElement>("[data-tilt]")];
      const cardEvents = cards.map((card) => {
        let bounds: DOMRect | null = null;
        const reset = () => {
          bounds = null;
          ["--tilt-x", "--tilt-y", "--pointer-x", "--pointer-y"].forEach(
            (name) => card.style.removeProperty(name),
          );
        };
        const enter = () => {
          bounds = card.getBoundingClientRect();
        };
        const move = (event: PointerEvent) => {
          if (!finePointer.matches || event.pointerType === "touch") return;
          bounds ??= card.getBoundingClientRect();
          const x = clamp((event.clientX - bounds.left) / bounds.width) * 2 - 1;
          const y = clamp((event.clientY - bounds.top) / bounds.height) * 2 - 1;
          card.style.setProperty("--tilt-x", `${-y * 2.5}deg`);
          card.style.setProperty("--tilt-y", `${x * 3.5}deg`);
          card.style.setProperty("--pointer-x", `${x * 3}px`);
          card.style.setProperty("--pointer-y", `${y * 3}px`);
        };
        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointermove", move, { passive: true });
        card.addEventListener("pointerleave", reset);
        card.addEventListener("pointercancel", reset);
        card.addEventListener("blur", reset);
        return () => {
          reset();
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", reset);
          card.removeEventListener("pointercancel", reset);
          card.removeEventListener("blur", reset);
        };
      });
      let frame = 0;
      let stopped = false;
      let previousTime = 0;
      let dirty = true;
      const update = (time: number) => {
        frame = 0;
        if (stopped || document.hidden) return;
        lenis.raf(time);
        if (!dirty) {
          previousTime = time;
          frame = requestAnimationFrame(update);
          return;
        }
        dirty = false;
        const elapsed = previousTime
          ? Math.min(time - previousTime, 64)
          : 1000 / 60;
        previousTime = time;
        // Time-based smoothing keeps the same choreography on 60 Hz and 120 Hz screens.
        const blend = 1 - Math.exp(-elapsed / 70);
        const height = window.innerHeight;
        const width = window.innerWidth;
        const scroll = window.scrollY;
        const documentHeight = root.scrollHeight;
        // Read layout before writing any transforms.
        const sceneRects = scenes.map((scene) =>
          scene.element.getBoundingClientRect(),
        );
        const sceneHeights = scenes.map(
          (scene) => scene.sticky?.clientHeight || height,
        );
        const artRects = parallax.map((element) =>
          element.parentElement!.getBoundingClientRect(),
        );
        const statementRects = statements.map((element) =>
          element.getBoundingClientRect(),
        );
        root.style.setProperty(
          "--reading-progress",
          String(clamp(scroll / Math.max(1, documentHeight - height))),
        );
        if (heroArt && scroll < height * 1.5) {
          heroCopy?.style.setProperty(
            "--hero-exit",
            String(ease(range(scroll / height, 0.04, 0.7))),
          );
          heroArt.style.transform = `translate3d(0,${scroll * 0.19}px,0) scale(${1 + clamp(scroll / height) * 0.045})`;
        }
        let settling = false;
        scenes.forEach((scene, sceneIndex) => {
          const rect = sceneRects[sceneIndex];
          const target = clamp(
            -rect.top / Math.max(1, rect.height - sceneHeights[sceneIndex]),
          );
          const initial = scene.progress === -1;
          if (initial) scene.progress = target;
          const delta = target - scene.progress;
          if (
            !initial &&
            Math.abs(delta) < 0.0001 &&
            (rect.bottom < 0 || rect.top > height)
          )
            return;
          scene.progress =
            Math.abs(delta) < 0.0001 ? target : scene.progress + delta * blend;
          if (Math.abs(delta) > 0.0001) settling = true;
          const p = scene.progress;
          scene.element.style.setProperty("--progress", String(p));
          if (scene.element.dataset.scene === "story") {
            const starts = [0, 0.25, 0.49];
            scene.captions.forEach((caption, index) => {
              const start = starts[index];
              const enter =
                index === 0 ? 1 : ease(range(p, start, start + 0.07));
              const leave = ease(range(p, start + 0.17, start + 0.24));
              const opacity = enter * (1 - leave);
              caption.style.opacity = String(opacity);
              caption.style.transform = `translate3d(0,${(1 - enter) * 45 - leave * 35}px,0)`;
              caption.style.visibility = opacity < 0.01 ? "hidden" : "visible";
            });
            const finale = ease(range(p, 0.73, 0.91));
            scene.element.style.setProperty("--finale", String(finale));
            scene.floats.forEach((image, index) => {
              const drift = (p - 0.38) * Number(image.dataset.float) * height;
              const scale = 1.2 - p * 0.65;
              const turn = Math.sin(index * 2) * (p - 0.38) * 7;
              image.style.transform = `perspective(1600px) translate3d(${Math.sin(index * 2) * p * width * 0.08}px,${drift}px,0) rotateY(${turn * 1.8}deg) rotate(${turn}deg) scale(${scale})`;
              image.style.opacity = String(1 - finale);
            });
          }
          if (scene.element.dataset.scene === "study") {
            scene.element.style.setProperty(
              "--zoom",
              String(ease(range(p, 0.02, 0.64))),
            );
            scene.element.style.setProperty(
              "--study-caption",
              String(ease(range(p, 0.38, 0.67))),
            );
            scene.element.style.setProperty(
              "--study-intro",
              String(1 - ease(range(p, 0.02, 0.26))),
            );
          }
          if (scene.element.dataset.scene === "practice") {
            scene.element.style.setProperty(
              "--demo-scale",
              String(0.9 + ease(range(p, 0, 0.35)) * 0.1),
            );
          }
        });
        parallax.forEach((element, index) => {
          const rect = artRects[index];
          if (rect.bottom > 0 && rect.top < height) {
            const distance = height / 2 - rect.top - rect.height / 2;
            element.style.transform = `translate3d(0,${distance * Number(element.dataset.parallax)}px,0)`;
            if (element.classList.contains("gallery-art"))
              element.style.setProperty(
                "--gallery-turn",
                `${clamp(distance / height, -1, 1) * Number(element.dataset.parallax) * 18}deg`,
              );
          }
        });
        statements.forEach((element, index) => {
          const rect = statementRects[index];
          if (rect.bottom > 0 && rect.top < height) {
            const p = clamp((height * 0.55 - rect.top) / height, -1, 1);
            element.style.setProperty(
              "--word-shift",
              `${p * Number(element.dataset.drift) * 45}px`,
            );
            element.style.setProperty(
              "--portrait-turn",
              `${p * Number(element.dataset.drift) * 5}deg`,
            );
          }
        });
        dirty = dirty || settling;
        frame = requestAnimationFrame(update);
      };
      const schedule = () => {
        dirty = true;
        if (!frame && !document.hidden) {
          previousTime = 0;
          frame = requestAnimationFrame(update);
        }
      };
      const onLenisScroll = () => {
        dirty = true;
      };
      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else schedule();
      };
      root.classList.add("motion-ready");
      lenis.resize();
      lenis.on("scroll", onLenisScroll);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      document.addEventListener("visibilitychange", onVisibility);
      const resizeObserver = new ResizeObserver(schedule);
      resizeObserver.observe(document.body);
      schedule();
      cleanup = () => {
        stopped = true;
        cancelAnimationFrame(frame);
        lenis.off("scroll", onLenisScroll);
        lenis.destroy();
        window.removeEventListener("click", onAnchor);
        observer.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        document.removeEventListener("visibilitychange", onVisibility);
        cardEvents.forEach((remove) => remove());
        root.classList.remove("motion-ready");
        root.style.removeProperty("--reading-progress");
        scenes.forEach((scene) => {
          scene.element.removeAttribute("style");
          [...scene.captions, ...scene.floats].forEach((element) =>
            element.removeAttribute("style"),
          );
        });
        heroArt?.removeAttribute("style");
        heroCopy?.style.removeProperty("--hero-exit");
        parallax.forEach((element) => element.removeAttribute("style"));
        statements.forEach((element) => {
          element.style.removeProperty("--word-shift");
          element.style.removeProperty("--portrait-turn");
        });
      };
    };
    setup();
    media.addEventListener("change", setup);
    window.addEventListener("socrates:motionchange", setup);
    return () => {
      cleanup();
      media.removeEventListener("change", setup);
      window.removeEventListener("socrates:motionchange", setup);
      window.removeEventListener("scroll", syncHeader);
    };
  }, []);
  const toggleMotion = () => {
    const preference = enabled ? "off" : "on";
    document.documentElement.dataset.motionPreference = preference;
    try {
      localStorage.setItem("socrates-motion", preference);
    } catch {
      /* Private browsing can block storage. */
    }
    const url = new URL(location.href);
    url.searchParams.delete("motion");
    history.replaceState(history.state, "", url);
    window.dispatchEvent(new Event("socrates:motionchange"));
  };
  return (
    <>
      {children}
      {enabled !== null && (
        <button
          className="motion-toggle"
          type="button"
          aria-pressed={enabled}
          aria-label={enabled ? "Pause animations" : "Enable animations"}
          onClick={toggleMotion}
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            {enabled ? (
              <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="m5 3 8 5-8 5V3Z" fill="currentColor" />
            )}
          </svg>
          <span>{enabled ? "Animations on" : "Enable animations"}</span>
        </button>
      )}
    </>
  );
}
