export const adminCountriesKeys = {
  all: ['admin-countries'] as const,
  detail: (id: number | string) => [...adminCountriesKeys.all, id] as const,
};
