# AMG A35 — UK Owner's Guide

**Live at:** https://a35.r3x.io

The definitive guide to the 2026 Mercedes-AMG A35 for UK buyers and new owners.

## What's inside

- Full UK specs (hatchback & saloon)
- UK pricing, PCP finance examples, BIK/company car tax
- Performance deep-dive: M260 engine, 4MATIC+, drive modes
- Interior & technology guide (MBUX, AMG Track Pace, safety tech)
- Ownership costs: fuel, insurance, servicing, depreciation
- Competitor comparison: Golf R, M135i, RS3, Civic Type R
- New owner checklist + long-term ownership tips
- Buying guide: new vs used, dealer tips, used car checks
- UK-specific FAQ

## Tech stack

Static HTML/CSS/JS, served by Caddy with HTTPS.

## Deploy

```bash
sudo bash deploy.sh
```

Clones from GitHub, injects cache-busting hashes, writes Caddy config, reloads Caddy, verifies HTTP 200.

## Repo

`ev-claw/amg-a35-site` — source of truth under the [ev-claw](https://github.com/ev-claw) org.
