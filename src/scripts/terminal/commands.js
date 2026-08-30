import { SHELLS, THEMES } from "../config/constants.js";
import { PORTFOLIO_ITEMS } from "../data/portfolio.js";
import { PROJECTS } from "../data/projects.js";
import { CONTACTS } from "../data/contact.js";
import { SKILLS } from "../data/skills.js";
import { LINUX_HIDDEN_COMMANDS, POWERSHELL_HIDDEN_COMMANDS } from "../data/easter-eggs.js";
import { setAccentTheme } from "../ui/theme.js";
import { createAboutOutput, createContactOutput, createErrorOutput, createHelpOutput, createHiddenHelpOutput, createOptionsOutput, createPortfolioOutput, createProjectsOutput, createSkillsOutput } from "../ui/renderers.js";
import { resolveEasterEgg } from "./easter-eggs.js";
import { getPublicCommands, getShellCommand, parseShellCommand } from "./shells.js";

const OPTIONS = Object.freeze({
  projects: [
    { flag: "--all", alias: "-a", description: "Show every project" },
    { flag: "--latest", alias: "-l", description: "Show projects from the current year" },
    { flag: "--year", alias: "-y", description: "Filter by year" },
    { flag: "--category", alias: "-t", description: "Filter by CAD, Software, Marketing, or Robotics" },
    { flag: "--competition", alias: "-c", description: "Filter by FTC, FLL, or InfoEducație" }
  ],
  awards: [
    { flag: "--all", alias: "-a", description: "Show every award" },
    { flag: "--latest", alias: "-l", description: "Show awards from the latest year" },
    { flag: "--year", alias: "-y", description: "Filter awards by year" },
    { flag: "--competition", alias: "-c", description: "Filter awards by competition" },
    { flag: "--medals", alias: "-m", description: "Show medal-winning results" },
    { flag: "--team", alias: "-t", description: "Filter by team name or number" },
    { flag: "--search", alias: "-s", description: "Search placements, stages, and categories" }
  ],
  skills: [
    { flag: "--all", alias: "-a", description: "Show all skill areas" },
    { flag: "--robotics", alias: "-r", description: "Robotics and mechatronics" },
    { flag: "--software", alias: "-s", description: "Programming and software" },
    { flag: "--cad", alias: "-c", description: "Design and manufacturing" },
    { flag: "--marketing", alias: "-m", description: "Visual design and marketing" },
    { flag: "--leadership", alias: "-l", description: "Leadership and communication" },
    { flag: "--languages", alias: "-g", description: "Spoken languages" },
    { flag: "--ai", alias: "-i", description: "How I use AI in projects" }
  ],
  contact: [
    { flag: "--all", alias: "-a", description: "Show every contact method" },
    { flag: "--email", alias: "-e", description: "Show email address" },
    { flag: "--phone", alias: "-p", description: "Show phone number" },
    { flag: "--github", alias: "-g", description: "Open GitHub profile" },
    { flag: "--instagram", alias: "-i", description: "Open Instagram profile" },
    { flag: "--reddit", alias: "-r", description: "Open Reddit profile" },
    { flag: "--spotify", alias: "-s", description: "Open Spotify profile" },
    { flag: "--discord", alias: "-d", description: "Show Discord details" },
    { flag: "--social", alias: "", description: "Show every social profile" }
  ],
  theme: [
    { flag: "--light", alias: "-l", description: "Use the orange accent" },
    { flag: "--dark", alias: "-d", description: "Use the purple accent" }
  ]
});

export function resolveCommand(rawCommand, { isReplay = false, shell = SHELLS.powershell } = {}) {
  const normalizedRaw = rawCommand.trim().toLowerCase();
  if (shell === SHELLS.powershell && normalizedRaw === "linux") {
    return { shouldClear: false, nextShell: SHELLS.linux, html: `<p class="output-copy">Linux terminal activated. Type <strong class="accent">man</strong> to explore.</p>` };
  }
  if (shell === SHELLS.linux && normalizedRaw === "powershell") {
    return { shouldClear: false, nextShell: SHELLS.powershell, html: `<p class="output-copy">Windows PowerShell restored. Type <strong class="accent">help</strong> to explore.</p>` };
  }

  const easterEggOutput = resolveEasterEgg(rawCommand, shell);
  if (easterEggOutput) return { shouldClear: false, html: easterEggOutput };

  const { action, args } = parseShellCommand(rawCommand, shell);
  const [normalizedOption = "", ...values] = args.map((value) => value.toLowerCase());

  if (action === "clear") return { shouldClear: true, html: "" };
  if (OPTIONS[action] && !normalizedOption) {
    return { shouldClear: false, html: createOptionsOutput(getShellCommand(shell, action), OPTIONS[action]) };
  }

  const handlers = {
    help: () => resolveHelp(normalizedOption, shell),
    about: () => createAboutOutput(),
    projects: () => resolveProjects(normalizedOption, values),
    awards: () => resolveAwards(normalizedOption, values),
    skills: () => resolveSkills(normalizedOption),
    contact: () => resolveContact(normalizedOption),
    theme: () => resolveTheme(normalizedOption, isReplay)
  };

  return {
    shouldClear: false,
    html: handlers[action]?.() || createErrorOutput(rawCommand.trim(), getShellCommand(shell, "help"))
  };
}

function resolveHelp(option, shell) {
  if (!option) return createHelpOutput(getPublicCommands(shell));
  if (["--hidden", "-h"].includes(option)) {
    const commands = shell === SHELLS.linux ? LINUX_HIDDEN_COMMANDS : POWERSHELL_HIDDEN_COMMANDS;
    return createHiddenHelpOutput(commands);
  }
  const helpCommand = getShellCommand(shell, "help");
  return createOptionError(`${helpCommand} ${option}`, `Use ${helpCommand}, ${helpCommand} --hidden, or ${helpCommand} -h.`);
}

function resolvePortfolio(items, label, option, values) {
  if (["--all", "-a"].includes(option)) return createPortfolioOutput(items, label);
  if (["--year", "-y"].includes(option)) {
    const year = Number(values[0]);
    if (!year) return createOptionError(`${label} ${option}`, "Add a year, for example: 2025");
    return createPortfolioOutput(items.filter((item) => item.year === year), `${label} from ${year}`);
  }
  if (["--competition", "-c"].includes(option)) {
    const query = normalizeSearch(values.join(" "));
    if (!query) return createOptionError(`${label} ${option}`, "Add a competition name after the option.");
    return createPortfolioOutput(items.filter((item) => normalizeSearch(item.competition).includes(query)), `${label} matching “${values.join(" ")}”`);
  }
  return createOptionError(`${label} ${option}`, `Type ${label} to see the available options.`);
}

function resolveProjects(option, values) {
  if (["--all", "-a"].includes(option)) return createProjectsOutput(PROJECTS);
  if (["--latest", "-l"].includes(option)) {
    const currentYear = new Date().getFullYear();
    return createProjectsOutput(PROJECTS.filter(({ year }) => year === currentYear), `projects from ${currentYear}`);
  }
  if (["--year", "-y"].includes(option)) {
    const year = Number(values[0]);
    if (!year) return createOptionError(`projects ${option}`, "Add a year, for example: 2026");
    return createProjectsOutput(PROJECTS.filter((project) => project.year === year), `projects from ${year}`);
  }
  if (["--category", "-t"].includes(option)) {
    const rawQuery = values.join(" ");
    const query = normalizeSearch(rawQuery);
    if (!query) return createOptionError(`projects ${option}`, "Add a category such as CAD, Software, Marketing, or Robotics.");
    const matches = PROJECTS.filter((project) => project.categories.some((category) => normalizeSearch(category) === query));
    return createProjectsOutput(matches, `projects matching “${rawQuery}”`);
  }
  if (["--competition", "-c"].includes(option)) {
    const rawQuery = values.join(" ");
    const query = normalizeSearch(rawQuery);
    if (!query) return createOptionError(`projects ${option}`, "Add a competition such as FTC, FLL, or InfoEducație.");
    const matches = PROJECTS.filter((project) => normalizeSearch(project.competition) === query);
    return createProjectsOutput(matches, `projects from ${rawQuery}`);
  }
  return createOptionError(`projects ${option}`, "Type projects to see the available options.");
}

function resolveAwards(option, values) {
  const awards = PORTFOLIO_ITEMS.filter(({ type }) => type === "Award");
  if (["--latest", "-l"].includes(option)) {
    const latestYear = Math.max(...awards.map(({ year }) => year));
    return createPortfolioOutput(awards.filter(({ year }) => year === latestYear), `awards from ${latestYear}`);
  }
  if (["--medals", "-m"].includes(option)) {
    return createPortfolioOutput(awards.filter(({ title }) => normalizeSearch(title).includes("medal")), "medal results");
  }
  if (["--team", "-t", "--search", "-s"].includes(option)) {
    const query = normalizeSearch(values.join(" "));
    if (!query) return createOptionError(`awards ${option}`, "Add a search term after the option.");
    const matches = awards.filter((award) => normalizeSearch(`${award.title} ${award.competition} ${award.description}`).includes(query));
    return createPortfolioOutput(matches, `awards matching “${values.join(" ")}”`);
  }
  return resolvePortfolio(awards, "awards", option, values);
}

function resolveSkills(option) {
  if (["--all", "-a"].includes(option)) return createSkillsOutput(SKILLS);
  const aliases = { "-s": "software", "-r": "robotics", "-c": "cad", "-m": "marketing", "-l": "leadership", "-g": "languages", "-i": "ai" };
  const key = option.startsWith("--") ? option.slice(2) : aliases[option];
  if (key) return createSkillsOutput(SKILLS.filter((skill) => skill.key === key));
  return createOptionError(`skills ${option}`, "Type skills to see the available options.");
}

function resolveContact(option) {
  if (["--all", "-a"].includes(option)) return createContactOutput(CONTACTS);
  if (option === "--social") return createContactOutput(CONTACTS.filter(({ group }) => group === "social"));
  const aliases = { "-e": "email", "-p": "phone", "-g": "github", "-i": "instagram", "-r": "reddit", "-s": "spotify", "-d": "discord" };
  const key = option.startsWith("--") ? option.slice(2) : aliases[option];
  if (key) return createContactOutput(CONTACTS.filter((contact) => contact.key === key));
  return createOptionError(`contact ${option}`, "Type contact to see the available options.");
}

function resolveTheme(option, isReplay) {
  const requestedTheme = ["--light", "-l"].includes(option) ? THEMES.light
    : ["--dark", "-d"].includes(option) ? THEMES.dark
    : ["--strawberry", "-s"].includes(option) ? THEMES.strawberry : null;
  if (!requestedTheme) return createOptionError(`theme ${option}`, "Type theme to see the available options.");
  const theme = isReplay ? requestedTheme : setAccentTheme(requestedTheme, true);
  const accent = theme === THEMES.dark ? "purple" : theme === THEMES.strawberry ? "strawberry" : "orange";
  return `<p class="output-copy">Accent switched to <strong class="accent-${accent}">${accent}</strong>.</p>`;
}

function createOptionError(command, guidance) {
  return `<p class="error-output">The option in '${command}' is incomplete or unknown. ${guidance}</p>`;
}

function normalizeSearch(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
