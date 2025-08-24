# GitHub Copilot Instructions

## Version Check Guidelines

Always check package versions in package.json before providing answers to ensure compatibility with the current project setup.

## Instructions

1. Before suggesting any code:

   - Ensure suggestions work with Nuxt 4.x API
   - Framework-specific best practices (like Nuxt's auto-imports) should take precedence over generic Vue solutions
   - Check compatibility with Vue 3.5+ features
   - Use TypeScript 5.9+ features appropriately

2. When suggesting UI components:

   - Default to @nuxt/ui v3.3+ components
   - Check component API compatibility with installed version

3. For routing solutions:

   - Use Vue Router 4.5+ syntax
   - Follow Nuxt 4.x routing conventions

4. General practices:

   - Use TypeScript's strict mode features
   - Follow ESLint 9.x rules
   - Consider the Vue 3 Composition API as default
   - Use Nuxt UI components when available

## Note

Keep these versions in mind and update this file when package.json changes.
