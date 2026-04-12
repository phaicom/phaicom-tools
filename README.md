# Phaicom Tools

Phaicom Tools is a small collection of polished developer utilities built with React Router, React 19, TypeScript, and Tailwind CSS.

Right now the app includes:

- `Gradient to Tailwind`: converts CSS gradients into Tailwind utility classes
- `Image to WebP`: batch converts images to WebP with `sharp`
- `HTML Editor`: a split-screen TipTap editor with live preview and HTML output

## Tech Stack

- React Router v7 with SSR enabled
- React 19 + TypeScript
- Tailwind CSS v4
- React Aria components
- Bun for package management and script execution

## Getting Started

### Prerequisites

- Bun `1.3.12` or later

### Install

```bash
bun install
```

### Run in development

```bash
bun run dev
```

The app runs at `http://localhost:5173`.

## Available Scripts

```bash
bun run dev
bun run build
bun run start
bun run typecheck
bun run lint
bun run lint:fix
bun run fmt
bun run fmt:check
```

## Project Structure

```text
app/
  features/      Feature-specific UI, hooks, utils, and services
  routes/        React Router route modules
  shared/        Reusable UI components and shared helpers
  layouts/       App layouts
public/          Static assets
```

## Routing Notes

- `/` is the landing page
- `/docs` is the documentation hub
- `/docs/gradient-to-tailwind` shows the gradient converter
- `/docs/image-to-webp` shows the image conversion tool
- `/docs/editor` shows the HTML editor

SSR is enabled, and the React Router config prerenders the home page plus docs routes.

## Linting and Formatting

This project uses:

- `oxlint` for linting
- `oxfmt` for formatting
- `simple-git-hooks` + `lint-staged` for pre-commit checks

## Build

Create a production build with:

```bash
bun run build
```

Then serve it locally with:

```bash
bun run start
```
