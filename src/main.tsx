import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThirdwebProvider } from 'thirdweb/react';

import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          <App />
        </ThirdwebProvider>
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
