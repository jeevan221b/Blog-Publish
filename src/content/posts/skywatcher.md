---
title: "Building SkyWatcher"
description: "Building an astronomy notification system that tells me what is actually worth looking at tonight."
date: "2026-07-22"
category: "projects"
tags:
  - python
  - astronomy
  - telegram
  - automation
readTime: "6 min read"
---

Every clear night, my city sky offers roughly three visible objects: the moon, a plane, and something I convince myself is Jupiter. It's usually a plane.

I wanted something that would tell me, without me having to check four different apps, whether tonight was actually worth setting up the telescope for.

So I built **SkyWatcher**.

## The problem with existing apps

Most astronomy apps are built for people who already know what they're looking for. They assume you want a sky chart, a magnitude table, and a dozen settings you'll never touch.

I wanted the opposite: a single Telegram message at dusk that says, in plain language, whether tonight is good, and why.

> Good visibility tonight. Clear skies until 2 AM, new moon, Saturn rises at 9:47 PM. Worth it.

That's the whole product.

## Architecture

```text
Weather API ──┐
              ├──▶ Scoring engine ──▶ Telegram bot ──▶ Me, squinting at the sky
Ephemeris  ───┘
```

The scoring engine pulls cloud cover, humidity, and moon phase from a weather API, cross-references visible planets and events from an ephemeris library, and produces a single score plus a one-line explanation.

## Why Telegram

I already had a Telegram bot running for something else on Nexus, so extending it made more sense than building a separate app nobody would open. **NOTE:** if you already run one bot, you'll find yourself running five. This is not a bug.

## What's next?

I'd like SkyWatcher to eventually factor in light pollution data for wherever I happen to be, not just home. For now, it's happily nagging me from the same phone-server that hosts this blog.
