export const PROJECTS = Object.freeze([
  {
    year: 2026,
    timelineOrder: 1,
    title: "DECODE Differential Turret",
    categories: ["CAD", "Mechanical Design"],
    competition: "FTC",
    summary: "An experimental infinite-rotation differential turret and flywheel developed for Team 24310 EXOROS after the DECODE season.",
    details: [
      "Two bare motors drive the differential turret and flywheel.",
      "A string-actuated coaxial hood uses one Axon MAX servo.",
      "Counter-rollers remove backspin while a cable-free layout enables continuous rotation."
    ],
    tags: ["Fusion 360", "FTC", "CAD", "Differential", "Flywheel"],
    galleryMode: "cad",
    media: [
      "assets/projects/diffy_turret/diffy_1.png",
      "assets/projects/diffy_turret/diffy_2.png",
      "assets/projects/diffy_turret/diffy_3.png"
    ],
    links: [
      { label: "View Fusion 360 CAD", href: "https://a360.co/4ck3NSS", resourceType: "preview" }
    ]
  },
  {
    year: 2026,
    timelineOrder: 2,
    title: "Unilearn",
    categories: ["Software", "Marketing"],
    competition: "InfoEducație",
    summary: "An Android space sandbox game that turns astronomy into an interactive universe for experimentation, discovery, and learning.",
    details: [
      "Built in Godot with physics simulation, celestial systems, collectible Planet Cards, quizzes, and achievements.",
      "Includes Apollo AI, Firebase synchronization, authenticated offline use, and BLE card trading and multiplayer."
    ],
    tags: ["Godot", "GDScript", "Android", "Firebase", "BLE", "AI"],
    galleryMode: "square-static",
    campaign: {
      title: "Unilearn: Planet Hunt",
      summary: "A three-day experiential campaign that turned the app launch into a real-world planet hunt at InfoEducație 2026.",
      details: [
        "Participants collected five hidden planet stickers, completed a printed bingo card, then downloaded Unilearn and generated a sixth planet in the app.",
        "The first 17 participants to finish earned themed keychains, connecting physical collectibles, QR onboarding, social engagement, and the game itself."
      ]
    },
    media: [
      "assets/projects/unilearn/unilearn_github.png",
      "assets/projects/unilearn/unilearn_1.png",
      "assets/projects/unilearn/unilearn_3.png"
    ],
    links: [
      { label: "GitHub repository", href: "https://github.com/adisimaimulte1/unilearn-extended" },
      { label: "View documentation", href: "https://canva.link/5lo3nyut9nj6vlx" },
      { label: "Nationals presentation", href: "https://canva.link/iyfb7ynp26902tr" },
      { label: "Download Android release", href: "https://github.com/adisimaimulte1/unilearn-extended/releases/tag/V.2.0.0" },
      { label: "Planet Hunt flyers", href: "https://canva.link/zumug2gc4uv3kmm" }
    ],
    archives: [
      { label: "Illustrator source files", href: "assets/projects/unilearn/illustrator.zip" }
    ]
  },
  {
    year: 2024,
    timelineOrder: 3,
    title: "Modular FLL Robot V2 (SUBMERGED)",
    categories: ["CAD", "Robotics"],
    competition: "FLL",
    summary: "The second iteration of my modular EV3 robot platform, redesigned for the 2024–2025 SUBMERGED FLL season.",
    details: [
      "A smaller, easier-to-remove frame improves access, cable management, and matches the team's color identity.",
      "High-traction wheels and dog gears improve grip, simplify meshing, and reduce drivetrain slippage.",
      "The modular attachment drive adds a front output for easier connection to 90-degree mechanisms.",
      "Unused color sensors were removed to reduce clutter and keep the platform focused on systems we actually used."
    ],
    tags: ["BrickLink Studio", "FLL", "LEGO Technic", "EV3", "Modular Design"],
    galleryMode: "cad-contained",
    media: [
      "assets/projects/modular_fll_robo_v2/bot2_from_above.png",
      "assets/projects/modular_fll_robo_v2/robot1.png",
      "assets/projects/modular_fll_robo_v2/robot2.png"
    ],
    links: [
      { label: "Open interactive 3D viewer", href: "viewer.html?model=submerged", resourceType: "preview" },
      { label: "View building instructions", href: "assets/projects/modular_fll_robo_v2/bot_2024-2025.pdf", resourceType: "instructions" },
      { label: "Download BrickLink Studio CAD", href: "assets/projects/modular_fll_robo_v2/bot_2024-2025.io", download: true, resourceType: "download" },
      { label: "Download Collada model", href: "assets/projects/modular_fll_robo_v2/bot_2024-2025.dae", download: true, resourceType: "download" }
    ]
  },
  {
    year: 2025,
    timelineOrder: 1,
    title: "Optima",
    categories: ["Software", "Marketing"],
    competition: "InfoEducație",
    summary: "An AI-powered mobile platform for planning outreach events, coordinating teams, and measuring real-world impact.",
    details: [
      "Built with Flutter, Firebase, and a Node.js backend, with role-based collaboration and cloud synchronization.",
      "Jamie, its AI assistant, supports planning, reminders, voice commands, and contextual event guidance."
    ],
    tags: ["Flutter", "Dart", "Firebase", "Node.js", "AI", "Mobile"],
    galleryMode: "square-static",
    media: [
      "assets/projects/optima/github-optima.png",
      "assets/projects/optima/optima1.png",
      "assets/projects/optima/optima2.png"
    ],
    links: [
      { label: "GitHub repository", href: "https://github.com/adisimaimulte1/optima-outreach-app" },
      { label: "View documentation", href: "https://canva.link/7mt491eb6vhe7m6" },
      { label: "Nationals rap presentation", href: "https://drive.google.com/file/d/1qDDzTazqg2pkJAAKb0YSUk7vTLF2nr65/view?usp=drive_link" },
      { label: "Official website", href: "https://adisimaimulte1.github.io/optima-official-site/" },
      { label: "App & links", href: "https://linktr.ee/optima_app" },
      { label: "Watch app trailer", href: "https://drive.google.com/file/d/1UxKEoCmoET1405pZGEnVEB09r7WJEPUo/view?usp=drive_link" },
      { label: "Watch live rap performance", href: "https://drive.google.com/file/d/1rcYIVWg3zZmHrv7SSAmstxHcCx2FQFiL/view?usp=drive_link" }
    ]
  },
  {
    year: 2024,
    timelineOrder: 2,
    title: "Modular FLL Robot V1 (MASTERPIECE)",
    categories: ["CAD", "Robotics"],
    competition: "FLL",
    summary: "My first modular FLL robot CAD, designed around the LEGO Mindstorms EV3 platform for the 2023–2024 MASTERPIECE season.",
    details: [
      "A compact, reinforced chassis protects the drivetrain and keeps the robot's footprint predictable on the field.",
      "The open central mechanism provides a geared interface for swapping and driving mission attachments.",
      "The design package includes the editable BrickLink Studio model, browser-ready Collada preview, and step-by-step building instructions."
    ],
    tags: ["BrickLink Studio", "FLL", "LEGO Technic", "EV3", "Modular Design"],
    galleryMode: "cad-contained",
    media: [
      "assets/projects/modular_fll_robot_v1/bot_from_above.png",
      "assets/projects/modular_fll_robot_v1/robot1.png",
      "assets/projects/modular_fll_robot_v1/robot2.png"
    ],
    links: [
      { label: "Open interactive 3D viewer", href: "viewer.html?model=masterpiece", resourceType: "preview" },
      { label: "View building instructions", href: "assets/projects/modular_fll_robot_v1/omega_bot_2024_instructions.pdf", resourceType: "instructions" },
      { label: "Download BrickLink Studio CAD", href: "assets/projects/modular_fll_robot_v1/OMEGA_bot_2023-2024.io", download: true, resourceType: "download" },
      { label: "Download Collada model", href: "assets/projects/modular_fll_robot_v1/OMEGA_bot_2023-2024.dae", download: true, resourceType: "download" }
    ]
  },
  {
    year: 2024,
    timelineOrder: 1,
    title: "Omega Core Team Identity & Robotics",
    categories: ["Marketing", "Robotics"],
    competition: "FLL",
    summary: "A complete technical and visual identity built for Omega Core during the 2023–2024 MASTERPIECE season.",
    details: [
      "Designed and built the competition robot and its mission attachments, then published each planned robot run as a video series covering the maximum-point MASTERPIECE strategy.",
      "Created the team's logos, stickers, roll-ups, social media templates, sponsor book, presentations, email templates, flyers, badges, Linktree, and GitHub presence.",
      "Combined AI-assisted exploration with Adobe Illustrator and Canva to build a consistent identity across digital content, competition materials, and sponsor communication."
    ],
    tags: ["FLL", "Brand Identity", "Adobe Illustrator", "Canva", "Content Creation", "Robot Design"],
    galleryMode: "brand-static",
    media: [
      "assets/projects/omega_core/logo_sticker.png",
      "assets/projects/omega_core/sticker2.png",
      "assets/projects/omega_core/sticker1.png"
    ],
    links: [
      { label: "Omega Core YouTube", href: "https://www.youtube.com/@omegacoreFLL" },
      { label: "Omega Core Linktree", href: "https://linktr.ee/omega.core" },
      { label: "Omega Core GitHub", href: "https://github.com/omegacoreFLL" },
      { label: "View complete design archive", href: "https://drive.google.com/drive/folders/1Ql8cahU1SJMGEIIZcjv7rvbLHZxEohWd?usp=drive_link" }
    ]
  },
  {
    year: 2024,
    timelineOrder: 4,
    title: "PythFinder",
    categories: ["Software", "Robotics"],
    competition: "InfoEducație",
    summary: "A Python motion-planning library and desktop trajectory generator designed to make FLL autonomous routines more precise and consistent.",
    details: [
      "Precomputes robot trajectories and exports them as portable text data for constrained robot hardware.",
      "Supports acceleration profiles, concurrent actions, hardware-independent paths, and a plug-and-play EV3 implementation."
    ],
    tags: ["Python", "Motion Planning", "Robotics", "FLL", "Trajectory Generation"],
    galleryMode: "natural-static",
    media: [
      "assets/projects/pythfinder/pyth-finder-logo-ev3-quickstart.png",
      "assets/projects/pythfinder/fll-preset.png",
      "assets/projects/pythfinder/simulator-paint.png"
    ],
    links: [
      { label: "GitHub repository", href: "https://github.com/omegacoreFLL/PythFinder" },
      { label: "View documentation", href: "https://drive.google.com/file/d/1TpG4ag9_2ZTlk2RUeH7fy-H-KKX94t1-/view?usp=drive_link" },
      { label: "Download nationals presentation", href: "https://drive.google.com/file/d/1o0OgeHnDLew2XGKfnDJqmGOGaQsZqPA-/view?usp=drive_link" },
      { label: "Watch project montage", href: "https://drive.google.com/file/d/14vOLroCdhk79To2eraS59hQryrh6fI5b/view?usp=drive_link" }
    ],
    archives: [
      { label: "Illustrator source files", href: "assets/projects/pythfinder/illustrator.zip" },
      { label: "Premiere source files", href: "https://drive.google.com/file/d/1NqlpOgZPRCuhyGQhlI6MWEbZJ43AoWdO/view?usp=drive_link", download: false }
    ]
  }
]);
