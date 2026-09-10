import { PROJECTS } from "./data/projects.js";
import { STORAGE_KEYS, THEMES } from "./config/constants.js";
import { getProjectGallery } from "./data/galleries.js";
import { getGalleryLayout } from "./ui/gallery-layout.js";

const project = PROJECTS.find(({ id }) => id === new URLSearchParams(location.search).get("project"));
const previewFolder = project?.media[0]?.split("/").slice(-2, -1)[0];
async function loadPreviews(directory) {
  return previewFolder ? fetch(`assets/${directory}/${encodeURIComponent(previewFolder)}.json`)
    .then((response) => response.ok ? response.json() : {})
    .catch(() => ({})) : {};
}
const [PREVIEWS, VIDEO_PREVIEWS] = await Promise.all([
  loadPreviews("previews"), loadPreviews("video-previews")
]);
const grid = document.querySelector("#gallery-grid");
const dialog = document.querySelector("#gallery-viewer");
const stage = document.querySelector("#gallery-stage");
const previous = document.querySelector("#gallery-previous");
const next = document.querySelector("#gallery-next");
let currentIndex = 0;
let items = [];
let swipeStart = null;

function measureImage(media) {
  const box = media.getBoundingClientRect();
  const ratio = Number(media.getAttribute("width")) / Number(media.getAttribute("height"));
  const width = Math.max(1, Math.ceil(Math.min(box.width, box.height * (ratio || 1))));
  return { media, sizes: `${width}px` };
}

function sizeImage({ media, sizes }) {
  if (media.sizes === sizes) return;
  media.sizes = sizes;
  const source = media.parentElement?.querySelector('source');
  if (source) source.sizes = media.sizes;
}

const imageSizeObserver = new ResizeObserver((entries) => {
  entries.map(({ target }) => measureImage(target)).forEach(sizeImage);
});

const imageObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter(({ isIntersecting }) => isIntersecting);
  visible.map(({ target }) => measureImage(target)).forEach(sizeImage);
  visible.forEach(({ target }) => {
    const source = target.parentElement?.querySelector('source');
    if (source?.dataset.srcset) source.srcset = source.dataset.srcset;
    if (target.dataset.srcset) target.srcset = target.dataset.srcset;
    target.src = target.dataset.src;
    imageObserver.unobserve(target);
  });
}, { rootMargin: '400px' });

function applyTheme(theme) {
  document.documentElement.dataset.theme = Object.values(THEMES).includes(theme) ? theme : THEMES.light;
}

applyTheme(localStorage.getItem(STORAGE_KEYS.theme));
window.addEventListener("storage", ({ key, newValue }) => {
  if (key === STORAGE_KEYS.theme || key === null) applyTheme(newValue);
});

const gallery = getProjectGallery(project);
if (!gallery) {
  document.querySelector("#gallery-status").textContent = "This gallery is unavailable.";
} else {
  document.title = `${project.title} Gallery · Adrian Contras`;
  document.querySelector("#gallery-title").textContent = project.title;
  items = gallery.flatMap(({ media }) => media).map((src) => {
    const type = /\.(mp4|webm|ogv)$/i.test(src) ? "video" : "image";
    return { preview: (type === "video" ? VIDEO_PREVIEWS : PREVIEWS)[src], src: src.split("/").map(encodeURIComponent).join("/"), type };
  });
  document.querySelector("#gallery-status").textContent = items.length ? "" : "gallery is empty";
  document.querySelector("#gallery-status").hidden = items.length > 0;
  let index = 0;
  gallery.forEach(({ title, media: sources }, sectionIndex) => {
    if (!sources.length) return;
    const section = document.createElement("section");
    section.className = "gallery-section";
    if (title) {
      const heading = document.createElement("h2");
      heading.id = `gallery-section-${sectionIndex}`;
      heading.textContent = title;
      section.setAttribute("aria-labelledby", heading.id);
      section.append(heading);
    }
    const collection = document.createElement("div");
    collection.className = "gallery-collection";
    const tiles = [];
    const ratios = [];
    let layoutFrame;
    function scheduleLayout() {
      cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(() => {
        const width = collection.clientWidth;
        if (window.matchMedia("(max-width: 600px)").matches) {
          tiles.forEach((tile) => {
            tile.style.removeProperty("width");
            tile.style.removeProperty("height");
          });
          return;
        }
        const gap = parseFloat(getComputedStyle(collection).gap);
        const targetHeight = 220;
        getGalleryLayout(ratios, width, targetHeight, gap).forEach((size, index) => {
          tiles[index].style.width = `${Math.floor(size.width * 100) / 100}px`;
          tiles[index].style.height = `${size.height}px`;
        });
      });
    }
    sources.forEach(() => {
      const itemIndex = index++;
      const item = items[itemIndex];
      const media = createMedia(item, itemIndex, true);
      const button = document.createElement("a");
      button.className = "gallery-tile";
      button.href = item.src;
      button.setAttribute("aria-label", `${item.type === "video" ? "Play" : "Enlarge"} ${project.title} ${item.type} ${itemIndex + 1}`);
      const tileIndex = tiles.length;
      tiles.push(button);
      ratios.push(item.preview ? item.preview.width / item.preview.height : 1);
      if (!item.preview && item.type === "image") {
        media.addEventListener("load", () => {
          if (media.naturalWidth && media.naturalHeight) {
            ratios[tileIndex] = media.naturalWidth / media.naturalHeight;
            scheduleLayout();
          }
        }, { once: true });
      }
      if (item.type === "video") {
        const label = document.createElement("span");
        label.className = "gallery-tile__play";
        label.textContent = "▶ Video";
        label.setAttribute("aria-hidden", "true");
        button.append(label);
      }
      button.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        showItem(itemIndex);
        dialog.showModal();
      });
      button.append(media.parentElement || media);
      collection.append(button);
    });
    section.append(collection);
    grid.append(section);
    let previousWidth = -1;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === previousWidth) return;
      previousWidth = entry.contentRect.width;
      scheduleLayout();
    });
    observer.observe(collection);
    scheduleLayout();
  });
  if (project.matchGroups?.length) {
    const matchesSection = document.createElement("section");
    matchesSection.className = "gallery-matches";
    matchesSection.setAttribute("aria-labelledby", "gallery-matches-title");
    const heading = document.createElement("h2");
    heading.id = "gallery-matches-title";
    heading.textContent = "Watch competition matches";
    const intro = document.createElement("p");
    intro.textContent = "Select a match to watch it on YouTube at its starting timestamp.";
    matchesSection.append(heading, intro);
    project.matchGroups.forEach(({ title, matches }) => {
      const row = document.createElement("div");
      row.className = "gallery-matches__row";
      const label = document.createElement("h3");
      label.textContent = `${title} →`;
      const links = document.createElement("div");
      links.className = "gallery-matches__links";
      matches.forEach((match) => {
        const link = document.createElement("a");
        link.href = match.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = match.label;
        link.title = `${title} — Day ${match.day} — ${match.label}${match.note ? `: ${match.note}` : ""}`;
        link.setAttribute("aria-label", `${link.title} (opens in a new tab)`);
        if (match.note) link.setAttribute("aria-describedby", "gallery-match-note");
        links.append(link);
      });
      row.append(label, links);
      matchesSection.append(row);
    });
    const notes = project.matchGroups.flatMap(({ title, matches }) => matches
      .filter(({ note }) => note).map(({ label, note }) => `${title} ${label} — ${note}`));
    if (notes.length) {
      const note = document.createElement("p");
      note.id = "gallery-match-note";
      note.className = "gallery-matches__note";
      note.textContent = notes.join(" ");
      matchesSection.append(note);
    }
    grid.after(matchesSection);
  }
}

function createMedia(item, index, thumbnail = false) {
  if (thumbnail && item.type === "video") {
    if (item.preview) {
      return createMedia({ ...item, type: "image", alt: `${project.title} video ${index + 1} preview` }, index, true);
    }
    const placeholder = document.createElement("span");
    placeholder.className = "gallery-tile__placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    return placeholder;
  }
  const media = document.createElement(item.type === "video" ? "video" : "img");
  if (item.type === "video") {
    media.controls = true;
    media.playsInline = true;
    media.preload = "auto";
    if (item.preview) media.poster = item.preview.src;
    media.setAttribute("aria-label", item.alt || `${project.title} video ${index + 1}`);
    media.addEventListener("play", () => {
      document.querySelectorAll("video").forEach((video) => {
        if (video !== media) video.pause();
      });
    });
  } else {
    media.alt = item.alt || `${project.title} photo ${index + 1}`;
    media.loading = "eager";
    media.decoding = "async";
    media.addEventListener("load", () => media.classList.add("gallery-media--ready"), { once: true });
    if (item.preview) {
      media.width = item.preview.width;
      media.height = item.preview.height;
      if (item.preview.variants) {
        const picture = document.createElement("picture");
        if (item.preview.avif?.length) {
          const source = document.createElement("source");
          source.type = "image/avif";
          source.dataset.srcset = item.preview.avif.map(({ src, width }) => `${src} ${width}w`).join(", ");
          picture.append(source);
        }
        media.dataset.srcset = item.preview.variants.map(({ src, width }) => `${src} ${width}w`).join(", ");
        picture.append(media);
      }
    }
  }
  media.addEventListener("error", () => {
    const error = document.createElement("p");
    error.textContent = "This media could not be loaded.";
    media.replaceWith(error);
  }, { once: true });
  if (item.type === "image") {
    media.dataset.src = item.preview?.src || item.src;
    imageSizeObserver.observe(media);
    imageObserver.observe(media);
  } else {
    media.src = item.src;
  }
  return media;
}

function showItem(index) {
  releaseViewerMedia();
  currentIndex = index;
  const item = items[index];
  const media = createMedia(item, index);
  if (item.type === "image") media.loading = "eager";
  stage.replaceChildren(media.parentElement || media);
  if (item.type === "video") {
    media.play().catch((error) => {
      if (error.name !== "NotAllowedError" || !dialog.open || !stage.contains(media)) return;
      media.muted = true;
      media.play().catch(() => {});
    });
  }
  document.querySelector("#gallery-counter").textContent = `${index + 1} / ${items.length}`;
  document.querySelector("#gallery-original").href = item.src;
  previous.disabled = index === 0;
  next.disabled = index === items.length - 1;
}

previous.addEventListener("click", () => showItem(currentIndex - 1));
next.addEventListener("click", () => showItem(currentIndex + 1));
document.querySelector("#gallery-close").addEventListener("click", () => dialog.close());

stage.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "touch" || !stage.querySelector("img, video")) return;
  swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
});

stage.addEventListener("pointerup", (event) => {
  if (!swipeStart || event.pointerId !== swipeStart.id) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy) * 1.25) return;
  if (dx < 0 && currentIndex < items.length - 1) showItem(currentIndex + 1);
  else if (dx > 0 && currentIndex > 0) showItem(currentIndex - 1);
});

stage.addEventListener("pointercancel", () => {
  swipeStart = null;
});

dialog.addEventListener("close", () => {
  swipeStart = null;
  releaseViewerMedia();
  stage.replaceChildren();
});

function releaseViewerMedia() {
  const video = stage.querySelector("video");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
  const image = stage.querySelector("img");
  if (!image) return;
  imageObserver.unobserve(image);
  imageSizeObserver.unobserve(image);
}

dialog.addEventListener("keydown", (event) => {
  if (event.target.closest("video") || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "ArrowLeft" && currentIndex > 0) {
    event.preventDefault();
    showItem(currentIndex - 1);
  } else if (event.key === "ArrowRight" && currentIndex < items.length - 1) {
    event.preventDefault();
    showItem(currentIndex + 1);
  }
});
