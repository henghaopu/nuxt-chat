# Nuxt Minimal Starter

## Setup

## Nuxt Chat

A minimal chat UI built with Nuxt 4, Vue 3.5, TypeScript, and @nuxt/ui. It features an auto-resizing chat input, scroll-to-bottom controls, and a simple local API that echoes your last message as the assistant.

### Tech stack

- Nuxt 4 (Nitro server, auto-imports)
- Vue 3.5 + TypeScript
- @nuxt/ui v3 + Tailwind utilities (via `@nuxt/ui` CSS)

### Features

- Chat window and input components (`app/components/ChatWindow.vue`, `app/components/ChatInput.vue`).
- Auto-resizing textarea; Enter to send; re-focus after send or stream end.
- Scroll-to-bottom button that appears when you’re away from the end; smooth scroll and "pin to bottom" logic (`app/composables/useChatScroll.ts`).
- Centralized template ref IDs via `refIds` constants for clarity and consistency.
- Page title bound to current chat with `useHead`.
- Local API endpoint `POST /api/ai` (Nitro) that returns an assistant message echo (`server/api/ai.ts`).

### Project layout (selected)

- `app/components/ChatWindow.vue` – renders messages, forwards send events, and shows the scroll-to-bottom button.
- `app/components/ChatInput.vue` – auto-resizing input and submit handling.
- `app/composables/useChat.ts` – chat state, sendMessage that posts to `/api/ai`.
- `app/composables/useChatScroll.ts` – near-bottom detection, smooth scrolling, and pinning.
- `app/mocks/chat.mocks.ts` – seed chat/messages for local UI.
- `app/types/chat.types.ts` – Role, ChatMessage, Chat.
- `server/api/ai.ts` – simple echo handler for development.

---

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 and start chatting.

## API (local development)

`POST /api/ai`

- Request body: `{ messages: ChatMessage[] }`
- Response: `ChatMessage` representing the assistant reply (echo of the last message)

In development, this runs inside Nitro (no extra setup). On static hosts like GitHub Pages, server routes do not execute.

## Building

Standard build:

```bash
npm run build
npm run preview
```

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow `.github/workflows/deploy.yml` that:

- Builds with the `github_pages` preset → outputs to `./.output/public`
- Uploads the artifact and deploys via `actions/deploy-pages`

Notes:

- Set the base URL for a project site: `NUXT_APP_BASE_URL=/nuxt-chat/` (already done in the workflow command).
- Pages hosts static files only. `server/api/*` routes won’t run on Pages. For production, point the app to an external API or mock client-side.
- In Repository Settings → Pages, set Source to GitHub Actions.

If you deploy from a branch named `gh-pages`, the included workflow is configured to run on pushes to that branch.

## Configuration

`nuxt.config.ts` (highlights)

- `modules: ['@nuxt/ui', '@nuxt/eslint']`
- `css: ['~/assets/css/main.css']` (imports Tailwind + Nuxt UI)
- Optional: set `app.baseURL` via `process.env.NUXT_APP_BASE_URL` if you want to move the base setting into config.
- For GitHub Pages/SPAs, SSR is typically disabled.

## Development tips

- Vue/Nuxt auto-import common composables; explicit imports are still required for values and types.
- For scroll handling, wait for DOM updates before reading layout: `await nextTick()`.
- When watching arrays, prefer watching `.length` or the last item for efficiency, unless you truly need `{ deep: true }`.

## License

MIT
