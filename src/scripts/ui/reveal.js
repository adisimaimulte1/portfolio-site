import { REVEAL } from "../config/constants.js";

const TARGET_SELECTOR = [
  ".help-intro", ".command-list li", ".about-greeting", ".output-copy > p", ".year-group__year",
  ".work-card", ".project-card__header", ".project-card__summary", ".project-card__details > li",
  ".project-campaign", ".project-gallery > a", ".project-tags", ".project-links > a",
  ".contact-item", ".skill-card", ".strawberry-egg", ".hobby-item", ".empty-output", ".error-output"
].join(",");

const FRAME_SELECTOR = [
  ".history-entry__output",
  ".year-group__entries",
  ".contact-list",
  ".skill-list"
].join(",");

export function prepareReveal(output, startedAt) {
  const elapsed = Math.max(0, Date.now() - startedAt);
  const targets = [...output.querySelectorAll(TARGET_SELECTOR)];

  targets.forEach((target, index) => {
    const targetStart = index * REVEAL.stagger;
    const targetEnd = targetStart + REVEAL.duration;
    if (elapsed >= targetEnd) return;
    target.classList.add("reveal-line");
    target.style.animationDelay = `${targetStart - elapsed}ms`;
  });

  const frames = [output, ...output.querySelectorAll(FRAME_SELECTOR)];
  [...new Set(frames)].forEach((frame) => {
    const firstContainedTarget = targets.findIndex((target) => frame.contains(target));
    const contentEnd = targets.length
      ? ((targets.length - 1) * REVEAL.stagger) + REVEAL.duration
      : 0;
    const frameStart = frame === output
      ? contentEnd
      : Math.max(0, firstContainedTarget) * REVEAL.stagger;
    if (elapsed >= frameStart + REVEAL.duration) return;
    frame.classList.add("reveal-frame");
    frame.style.animationDelay = `${frameStart - elapsed}ms`;
  });

  return waitForReveal(output);
}

async function waitForReveal(output) {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const animations = output.getAnimations({ subtree: true });
  if (animations.length) await Promise.allSettled(animations.map(({ finished }) => finished));
}
