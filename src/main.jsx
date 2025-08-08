import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
})

// Custom toast style
const toasterConfig = {
  position: 'top-right',
  toastOptions: {
    duration: 4000,
    style: {
      background: '#111111',
      color: '#FFFFFF',
      border: '1px solid #333333',
    },
    success: {
      iconTheme: {
        primary: '#FFD700',
        secondary: '#000000',
      },
    },
    error: {
      iconTheme: {
        primary: '#DC2626',
        secondary: '#FFFFFF',
      },
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <App />
          <Toaster {...toasterConfig} />
          <ReactQueryDevtools initialIsOpen={false} />
        </HelmetProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)