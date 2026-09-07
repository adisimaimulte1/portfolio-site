<div align="center">

<img src="assets/icons/site-icon.png" width="112" alt="Adrian Contraș portfolio icon">

# Interactive Terminal Portfolio

### My work, presented one command at a time.

![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F56600?style=for-the-badge\&logo=javascript\&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-Semantic-F56600?style=for-the-badge\&logo=html5\&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-Responsive-F56600?style=for-the-badge\&logo=css\&logoColor=white)

**My personal portfolio, bringing together the projects, competitions, experiments and awards that have shaped my work so far.**

</div>

---

## About this portfolio

I’m Adrian, a $\color{#F56600}{\textsf{Mechatronics and Robotics student}}$ at POLITEHNICA Bucharest—at least at the time of writing this.

I enjoy turning ideas into real projects through $\color{#F56600}{\textsf{robotics}}$, $\color{#F56600}{\textsf{software development}}$, $\color{#F56600}{\textsf{CAD}}$ and $\color{#F56600}{\textsf{creative marketing}}$—from the first rough concept to something people can actually use.

This website is where I collect that work. It includes my $\color{#F56600}{\textsf{personal projects}}$, competition entries, technical experiments, awards, documentation and other parts of my journey.

Rather than using a traditional portfolio layout, I built the site around a $\color{#F56600}{\textsf{PowerShell-inspired terminal}}$. Visitors can explore everything by entering commands, selecting suggested options and filtering the content they want to see.

The entire website is made with $\color{#F56600}{\textsf{vanilla HTML, CSS and JavaScript}}$, without frameworks or build tools.

Interactive Collada previews use a small, locally vendored Three.js viewer so the FLL models remain self-hosted and require no external account or runtime CDN.

## Exploring the site

The terminal provides access to:

* $\color{#F56600}{\textsf{Projects}}$ from robotics, software, CAD and other fields.
* $\color{#F56600}{\textsf{Awards}}$ from competitions throughout the years.
* $\color{#F56600}{\textsf{Skills}}$ developed through practical work and team experience.
* $\color{#F56600}{\textsf{Project galleries}}$ with screenshots, renders, videos and presentations.
* $\color{#F56600}{\textsf{Interactive 3D previews}}$ for supported CAD projects.
* $\color{#F56600}{\textsf{Documentation and files}}$ connected to each project.
* $\color{#F56600}{\textsf{Contact information}}$ and links to my other profiles.

Projects and awards can be filtered by year, category, competition and keywords. The website also remembers terminal history, progress and interface preferences locally.

*There may be a few extra commands listed under `help -h`.*

## Commands

### Project galleries

Gallery buttons and media are indexed from `assets/projects/<project-folder>/gallery/`. A folder enables the button even when it contains no media; removing the folder disables it. Only photos and videos inside that folder are included, never the card previews.

After adding/removing gallery folders or media, run from the repository root:

```powershell
python scripts/update-galleries.py
```

Commit the generated `src/scripts/data/galleries.js` with your assets. This small indexing script needs only Python's standard library; the website remains static vanilla HTML/CSS/JavaScript. Empty galleries contain a `.gitkeep` so Git preserves the folder; it is not displayed. Supported files: PNG, JPG/JPEG, WebP, GIF, AVIF, SVG, MP4, WebM, and OGV. Numbered subfolders become sections: `1_app_features`, `2_at_competition`, `10_early_development`. Sections and files use natural numeric order (2 before 10); section headings omit the number and turn underscores/hyphens into spaces. Media directly inside `gallery` appears first without a heading. Empty sections stay hidden. Photos and videos share rows sized to fit the available screen width at their original aspect ratios. Phone galleries use compact thumbnails; select any photo or video to open the larger viewer.

### Terminal commands

```text
help
about
projects
awards
skills
contact
theme
clear
```

Commands can also be combined with filters:

```text
projects --latest
projects --year 2026
projects --category software
projects --competition infoeducatie
awards --medals
contact --all
```

Use `↑` and `↓` to navigate recent commands.

## The work

The portfolio contains $\color{#F56600}{\textsf{fully developed and documented projects}}$ from different parts of my journey: applications created for InfoEducație that went on to win national awards, robotics systems designed for FTC teams and other side projects I built simply because I thought they would be cool.

Depending on the project, its entry may include $\color{#F56600}{\textsf{source code}}$, $\color{#F56600}{\textsf{documentation}}$, $\color{#F56600}{\textsf{presentations}}$, $\color{#F56600}{\textsf{videos}}$, $\color{#F56600}{\textsf{CAD files}}$, screenshots and downloadable resources.

---

<div align="center">

### Explore everything at [adriancontras.dev](https://adriancontras.dev)

Designed and built by [Adrian Contraș](https://github.com/adisimaimulte1).

</div>

### Production media workflow

Keep camera originals outside this repository. Project images are production WebP files with a maximum edge of 1920 px (quality 82 for photos, 86 for screenshots/artwork). EXIF orientation and sRGB color conversion are applied before metadata is removed. Responsive 320/640/960 px WebP thumbnails serve cards and galleries; larger viewer sizes reuse the production image. The viewer's open-file link opens this optimized asset.

To import new JPG/PNG images or MP4 videos, install `Pillow` and `imageio-ffmpeg`, then run:

```powershell
python scripts/optimize-media.py images
python scripts/optimize-media.py videos
python scripts/update-previews.py --prune
python scripts/update-video-previews.py
python scripts/update-galleries.py
python scripts/check-media.py
```

The optimizer replaces originals after validating each output. Image conversion changes extensions to `.webp` and updates explicit HTML/JavaScript/CSS asset references. The gallery index regenerates gallery paths automatically. Video optimization is resumable using ignored `.cache/media-optimization/` records. Retain that cache to avoid re-encoding existing clips on subsequent imports.

Local videos retain their full duration, using H.264/AAC MP4 with fast-start playback, up to 960 px maximum edge, 24 fps, CRF 32, a 550 kb/s video ceiling (lower for long clips), and 48 kb/s mono audio. This intentionally trades video detail for a small repository. No clip should exceed 25 MiB. Prefer a direct external video link when an identical online version is known; retain the project's existing timestamped YouTube match links. Never replace a local clip with an unrelated channel or playlist.

Video tiles use small WebP posters; scrolling does not load video streams. Only the open viewer creates a player, and closing or navigating unloads it. Image loading remains responsive and deferred until near the viewport.

Before committing, run `python scripts/check-media.py`; before pushing, run `python scripts/check-media.py --history`. These validate local media references and budgets: 1 MiB per raster image, 25 MiB per video, 50 MiB per other asset, 750 MiB total assets, and 950 MiB of unique uncompressed Git blobs. GitHub blocks individual Git files over 100 MiB and pushes over 2 GB. CI runs the same checks. Do not commit `.cache/`, original-media backup folders, or camera RAW/MOV files. Deleting a committed original is insufficient: its old blob must also be removed from history.
