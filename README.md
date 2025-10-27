# RetroWave Journal

A neon-soaked, 90s-inspired personal journal built with Vite, React, and TypeScript. Capture memories with pixel-perfect flair, search and filter your archive, and preserve everything locally — no backend required.

## ✨ Features

- **Journal Entries** – Create, read, update, and delete entries with support for rich tagging.
- **Instant Search** – Filter by text and tag to find the perfect throwback in seconds.
- **Local Persistence** – Entries are stored in `localStorage` under `journal.entries.v1`.
- **Import & Export** – Backup or migrate your entries via JSON files.
- **90s Pixel Aesthetic** – Custom CSS variables, Press Start 2P font, beveled buttons, neon gradients, and an optional CRT scanline overlay.
- **Responsive Layout** – Optimized for both mobile and desktop screens.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. Toggle the CRT overlay from the header to add extra retro vibes.

## 🧪 Testing & Quality

- `npm run build` – Type checks and produces a production build.
- `npm run lint` – Runs ESLint over the project.
- `npm test` – Executes Vitest unit tests with Testing Library.

## 🗂️ Project Structure

```
src/
├─ App.tsx              # Layout, routing, CRT toggle
├─ main.tsx             # Entry point and router setup
├─ components/          # UI primitives and journal components
├─ routes/              # Home, EntryView, EntryEdit pages
├─ lib/                 # Local storage helpers, search, context
├─ styles/              # Theme variables and pixel-perfect CSS
└─ setupTests.ts        # Testing Library configuration
```

## 📦 Data Format

Entries use the following shape and are persisted as JSON:

```ts
{
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
}
```

The import/export flow shares the same structure and versioning, making it safe to move data between browsers.

## 🛠️ Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) for SPA routing
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for unit tests
- Hand-rolled CSS inspired by pixel UIs of the 90s

Enjoy reliving the glory days of chunky CRTs and neon dreams! 🎶
