# WoW Roster

Shareable signup sheets for a World of Warcraft group. The organizer gets one private link. Everyone else gets a signup link. There are no accounts.

Built for World of Warcraft: Forever only. Faction is Alliance or Horde. Ruleset is PvE, PvP, RP, or RP-PvP. Race and class combinations follow the Forever matrix (including Skyborne, which chooses faction at signup). Classic Era, TBC, WotLK, and Retail are not supported.

## Run locally

```bash
npm install
npm run dev
```

The database file is created at `data/roster.db`. Copy `.env.example` to `.env.local` before deploying, and set `ROSTER_IP_SALT` to a long random string. Production refuses to start without it.

## Limits

- Each roster holds at most 1000 characters, and only up to the cap the organizer chose.
- Roster creation is limited per network: 8 per hour and 20 per day.
- Signups are limited to 40 per hour per network.
- Names are 2–12 letters. Notes are 140 characters.
- The organizer secret is stored as a hash. The signup page cannot remove people or change the sheet.
- An optional signup code keeps a leaked link from filling the sheet.

IP addresses are hashed with the salt and kept only long enough to enforce those limits.

## Deploy

Host the Next.js app on Node (Vercel works) and point `DATABASE_URL` at a [Turso](https://turso.tech) libSQL database, which uses the same client as the local file. A local SQLite file will not persist on serverless hosts.
