"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m10 15-7 9 7 9m28-18 7 9-7 9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M15 12h18v4H15zM18 17v16m6-16v16m6-16v16M16 34h16v3H16zM13 39h22"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function AnimatedLabel({ children }: { children: string }) {
  return (
    <span className="button-label">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="site-header">
      <a
        className="brand-emblem"
        href="#home"
        aria-label="SocratesCode home"
        onClick={() => setOpen(false)}
      >
        <Mark />
      </a>
      <div className="nav-shell">
        <a className="wordmark" href="#home" onClick={() => setOpen(false)}>
          socratescode
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#platform">
            <AnimatedLabel>Platform</AnimatedLabel>
          </a>
          <a href="#method">
            <AnimatedLabel>Our method</AnimatedLabel>
          </a>
          <a href="#curriculum">
            <AnimatedLabel>Curriculum</AnimatedLabel>
          </a>
        </nav>
        <div className="nav-actions">
          <a className="button button-small button-outline" href="#principles">
            <AnimatedLabel>Why SocratesCode?</AnimatedLabel>
          </a>
          <a className="button button-small button-dark" href="#practice">
            <AnimatedLabel>Start thinking</AnimatedLabel>
          </a>
        </div>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span className={open ? "open" : ""} />
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          data-lenis-prevent
          aria-label="Mobile navigation"
        >
          {[
            ["Platform", "platform"],
            ["Our method", "method"],
            ["Curriculum", "curriculum"],
            ["Why SocratesCode?", "principles"],
            ["Start thinking", "practice"],
          ].map(([label, id]) => (
            <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>
              {label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

const stages = [
  {
    name: "Predict",
    number: "01",
    title: "Think before you run.",
    body: "Read a small piece of code. Predict its output. Make your mental model visible before the computer gives anything away.",
    question: "What will the value of total be when this loop finishes?",
    code: [
      "total = 0",
      "for number in [1, 2, 3]:",
      "    total = total + number",
      "print(total)",
    ],
  },
  {
    name: "Run",
    number: "02",
    title: "Meet your assumptions.",
    body: "Run the program and compare the result with your prediction. The gap between the two is where real learning begins.",
    question: "The output is 6. Does that match the path you imagined?",
    code: [
      "# Your prediction: ?",
      "# Actual output:",
      "6",
      "",
      "# What surprised you?",
    ],
  },
  {
    name: "Investigate",
    number: "03",
    title: "Follow every change.",
    body: "Step through execution, one line at a time. Track each variable and find the exact moment your understanding changes.",
    question: "After the second iteration, what has been added to total?",
    code: [
      "# iteration  | number | total",
      "#     1      |   1    |   1",
      "#     2      |   2    |   3",
      "#     3      |   3    |   6",
    ],
  },
  {
    name: "Modify",
    number: "04",
    title: "Change one thing.",
    body: "Make a small, deliberate change. Predict what it will do, test your reasoning, and connect cause with effect.",
    question: "What changes if the list contains a negative number?",
    code: [
      "total = 0",
      "for number in [1, -2, 3]:",
      "    total = total + number",
      "print(total)",
    ],
  },
  {
    name: "Make",
    number: "05",
    title: "Make the logic yours.",
    body: "Start with a blank canvas. Apply what you have understood to a fresh problem, with your own reasoning leading the way.",
    question: "How would you add only the even numbers in a list?",
    code: [
      "# Your next challenge:",
      "# Sum the even numbers.",
      "",
      "# Start with a prediction.",
      "# Build your own solution.",
    ],
  },
];

export function Curriculum() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = stages[active];
  useEffect(() => {
    const onStage = (event: Event) => {
      const index = (event as CustomEvent<number>).detail;
      if (Number.isInteger(index) && index >= 0 && index < stages.length)
        setActive(index);
    };
    window.addEventListener("socrates:stage", onStage);
    return () => window.removeEventListener("socrates:stage", onStage);
  }, []);
  const selectStage = (index: number) => {
    setActive(index);
    window.dispatchEvent(
      new CustomEvent("socrates:select-stage", { detail: index }),
    );
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % stages.length;
    else if (event.key === "ArrowLeft")
      next = (index + stages.length - 1) % stages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else return;
    event.preventDefault();
    selectStage(next);
    tabs.current[next]?.focus();
  };
  return (
    <div className="curriculum-widget">
      <div className="curriculum-scroll-hint">
        <span>SCROLL TO EXPLORE</span>
        <span>{stage.number} / 05</span>
      </div>
      <div
        className="stage-tabs"
        role="tablist"
        aria-label="PRIMM learning stages"
      >
        {stages.map((item, index) => (
          <button
            key={item.name}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            id={`tab-${index}`}
            role="tab"
            aria-selected={active === index}
            aria-controls={`panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            onKeyDown={(event) => onKey(event, index)}
            onClick={() => selectStage(index)}
          >
            <span>{item.number}</span>
            {item.name}
            <span className="tab-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>
      <div
        className="stage-panel"
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
      >
        <div key={`description-${active}`} className="stage-description">
          <span className="eyebrow">THE PRIMM FRAMEWORK / {stage.number}</span>
          <h3>{stage.title}</h3>
          <p>{stage.body}</p>
          <a className="text-link" href="#practice">
            Try it for yourself <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div key={`code-${active}`} className="code-preview">
          <div className="code-topline">
            <span className="status-dot" />
            a_small_beginning.py<span>PYTHON</span>
          </div>
          <pre data-lenis-prevent aria-label={`${stage.name} code example`}>
            {stage.code.map((line, index) => (
              <span className="code-line" key={index}>
                <span className="line-number" aria-hidden="true">
                  {index + 1}
                </span>
                <code>{line || " "}</code>
              </span>
            ))}
          </pre>
          <div className="socratic-note">
            <Mark />
            <p>{stage.question}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const trace = [
  {
    line: 1,
    number: "—",
    total: 0,
    label: "Initial state. total starts at 0.",
  },
  {
    line: 3,
    number: "1",
    total: 1,
    label: "Iteration 1. Add 1 to 0: total is 1.",
  },
  {
    line: 3,
    number: "2",
    total: 3,
    label: "Iteration 2. Add 2 to 1: total is 3.",
  },
  {
    line: 3,
    number: "3",
    total: 6,
    label: "Iteration 3. Add 3 to 3: total is 6.",
  },
  { line: 4, number: "3", total: 6, label: "Finished. The program prints 6." },
];

export function TraceDemo() {
  const demoRef = useRef<HTMLDivElement>(null);
  const [manual, setManual] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [hint, setHint] = useState(false);
  const current = trace[step];
  const finished = step === trace.length - 1;
  const reset = () => {
    setPrediction(null);
    setStep(0);
    setHint(false);
  };
  useEffect(() => {
    const element = demoRef.current;
    if (!element) return;
    let intersecting = false;
    const sync = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  useEffect(() => {
    if (manual || !visible) return;
    setPrediction(null);
    setStep(0);
    setHint(false);
    let phase = 0;
    let timer: ReturnType<typeof setTimeout>;
    const advance = () => {
      if (phase === 0) {
        setPrediction(6);
        setStep(0);
      } else if (phase < 5) setStep(phase);
      else {
        setPrediction(null);
        setStep(0);
      }
      const delay = phase === 4 ? 2200 : 1200;
      phase = (phase + 1) % 6;
      timer = setTimeout(advance, delay);
    };
    timer = setTimeout(advance, 1200);
    return () => clearTimeout(timer);
  }, [manual, visible]);
  return (
    <div
      ref={demoRef}
      className="trace-demo"
      data-demo-mode={manual ? "manual" : "autoplay"}
    >
      <div className="demo-playback">
        <span>
          <i aria-hidden="true" />
          {manual ? "YOUR TURN" : "LIVE WALKTHROUGH"}
        </span>
        <button
          type="button"
          onClick={() => {
            reset();
            setManual(!manual);
          }}
        >
          {manual ? "Watch walkthrough" : "Try it yourself"}
          <span aria-hidden="true"> ↗</span>
        </button>
      </div>
      <div className="demo-topline">
        <span>
          <span className="status-dot" />
          THE THINKING LAB
        </span>
        <span>001 / A SMALL BEGINNING</span>
      </div>
      <div className="demo-prompt">
        <span className="eyebrow">PREDICT THE OUTPUT</span>
        <h3>A little loop. A bigger question.</h3>
        <p>What does this program print? Make a prediction, then trace it.</p>
      </div>
      <div className="demo-workspace">
        <div className="demo-code">
          <div className="pane-label">
            a_small_beginning.py <span>PYTHON</span>
          </div>
          <pre data-lenis-prevent>
            {[
              "total = 0",
              "for number in [1, 2, 3]:",
              "    total = total + number",
              "print(total)",
            ].map((line, index) => (
              <span
                key={line}
                className={`code-line ${prediction !== null && current.line === index + 1 ? "active-line" : ""}`}
              >
                <span className="line-number" aria-hidden="true">
                  {index + 1}
                </span>
                <code>{line}</code>
              </span>
            ))}
          </pre>
        </div>
        <div className="trace-pane">
          <div className="pane-label">
            Trace table <span>LIVE STATE</span>
          </div>
          <table>
            <caption className="sr-only">
              Variable values at the current execution step
            </caption>
            <thead>
              <tr>
                <th>Step</th>
                <th>number</th>
                <th>total</th>
              </tr>
            </thead>
            <tbody>
              {trace.slice(0, step + 1).map((row, index) => (
                <tr key={index} className={index === step ? "current-row" : ""}>
                  <td>{index === 4 ? "Output" : index}</td>
                  <td>{row.number}</td>
                  <td>{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="prediction-row"
        role="group"
        aria-label="Choose your predicted output"
      >
        <span>Your prediction</span>
        {[3, 6, 0].map((value) => (
          <button
            key={value}
            className={prediction === value ? "selected" : ""}
            aria-pressed={prediction === value}
            disabled={manual && step > 0}
            onClick={() => {
              setManual(true);
              setStep(0);
              setPrediction(value);
            }}
          >
            {value}
          </button>
        ))}
      </div>
      <div
        className="demo-feedback"
        role="status"
        aria-live={manual ? "polite" : "off"}
      >
        {prediction === null
          ? "Begin with a prediction. The reasoning is yours."
          : finished
            ? prediction === 6
              ? "You predicted it. You traced it. You understand it."
              : "The output is 6. At which step did your prediction and the trace diverge?"
            : current.label}
      </div>
      {hint && (
        <div className="hint-message" role="status">
          <Mark />
          <p>
            {step < 2
              ? "Does total start over each time, or carry its previous value into the next iteration?"
              : "Look at the total from the previous row. What happens when the current number is added to it?"}
          </p>
        </div>
      )}
      <div className="demo-controls">
        <button
          className="text-link"
          onClick={() => {
            setManual(true);
            setHint(!hint);
          }}
          aria-expanded={hint}
        >
          {hint ? "Hide question" : "Ask a question"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        <div>
          <button
            className="reset-button"
            onClick={() => {
              setManual(true);
              reset();
            }}
            aria-label="Reset exercise"
          >
            ↺ <span>Reset</span>
          </button>
          <button
            className="button button-dark"
            disabled={prediction === null || finished}
            onClick={() => {
              setManual(true);
              setStep((value) => Math.min(value + 1, trace.length - 1));
            }}
          >
            {finished
              ? "Trace complete"
              : step === 3
                ? "See output"
                : "Next step"}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Autoplay demonstrates the method; visitors can pause or choose any stage. */
export function ThinkingPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (visible && !document.hidden && playing) {
        timer = setInterval(() => setStep((value) => (value + 1) % 3), 4000);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        ref.current?.classList.toggle("is-in-view", visible);
        sync();
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [playing]);
  const states = [
    {
      name: "Predict",
      title: "What will this print?",
      body: "Read the loop. Before running it, make a prediction about the final value of total.",
      result: "?",
      note: "Your prediction comes first.",
    },
    {
      name: "Trace",
      title: "Follow what changes.",
      body: "Each pass adds the next number to total. Follow the value from 0 to 1, then 3, then 6.",
      result: "0 → 1 → 3 → 6",
      note: "Three passes. One visible path.",
    },
    {
      name: "Understand",
      title: "Know why the answer is 6.",
      body: "The loop adds 1, 2, and 3. The result is 6 because total keeps its value between passes.",
      result: "6",
      note: "You can explain the result.",
    },
  ];
  const select = (index: number) => {
    setPlaying(false);
    setStep(index);
  };
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % 3
        : event.key === "ArrowLeft"
          ? (index + 2) % 3
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? 2
              : null;
    if (next === null) return;
    event.preventDefault();
    select(next);
    ref.current
      ?.querySelector<HTMLButtonElement>("#hero-preview-tab-" + next)
      ?.focus();
  };
  return (
    <div
      className="thinking-preview"
      ref={ref}
      data-preview-step={step}
      data-preview-mode={playing ? "autoplay" : "paused"}
    >
      <div className="thinking-preview-top">
        <span>
          <i className="live-dot" /> THE THINKING LAB
        </span>
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause preview" : "Play preview"}
        >
          {playing ? "Pause preview" : "Play preview"}
          <span aria-hidden="true">{playing ? "‖" : "▷"}</span>
        </button>
      </div>
      <div
        className="thinking-steps"
        role="tablist"
        aria-label="Preview stages"
      >
        {states.map((state, index) => (
          <button
            key={state.name}
            type="button"
            role="tab"
            id={"hero-preview-tab-" + index}
            aria-controls="hero-preview-panel"
            aria-selected={step === index}
            tabIndex={step === index ? 0 : -1}
            className={step === index ? "is-active" : ""}
            onClick={() => select(index)}
            onKeyDown={(event) => onTabKey(event, index)}
          >
            <span>0{index + 1}</span>
            {state.name}
            <i key={step + "-" + playing} />
          </button>
        ))}
      </div>
      <div
        className="thinking-preview-body"
        id="hero-preview-panel"
        role="tabpanel"
        aria-labelledby={"hero-preview-tab-" + step}
      >
        <div className="preview-code">
          <span className="preview-file">a_small_question.py</span>
          <pre aria-label="Python code: initialize total to zero, add each number in 1, 2, 3, then print total">
            <code>
              {[
                "total = 0",
                "for number in [1, 2, 3]:",
                "    total += number",
                "print(total)",
              ].map((line, index) => (
                <span
                  key={line}
                  className={
                    (step === 1 && index === 2) || (step === 2 && index === 3)
                      ? "code-is-active"
                      : ""
                  }
                >
                  <i aria-hidden="true">{index + 1}</i>
                  {line}
                </span>
              ))}
            </code>
          </pre>
          <span className="preview-code-note">
            A small example. A useful way to think.
          </span>
        </div>
        <div
          className="preview-explanation"
          key={step}
          aria-live={playing ? "off" : "polite"}
        >
          <h2>{states[step].title}</h2>
          <p>{states[step].body}</p>
          <div className="preview-result">
            <span
              className={
                step === 1 ? "thinking-output is-trace" : "thinking-output"
              }
            >
              {states[step].result}
            </span>
            <span>{states[step].note}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
