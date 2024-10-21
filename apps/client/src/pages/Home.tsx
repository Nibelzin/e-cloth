import ProductCard from "../components/ProductCard";


const Home = () => {
    return ( 
            <div className="px-6 md:px-16 lg:px-32 xl:px-64 py-16">
            <h1 className="text-2xl font-bold">20 Produtos</h1>
            <ProductCard/>
            </div>
     );
}
 
export default Home;