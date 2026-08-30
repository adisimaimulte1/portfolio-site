import { SHELLS, STORAGE_KEYS } from "../config/constants.js";

const ACTIONS = Object.freeze({
  powershell: {
    help: "help", about: "about", projects: "projects", awards: "awards",
    skills: "skills", contact: "contact", theme: "theme", clear: "clear"
  },
  linux: {
    help: "man", about: "cat about.txt", projects: "ls projects", awards: "ls awards",
    skills: "cat skills.txt", contact: "cat contact.txt", theme: "accent", clear: "clear"
  }
});

const DESCRIPTIONS = Object.freeze({
  about: "Learn who I am and what I create", projects: "Show project filtering options",
  awards: "Show award filtering options", skills: "Choose a skill category",
  contact: "Choose a contact method", theme: "Choose orange or purple accents",
  clear: "Clear the terminal history", help: "Show this command reference"
});

export function loadShell() {
  const saved = sessionStorage.getItem(STORAGE_KEYS.shell);
  return Object.values(SHELLS).includes(saved) ? saved : SHELLS.powershell;
}

export function saveShell(shell) {
  sessionStorage.setItem(STORAGE_KEYS.shell, shell);
}

export function getPromptHtml(shell) {
  return shell === SHELLS.linux
    ? `<span class="prompt"><span class="prompt__part">adrian@portfolio</span><span class="prompt__shell">:~$</span></span>`
    : `<span class="prompt"><span class="prompt__shell">PS C:\\</span><span class="prompt__part">Users</span><span class="prompt__shell">\\</span><span class="prompt__part">Adrian</span><span class="prompt__shell">\\</span><span class="prompt__part">Portfolio</span><span class="prompt__shell">&gt;</span></span>`;
}

export function getPublicCommands(shell) {
  return Object.entries(ACTIONS[shell]).map(([action, name]) => ({ name, description: DESCRIPTIONS[action] }));
}

export function getShellCommand(shell, action) {
  return ACTIONS[shell][action];
}

export function parseShellCommand(rawCommand, shell) {
  const input = rawCommand.trim();
  if (shell === SHELLS.powershell && input.toLowerCase() === "cls") return { action: "clear", args: [] };
  const definitions = Object.entries(ACTIONS[shell]).sort((a, b) => b[1].length - a[1].length);
  const match = definitions.find(([, command]) => input.toLowerCase() === command || input.toLowerCase().startsWith(`${command} `));
  if (!match) return { action: null, args: [] };
  const [action, command] = match;
  return { action, args: input.slice(command.length).trim().split(/\s+/).filter(Boolean) };
}
