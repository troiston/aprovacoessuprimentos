---
id: skill-build-rss-feed
title: "RSS / Atom feed"
agent: 04-seo-specialist
version: 1.0
category: seo
priority: standard
requires:
  - skill: skill-write-sitemap
  - rule: quality/seo
provides:
  - route.xml ou feed.ts para agregadores
used_by:
  - agent: 04-seo-specialist
  - command: init-seo
---

# RSS

## Implementação

- Rota `app/feed.xml/route.ts` ou equivalente; cache adequado.
- Campos: title, link, pubDate, guid; encoding UTF-8.

## Descoberta

- `<link rel="alternate" type="application/rss+xml">` no layout quando aplicável.
