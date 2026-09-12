import { test, expect } from "@playwright/test";

test("navigation destinations and locally served images are valid", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Learn to code. Think for yourself.",
  );
  const missingTargets = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href")!)
        .filter((href) => !document.getElementById(href.slice(1))),
    );
  expect(missingTargets).toEqual([]);
  const images = await page
    .locator("img")
    .evaluateAll((elements) => [
      ...new Set(elements.map((image) => image.getAttribute("src")!)),
    ]);
  for (const source of images) {
    const response = await page.request.get(source);
    expect(response.ok(), source).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/");
  }
  expect(errors).toEqual([]);
});

test("the PRIMM tabs support pointer and keyboard selection", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .locator("#curriculum")
    .getByRole("tab", { name: /Investigate/ })
    .click();
  await expect(page.locator("#curriculum").getByRole("tabpanel")).toContainText(
    "Follow every change.",
  );
  await page
    .locator("#curriculum")
    .getByRole("tab", { name: /Investigate/ })
    .press("ArrowRight");
  await expect(
    page.locator("#curriculum").getByRole("tab", { name: /Modify/ }),
  ).toBeFocused();
  await expect(page.locator("#curriculum").getByRole("tabpanel")).toContainText(
    "Change one thing.",
  );
  await page
    .locator("#curriculum")
    .getByRole("tab", { name: /Modify/ })
    .press("End");
  await expect(page.locator("#curriculum").getByRole("tabpanel")).toContainText(
    "Make the logic yours.",
  );
});

test("the exercise requires a prediction and supports trace, hints and reset", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const demo = page.locator(".trace-demo");
  await expect(demo.getByRole("button", { name: "Next step" })).toBeDisabled();
  await demo.getByRole("button", { name: "6", exact: true }).click();
  await demo.getByRole("button", { name: "Next step" }).click();
  await expect(demo.locator(".demo-feedback")).toContainText("total is 1");
  await demo.getByRole("button", { name: "Ask a question" }).click();
  await expect(demo.locator(".hint-message")).toContainText(
    "carry its previous value",
  );
  await demo.getByRole("button", { name: "Next step" }).click();
  await expect(demo.locator(".current-row")).toContainText("3");
  await demo.getByRole("button", { name: "Next step" }).click();
  await demo.getByRole("button", { name: "See output" }).click();
  await expect(demo.locator(".demo-feedback")).toContainText(
    "You understand it.",
  );
  await expect(
    demo.getByRole("button", { name: "Trace complete" }),
  ).toBeDisabled();
  await demo.getByRole("button", { name: "Reset exercise" }).click();
  await expect(demo.getByRole("button", { name: "Next step" })).toBeDisabled();
  await expect(demo.locator("tbody tr")).toHaveCount(1);
  await expect(demo.locator(".hint-message")).toHaveCount(0);
});

test("an incorrect prediction ends with a Socratic question", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const demo = page.locator(".trace-demo");
  await demo.getByRole("button", { name: "3", exact: true }).click();
  for (let i = 0; i < 3; i++)
    await demo.getByRole("button", { name: "Next step" }).click();
  await demo.getByRole("button", { name: "See output" }).click();
  await expect(demo.locator(".demo-feedback")).toHaveText(
    "The output is 6. At which step did your prediction and the trace diverge?",
  );
});

test("scroll pins the collage and reverses its image and text transitions", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  const scene = page.locator('[data-scene="story"]');
  await page.evaluate(() => document.fonts.ready);
  const bounds = await scene.boundingBox();
  expect(bounds).not.toBeNull();
  const start = bounds!.y;
  const travel = bounds!.height - 1000;
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    start + travel * 0.12,
  );
  await expect
    .poll(() =>
      scene
        .locator('[data-caption="0"]')
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeGreaterThan(0.9);
  const first = await scene
    .locator(".float-1")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    start + travel * 0.35,
  );
  await expect
    .poll(() =>
      scene
        .locator('[data-caption="1"]')
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeGreaterThan(0.9);
  expect((await scene.locator(".story-sticky").boundingBox())!.y).toBeCloseTo(
    0,
    0,
  );
  const second = await scene
    .locator(".float-1")
    .evaluate((el) => getComputedStyle(el).transform);
  expect(second).not.toBe(first);
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    start + travel * 0.96,
  );
  await expect
    .poll(() =>
      scene
        .locator(".story-finale")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeGreaterThan(0.95);
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    start + travel * 0.12,
  );
  await expect
    .poll(() =>
      scene
        .locator('[data-caption="0"]')
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeGreaterThan(0.9);
});

test("study artwork expands with scroll", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  const scene = page.locator('[data-scene="study"]');
  const bounds = await scene.boundingBox();
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    bounds!.y,
  );
  await expect
    .poll(() =>
      scene.evaluate((el) =>
        Number(getComputedStyle(el).getPropertyValue("--zoom")),
      ),
    )
    .toBeLessThan(0.03);
  const initial = (await scene.locator(".study-picture").boundingBox())!.width;
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    bounds!.y + (bounds!.height - 1000) * 0.85,
  );
  await expect
    .poll(() =>
      scene.evaluate((el) =>
        Number(getComputedStyle(el).getPropertyValue("--zoom")),
      ),
    )
    .toBeGreaterThan(0.99);
  expect(
    (await scene.locator(".study-picture").boundingBox())!.width,
  ).toBeGreaterThan(initial * 1.5);
});

test("mobile navigation closes on selection and Escape, with no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Curriculum" })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await expect(page).toHaveURL(/#curriculum$/);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}`,
    ).toBeTruthy();
  }
});

test("headings reveal cleanly and feature images stay inside their frames", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator(".feature-card").first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/is-revealed/);
  await expect
    .poll(() =>
      page
        .locator("#platform-title .reveal-line-inner")
        .last()
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
  const media = await card.locator(".feature-media").boundingBox();
  const copy = await card.locator(".feature-copy").boundingBox();
  expect(copy!.y).toBeGreaterThanOrEqual(media!.y + media!.height - 1);
  await card.hover();
  expect(
    await card
      .locator(".feature-media")
      .evaluate((el) => getComputedStyle(el).overflow),
  ).toBe("hidden");
});

test("Lenis eases real wheel input and anchors finish at their destination", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  const samples = page.evaluate(
    () =>
      new Promise<number[]>((resolve) => {
        const positions: number[] = [];
        const sample = () => {
          positions.push(window.scrollY);
          if (positions.length === 30) resolve(positions);
          else requestAnimationFrame(sample);
        };
        window.addEventListener("wheel", () => requestAnimationFrame(sample), {
          once: true,
        });
      }),
  );
  await page.mouse.move(1000, 600);
  await page.mouse.wheel(0, 900);
  const positions = await samples;
  expect(new Set(positions).size).toBeGreaterThan(4);
  expect(positions.some((y) => y > 0 && y < 850)).toBeTruthy();
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(890);
  await expect
    .poll(() =>
      page
        .locator(".hero-content")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Our method" })
    .click();
  await expect(page).toHaveURL(/#method$/);
  await expect(page.locator("#method")).toBeFocused();
  const top = await page
    .locator("#method")
    .evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(-1);
  expect(top).toBeLessThan(120);
});

test("reveals replay when scrolling back down", async ({ page }) => {
  await page.goto("/");
  const reveal = page.locator(".section-intro[data-reveal]").first();
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveClass(/is-revealed/);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(reveal).not.toHaveClass(/is-revealed/);
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveClass(/is-revealed/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
});

test("touch scrolling animates mobile scenes and navigation works at phone sizes", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  try {
    await page.goto(baseURL!);
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    const session = await context.newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 200, y: 700 }],
    });
    for (let y = 670; y >= 160; y -= 30) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 200, y }],
      });
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(300);
    await expect
      .poll(() =>
        page
          .locator(".hero-content")
          .evaluate((el) => Number(getComputedStyle(el).opacity)),
      )
      .toBe(1);
    await page.getByRole("button", { name: "Open menu" }).tap();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Our method" })
      .tap();
    await expect(page.locator("#method")).toBeFocused();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toHaveCount(0);
    for (const viewport of [
      { width: 320, height: 568 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 844, height: 390 },
    ]) {
      await page.setViewportSize(viewport);
      const scene = page.locator('[data-scene="story"]');
      await scene.evaluate((el) => {
        const sticky = el.querySelector(".story-sticky")!;
        window.scrollTo({
          top:
            scrollY +
            el.getBoundingClientRect().top +
            (el.clientHeight - sticky.clientHeight) * 0.36,
          behavior: "instant",
        });
      });
      await expect
        .poll(() =>
          scene
            .locator('[data-caption="1"]')
            .evaluate((el) => Number(getComputedStyle(el).opacity)),
        )
        .toBeGreaterThan(0.9);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `overflow at ${viewport.width}`,
      ).toBeTruthy();
      const caption = await scene.locator('[data-caption="1"]').boundingBox();
      expect(caption!.y).toBeGreaterThan(50);
      expect(caption!.y + caption!.height).toBeLessThan(viewport.height);
    }
  } finally {
    await context.close();
  }
});

test("reduced motion uses native scrolling and responds to preference changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator(".thinking-preview")).toBeVisible();
  expect(
    await page
      .locator(".question-art")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator(".editorial-statement")).toBeVisible();
});

test("scroll advances all five learning stages and reverses without losing manual navigation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  const names = ["Predict", "Run", "Investigate", "Modify", "Make"];
  for (const index of [0, 1, 2, 3, 4, 3, 1, 0]) {
    await page.locator("#curriculum").evaluate((el, index) => {
      const sticky = el.querySelector(".curriculum-sticky")!;
      window.scrollTo({
        top:
          scrollY +
          el.getBoundingClientRect().top +
          (el.clientHeight - sticky.clientHeight) * ((index + 0.4) / 5),
        behavior: "instant",
      });
    }, index);
    await expect(
      page
        .locator("#curriculum")
        .getByRole("tab", { name: new RegExp(names[index]) }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      (await page.locator(".curriculum-sticky").boundingBox())!.y,
    ).toBeCloseTo(0, 0);
  }
  await page.locator("#curriculum").getByRole("tab", { name: /Make/ }).click();
  await expect(page.locator("#curriculum").getByRole("tabpanel")).toContainText(
    "Make the logic yours.",
  );
  await page
    .locator("#curriculum")
    .getByRole("tab", { name: /Make/ })
    .press("ArrowLeft");
  await expect(
    page.locator("#curriculum").getByRole("tab", { name: /Modify/ }),
  ).toBeFocused();
  await expect(page.locator("#curriculum").getByRole("tabpanel")).toContainText(
    "Change one thing.",
  );
});

test("practice walkthrough loops while visible and hands control to the visitor", async ({
  page,
}) => {
  await page.goto("/");
  const demo = page.locator(".trace-demo");
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toHaveAttribute("data-demo-mode", "autoplay");
  await expect(demo.locator(".demo-feedback")).toContainText(
    "You understand it.",
    { timeout: 12000 },
  );
  await expect(demo.locator(".demo-feedback")).toContainText(
    "Begin with a prediction",
    { timeout: 5000 },
  );
  await demo.getByRole("button", { name: "3", exact: true }).click();
  await expect(demo).toHaveAttribute("data-demo-mode", "manual");
  await demo.getByRole("button", { name: "Next step" }).click();
  await page.waitForTimeout(1500);
  await expect(demo.locator("tbody tr")).toHaveCount(2);
  await demo.getByRole("button", { name: "Watch walkthrough" }).click();
  await expect(demo).toHaveAttribute("data-demo-mode", "autoplay");
  await expect(demo.locator(".demo-feedback")).toContainText("total is 1", {
    timeout: 5000,
  });
  await demo.getByRole("button", { name: "Try it yourself" }).click();
  await expect(demo).toHaveAttribute("data-demo-mode", "manual");
  await expect(demo.locator("tbody tr")).toHaveCount(1);
  await expect(demo.getByRole("button", { name: "Next step" })).toBeDisabled();
});

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
  { width: 844, height: 390 },
]) {
  test(`copy stays clear of artwork and learning panels fit at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    const pairs = [
      [".hero-content", ".hero-lab"],
      [".principles-content", ".principles-art"],
      [".judgment-copy", ".reasoning-path"],
      ...[1, 2, 3, 4].map((n) => [".gallery-copy", `.gallery-art-${n}`]),
    ];
    for (const [copy, art] of pairs) {
      const overlaps = await page.evaluate(
        ([copy, art]) => {
          const a = document.querySelector(copy)!.getBoundingClientRect();
          const b = document.querySelector(art)!.getBoundingClientRect();
          return (
            Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
            Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1
          );
        },
        [copy, art],
      );
      expect(overlaps, `${copy} crosses ${art}`).toBeFalsy();
    }
    for (const index of [0, 2, 4]) {
      await page.locator("#curriculum").evaluate(
        (el, index) =>
          window.scrollTo({
            top:
              scrollY +
              el.getBoundingClientRect().top +
              (el.clientHeight -
                el.querySelector(".curriculum-sticky")!.clientHeight) *
                ((index + 0.4) / 5),
            behavior: "instant",
          }),
        index,
      );
      await expect(
        page.locator('#curriculum [role="tab"][aria-selected="true"]'),
      ).toContainText(
        ["Predict", "Run", "Investigate", "Modify", "Make"][index],
      );
      const title = await page.locator(".curriculum-heading").boundingBox();
      const panel = await page.locator(".stage-panel").boundingBox();
      expect(title!.y).toBeGreaterThanOrEqual(70);
      expect(panel!.y + panel!.height).toBeLessThanOrEqual(viewport.height - 8);
    }
    await page.locator(".study-scene").evaluate((el) =>
      window.scrollTo({
        top:
          scrollY +
          el.getBoundingClientRect().top +
          (el.clientHeight - el.querySelector(".study-sticky")!.clientHeight) *
            0.7,
        behavior: "instant",
      }),
    );
    const title = await page.locator("#study-title").boundingBox();
    const picture = await page.locator(".study-picture").boundingBox();
    expect(title!.y + title!.height).toBeLessThanOrEqual(picture!.y);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
}

test("a prediction can take over while the automatic trace is already running", async ({
  page,
}) => {
  await page.goto("/");
  const demo = page.locator(".trace-demo");
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator(".demo-feedback")).toContainText("total is 1", {
    timeout: 7000,
  });
  await demo.getByRole("button", { name: "0", exact: true }).click();
  await expect(demo).toHaveAttribute("data-demo-mode", "manual");
  await expect(
    demo.getByRole("button", { name: "0", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(demo.locator("tbody tr")).toHaveCount(1);
  await page.waitForTimeout(1500);
  await expect(demo.locator("tbody tr")).toHaveCount(1);
});

test("kinetic type animates only in view and headline ink responds to scroll", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  const ribbon = page.locator(".primm-marquee");
  const track = page.locator(".marquee-track");
  expect(await track.evaluate((el) => el.getAnimations()[0].playState)).toBe(
    "paused",
  );
  await ribbon.scrollIntoViewIfNeeded();
  await expect(ribbon).toHaveClass(/is-in-view/);
  const first = await track.evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() => track.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(first);
  await page.mouse.move(1000, 600);
  await page.mouse.wheel(0, 180);
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations()[0].playbackRate))
    .toBeGreaterThan(1.05);
  await expect(page.locator("html")).not.toHaveClass(/lenis-scrolling/);
  const ink = page.locator("[data-ink]").first();
  await ink.evaluate((el) =>
    scrollTo({
      top: scrollY + el.getBoundingClientRect().top - innerHeight * 0.82,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      ink.evaluate((el) =>
        parseFloat(el.style.getPropertyValue("--ink-progress")),
      ),
    )
    .toBeLessThan(25);
  await ink.evaluate((el) =>
    scrollTo({
      top: scrollY + el.getBoundingClientRect().top - innerHeight * 0.28,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      ink.evaluate((el) =>
        parseFloat(el.style.getPropertyValue("--ink-progress")),
      ),
    )
    .toBeGreaterThan(95);
  await expect(ribbon).not.toHaveClass(/is-in-view/);
});

test("image curtains finish inside their frames and magnetic labels preserve button hit targets", async ({
  page,
}) => {
  await page.goto("/");
  const media = page.locator(".feature-media").first();
  await media.scrollIntoViewIfNeeded();
  await expect(media).toHaveClass(/is-revealed/);
  await expect
    .poll(() =>
      media.evaluate((el) => getComputedStyle(el, "::after").transform),
    )
    .toBe("matrix(1, 0, 0, 0, 0, 0)");
  const button = page.locator(".hero-actions .button").first();
  await button.scrollIntoViewIfNeeded();
  const bounds = await button.boundingBox();
  await button.hover({ position: { x: 14, y: 14 } });
  await expect
    .poll(() =>
      button
        .locator(".button-label")
        .evaluate((el) => el.style.getPropertyValue("--magnet-x")),
    )
    .not.toBe("");
  expect((await button.boundingBox())!.width).toBeCloseTo(bounds!.width, 0);
  await page.mouse.move(5, 5);
  await expect
    .poll(() =>
      button
        .locator(".button-label")
        .evaluate((el) => el.style.getPropertyValue("--magnet-x")),
    )
    .toBe("");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.locator(".primm-marquee").scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}`,
    ).toBeTruthy();
  }
});

test("artwork columns retain their width and reveal loaded images on desktop and mobile", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".wordmark")).toHaveText("socratescode");
  await expect(page.locator('img[src$=".gif"]')).toHaveCount(0);
  for (const width of [1830, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const selector of [
      ".principles-art",
      ".gallery-art-1",
      ".feature-media",
    ]) {
      const art = page.locator(selector).first();
      await art.scrollIntoViewIfNeeded();
      if (selector !== ".principles-art")
        await expect(art).toHaveClass(/is-revealed/);
      expect(
        (await art.boundingBox())!.width,
        selector + " at " + width,
      ).toBeGreaterThan(100);
      await expect
        .poll(() =>
          art
            .locator("img")
            .evaluate(
              (img) =>
                img instanceof HTMLImageElement &&
                img.complete &&
                img.naturalWidth > 0,
            ),
        )
        .toBeTruthy();
      if (selector !== ".principles-art")
        await expect
          .poll(() =>
            art.evaluate((el) => getComputedStyle(el, "::after").transform),
          )
          .toBe("matrix(1, 0, 0, 0, 0, 0)");
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
});

test("learning preview loops, pauses off screen, and lets visitors take control", async ({
  page,
}) => {
  await page.goto("/");
  const preview = page.locator(".thinking-preview");
  await preview.scrollIntoViewIfNeeded();
  for (const step of ["1", "2", "0"]) {
    await expect(preview).toHaveAttribute("data-preview-step", step, {
      timeout: 5000,
    });
  }
  await preview.getByRole("tab", { name: /Trace/ }).click();
  await expect(preview).toHaveAttribute("data-preview-mode", "paused");
  await expect(preview.getByRole("tabpanel")).toContainText(
    "Follow what changes.",
  );
  await page.waitForTimeout(4300);
  await expect(preview).toHaveAttribute("data-preview-step", "1");
  await preview.getByRole("tab", { name: /Trace/ }).press("ArrowRight");
  await expect(preview.getByRole("tab", { name: /Understand/ })).toBeFocused();
  await expect(preview.getByRole("tabpanel")).toContainText(
    "Know why the answer is 6.",
  );
  await preview.getByRole("button", { name: "Play preview" }).click();
  await expect(preview).toHaveAttribute("data-preview-mode", "autoplay");
  await page.locator(".judgment").scrollIntoViewIfNeeded();
  const paused = await preview.getAttribute("data-preview-step");
  await page.waitForTimeout(4300);
  await expect(preview).toHaveAttribute("data-preview-step", paused!);
});

test("product hero and approach stay readable without split-image layouts at every screen size", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(1500);
  await expect(page.locator(".hero-content img, .judgment img")).toHaveCount(0);
  for (const width of [1830, 1440, 1024, 844, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => scrollTo(0, 0));
    const layout = await page.evaluate(() => {
      const title = document
        .querySelector("#hero-title")!
        .getBoundingClientRect();
      const copy = document.querySelector(".hero-content")!;
      const lab = document.querySelector(".hero-lab")!.getBoundingClientRect();
      return {
        fits: title.left >= 0 && title.right <= innerWidth,
        height: title.height,
        overlap: copy.getBoundingClientRect().bottom > lab.top,
        opacity: getComputedStyle(copy).opacity,
        overflow: document.documentElement.scrollWidth > innerWidth,
        approachSize: parseFloat(
          getComputedStyle(document.querySelector("#judgment-title")!).fontSize,
        ),
      };
    });
    expect(layout.fits, "heading width at " + width).toBeTruthy();
    expect(layout.height).toBeLessThan(200);
    expect(layout.overlap, "copy/preview overlap at " + width).toBeFalsy();
    expect(layout.opacity).toBe("1");
    expect(layout.overflow, "overflow at " + width).toBeFalsy();
    expect(layout.approachSize).toBeLessThanOrEqual(56);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator(".judgment-link").click();
  await expect(page).toHaveURL(/#curriculum$/);
  await expect(page.locator("#curriculum-title")).toBeInViewport();
});

test("Socrates faces the visitor and sunglasses work by hover, keyboard and tap", async ({
  page,
}) => {
  await page.goto("/");
  const mentor = page.getByRole("button", { name: "Socrates sunglasses" });
  await expect(mentor.locator(".mentor-base")).toHaveAttribute(
    "src",
    "/images/socratic-mentor-front.webp",
  );
  await mentor.hover();
  await expect(mentor).toHaveAttribute("data-active", "true");
  await expect(mentor.locator(".mentor-glasses")).toHaveCSS("opacity", "1");
  await page.mouse.move(10, 10);
  await expect(mentor).toHaveAttribute("data-active", "false");
  await mentor.focus();
  await mentor.press("Enter");
  await expect(mentor).toHaveAttribute("aria-pressed", "true");
  await mentor.press("Escape");
  await expect(mentor).toHaveAttribute("aria-pressed", "false");
  const context = await page
    .context()
    .browser()!
    .newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
  try {
    const phone = await context.newPage();
    await phone.goto(page.url());
    const bust = phone.getByRole("button", { name: "Socrates sunglasses" });
    await bust.tap();
    await expect(bust).toHaveAttribute("aria-pressed", "true");
    await bust.tap();
    await expect(bust).toHaveAttribute("data-active", "false");
  } finally {
    await context.close();
  }
});

test("floating paintings move around a readable central question", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  for (const size of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(size);
    for (const progress of [0.1, 0.35, 0.6]) {
      await page
        .locator(".story-scene")
        .evaluate(
          (el, p) =>
            scrollTo({
              top:
                scrollY +
                el.getBoundingClientRect().top +
                (el.clientHeight - innerHeight) * p,
              behavior: "instant",
            }),
          progress,
        );
      await page.waitForTimeout(700);
      const collisions = await page.evaluate(() => {
        const captions = [
          ...document.querySelectorAll(".story-captions > *"),
        ].filter((el) => Number(getComputedStyle(el).opacity) > 0.5);
        const pictures = [...document.querySelectorAll(".float-image")];
        return captions.flatMap((c) =>
          pictures.filter((p) => {
            const a = c.getBoundingClientRect(),
              b = p.getBoundingClientRect();
            return (
              Math.min(a.right, b.right) > Math.max(a.left, b.left) &&
              Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top)
            );
          }),
        );
      });
      expect(
        collisions.length,
        "art overlaps caption at " + size.width + " / " + progress,
      ).toBe(0);
    }
  }
  const images = await page
    .locator("img")
    .evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src")));
  expect(new Set(images).size).toBe(images.length);
  await expect(
    page.locator('img[src="/images/socratic-laptop-complete.webp"]'),
  ).toHaveCount(1);
});

test("motion toggle controls Lenis and persists the choice", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.getByRole("button", { name: /Motion on/ }).click();
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.reload();
  await expect(page.getByRole("button", { name: /Motion off/ })).toBeVisible();
  await page.getByRole("button", { name: /Motion off/ }).click();
  await expect(page.locator("html")).toHaveClass(/lenis/);
});

test("legacy motion preferences do not disable the restored choreography", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("socrates-motion", "off"),
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await expect(page.getByRole("button", { name: /Motion on/ })).toBeVisible();
});
test("visitors can explicitly enable motion from the reduced setting", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.getByRole("button", { name: /Motion reduced/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await expect(page.locator("html")).toHaveClass(/lenis/);
});
