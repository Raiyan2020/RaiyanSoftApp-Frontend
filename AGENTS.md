# AGENTS.md

## Project

RaiyanSoft frontend is a Next.js app using React, TypeScript, Tailwind, React Query, React Hook Form, Zod, Sonner, Lucide, and feature-oriented folders at the repository root.

## Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Typecheck/lint gate: `npm run lint`
- Production build: `npm run build`

Run `npm run lint` after code changes that touch TypeScript, forms, data contracts, or shared UI.

## Architecture

- App routes live in `app/`.
- Feature code lives in `features/[feature-name]/`.
- Shared UI primitives live in `components/ui/`.
- Shared public-site components live in `components/public/`.
- Shared libraries live in `lib/`.
- Feature folders should keep UI in `components/`, logic in `hooks/`, API/data calls in `services/`, and exported public APIs in `index.ts` when cross-feature imports are needed.
- Prefer existing local patterns over new abstractions. Add abstractions only when they reduce real duplication or match a pattern already in the repo.

## TypeScript And React

- Use TypeScript for new source files.
- Prefer regular function declarations for React components and exported service functions.
- Keep client components scoped: add `'use client'` only when browser APIs, stateful hooks, event handlers, or client-only libraries are needed.
- Do not revert unrelated user changes in the worktree.

## Data And API

- Keep API calls in feature `services/` files or existing shared API helpers.
- Use React Query hooks for server state when a feature already follows that pattern.
- Use stable query-key factories or existing local key helpers; avoid ad hoc query-key strings.
- Before adding or changing service response types, inspect the existing service and real/fallback response shape.

## Forms

- Field validation errors must render under the exact field that failed.
- React Hook Form forms should use `Field`, `FieldLabel`, and `FieldError` from `@/components/ui/field`.
- Manual forms should keep a field-level error map and pass errors to the matching input component.
- Bilingual field errors must appear under the specific Arabic or English input.
- Repeater/list field errors must appear under the exact row field that failed.
- Backend, network, permission, save failures, and save successes must show via toast (`ErrorAlert`, `SuccessToast`, or the global toast API).
- Action feedback must use the single global action toast slot. Do not render a local toast in addition to the shared API client toast for the same request; opt out of one path with `skipGlobalToast` or `skipSuccessToast` when a custom message is needed.
- Keep only one app-level `Toaster`; do not add feature-level `Toaster` instances or per-feature toast containers.
- Do not use browser `alert()`, inline alert banners, or form-level success/error boxes for action feedback. Toasts ALWAYS for action feedback.
- Inline messages are only for field validation under the exact input, loading status, persistent empty/error page states, or real completion screens.
- Any button that triggers a backend request must visibly enter a pending state by disabling itself and showing a spinner or loading label.
- Successful non-GET API mutations should toast by default through the shared API client or the mutation hook. If a mutation is intentionally silent, it must opt out explicitly.
- Shared confirm/delete dialogs must disable confirm and show a loading label/spinner while the destructive request is running.
- Shared destructive dialogs should also self-handle async confirms so loading/disabled state appears even if the caller does not pass a pending flag.
- Shared form shells such as `AdminFormModal` should toast backend errors and leave field errors to their children.

## Image Uploads

- Dashboard/admin image uploads must use `ImageUpload` from `@/components/ui/image-upload`.
- Do not add raw `<input type="file" accept="image/*">` controls for dashboard image uploads.
- `ImageUpload` handles preview, replace/remove, crop repositioning, WebP conversion, and resize optimization.
- If the API/store expects a `File`, pass `nextImage?.file`.
- If a legacy field expects a URL/data URL string, convert `nextImage.file` after `ImageUpload` returns the optimized WebP file.
- Generic document uploaders are separate and may keep normal file inputs.

## Internationalization

- This app supports Arabic and English. Do not introduce user-facing text without checking the existing translation helpers.
- Use `translateMessage` or the current feature translation hook according to local code.
- Prefer logical CSS utilities for RTL/LTR layout, such as `start-*`, `end-*`, `ps-*`, and `pe-*`.

## UI

- Use existing UI primitives from `components/ui` before adding new shared components.
- Use Lucide icons for interface icons.
- Keep admin/dashboard UI dense, scannable, and consistent with existing surfaces.
- For public pages, preserve SEO metadata, canonical URLs, OpenGraph metadata, and JSON-LD patterns already in `lib/site.ts` and `components/public`.

## Skills And Rules

- Keep persistent project instructions concise and specific. Avoid broad motivational rules.
- Put always-on project guidance in this file.
- Put tool-specific local rules in `.cursor/` only when they are useful for that tool.
- Create a skill only for a repeated workflow with a clear trigger, explicit inputs/outputs, and focused steps. Prefer instructions over scripts unless deterministic tooling is required.

## Compatibility Entrypoints

This repository keeps `AGENTS.md` as the canonical rulebook. Tool-specific files should stay as small bootstraps that point back here:

- `GEMINI.md` for Gemini CLI and Google Antigravity-style agents.
- `CLAUDE.md` for Claude Code and Claude-compatible tools.
- `.github/copilot-instructions.md` for GitHub Copilot and VS Code Copilot.
- `.windsurfrules` for Windsurf/Cascade.
- `.clinerules` for Cline-compatible agents.
- `.agent/rules/project.md` and `.agents/rules/project.md` for Antigravity/workspace-rule compatibility.

Do not duplicate the full rules into those files. Update this file first, then keep the compatibility files pointing here.
