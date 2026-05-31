"use client";

export const PERMISSION_GROUPS = [
  {
    label: 'Leads',
    permissions: [
      ['leads.view', 'View leads'],
      ['leads.review', 'Review leads'],
      ['leads.approve', 'Approve leads'],
      ['leads.reject', 'Reject leads'],
      ['leads.delete', 'Delete leads'],
    ],
  },
  {
    label: 'Project Wizard',
    permissions: [
      ['project_types.manage', 'Manage project types'],
      ['lead_questions.manage', 'Manage project questions'],
    ],
  },
  {
    label: 'Appointments',
    permissions: [
      ['appointments.view', 'View appointments'],
      ['appointments.accept', 'Accept appointments'],
      ['appointments.reject', 'Reject appointments'],
      ['appointments.settings', 'Manage settings'],
      ['appointments.availability', 'Manage availability'],
    ],
  },
  {
    label: 'Projects',
    permissions: [
      ['projects.view', 'View projects'],
      ['projects.edit_basic', 'Edit basic project data'],
      ['projects.plan_stages', 'Plan stages'],
      ['projects.assign_stage', 'Assign stages'],
      ['projects.update_progress', 'Update progress'],
      ['projects.manage_reports', 'Manage reports'],
      ['projects.send_reports', 'Send reports'],
      ['projects.manage_files', 'Manage files'],
      ['projects.manage_internal_notes', 'Manage internal notes'],
      ['projects.complete', 'Complete projects'],
      ['portfolio.manage', 'Manage portfolio'],
    ],
  },
  {
    label: 'Administration',
    permissions: [
      ['users.view', 'View users'],
      ['employees.manage', 'Manage employees'],
      ['roles.manage', 'Manage roles'],
      ['notifications.send', 'Send notifications'],
      ['chat.manage', 'Manage chat'],
    ],
  },
  {
    label: 'Website Content',
    permissions: [
      ['website.view', 'View website content'],
      ['website.homepage.manage', 'Manage homepage content'],
      ['website.services.manage', 'Manage services'],
      ['website.apps.manage', 'Manage apps and case studies'],
      ['website.blog.manage', 'Manage blog posts'],
      ['website.steps.manage', 'Manage process steps'],
      ['website.faqs.manage', 'Manage FAQs'],
      ['website.pricing.manage', 'Manage pricing'],
      ['website.testimonials.manage', 'Manage testimonials'],
      ['website.partners.manage', 'Manage partners'],
      ['website.team.manage', 'Manage team'],
      ['website.careers.manage', 'Manage careers'],
      ['website.legal.manage', 'Manage legal pages'],
      ['website.settings.manage', 'Manage website settings'],
      ['website.publish', 'Publish website content'],
    ],
  },
] as const;

export const PERMISSIONS_LIST = PERMISSION_GROUPS.flatMap((group) =>
  group.permissions.map((permission) => permission[0])
);

export function hasPermission(permissions: string[] | undefined, permission: string) {
  return Boolean(permissions?.includes(permission) || permissions?.includes('*'));
}
