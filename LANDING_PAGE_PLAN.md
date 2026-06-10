# Landing Page API Integration Plan

## Overview

The backend has added a full set of landing-page API endpoints.
This plan tracks the work to wire them into both the admin dashboard and the public frontend.

---

## New Backend Endpoints

### Public (no auth, language from `Accept-Language` header)
| Method | URL | Purpose |
|--------|-----|---------|
| GET | `user/landing-page/heroes` | Hero banner data |
| GET | `user/landing-page/services` | Services section (header + items) |
| GET | `user/landing-page/capabilities` | Capabilities/Works section (header + items) |
| GET | `user/landing-page/offers` | Offers/Packages section (header + items) |
| GET | `user/landing-page/testimonials` | Testimonials section (header + items) |

### Admin (Bearer token required)
| Method | URL | Purpose |
|--------|-----|---------|
| GET/POST | `admin/landing-page/heroes` + `heroes/update` | Read & update hero |
| GET/POST/DELETE | `admin/landing-page/services`, `services/header`, `services/{id}` | Full CRUD + header |
| GET/POST/DELETE | `admin/landing-page/capabilities`, `capabilities/header`, `capabilities/{id}` | Full CRUD + header |
| GET/POST/DELETE | `admin/landing-page/offers`, `offers/header`, `offers/{id}` | Full CRUD + header |
| GET/POST/DELETE | `admin/landing-page/testimonials`, `testimonials/header`, `testimonials/{id}` | Full CRUD + header |

---

## Section → Frontend Component Mapping

| Backend section | Landing component | Admin tab |
|-----------------|-------------------|-----------|
| heroes | `HeroBanner.tsx` | Hero |
| services | `Services.tsx` | Services |
| capabilities | `Works.tsx` | Works / Capabilities |
| offers | `Packages.tsx` | Packages / Offers |
| testimonials | `Partners.tsx` | Testimonials |

---

## Phases

### Phase 1 — Types + API Service Layer ✅ DONE
- [x] `features/landing-page/types/landing-page.types.ts`
- [x] `features/landing-page/api/public-landing-api.ts`
- [x] `features/landing-page/api/admin-landing-api.ts`
- [x] `features/landing-page/hooks/use-landing-page-data.ts`
- [x] `features/landing-page/index.ts`

**Check:** `npx tsc --noEmit` → exit 0 ✅

---

### Phase 2 — Frontend Integration ✅ DONE
- [x] `HeroBanner.tsx` — badge, headline, description, buttons, proof tags, video URL from API
- [x] `Services.tsx` — header (badge/title/description) + service cards from API
- [x] `Works.tsx` — header + capability cards from API (with image + tags)
- [x] `Packages.tsx` — header + offer cards from API (`most_requested` → highlighted)
- [x] `Partners.tsx` — header + testimonial cards from API (title=name, caption=company, description=quote)
- [x] All components fall back to static `landing-content.ts` when API returns empty

**Check:** `npx tsc --noEmit` → exit 0 ✅

---

### Phase 3 — Admin Dashboard ✅ DONE
- [x] `lib/feature-flags.ts` — `landingPageManagement: true`
- [x] `components/layout/admin-layout.tsx` — "Landing Page" nav item (Layout icon)
- [x] `lib/translations.ts` — `admin.nav.landing_page` in EN + AR
- [x] `features/admin-landing-page/hooks/use-admin-landing-page.ts` — all CRUD hooks
- [x] `features/admin-landing-page/components/bilingual-field-inputs.tsx`
- [x] `features/admin-landing-page/components/section-header-form.tsx`
- [x] `features/admin-landing-page/components/admin-hero-tab.tsx`
- [x] `features/admin-landing-page/components/admin-services-tab.tsx`
- [x] `features/admin-landing-page/components/admin-capabilities-tab.tsx`
- [x] `features/admin-landing-page/components/admin-offers-tab.tsx`
- [x] `features/admin-landing-page/components/admin-testimonials-tab.tsx`
- [x] `features/admin-landing-page/components/admin-landing-page.tsx` — tabbed container
- [x] `app/admin/(protected)/landing-page/page.tsx`

**Check:** `npx tsc --noEmit` → exit 0 ✅

---

## Notes
- All `title`, `caption`, `description` fields are bilingual: send `field[ar]` and `field[en]`
- Images are uploaded as `multipart/form-data`
- Tags are nested arrays: `tags[n][name][ar]`, `tags[n][name][en]`, `tags[n][url]`
- Public API returns **already-translated** strings based on `Accept-Language` header
- Fallback to static `landing-content.ts` data if API returns empty/error
