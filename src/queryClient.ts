import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
      retryDelay: 500,
      retry: false,
      refetchInterval: 60000, // 1 minute
      refetchIntervalInBackground: true,
    },
  },
});

export default queryClient;
