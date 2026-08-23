# Nexus Blog

A personal engineering blog built in React + TypeScript, designed to be served by Nginx from Nexus (a Samsung Galaxy M31 running Termux).

## Stack

- React 19 + TypeScript + Vite
- React Router
- Tailwind CSS v4
- react-markdown (+ remark-gfm, rehype-slug) for MDX-style post rendering
- A hand-trimmed syntax highlighter (lowlight + 5 registered languages) instead of the full highlight.js bundle, to keep the client bundle small enough for a phone to serve
- lucide-react for icons

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

The production build in `dist/` is a fully static site — copy it straight to wherever Nginx serves files from on Nexus.

## Adding a new post

Drop a new Markdown file into `src/content/posts/`, e.g. `src/content/posts/my-post.md`:

```markdown
---
title: "My Post Title"
description: "One sentence description."
date: "2026-08-08"
category: "engineering"
tags:
  - example
featured: false
---

Post content goes here, in Markdown. Supports `##`/`###` headings (auto TOC),
fenced code blocks (` ```bash `), blockquotes, and callouts:

**TIP:** this is a tip callout.
**NOTE:** this is a note callout.
**WARNING:** this is a warning callout.
**FUN FACT:** this is a fun fact callout.
```

That's it — the post automatically appears on `/blog`, in its category and tag pages, and gets routed at `/blog/my-post`. Nothing else needs to change.

## Project structure

```text
src/
├── content/posts/       # Markdown blog posts (source of truth)
├── components/          # Reusable UI (Navbar, BlogCard, CodeBlock, NexusStatus, ...)
├── pages/                # Route-level pages (Home, Blog, Article, CategoryPage, TagPage, NotFound)
├── lib/                  # Post loading, frontmatter parsing, TOC extraction, minimal syntax highlighter
├── hooks/                # useTheme, useReadingProgress, useActiveHeading
└── types/                # BlogPost / TocItem types
```

## Notes

- Dark mode is the default and primary visual direction; theme preference persists to `localStorage`.
- The `NexusStatus` component polls `GET /api/health` on Nexus every 30s (5s timeout) to drive the ONLINE/OFFLINE indicator; HARDWARE/STACK/UPTIME stay static/computed client-side.
- No backend or database required for this version; it builds to a static `dist/` directory.
