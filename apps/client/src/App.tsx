import Footer from "./components/Footer"
import Header from "./components/Header"
import Home from "./pages/Home"
import ProductDetail from "./pages/ProductDetail"

function App() {

  return (
    <>
      <Header />
      <div className="py-32 flex-1">
        <ProductDetail/>
      </div>
      <Footer/>

    </>
  )
}

export default App
