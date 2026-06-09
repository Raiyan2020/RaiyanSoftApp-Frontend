# Admin Project Endpoint Phases

Source collection: `Raiyan.postman_collection (2).json`

The updated collection adds the admin project/stage API surface. The frontend should use API services first, then expose that data through hooks, and finally let UI components consume hooks only.

## Phase 1 - Project List And Stage CRUD

Status: Implemented for backend-loaded projects

Endpoints:

| Method | Endpoint | Frontend Service | Hook | UI |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/projects` | `fetchAdminProjects` | `useAdminUserProjects` | Admin user projects list |
| `GET` | `/admin/projects/:id` | `fetchAdminProject` | `useAdminProjectOperations` | Admin project detail header/summary |
| `GET` | `/admin/stages` | `fetchAdminStages` | `useAdminProjectOperations` | Project plan/progress stage lists |
| `POST` | `/admin/stages` | `createAdminStage` | `useAdminProjectOperations.saveStage` | Add Stage |
| `GET` | `/admin/stages/:id` | `fetchAdminStage` | `useAdminProjectOperations.startEditStage` | Edit Stage |
| `POST` | `/admin/stages/:id` | `updateAdminStage` | `useAdminProjectOperations.saveStage` | Save Stage |
| `DELETE` | `/admin/stages/:id` | `deleteAdminStage` | `useAdminProjectOperations.deleteStage` | Delete Stage |

Payload notes:

`POST /admin/stages`

```txt
project_id
title
description
days
status
admin_ids[0]
admin_ids[1]
```

`POST /admin/stages/:id`

```txt
_method=PUT
project_id
title
description
days
status
admin_ids[0]
```

## Phase 2 - Route Cleanup

Status: Implemented with compatibility

The existing detail route is Firebase-shaped:

```txt
/admin/user-projects/:ownerId/:id
```

The backend only needs a numeric project id. Keep backward compatibility for the old route, but make new list links use:

```txt
/admin/user-projects/api/:id
```

This keeps the current route file working while clearly marking backend-loaded projects. The list hook maps backend projects with `ownerId: api`, so the table links to the API-backed detail flow.

## Phase 3 - Backend Gaps

Status: Waiting on backend endpoints

These UI actions exist on the admin project detail page, but the updated Postman collection does not include matching endpoints yet:

| UI Area | Action |
| --- | --- |
| Progress | Save progress update |
| Files | Upload/delete attachment |
| Files | Add/delete internal note |
| Reports | Generate/save/send weekly report |
| Final | Generate/save/approve final report |

Until backend routes are added, these remain local Firebase operations.

## Phase 4 - Audit Update

Status: Pending

Update `POSTMAN_ENDPOINT_IMPLEMENTATION_AUDIT.md` from 57 endpoints to 66 endpoints and record the exact frontend service/hook/UI path for each project endpoint.
