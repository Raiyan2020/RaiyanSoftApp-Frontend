import { apiService, ApiResponse, getApiBaseUrl } from '@/lib/api-service';
import { ApiSocialMediaItem, UserSettings } from '../types/user-settings.types';

type ApiUserSettings = Omit<UserSettings, 'social_media'> & {
  social_media?: ApiSocialMediaItem[] | UserSettings['social_media'] | null;
};

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

function normalizeSocialMedia(value: ApiUserSettings['social_media']): UserSettings['social_media'] {
  if (!value) return {};
  if (!Array.isArray(value)) return value;

  return value.reduce<UserSettings['social_media']>((links, item) => {
    if (item.platform && item.link) {
      links[item.platform.toLowerCase()] = item.link;
    }
    return links;
  }, {});
}

function normalizeUserSettings(settings: ApiUserSettings): UserSettings {
  return {
    ...settings,
    social_media: normalizeSocialMedia(settings.social_media),
  };
}

export async function fetchUserSettings() {
  const response = await apiService.get<ApiUserSettings>('user/settings', {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return normalizeUserSettings(response.data);
}

export async function fetchUserSettingsServer() {
  const response = await fetch(`${getApiBaseUrl()}/user/settings`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  const data = (await response.json()) as ApiResponse<ApiUserSettings>;

  if (!data.status || !data.data) {
    throw new Error(getApiErrorMessage(data));
  }

  return normalizeUserSettings(data.data);
}
