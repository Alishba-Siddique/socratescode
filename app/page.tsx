import Image from "next/image";
import { RevealLines } from "@/components/reveal-lines";
import { Motion } from "@/components/motion";
import {
  AnimatedLabel,
  Curriculum,
  Header,
  Mark,
  TraceDemo,
} from "@/components/interactive";

const artwork: Record<
  string,
  { file: string; position?: string; animated?: boolean }
> = {
  hero: {
    file: "socratic-laptop-hero",
    position: "center",
  },
  arena: {
    file: "socratic-dialogue",
    position: "50% 40%",
  },
  scales: {
    file: "socratic-laptop-loop",
    position: "56% 40%",
    animated: true,
  },
  community: {
    file: "socratic-portrait",
    position: "50% 35%",
  },
  microscope: {
    file: "socratic-coding-academy",
    position: "62% 40%",
  },
  judgment: {
    file: "socratic-academy",
    position: "50% 40%",
  },
  study: {
    file: "socratic-coding-academy",
    position: "50% 40%",
  },
  "gallery-1": {
    file: "socratic-dialogue",
    position: "70% 50%",
  },
  "gallery-2": {
    file: "socratic-logic",
    position: "50% 45%",
  },
  "gallery-3": {
    file: "socratic-portrait",
    position: "50% 35%",
  },
  "gallery-4": {
    file: "socratic-laptop-study",
    position: "60% 40%",
  },
  "gallery-5": {
    file: "socratic-hero",
    position: "75% 35%",
  },
  "portrait-1": {
    file: "socratic-portrait",
    position: "50% 30%",
  },
  "portrait-2": {
    file: "socratic-dialogue",
    position: "28% 40%",
  },
  "portrait-3": {
    file: "socratic-logic",
    position: "50% 50%",
  },
  "portrait-4": {
    file: "socratic-coding-academy",
    position: "65% 45%",
  },
  "portrait-5": {
    file: "socratic-laptop-study",
    position: "30% 35%",
  },
  "portrait-6": {
    file: "socratic-portrait",
    position: "65% 35%",
  },
  "portrait-7": {
    file: "socratic-hero",
    position: "70% 40%",
  },
  "portrait-8": {
    file: "socratic-dialogue",
    position: "80% 35%",
  },
  "portrait-9": {
    file: "socratic-logic",
    position: "20% 40%",
  },
  "portrait-10": {
    file: "socratic-laptop-study",
    position: "75% 35%",
  },
  "portrait-11": {
    file: "socratic-coding-academy",
    position: "64% 35%",
  },
  "portrait-12": {
    file: "socratic-portrait",
    position: "50% 35%",
  },
};

function Art({
  name,
  alt = "",
  priority = false,
  className = "",
}: {
  name: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  const art = artwork[name];
  if (art.animated)
    return (
      <>
        <Image
          src="/images/socratic-laptop-loop.gif"
          alt={alt}
          fill
          unoptimized
          sizes="(max-width: 700px) 100vw, 50vw"
          className="motion-image"
          style={{ objectPosition: art.position }}
        />
        <Image
          src="/images/socratic-laptop-poster.webp"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 700px) 100vw, 50vw"
          className="motion-poster"
          style={{ objectPosition: art.position }}
        />
      </>
    );
  return (
    <Image
      style={{ objectPosition: art.position }}
      src={`/images/${art.file}.webp`}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      sizes="(max-width: 700px) 100vw, 60vw"
      className={className}
    />
  );
}

const features = [
  {
    number: "01",
    label: "QUESTIONS THAT BUILD UNDERSTANDING",
    title: (
      <>
        The Socratic
        <br />
        method
      </>
    ),
    description:
      "A thinking partner that asks the right question. Find the gap in your reasoning, then close it yourself.",
    image: "arena",
    href: "#method",
  },
  {
    number: "02",
    label: "MAKE THE INVISIBLE VISIBLE",
    title: (
      <>
        Visual code
        <br />
        tracing
      </>
    ),
    description:
      "Follow every variable, every branch, every iteration. See exactly what your code is doing, one step at a time.",
    image: "scales",
    href: "#practice",
  },
  {
    number: "03",
    label: "PROGRESS THAT BELONGS TO YOU",
    title: (
      <>
        Independent
        <br />
        problem solving
      </>
    ),
    description:
      "Build the confidence to approach unfamiliar problems. Less reliance on hints. More trust in your own thinking.",
    image: "community",
    href: "#principles",
  },
  {
    number: "04",
    label: "SMALL CHALLENGES. DEEP UNDERSTANDING.",
    title: (
      <>
        A curriculum
        <br />
        for the curious
      </>
    ),
    description:
      "From your first loop to algorithmic thinking. Five deliberate stages turn a small puzzle into lasting understanding.",
    image: "microscope",
    href: "#curriculum",
  },
];
const floating = [
  { image: "portrait-1", speed: -1.7, position: "float-1" },
  { image: "portrait-2", speed: -2.3, position: "float-2" },
  { image: "portrait-3", speed: -1.2, position: "float-3" },
  { image: "portrait-4", speed: -1.05, position: "float-4" },
  { image: "portrait-5", speed: -2.1, position: "float-5" },
  { image: "portrait-6", speed: -1.5, position: "float-6" },
  { image: "portrait-7", speed: -2.7, position: "float-7" },
  { image: "portrait-8", speed: -1.8, position: "float-8" },
  { image: "portrait-9", speed: -1.3, position: "float-9" },
  { image: "portrait-10", speed: -2.4, position: "float-10" },
];

export default function Home() {
  return (
    <Motion>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <div className="reading-progress" aria-hidden="true" />
      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-art">
            <Art
              name="hero"
              alt="Original illustration of Socrates in classical robes working thoughtfully on a modern laptop"
              priority
            />
          </div>
          <div className="hero-halftone" aria-hidden="true" />
          <div className="hero-content content-width">
            <h1 id="hero-title">
              <span className="hero-line">Independent thinking.</span>
            </h1>
            <p className="hero-description">
              A learning lab for programming logic.
              <br />
              Making you a better thinker, one question at a time.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#practice">
                <AnimatedLabel>Start thinking</AnimatedLabel>
              </a>
              <a className="button button-outline" href="#platform">
                <AnimatedLabel>Explore the platform</AnimatedLabel>
              </a>
            </div>
          </div>
          <div className="hero-foot">
            <span>HUMAN REASONING. COMPUTATIONAL RIGOR.</span>
            <a href="#platform" aria-label="Scroll to explore the platform">
              Scroll to explore <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section
          className="platform section-pad"
          id="platform"
          aria-labelledby="platform-title"
        >
          <div className="content-width">
            <div className="section-intro" data-reveal>
              <h2 id="platform-title">
                <RevealLines lines={["Meet your new", "way of thinking."]} />
              </h2>
              <p>
                Code is the output. Understanding is the goal.
                <br className="desktop-break" /> Build the logic, confidence,
                and independence
                <br className="desktop-break" /> to solve problems that
                autocomplete can’t.
              </p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <a
                  href={feature.href}
                  className="feature-card"
                  data-tilt
                  key={feature.number}
                  data-reveal
                  aria-label={`Explore ${feature.number === "01" ? "the Socratic method" : feature.number === "02" ? "visual code tracing" : feature.number === "03" ? "independent problem solving" : "the curriculum"}`}
                >
                  <Art name={feature.image} />
                  <span className="feature-eyebrow">{feature.label}</span>
                  <div className="feature-bottom">
                    <div className="feature-heading">
                      <h3>{feature.title}</h3>
                      <span className="feature-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                    <div className="feature-detail">
                      <p>{feature.description}</p>
                      <span className="feature-link">
                        Explore <span aria-hidden="true">↗</span>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          className="story-scene"
          id="method"
          data-scene="story"
          aria-label="Our philosophy: learning to think independently"
        >
          <div className="story-sticky">
            <div className="floating-gallery" aria-hidden="true">
              {floating.map((item) => (
                <div
                  key={item.position}
                  className={`float-image ${item.position}`}
                  data-float={item.speed}
                >
                  <Art name={item.image} />
                </div>
              ))}
            </div>
            <div className="story-captions">
              <h2 data-caption="0">
                Built for real-world
                <br />
                independent thinking.
              </h2>
              <p data-caption="1">
                An AI that believes the best answer
                <br />
                starts with a better question.
              </p>
              <p data-caption="2">
                Because understanding
                <br />
                is something you build.
              </p>
            </div>
            <div className="story-finale content-width">
              <h2>
                The
                <br />
                Art of
                <br />
                Thinking
                <br />
                for Yourself.
              </h2>
              <div className="finale-art">
                <Art
                  name="community"
                  alt="Original marble-style portrait of Socrates"
                />
              </div>
            </div>
            <span className="story-running-label">
              THE MIND IS NOT A VESSEL TO BE FILLED.
            </span>
          </div>
        </section>

        <section className="primm-band" aria-label="Our learning framework">
          <p>
            A deliberate process.
            <br />
            <span>A different kind of progress.</span>
          </p>
          <div>
            {["Predict", "Run", "Investigate", "Modify", "Make"].map(
              (word, index) => (
                <span key={word} data-reveal>
                  <sup>0{index + 1}</sup>
                  {word}
                </span>
              ),
            )}
          </div>
        </section>

        <section
          className="principles"
          id="principles"
          aria-labelledby="principles-title"
        >
          <div className="principles-art" data-parallax="0.1">
            <Art name="gallery-3" />
          </div>
          <div className="principles-shade" />
          <div className="content-width principles-content" data-reveal>
            <span className="eyebrow">THE MISSING SIGNAL: UNDERSTANDING</span>
            <h2 id="principles-title">
              <RevealLines
                lines={[
                  "Connecting the dots.",
                  "Without connecting",
                  "to autocomplete.",
                ]}
              />
            </h2>
            <p>
              SocratesCode helps you move from recognizing syntax to reasoning
              through a problem. Trace the state. Question your assumptions.
              Make the next step your own.
            </p>
            <div className="topic-tags">
              <a href="#curriculum">Control flow</a>
              <a href="#curriculum">Algorithms</a>
              <a href="#curriculum">Problem solving</a>
              <a href="#practice">Visual tracing</a>
              <a href="#method">Socratic thinking</a>
              <a href="#curriculum">Interview foundations</a>
            </div>
          </div>
          <div className="principle-stats">
            <div data-reveal>
              <span>5</span>
              <p>deliberate learning stages</p>
            </div>
            <div data-reveal>
              <span>0</span>
              <p>AI-generated solutions</p>
            </div>
            <div data-reveal>
              <span>100%</span>
              <p>your own reasoning</p>
            </div>
          </div>
        </section>

        <section
          className="editorial-statement content-width"
          aria-label="Questions that make you think"
        >
          <div className="statement-line" data-reveal data-drift="-1">
            <span>Questions</span>
          </div>
          <div
            className="statement-line align-right"
            data-reveal
            data-drift="1"
          >
            <div className="inline-portrait">
              <Art name="portrait-11" />
            </div>
            <span>that</span>
          </div>
          <div
            className="statement-line align-center"
            data-reveal
            data-drift="-1"
          >
            <span>make you</span>
          </div>
          <div className="statement-line" data-reveal data-drift="1">
            <div className="inline-portrait">
              <Art name="portrait-12" />
            </div>
            <span>think.</span>
          </div>
          <div className="statement-note" data-reveal>
            <p>
              Progress is more than passing a test.
              <br />
              It’s knowing why your solution works.
            </p>
            <a className="button button-dark" href="#practice">
              <AnimatedLabel>Find your next question</AnimatedLabel>
            </a>
          </div>
        </section>

        <section className="judgment" aria-labelledby="judgment-title">
          <div className="judgment-art" data-parallax="0.12">
            <Art name="judgment" />
          </div>
          <div className="judgment-copy" data-reveal>
            <h2 id="judgment-title">
              <RevealLines
                lines={["Code is everywhere.", "Understanding is everything."]}
              />
            </h2>
            <p>
              Go beyond the right answer.
              <br />
              Build the reasoning that gets you there.
            </p>
            <a className="button button-dark" href="#curriculum">
              <AnimatedLabel>Explore the method</AnimatedLabel>
            </a>
          </div>
        </section>

        <section
          className="curriculum-section section-pad"
          id="curriculum"
          aria-labelledby="curriculum-title"
        >
          <div className="content-width">
            <div className="curriculum-heading" data-reveal>
              <span className="eyebrow">FIVE STAGES. A NEW WAY TO LEARN.</span>
              <h2 id="curriculum-title">
                <RevealLines lines={["From ?it works?", "to ?I know why.?"]} />
              </h2>
              <p>
                A small puzzle. Five powerful perspectives.
                <br />
                Meet PRIMM, your framework for independent learning.
              </p>
            </div>
            <div data-reveal>
              <Curriculum />
            </div>
          </div>
        </section>

        <section className="gallery-section" aria-labelledby="gallery-title">
          <div className="gallery-copy" data-reveal>
            <h2 id="gallery-title">
              <RevealLines
                lines={["A place for", "the independently minded."]}
              />
            </h2>
            <p>
              For the developers who want to know how.
              <br />
              And the curious minds who keep asking why.
            </p>
            <a className="button button-dark" href="#practice">
              <AnimatedLabel>Enter the thinking lab</AnimatedLabel>
            </a>
          </div>
          <div className="gallery-art gallery-art-1" data-parallax="-0.14">
            <Art name="gallery-1" />
          </div>
          <div className="gallery-art gallery-art-2" data-parallax="0.13">
            <Art name="gallery-2" />
          </div>
          <div className="gallery-art gallery-art-3" data-parallax="-0.1">
            <Art name="gallery-4" />
          </div>
          <div className="gallery-art gallery-art-4" data-parallax="0.18">
            <Art name="gallery-5" />
          </div>
        </section>

        <section
          className="study-scene"
          data-scene="study"
          aria-labelledby="study-title"
        >
          <div className="study-sticky">
            <div className="study-intro">
              <span className="eyebrow">
                THE TOOLS CHANGE. THE THINKING IS YOURS.
              </span>
              <p>
                Use AI to deepen your understanding.
                <br />
                Keep your curiosity in the driver’s seat.
              </p>
            </div>
            <div className="study-picture">
              <Art
                name="study"
                alt="Original illustration of Socrates teaching three students how to code on laptops in a Greek academy"
              />
              <div className="study-overlay" />
              <h2 id="study-title">
                AI doesn’t replace
                <br className="mobile-break" /> understanding.
              </h2>
            </div>
            <div className="study-bottom">
              <p>It starts with a question.</p>
              <a className="button button-outline" href="#practice">
                <AnimatedLabel>Make your first prediction</AnimatedLabel>
              </a>
            </div>
            <span className="orbit-token token-1" aria-hidden="true">
              {"{ }"}
            </span>
            <span className="orbit-token token-2" aria-hidden="true">
              f(x)
            </span>
            <span className="orbit-token token-3" aria-hidden="true">
              <Mark />
            </span>
            <span className="orbit-token token-4" aria-hidden="true">
              ↗
            </span>
          </div>
        </section>

        <section
          className="practice-scene"
          id="practice"
          data-scene="practice"
          aria-labelledby="practice-title"
        >
          <div className="practice-sticky">
            <div className="practice-heading" data-reveal>
              <span className="eyebrow">LESS SCROLLING. MORE THINKING.</span>
              <h2 id="practice-title">
                <RevealLines
                  lines={["Your next breakthrough", "starts with a question."]}
                />
              </h2>
            </div>
            <div className="practice-card-wrap">
              <TraceDemo />
            </div>
            <p className="practice-note">
              No account. No generated answers. Just you and a little logic.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="content-width">
          <div className="footer-top">
            <a href="#home" className="footer-symbol" aria-label="Back to top">
              <Mark />
            </a>
            <p>
              An open-source learning lab for
              <br />
              logic, curiosity, and independent thought.
              <br />
              <span>Built for the human behind the code.</span>
            </p>
            <nav aria-label="Footer navigation">
              <a href="#platform">The platform ↗</a>
              <a href="#method">Our method ↗</a>
              <a href="#curriculum">The curriculum ↗</a>
              <a href="#practice">Start thinking ↗</a>
            </nav>
          </div>
          <a
            href="#home"
            className="footer-wordmark"
            aria-label="SocratesCode, back to top"
          >
            Socrates<span>code</span>
            <span className="footer-asterisk" aria-hidden="true">
              ✳
            </span>
          </a>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} SocratesCode</span>
            <span>Good questions. Independent minds.</span>
            <a href="#home">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </Motion>
  );
}
