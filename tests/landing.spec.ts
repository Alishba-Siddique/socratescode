import { test, expect } from "@playwright/test";

test("navigation destinations and locally served images are valid", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Independent thinking.",
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
  await page.getByRole("tab", { name: /Investigate/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Follow every change.",
  );
  await page.getByRole("tab", { name: /Investigate/ }).press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Modify/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Change one thing.");
  await page.getByRole("tab", { name: /Modify/ }).press("End");
  await expect(page.getByRole("tabpanel")).toContainText(
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

test("reduced motion removes pinned scroll distances and preserves readable content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  await expect(page.locator('[data-caption="1"]')).toBeVisible();
  expect(
    await page
      .locator(".story-sticky")
      .evaluate((el) => getComputedStyle(el).position),
  ).not.toBe("sticky");
  expect(
    await page
      .locator(".study-sticky")
      .evaluate((el) => getComputedStyle(el).position),
  ).not.toBe("sticky");
});

test("headings reveal line by line and feature cards respond to pointer depth", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator("[data-tilt]").first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/is-revealed/);
  const heading = page.locator("#platform-title .reveal-line-inner");
  await expect(heading).toHaveCount(2);
  await expect
    .poll(() =>
      heading.last().evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
  await card.hover({ position: { x: 45, y: 55 } });
  await expect
    .poll(() => card.evaluate((el) => el.style.getPropertyValue("--tilt-y")))
    .not.toBe("");
  await page.mouse.move(5, 5);
  await expect
    .poll(() => card.evaluate((el) => el.style.getPropertyValue("--tilt-y")))
    .toBe("");
});

test("reduced motion can be enabled at runtime and keeps the header legible", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    window.scrollTo({ top: 1200, behavior: "instant" }),
  );
  await expect(page.locator(".site-header")).toHaveClass(/is-scrolled/);
  await expect
    .poll(() =>
      page
        .locator("html")
        .evaluate((el) =>
          Number(el.style.getPropertyValue("--reading-progress")),
        ),
    )
    .toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  await expect(page.locator(".motion-image")).toBeHidden();
  await expect(page.locator(".motion-poster")).toBeVisible();
  await expect(page.locator(".site-header")).toHaveClass(/is-scrolled/);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.locator(".site-header")).not.toHaveClass(/is-scrolled/);
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
        requestAnimationFrame(sample);
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
    .toBeLessThan(0.1);
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

test("reveals replay when scrolling back down and Lenis respects runtime motion preferences", async ({
  page,
}) => {
  await page.goto("/");
  const reveal = page.locator(".section-intro[data-reveal]").first();
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveClass(/is-revealed/);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(reveal).not.toHaveClass(/is-revealed/);
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveClass(/is-revealed/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/lenis|motion-ready/);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
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
      .toBeLessThan(0.8);
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

test("visitors can enable full animation despite OS reduced motion and persist a pause", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?motion=on");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await expect(page.locator(".motion-image")).toBeVisible();
  expect(
    await page
      .locator(".hero-art")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).not.toBe("none");
  await page.mouse.move(1100, 600);
  const samples = page.evaluate(
    () =>
      new Promise<number[]>((resolve) => {
        const values: number[] = [];
        const tick = () => {
          values.push(scrollY);
          if (values.length >= 24) resolve(values);
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
  );
  await page.mouse.wheel(0, 850);
  expect(new Set(await samples).size).toBeGreaterThan(4);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(800);
  await expect
    .poll(() =>
      page
        .locator(".hero-content")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeLessThan(0.1);
  await page.getByRole("button", { name: "Pause animations" }).click();
  await expect(page.locator("html")).not.toHaveClass(/lenis|motion-ready/);
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(page.locator(".motion-image")).toBeHidden();
  expect(
    await page
      .locator(".hero-art")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Enable animations" }),
  ).toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  await page.getByRole("button", { name: "Enable animations" }).click();
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
});
