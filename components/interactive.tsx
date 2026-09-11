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
          Socrates<span>_code</span>
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
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % stages.length;
    else if (event.key === "ArrowLeft")
      next = (index + stages.length - 1) % stages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };
  return (
    <div className="curriculum-widget">
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
            onClick={() => setActive(index)}
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
        key={active}
        className="stage-panel"
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
      >
        <div className="stage-description">
          <span className="eyebrow">THE PRIMM FRAMEWORK / {stage.number}</span>
          <h3>{stage.title}</h3>
          <p>{stage.body}</p>
          <a className="text-link" href="#practice">
            Try it for yourself <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="code-preview">
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
  return (
    <div className="trace-demo">
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
            disabled={step > 0}
            onClick={() => setPrediction(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="demo-feedback" role="status" aria-live="polite">
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
          onClick={() => setHint(!hint)}
          aria-expanded={hint}
        >
          {hint ? "Hide question" : "Ask a question"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        <div>
          <button
            className="reset-button"
            onClick={reset}
            aria-label="Reset exercise"
          >
            ↺ <span>Reset</span>
          </button>
          <button
            className="button button-dark"
            disabled={prediction === null || finished}
            onClick={() =>
              setStep((value) => Math.min(value + 1, trace.length - 1))
            }
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
