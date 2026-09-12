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
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [systemReduced, setSystemReduced] = useState(false);
  const toggleMotion = () => {
    try { localStorage.setItem("socrates-motion", motionEnabled ? "off" : "on"); } catch { /* Storage can be unavailable in private browsing. */ }
    window.dispatchEvent(new CustomEvent("socrates:motion-preference", { detail: !motionEnabled }));
  };
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".site-header");
    // Keep navigation legible over every section.
    const syncHeader = () =>
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
    window.addEventListener("scroll", syncHeader, { passive: true });
    syncHeader();
    let cleanup = () => {};
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = true;
    try { enabled = localStorage.getItem("socrates-motion") !== "off"; } catch { /* Use the default when storage is unavailable. */ }
    const setup = () => {
      cleanup();
      setMotionEnabled(enabled);
      setSystemReduced(reducedMotion.matches);
      if (reducedMotion.matches || !enabled) {
        root.dataset.motion = reducedMotion.matches ? "reduced" : "off";
        document.querySelectorAll("[data-reveal], [data-image-reveal]").forEach((element) => element.classList.add("is-revealed"));
        cleanup = () => { delete root.dataset.motion; };
        return;
      }
      root.dataset.motion = "on";
      const lenis = new Lenis({
        autoRaf: false,
        // This component owns the media-query lifecycle and destroys Lenis on reduction.
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
        // Native focus jumps and viewport changes can precede the scroll event.
        // Refresh actual scroll and dimensions before resolving an element target.
        lenis.resize();
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
            if (entry.target.hasAttribute("data-ambient")) {
              entry.target.classList.toggle("is-in-view", entry.isIntersecting);
            }
            if (entry.target.hasAttribute("data-marquee")) {
              entry.target.classList.toggle("is-in-view", entry.isIntersecting);
              return;
            }
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
        .querySelectorAll<HTMLElement>(
          "[data-reveal], [data-image-reveal], [data-marquee], [data-ambient]",
        )
        .forEach((element) => observer.observe(element));
      const scenes = [
        ...document.querySelectorAll<HTMLElement>("[data-scene]"),
      ].map((element) => ({
        element,
        progress: -1,
        activeStage: -1,
        sticky: element.querySelector<HTMLElement>(
          ".story-sticky, .study-sticky, .practice-sticky, .curriculum-sticky",
        ),
        captions: [...element.querySelectorAll<HTMLElement>("[data-caption]")],
        floats: [...element.querySelectorAll<HTMLElement>("[data-float]")],
      }));
      const parallax = [
        ...document.querySelectorAll<HTMLElement>("[data-parallax]"),
      ];
      const inkLines = [
        ...document.querySelectorAll<HTMLElement>("[data-ink]"),
      ];
      const marquee = document.querySelector<HTMLElement>(".marquee-track");
      const marqueeAnimation = marquee?.getAnimations()[0];
      let marqueeRate = 1;
      const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      );
      const magneticCleanups = [
        ...document.querySelectorAll<HTMLElement>(".button .button-label"),
      ].map((label) => {
        const button = label.closest<HTMLElement>(".button")!;
        let bounds: DOMRect | null = null;
        const reset = () => {
          bounds = null;
          label.style.removeProperty("--magnet-x");
          label.style.removeProperty("--magnet-y");
        };
        const enter = () => {
          bounds = button.getBoundingClientRect();
        };
        const move = (event: PointerEvent) => {
          if (!finePointer.matches || event.pointerType === "touch") return;
          bounds ??= button.getBoundingClientRect();
          label.style.setProperty(
            "--magnet-x",
            `${clamp((event.clientX - bounds.left) / bounds.width - 0.5, -0.5, 0.5) * 7}px`,
          );
          label.style.setProperty(
            "--magnet-y",
            `${clamp((event.clientY - bounds.top) / bounds.height - 0.5, -0.5, 0.5) * 5}px`,
          );
        };
        button.addEventListener("pointerenter", enter);
        button.addEventListener("pointermove", move, { passive: true });
        button.addEventListener("pointerleave", reset);
        button.addEventListener("pointercancel", reset);
        button.addEventListener("blur", reset);
        return () => {
          reset();
          button.removeEventListener("pointerenter", enter);
          button.removeEventListener("pointermove", move);
          button.removeEventListener("pointerleave", reset);
          button.removeEventListener("pointercancel", reset);
          button.removeEventListener("blur", reset);
        };
      });
      const onStageSelect = (event: Event) => {
        const index = (event as CustomEvent<number>).detail;
        const scene = scenes.find(
          (item) => item.element.dataset.scene === "curriculum",
        );
        if (!scene || !Number.isInteger(index) || index < 0 || index > 4)
          return;
        const rect = scene.element.getBoundingClientRect();
        const progress = (index + 0.35) / 5;
        scene.progress = progress;
        // Tabs jump within the pinned section without scrolling past other panels.
        lenis.scrollTo(
          window.scrollY +
            rect.top +
            (rect.height - (scene.sticky?.clientHeight ?? innerHeight)) *
              progress,
          { immediate: true },
        );
      };
      window.addEventListener("socrates:select-stage", onStageSelect);
      let frame = 0;
      let stopped = false;
      let previousTime = 0;
      let dirty = true;
      const update = (time: number) => {
        frame = 0;
        if (stopped || document.hidden) return;
        lenis.raf(time);
        const targetRate = 1 + clamp(Math.abs(lenis.velocity) * 0.055, 0, 2);
        const nextRate = marqueeRate + (targetRate - marqueeRate) * 0.12;
        if (marqueeAnimation && Math.abs(nextRate - marqueeRate) > 0.001) {
          marqueeRate = nextRate;
          marqueeAnimation.updatePlaybackRate(marqueeRate);
        }
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
          element.getBoundingClientRect(),
        );
        const inkRects = inkLines.map((element) =>
          element.getBoundingClientRect(),
        );
        root.style.setProperty(
          "--reading-progress",
          String(clamp(scroll / Math.max(1, documentHeight - height))),
        );
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
              caption.style.transform = `translate3d(0,${(1 - enter) * 20 - leave * 16}px,0)`;
              caption.style.visibility = opacity < 0.01 ? "hidden" : "visible";
            });
            const finale = ease(range(p, 0.73, 0.91));
            scene.element.style.setProperty("--finale", String(finale));
            scene.floats.forEach((image, index) => {
              const drift = (p - 0.5) * (index % 2 ? -32 : 32);
              image.style.transform = `translate3d(0,${drift}px,0)`;
              image.style.opacity = String(1 - finale);
            });
          }
          if (scene.element.dataset.scene === "curriculum") {
            const index = Math.min(4, Math.floor(p * 5));
            scene.element.style.setProperty(
              "--stage-progress",
              String(clamp(p * 5 - index)),
            );
            if (index !== scene.activeStage) {
              scene.activeStage = index;
              window.dispatchEvent(
                new CustomEvent("socrates:stage", { detail: index }),
              );
            }
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
            const limit = Math.min(28, rect.height * 0.045);
            const offset = clamp(
              distance * Number(element.dataset.parallax),
              -limit,
              limit,
            );
            element.querySelectorAll("img").forEach((image) => {
              image.style.transform = `translate3d(0,${offset}px,0) scale(1.12)`;
            });
          }
        });
        inkLines.forEach((element, index) => {
          const progress = clamp(
            (height * 0.86 - inkRects[index].top) / (height * 0.46),
          );
          element.style.setProperty("--ink-progress", `${progress * 100}%`);
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
        magneticCleanups.forEach((cleanup) => cleanup());
        marqueeAnimation?.updatePlaybackRate(1);
        marquee?.closest("[data-marquee]")?.classList.remove("is-in-view");
        inkLines.forEach((element) =>
          element.style.removeProperty("--ink-progress"),
        );
        resizeObserver.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("socrates:select-stage", onStageSelect);
        root.classList.remove("motion-ready");
        root.style.removeProperty("--reading-progress");
        scenes.forEach((scene) => {
          scene.element.removeAttribute("style");
          [...scene.captions, ...scene.floats].forEach((element) =>
            element.removeAttribute("style"),
          );
        });
        parallax.forEach((element) =>
          element
            .querySelectorAll("img")
            .forEach((image) => image.style.removeProperty("transform")),
        );
      };
    };
    const onPreference = (event: Event) => {
      enabled = Boolean((event as CustomEvent<boolean>).detail);
      setup();
    };
    setup();
    window.addEventListener("socrates:motion-preference", onPreference);
    reducedMotion.addEventListener("change", setup);
    return () => {
      cleanup();
      window.removeEventListener("socrates:motion-preference", onPreference);
      reducedMotion.removeEventListener("change", setup);
      window.removeEventListener("scroll", syncHeader);
    };
  }, []);
  return <>{children}<button className="motion-control" type="button" onClick={toggleMotion} aria-pressed={motionEnabled} title={systemReduced ? "Your device requests reduced motion" : "Toggle smooth scrolling and decorative animation"}><span aria-hidden="true">{motionEnabled && !systemReduced ? "◉" : "○"}</span> Motion {systemReduced && motionEnabled ? "reduced" : motionEnabled ? "on" : "off"}</button></>;
}
