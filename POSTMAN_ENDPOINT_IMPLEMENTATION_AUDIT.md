# Postman Endpoint Implementation Audit

Checked: 2026-06-08

Collection: `Raiyan.postman_collection (1).json`

Result: 57 / 57 endpoints implemented.

| # | Folder | Method | Endpoint | Status | Function / Code Path | Usage |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Admin / Auth | POST | `/admin/auth/login` | Implemented | `handleLogin` in `features/admin-login/hooks/use-admin-login.ts` | Admin login form submit |
| 2 | Admin / Leads | GET | `/admin/leads` | Implemented | `fetchAdminLeads` in `features/admin-leads/api/admin-leads-api.ts` | Admin leads list hook/page |
| 3 | Admin / Leads | GET | `/admin/leads/:id` | Implemented | `fetchAdminLead` in `features/admin-leads/api/admin-leads-api.ts` | Lead detail drawer |
| 4 | Admin / Leads | POST | `/admin/leads/:id/status` | Implemented | `changeAdminLeadStatus` in `features/admin-leads/api/admin-leads-api.ts` | Lead status change hook |
| 5 | Admin / Form Questions | GET | `/admin/form-questions/types` | Implemented | `fetchAdminFormQuestionTypes` in `features/admin-project-questions/api/admin-form-questions-api.ts` | Project questions page loads backend question types |
| 6 | Admin / Form Questions | GET | `/admin/form-questions` | Implemented | `fetchAdminFormQuestions` in `features/admin-project-questions/api/admin-form-questions-api.ts` | Project questions page list |
| 7 | Admin / Form Questions | GET | `/admin/form-questions/:id` | Implemented | `fetchAdminFormQuestion` in `features/admin-project-questions/api/admin-form-questions-api.ts` | Project question edit loads fresh detail |
| 8 | Admin / Form Questions | POST | `/admin/form-questions` | Implemented | `createAdminFormQuestion` in `features/admin-project-questions/api/admin-form-questions-api.ts` | Project question create form |
| 9 | Admin / Form Questions | POST | `/admin/form-questions/:id` | Implemented | `updateAdminFormQuestion` in `features/admin-project-questions/api/admin-form-questions-api.ts` | Project question edit form |
| 10 | Admin / Form Questions | DELETE | `/admin/form-questions/:id` | Implemented | `deleteAdminFormQuestion` in `features/admin-project-questions/api/admin-form-questions-api.ts` | Project question delete confirm |
| 11 | Admin / Form Questions | POST | `/admin/form-questions/update-sort-order` | Implemented | `updateAdminFormQuestionSortOrder` in `features/admin-project-questions/api/admin-form-questions-api.ts` | Question order up/down controls |
| 12 | Admin / Form Questions | POST | `/admin/form-questions/update-active-status` | Implemented | `updateAdminFormQuestionActiveStatus` in `features/admin-project-questions/api/admin-form-questions-api.ts` | Question active/inactive row toggle |
| 13 | Admin / Meetings / Bookings | POST | `/admin/meetings/:id/reject` | Implemented | `rejectAdminMeeting` in `features/admin-meetings/api/admin-meetings-api.ts` | Admin meetings reject action |
| 14 | Admin / Meetings / Bookings | POST | `/admin/meetings/:id/approve` | Implemented | `approveAdminMeeting` in `features/admin-meetings/api/admin-meetings-api.ts` | Admin meetings approve action |
| 15 | Admin / Meetings / Bookings | GET | `/admin/meetings` | Implemented | `fetchAdminMeetings` in `features/admin-meetings/api/admin-meetings-api.ts` | Admin meetings list |
| 16 | Admin / Meetings / Availabiltiy | GET | `/admin/settings/time-slots` | Implemented | `fetchAdminTimeSlots` in `features/admin-meetings/api/admin-meetings-api.ts` | Admin availability settings |
| 17 | Admin / Meetings / Availabiltiy | POST | `/admin/settings/time-slots` | Implemented | `saveAdminTimeSlots` in `features/admin-meetings/api/admin-meetings-api.ts` | Admin availability save |
| 18 | Admin / Meetings / settings | POST | `/admin/settings/update-settings` | Implemented | `updateAdminMeetingSettings` in `features/admin-meetings/api/admin-meetings-api.ts` | Admin meeting settings save |
| 19 | Admin / Users | GET | `/admin/users` | Implemented | `fetchAdminUsers` in `features/admin-users/api/admin-users-api.ts` | Admin users list |
| 20 | Admin / Users | POST | `/admin/users/:id/toggle-block` | Implemented | `toggleAdminUserBlock` in `features/admin-users/api/admin-users-api.ts` | Admin user block toggle |
| 21 | Admin / Employees | GET | `/admin/employess` | Implemented | `fetchAdminEmployees` in `features/admin-employees/api/admin-employees-api.ts` | Admin employees list |
| 22 | Admin / Employees | POST | `/admin/employess` | Implemented | `createAdminEmployee` in `features/admin-employees/api/admin-employees-api.ts` | Employee create form |
| 23 | Admin / Employees | GET | `/admin/employess/:id` | Implemented | `fetchAdminEmployee` in `features/admin-employees/api/admin-employees-api.ts` | Employee edit detail |
| 24 | Admin / Employees | POST | `/admin/employess/:id` | Implemented | `updateAdminEmployee` in `features/admin-employees/api/admin-employees-api.ts` | Employee edit form |
| 25 | Admin / Employees | DELETE | `/admin/employess/:id` | Implemented | `deleteAdminEmployee` in `features/admin-employees/api/admin-employees-api.ts` | Employee delete action |
| 26 | Admin / Employees | POST | `/admin/employess/:id/toggle-block` | Implemented | `toggleAdminEmployeeBlock` in `features/admin-employees/api/admin-employees-api.ts` | Employee block toggle |
| 27 | Admin / Colors | GET | `/admin/colors` | Implemented | `fetchAdminColors` in `features/admin-colors/api/admin-colors-api.ts` | Admin colors list |
| 28 | Admin / Colors | POST | `/admin/colors` | Implemented | `createAdminColor` in `features/admin-colors/api/admin-colors-api.ts` | Admin color create form |
| 29 | Admin / Colors | GET | `/admin/colors/:id` | Implemented | `fetchAdminColor` in `features/admin-colors/api/admin-colors-api.ts` | Admin color edit loads fresh detail |
| 30 | Admin / Colors | POST | `/admin/colors/:id` | Implemented | `updateAdminColor` in `features/admin-colors/api/admin-colors-api.ts` | Admin color edit form |
| 31 | Admin / Colors | DELETE | `/admin/colors/:id` | Implemented | `deleteAdminColor` in `features/admin-colors/api/admin-colors-api.ts` | Admin color delete action |
| 32 | User / Auth | POST | `/user/auth/register` | Implemented | `signup` in `features/auth/hooks/use-signup.ts` | Signup form |
| 33 | User / Auth | POST | `/user/auth/login` | Implemented | `login` in `features/auth/hooks/use-login.ts` | Login form |
| 34 | User / Auth | POST | `/user/auth/logout` | Implemented | `logoutUser` in `features/auth/api/user-auth-api.ts` | User logout flow |
| 35 | User / Auth | DELETE | `/user/auth/delete-account` | Implemented | `deleteUserAccount` in `features/auth/api/user-auth-api.ts` | Delete account flow |
| 36 | User / Projects | GET | `/user/form-questions` | Implemented | `fetchFormQuestions` in `features/lead-project/api/lead-project-api.ts` | User project wizard |
| 37 | User / Projects | POST | `/user/store-projects` | Implemented | `storeProject` in `features/lead-project/api/lead-project-api.ts` | User project wizard submit |
| 38 | User / Projects | GET | `/user/my-projects` | Implemented | `fetchMyProjects` in `features/lead-project/api/lead-project-api.ts` | Profile/user projects list |
| 39 | User / Projects | GET | `/user/my-projects/:id` | Implemented | `fetchMyProject` in `features/lead-project/api/lead-project-api.ts` | Project detail page |
| 40 | User / Meetings | GET | `/user/meetings/availability` | Implemented | `fetchMeetingAvailability` in `features/meetings/api/user-meetings-api.ts` | Booking availability picker |
| 41 | User / Meetings | POST | `/user/meetings/book` | Implemented | `bookMeeting` in `features/meetings/api/user-meetings-api.ts` | Booking submit |
| 42 | User / Meetings | GET | `/user/meetings` | Implemented | `fetchUserMeetings` in `features/meetings/api/user-meetings-api.ts` | User meetings list |
| 43 | User / Meetings | POST | `/user/meetings/:id/cancel` | Implemented | `cancelUserMeeting` in `features/meetings/api/user-meetings-api.ts` | User cancel meeting action |
| 44 | User / Profile | GET | `/user/profile` | Implemented | `fetchUserProfile` in `features/profile/api/profile-api.ts` | Profile page |
| 45 | User / Profile | POST | `/user/profile` | Implemented | `updateUserProfile` in `features/profile/api/profile-api.ts` | Profile edit form |
| 46 | User / Public | GET | `/user/settings` | Implemented | `fetchUserSettings` in `features/settings/api/user-settings-api.ts` | Settings provider/public app |
| 47 | User / Public | GET | `/user/colors` | Implemented | `fetchUserColors` in `features/colors/api/user-colors-api.ts` | User color picker/public colors |
| 48 | general / More / Notifications | GET | `/notifications` | Implemented | `fetchNotifications` in `features/notifications/api/notifications-api.ts` | Notifications list |
| 49 | general / More / Notifications | POST | `/notifications/read-all` | Implemented | `markAllNotificationsRead` in `features/notifications/api/notifications-api.ts` | Notifications read-all action |
| 50 | general / More / Notifications | GET | `/notifications/unread` | Implemented | `fetchUnreadNotifications` in `features/notifications/api/notifications-api.ts` | Notification badge/sheet |
| 51 | general / More / Notifications | DELETE | `/notifications/:id` | Implemented | `deleteNotification` in `features/notifications/api/notifications-api.ts` | Delete one notification |
| 52 | general / More / Notifications | DELETE | `/notifications` | Implemented | `deleteAllNotifications` in `features/notifications/api/notifications-api.ts` | Delete all notifications |
| 53 | general / More / Notifications | POST | `/notifications/:id/read` | Implemented | `markNotificationRead` in `features/notifications/api/notifications-api.ts` | Mark notification read |
| 54 | general / More / PAGES | GET | `/user/pages/privacy-policy` | Implemented | `fetchPrivacyPolicy` in `features/pages/api/pages-api.ts` | Privacy pages |
| 55 | general / More / PAGES | GET | `/user/pages/terms-conditions` | Implemented | `fetchTermsConditions` in `features/pages/api/pages-api.ts` | Terms pages |
| 56 | general / More / PAGES | GET | `/user/pages/about-us` | Implemented | `fetchAboutUs` in `features/pages/api/pages-api.ts` | About pages |
| 57 | general | GET | `/user/countries` | Implemented | `fetchManagedCountries` in `features/settings/api/countries-api.ts` | Country selectors/settings |
