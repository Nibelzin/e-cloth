import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Cart from './pages/Cart.tsx'
import ProductDetail from './pages/ProductDetail.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { ptBR } from '@clerk/localizations'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY} 
    afterSignOutUrl="/" 
    appearance={{
      variables: {
        borderRadius: "0px"
      },
      layout: {
        shimmer: false
      },
      elements: {
        userButtonTrigger: "focus:shadow-none"
      }
    }}
    localization={ptBR}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)
