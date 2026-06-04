# Nilim Maitra Portfolio

A responsive, recruiter-friendly static portfolio that combines:

- Live public GitHub repository signals for project ranking and current focus
- Verified LinkedIn/resume milestones for the professional timeline
- A curated Synthetic Vision Director gallery spanning eight AI-directed poster studies
- A focused recruiter view at `?view=recruiter`
- One-click native share or clipboard copy
- Print-friendly styling

Public URL: `https://broad-art-3e62.maitranilim.workers.dev/`

## Run locally

From the workspace root:

```powershell
node work/serve-portfolio.mjs
```

Then open `http://127.0.0.1:4173`.

## Publish

This folder has no build step. Deploy `outputs/nilim-portfolio` to any static host such as Vercel,
Netlify, or GitHub Pages. Once hosted, the "Share with recruiter" action automatically copies or
shares the public recruiter-view URL.

## Data notes

The browser refreshes public repositories from GitHub's REST API and ranks them using code volume,
recency, visible deployment links, descriptions, and repository signals. LinkedIn blocks
unrestricted client-side profile parsing, so career milestones use a verified profile snapshot and
link back to the source.
