"use client";

import { NotificationType } from './notificationStore';

export interface ServiceNotificationPayload {
  userId: string;
  type?: NotificationType;
  title: string;
  message: string;
  projectId?: string;
  deepLink?: string;
}

export async function createServiceNotification(_payload: ServiceNotificationPayload) {
  throw new Error('Client-side service notifications are disabled. Send notifications through Laravel.');
}

export async function createServiceNotificationSafe(payload: ServiceNotificationPayload) {
  try {
    await createServiceNotification(payload);
  } catch (error) {
    console.warn('Service notification skipped:', error);
  }
}
