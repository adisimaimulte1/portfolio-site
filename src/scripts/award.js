import { PORTFOLIO_ITEMS } from "./data/portfolio.js";
import { STORAGE_KEYS, THEMES } from "./config/constants.js";

const params = new URLSearchParams(location.search);
const award = PORTFOLIO_ITEMS.find(({ id }) => id === params.get("award"));
const documents = award?.documents ?? [];

const grid = document.querySelector("#award-grid");
const dialog = document.querySelector("#award-viewer");
const stage = document.querySelector("#award-stage");
const previous = document.querySelector("#award-previous");
const next = document.querySelector("#award-next");
const counter = document.querySelector("#award-counter");
const original = document.querySelector("#award-original");
let currentIndex = 0;

function applyTheme(theme) {
  document.documentElement.dataset.theme = Object.values(THEMES).includes(theme) ? theme : THEMES.light;
}

applyTheme(localStorage.getItem(STORAGE_KEYS.theme));
window.addEventListener("storage", ({ key, newValue }) => {
  if (key === STORAGE_KEYS.theme || key === null) applyTheme(newValue);
});

if (!award || !documents.length) {
  document.querySelector("#award-status").textContent = "These award documents are unavailable.";
} else {
  document.title = `${award.title} · ${award.competition} · Adrian Contras`;
  document.querySelector("#award-eyebrow").textContent = `${award.year} · ${award.competition}`;
  document.querySelector("#award-title").textContent = award.title;
  document.querySelector("#award-subtitle").textContent = award.description;
  document.querySelector("#award-status").hidden = true;
  grid.dataset.count = String(documents.length);

  documents.forEach((documentItem, index) => {
    const card = document.createElement("article");
    card.className = "award-card";

    const button = document.createElement("button");
    button.className = "award-card__preview";
    button.type = "button";
    button.setAttribute("aria-label", `Open ${documentItem.label}`);

    const image = document.createElement("img");
    image.src = documentItem.src;
    image.alt = documentItem.label;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";

    const label = document.createElement("p");
    label.className = "award-card__label";
    label.textContent = documentItem.label;

    button.append(image);
    button.addEventListener("click", () => {
      showDocument(index);
      dialog.showModal();
    });

    card.append(button, label);
    grid.append(card);
  });
}

function showDocument(index) {
  currentIndex = index;
  const item = documents[index];

  const image = document.createElement("img");
  image.src = item.src;
  image.alt = item.label;
  image.decoding = "async";

  stage.replaceChildren(image);
  counter.textContent = `${index + 1} / ${documents.length}`;
  original.href = item.src;
  original.textContent = `Open ${item.label} ↗`;
  previous.disabled = index === 0;
  next.disabled = index === documents.length - 1;
}

previous.addEventListener("click", () => showDocument(currentIndex - 1));
next.addEventListener("click", () => showDocument(currentIndex + 1));
document.querySelector("#award-close").addEventListener("click", () => dialog.close());

dialog.addEventListener("close", () => stage.replaceChildren());
dialog.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "ArrowLeft" && currentIndex > 0) {
    event.preventDefault();
    showDocument(currentIndex - 1);
  } else if (event.key === "ArrowRight" && currentIndex < documents.length - 1) {
    event.preventDefault();
    showDocument(currentIndex + 1);
  }
});
