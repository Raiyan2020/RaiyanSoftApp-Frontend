# Raiyan API Collection Gap Plan

## Source Collections

- Current baseline: `Raiyan API.postman_collection.json` with 44 requests.
- New collection: `Raiyan.postman_collection (1).json` with 57 requests.
- API base variable: `{{base_url}}`.

## Verification Update

Checked on June 8, 2026:

- All 57 endpoints in `Raiyan.postman_collection (1).json` are used by frontend API clients or existing auth hooks.
- A stricter symbol usage audit found `57 / 57` unique endpoints used, with `0` unused wrappers.
- The previously wrapper-only endpoints are now connected to UI flows:
  - `GET /admin/colors/:id` loads a color before editing.
  - `GET /admin/form-questions/types` loads backend-supported question types.
  - `GET /admin/form-questions/:id` loads fresh question details before editing.
  - `POST /admin/form-questions/update-active-status` is used by the question active/inactive toggle.
- `npx tsc --noEmit` passes.
- `npm run build` passes.
- `npm run lint` does not run because the repo script uses `next lint`, which this Next.js version interprets as an invalid project directory.
- Browser smoke reached the protected admin flow and verified redirect to `/admin/login` without runtime errors; full authenticated admin page smoke requires a real browser admin session or test credentials.

Dashboard/frontend check:

- Public frontend routes checked locally: `/`, `/services`, `/pricing`, `/portfolio`, `/contact`, `/login`, `/signup`, `/lead`.
- Public frontend routes returned `HTTP 200` with no runtime-error marker.
- Dashboard login checked locally at `/admin/login` and returned `HTTP 200`.
- Protected dashboard routes checked locally: `/admin/colors`, `/admin/project-questions`, `/admin/leads`, `/admin/users`.
- Protected dashboard routes returned expected unauthenticated redirects to `/admin/login`.
- Full authenticated dashboard interaction still requires a real admin session or test credentials.

## Collection Delta

The new collection adds 13 admin endpoints:

| Area | Method | Endpoint | Implementation Status |
| --- | --- | --- | --- |
| Admin form questions | GET | `/admin/form-questions/types` | Implemented |
| Admin form questions | GET | `/admin/form-questions` | Implemented; admin UI now loads backend data |
| Admin form questions | GET | `/admin/form-questions/:id` | Implemented |
| Admin form questions | POST | `/admin/form-questions` | Implemented; admin UI now saves through backend |
| Admin form questions | POST | `/admin/form-questions/:id` | Implemented; admin UI now updates through backend |
| Admin form questions | DELETE | `/admin/form-questions/:id` | Implemented; admin UI now deletes through backend |
| Admin form questions | POST | `/admin/form-questions/update-sort-order` | Implemented; admin UI now reorders through backend |
| Admin form questions | POST | `/admin/form-questions/update-active-status` | Implemented in API client |
| Admin colors | GET | `/admin/colors` | Implemented; was previously reading `/user/colors` |
| Admin colors | POST | `/admin/colors` | Implemented with multipart form data and `is_active` |
| Admin colors | GET | `/admin/colors/:id` | Implemented in API client |
| Admin colors | POST | `/admin/colors/:id` | Implemented in UI and API client |
| Admin colors | DELETE | `/admin/colors/:id` | Implemented in UI and API client |

## Existing Coverage

These endpoints already have API client coverage:

- Admin auth: `POST /admin/auth/login`
- Admin leads: `GET /admin/leads`, `GET /admin/leads/:id`, `POST /admin/leads/:id/status`
- Admin meetings/settings: approve, reject, list, time slots, update settings
- Admin users: list and toggle block
- Admin employees: list, create, show, update, delete, toggle block
- User auth: logout and delete account via API client; login/register are implemented in auth UI flows
- User projects: form questions, store project, my projects, show project
- User meetings: availability, book, list, cancel
- User profile/settings/colors/pages/countries
- Notifications: list, unread, read, read-all, delete one, delete all

## Changed Contracts

### Admin Colors

The collection defines admin colors as their own admin resource:

- List from `/admin/colors`, not `/user/colors`.
- Create with form data: `hex_code`, `is_active`.
- Update with form data: `hex_code`, `is_active`.
- Show and delete are available by id.

### Admin Form Questions

The current admin project questions page is backed by Firestore collection `project_questions`. The new collection defines backend-managed form questions with:

- Translated names: `name[en]`, `name[ar]`.
- Numeric type: `1` for select, `2` for free text.
- Status and order fields: `is_active`, `sort_order`.
- Nested options for select questions: `options[index][value][en]`, `options[index][value][ar]`, `options[index][is_active]`, `options[index][sort_order]`.

## Implementation Phases

### Phase 1: Admin Colors CRUD

Steps:

1. Switch admin color list to `GET /admin/colors`.
2. Send create/update payloads as `FormData`.
3. Add show, update, and delete API client functions.
4. Add active/inactive state to the admin colors UI.
5. Add edit and delete actions with list refresh.
6. Validate with TypeScript/build checks before moving on.

Status: Implemented.

### Phase 2: Admin Form Questions API Client

Steps:

1. Add `features/admin-project-questions/api/admin-form-questions-api.ts`.
2. Add backend DTO types for questions, options, and question types.
3. Add serializers from UI form state to collection form-data keys.
4. Add list, show, create, update, delete, sort-order, and active-status API functions.
5. Add narrow unit-style serializer checks if a test harness exists; otherwise validate with TypeScript/build.

Status: Implemented.

### Phase 3: Migrate Admin Project Questions UI

Steps:

1. Replace Firestore subscription in `use-admin-project-questions.ts` with backend list loading.
2. Map API question records into the existing UI model.
3. Replace create/update/delete/reorder/status operations with backend calls.
4. Preserve current edit and preview UX.
5. Validate the admin page by build and local browser smoke test.

Status: Implemented.

### Phase 4: Auth Contract Audit

Steps:

1. Compare current phone-first auth flow with collection email/password login/register endpoints.
2. Decide whether to keep phone-first auth or restore collection login/register compatibility.
3. Document any backend-confirmed auth differences.
4. Implement only confirmed auth deltas.
5. Validate login/register/delete/logout flows.

Result:

- `POST /user/auth/register` is implemented in `features/auth/hooks/use-signup.ts`.
- `POST /user/auth/login` is implemented in `features/auth/hooks/use-login.ts`.
- `POST /user/auth/logout` and `DELETE /user/auth/delete-account` are implemented in `features/auth/api/user-auth-api.ts`.
- No code change required for the collection auth endpoints.

Status: Complete.

### Phase 5: Full API Regression Pass

Steps:

1. Re-run endpoint comparison against the new Postman collection.
2. Verify every collection request has a matching API client or documented non-frontend reason.
3. Run full build/type validation.
4. Smoke test affected admin and user screens.
5. Update this document with final statuses.

Result:

- Endpoint scan found the new admin colors and admin form-question endpoints in source.
- The remaining scan misses were dynamic template-string endpoints that are already implemented.
- `npx tsc --noEmit` passed after every implementation phase.
- `npm run build` passed after allowing network access for the existing Google Fonts fetch.

Status: Complete.
