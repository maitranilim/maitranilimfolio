# Nilim Maitra Portfolio

A responsive, recruiter-friendly static portfolio.

- Hero with the one-line pitch, proof points, and direct contact actions
- Three flagship project case studies, followed by a filterable projects section
- Skills grouped by what each project demonstrates
- A curated Synthetic Vision gallery with a keyboard-friendly poster viewer
- Scroll progress, reveal animations, tilt and spotlight hovers, and magnetic buttons, all disabled for visitors who prefer reduced motion
- A light and dark theme toggle (turquoise, yellow, black, and white) that follows the system setting until a visitor picks one
- A focused recruiter view at `?view=recruiter` that hides the gallery

## Run locally

From the repository root:

```sh
python3 -m http.server 4173 --directory nilim-portfolio
```

Then open `http://127.0.0.1:4173`.

## Update content

- Contact details are in the Contact section of `index.html`, the JSON-LD block in the page head, and `SITE` at the top of `app.js`.
- Project cards show a "last updated" label that refreshes from the public GitHub API and falls back to the `data-pushed` date on each card.
- Project images live in `assets/projects/`. The Matchbox Simulator visual is an inline SVG illustration; replace it with a screenshot when one is available.

## Publish

This folder has no build step and can be deployed to any static host. The root `vercel.json` sets the output directory for Vercel.
