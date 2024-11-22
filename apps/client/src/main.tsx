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
import AdminDashboard from './pages/AdminDashboard.tsx'
import ProductManagement from './pages/ProductManagement.tsx'
import { Toaster } from 'react-hot-toast'

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
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout/>,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard/>
      },
      {
        path: "/admin/products",
        element: <ProductManagement/>
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
