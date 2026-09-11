import { STORAGE_KEYS, THEMES } from "../config/constants.js";

const root = document.documentElement;
let button;
let previousTheme = THEMES.light;
let viewportAnimation = null;
let viewportAnimationFrame = null;
let previousButtonTop = null;

export function initializeTheme(themeButton) {
  button = themeButton;
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const savedPreviousTheme = localStorage.getItem(STORAGE_KEYS.previousTheme);
  if ([THEMES.light, THEMES.dark].includes(savedPreviousTheme)) previousTheme = savedPreviousTheme;
  else if ([THEMES.light, THEMES.dark].includes(savedTheme)) previousTheme = savedTheme;
  setTheme(savedTheme || THEMES.light);
  button.addEventListener("click", () => toggleTheme(true));
  button.addEventListener("animationend", () => button.classList.remove("is-changing"));
  initializeViewportAnimation();
}

export function toggleTheme(remember = true) {
  const nextTheme = root.dataset.theme === THEMES.strawberry
    ? previousTheme
    : root.dataset.theme === THEMES.dark ? THEMES.light : THEMES.dark;
  setTheme(nextTheme);
  if (remember) localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  rememberStandardTheme(nextTheme);
  animateButton();
  return nextTheme;
}

export function setAccentTheme(theme, remember = true) {
  if (theme === THEMES.strawberry && [THEMES.light, THEMES.dark].includes(root.dataset.theme)) {
    rememberStandardTheme(root.dataset.theme);
  } else if ([THEMES.light, THEMES.dark].includes(theme)) {
    rememberStandardTheme(theme);
  }
  setTheme(theme);
  if (remember) localStorage.setItem(STORAGE_KEYS.theme, theme);
  animateButton();
  return theme;
}

function setTheme(theme) {
  const isDark = theme === THEMES.dark;
  const label = theme === THEMES.strawberry
    ? `Return to ${previousTheme === THEMES.dark ? "purple" : "orange"} accent`
    : `Switch to ${isDark ? "orange" : "purple"} accent`;
  root.dataset.theme = theme;
  button.setAttribute("aria-label", label);
  button.setAttribute("aria-pressed", String(isDark));
}

function rememberStandardTheme(theme) {
  if (![THEMES.light, THEMES.dark].includes(theme)) return;
  previousTheme = theme;
  localStorage.setItem(STORAGE_KEYS.previousTheme, theme);
}

function animateButton() {
  button.classList.remove("is-changing");
  void button.offsetWidth;
  button.classList.add("is-changing");
}

function initializeViewportAnimation() {
  if (!window.visualViewport) return;
  requestAnimationFrame(() => {
    previousButtonTop = button.getBoundingClientRect().top;
  });
  window.visualViewport.addEventListener("resize", animateViewportShift);
}

function animateViewportShift() {
  cancelAnimationFrame(viewportAnimationFrame);
  viewportAnimationFrame = requestAnimationFrame(() => {
    const previousVisualTop = viewportAnimation
      ? button.getBoundingClientRect().top
      : previousButtonTop;
    viewportAnimation?.cancel();

    const nextTop = button.getBoundingClientRect().top;
    previousButtonTop = nextTop;
    const offset = previousVisualTop === null ? 0 : previousVisualTop - nextTop;
    if (Math.abs(offset) < 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The old position can fall outside the resized keyboard viewport. Keep the
    // visible slide short and fade it in so the viewport edge never clips it.
    const visibleOffset = Math.sign(offset) * Math.min(Math.abs(offset), button.offsetHeight * .4);
    viewportAnimation = button.animate([
      { translate: `0 ${visibleOffset}px`, opacity: offset > 0 ? 0 : 1 },
      { translate: "0 0", opacity: 1 }
    ], {
      duration: 300,
      easing: "cubic-bezier(.22, 1, .36, 1)"
    });
    viewportAnimation.addEventListener("finish", () => {
      viewportAnimation = null;
    }, { once: true });
  });
}
