# Rules Fix Plan

This file tracks the rule-compliance cleanup from the app/rules audit.

## Verified Health Checks

- [x] Root TypeScript check passes with `npx tsc --noEmit`.
- [x] Root production build passes with `npm run build`.
- [x] Firebase Functions TypeScript build passes after installing `functions` dependencies.

## Fixed In This Pass

- [x] Document the cleanup plan in this file.
- [x] Align i18n rules with the app's current EN/AR translation system.
- [x] Restore a working root `npm run lint` command by routing it to TypeScript validation.
- [x] Move React Query key factories into feature-level `query-keys.ts` files for active React Query features.

## Remaining Rule Debt

- [ ] Replace `any` usages with `unknown`, Firebase SDK types, or feature-specific API response types.
- [ ] Reduce broad `'use client'` usage by keeping pages and static UI as Server Components where possible.
- [ ] Migrate legacy PascalCase filenames under `components/landing` and `screens` to kebab-case.
- [ ] Replace physical RTL-sensitive Tailwind classes (`left-*`, `right-*`, `pl-*`, `pr-*`, `text-left`, `text-right`) with logical or direction-aware alternatives.
- [ ] Move API modules from `features/*/api` to `features/*/services` if the team wants to enforce the rule literally.
- [ ] Decide whether generated Firebase Functions artifacts should be committed. If yes, commit `functions/package-lock.json`; if no, add `functions/lib/` to ignore rules.
- [ ] Address dependency audit findings with explicit upgrade testing:
  - Root: `next`/bundled PostCSS moderate advisory.
  - Functions: `nodemailer` high advisory and `firebase-admin`/`firebase-functions` transitive advisories.

## Guardrails For New Work

- New features should live under `features/[feature-name]`.
- Query keys should live in `features/[feature-name]/query-keys.ts`.
- User-facing text should use the existing translation system in `lib/translations.ts`.
- API calls should stay out of components and hooks except through feature data modules.
- Use regular function declarations for exported components and service functions.
