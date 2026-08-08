---
title: "ESP32 Experiments"
description: "Small microcontrollers, questionable ideas, and surprisingly useful results."
date: "2026-05-03"
category: "experiments"
tags:
  - esp32
  - iot
  - hardware
readTime: "5 min read"
---

An ESP32 costs less than lunch and has more compute than the guidance computer that landed on the moon. Naturally, I bought four of them before having a single concrete plan.

## What they became

Two turned into temperature sensors that report back to Nexus. One became a doorbell notifier after the original doorbell developed a mind of its own. The fourth is, as of writing, still in its anti-static bag, waiting for an idea worthy of it.

```text
ESP32 ── Wi-Fi ── MQTT ── Nexus ── Telegram ── Me
```

## The good parts

- **Cheap enough to break.** Bricking a $4 board is a Tuesday, not a tragedy.
- **Deep sleep is genuinely impressive.** A sensor node can run for months on a small battery if you're disciplined about wake cycles.
- **The ecosystem is enormous.** Whatever sensor you're holding, someone has already written a library for it.

## The annoying parts

**NOTE:** flashing over USB occasionally requires holding the boot button at exactly the wrong moment, like a tiny hardware ritual. This never stops being slightly funny.

Debugging is also mostly `Serial.println` and vibes. There is no shame in this. There is only `Serial.println`.

## Next up

I'm looking at adding a small e-ink display to one of the sensor nodes, mostly so it can display something more dignified than a raw MQTT topic when I walk past it.
