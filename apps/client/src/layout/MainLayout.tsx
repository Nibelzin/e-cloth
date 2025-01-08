import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"

function MainLayout() {

  return (
    <>
        <Header />
        <div className="py-32 flex-1">
          <Outlet />
        </div>
        <Footer />
    </>
  )
}

export default MainLayout
