import { HOBBIES } from "../data/easter-eggs.js";
import { SHELLS } from "../config/constants.js";

const EXACT_EASTER_EGGS = Object.freeze({
  strawberry: () => `<div class="strawberry-egg" aria-label="Strawberry, love"><img class="strawberry-egg__icon" src="assets/icons/strawberry.svg" alt=""><span class="strawberry-egg__heart">&lt;3</span></div>`,
  ly: () => `<div class="output-copy"><p>Love you too &lt;3</p></div>`,
  hobbies: () => `<div class="output-copy"><p>Nice for U to ask! I like:</p></div>
    <ul class="hobby-list">${HOBBIES.map((hobby) => `<li class="hobby-item">${hobby}</li>`).join("")}</ul>`
});

export function resolveEasterEgg(rawCommand, shell) {
  const normalized = rawCommand.trim().toLowerCase();

  if (shell === SHELLS.linux && /^sudo(?:\s|$)/.test(normalized)) {
    return `<div class="output-copy"><p>Hey! It’s my site, not yours!</p></div>`;
  }

  if (shell === SHELLS.linux && /^rm\s+-rf\s+\/\s*$/.test(normalized)) {
    return `<div class="output-copy"><p>Nice try! Absolutely not.</p></div>`;
  }

  return EXACT_EASTER_EGGS[normalized]?.() || null;
}
