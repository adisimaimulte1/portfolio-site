export const PROJECTS = Object.freeze([
  {
    year: 2025,
    timelineOrder: 3,
    title: "Sideswipe V2",
    id: "sideswipe-v2",
    categories: ["Robotics", "CAD"],
    competition: "FTC",
    summary: "The first fully built and competition-tested Sideswipe robot, optimized around simpler packaging, reliability, and fast intake-to-shoot transfer.",
    details: [
      "~14 kg robot mass; ~290 RPM spindexer; ~1150 RPM intake; ~862 RPM swerve; ~861 g flywheel rotating mass.",
      "Dual-motor fixed flywheel shooter, with the swerve drivetrain providing full-field aiming instead of a turret.",
      "3-position passive spindexer supported by a lazy-susan bearing.",
      "Pivoting single-roller intake and compact belt-driven over-center endgame.",
      "HuskyLens vision system."
    ],
    tags: ["Fusion 360", "FTC", "CAD", "Swerve", "Flywheel", "Spindexer", "HuskyLens"],
    galleryMode: "cad",
    media: [
      "assets/projects/sideswipe_v2/Sideswipe_v2_1.webp",
      "assets/projects/sideswipe_v2/Sideswipe_v2_2.webp",
      "assets/projects/sideswipe_v2/Sideswipe_v2_3.webp"
    ],
    links: [
      { label: "View Fusion 360 CAD", href: "https://a360.co/4A1exk2", resourceType: "preview" },
      { label: "Engineering documentation", href: "https://canva.link/r0n7cg3halsxqgx" }
    ]
  },
  {
    year: 2025,
    timelineOrder: 2,
    title: "Sideswipe V1",
    id: "sideswipe-v1",
    categories: ["Robotics", "CAD"],
    competition: "FTC",
    summary: "The first complete DECODE robot concept, integrating drivetrain, intake, sorting, shooter, and endgame while exploring the packaging and mechanisms that shaped V2.",
    details: [
      "First full-system prototype; 3-slot spindexer; single-flywheel turret shooter; swerve conversion during development.",
      "Started with mecanum, then switched to swerve for better positioning and packaging.",
      "3-position rotating spindexer with passive artifact retention, feeding a turreted single-flywheel shooter with an adjustable hood.",
      "Interlocking plate chassis for rigidity and a compact over-center tilting endgame.",
      "Exposed the issues that drove V2: weight, intake geometry, spindexer reliability, shooter recovery, and tight extension margins."
    ],
    tags: ["Fusion 360", "FTC", "CAD", "Swerve", "Turret", "Flywheel", "Spindexer"],
    galleryMode: "cad",
    media: [
      "assets/projects/sideswipe_v1/Sideswipe_v1_1.webp",
      "assets/projects/sideswipe_v1/Sideswipe_v1_2.webp",
      "assets/projects/sideswipe_v1/Sideswipe_v1_3.webp"
    ],
    links: [
      { label: "View Fusion 360 CAD", href: "https://a360.co/4ximGOP", resourceType: "preview" },
      { label: "Engineering documentation", href: "https://canva.link/r0n7cg3halsxqgx" }
    ]
  },
  {
    year: 2026,
    timelineOrder: 0,
    title: "Sideswipe V3",
    id: "sideswipe-v3",
    categories: ["Robotics", "CAD"],
    competition: "FTC",
    summary: "Final optimized DECODE competition robot built around a compact carbon-fiber chassis, custom coaxial swerve, high-speed spindexer, and heavily instrumented control system.",
    details: [
      "Romania's first fully pocketed carbon-fiber FTC robot: an 11 kg, 13\" × 13\" design, down from ~14 kg on V2 (~21% lighter), with bare motors and carbon-fiber shafts.",
      "Custom 3D-printed coaxial swerve reaches 900 RPM (~862 on V2, ~4% faster); the intake reaches 1500 RPM (~1150, ~30% faster).",
      "A bearing-stack spindexer runs at 500 RPM (~290 on V2, ~72% faster), shooting 3 balls in ~0.3 s; an MGN-rail endgame extension reaches 38 cm above ground in ~1.5 s.",
      "Control software combines 3 color sensors, 1 magnetic sensor, 2 odometry pods with Pinpoint, motor encoders, etc."
    ],
    tags: ["Fusion 360", "FTC", "CAD", "Carbon Fiber", "Coaxial Swerve", "3D Printing", "Odometry"],
    galleryMode: "cad",
    media: [
      "assets/projects/sideswipe_v3/Sideswipe_v3_1.webp",
      "assets/projects/sideswipe_v3/Sideswipe_v3_2.webp",
      "assets/projects/sideswipe_v3/Sideswipe_v3_3.webp"
    ],
    matchGroups: [
      {
        "title": "Nationals",
        "matches": [
          {
            "label": "Q9",
            "day": 1,
            "href": "https://www.youtube.com/watch?v=pvmxbH8YW-k&t=14775s"
          },
          {
            "label": "Q16",
            "day": 1,
            "href": "https://www.youtube.com/watch?v=pvmxbH8YW-k&t=17390s"
          },
          {
            "label": "Q28",
            "day": 2,
            "href": "https://www.youtube.com/watch?v=zG45zl5pcDw&t=2959s"
          },
          {
            "label": "Q48",
            "day": 2,
            "href": "https://www.youtube.com/watch?v=zG45zl5pcDw&t=18235s"
          },
          {
            "label": "Q58",
            "day": 2,
            "href": "https://www.youtube.com/watch?v=zG45zl5pcDw&t=23380s"
          },
          {
            "label": "Q64",
            "day": 2,
            "href": "https://www.youtube.com/watch?v=zG45zl5pcDw&t=25400s"
          }
        ]
      },
      {
        "title": "Regionals",
        "matches": [
          {
            "label": "Q5",
            "day": 1,
            "href": "https://www.youtube.com/watch?v=5Ebi2-1rlEQ&t=4448s"
          },
          {
            "label": "Q8",
            "day": 1,
            "href": "https://www.youtube.com/watch?v=5Ebi2-1rlEQ&t=9300s"
          },
          {
            "label": "Q18",
            "day": 1,
            "href": "https://www.youtube.com/watch?v=5Ebi2-1rlEQ&t=14857s"
          },
          {
            "label": "Q21",
            "day": 1,
            "href": "https://www.youtube.com/watch?v=5Ebi2-1rlEQ&t=18566s"
          },
          {
            "label": "Q32",
            "day": 2,
            "href": "https://www.youtube.com/watch?v=k-pGHb2_ZjI&t=1569s"
          },
          {
            "label": "Q37",
            "day": 2,
            "href": "https://www.youtube.com/watch?v=k-pGHb2_ZjI&t=4007s"
          },
          {
            "label": "M2",
            "day": 2,
            "href": "https://www.youtube.com/watch?v=k-pGHb2_ZjI&t=11417s"
          },
          {
            "label": "M4",
            "day": 2,
            "href": "https://www.youtube.com/watch?v=k-pGHb2_ZjI&t=12270s"
          },
          {
            "label": "M7",
            "day": 2,
            "href": "https://www.youtube.com/watch?v=k-pGHb2_ZjI&t=17296s",
            "note": "Robot fully died: snapped cable. :("
          },
          {
            "label": "M9",
            "day": 2,
            "href": "https://www.youtube.com/watch?v=k-pGHb2_ZjI&t=15320s"
          }
        ]
      }
    ],
    links: [
      { label: "View Fusion 360 CAD", href: "https://a360.co/3T76xgV", resourceType: "preview" },
      { label: "Robot code", href: "https://github.com/exorosFTC/DeCodE" },
      { label: "Additional robot videos", href: "https://drive.google.com/drive/folders/10rgvOno3l9h5e3mtl9LrjW9pQ8JZAG3V?usp=drive_link" },
      { label: "League meets early robot matches", href: "https://www.youtube.com/playlist?list=PLtbQ-qkLkCe2lX5gubuAySoLrI9SkwYoT" },
      { label: "Engineering documentation", href: "https://canva.link/r0n7cg3halsxqgx" }
    ]
  },
  {
    year: 2026,
    timelineOrder: 3,
    title: "A-Shell",
    id: "a-shell",
    categories: ["Software"],
    competition: "Personal project",
    summary: "A reversible Windows customization environment combining a minimal desktop, native Matrix rain, monochrome UI, and a cohesive command-line interface.",
    details: [
      "Built with C++ / Win32 and PowerShell, combining lightweight Matrix rendering, shared appearance controls, and automatic monochrome icon matching.",
      "Preserves the original Windows setup through reversible CLI commands, persistent feature switches, and installer upgrades / repairs that retain user state."
    ],
    tags: ["Windows", "C++", "PowerShell", "Native", "CLI", "Win32", "Desktop Customization"],
    galleryMode: "square-static",
    media: [
      "assets/projects/a_shell/A-Shell_Logo_Original_HQ.webp",
      "assets/projects/a_shell/ashell1.webp",
      "assets/projects/a_shell/ashell2.webp"
    ],
    links: [
      { label: "GitHub repository", href: "https://github.com/adisimaimulte1/a-shell" },
      { label: "Download Windows installer", href: "https://github.com/adisimaimulte1/a-shell/releases/latest" }
    ],
    archives: [
      { label: "Illustrator source files", href: "assets/projects/a_shell/illustrator.zip" }
    ]
  },
  {
    year: 2026,
    timelineOrder: 1,
    title: "DECODE Differential Turret",
    id: "decode-turret",
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
      "assets/projects/diffy_turret/diffy_1.webp",
      "assets/projects/diffy_turret/diffy_2.webp",
      "assets/projects/diffy_turret/diffy_3.webp"
    ],
    links: [
      { label: "View Fusion 360 CAD", href: "https://a360.co/4ck3NSS", resourceType: "preview" }
    ]
  },
  {
    year: 2026,
    timelineOrder: 2,
    title: "Unilearn",
    id: "unilearn",
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
      "assets/projects/unilearn/unilearn_github.webp",
      "assets/projects/unilearn/unilearn_1.webp",
      "assets/projects/unilearn/unilearn_3.webp"
    ],
    links: [
      { label: "GitHub repository", href: "https://github.com/adisimaimulte1/unilearn-extended" },
      { label: "View documentation", href: "https://canva.link/5lo3nyut9nj6vlx" },
      { label: "Nationals presentation", href: "https://canva.link/iyfb7ynp26902tr" },
      { label: "Watch nationals presentation", href: "https://drive.google.com/file/d/1zqtpsWw9P_Z7WXkmjsKWGDP64dmFTck_/view?usp=drive_link" },
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
    id: "fll-v2",
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
      "assets/projects/modular_fll_robo_v2/bot2_from_above.webp",
      "assets/projects/modular_fll_robo_v2/robot1.webp",
      "assets/projects/modular_fll_robo_v2/robot2.webp"
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
    id: "optima",
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
      "assets/projects/optima/github-optima.webp",
      "assets/projects/optima/optima1.webp",
      "assets/projects/optima/optima2.webp"
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
    id: "fll-v1",
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
      "assets/projects/modular_fll_robot_v1/bot_from_above.webp",
      "assets/projects/modular_fll_robot_v1/robot1.webp",
      "assets/projects/modular_fll_robot_v1/robot2.webp"
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
    id: "omega-core",
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
      "assets/projects/omega_core/logo_sticker.webp",
      "assets/projects/omega_core/sticker2.webp",
      "assets/projects/omega_core/sticker1.webp"
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
    id: "pythfinder",
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
      "assets/projects/pythfinder/pyth-finder-logo-ev3-quickstart.webp",
      "assets/projects/pythfinder/fll-preset.webp",
      "assets/projects/pythfinder/simulator-paint.webp"
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
  },
  {
    year: 2024,
    timelineOrder: 5,
    title: "CENTERSTAGE Off-Season Robot",
    id: "centerstage-off-season",
    categories: ["Robotics", "CAD"],
    competition: "FTC",
    summary: "My first fully custom CAD-designed FTC robot, bringing separate intake and outtake mechanisms together as an early step in my mechanical-design progression.",
    details: [
      "Custom mecanum chassis with separate extended intake and outtake systems using cascade-strung linear slides.",
      "Surgical-tubing active intake and a bucket/hopper for collecting and transferring pixels.",
      "Differential outtake claw with 3 degrees of freedom, able to score both pixels together or release one independently."
    ],
    tags: ["Fusion 360", "FTC", "CAD", "Mecanum", "Cascade Slides", "Active Intake", "Differential Claw"],
    galleryMode: "cad",
    media: [
      "assets/projects/cs_off_season_robot/CS_Off_Season_Robot_1.webp",
      "assets/projects/cs_off_season_robot/CS_Off_Season_Robot_2.webp",
      "assets/projects/cs_off_season_robot/CS_Off_Season_Robot_3.webp"
    ],
    links: [
      { label: "View Fusion 360 CAD", href: "https://a360.co/4xGIpRf", resourceType: "preview" }
    ]
  },
  {
    year: 2024,
    timelineOrder: 6,
    title: "Phronima V1",
    id: "phronima-v1",
    categories: ["Robotics", "CAD"],
    competition: "FTC",
    summary: "An experimental INTO THE DEEP prototype whose bulky, impractical layout established the initial architecture and exposed the packaging problems that drove the compact V2 redesign.",
    details: [
      "Custom mecanum drivetrain with separate horizontal collection and vertical scoring systems built around cascade slides.",
      "Large active intake and a proposed Level 3 hang using the slides made the overall packaging excessively bulky.",
      "Insufficient horizontal-extension space and mechanically impractical mechanisms prevented a viable competition design; V1 served as a learning prototype."
    ],
    tags: ["Fusion 360", "FTC", "CAD", "Mecanum", "Cascade Slides", "Active Intake", "Prototyping"],
    galleryMode: "cad",
    media: [
      "assets/projects/phronima_v1/Phronima_v1_1.webp",
      "assets/projects/phronima_v1/Phronima_v1_2.webp",
      "assets/projects/phronima_v1/Phronima_v1_3.webp"
    ],
    links: [
      { label: "View Fusion 360 CAD", href: "https://a360.co/4iUA7AE", resourceType: "preview" },
      { label: "Engineering documentation", href: "https://canva.link/ayu0juh0vgdt6rc" }
    ]
  },
  {
    year: 2025,
    timelineOrder: -2,
    title: "Phronima V2",
    id: "phronima-v2",
    categories: ["Robotics", "CAD"],
    competition: "FTC",
    summary: "A compact, functional redesign of the oversized V1 prototype, marking a major step forward in packaging, manufacturing, and mechanical understanding while revealing the next design challenges.",
    details: [
      "Chassis reduced from approximately 44.2 × 29.5 cm to 29.6 × 29 cm, with motors low in the frame and accessible, compact electronics packaging.",
      "Claw-based intake replaced the bulky active intake; separate horizontal collection and vertical scoring remained, while the impractical hanging concept was abandoned.",
      "Iterated claws, pulleys, and structures alongside a custom 3D-printed electronics enclosure; tested PLA, PET-CF, resin, steel, and aluminum.",
      "The team CNC-machined and painted structural aluminum parts; limitations of claw-based collection motivated the later return to an active intake."
    ],
    tags: ["Fusion 360", "FTC", "CAD", "Mecanum", "Claw Intake", "CNC Machining", "Packaging"],
    galleryMode: "cad",
    media: [
      "assets/projects/phronima_v2/Phronima_v2_1.webp",
      "assets/projects/phronima_v2/Phronima_v2_2.webp",
      "assets/projects/phronima_v2/Phronima_v2_3.webp"
    ],
    links: [
      { label: "View Fusion 360 CAD", href: "https://a360.co/4yjHLcg", resourceType: "preview" },
      { label: "Engineering documentation", href: "https://canva.link/ayu0juh0vgdt6rc" },
      { label: "Additional robot videos", href: "https://drive.google.com/drive/folders/1_j4S0f_GEmfhle8Bs9suRG_gnoX0EO21?usp=sharing" }
    ]
  },
  {
    year: 2025,
    timelineOrder: -1,
    title: "Phronima V3",
    id: "phronima-v3",
    categories: ["Robotics", "CAD"],
    competition: "FTC",
    summary: "A CAD-only design study between V2 and V4, exploring a faster active intake and more compact mechanisms. This version was never physically built or competition-tested.",
    details: [
      "Reconsidered V2’s claw-based collection in favor of an active intake, exploring a rotating/turreted assembly for a wider collection range.",
      "Developed a compact coaxial transmission concept to keep the drive motor off the moving intake and reduce moving mass.",
      "Explored bearings and low-friction plexiglass guides while simplifying mechanisms and packaging; these CAD concepts informed the final V4."
    ],
    tags: ["Fusion 360", "FTC", "CAD", "Design Study", "Active Intake", "Coaxial Transmission", "Turret"],
    galleryMode: "cad",
    media: [
      "assets/projects/phronima_v3/Phronima_v3_1.webp",
      "assets/projects/phronima_v3/Phronima_v3_2.webp",
      "assets/projects/phronima_v3/Phronima_v3_3.webp"
    ],
    links: [
      { label: "View Fusion 360 CAD", href: "https://a360.co/3TexC1M", resourceType: "preview" },
      { label: "Engineering documentation", href: "https://canva.link/ayu0juh0vgdt6rc" }
    ]
  },
  {
    year: 2025,
    timelineOrder: 0,
    title: "Phronima V4 / Modesty",
    id: "phronima-v4",
    categories: ["Robotics", "CAD"],
    competition: "FTC",
    summary: "The final, mature INTO THE DEEP competition robot, combining lessons from V1–V3 into a simpler, more rigid and maintainable design with reliable active collection.",
    details: [
      "Aluminum hybrid active-claw intake with upper rollers, single-planetary-servo vertical motion, and a small servo retaining the game element for controlled positioning.",
      "Analytically checked intake torque: approximately 0.88 Nm required, with several times that available; bearings and plexiglass guides supported smooth transfers.",
      "Compact coaxial transmission kept motor mass off the moving intake; reducing the arm from roughly 5 degrees of freedom to 3 improved rigidity and reliability.",
      "Pocketed 3 mm EN AW-6082 aluminum structure, robust locknut/washer joints, centrally positioned mass, and low-mounted motors balanced stability, cooling, and serviceability."
    ],
    tags: ["Fusion 360", "FTC", "CAD", "Active Intake", "Coaxial Transmission", "EN AW-6082", "Mechanical Design"],
    galleryMode: "cad",
    media: [
      "assets/projects/phronima_v4_slash_modesty/Phronima_v4_1.webp",
      "assets/projects/phronima_v4_slash_modesty/Phronima_v4_2.webp",
      "assets/projects/phronima_v4_slash_modesty/Phronima_v4_3.webp"
    ],
    links: [
      { label: "View Fusion 360 CAD", href: "https://a360.co/4qXN5zA", resourceType: "preview" },
      { label: "Engineering documentation", href: "https://canva.link/ayu0juh0vgdt6rc" },
      { label: "Additional robot videos", href: "https://drive.google.com/drive/folders/1_j4S0f_GEmfhle8Bs9suRG_gnoX0EO21?usp=sharing" }
    ]
  }
]);
