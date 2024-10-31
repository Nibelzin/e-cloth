import { Outlet } from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <>
      <Header />
      <div className="py-32 flex-1">
        <Outlet/>
      </div>
      <Footer/>
      <Toaster
      toastOptions={{
        style: {
          zIndex: 99999,
          border: "1px solid #e5e7eb"
        },
        position: "top-right"
      }}
      />
    </>
  )
}

export default App
