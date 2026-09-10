import { AUTO_SCROLL, COMMAND_HISTORY_LIMIT, SELECTORS } from "./config/constants.js";
import { loadCommandHistory, saveCommandHistory } from "./storage/history.js";
import { clearEntries, clearTerminalClearedState, loadEntries, loadScrollPosition, markTerminalCleared, saveEntries, saveScrollPosition } from "./storage/session.js";
import { resolveCommand } from "./terminal/commands.js";
import { createCommandEntry } from "./ui/renderers.js";
import { prepareReveal } from "./ui/reveal.js";
import { initializeTheme } from "./ui/theme.js";
import { getPromptHtml, getShellCommand, loadShell, saveShell } from "./terminal/shells.js";

const elements = Object.freeze({
  themeButton: document.querySelector(SELECTORS.themeButton),
  terminal: document.querySelector(SELECTORS.terminal),
  form: document.querySelector(SELECTORS.terminalForm),
  input: document.querySelector(SELECTORS.terminalInput),
  history: document.querySelector(SELECTORS.terminalHistory),
  hint: document.querySelector(SELECTORS.terminalHint),
  shellHelpCommand: document.querySelector(SELECTORS.shellHelpCommand)
});

const entries = loadEntries();
const restoredScrollPosition = loadScrollPosition();
const commandHistory = loadCommandHistory();
let historyPosition = commandHistory.length;
let currentShell = loadShell();
const usesTouchKeyboard = window.matchMedia("(hover: none) and (pointer: coarse)");
usesTouchKeyboard.addEventListener("change", updateIdleCaret);

initializeTheme(elements.themeButton);
updatePrompt();
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
initializeTerminal();

let scrollSaveFrame;
window.addEventListener("scroll", () => {
  cancelAnimationFrame(scrollSaveFrame);
  scrollSaveFrame = requestAnimationFrame(() => saveScrollPosition(window.scrollY));
}, { passive: true });

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const command = elements.input.value.trim();
  if (!command || elements.form.hidden) return;

  elements.input.value = "";
  resizeCommandInput();
  commandHistory.push(command);
  commandHistory.splice(0, Math.max(0, commandHistory.length - COMMAND_HISTORY_LIMIT));
  saveCommandHistory(commandHistory);
  historyPosition = commandHistory.length;

  const executionShell = currentShell;
  const result = resolveCommand(command, { shell: executionShell });
  if (result.shouldClear) {
    entries.length = 0;
    historyPosition = commandHistory.length;
    elements.history.replaceChildren();
    if (elements.hint.hidden) revealHint();
    clearEntries();
    markTerminalCleared();
    showPrompt(false);
    resetTerminalViewport();
    return;
  }

  elements.hint.hidden = true;
  const entryRecord = { command, startedAt: Date.now(), shell: executionShell };
  if (result.nextShell) {
    currentShell = result.nextShell;
    saveShell(currentShell);
    updatePrompt();
  }
  clearTerminalClearedState();
  entries.push(entryRecord);
  saveEntries(entries);
  await renderEntry(entryRecord, result.html, { centerAfter: false, followOutput: true });
});

elements.input.addEventListener("keydown", (event) => {
  if (event.isComposing) return;
  if (event.key === "Enter") {
    event.preventDefault();
    elements.form.requestSubmit();
    return;
  }
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
  event.preventDefault();
  historyPosition += event.key === "ArrowUp" ? -1 : 1;
  historyPosition = Math.max(0, Math.min(commandHistory.length, historyPosition));
  elements.input.value = commandHistory[historyPosition] || "";
  requestAnimationFrame(moveCommandCaretToEnd);
});

elements.input.addEventListener("beforeinput", (event) => {
  if (!event.isComposing && ["insertParagraph", "insertLineBreak"].includes(event.inputType)) {
    event.preventDefault();
    elements.form.requestSubmit();
  }
});

elements.input.addEventListener("paste", (event) => {
  event.preventDefault();
  const text = event.clipboardData.getData("text/plain").replace(/[\r\n]+/g, " ");
  elements.input.setRangeText(text, elements.input.selectionStart, elements.input.selectionEnd, "end");
  resizeCommandInput();
});

elements.input.addEventListener("drop", (event) => event.preventDefault());

function moveCommandCaretToEnd() {
  elements.input.setSelectionRange(elements.input.value.length, elements.input.value.length);
  resizeCommandInput();
}

function resizeCommandInput() {
  // Indent only the first line; wrapped lines use the full terminal width.
  const promptWidth = elements.form.querySelector(".prompt").getBoundingClientRect().width;
  elements.form.style.setProperty("--prompt-width", `${promptWidth}px`);
  elements.input.style.setProperty("--prompt-width", `${promptWidth}px`);
  elements.input.style.height = "0px";
  elements.input.style.height = `${elements.input.scrollHeight}px`;
}

elements.input.addEventListener("input", resizeCommandInput);
elements.input.addEventListener("input", updateIdleCaret);
elements.input.addEventListener("focus", updateIdleCaret);
elements.input.addEventListener("blur", updateIdleCaret);

function updateIdleCaret() {
  elements.form.classList.toggle(
    "terminal__form--idle-caret",
    usesTouchKeyboard.matches && !elements.input.value && document.activeElement !== elements.input
  );
}
// Reflow pasted/recalled commands and existing text when the viewport changes.
let commandInputWidth = 0;
const commandInputObserver = new ResizeObserver(([entry]) => {
  if (entry.contentRect.width === commandInputWidth) return;
  commandInputWidth = entry.contentRect.width;
  resizeCommandInput();
});
commandInputObserver.observe(elements.input, { box: "content-box" });

elements.history.addEventListener("click", (event) => {
  const button = event.target.closest("[data-command]");
  if (!button || elements.form.hidden) return;
  elements.input.value = button.dataset.command;
  elements.input.focus({ preventScroll: true });
  moveCommandCaretToEnd();
});

elements.terminal.addEventListener("click", (event) => {
  if (!elements.form.hidden && !event.target.closest("button, a")) elements.input.focus({ preventScroll: true });
});

async function initializeTerminal() {
  if (!entries.length) {
    elements.hint.hidden = false;
    showPrompt(false);
    return;
  }

  elements.hint.hidden = true;
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const entryShell = entry.shell || "powershell";
    const { html } = resolveCommand(entry.command, { isReplay: true, shell: entryShell });
    const isLastEntry = index === entries.length - 1;
    await renderEntry(entry, html, {
      showAfter: isLastEntry,
      restorePosition: isLastEntry
    });
  }
}

async function renderEntry(entryRecord, html, options = {}) {
  const { centerAfter = false, followOutput = false, restorePosition = false, showAfter = true } = options;
  hidePrompt();
  const { entry, output } = createCommandEntry(entryRecord.command, html, entryRecord.shell || "powershell");
  elements.history.append(entry);
  if (restorePosition) requestAnimationFrame(() => window.scrollTo(0, restoredScrollPosition));
  const reveal = prepareReveal(output, entryRecord.startedAt);
  if (followOutput) await followOutputNaturally(output, reveal);
  else await reveal;
  if (showAfter) showPrompt(centerAfter);
}

function hidePrompt() {
  if (usesTouchKeyboard.matches && document.activeElement === elements.input) elements.input.blur();
  elements.form.hidden = true;
  updateIdleCaret();
}

function showPrompt(center) {
  elements.form.hidden = false;
  resizeCommandInput();
  if (!usesTouchKeyboard.matches) elements.input.focus({ preventScroll: true });
  else if (document.activeElement === elements.input) elements.input.blur();
  updateIdleCaret();
  if (center) elements.form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetTerminalViewport() {
  cancelAnimationFrame(scrollSaveFrame);
  saveScrollPosition(0);

  const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  resetScroll();
  requestAnimationFrame(() => requestAnimationFrame(resetScroll));

  if (!usesTouchKeyboard.matches || !window.visualViewport) return;
  const settleViewport = () => resetScroll();
  window.visualViewport.addEventListener("resize", settleViewport);
  setTimeout(() => {
    window.visualViewport.removeEventListener("resize", settleViewport);
    resetScroll();
  }, 500);
}

function followOutputNaturally(output, revealPromise) {
  return new Promise((resolve) => {
    const images = [...output.querySelectorAll("img")];
    let latestTarget = null;
    let scrollDestination = window.scrollY;
    let scrollWorker = null;

    function queueScroll(destination) {
      const maximumScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      scrollDestination = Math.max(scrollDestination, Math.min(destination, maximumScroll));
      if (!scrollWorker) {
        scrollWorker = runScrollQueue().finally(() => {
          scrollWorker = null;
          if (scrollDestination > window.scrollY + AUTO_SCROLL.positionTolerance) queueScroll(scrollDestination);
        });
      }
      return scrollWorker;
    }

    async function runScrollQueue() {
      while (scrollDestination > window.scrollY + AUTO_SCROLL.positionTolerance) {
        const maximumScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const commandedDestination = Math.min(scrollDestination, maximumScroll);
        if (commandedDestination <= window.scrollY + AUTO_SCROLL.positionTolerance) return;
        window.scrollTo({ top: commandedDestination, behavior: "smooth" });
        await waitForScroll(commandedDestination);
      }
    }

    function followTarget(target) {
      if (!target) return;
      const viewportBottom = window.innerHeight - AUTO_SCROLL.viewportMargin;
      const targetBottom = window.scrollY + target.getBoundingClientRect().bottom;
      queueScroll(targetBottom - viewportBottom);
    }

    function handleRevealStart(event) {
      if (event.animationName !== "terminal-reveal" || !event.target.classList.contains("reveal-line")) return;
      if (!endsRenderedRow(event.target)) return;
      latestTarget = event.target;
      followTarget(latestTarget);
    }

    output.addEventListener("animationstart", handleRevealStart);

    Promise.allSettled([revealPromise, waitForImages(images, () => followTarget(latestTarget))]).then(async () => {
      output.removeEventListener("animationstart", handleRevealStart);
      await queueScroll(document.documentElement.scrollHeight);
      resolve();
    });
  });
}

function waitForScroll(destination) {
  return new Promise((resolve) => {
    let previousPosition = window.scrollY;
    let stableFrames = 0;
    let movementStarted = false;
    let frames = 0;

    function checkPosition() {
      frames += 1;
      const position = window.scrollY;
      const movement = Math.abs(position - previousPosition);
      if (movement > AUTO_SCROLL.movementTolerance) movementStarted = true;
      stableFrames = movement < AUTO_SCROLL.movementTolerance ? stableFrames + 1 : 0;
      previousPosition = position;

      const reachedDestination = Math.abs(destination - position) <= AUTO_SCROLL.positionTolerance;
      const settled = movementStarted && stableFrames >= AUTO_SCROLL.settledFrameCount;
      if (reachedDestination || settled || frames >= AUTO_SCROLL.maximumFrameCount) resolve();
      else requestAnimationFrame(checkPosition);
    }

    requestAnimationFrame(checkPosition);
  });
}

function endsRenderedRow(target) {
  if (!target.matches(".project-gallery > a, .project-links > a")) return true;
  const nextItem = target.nextElementSibling;
  return !nextItem || nextItem.offsetTop !== target.offsetTop;
}

function waitForImages(images, onLoad) {
  return Promise.all(images.map((image) => {
    image.loading = "eager";
    if (image.complete) return Promise.resolve();
    return new Promise((resolve) => {
      const settle = (event) => {
        image.removeEventListener("load", settle);
        image.removeEventListener("error", settle);
        if (event.type === "load") onLoad(image);
        resolve();
      };
      image.addEventListener("load", settle);
      image.addEventListener("error", settle);
    });
  }));
}

function revealHint() {
  elements.hint.hidden = false;
  elements.hint.classList.remove("reveal-line");
  elements.hint.style.animationDelay = "0ms";
  void elements.hint.offsetWidth;
  elements.hint.classList.add("reveal-line");
  elements.hint.addEventListener("animationend", () => {
    elements.hint.classList.remove("reveal-line");
    elements.hint.style.removeProperty("animation-delay");
  }, { once: true });
}

function updatePrompt() {
  elements.form.querySelector(".prompt").outerHTML = getPromptHtml(currentShell);
  elements.shellHelpCommand.textContent = getShellCommand(currentShell, "help");
  elements.hint.textContent = currentShell === "linux"
    ? "Enter a command or select one from the man page. Use ↑ and ↓ for command history."
    : "Enter a command or select one from the help list. Use ↑ and ↓ for command history.";
  elements.input.setAttribute("aria-label", currentShell === "linux" ? "Enter a Linux portfolio command" : "Enter a PowerShell portfolio command");
}
