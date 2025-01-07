import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Cart from './pages/Cart.tsx'
import ProductDetail from './pages/ProductDetail.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { ptBR } from '@clerk/localizations'
import MainLayout from './layout/MainLayout.tsx'
import AdminLayout from './layout/AdminLayout.tsx'
import { Toaster } from 'react-hot-toast'
import UsersManagement from './pages/admin/UsersManagement.tsx'
import ProductManagement from './pages/admin/ProductManagement.tsx'
import AdminDashboard from './pages/admin/AdminDashboard.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CategoryPage from './pages/CategoryPage.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/product/:id",
        element: <ProductDetail />
      },
      {
        path: "/category/:category",
        element: <CategoryPage />
      },
      {
        path: "/search/:term",
        element: <Home />
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />
      },
      {
        path: "/admin/products",
        element: <ProductManagement />
      },
      {
        path: "/admin/users",
        element: <UsersManagement />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        variables: {
          borderRadius: "0.125rem"
        },
        layout: {
          shimmer: false,
          animations: false
        },
        elements: {
          userButtonTrigger: "focus:shadow-none",
          modalBackdrop: "z-40"
        }
      }}
      localization={ptBR}>
        <RouterProvider router={router} />
    </ClerkProvider>
    <Toaster
      toastOptions={{
        style: {
          zIndex: 99999,
          border: "1px solid #e5e7eb"
        },
        position: "top-right"
      }}
    />
  </StrictMode>,
)
