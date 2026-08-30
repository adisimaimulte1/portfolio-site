import { SHELLS, STORAGE_KEYS } from "../config/constants.js";

export function loadEntries() {
  try {
    const entries = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.terminalEntries) || "[]");
    return Array.isArray(entries)
      ? entries
        .filter(({ command, startedAt }) => typeof command === "string" && Number.isFinite(startedAt))
        .map((entry) => ({ ...entry, shell: Object.values(SHELLS).includes(entry.shell) ? entry.shell : SHELLS.powershell }))
      : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries) {
  sessionStorage.setItem(STORAGE_KEYS.terminalEntries, JSON.stringify(entries));
}

export function clearEntries() {
  sessionStorage.removeItem(STORAGE_KEYS.terminalEntries);
}

export function markTerminalCleared() {
  sessionStorage.setItem(STORAGE_KEYS.terminalCleared, "true");
}

export function clearTerminalClearedState() {
  sessionStorage.removeItem(STORAGE_KEYS.terminalCleared);
}

export function wasTerminalCleared() {
  return sessionStorage.getItem(STORAGE_KEYS.terminalCleared) === "true";
}

export function loadScrollPosition() {
  const position = Number(sessionStorage.getItem(STORAGE_KEYS.scrollPosition));
  return Number.isFinite(position) ? position : 0;
}

export function saveScrollPosition(position) {
  sessionStorage.setItem(STORAGE_KEYS.scrollPosition, String(Math.max(0, position)));
}
