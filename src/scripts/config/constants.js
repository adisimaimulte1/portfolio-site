export const SELECTORS = Object.freeze({
  themeButton: "#theme-button",
  terminal: ".terminal",
  terminalForm: "#terminal-form",
  terminalInput: "#terminal-input",
  terminalHistory: "#terminal-history",
  terminalHint: "#terminal-hint",
  shellHelpCommand: "#shell-help-command"
});

export const THEMES = Object.freeze({ light: "light", dark: "dark", strawberry: "strawberry" });
export const SHELLS = Object.freeze({ powershell: "powershell", linux: "linux" });
export const STORAGE_KEYS = Object.freeze({ theme: "theme", previousTheme: "previousAccentTheme", shell: "terminalShell", terminalEntries: "terminalEntries", scrollPosition: "terminalScrollPosition", commandHistory: "terminalCommandHistory", terminalCleared: "terminalCleared" });
export const COMMAND_HISTORY_LIMIT = 10;
export const MEDIA_QUERIES = Object.freeze({ darkMode: "(prefers-color-scheme: dark)" });
export const REVEAL = Object.freeze({ duration: 320, stagger: 75 });
export const AUTO_SCROLL = Object.freeze({
  viewportMargin: 32,
  positionTolerance: 1,
  movementTolerance: .5,
  settledFrameCount: 4,
  maximumFrameCount: 90
});
