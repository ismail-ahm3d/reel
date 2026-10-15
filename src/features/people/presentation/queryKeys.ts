/** Every query key of the feature, built here and nowhere else. */
export const peopleKeys = {
  all: ['people'] as const,
  person: (id: number) => ['people', 'person', id] as const,
};
