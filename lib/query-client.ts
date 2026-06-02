import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { globalToast } from './toast-context';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      // Avoid showing global toast if the query explicitly tells us to skip it
      if (query.meta?.skipGlobalErrorToast === true) return;

      const message = error.message || 'An unexpected error occurred.';
      globalToast.error(message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any, _variables, _context, mutation) => {
      // Avoid showing global toast if the mutation explicitly tells us to skip it
      if (mutation.meta?.skipGlobalErrorToast === true) return;

      const message = error.message || 'Action execution failed.';
      globalToast.error(message);
    },
  }),
});

export default queryClient;
