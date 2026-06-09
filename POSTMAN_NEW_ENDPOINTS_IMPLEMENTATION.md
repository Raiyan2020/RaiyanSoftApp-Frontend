# New Postman Endpoint Implementation

Source collection: `Raiyan.postman_collection.json`

Compared against the previous collection `Raiyan.postman_collection (2).json`, the new API surface adds 15 endpoint entries. The implementation follows the app pattern of API services first, hooks second, then UI consuming hooks.

## Phase 1 - Admin Project Operations

Status: Implemented for API-backed project detail pages.

Used on:

```txt
/admin/user-projects/api/:id
```

Service file:

```txt
features/admin-user-projects/api/admin-projects-api.ts
```

Hook/UI file:

```txt
features/admin-user-projects/hooks/use-admin-project-operations.ts
features/admin-user-projects/components/admin-user-project-detail-page.tsx
```

| Method | Endpoint | Service | Hook action | UI area |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/stage-progress` | `fetchAdminStageProgress` | `loadProject` | Progress history |
| `POST` | `/admin/stage-progress` | `createAdminStageProgress` | `saveProgressUpdate` | Progress tab |
| `GET` | `/admin/reports` | `fetchAdminReports` | `loadProject` | Reports tab |
| `POST` | `/admin/reports/generate` | `generateAdminReport` | `generateWeeklyDraft` | Reports tab |
| `POST` | `/admin/reports` | `createAdminReport` | `saveWeeklyReport`, `saveFinalReport` | Reports / Final Report tabs |
| `GET` | `/admin/reports/:id` | `fetchAdminReport` | Available service | Future report detail drawer |
| `DELETE` | `/admin/reports/:id` | `deleteAdminReport` | `deleteWeeklyReport` | Reports tab |
| `GET` | `/admin/stage-attachments` | `fetchAdminStageAttachments` | `loadProject` | Files & Notes tab |
| `POST` | `/admin/stage-attachments` | `createAdminStageAttachment` | `saveAttachment` | Files & Notes tab |
| `GET` | `/admin/stage-attachments/:id` | `fetchAdminStageAttachment` | Available service | Future attachment detail/edit drawer |
| `POST` | `/admin/stage-attachments/:id` | `updateAdminStageAttachment` | Available service | Future attachment edit flow |
| `DELETE` | `/admin/stage-attachments/:id` | `deleteAdminStageAttachment` | `deleteAttachment` | Files & Notes tab |

Notes:

- API-backed projects are identified by `ownerId === "api"`.
- Legacy Firebase-backed project routes keep the previous local behavior.
- The collection still does not include endpoints for internal notes or project completion approval, so those remain local-only or show an explicit unsupported message for API projects.

## Phase 2 - Admin Notifications

Status: Implemented.

Service file:

```txt
features/admin-marketing/api/admin-notifications-api.ts
```

Hook/UI file:

```txt
features/admin-marketing/hooks/use-admin-marketing.ts
features/admin-marketing/components/admin-marketing-page.tsx
```

| Method | Endpoint | Service | Hook action | UI area |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/notifications` | `sendAdminNotification` | `handleSubmit` | Admin marketing notification composer |

Payload fields:

```txt
audience
title[ar]
title[en]
description[ar]
description[en]
```

The current composer has one title/message field, so the same content is sent to both Arabic and English payload keys.

## Phase 3 - Admin Profile

Status: Implemented.

Service file:

```txt
features/admin-account/api/admin-profile-api.ts
```

Hook/UI file:

```txt
features/admin-account/hooks/use-admin-account.ts
features/admin-account/components/admin-account-page.tsx
```

| Method | Endpoint | Service | Hook action | UI area |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/profile` | `fetchAdminProfile` | Initial load | Admin account page |
| `POST` | `/admin/profile` | `updateAdminProfile` | `handleSave` | Admin account form |

Payload fields:

```txt
first_name
last_name
email
phone
password
```

The current account form does not expose password editing, so `password` is supported by the service but not sent by the UI.

## Already Covered In Existing Services

All other endpoints in `Raiyan.postman_collection.json` were already covered by existing feature services/hooks, including auth, leads, form questions, meetings, users, employees, colors, stages, projects, user profile, user projects, public settings/colors, notifications, pages, and countries.
