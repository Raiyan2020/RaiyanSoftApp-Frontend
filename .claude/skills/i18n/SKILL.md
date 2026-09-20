---
name: i18n
description: Use when adding, changing, or reviewing any user-facing text, or when working on RTL/LTR layout, language switching, or server-rendered language in this app (Arabic + English). Triggers on new copy, labels, toasts, error messages, placeholders, empty states, and on `start-*`/`end-*` spacing questions.
---

# i18n (Arabic + English)

This app is bilingual: `ar` (default, RTL) and `en` (LTR). Never ship a hardcoded
user-facing string.

## Where things live

| File | Purpose |
|---|---|
| `lib/language.ts` | `AppLanguage`, `DEFAULT_LANGUAGE` (`'ar'`), `getDirection`, `normalizeLanguage`, `persistLanguage`, `readStoredLanguage`. Cookie + localStorage key: `rs_lang`. |
| `lib/language.server.ts` | `getServerLanguage()` — reads the cookie in server components. |
| `lib/translations.ts` | `translations.en` / `translations.ar` key maps (used by `t`). |
| `lib/i18n-utils.ts` | `translateMessage(message, language?)` — English-string → Arabic map, resolves language from storage when omitted. |
| `lib/i18nContext.tsx` | `I18nProvider`, `useTranslation()` → `{ language, setLanguage, t, dir }`. |

## Rules

1. **Client components** — `const { t, language, dir } = useTranslation()`. `t(key)`
   falls back to `translateMessage(key, language)`, so an English sentence works as
   a key even without a `translations` entry.
2. **Outside React** (services, stores, toasts, api client) — `translateMessage('English text')`.
   Add the Arabic string to the `messageTranslations` map in `lib/i18n-utils.ts`.
3. **Server components** — `const language = await getServerLanguage()`; pass it down.
   Do not read `localStorage` or call `useTranslation` there.
4. **Adding copy**: put the English text in the code, then add the Arabic
   translation — to `lib/translations.ts` (both `en` and `ar`) when it is a keyed
   UI string, or to `messageTranslations` in `lib/i18n-utils.ts` when it is a
   message/toast string. Never add to only one of the two languages.
5. **Layout is logical, not physical.** Use `start-*`, `end-*`, `ps-*`, `pe-*`,
   `ms-*`, `me-*`, `text-start`, `text-end`. Never `left-*`, `right-*`, `pl-*`,
   `pr-*`, `ml-*`, `mr-*`, `text-left`, `text-right` for direction-dependent layout.
   Directional icons (chevrons, arrows) must flip with `rtl:rotate-180` or a
   `dir`-aware branch.
6. **Never persist language yourself** — `setLanguage` from `useTranslation()`
   handles localStorage, the cookie, `router.refresh()`, and React Query
   invalidation. Writing `rs_lang` directly desyncs the server render.
7. **Bilingual form fields** (ar + en inputs for the same entity): the validation
   error renders under the exact input that failed — see the Forms section of
   `AGENTS.md`.

## Checklist before finishing

- [ ] No literal user-facing string left untranslated (`grep` your diff for quoted text in JSX).
- [ ] Both `en` and `ar` entries added.
- [ ] No `pl-`/`pr-`/`ml-`/`mr-`/`left-`/`right-`/`text-left`/`text-right` in new JSX.
- [ ] Rendered correct in both languages; `npm run lint` passes.
