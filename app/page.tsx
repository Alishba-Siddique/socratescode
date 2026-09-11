import Image from "next/image";
import { RevealLines } from "@/components/reveal-lines";
import { Motion } from "@/components/motion";
import {
  AnimatedLabel,
  Curriculum,
  Header,
  ThinkingPreview,
  Mark,
  TraceDemo,
} from "@/components/interactive";

const artwork: Record<string, { file: string; position?: string }> = {
  hero: {
    file: "socratic-coder-v2",
    position: "center",
  },
  arena: {
    file: "socratic-dialogue",
    position: "50% 40%",
  },
  scales: {
    file: "socratic-coder-v2",
    position: "center",
  },
  community: {
    file: "socratic-portrait",
    position: "50% 35%",
  },
  microscope: {
    file: "socratic-mentoring-v2",
    position: "62% 40%",
  },
  judgment: {
    file: "socratic-mentoring-v2",
    position: "50% 40%",
  },
  study: {
    file: "socratic-mentoring-v2",
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
    file: "socratic-coder-v2",
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
    file: "socratic-mentoring-v2",
    position: "65% 45%",
  },
  "portrait-5": {
    file: "socratic-coder-v2",
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
    file: "socratic-coder-v2",
    position: "75% 35%",
  },
  "portrait-11": {
    file: "socratic-mentoring-v2",
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
          <a
            className="hero-seal"
            href="#practice"
            aria-label="Question, trace, understand: try the thinking lab"
          >
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <path
                  id="hero-seal-path"
                  d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                />
              </defs>
              <text>
                <textPath href="#hero-seal-path" textLength="238">
                  QUESTION. TRACE. UNDERSTAND.{" "}
                </textPath>
              </text>
            </svg>
            <span aria-hidden="true">?</span>
          </a>
          <div className="hero-content content-width">
            <p className="hero-kicker">
              <span /> A LEARNING LAB FOR THE CURIOUS
            </p>
            <h1 id="hero-title" aria-label="Independent thinking.">
              <span className="hero-line">
                <span className="hero-word">Independent</span>
              </span>{" "}
              <span className="hero-line hero-line-accent">
                <span className="hero-word">thinking.</span>
              </span>
            </h1>
            <div className="hero-details">
              <p className="hero-description">
                The future belongs to those who ask why.
                <br />
                Learn to code. Build the mind behind it.
              </p>
              <div className="hero-actions">
                <a className="button button-dark" href="#practice">
                  <AnimatedLabel>Start thinking</AnimatedLabel>
                  <span className="hero-button-arrow" aria-hidden="true">
                    &#8599;
                  </span>
                </a>
                <a className="button button-outline" href="#platform">
                  <AnimatedLabel>Explore the platform</AnimatedLabel>
                </a>
              </div>
              <ThinkingPreview />
            </div>
          </div>
          <div className="hero-art" data-ambient>
            <Art
              name="hero"
              alt="Socrates typing at a stone desk, with code on the laptop screen facing him"
              priority
            />
          </div>
          <div className="hero-art-caption" aria-hidden="true">
            <span>FIG. 01</span>
            <span>ANCIENT QUESTIONS. NEW POSSIBILITIES.</span>
          </div>
          <div className="hero-foot">
            <span>HUMAN REASONING. COMPUTATIONAL RIGOR.</span>
            <a href="#platform" aria-label="Scroll to explore the platform">
              SCROLL TO DISCOVER <span aria-hidden="true">&#8595;</span>
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
                  key={feature.number}
                  data-reveal
                  aria-label={`Explore ${feature.number === "01" ? "the Socratic method" : feature.number === "02" ? "visual code tracing" : feature.number === "03" ? "independent problem solving" : "the curriculum"}`}
                >
                  <div className="feature-media" data-image-reveal data-ambient>
                    <Art name={feature.image} />
                  </div>
                  <div className="feature-copy">
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
          <div className="primm-marquee" data-marquee>
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <div
                  className="marquee-group"
                  key={copy}
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  {["Predict", "Run", "Investigate", "Modify", "Make"].map(
                    (word, index) => (
                      <span className="marquee-word" key={word}>
                        <sup>0{index + 1}</sup>
                        {word}
                        <span className="marquee-separator" aria-hidden="true">
                          /
                        </span>
                      </span>
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="principles"
          id="principles"
          aria-labelledby="principles-title"
        >
          <div
            className="principles-art"
            data-image-reveal
            data-ambient
            data-parallax="0.1"
          >
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
          <div className="statement-line" data-reveal>
            <span data-ink>Questions</span>
          </div>
          <div className="statement-line align-right" data-reveal>
            <div className="inline-portrait">
              <Art name="portrait-11" />
            </div>
            <span data-ink>that</span>
          </div>
          <div className="statement-line align-center" data-reveal>
            <span data-ink>make you</span>
          </div>
          <div className="statement-line" data-reveal>
            <div className="inline-portrait">
              <Art name="portrait-12" />
            </div>
            <span data-ink>think.</span>
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
          <div className="judgment-topline" data-reveal>
            <span>THE SOCRATES CODE DIFFERENCE</span>
            <span>THINK DEEPER. BUILD BETTER.</span>
          </div>
          <div
            className="judgment-art"
            data-image-reveal
            data-ambient
            data-parallax="0.12"
          >
            <Art
              name="judgment"
              alt="Socrates teaching two students to code, pointing to the laptop screen"
            />
          </div>
          <div className="judgment-copy" data-reveal>
            <span className="judgment-index" aria-hidden="true">
              01 / THE MIND BEHIND THE CODE
            </span>
            <h2 id="judgment-title">
              <span className="judgment-heading-lead">
                Code is
                <br />
                everywhere.
              </span>{" "}
              <span className="judgment-heading-accent">
                Understanding
                <br />
                is everything.
              </span>
            </h2>
            <p>
              Go beyond the right answer.
              <br />
              Build the reasoning that gets you there.
            </p>
            <a className="judgment-link" href="#curriculum">
              <AnimatedLabel>Explore the method</AnimatedLabel>
              <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
          <div className="judgment-bottomline" data-reveal>
            <span>FROM KNOWING WHAT TO KNOWING WHY.</span>
            <span className="judgment-path" aria-hidden="true">
              <i />
              QUESTION<span>&#8594;</span>REASON<span>&#8594;</span>UNDERSTAND
            </span>
          </div>
        </section>

        <section
          className="curriculum-section"
          data-scene="curriculum"
          id="curriculum"
          aria-labelledby="curriculum-title"
        >
          <div className="curriculum-sticky">
            <div className="content-width">
              <div className="curriculum-heading" data-reveal>
                <span className="eyebrow">
                  FIVE STAGES. A NEW WAY TO LEARN.
                </span>
                <h2 id="curriculum-title">
                  <RevealLines
                    lines={[
                      "From \u2018it works\u2019",
                      "to \u2018I know why.\u2019",
                    ]}
                  />
                </h2>
                <p>
                  A small puzzle. Five powerful perspectives.
                  <br />
                  Meet PRIMM, your framework for independent learning.
                </p>
              </div>
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
          <div
            className="gallery-art gallery-art-1"
            data-image-reveal
            data-ambient
            data-parallax="-0.14"
          >
            <Art name="gallery-1" />
          </div>
          <div
            className="gallery-art gallery-art-2"
            data-image-reveal
            data-ambient
            data-parallax="0.13"
          >
            <Art name="gallery-2" />
          </div>
          <div
            className="gallery-art gallery-art-3"
            data-image-reveal
            data-ambient
            data-parallax="-0.1"
          >
            <Art name="gallery-4" />
          </div>
          <div
            className="gallery-art gallery-art-4"
            data-image-reveal
            data-ambient
            data-parallax="0.18"
          >
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
              <h2 id="study-title">
                AI doesn’t replace
                <br className="mobile-break" /> understanding.
              </h2>
            </div>
            <div className="study-picture">
              <Art
                name="study"
                alt="Original illustration of Socrates teaching three students how to code on laptops in a Greek academy"
              />
              <div className="study-overlay" />
            </div>
            <div className="study-bottom">
              <p>It starts with a question.</p>
              <a className="button button-outline" href="#practice">
                <AnimatedLabel>Make your first prediction</AnimatedLabel>
              </a>
            </div>
          </div>
        </section>

        <section
          className="practice-scene"
          id="practice"
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
