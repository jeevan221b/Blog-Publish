---
title: "I Turned My Old Samsung M31 Into a Server"
description: "Because apparently throwing away perfectly good hardware is optional."
date: "2026-08-08"
category: "self-hosting"
tags:
  - android
  - termux
  - nginx
  - self-hosting
  - homelab
readTime: "8 min read"
featured: true
---

If you're reading this blog right now, there's a decent chance you're wondering: **"Where is this thing actually running?"**

Well... it's running on an old **Samsung M31 sitting somewhere in my house.**

Yes. The phone you're currently reading from is doing its best impression of a server. And if you're reading this from the internet rather than my home Wi-Fi, then congratulations — you've just accessed a website being served by a phone that was originally designed to run Instagram, WhatsApp, and complain about low storage.

Welcome to **Nexus**.

## Why a phone?

The original idea was simple. I wanted a small home server. Nothing crazy. Just something that could:

- Host my portfolio
- Host this blog
- Run a few small personal services
- Experiment with self-hosting
- Be available 24/7
- Consume very little electricity
- Teach me how servers actually work

Naturally, I started looking at actual server hardware. And then I looked at the prices. That was the end of that.

A proper mini PC, Raspberry Pi, or small home-server setup isn't necessarily expensive compared to enterprise hardware, but once you start adding storage, power supplies, cases, networking equipment and everything else, the "small little project" starts developing a personality disorder.

Meanwhile, sitting in a drawer was this: a **Samsung Galaxy M31**, a phone I wasn't using anymore. It already had an ARM processor, several GB of RAM, Wi-Fi, storage, a battery, a charger, and a Linux-compatible environment.

> The cheapest server is sometimes the one already sitting in your drawer.

And most importantly: **it was already paid for.** So I decided to see how far I could push it.

## Meet Nexus

I named the server **Nexus**, because calling it `samsung-m31-final-final-2` didn't feel particularly professional.

Nexus is essentially my tiny home server built from an old Android phone. The important part here is that Android isn't really acting as the server environment itself. Instead, I'm using **Termux** to provide a Linux-like userspace where I can run familiar command-line tools and services.

```text
Phone hardware
      ↓
Android
      ↓
Termux
      ↓
Linux userspace
      ↓
Nginx
      ↓
Website
```

Which is a surprisingly capable stack for something that was supposed to spend the rest of its life in a drawer.

## Why Nginx?

For this particular project, I don't need a huge application server. The portfolio and blog are primarily static content, which makes **Nginx** a great fit. Its job is basically: "someone requested this page? Here you go."

No complicated database queries. No massive backend. No machine-learning model trying to determine whether the visitor is a human. Just:

```bash
# a request comes in, nginx hands back a file
curl -I https://nexus.local/blog
```

**TIP:** If you're serving mostly static assets, resist the urge to reach for a full application server. Nginx (or even a much smaller static file server) is plenty, and it barely taxes the CPU.

It also means Nexus doesn't have to work particularly hard to serve the site. Which is good — I don't want my phone becoming emotionally attached to the CPU.

## Architecture

A server doesn't have to look like a rack of blinking lights. It can also look like a phone taped to a power bank. If the machine can run software, connect to a network, listen for requests, and respond to those requests, congratulations — you have something that can function as a server.

The word **server** describes what a machine is doing, not what shape the machine is.

**NOTE:** Termux gives you a real package manager (`pkg`), SSH access, and enough of a POSIX environment that most lightweight Linux tooling just works. It's not a full distro, but it's close enough for this.

**WARNING:** Android's battery and thermal management really don't expect the phone to run a web server 24/7. Keep an eye on temperature, and don't expect enterprise-grade uptime from day one.

## What's next?

The portfolio was just the beginning. Some things I'm planning to experiment with:

- **Public hosting** — making the portfolio and blog accessible from anywhere on the internet
- **HTTPS** — because browsers have trust issues when you hand them plain HTTP
- **Remote access** — being able to manage Nexus when I'm away from home
- **Monitoring** — because a server that silently dies while you assume everything is fine is not particularly useful
- **Automated deployments** — push to the repo, Nexus builds and deploys automatically
- **More self-hosted services** — because apparently one service is never enough

**FUN FACT:** The M31's screen still works perfectly. It's currently displaying a `htop` session nobody will ever look at, which feels like a fitting retirement.

## Final thoughts

There are probably much better ways to host a website — cloud providers, VPSs, serverless platforms, managed hosting. And then there's me, looking at an unused Samsung M31 and thinking: "you know what would be funny?"

And that's how Nexus was born. It's cheap. It's low-power. It's completely overkill for a simple blog in one sense and hilariously underpowered in another. But most importantly, **it's mine.**

And if you're reading this on the public internet: congratulations. Your browser just asked an old Samsung M31 for a blog post. And it delivered.
