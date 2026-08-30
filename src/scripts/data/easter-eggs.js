export const HOBBIES = Object.freeze([
  "Going to the gym",
  "Ice skating",
  "Nature walks",
  "Cooking",
  "Learning new stuff",
  "Music — especially rap"
]);

export const SHARED_HIDDEN_COMMANDS = Object.freeze([
  { command: "strawberry", label: "strawberry", description: "Display a little something sweet" },
  { command: "theme --strawberry", label: "theme --strawberry / -s", description: "Activate the strawberry accent" },
  { command: "hobbies", label: "hobbies", description: "See what I enjoy outside projects" },
  { command: "ly", label: "ly", description: "Send some love" }
]);

export const POWERSHELL_HIDDEN_COMMANDS = Object.freeze([
  ...SHARED_HIDDEN_COMMANDS,
  { command: "linux", label: "linux", description: "Switch to a Linux terminal" }
]);

export const LINUX_HIDDEN_COMMANDS = Object.freeze([
  ...SHARED_HIDDEN_COMMANDS.map((item) => item.command.startsWith("theme ")
    ? { ...item, command: item.command.replace("theme", "accent"), label: item.label.replace("theme", "accent") }
    : item),
  { command: "sudo ", label: "sudo <message>", description: "Try to take over my terminal" },
  { command: "rm -rf /", label: "rm -rf /", description: "Definitely do not delete everything" },
  { command: "powershell", label: "powershell", description: "Return to Windows PowerShell" }
]);
