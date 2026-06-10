/**
 * Backend feature availability flags.
 *
 * Set a flag to `true` once the corresponding Laravel API route is implemented
 * and tested. The UI automatically shows/hides related controls based on these
 * flags. Chat and the notification system are always enabled regardless of any
 * flag here.
 */
export const FEATURES = {
  /** Portfolio/showcase projects management (/admin/projects) */
  portfolioProjects: false,

  /** Admin live-chat dashboard (/admin/live-chat) */
  adminLiveChat: false,

  /** Roles & permissions management (/admin/roles) */
  rolesManagement: false,

  /** Full website CMS section (/admin/website/*) */
  websiteManagement: false,

  /** Landing page content management (/admin/landing-page) */
  landingPageManagement: true,

  /** Deleting registered user accounts */
  userDeletion: false,

  /** Internal (admin-only) notes on project stages */
  projectInternalNotes: false,

  /** Final project completion approval workflow */
  projectCompletionApproval: false,
} as const;

export type FeatureKey = keyof typeof FEATURES;

/** Returns true when the feature is enabled in the backend. */
export function isFeatureEnabled(key: FeatureKey): boolean {
  return FEATURES[key];
}
