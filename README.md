# Nilim Maitra — portfolio

Static portfolio site for Nilim Maitra, a frontend and creative developer building interactive web apps with UI/UX, motion, and 3D at the center.

The site lives in [`nilim-portfolio/`](nilim-portfolio/). It is plain HTML, CSS, and JavaScript with no build step.

## Flagship projects

- [Brickflux](https://github.com/maitranilim/make-or-break) — a canvas game where a Builder and Breaker compete for the grid, with seeded challenge links.
- [Aural](https://github.com/maitranilim/aural-audio-engine) — maps a song from genre to subgenre to microgenre, with confidence shown.
- [Matchbox Simulator](https://github.com/maitranilim/matchbox-simulator) — a 3D browser sandbox for fire and physics.

## Develop

```sh
python3 -m http.server 4173 --directory nilim-portfolio
```

Open <http://127.0.0.1:4173>. Run the checks with `node scripts/check.mjs`; the same script runs in GitHub Actions on every pull request.

## Deploy

`vercel.json` points Vercel at `nilim-portfolio/` as a static site. Any pull request gets a preview deployment once the repository is connected to a Vercel project.
