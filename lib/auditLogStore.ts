"use client";

export type AuditEntityType =
  | 'lead'
  | 'appointment'
  | 'project'
  | 'stage'
  | 'report'
  | 'attachment'
  | 'note'
  | 'role'
  | 'user'
  | 'website_content';

export interface AuditLogPayload {
  entityType: AuditEntityType;
  entityId: string;
  action: string;
  reason?: string;
  oldValue?: unknown;
  newValue?: unknown;
  projectId?: string;
  ownerId?: string;
}

export async function createAuditLog(_payload: AuditLogPayload) {
  throw new Error('Client-side audit logging is disabled. Create audit logs through Laravel.');
}

export async function createAuditLogSafe(payload: AuditLogPayload) {
  try {
    await createAuditLog(payload);
  } catch (error) {
    console.warn('Audit log skipped:', error);
  }
}
