export const leadProjectKeys = {
  all: ['lead-project'] as const,
  myProjectsRoot: ['lead-project', 'my-projects'] as const,
  myProjects: (language: string) => ['lead-project', 'my-projects', language] as const,
  myProject: (id: number | string | undefined, language: string) =>
    ['lead-project', 'my-projects', id, language] as const,
};
