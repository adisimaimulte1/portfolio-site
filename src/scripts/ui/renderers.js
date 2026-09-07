import { PREVIEWS } from "../data/previews.js";
import { getPromptHtml } from "../terminal/shells.js";
import { getProjectGallery } from "../data/galleries.js";

const CAD_RESOURCE_ORDER = Object.freeze({ preview: 0, instructions: 1, download: 2 });

export function createCommandEntry(rawCommand, outputHtml, shell) {
  const entry = document.createElement("section");
  entry.className = "history-entry";

  const commandLine = document.createElement("p");
  commandLine.className = "history-entry__command";
  commandLine.innerHTML = getPromptHtml(shell);
  const commandText = document.createElement("span");
  commandText.textContent = rawCommand;
  commandLine.append(commandText);

  const output = document.createElement("div");
  output.className = "history-entry__output";
  output.innerHTML = outputHtml;
  entry.append(commandLine, output);
  return { entry, output };
}

export function createHelpOutput(commands) {
  return `<p class="help-intro">Choose a command below to place it in the prompt, then press <strong>Enter</strong> to run it. Some commands prefer to remain hidden.</p>
    <ul class="command-list">${commands.map(({ name, description }) => `
      <li><button class="command-button" type="button" data-command="${name}"><span class="command-button__name">${name}</span><span class="command-button__description">${description}</span></button></li>`).join("")}
    </ul>`;
}

export function createHiddenHelpOutput(commands) {
  return `<p class="help-intro">Hidden command reference:</p>
    <ul class="command-list">${commands.map(({ command, label, description }) => `
      <li><button class="command-button" type="button" data-command="${command}"><span class="command-button__name">${label}</span><span class="command-button__description">${description}</span></button></li>`).join("")}
    </ul>`;
}

export function createAboutOutput() {
  const age = getAge(new Date(2007, 8, 21));
  const ageArticle = getAgeArticle(age);
  return `<div class="output-copy">
    <h1 class="about-greeting">Hi!</h1>
    <p>I’m <strong class="accent">Adrian</strong>, ${ageArticle} <strong class="accent">${age}</strong> y.o. Mechatronics and Robotics student at <strong class="accent">POLITEHNICA</strong> Bucharest.</p>
    <p>I enjoy building ambitious <strong class="accent">projects</strong> that combine <strong class="accent">robotics</strong>, <strong class="accent">software</strong>, and creative <strong class="accent">marketing</strong>, taking each idea from an early concept to something people can actually use.</p>
    <p>This site is my <strong class="accent">portfolio</strong>, where I document the <strong class="accent">projects</strong>, competitions, experiments, and <strong class="accent">awards</strong> that have shaped my journey and the way I create.</p>
  </div>`;
}

export function createContactOutput(contacts) {
  if (!contacts.length) return `<p class="empty-output">No matching contact methods were found.</p>`;
  return `<ul class="contact-list">${contacts.map(({ label, value, href }) => `
    <li class="contact-item">
      <span class="contact-item__label">${label}</span>
      ${href
        ? `<a class="contact-item__value" href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${value}</a>`
        : `<span class="contact-item__value">${value}</span>`}
    </li>`).join("")}
  </ul>`;
}

export function createSkillsOutput(skills) {
  if (!skills.length) return `<p class="empty-output">No matching skill category was found.</p>`;
  return `<div class="skill-list">${skills.map(({ title, summary, details }) => `
    <article class="skill-card">
      <h2 class="skill-card__title">${title}</h2>
      <p class="skill-card__summary">${summary}</p>
      <p class="skill-card__details">${details}</p>
    </article>`).join("")}
  </div>`;
}

export function createOptionsOutput(command, options) {
  return `<p class="help-intro">Choose an option for <strong class="accent">${command}</strong>:</p>
    <ul class="command-list option-list">${options.map(({ flag, alias, description }) => `
      <li><button class="command-button" type="button" data-command="${command} ${flag}"><span class="command-button__name">${flag}${alias ? ` / ${alias}` : ""}</span><span class="command-button__description">${description}</span></button></li>`).join("")}
    </ul>`;
}

export function createPortfolioOutput(items, label) {
  if (!items.length) return `<p class="empty-output">No ${label} have been added yet.</p>`;
  const groups = items.reduce((result, item) => {
    result[item.year] ??= [];
    result[item.year].push(item);
    return result;
  }, {});

  return `<div class="work-groups">${Object.keys(groups).sort((a, b) => b - a).map((year) => `
    <section class="year-group">
      <h2 class="year-group__year">${year}</h2>
      <div class="year-group__entries">${groups[year].map((item) => `
        <article class="work-card">
          <p class="work-card__competition">${item.competition}</p>
          <div><h3 class="work-card__title">${item.title}</h3><p class="work-card__description">${item.description}</p></div>
          <span class="work-card__type">${item.type}</span>
        </article>`).join("")}</div>
    </section>`).join("")}</div>`;
}

export function createProjectsOutput(projects, label = "projects") {
  if (!projects.length) return `<p class="empty-output">No ${label} were found.</p>`;
  const orderedProjects = [...projects].sort((first, second) => second.year - first.year
    || (second.timelineOrder ?? 0) - (first.timelineOrder ?? 0));
  return `<div class="project-list">${orderedProjects.map((project) => `
    <article class="project-card">
      <header class="project-card__header">
        <div><p class="project-card__meta">${project.year} · ${project.competition} · ${project.categories.join(" · ")}</p><h2 class="project-card__title">${project.title}</h2></div>
        <div class="project-card__badges">
          ${getProjectGallery(project) ? `<a class="project-card__status project-card__gallery-button" href="gallery.html?project=${encodeURIComponent(project.id)}" target="_blank" rel="noreferrer">Gallery ↗</a>` : ""}
          <span class="project-card__status">Project</span>
        </div>
      </header>
      <p class="project-card__summary">${project.summary}</p>
      <ul class="project-card__details">${project.details.map((detail) => `<li>${detail}</li>`).join("")}</ul>
      ${project.campaign ? `<aside class="project-campaign">
        <p class="project-campaign__label">Campaign case study</p>
        <h3>${project.campaign.title}</h3>
        <p>${project.campaign.summary}</p>
        <ul>${project.campaign.details.map((detail) => `<li>${detail}</li>`).join("")}</ul>
      </aside>` : ""}
      ${project.media.length ? `<div class="project-gallery project-gallery--${project.galleryMode || "square-static"}${project.galleryModifier ? ` project-gallery--${project.galleryModifier}` : ""}">${project.media.map((source, index) => `<a href="${source}" target="_blank" rel="noreferrer"><img src="${PREVIEWS[source]?.src || source}" alt="${project.title} project image ${index + 1}" loading="lazy" decoding="async"></a>`).join("")}</div>` : ""}
      <div class="project-card__footer">
        <ul class="project-tags">${project.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
        ${createProjectResources(project)}
      </div>
    </article>`).join("")}</div>`;
}

function createProjectResources({ links = [], archives = [], categories = [] }) {
  const orderedLinks = categories.includes("CAD")
    ? [...links].sort((first, second) => (CAD_RESOURCE_ORDER[first.resourceType] ?? 3) - (CAD_RESOURCE_ORDER[second.resourceType] ?? 3))
    : links;
  const externalLinks = orderedLinks.map(({ label, href, download = false }) => createResourceLink(label, href, download));
  const archiveLinks = archives.map(({ label, href, download = true }) => createResourceLink(label, href, download));
  return `<div class="project-links">${[...externalLinks, ...archiveLinks].join("")}</div>`;
}

function createResourceLink(label, href, download) {
  const attributes = download ? " download" : ' target="_blank" rel="noreferrer"';
  return `<a href="${href}"${attributes}>${label} ${download ? "↓" : "↗"}</a>`;
}

export function createErrorOutput(command, helpCommand = "help") {
  const escapedHelpCommand = escapeHtml(helpCommand);
  return `<p class="error-output">The term '${escapeHtml(command)}' is not recognized as a portfolio command. Type <button class="command-button__name inline-command" type="button" data-command="${escapedHelpCommand}">${escapedHelpCommand}</button> to see the available commands.</p>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function getAge(birthDate, currentDate = new Date()) {
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed = currentDate.getMonth() > birthDate.getMonth()
    || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
  if (!birthdayHasPassed) age -= 1;
  return age;
}

function getAgeArticle(age) {
  const usesAn = age === 8 || age === 11 || age === 18 || (age >= 80 && age < 90);
  return usesAn ? "an" : "a";
}
