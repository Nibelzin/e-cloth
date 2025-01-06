import { FaMagnifyingGlass } from "react-icons/fa6";
import { HiMenu, HiOutlineDotsHorizontal, HiOutlineSearch } from "react-icons/hi";
import { HiChevronRight, HiOutlineShoppingBag } from "react-icons/hi2";
import CategoryBar from "./CategoryBar";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import AdditionalInfo from "./AdditionalInfo";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categoryService";

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

    const cartItems = useCartStore((state) => state.cart)
    const numOfCartItems = cartItems.reduce((quantity, product) => quantity += product.quantity, 0)

    const searchRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const { isPending, data, error } = useQuery({
        queryKey: ['category'],
        queryFn: () => getCategories(),
        placeholderData: keepPreviousData
    })

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
            <header className={`w-full  fixed top-0 z-30 bg-white ${!openSearchBar && "border-b"}`}>
                <div className="h-16 flex items-center justify-between px-4 md:px-16 lg:px-32 xl:px-44 py-4">
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
                        <div className="hidden bg-gray-200 rounded-full px-4 lg:flex gap-2 w-48 items-center overflow-hidden">
                            <div>
                                <FaMagnifyingGlass size={15} className="text-gray-500" />
                            </div>
                            <input type="text" className="bg-transparent p-2 font-semibold focus:outline-none focus:ring-0" placeholder="Pesquisar" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden lg:block">
                                <SignedOut>
                                    <SignInButton>
                                        <button className=" p-2 hover:bg-neutral-100 rounded-sm transition-colors h-10">
                                            <p className="text-sm font-semibold">Fazer Login</p>
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <UserButton showName >
                                        <UserButton.UserProfilePage label="Informações Adicionais" url="custom" labelIcon={<HiOutlineDotsHorizontal />}>
                                            <AdditionalInfo />
                                        </UserButton.UserProfilePage>
                                    </UserButton>
                                </SignedIn>
                            </div>
                            <button className="lg:hidden hover:bg-neutral-100 p-2 rounded-sm transition-colors" onClick={handleSearchBarButtonClick}>
                                <HiOutlineSearch size={25} />
                            </button>
                            <button className="hover:bg-neutral-100 p-2 rounded-sm transition-colors" onClick={() => handleRedirect("/cart")}>
                                <div className="relative">
                                    <HiOutlineShoppingBag size={28} />
                                    {numOfCartItems > 0 && (
                                        <div className="absolute -top-1 -right-1 rounded-full bg-red-400 w-4 h-4 flex items-center justify-center outline outline-1 outline-white">
                                            <p className="text-white text-xs">{numOfCartItems}</p>
                                        </div>
                                    )}
                                </div>
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
            <CategoryBar categories={data?.categories} isPending={isPending} />
            <nav>
                <div className={`h-full fixed bg-white w-5/6 border-r z-20 py-16 transition-transform ${openMenuSheet ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4">
                        <SignedOut>
                            <SignInButton>
                                <button className="p-2 hover:bg-neutral-100 rounded-sm transition-colors text-left w-full">
                                    <p className="font-semibold">Fazer Login</p>
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="flex w-full hover:bg-neutral-100 transition-colors p-2 rounded-sm">
                                <UserButton showName appearance={{
                                    elements: {
                                        rootBox: "w-full justify-start",
                                        userButtonTrigger: "w-full justify-start",
                                        avatarBox: "w-20 h-20 hover:bg-neutral-100",
                                        userButtonBox: "flex-row-reverse",
                                        userButtonOuterIdentifier: "text-xl sont-sans font-semibold",
                                        userPreview: "hidden",
                                        userButtonPopoverActions: "border-none"
                                    },
                                    layout: {

                                    }
                                }}>
                                    <UserButton.UserProfilePage label="Informações Adicionais" url="custom" labelIcon={<HiOutlineDotsHorizontal />}>
                                        <AdditionalInfo />
                                    </UserButton.UserProfilePage>
                                </UserButton>
                            </div>
                        </SignedIn>
                        <hr className="my-4" />
                        <div className="flex flex-col">
                            {categoriesMock.map(category => (
                                <a href="" key={category} className="font-medium p-2 hover:bg-neutral-100 transition-colors rounded-sm flex items-center justify-between">
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