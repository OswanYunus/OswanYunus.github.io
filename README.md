# Oswan Yunus | Interactive Portfolio

A Spider-Verse styled portfolio: 3D inked shapes (three.js), halftone print texture, colour-offset headings, three switchable "dimensions", a playable football mini-game, and a game-dev quest log.

## Run it

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev      # opens a local dev server with live reload
npm run build    # creates the production site in /dist
npm run preview  # previews the production build
```

## Project layout

```
oswan-portfolio/
├── index.html          Page structure (sections, nav, canvas)
├── package.json        Scripts and dependencies (three, vite)
├── vite.config.js      Build config (relative base so it deploys anywhere)
├── public/
│   └── favicon.svg
└── src/
    ├── data.js         <- EDIT THIS: bio, skills, projects, timeline, hobbies, quests
    ├── style.css       Comic look, dimensions (themes), layout
    ├── main.js         Entry point that wires everything together
    ├── scene.js        three.js: toon-shaded shapes, pointer repel, scroll camera
    ├── ui.js           Rendering from data, filters, tilt, dimension switcher, effects
    └── keepy.js        Keepy-uppy canvas mini-game
```

## Things to fill in or check (I could not find these online)

1. **Work experience.** No employers were visible on your GitHub. In `src/data.js`, the `timeline` array has a commented template. Copy it in for each job, internship or volunteering role.
2. **Skill levels.** The 1 to 5 levels in `skills` are my estimates. Adjust them so they are honest, because interviewers will ask.
3. **Project blurbs.** Only the repo names, descriptions and languages were public. Add what each project does, what you learned, and a live demo link if you have one (add a `demo:` field and a link in `renderProjects` in `ui.js`).
4. **2D Simulator.** The repo looked empty when I checked. Push your code before sharing the site.
5. **Graduation date.** It says "November 2027 (date to be confirmed)". Update `profile.graduation` when it is confirmed.
6. **Screenshots.** Adding a screenshot or GIF per project makes a big difference.

## Interactions to know about

- Move the mouse: nearby shapes get pushed away. Click a shape: it spins, pops and changes colour.
- "Morph the shape" cycles the big hero shape through different solids.
- Top bar diamonds switch dimension: Earth-1610 (magenta/cyan), Sky Blue City, and Noir.
- Click a skill: filters the projects that use it.
- Hobby cards flip. The quest log saves progress in the visitor's browser.
- Keepy-uppy: tap the ball, where you tap decides where it flies. Best score is saved locally.
- Konami code (up up down down left right left right B A) unlocks a surprise.
- The "More on GitHub" list loads live from the GitHub API. If it fails, the featured projects still show.
- Respects `prefers-reduced-motion`, works without WebGL (no 3D, everything else works), and is keyboard accessible.

## Deploy

**Netlify or Vercel:** connect the repo, build command `npm run build`, publish directory `dist`.

**GitHub Pages:** push the repo, then in Settings > Pages choose GitHub Actions and use the Vite static site workflow, or build locally and publish the `dist` folder.

A nice touch: name the repo `OswanYunus.github.io` for a free `https://oswanyunus.github.io` address.

## Learning game dev from here

The "Game dev quest log" section is a real starter plan: try Godot and Unity for a weekend each, finish the 2D simulator, ship a tiny game in a week, then enter an itch.io game jam. When you complete something, add it as a project and tick the quest off.
