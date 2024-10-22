import { FaMagnifyingGlass } from "react-icons/fa6";
import { HiMenu, HiOutlineSearch } from "react-icons/hi";
import { HiChevronRight, HiOutlineShoppingBag, HiOutlineUserCircle } from "react-icons/hi2";
import CategoryBar from "./CategoryBar";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const categoriesMock = [
    "Todos os Produtos",
    "Camisetas",
    "Calças",
    "Bonés"
]


const Header = () => {
    const [openSearchBar, setOpenSearchBar] = useState(false)
    const [openMenuSheet, setOpenMenuSheet] = useState(false)
    const [detectClickOustide, setdetectClickOustide] = useState(false)

    const searchRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()


    const handleSearchBarButtonClick = () => {
        setOpenSearchBar(!openSearchBar)
        if (openMenuSheet) {
            setOpenMenuSheet(false)
        }
        if (openSearchBar === false && searchRef.current) {
            searchRef.current.focus();
        }
    }

    const handleMenuButtonClick = () => {
        setOpenMenuSheet(!openMenuSheet)
        if (openSearchBar) {
            setOpenSearchBar(false)
        }
    }

    const handleResize = () => {
        setOpenMenuSheet(false)
        setOpenSearchBar(false)
    }

    const handleRedirect = (page: string) => {
        setOpenMenuSheet(false)
        setOpenSearchBar(false)
        navigate(page)
    }

    useEffect(() => {
        if (openMenuSheet) {
            setdetectClickOustide(true);
        } else {

            const timeout = setTimeout(() => {
                setdetectClickOustide(false);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [openMenuSheet]);

    useEffect(() => {
        window.addEventListener('resize', handleResize)
    }, [])


    return (
        <>
            <header className={`w-full  fixed top-0 z-30 bg-white transition-transform ${!openSearchBar && "border-b"}`}>
                <div className="h-16 flex items-center justify-between px-6 md:px-16 lg:px-32 xl:px-64 py-4">
                    <div className="flex gap-4 items-center">
                        <button className="lg:hidden hover:bg-neutral-100 p-2 rounded-sm transition-colors" onClick={handleMenuButtonClick}>
                            <HiMenu size={30} />
                        </button>
                        <button onClick={() => handleRedirect("/")}>
                            <img src="/logo-icon.svg" alt="E-Cloth Logo" className="cursor-pointer md:hidden" />
                            <img src="/logo-text.svg" alt="E-Cloth Logo" className="cursor-pointer hidden md:block" />
                        </button>
                    </div>
                    <div className="flex items-center gap-12">
                        <div className="hidden bg-gray-200 px-4 lg:flex gap-2 w-64 items-center">
                            <div>
                                <FaMagnifyingGlass size={15} className="text-gray-500" />
                            </div>
                            <input type="text" className="bg-gray-200 p-2 font-semibold focus:outline-none focus:ring-0" placeholder="O que você deseja?" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="hidden gap-2 items-center lg:flex ">
                                <p className="font-semibold">Olá, Luan</p>
                                <HiOutlineUserCircle size={30} />
                            </button>
                            <button className="lg:hidden hover:bg-neutral-100 p-2 rounded-sm transition-colors" onClick={handleSearchBarButtonClick}>
                                <HiOutlineSearch size={25} />
                            </button>
                            <button className="hover:bg-neutral-100 p-2 rounded-sm transition-colors" onClick={() => handleRedirect("/cart")}>
                                <HiOutlineShoppingBag size={28} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <div className="lg:hidden">
                <div className={`px-6 md:px-16 lg:px-32 py-4 fixed mt-16 bg-white w-full border-b transition-transform z-10 ${openSearchBar ? "translate-y-0" : "-translate-y-full"}`}>
                    <div className=" bg-gray-200 px-4 flex gap-2 items-center">
                        <div>
                            <FaMagnifyingGlass size={15} className="text-gray-500" />
                        </div>
                        <input ref={searchRef} type="text" className="bg-gray-200 p-2 w-full font-semibold focus:outline-none focus:ring-0" placeholder="O que você deseja?" />
                    </div>
                </div>
                <div className={`fixed h-full w-full ${openSearchBar ? "visible" : "invisible"}`} onClick={() => setOpenSearchBar(false)}>
                </div>
            </div>
            <CategoryBar categories={categoriesMock} />
            <nav>
                <div className={`h-full fixed bg-white w-5/6 border-r z-20 py-16 transition-transform ${openMenuSheet ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4">
                        <button className="flex gap-4 hover:bg-neutral-100 px-2 py-4 w-full rounded-sm transition-colors">
                            <HiOutlineUserCircle size={50} />
                            <div className="text-left">
                                <p className="font-semibold text-2xl">Luan Santos</p>
                                <p className="text-sm font-semibold text-neutral-700">Meu perfil</p>
                            </div>
                        </button>
                        <hr className="my-4" />
                        <div className="flex flex-col">
                            {categoriesMock.map(category => (
                                <a href="" className="font-medium p-2 hover:bg-neutral-100 transition-colors flex items-center justify-between">
                                    <p>{category}</p>
                                    <HiChevronRight />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={`fixed h-full w-full bg-black z-10 transition-opacity 
                    ${openMenuSheet ? "opacity-10" : "opacity-0"}
                    ${detectClickOustide ? "visible" : "invisible"}
                    `} onClick={() => setOpenMenuSheet(false)}>
                </div>
            </nav>
        </>
    );
}

export default Header;