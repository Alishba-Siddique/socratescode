"use client";

import Image from "next/image";
import { useState } from "react";

export function Mentor() {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = pinned || hovered;
  return (
    <button
      type="button"
      className="hero-mentor"
      aria-label="Socrates sunglasses"
      aria-pressed={pinned}
      data-active={active}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onClick={() => setPinned(!pinned)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setPinned(false);
          setHovered(false);
        }
      }}
    >
      <span className="mentor-portrait">
        <Image
          src="/images/socratic-mentor-front.webp"
          alt="Socrates looking directly at you"
          fill
          sizes="128px"
          priority
          unoptimized
          className="mentor-base"
        />
        <Image
          src="/images/socratic-mentor-front-sunglasses.webp"
          alt=""
          fill
          sizes="128px"
          priority
          unoptimized
          className="mentor-glasses"
        />
      </span>
      <span className="mentor-hint" aria-hidden="true">
        {active ? "Stay curious." : "Say hello"}
      </span>
    </button>
  );
}
