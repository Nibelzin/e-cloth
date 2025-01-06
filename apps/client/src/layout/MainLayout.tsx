import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

function MainLayout() {

  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="py-32 flex-1">
          <Outlet />
        </div>
        <Footer />
      </QueryClientProvider>
    </>
  )
}

export default MainLayout
