# Nuxt Chat

Modern full-stack chat app with AI integration and project organization.

## Features

- **AI Integration** - OpenAI GPT models & Ollama support
- **Project Organization** - Multi-project workspace with chat sessions
- **Smart Chat** - Auto-resize input, scroll controls, markdown rendering
- **Modern UI** - @nuxt/ui v3, dark mode support
- **Full-Stack** - Nuxt 4 + Nitro server with API routes

## Tech Stack

- **Nuxt 4** - Vue 3.5 + TypeScript 5.9
- **@nuxt/ui v3** - Tailwind CSS components
- **AI SDK** - OpenAI/Ollama integration
- **@nuxtjs/mdc** - Markdown rendering with syntax highlighting
- **@vueuse/core** - Vue composables

## Quick Start

```bash
npm install
npm run dev  # http://localhost:3000
```

**Environment**

```bash
NUXT_OPENAI_API_KEY=your_key  # For OpenAI
# Or use Ollama locally: ollama pull llama3.2
```

## Architecture

```
app/
├── components/     # UI components (ChatWindow, ChatInput, AppSidebar)
├── composables/    # State management (useChat, useProjects, useScrollToBottom)
├── pages/          # File-based routing (/chats/[id], /projects/[id])
└── types/          # TypeScript definitions

server/
├── api/ai.ts       # AI chat endpoint
└── services/       # AI model integration (OpenAI/Ollama)
```

## Deployment

**Netlify** (recommended):

```bash
# Build command
npm run build

# Environment variables
NUXT_OPENAI_API_KEY=your_key
```

---

MIT License
