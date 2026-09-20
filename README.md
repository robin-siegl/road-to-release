# Road to Release

Road to Release is a small browser game about trying to ship software on time.

Play as Alex and jump over the things that tend to get in the way of a release: bugs, changing requirements, long Teams discussions, and last-minute requests from the Big Cheese. The pace increases as the run continues.

[Play Road to Release](https://road-to-release.vercel.app)

![Road to Release](public/og.png)

## Controls

| Action | Desktop | Mobile |
| --- | --- | --- |
| Jump | `Space` or `Arrow Up` | Tap the game area |
| Pause | `P` or the Pause button | Pause button |

## Development

The project requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Vite will print the local development URL in the terminal.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Project structure

```text
src/
  assets/       Sprites used by the player and obstacles
  components/   Small reusable DOM components
  scripts/      Game loop, entities, asset loading, and UI
  styles/       Global, dialog, and button styles
```

The game is written in TypeScript and rendered with the Canvas 2D API. Movement is based on elapsed time rather than frame count, so gameplay remains consistent across different refresh rates.
