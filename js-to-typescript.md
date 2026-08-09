---
title: "From JavaScript to TypeScript"
description: "What happened when I decided a production JavaScript project needed types."
date: "2026-06-10"
category: "engineering"
tags:
  - typescript
  - javascript
  - migration
readTime: "7 min read"
---

There's a specific kind of dread that arrives the moment you type `undefined is not a function` into a search bar for the third time in a week. That was my sign.

## Why bother

The project wasn't huge, but it had grown past the point where I could hold its shape in my head. Refactors were scary. Every function argument was a small act of faith.

**TIP:** you don't need to convert a whole project overnight. TypeScript's `allowJs` and `checkJs` flags let you type-check plain JavaScript files without renaming anything yet.

## The migration, roughly

```bash
npm install -D typescript
npx tsc --init
```

From there, the process looked like:

1. Turn on `checkJs` and read the flood of errors
2. Fix the loud, obvious ones first — wrong argument counts, typos
3. Rename files to `.ts` one module at a time, starting from the leaves of the dependency tree
4. Add real interfaces once the shape of the data stopped changing weekly

## What actually got better

Autocomplete stopped lying to me. Refactors that used to require a search-and-a-prayer became a rename operation the editor could verify. And a whole category of "wait, is this a string or a number" bugs simply stopped happening.

**WARNING:** strict mode is worth turning on early. Turning it on after the fact on a large codebase is its own weekend project.

## Was it worth it?

Yes, with one caveat: TypeScript won't save you from bad architecture, only from a certain kind of careless mistake. It's a seatbelt, not a driving instructor.
