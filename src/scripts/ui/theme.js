import { MEDIA_QUERIES, STORAGE_KEYS, THEMES } from "../config/constants.js";

const root = document.documentElement;
const systemTheme = window.matchMedia(MEDIA_QUERIES.darkMode);
let button;
let previousTheme = THEMES.light;

export function initializeTheme(themeButton) {
  button = themeButton;
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const savedPreviousTheme = localStorage.getItem(STORAGE_KEYS.previousTheme);
  if ([THEMES.light, THEMES.dark].includes(savedPreviousTheme)) previousTheme = savedPreviousTheme;
  else if ([THEMES.light, THEMES.dark].includes(savedTheme)) previousTheme = savedTheme;
  setTheme(savedTheme || (systemTheme.matches ? THEMES.dark : THEMES.light));
  button.addEventListener("click", () => toggleTheme(true));
  button.addEventListener("animationend", () => button.classList.remove("is-changing"));
  systemTheme.addEventListener("change", ({ matches }) => {
    if (!localStorage.getItem(STORAGE_KEYS.theme)) setTheme(matches ? THEMES.dark : THEMES.light);
  });
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
