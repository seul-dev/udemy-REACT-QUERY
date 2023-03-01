import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Posts } from './Posts';
import './App.css';

export const queryClient = new QueryClient();
function App() {
  return (
    // provide React Query client to App
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />
      <div className='App'>
        <h1>Blog Posts</h1>
        <Posts />
      </div>
    </QueryClientProvider>
  );
}

export default App;
