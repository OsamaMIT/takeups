# Takeups

Takeups is a private-room multiplayer party game where players defend assigned ridiculous stands in 200 characters or less. The PartyKit room server is authoritative: clients only send intents, and the server owns matchmaking, assignments, voting order, eligibility, timers, and scoring.

## Stack

- Next.js App Router, React, TypeScript
- PartyKit room server and PartySocket client
- Tailwind CSS, Framer Motion, lucide-react
- Zod validation, nanoid IDs
- Vitest unit tests and Playwright end-to-end gameplay tests

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. By default the frontend uses the deployed PartyKit host `takeups.osamamit.partykit.dev` through `NEXT_PUBLIC_PARTYKIT_HOST`. To test against a local PartyKit server instead, set `NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999`.

Useful commands:

```bash
npm run dev:web
npm run dev:party
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

## Deployment Notes

Deploy the PartyKit server with:

```bash
npm run deploy:party
```

Set `NEXT_PUBLIC_PARTYKIT_HOST` on the frontend deployment to `takeups.osamamit.partykit.dev`. The frontend is exported as static files to `out`, with Netlify rewriting `/room/*` to the static room shell.

No database is required. Room state is persisted in PartyKit room storage under `room-state-v1`.

## Architecture

- `server/party.ts`: authoritative room server. It validates messages, persists state, recovers timers, transfers host, and sends per-client public/private snapshots.
- `src/types/game.ts`: canonical TypeScript models and message contracts.
- `src/lib/game.ts`: hidden-cycle round generation, assignment derivation, state projection, phase transitions.
- `src/lib/scoring.ts`: vote-ratio scoring and round stats.
- `src/lib/topics.ts`: built-in topic library across the requested packs.
- `src/components/game`: phase components and multiplayer room UI.
- `src/app`: landing, room, about, privacy, and terms routes.

## Game State Flow

1. First joined player becomes host.
2. Host configures lobby settings and starts a round.
3. Server shuffles active players into a hidden cycle and creates one matchup per edge.
4. Each player receives exactly two private assignments.
5. Players draft defenses, lock ready, or the server promotes drafts when the writing timer expires.
6. Server shows voting cards one at a time in randomized order.
7. Eligible voters can vote once; authors can view but cannot vote.
8. Server reveals names, calculates points from vote ratio, and advances through results.
9. Round results show round and total leaderboards. Final round advances to game over.

## Generated Asset

The cinematic chamber image used by the landing page is saved at `public/takeups-judgment-chamber.png`. It was generated for this project and is referenced locally by the UI.
