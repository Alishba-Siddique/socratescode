"use client";
import { useEffect, useState } from "react";
export function useMotionRunning() {
  const [running, setRunning] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setRunning(root.dataset.motion === "on");
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    sync();
    return () => observer.disconnect();
  }, []);
  return running;
}
