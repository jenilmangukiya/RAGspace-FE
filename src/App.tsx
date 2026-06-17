import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './providers/AuthProvider';
import { Toaster } from 'sonner';
import router from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster theme="dark" position="top-right" closeButton richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
