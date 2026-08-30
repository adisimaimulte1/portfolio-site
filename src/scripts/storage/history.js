import { COMMAND_HISTORY_LIMIT, STORAGE_KEYS } from "../config/constants.js";

export function loadCommandHistory() {
  try {
    const commands = JSON.parse(localStorage.getItem(STORAGE_KEYS.commandHistory) || "[]");
    return Array.isArray(commands)
      ? commands.filter((command) => typeof command === "string").slice(-COMMAND_HISTORY_LIMIT)
      : [];
  } catch {
    return [];
  }
}

export function saveCommandHistory(commands) {
  const recentCommands = commands.slice(-COMMAND_HISTORY_LIMIT);
  localStorage.setItem(STORAGE_KEYS.commandHistory, JSON.stringify(recentCommands));
  return recentCommands;
}
