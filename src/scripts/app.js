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
const SCROLLING_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

let historyPosition = commandHistory.length;
let currentShell = loadShell();
let previousInputLength = elements.input.value.length;

let inputScrollStarted = false;
let inputScrollAnimationFrame = null;
let inputScrollStartTime = null;
let inputScrollStartPosition = 0;
let inputScrollPreviousBehavior = null;
let inputScrollCompletion = null;

const usesTouchKeyboard = window.matchMedia("(hover: none) and (pointer: coarse)");
usesTouchKeyboard.addEventListener("change", updateIdleCaret);

initializeTheme(elements.themeButton);
updatePrompt();

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

initializeTerminal();

let scrollSaveFrame;

window.addEventListener(
  "scroll",
  () => {
    cancelAnimationFrame(scrollSaveFrame);
    scrollSaveFrame = requestAnimationFrame(() => saveScrollPosition(window.scrollY));
  },
  { passive: true }
);

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const command = elements.input.value.trim();
  if (!command || isPromptHidden()) return;

  if (usesTouchKeyboard.matches && document.activeElement === elements.input) {
    elements.input.blur();
  }

  elements.input.value = "";
  resetInputScroll();
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

  const entryRecord = {
    command,
    startedAt: Date.now(),
    shell: executionShell
  };

  if (result.nextShell) {
    currentShell = result.nextShell;
    saveShell(currentShell);
    updatePrompt();
  }

  clearTerminalClearedState();

  entries.push(entryRecord);
  saveEntries(entries);

  await renderEntry(entryRecord, result.html, {
    centerAfter: false,
    followOutput: true
  });
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
  if (isPromptHidden()) {
    event.preventDefault();
    return;
  }

  if (
    !event.isComposing &&
    ["insertParagraph", "insertLineBreak"].includes(event.inputType)
  ) {
    event.preventDefault();
    elements.form.requestSubmit();
  }
});

elements.input.addEventListener("paste", (event) => {
  event.preventDefault();

  const text = event.clipboardData
    .getData("text/plain")
    .replace(/[\r\n]+/g, " ");

  elements.input.setRangeText(
    text,
    elements.input.selectionStart,
    elements.input.selectionEnd,
    "end"
  );

  resizeCommandInput();
});

elements.input.addEventListener("drop", (event) => {
  event.preventDefault();
});

function moveCommandCaretToEnd() {
  elements.input.setSelectionRange(
    elements.input.value.length,
    elements.input.value.length
  );

  resizeCommandInput();
}

function resizeCommandInput(forceRemeasure = false) {
  const promptWidth = elements.form
    .querySelector(".prompt")
    .getBoundingClientRect().width;

  elements.form.style.setProperty("--prompt-width", `${promptWidth}px`);
  elements.input.style.setProperty("--prompt-width", `${promptWidth}px`);

  const inputLength = elements.input.value.length;
  const mayHaveShrunk = inputLength < previousInputLength;

  if (forceRemeasure || mayHaveShrunk) {
    elements.input.style.height = "0px";
  }

  const requiredHeight = elements.input.scrollHeight;

  if (
    forceRemeasure ||
    mayHaveShrunk ||
    requiredHeight > elements.input.clientHeight
  ) {
    elements.input.style.height = `${requiredHeight}px`;
  }

  previousInputLength = inputLength;
}

elements.input.addEventListener("input", () => resizeCommandInput());
elements.input.addEventListener("input", updateIdleCaret);
elements.input.addEventListener("input", followInputToPageEnd);

elements.input.addEventListener("focus", updateIdleCaret);
elements.input.addEventListener("blur", updateIdleCaret);

function followInputToPageEnd() {
  if (!elements.input.value) {
    resetInputScroll();
    return;
  }

  if (inputScrollStarted) {
    if (inputScrollAnimationFrame === null) {
      jumpToPageEnd();
    }
    return;
  }

  inputScrollStarted = true;
  inputScrollStartTime = null;
  inputScrollStartPosition = window.scrollY;

  inputScrollPreviousBehavior =
    document.documentElement.style.scrollBehavior;

  document.documentElement.style.scrollBehavior = "auto";

  window.visualViewport?.addEventListener(
    "resize",
    settleInputAfterViewportResize
  );

  lockScrollInput();

  inputScrollAnimationFrame = requestAnimationFrame(advanceInputScroll);
}

function advanceInputScroll(timestamp) {
  if (!inputScrollStarted) return;

  inputScrollStartTime ??= timestamp;

  const progress = Math.min(
    1,
    (timestamp - inputScrollStartTime) / AUTO_SCROLL.inputDuration
  );

  const easedProgress = 1 - (1 - progress) ** 3;

  const destination = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );

  jumpToPosition(
    inputScrollStartPosition +
      (destination - inputScrollStartPosition) * easedProgress
  );

  if (progress < 1) {
    inputScrollAnimationFrame = requestAnimationFrame(advanceInputScroll);
  } else {
    jumpToPosition(destination);

    inputScrollAnimationFrame = null;

    unlockScrollInput();

    const completion = inputScrollCompletion;
    inputScrollCompletion = null;

    completion?.();
  }
}

function resetInputScroll() {
  inputScrollStarted = false;
  inputScrollStartTime = null;

  cancelAnimationFrame(inputScrollAnimationFrame);
  inputScrollAnimationFrame = null;

  inputScrollCompletion = null;

  if (inputScrollPreviousBehavior !== null) {
    document.documentElement.style.scrollBehavior =
      inputScrollPreviousBehavior;

    inputScrollPreviousBehavior = null;
  }

  window.visualViewport?.removeEventListener(
    "resize",
    settleInputAfterViewportResize
  );

  unlockScrollInput();
}

function settleInputAfterViewportResize() {
  if (
    inputScrollStarted &&
    inputScrollAnimationFrame === null
  ) {
    jumpToPageEnd();
  }
}

function blockPointerScroll(event) {
  event.preventDefault();
}

function blockKeyboardScroll(event) {
  if (!SCROLLING_KEYS.has(event.key)) return;

  event.preventDefault();
  event.stopPropagation();
}

function lockScrollInput() {
  window.addEventListener("wheel", blockPointerScroll, {
    passive: false
  });

  window.addEventListener("touchmove", blockPointerScroll, {
    passive: false
  });

  window.addEventListener("keydown", blockKeyboardScroll, true);
}

function unlockScrollInput() {
  window.removeEventListener("wheel", blockPointerScroll);
  window.removeEventListener("touchmove", blockPointerScroll);
  window.removeEventListener("keydown", blockKeyboardScroll, true);
}

function jumpToPageEnd() {
  jumpToPosition(document.documentElement.scrollHeight);
}

function jumpToPosition(position) {
  window.scrollTo(0, position);
}

function updateIdleCaret() {
  elements.form.classList.toggle(
    "terminal__form--idle-caret",
    usesTouchKeyboard.matches &&
      !elements.input.value &&
      document.activeElement !== elements.input
  );
}

let commandInputWidth = 0;

const commandInputObserver = new ResizeObserver(([entry]) => {
  if (entry.contentRect.width === commandInputWidth) return;

  commandInputWidth = entry.contentRect.width;
  resizeCommandInput(true);
});

commandInputObserver.observe(elements.input, {
  box: "content-box"
});

elements.history.addEventListener("click", (event) => {
  const button = event.target.closest("[data-command]");

  if (!button || isPromptHidden()) return;

  resetInputScroll();

  elements.input.value = button.dataset.command;

  moveCommandCaretToEnd();

  if (usesTouchKeyboard.matches) {
    inputScrollCompletion = () => {
      elements.input.focus();

      moveCommandCaretToEnd();

      requestAnimationFrame(moveCommandCaretToEnd);
    };

    followInputToPageEnd();
  } else {
    elements.input.focus({
      preventScroll: true
    });

    followInputToPageEnd();
  }
});

elements.terminal.addEventListener("click", (event) => {
  if (
    !isPromptHidden() &&
    !event.target.closest("button, a")
  ) {
    elements.input.focus({
      preventScroll: true
    });
  }
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

    const { html } = resolveCommand(entry.command, {
      isReplay: true,
      shell: entryShell
    });

    const isLastEntry = index === entries.length - 1;

    await renderEntry(entry, html, {
      showAfter: isLastEntry,
      restorePosition: isLastEntry
    });
  }
}

async function renderEntry(entryRecord, html, options = {}) {
  const {
    centerAfter = false,
    followOutput = false,
    restorePosition = false,
    showAfter = true
  } = options;

  hidePrompt();

  const { entry, output } = createCommandEntry(
    entryRecord.command,
    html,
    entryRecord.shell || "powershell"
  );

  elements.history.append(entry);

  if (restorePosition) {
    requestAnimationFrame(() => {
      window.scrollTo(0, restoredScrollPosition);
    });
  }

  const reveal = prepareReveal(
    output,
    entryRecord.startedAt
  );

  if (followOutput) {
    await followOutputNaturally(output, reveal);
  } else {
    await reveal;
  }

  if (showAfter) {
    showPrompt(centerAfter);
  }
}

function hidePrompt() {
  if (
    usesTouchKeyboard.matches &&
    document.activeElement === elements.input
  ) {
    elements.input.blur();
  }

  elements.form.classList.add(
    "terminal__form--busy"
  );

  updateIdleCaret();
}

function showPrompt(center) {
  elements.form.hidden = false;

  elements.form.classList.remove(
    "terminal__form--busy"
  );

  resizeCommandInput();

  if (!usesTouchKeyboard.matches) {
    elements.input.focus({
      preventScroll: true
    });
  }

  updateIdleCaret();

  if (center) {
    elements.form.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

function isPromptHidden() {
  return (
    elements.form.hidden ||
    elements.form.classList.contains(
      "terminal__form--busy"
    )
  );
}

function resetTerminalViewport() {
  cancelAnimationFrame(scrollSaveFrame);

  saveScrollPosition(0);

  const resetScroll = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  };

  resetScroll();

  requestAnimationFrame(() => {
    requestAnimationFrame(resetScroll);
  });

  if (
    !usesTouchKeyboard.matches ||
    !window.visualViewport
  ) {
    return;
  }

  const settleViewport = () => {
    resetScroll();
  };

  window.visualViewport.addEventListener(
    "resize",
    settleViewport
  );

  setTimeout(() => {
    window.visualViewport.removeEventListener(
      "resize",
      settleViewport
    );

    resetScroll();
  }, 500);
}

function followOutputNaturally(
  output,
  revealPromise
) {
  return new Promise((resolve) => {
    const images = [
      ...output.querySelectorAll("img")
    ];

    let latestTarget = null;
    let scrollDestination = window.scrollY;
    let scrollWorker = null;

    lockScrollInput();

    function getMaximumScroll() {
      return Math.max(
        0,
        document.documentElement.scrollHeight -
          window.innerHeight
      );
    }

    function queueScroll(destination) {
      const maximumScroll =
        getMaximumScroll();

      scrollDestination = Math.max(
        Math.min(
          scrollDestination,
          maximumScroll
        ),
        Math.min(
          destination,
          maximumScroll
        )
      );

      if (!scrollWorker) {
        scrollWorker = runScrollQueue().finally(
          () => {
            scrollWorker = null;

            scrollDestination = Math.min(
              scrollDestination,
              getMaximumScroll()
            );

            if (
              scrollDestination >
              window.scrollY +
                AUTO_SCROLL.positionTolerance
            ) {
              queueScroll(
                scrollDestination
              );
            }
          }
        );
      }

      return scrollWorker;
    }

    async function runScrollQueue() {
      while (true) {
        const maximumScroll =
          getMaximumScroll();

        scrollDestination = Math.min(
          scrollDestination,
          maximumScroll
        );

        if (
          scrollDestination <=
          window.scrollY +
            AUTO_SCROLL.positionTolerance
        ) {
          return;
        }

        const commandedDestination =
          Math.min(
            scrollDestination,
            maximumScroll
          );

        if (
          commandedDestination <=
          window.scrollY +
            AUTO_SCROLL.positionTolerance
        ) {
          return;
        }

        window.scrollTo({
          top: commandedDestination,
          behavior: "smooth"
        });

        await waitForScroll(
          commandedDestination
        );
      }
    }

    function followTarget(target) {
      if (!target) return;

      const viewportBottom =
        window.innerHeight -
        AUTO_SCROLL.viewportMargin;

      const targetBottom =
        window.scrollY +
        target.getBoundingClientRect().bottom;

      queueScroll(
        targetBottom - viewportBottom
      );
    }

    function handleRevealStart(event) {
      if (
        event.animationName !==
          "terminal-reveal" ||
        !event.target.classList.contains(
          "reveal-line"
        )
      ) {
        return;
      }

      if (
        !endsRenderedRow(
          event.target
        )
      ) {
        return;
      }

      latestTarget =
        event.target;

      followTarget(
        latestTarget
      );
    }

    output.addEventListener(
      "animationstart",
      handleRevealStart
    );

    Promise.allSettled([
      revealPromise,
      waitForImages(
        images,
        () =>
          followTarget(
            latestTarget
          )
      )
    ]).then(async () => {
      output.removeEventListener(
        "animationstart",
        handleRevealStart
      );

      await queueScroll(
        document.documentElement.scrollHeight
      );

      unlockScrollInput();

      resolve();
    });
  });
}

function waitForScroll(destination) {
  return new Promise((resolve) => {
    let previousPosition =
      window.scrollY;

    let stableFrames = 0;
    let movementStarted = false;
    let frames = 0;

    function checkPosition() {
      frames += 1;

      const position =
        window.scrollY;

      const movement =
        Math.abs(
          position -
            previousPosition
        );

      if (
        movement >
        AUTO_SCROLL.movementTolerance
      ) {
        movementStarted = true;
      }

      stableFrames =
        movement <
        AUTO_SCROLL.movementTolerance
          ? stableFrames + 1
          : 0;

      previousPosition =
        position;

      const maximumScroll =
        Math.max(
          0,
          document.documentElement
            .scrollHeight -
            window.innerHeight
        );

      const reachableDestination =
        Math.min(
          destination,
          maximumScroll
        );

      const reachedDestination =
        Math.abs(
          reachableDestination -
            position
        ) <=
        AUTO_SCROLL.positionTolerance;

      const settled =
        movementStarted &&
        stableFrames >=
          AUTO_SCROLL.settledFrameCount;

      if (
        reachedDestination ||
        settled ||
        frames >=
          AUTO_SCROLL.maximumFrameCount
      ) {
        resolve();
      } else {
        requestAnimationFrame(
          checkPosition
        );
      }
    }

    requestAnimationFrame(
      checkPosition
    );
  });
}

function endsRenderedRow(target) {
  if (
    !target.matches(
      ".project-gallery > a, .project-links > a"
    )
  ) {
    return true;
  }

  const nextItem =
    target.nextElementSibling;

  return (
    !nextItem ||
    nextItem.offsetTop !==
      target.offsetTop
  );
}

function waitForImages(
  images,
  onLoad
) {
  return Promise.all(
    images.map((image) => {
      image.loading = "eager";

      if (image.complete) {
        return Promise.resolve();
      }

      return new Promise(
        (resolve) => {
          const settle = (
            event
          ) => {
            image.removeEventListener(
              "load",
              settle
            );

            image.removeEventListener(
              "error",
              settle
            );

            if (
              event.type ===
              "load"
            ) {
              onLoad(
                image
              );
            }

            resolve();
          };

          image.addEventListener(
            "load",
            settle
          );

          image.addEventListener(
            "error",
            settle
          );
        }
      );
    })
  );
}

function revealHint() {
  elements.hint.hidden = false;

  elements.hint.classList.remove(
    "reveal-line"
  );

  elements.hint.style.animationDelay =
    "0ms";

  void elements.hint.offsetWidth;

  elements.hint.classList.add(
    "reveal-line"
  );

  elements.hint.addEventListener(
    "animationend",
    () => {
      elements.hint.classList.remove(
        "reveal-line"
      );

      elements.hint.style.removeProperty(
        "animation-delay"
      );
    },
    { once: true }
  );
}

function updatePrompt() {
  elements.form.querySelector(
    ".prompt"
  ).outerHTML =
    getPromptHtml(
      currentShell
    );

  elements.shellHelpCommand.textContent =
    getShellCommand(
      currentShell,
      "help"
    );

  elements.hint.textContent =
    currentShell === "linux"
      ? "Enter a command or select one from the man page. Use ↑ and ↓ for command history."
      : "Enter a command or select one from the help list. Use ↑ and ↓ for command history.";

  elements.input.setAttribute(
    "aria-label",
    currentShell === "linux"
      ? "Enter a Linux portfolio command"
      : "Enter a PowerShell portfolio command"
  );
}