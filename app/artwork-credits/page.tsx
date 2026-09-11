import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Artwork & inspiration — SocratesCode",
};
export default function ArtworkCredits() {
  return (
    <main className="credits-page content-width">
      <Link href="/" className="text-link">
        ← Back to SocratesCode
      </Link>
      <h1>
        Old questions.
        <br />
        An original perspective.
      </h1>
      <p>
        SocratesCode brings classical philosophy into a modern coding lab. Our
        original illustrations imagine Socrates working at a laptop, questioning
        a student, and teaching a small group how to think through code.
      </p>
      <article>
        <h2>Original artwork</h2>
        <p>
          The illustrations on this site were generated specifically for
          SocratesCode with AI image generation, from original written art
          direction. Their classical painting style, warm ivory and cocoa
          palette, and subtle canvas textures connect ancient philosophical
          inquiry with contemporary computing.
        </p>
        <p>
          No Contra Labs, Pinterest, or museum images are used in the finished
          site. The scenes are imaginative illustrations, not historical
          depictions.
        </p>
      </article>
      <article>
        <h2>Motion, made for the web</h2>
        <p>
          The laptop scenes show code on the interior display, with hands
          resting naturally on the keyboard. A separate live code preview loops
          through prediction, tracing, and understanding. Slow artwork movement,
          image reveals, kinetic typography, and expanding scenes accompany
          scrolling.
        </p>
      </article>
      <article>
        <h2>Visual inspiration</h2>
        <p>
          The editorial layout and scroll storytelling are inspired by{" "}
          <a href="https://contralabs.com/">Contra Labs</a>. The SocratesCode
          branding, product content, illustrations, and interactive learning
          demo were created for this project.
        </p>
      </article>
      <article>
        <h2>Typography</h2>
        <p>
          Instrument Serif, Manrope, and JetBrains Mono are self-hosted fonts
          distributed under the SIL Open Font License.
        </p>
        <p>
          <a href="/fonts/instrumentserif-LICENSE.txt">
            Instrument Serif license
          </a>{" "}
          · <a href="/fonts/manrope-LICENSE.txt">Manrope license</a> ·{" "}
          <a href="/fonts/jetbrainsmono-LICENSE.txt">JetBrains Mono license</a>
        </p>
      </article>
    </main>
  );
}
