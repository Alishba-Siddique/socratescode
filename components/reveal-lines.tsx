import type { CSSProperties } from "react";

/** Keep accessible heading text in the document while revealing each line separately. */
export function RevealLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <span className="reveal-line" key={line}>
          <span
            className="reveal-line-inner"
            style={{ "--line-delay": `${index * 120}ms` } as CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </>
  );
}
